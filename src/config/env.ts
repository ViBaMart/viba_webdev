/**
 * Secure typed environment configuration for ViBa WebDevloper platform.
 * Validates availability of required client and server variables.
 */

export interface ClientEnv {
  appName: string;
  appUrl: string;
  firebase: {
    apiKey?: string;
    authDomain?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
  };
  isProduction: boolean;
}

export interface ServerEnv {
  firebaseAdmin: {
    projectId?: string;
    clientEmail?: string;
    privateKey?: string;
  };
  inquiryNotificationEmail?: string;
  nodeEnv: string;
  isFirebaseConfigured: boolean;
  isFirebaseAdminConfigured: boolean;
}

export const clientEnv: ClientEnv = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "ViBa WebDevloper",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://vibawebdev.com",
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
  isProduction: process.env.NODE_ENV === "production",
};

const hasAdminKeys = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY &&
  !process.env.FIREBASE_PRIVATE_KEY.includes("...") &&
  process.env.FIREBASE_PRIVATE_KEY.includes("-----BEGIN PRIVATE KEY-----")
);

const hasClientKeys = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

export const serverEnv: ServerEnv = {
  firebaseAdmin: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Replace escaped newlines if passed through environment variables
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined,
  },
  inquiryNotificationEmail: process.env.INQUIRY_NOTIFICATION_EMAIL || "contact@vibawebdev.com",
  nodeEnv: process.env.NODE_ENV || "development",
  isFirebaseConfigured: hasClientKeys,
  isFirebaseAdminConfigured: hasAdminKeys,
};

/**
 * Diagnostic function to inspect server environment readiness without exposing secrets.
 */
export function getEnvironmentDiagnostics() {
  return {
    environment: serverEnv.nodeEnv,
    appUrl: clientEnv.appUrl,
    firebaseClientReady: serverEnv.isFirebaseConfigured,
    firebaseAdminReady: serverEnv.isFirebaseAdminConfigured,
    missingAdminVars: [
      !process.env.FIREBASE_PROJECT_ID && "FIREBASE_PROJECT_ID",
      !process.env.FIREBASE_CLIENT_EMAIL && "FIREBASE_CLIENT_EMAIL",
      !process.env.FIREBASE_PRIVATE_KEY && "FIREBASE_PRIVATE_KEY",
    ].filter(Boolean) as string[],
    missingClientVars: [
      !process.env.NEXT_PUBLIC_FIREBASE_API_KEY && "NEXT_PUBLIC_FIREBASE_API_KEY",
      !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    ].filter(Boolean) as string[],
  };
}

