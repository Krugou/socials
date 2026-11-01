import {collection, addDoc, type DocumentReference} from 'firebase/firestore';
import {db} from './firebase.js';
import {NavigationEventLogError} from './types/navigation.js';
import type {NavigationEventLog} from './types/navigation.js';

/**
 * Anonymous page-view record. No persistent visitor ID, device or fingerprint data is stored.
 */
interface VisitorLog {
  timestamp: Date;
  page: string;
  referrer: string;
  language: string;
}

const LAST_LOG_KEY = 'last_log';
const MIN_LOG_INTERVAL = 1000 * 60 * 30; // 30 minutes
const LEGACY_KEYS = ['visitor_id', 'visit_count', 'last_visit'];

/**
 * Reduces a referrer URL to its origin, dropping the path and query string.
 */
const getReferrerOrigin = (): string => {
  if (!document.referrer) return 'direct';
  try {
    return new URL(document.referrer).origin;
  } catch {
    return 'unknown';
  }
};

export class VisitorTracker {
  constructor() {
    // Remove the persistent identifiers written by earlier versions
    try {
      LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch {
      // Storage unavailable, nothing to clean up
    }
  }

  /** Rate limit per browser session so repeat loads do not create extra records */
  private canLogVisit(): boolean {
    try {
      const last = sessionStorage.getItem(LAST_LOG_KEY);
      return !last || Date.now() - Number(last) >= MIN_LOG_INTERVAL;
    } catch {
      return true;
    }
  }

  private markLogged(): void {
    try {
      sessionStorage.setItem(LAST_LOG_KEY, Date.now().toString());
    } catch {
      // Storage unavailable, rate limiting is best effort
    }
  }

  async logVisit(): Promise<DocumentReference<VisitorLog> | null> {
    try {
      if (!this.canLogVisit()) {
        console.debug('Skipping visitor log due to rate limiting');
        return null;
      }

      const visitorLog: VisitorLog = {
        timestamp: new Date(),
        page: window.location.pathname,
        referrer: getReferrerOrigin(),
        language: navigator.language.split('-')[0] || 'unknown',
      };

      const docRef = (await addDoc(
        collection(db, 'visitorsV2'),
        visitorLog,
      )) as unknown as DocumentReference<VisitorLog>;

      this.markLogged();
      return docRef;
    } catch (error) {
      console.error('Error logging visitor:', error);
      return null;
    }
  }
}

/**
 * Logs an anonymous navigation click to Firestore with validation and error handling
 * @param navData - Navigation event data
 * @returns DocumentReference or null on error
 */
export const logNavigationEvent = async (
  navData: Omit<NavigationEventLog, 'timestamp'>,
): Promise<DocumentReference<NavigationEventLog> | null> => {
  try {
    if (!navData.navHref || typeof navData.navHref !== 'string') {
      throw new NavigationEventLogError('Invalid navigation href');
    }
    if (!navData.navText || typeof navData.navText !== 'string') {
      throw new NavigationEventLogError('Invalid navigation text');
    }
    if (!navData.language || typeof navData.language !== 'string') {
      throw new NavigationEventLogError('Invalid language');
    }
    const event: NavigationEventLog = {
      timestamp: new Date(),
      navHref: navData.navHref,
      navText: navData.navText,
      language: navData.language,
    };
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
