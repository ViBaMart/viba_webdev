import { getStorage as getClientStorage, FirebaseStorage } from "firebase/storage";
import { getStorage as getAdminStorage, Storage as AdminStorage } from "firebase-admin/storage";
import { getClientFirebase } from "./client";
import { getAdminFirebase } from "./admin";
import { clientEnv } from "@/config/env";

let clientStorageInstance: FirebaseStorage | null = null;
let adminStorageInstance: AdminStorage | null = null;

/**
 * Returns initialized Firebase Storage for browser/client-side operations.
 */
export function getClientFirebaseStorage(): FirebaseStorage | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (clientStorageInstance) {
    return clientStorageInstance;
  }

  const { app } = getClientFirebase();
  if (!app) {
    return null;
  }

  try {
    const bucketUrl = clientEnv.firebase.storageBucket
      ? `gs://${clientEnv.firebase.storageBucket}`
      : undefined;
    clientStorageInstance = getClientStorage(app, bucketUrl);
    return clientStorageInstance;
  } catch (error) {
    console.warn("Failed to initialize Firebase Client Storage:", error);
    return null;
  }
}

/**
 * Returns initialized Firebase Storage for server-side Next.js API operations.
 */
export function getAdminFirebaseStorage(): {
  storage: AdminStorage | null;
  bucket: ReturnType<AdminStorage["bucket"]> | null;
  configured: boolean;
} {
  const { app, configured } = getAdminFirebase();
  if (!configured || !app) {
    return { storage: null, bucket: null, configured: false };
  }

  try {
    if (!adminStorageInstance) {
      adminStorageInstance = getAdminStorage(app);
    }

    const bucketName = clientEnv.firebase.storageBucket || undefined;
    const bucket = adminStorageInstance.bucket(bucketName);

    return {
      storage: adminStorageInstance,
      bucket,
      configured: true,
    };
  } catch (error) {
    console.warn("Failed to initialize Firebase Admin Storage:", error);
    return { storage: null, bucket: null, configured: false };
  }
}

