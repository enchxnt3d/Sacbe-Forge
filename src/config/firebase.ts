import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    getApp,
    getApps,
    initializeApp,
    type FirebaseOptions,
} from "firebase/app";
import type { Auth, Persistence } from "firebase/auth";
import * as FirebaseAuth from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

type NativeFirebaseAuth = typeof FirebaseAuth & {
  getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
};

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `[Firebase] Missing ${name}. Check the environment variables in your .env file.`,
    );
  }

  return value;
}

// Expo only loads client variables that start with EXPO_PUBLIC_
const firebaseConfig: FirebaseOptions = {
  apiKey: requireEnv(
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    "EXPO_PUBLIC_FIREBASE_API_KEY",
  ),
  authDomain: requireEnv(
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
  ),
  projectId: requireEnv(
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
  ),
  storageBucket: requireEnv(
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
  ),
  messagingSenderId: requireEnv(
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  ),
  appId: requireEnv(
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    "EXPO_PUBLIC_FIREBASE_APP_ID",
  ),
};

// Reuse the app during Fast Refresh
const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

function createFirebaseAuth(): Auth {
  if (Platform.OS === "web") {
    return FirebaseAuth.getAuth(firebaseApp);
  }

  const nativeAuth = FirebaseAuth as NativeFirebaseAuth;

  try {
    // Keep the user signed in after closing the mobile app
    return FirebaseAuth.initializeAuth(firebaseApp, {
      persistence: nativeAuth.getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    const authError = error as { code?: string };

    if (authError.code === "auth/already-initialized") {
      return FirebaseAuth.getAuth(firebaseApp);
    }

    throw error;
  }
}

const auth = createFirebaseAuth();
const db = getFirestore(firebaseApp);

export { auth, db, firebaseApp };

