import { getApps, initializeApp, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { firebaseClientConfig } from "./config";

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;
let firebaseAnalytics: Analytics | null = null;

export function getClientFirebase(): {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
  analytics: Analytics | null;
} {
  if (typeof window === "undefined") {
    return { app: null, db: null, auth: null, analytics: null };
  }

  if (!firebaseClientConfig.apiKey) {
    return { app: null, db: null, auth: null, analytics: null };
  }

  if (!firebaseApp) {
    try {
      if (getApps().length === 0) {
        firebaseApp = initializeApp(firebaseClientConfig);
      } else {
        firebaseApp = getApp();
      }
      firestoreDb = getFirestore(firebaseApp);
      firebaseAuth = getAuth(firebaseApp);

      if (firebaseClientConfig.measurementId) {
        isSupported().then((supported) => {
          if (supported && firebaseApp) {
            firebaseAnalytics = getAnalytics(firebaseApp);
          }
        }).catch(() => {
          // Analytics optional in unsupported environments
        });
      }
    } catch (err) {
      console.warn("Failed to initialize Firebase Client SDK:", err);
      return { app: null, db: null, auth: null, analytics: null };
    }
  }

  return { app: firebaseApp, db: firestoreDb, auth: firebaseAuth, analytics: firebaseAnalytics };
}
