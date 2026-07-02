import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True when Firebase env vars are set; otherwise the app runs guest-only. */
export const firebaseEnabled = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId,
);

let app: FirebaseApp | null = null;

function getApp(): FirebaseApp | null {
  if (!firebaseEnabled) return null;
  if (!app) {
    app = getApps()[0] ?? initializeApp(config);
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  const instance = getApp();
  return instance ? getAuth(instance) : null;
}

export function getDb(): Firestore | null {
  const instance = getApp();
  return instance ? getFirestore(instance) : null;
}

export const googleProvider = new GoogleAuthProvider();
