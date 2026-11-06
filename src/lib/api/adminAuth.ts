import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const ADMIN_COOKIE_NAME = "viba_admin_session";
const SESSION_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Configured credentials or secure fallbacks
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@vibawebdev.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ViBaAdmin@2026!";
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.API_SECRET_KEY ||
  "viba-webdev-admin-secret-key-2026-production-token";

export interface AdminSession {
  email: string;
  role: "admin";
  issuedAt: number;
  expiresAt: number;
}

/**
 * Creates an HMAC SHA-256 signature for the session payload.
 */
function signPayload(payloadString: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payloadString).digest("hex");
}

/**
 * Generates an encrypted/signed session token string.
 */
export function generateAdminSessionToken(email: string): string {
  const now = Math.floor(Date.now() / 1000);
  const session: AdminSession = {
    email,
    role: "admin",
    issuedAt: now,
    expiresAt: now + SESSION_EXPIRY_SECONDS,
  };

  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

/**
 * Verifies and decodes an admin session token.
 */
export function verifyAdminSessionToken(token: string): AdminSession | null {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payload);
  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(payload, "base64url").toString("utf8");
    const session: AdminSession = JSON.parse(jsonStr);

    const now = Math.floor(Date.now() / 1000);
    if (!session.expiresAt || session.expiresAt < now) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Verifies if an incoming API request is authorized as an Admin.
 * Checks HTTP-Only session cookie, Authorization Bearer header, or x-admin-key header.
 */
export function verifyAdminRequest(request: NextRequest): AdminSession | null {
  // 1. Check API Key Header (for programmatic/CLI access)
  const apiKeyHeader = request.headers.get("x-admin-key") || request.headers.get("x-api-key");
  const serverSecret = process.env.API_SECRET_KEY || process.env.ADMIN_SECRET_KEY;
  if (apiKeyHeader && serverSecret && apiKeyHeader === serverSecret) {
    return {
      email: ADMIN_EMAIL,
      role: "admin",
      issuedAt: Math.floor(Date.now() / 1000),
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    };
  }

  // 2. Check Authorization Bearer header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    // Allow master token directly
    if (serverSecret && token === serverSecret) {
      return {
        email: ADMIN_EMAIL,
        role: "admin",
        issuedAt: Math.floor(Date.now() / 1000),
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
      };
    }
    const session = verifyAdminSessionToken(token);
    if (session) return session;
  }

  // 3. Check HTTP-only Cookie
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (cookie) {
    const session = verifyAdminSessionToken(cookie);
    if (session) return session;
  }

  return null;
}

/**
 * Validates admin login credentials.
 */
export function validateAdminCredentials(email: string, password: string): boolean {
  if (!email || !password) return false;
  return (
    email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase() &&
    password === ADMIN_PASSWORD
  );
}

/**
 * Sets the admin session cookie on a NextResponse.
 */
export function setAdminCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXPIRY_SECONDS,
  });
}

/**
 * Clears the admin session cookie on a NextResponse.
 */
export function clearAdminCookie(response: NextResponse): void {
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
