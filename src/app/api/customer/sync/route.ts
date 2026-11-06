import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerRequest } from "@/lib/api/customerAuth";
import { syncCustomerProfile } from "@/services/customerDashboardService";

export async function POST(request: NextRequest) {
  const customer = await verifyCustomerRequest(request);
  if (!customer) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Customer token required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const profile = await syncCustomerProfile({
      uid: customer.uid,
      email: customer.email,
      displayName: body.displayName || customer.name,
      businessName: body.businessName,
      mobileNumber: body.mobileNumber,
      businessAddress: body.businessAddress,
      photoURL: body.photoURL,
    });

    return NextResponse.json({
      success: true,
      message: "Customer profile and records linked successfully.",
      data: profile,
    });
  } catch (error) {
    console.error("Failed to sync customer profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to synchronize customer records." },
      { status: 500 }
    );
  }
}

