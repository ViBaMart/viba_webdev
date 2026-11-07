import { NextRequest } from "next/server";
import { getAdminFirebase } from "@/lib/firebase/admin";

export interface AuthenticatedCustomer {
  uid: string;
  email: string;
  name?: string;
}

/**
 * Verifies customer identity from incoming API request via Firebase ID token.
 * Protects all customer API routes under /api/customer.
 */
export async function verifyCustomerRequest(
  request: NextRequest
): Promise<AuthenticatedCustomer | null> {
  // 1. Extract Bearer Token from Authorization Header or Cookie
  let token: string | null = null;
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    token = authHeader.substring(7).trim();
  }

  if (!token) {
    const cookie = request.cookies.get("viba_customer_token");
    if (cookie?.value) {
      token = cookie.value;
    }
  }

  if (!token) {
    token = request.headers.get("x-customer-token");
  }

  // 2. Fallback / Dev Mode inspection if token is missing but explicit dev test headers exist in development
  if (!token) {
    const devUid = request.headers.get("x-customer-uid");
    const devEmail = request.headers.get("x-customer-email");
    if (devUid && devEmail && process.env.NODE_ENV !== "production") {
      return {
        uid: devUid.trim(),
        email: devEmail.trim().toLowerCase(),
        name: request.headers.get("x-customer-name") || "Customer",
      };
    }
    return null;
  }

  // 3. Verify ID Token using Firebase Admin SDK
  const { auth, configured } = getAdminFirebase();
  if (configured && auth) {
    try {
      const decoded = await auth.verifyIdToken(token);
      return {
        uid: decoded.uid,
        email: (decoded.email || "").toLowerCase(),
        name: decoded.name || undefined,
      };
    } catch (err) {
      console.warn("Firebase ID token verification failed:", err);
      // Fall through to dev check if in non-production
    }
  }

  // 4. Fallback when Firebase Admin credentials are not provisioned or in development
  if (!configured || process.env.NODE_ENV !== "production") {
    try {
      // Check for base64 JSON token payload (standard JWT part 2 or dev token)
      if (token.includes(".")) {
        const parts = token.split(".");
        if (parts.length >= 2) {
          const payloadJson = Buffer.from(parts[1], "base64").toString("utf-8");
          const payload = JSON.parse(payloadJson);
          if (payload.uid || payload.sub || payload.user_id) {
            return {
              uid: payload.uid || payload.sub || payload.user_id,
              email: (payload.email || "customer@example.com").toLowerCase(),
              name: payload.name || "Customer",
            };
          }
        }
      } else if (token.startsWith("dev-token-")) {
        // e.g. dev-token-<uid>-<email>
        const parts = token.split("-");
        const uid = parts[2] || "dev-customer-uid";
        const email = parts[3] ? decodeURIComponent(parts[3]) : "customer@vibawebdev.com";
        return { uid, email: email.toLowerCase(), name: "Customer" };
      }
    } catch {
      // Ignore parse failure
    }
  }

  return null;
}

