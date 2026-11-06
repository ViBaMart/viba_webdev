import { NextRequest, NextResponse } from "next/server";
import { getApplicationById } from "@/services/applicationService";
import { validateApiKey } from "@/lib/api/security";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/applications/[id]
 * Retrieves an individual application while preventing unauthorized data leakage.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Application ID is required." },
      { status: 400 }
    );
  }

  const application = await getApplicationById(id);

  if (!application) {
    return NextResponse.json(
      { success: false, error: `Application "${id}" not found.` },
      { status: 404 }
    );
  }

  // Security check: allow if admin API key matches OR customer provides matching email verification
  const isAdmin = validateApiKey(request);
  const emailQuery = request.nextUrl.searchParams.get("email");

  const isVerifiedCustomer =
    emailQuery && emailQuery.trim().toLowerCase() === application.email.toLowerCase();

  if (!isAdmin && !isVerifiedCustomer) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized: You must supply a valid admin token or verified customer email to view this application.",
        code: "UNAUTHORIZED_ACCESS",
      },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: application,
    },
    { status: 200 }
  );
}
