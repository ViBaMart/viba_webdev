import { NextResponse } from "next/server";
import { getPlatformHealth } from "@/services/agencyService";

export async function GET() {
  const health = getPlatformHealth();
  return NextResponse.json(health, { status: 200 });
}
