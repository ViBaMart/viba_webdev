import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import { verifyCustomerRequest } from "@/lib/api/customerAuth";
import {
  getPaymentByQuotationId,
  updatePaymentStatusDirectly,
  PaymentServiceError,
} from "@/services/paymentService";
import { PaymentStatus } from "@/types/payment";

interface RouteParams {
  params: Promise<{ quotationId: string }>;
}

const VALID_PAYMENT_STATUSES: PaymentStatus[] = [
  "Unpaid",
  "Pending Advance Verification",
  "Advance Paid",
  "Pending Final Verification",
  "Fully Paid",
  "Refunded",
];

/**
 * GET /api/payments/[quotationId]
 * Customer & Admin can view payment details, bank instructions, and transaction history.
 * Prevents unauthorized access to financial transaction history.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { quotationId } = await params;
  const payment = await getPaymentByQuotationId(quotationId);

  if (!payment) {
    return NextResponse.json(
      { success: false, error: `Payment record for quotation "${quotationId}" not found.` },
      { status: 404 }
    );
  }

  // Authorization check: Admin, Authenticated Customer Owner, or matching email verification
  const isAdmin = Boolean(verifyAdminRequest(request));
  const customer = await verifyCustomerRequest(request);
  const emailQuery = request.nextUrl.searchParams.get("email");

  const isAuthorized =
    isAdmin ||
    (customer && (customer.uid === payment.userId || (payment.customerEmail && customer.email === payment.customerEmail.toLowerCase()))) ||
    Boolean(emailQuery && payment.customerEmail && emailQuery.trim().toLowerCase() === payment.customerEmail.toLowerCase());

  if (!isAuthorized) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized: Access to payment details requires admin or customer credentials.",
        code: "UNAUTHORIZED_ACCESS",
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: payment,
  });
}

/**
 * PATCH /api/payments/[quotationId]
 * Admin updates payment status with verified audit log.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin privileges required to update payment status." },
      { status: 401 }
    );
  }

  const { quotationId } = await params;

  try {
    const body = await request.json();
    const { status, notes } = body || {};

    if (!status || !VALID_PAYMENT_STATUSES.includes(status as PaymentStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid payment status. Must be one of: ${VALID_PAYMENT_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updated = await updatePaymentStatusDirectly(
      quotationId,
      status as PaymentStatus,
      session.email,
      typeof notes === "string" ? notes.trim() : undefined
    );

    return NextResponse.json({
      success: true,
      message: `Payment status updated to "${status}".`,
      data: updated,
    });
  } catch (error) {
    console.error(`Failed to update payment status for ${quotationId}:`, error);
    if (error instanceof PaymentServiceError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update payment status in database." },
      { status: 500 }
    );
  }
}

