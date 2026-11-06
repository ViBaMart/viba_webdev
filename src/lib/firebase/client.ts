import { getApps, initializeApp, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { firebaseClientConfig } from "./config";
import { serverEnv } from "@/config/env";

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;

export function getClientFirebase(): { app: FirebaseApp | null; db: Firestore | null } {
  if (typeof window === "undefined") {
    return { app: null, db: null };
  }

  if (!serverEnv.isFirebaseConfigured || !firebaseClientConfig.apiKey) {
    return { app: null, db: null };
  }

  if (!firebaseApp) {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseClientConfig);
    } else {
      firebaseApp = getApp();
    }
    firestoreDb = getFirestore(firebaseApp);
  }

  return { app: firebaseApp, db: firestoreDb };
}

