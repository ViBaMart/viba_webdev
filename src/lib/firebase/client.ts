import { getApps, initializeApp, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { firebaseClientConfig } from "./config";

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;

export function getClientFirebase(): {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
} {
  if (typeof window === "undefined") {
    return { app: null, db: null, auth: null };
  }

  if (!firebaseClientConfig.apiKey) {
    return { app: null, db: null, auth: null };
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
    } catch (err) {
      console.warn("Failed to initialize Firebase Client SDK:", err);
      return { app: null, db: null, auth: null };
    }
  }

  return { app: firebaseApp, db: firestoreDb, auth: firebaseAuth };
}
