import { NextResponse } from "next/server";
import { AGENCY_SERVICES } from "@/config/agency";

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: AGENCY_SERVICES,
      total: AGENCY_SERVICES.length,
    },
    { status: 200 }
  );
}
