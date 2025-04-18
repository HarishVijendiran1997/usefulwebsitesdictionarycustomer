import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache
} from "firebase/firestore";

// First initialize Firebase app
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "usefulwebsiteshub",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// Then initialize Firestore with persistence
const db = initializeFirestore(app, {
  localCache: persistentLocalCache(
    {
      cacheSizeBytes: 1024 * 1024 * 40,
    }
  )
});

export { db };