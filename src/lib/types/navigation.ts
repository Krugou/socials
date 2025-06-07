// src/lib/types/navigation.ts
/**
 * Navigation event log type for Firestore
 */
export interface NavigationEventLog {
  visitorId: string;
  timestamp: Date;
  navHref: string;
  navText: string;
  language: string;
  userAgent: string;
  referrer: string;
  screenResolution: string;
  platform: string;
  deviceMemory: number | null;
  hardwareConcurrency: number;
  connection: {
    type: string | null;
    effectiveType: string | null;
    downlink: number | null;
    rtt: number | null;
  };
}

/**
 * Custom error for navigation event logging
 */
export class NavigationEventLogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NavigationEventLogError';
  }
}
