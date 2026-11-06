import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerRequest } from "@/lib/api/customerAuth";
import { getCustomerDashboardData } from "@/services/customerDashboardService";

export async function GET(request: NextRequest) {
  const customer = await verifyCustomerRequest(request);
  if (!customer) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Valid customer authentication required." },
      { status: 401 }
    );
  }

  try {
    const data = await getCustomerDashboardData(customer.uid, customer.email);
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Failed to load customer dashboard data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve dashboard records." },
      { status: 500 }
    );
  }
}

