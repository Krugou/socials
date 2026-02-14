import {collection, addDoc, type DocumentReference} from 'firebase/firestore';
import {db} from './firebase.js';
import {NavigationEventLogError} from './types/navigation.js';
import type {NavigationEventLog} from './types/navigation.js';

interface VisitorLog {
  visitorId: string;
  timestamp: Date;
  userAgent: string;
  returningVisitor: boolean;
  visitCount: number;
  referrer: string;
  screenResolution: string;
  language: string;
  platform: string;
  deviceMemory: number | null;
  hardwareConcurrency: number;
  connection: {
    type: string | null;
    effectiveType: string | null;
    downlink: number | null;
    rtt: number | null;
  };
  timeZone: string;
  preferences: {
    colorScheme: string;
    reducedMotion: boolean;
  };
  performance: {
    navigationStart: number;
    loadTime: number | null;
    memoryUsage: number | null;
  };
}

const VISITOR_ID_KEY = 'visitor_id';
const VISIT_COUNT_KEY = 'visit_count';
const LAST_VISIT_KEY = 'last_visit';
const MIN_LOG_INTERVAL = 1000 * 60 * 30; // 30 minutes

interface NetworkInformation {
  type?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

interface ExtendedNavigator extends Navigator {
  connection?: NetworkInformation;
  deviceMemory?: number;
}

interface ExtendedPerformance extends Performance {
  memory?: {
    usedJSHeapSize?: number;
  };
}

export class VisitorTracker {
  private visitorId: string;
  private visitCount: number;

  constructor() {
    this.visitorId = localStorage.getItem(VISITOR_ID_KEY) || this.generateVisitorId();
    this.visitCount = Number(localStorage.getItem(VISIT_COUNT_KEY)) || 0;
  }

  private generateVisitorId(): string {
    const id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
    return id;
  }

  private incrementVisitCount(): number {
    this.visitCount += 1;
    localStorage.setItem(VISIT_COUNT_KEY, this.visitCount.toString());
    return this.visitCount;
  }

  private canLogVisit(): boolean {
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
    const now = Date.now();

    if (!lastVisit) return true;

    return now - Number(lastVisit) >= MIN_LOG_INTERVAL;
  }

  private updateLastVisitTime(): void {
    localStorage.setItem(LAST_VISIT_KEY, Date.now().toString());
  }

  private getConnectionInfo() {
    const connection = (navigator as ExtendedNavigator).connection;
    return {
      type: connection?.type || null,
      effectiveType: connection?.effectiveType || null,
      downlink: connection?.downlink || null,
      rtt: connection?.rtt || null,
    };
  }

  private getPreferences() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return {
      colorScheme: isDarkMode ? 'dark' : 'light',
      reducedMotion: prefersReducedMotion,
    };
  }

  private getPerformanceInfo() {
    const perf = window.performance;
    const memory = (performance as ExtendedPerformance).memory;
    const navStart = perf.timing?.navigationStart || perf.timeOrigin;
    return {
      navigationStart: navStart,
      loadTime: document.readyState === 'complete' ? Date.now() - navStart : null,
      memoryUsage: memory?.usedJSHeapSize || null,
    };
  }

  async logVisit(): Promise<DocumentReference<VisitorLog> | null> {
    try {
      if (!this.canLogVisit()) {
        console.debug('Skipping visitor log due to rate limiting');
        return null;
      }

      const isReturningVisitor = this.visitCount > 0;
      const visitCount = this.incrementVisitCount();

      const visitorLog: VisitorLog = {
        visitorId: this.visitorId,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        returningVisitor: isReturningVisitor,
        visitCount,
        referrer: document.referrer || 'direct',
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        platform: navigator.platform,
        deviceMemory: (navigator as ExtendedNavigator).deviceMemory || null,
        hardwareConcurrency: navigator.hardwareConcurrency,
        connection: this.getConnectionInfo(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        preferences: this.getPreferences(),
        performance: this.getPerformanceInfo(),
      };

      const docRef = (await addDoc(
        collection(db, 'visitorsV2'),
        visitorLog,
      )) as unknown as DocumentReference<VisitorLog>;

      this.updateLastVisitTime();
      return docRef;
    } catch (error) {
      console.error('Error logging visitor:', error);
      return null;
    }
  }
}

/**
 * Logs a navigation event to Firestore with validation and error handling
 * @param navData - Navigation event data
 * @returns DocumentReference or null on error
 */
export const logNavigationEvent = async (
  navData: Omit<
    NavigationEventLog,
    'timestamp' | 'visitorId' | 'deviceMemory' | 'hardwareConcurrency' | 'connection'
  > & {navHref: string; navText: string},
  visitorId?: string,
): Promise<DocumentReference<NavigationEventLog> | null> => {
  try {
    // Defensive: Validate input
    if (!navData.navHref || typeof navData.navHref !== 'string') {
      throw new NavigationEventLogError('Invalid navigation href');
    }
    if (!navData.navText || typeof navData.navText !== 'string') {
      throw new NavigationEventLogError('Invalid navigation text');
    }
    if (!navData.language || typeof navData.language !== 'string') {
      throw new NavigationEventLogError('Invalid language');
    }
    // Defensive: Use current visitorId if not provided
    const id = visitorId || localStorage.getItem('visitor_id') || crypto.randomUUID();
    const event: NavigationEventLog = {
      visitorId: id,
      timestamp: new Date(),
      navHref: navData.navHref,
      navText: navData.navText,
      language: navData.language,
      userAgent: navData.userAgent || navigator.userAgent,
      referrer: navData.referrer || document.referrer || 'direct',
      screenResolution:
        navData.screenResolution || `${window.screen.width}x${window.screen.height}`,
      platform: navData.platform || navigator.platform,
      deviceMemory: (navigator as ExtendedNavigator).deviceMemory || null,
      hardwareConcurrency: navigator.hardwareConcurrency,
      connection: ((): NavigationEventLog['connection'] => {
        const connection = (navigator as ExtendedNavigator).connection;
        return {
          type: connection?.type || null,
          effectiveType: connection?.effectiveType || null,
          downlink: connection?.downlink || null,
          rtt: connection?.rtt || null,
        };
      })(),
    };
    // Save to Firestore
    const docRef = (await addDoc(
      collection(db, 'navigation_events'),
      event,
    )) as unknown as DocumentReference<NavigationEventLog>;
    return docRef;
  } catch (error) {
    console.error('Error logging navigation event:', error);
    return null;
  }
};
