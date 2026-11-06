import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerRequest } from "@/lib/api/customerAuth";
import {
  getCustomerProfile,
  updateCustomerProfile,
  CustomerDashboardError,
} from "@/services/customerDashboardService";
import { UpdateCustomerProfileDTO } from "@/types/customerDashboard";

export async function GET(request: NextRequest) {
  const customer = await verifyCustomerRequest(request);
  if (!customer) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Valid customer authentication required." },
      { status: 401 }
    );
  }

  try {
    const profile = await getCustomerProfile(customer.uid, customer.email);
    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Failed to load customer profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve profile." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const customer = await verifyCustomerRequest(request);
  if (!customer) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Valid customer authentication required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const updates = body as UpdateCustomerProfileDTO;

    const updated = await updateCustomerProfile(customer.uid, updates);
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Failed to update customer profile:", error);
    if (error instanceof CustomerDashboardError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update profile." },
      { status: 500 }
    );
  }
}

