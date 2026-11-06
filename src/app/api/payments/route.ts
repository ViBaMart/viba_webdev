import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import { listPayments } from "@/services/paymentService";

/**
 * GET /api/payments
 * Restricted to authenticated administrators.
 */
export async function GET(request: NextRequest) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin privileges required." },
      { status: 401 }
    );
  }

  try {
    const payments = await listPayments();
    return NextResponse.json({
      success: true,
      data: payments,
      count: payments.length,
    });
  } catch (error) {
    console.error("Failed to query payments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to list payment records from database." },
      { status: 500 }
    );
  }
}

