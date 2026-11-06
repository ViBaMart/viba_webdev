import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerRequest } from "@/lib/api/customerAuth";
import { listApplications } from "@/services/applicationService";

export async function GET(request: NextRequest) {
  const customer = await verifyCustomerRequest(request);
  if (!customer) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Customer authentication required." },
      { status: 401 }
    );
  }

  try {
    const allApps = await listApplications(100);
    const normalizedEmail = customer.email.toLowerCase().trim();

    // Isolate only the authenticated customer's applications
    const customerApps = allApps.filter(
      (app) => app.userId === customer.uid || (app.email && app.email.toLowerCase() === normalizedEmail)
    );

    return NextResponse.json({
      success: true,
      data: customerApps,
      count: customerApps.length,
    });
  } catch (error) {
    console.error("Failed to query customer applications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch customer applications." },
      { status: 500 }
    );
  }
}

