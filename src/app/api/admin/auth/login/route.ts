import { NextRequest, NextResponse } from "next/server";
import {
  validateAdminCredentials,
  generateAdminSessionToken,
  setAdminCookie,
} from "@/lib/api/adminAuth";
import { isRateLimited } from "@/lib/api/security";

export async function POST(request: NextRequest) {
  // Prevent brute force attacks
  const rateLimit = isRateLimited(request, { windowMs: 60_000, maxRequests: 10 });
  if (rateLimit.limited) {
    return NextResponse.json(
      { success: false, error: "Too many login attempts. Please wait 1 minute." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Admin email and password are required." },
        { status: 400 }
      );
    }

    const isValid = validateAdminCredentials(email, password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid admin credentials." },
        { status: 401 }
      );
    }

    const token = generateAdminSessionToken(email.trim().toLowerCase());
    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful.",
      user: {
        email: email.trim().toLowerCase(),
        role: "admin",
      },
    });

    setAdminCookie(response, token);
    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Malformed request payload." },
      { status: 400 }
    );
  }
}
