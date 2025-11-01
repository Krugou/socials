import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export class VisitorTracker {
  private visitorId: string;
  private visitCount: number;

  constructor() {
    this.visitorId =
      localStorage.getItem('visitor_id') || crypto.randomUUID();
    this.visitCount = Number(localStorage.getItem('visit_count')) || 0;
    localStorage.setItem('visitor_id', this.visitorId);
  }

  async logVisit(): Promise<void> {
    try {
      const lastVisit = localStorage.getItem('last_visit');
      const now = Date.now();

      if (lastVisit && now - Number(lastVisit) < 1000 * 60 * 30) {
        return;
      }

      this.visitCount += 1;
      localStorage.setItem('visit_count', this.visitCount.toString());

      await addDoc(collection(db, 'visitorsV2'), {
        visitorId: this.visitorId,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        returningVisitor: this.visitCount > 1,
        visitCount: this.visitCount,
        referrer: document.referrer || 'direct',
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        platform: navigator.platform,
      });

      localStorage.setItem('last_visit', now.toString());
    } catch (error) {
      console.error('Error logging visitor:', error);
    }
  }
}

export const logNavigationEvent = async (navData: {
  navHref: string;
  navText: string;
  language: string;
  userAgent: string;
  referrer: string;
  screenResolution: string;
  platform: string;
}): Promise<void> => {
  try {
    const visitorId =
      localStorage.getItem('visitor_id') || crypto.randomUUID();
    await addDoc(collection(db, 'navigation_events'), {
      ...navData,
      visitorId,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error logging navigation event:', error);
  }
};
