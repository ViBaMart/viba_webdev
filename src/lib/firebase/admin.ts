import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";
import { serverEnv } from "@/config/env";

let adminApp: App | null = null;
let adminFirestore: Firestore | null = null;
let adminAuth: Auth | null = null;

export function getAdminFirebase(): {
  app: App | null;
  db: Firestore | null;
  auth: Auth | null;
  configured: boolean;
} {
  if (!serverEnv.isFirebaseAdminConfigured) {
    return { app: null, db: null, auth: null, configured: false };
  }

  if (!adminApp) {
    try {
      const apps = getApps();
      if (apps.length > 0) {
        adminApp = apps[0];
      } else {
        adminApp = initializeApp({
          credential: cert({
            projectId: serverEnv.firebaseAdmin.projectId,
            clientEmail: serverEnv.firebaseAdmin.clientEmail,
            privateKey: serverEnv.firebaseAdmin.privateKey,
          }),
        });
      }
      adminFirestore = getFirestore(adminApp);
      adminAuth = getAuth(adminApp);
    } catch (error) {
      console.warn("Failed to initialize Firebase Admin SDK:", error);
      return { app: null, db: null, auth: null, configured: false };
    }
  }

  return {
    app: adminApp,
    db: adminFirestore,
    auth: adminAuth,
    configured: true,
  };
}
