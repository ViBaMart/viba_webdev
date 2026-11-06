import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerRequest } from "@/lib/api/customerAuth";
import { listPayments } from "@/services/paymentService";

export async function GET(request: NextRequest) {
  const customer = await verifyCustomerRequest(request);
  if (!customer) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Customer authentication required." },
      { status: 401 }
    );
  }

  try {
    const allPayments = await listPayments();
    const normalizedEmail = customer.email.toLowerCase().trim();

    // Isolate only the authenticated customer's payments
    const customerPayments = allPayments.filter(
      (p) =>
        p.userId === customer.uid ||
        (p.customerEmail && p.customerEmail.toLowerCase() === normalizedEmail)
    );

    return NextResponse.json({
      success: true,
      data: customerPayments,
      count: customerPayments.length,
    });
  } catch (error) {
    console.error("Failed to query customer payments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch customer payment records." },
      { status: 500 }
    );
  }
}

