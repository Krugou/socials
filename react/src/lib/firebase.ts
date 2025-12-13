import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBAYUPY6Jqss2WG-87CGzRbOUA5_osn-b4',
  authDomain: 'socials-e3fb5.firebaseapp.com',
  projectId: 'socials-e3fb5',
  storageBucket: 'socials-e3fb5.firebasestorage.app',
  messagingSenderId: '224409763176',
  appId: '1:224409763176:web:19c40de005b58210e7aadd',
  measurementId: 'G-GVCH0JN75M',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
