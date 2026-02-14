import {initializeApp, cert, getApps} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import {join} from 'path';

dotenv.config();

// Determine base path for the report
const REPORT_PATH = join(process.cwd(), '..', 'DATA_REPORT.md');

// Helper to recursively serialize data (convert Timestamps to ISO strings)
function serializeData(data: unknown): unknown {
  if (data === null || data === undefined) return data;

  if (
    typeof data === 'object' &&
    'toDate' in data &&
    typeof (data as {toDate: unknown}).toDate === 'function'
  ) {
    return (data as {toDate: () => Date}).toDate().toISOString();
  }

  if (Array.isArray(data)) return data.map(serializeData);

  if (typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([key, value]) => [
        key,
        serializeData(value),
      ]),
    );
  }
  return data;
}

async function exportData() {
  console.log('Starting data export...');

  // Initialize Admin SDK
  // In GitHub Actions, we'll use an environment variable for the service account key
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : null;

  if (!serviceAccount && process.env.NODE_ENV === 'production') {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is required in production');
  }

  if (getApps().length === 0) {
    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      // Fallback for local testing if env is not set (will fail if not authenticated)
      console.warn('No service account found, attempting to use default credentials...');
      initializeApp();
    }
  }

  const db = getFirestore();
  const reportLines: string[] = [];

  reportLines.push('# Weekly Data Report');
  reportLines.push(`Generated at: ${new Date().toISOString()}\n`);

  // 1. Visitors
  reportLines.push('## Recent Visitors (visitorsV2)');
  const visitorsSnapshot = await db
    .collection('visitorsV2')
    .orderBy('timestamp', 'desc')
    .limit(50)
    .get();

  const seenVisitorIds = new Set<string>();
  const visitorRows: string[] = [];
  const platformStats: Record<string, number> = {};
  const languageStats: Record<string, number> = {};
  const visitorsData: Record<string, unknown>[] = [];

  if (visitorsSnapshot.empty) {
    reportLines.push('No visitor data found.\n');
  } else {
    visitorsSnapshot.forEach((doc) => {
      const data = doc.data();
      const ts = data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp;
      const isUnique = !seenVisitorIds.has(data.visitorId);
      seenVisitorIds.add(data.visitorId);

      // Accumulate stats
      const p = data.platform || 'Unknown';
      const l = data.language || 'Unknown';
      platformStats[p] = (platformStats[p] || 0) + 1;
      languageStats[l] = (languageStats[l] || 0) + 1;

      visitorRows.push(
        `| ${ts} | ${data.visitorId} | ${p} | ${l} | ${data.screenResolution} | ${isUnique ? '✅' : '—'} |`,
      );

      visitorsData.push({
        ...data,
        timestamp: ts,
        isUnique,
      });
    });

    reportLines.push(`**Total Unique Visitors (in this sample): ${seenVisitorIds.size}**\n`);

    // Added Visualizations
    reportLines.push('### Visualizations');
    reportLines.push('#### Platform Distribution');
    reportLines.push('```mermaid');
    reportLines.push('pie title Platforms');
    Object.entries(platformStats).forEach(([name, count]) => {
      reportLines.push(`    "${name}" : ${count}`);
    });
    reportLines.push('```\n');

    reportLines.push('#### Language Distribution');
    reportLines.push('```mermaid');
    reportLines.push('pie title Languages');
    Object.entries(languageStats).forEach(([name, count]) => {
      reportLines.push(`    "${name}" : ${count}`);
    });
    reportLines.push('```\n');

    reportLines.push('| Timestamp | Visitor ID | Platform | Language | Screen | Unique? |');
    reportLines.push('| --- | --- | --- | --- | --- | --- |');
    reportLines.push(...visitorRows);
    reportLines.push('');
  }

  // 2. Navigation Events
  reportLines.push('## Recent Navigation Events (navigation_events)');
  const navSnapshot = await db
    .collection('navigation_events')
    .orderBy('timestamp', 'desc')
    .limit(50)
    .get();

  const navData: Record<string, unknown>[] = [];

  if (navSnapshot.empty) {
    reportLines.push('No navigation events found.\n');
  } else {
    reportLines.push('| Timestamp | Visitor ID | Text | Href |');
    reportLines.push('| --- | --- | --- | --- |');
    navSnapshot.forEach((doc) => {
      const data = doc.data();
      const ts = data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp;
      reportLines.push(`| ${ts} | ${data.visitorId} | ${data.navText} | ${data.navHref} |`);
      navData.push({...data, timestamp: ts});
    });
    reportLines.push('');
  }

  // 3. GPS Locations
  reportLines.push('## Saved GPS Locations (savedgps)');
  const gpsSnapshot = await db.collection('savedgps').orderBy('timestamp', 'desc').limit(50).get();

  const gpsData: Record<string, unknown>[] = [];

  if (gpsSnapshot.empty) {
    reportLines.push('No GPS data found.\n');
  } else {
    reportLines.push('| Timestamp | Lat | Lon | Event |');
    reportLines.push('| --- | --- | --- | --- |');
    gpsSnapshot.forEach((doc) => {
      const data = doc.data();
      // timestamp in savedgps is ISO string in Nav.svelte but might be Timestamp if added elsewhere
      const ts = data.timestamp;
      reportLines.push(`| ${ts} | ${data.lat} | ${data.lon} | ${data.event || 'N/A'} |`);
      gpsData.push({...data, timestamp: ts});
    });
    reportLines.push('');
  }

  // Write Markdown Report
  fs.writeFileSync(REPORT_PATH, reportLines.join('\n'));
  console.log(`Report successfully written to ${REPORT_PATH}`);

  // Write JSON Data
  const jsonData = {
    generatedAt: new Date().toISOString(),
    visitors: visitorsData.map(serializeData),
    navigation: navData.map(serializeData),
    gps: gpsData.map(serializeData),
    stats: {
      platform: platformStats,
      language: languageStats,
      uniqueVisitors: seenVisitorIds.size,
    },
  };
  const JSON_PATH = join(process.cwd(), '..', 'visitors.json');
  fs.writeFileSync(JSON_PATH, JSON.stringify(jsonData, null, 2));
  console.log(`JSON data successfully written to ${JSON_PATH}`);

  // Generate HTML Visualization
  const HTML_PATH = join(process.cwd(), '..', 'visitors.html');
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weekly Visitor Report</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 20px; background: #f0f2f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
        h1, h2 { color: #1a1a1a; }
        #map { height: 500px; width: 100%; border-radius: 8px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .stat-card { text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .stat-number { font-size: 2em; font-weight: bold; color: #007bff; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; vertical-align: top; }
        th { background-color: #f8f9fa; }
        .details-btn { background: #007bff; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
        .details-btn:hover { background: #0056b3; }
        .details-row { display: none; background: #f8f9fa; }
        .json-pre { white-space: pre-wrap; word-wrap: break-word; font-family: monospace; font-size: 0.9em; max-height: 300px; overflow-y: auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Weekly Visitor Report</h1>
        <p>Generated at: ${jsonData.generatedAt}</p>

        <div class="stats-grid">
            <div class="card">
                <h3>Unique Visitors</h3>
                <div class="stat-number">${jsonData.stats.uniqueVisitors}</div>
            </div>
            <div class="card">
                <h3>Total Pageviews</h3>
                <div class="stat-number">${jsonData.visitors.length}</div>
            </div>
            <div class="card">
                <h3>GPS Locations</h3>
                <div class="stat-number">${jsonData.gps.length}</div>
            </div>
        </div>

        <div class="card">
            <h2>Visitor Map (GPS)</h2>
            <div id="map"></div>
        </div>

        <div class="stats-grid">
            <div class="card">
                <h2>Platform Distribution</h2>
                <canvas id="platformChart"></canvas>
            </div>
            <div class="card">
                <h2>Language Distribution</h2>
                <canvas id="languageChart"></canvas>
            </div>
        </div>

        <div class="card">
            <h2>Recent Visitors Table</h2>
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Visitor ID</th>
                            <th>Platform</th>
                            <th>Screen</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="visitorTableBody"></tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        const data = ${JSON.stringify(jsonData)};

        // Initialize Map
        const map = L.map('map').setView([60.2, 24.6], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        if (data.gps && data.gps.length > 0) {
            const bounds = L.latLngBounds();
            data.gps.forEach(point => {
                if (point.lat && point.lon) {
                    const marker = L.marker([point.lat, point.lon])
                        .addTo(map)
                        .bindPopup(\`<b>\${point.event}</b><br>\${point.timestamp}\`);
                    bounds.extend(marker.getLatLng());
                }
            });
            if (bounds.isValid()) {
                map.fitBounds(bounds);
            }
        }

        // Charts
        const ctxPlatform = document.getElementById('platformChart').getContext('2d');
        new Chart(ctxPlatform, {
            type: 'pie',
            data: {
                labels: Object.keys(data.stats.platform),
                datasets: [{
                    data: Object.values(data.stats.platform),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
                }]
            }
        });

        const ctxLanguage = document.getElementById('languageChart').getContext('2d');
        new Chart(ctxLanguage, {
            type: 'pie',
            data: {
                labels: Object.keys(data.stats.language),
                datasets: [{
                    data: Object.values(data.stats.language),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
                }]
            }
        });

        // Visitor Table
        const tbody = document.getElementById('visitorTableBody');

        function toggleDetails(index) {
            const row = document.getElementById('details-' + index);
            if (row.style.display === 'table-row') {
                row.style.display = 'none';
            } else {
                row.style.display = 'table-row';
            }
        }

        data.visitors.slice(0, 50).forEach((v, index) => {
            const row = tbody.insertRow();
            row.innerHTML = \`
                <td>\${new Date(v.timestamp).toLocaleString()}</td>
                <td>\${v.visitorId}</td>
                <td>\${v.platform}</td>
                <td>\${v.screenResolution}</td>
                <td><button class="details-btn" onclick="toggleDetails(\${index})">Details</button></td>
            \`;

            const detailsRow = tbody.insertRow();
            detailsRow.id = 'details-' + index;
            detailsRow.className = 'details-row';
            detailsRow.innerHTML = \`
                <td colspan="5">
                    <div class="json-pre">\${JSON.stringify(v, null, 2)}</div>
                </td>
            \`;
        });
    </script>
</body>
</html>
  `;
  fs.writeFileSync(HTML_PATH, htmlContent);
  console.log(`HTML visualization successfully written to ${HTML_PATH}`);
}

exportData().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});
