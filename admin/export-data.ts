import {initializeApp, cert, getApps} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import {join} from 'path';

dotenv.config();

// Determine base path for the report
const REPORT_PATH = join(process.cwd(), '..', 'DATA_REPORT.md');

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
  if (visitorsSnapshot.empty) {
    reportLines.push('No visitor data found.\n');
  } else {
    reportLines.push('| Timestamp | Visitor ID | Platform | Language | Screen |');
    reportLines.push('| --- | --- | --- | --- | --- |');
    visitorsSnapshot.forEach((doc) => {
      const data = doc.data();
      const ts = data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp;
      reportLines.push(
        `| ${ts} | ${data.visitorId} | ${data.platform} | ${data.language} | ${data.screenResolution} |`,
      );
    });
    reportLines.push('');
  }

  // 2. Navigation Events
  reportLines.push('## Recent Navigation Events (navigation_events)');
  const navSnapshot = await db
    .collection('navigation_events')
    .orderBy('timestamp', 'desc')
    .limit(50)
    .get();
  if (navSnapshot.empty) {
    reportLines.push('No navigation events found.\n');
  } else {
    reportLines.push('| Timestamp | Visitor ID | Text | Href |');
    reportLines.push('| --- | --- | --- | --- |');
    navSnapshot.forEach((doc) => {
      const data = doc.data();
      const ts = data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : data.timestamp;
      reportLines.push(`| ${ts} | ${data.visitorId} | ${data.navText} | ${data.navHref} |`);
    });
    reportLines.push('');
  }

  // 3. GPS Locations
  reportLines.push('## Saved GPS Locations (savedgps)');
  const gpsSnapshot = await db.collection('savedgps').orderBy('timestamp', 'desc').limit(50).get();
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
    });
    reportLines.push('');
  }

  fs.writeFileSync(REPORT_PATH, reportLines.join('\n'));
  console.log(`Report successfully written to ${REPORT_PATH}`);
}

exportData().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});
