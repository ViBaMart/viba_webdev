import { NextRequest } from "next/server";

// Simple sliding window rate-limiter for serverless requests
const requestLog = new Map<string, number[]>();

export interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds (default: 60,000ms = 1 min)
  maxRequests?: number; // Max requests allowed per window (default: 60)
}

/**
 * Checks if the incoming request exceeds rate limits based on client IP.
 */
export function isRateLimited(
  request: NextRequest,
  options: RateLimitOptions = {}
): { limited: boolean; remaining: number; resetMs: number } {
  const windowMs = options.windowMs || 60_000;
  const maxRequests = options.maxRequests || 60;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  const now = Date.now();
  const timestamps = requestLog.get(ip) || [];

  // Filter out timestamps outside current window
  const validTimestamps = timestamps.filter((time) => now - time < windowMs);

  if (validTimestamps.length >= maxRequests) {
    const oldestTimestamp = validTimestamps[0];
    const resetMs = windowMs - (now - oldestTimestamp);
    return { limited: true, remaining: 0, resetMs };
  }

  validTimestamps.push(now);
  requestLog.set(ip, validTimestamps);

  // Periodic garbage collection for stale IPs
  if (requestLog.size > 10_000) {
    for (const [key, times] of requestLog.entries()) {
      if (times.every((t) => now - t > windowMs)) {
        requestLog.delete(key);
      }
    }
  }

  return {
    limited: false,
    remaining: maxRequests - validTimestamps.length,
    resetMs: windowMs,
  };
}

/**
 * Validates request authentication via API secret key or bearer token.
 */
export function validateApiKey(request: NextRequest): boolean {
  const serverSecret = process.env.API_SECRET_KEY;
  if (!serverSecret) {
    // If no secret is configured, allow in development but warn
    if (process.env.NODE_ENV !== "production") {
      return true;
    }
    return false;
  }

  const authHeader = request.headers.get("authorization");
  const apiKeyHeader = request.headers.get("x-api-key");

  if (apiKeyHeader && apiKeyHeader === serverSecret) {
    return true;
  }

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return token === serverSecret;
  }

  return false;
}

/**
 * Extracts and sanitizes request client metadata.
 */
export function getRequestMetadata(request: NextRequest) {
  return {
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      undefined,
    userAgent: request.headers.get("user-agent") || undefined,
    tenantId: request.headers.get("x-tenant-id") || undefined,
    origin: request.headers.get("origin") || undefined,
  };
}

