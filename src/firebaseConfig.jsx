import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // apiKey: "AIzaSyA8r0PI8BNl2XOlYpyfgFPd1HBoRTZDKTs",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // authDomain: "usefulwebsiteshub.firebaseapp.com",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "usefulwebsiteshub",
  // storageBucket: "usefulwebsiteshub.firebasestorage.app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: "1021706252073",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  // appId: "1:1021706252073:web:d50e5d776cf11035f81138",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // measurementId: "G-DJ7DGTSN1K"
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);