// Import the functions you need from the SDKs
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDI_ZzLwgjX3-Q0hcknSfGsFGCOQhAuxO4",
  authDomain: "cprg303-sacbe-firebase.firebaseapp.com",
  projectId: "cprg303-sacbe-firebase",
  storageBucket: "cprg303-sacbe-firebase.firebasestorage.app",
  messagingSenderId: "489364353453",
  appId: "1:489364353453:web:ed99de2b74e2cf9b743124",
  measurementId: "G-2NW3KR7WG9",
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
