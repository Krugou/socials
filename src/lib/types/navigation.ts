// src/lib/types/navigation.ts
/**
 * Navigation event log type for Firestore
 */
export interface NavigationEventLog {
  timestamp: Date;
  navHref: string;
  navText: string;
  language: string;
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
