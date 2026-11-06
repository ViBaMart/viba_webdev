import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/api/adminAuth";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Admin logged out successfully.",
  });
  clearAdminCookie(response);
  return response;
}
