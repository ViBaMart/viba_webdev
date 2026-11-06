import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import {
  verifyAndRecordPaymentByAdmin,
  PaymentServiceError,
} from "@/services/paymentService";
import { VerifyPaymentDTO } from "@/types/payment";

interface RouteParams {
  params: Promise<{ quotationId: string }>;
}

/**
 * POST /api/payments/[quotationId]/verify
 * Admin verifies customer transaction against bank statement and confirms receipt.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin privileges required to verify payment." },
      { status: 401 }
    );
  }

  const { quotationId } = await params;

  try {
    const body = await request.json();
    const { transactionId, action, verificationNotes } = (body || {}) as VerifyPaymentDTO;

    if (!transactionId) {
      return NextResponse.json(
        { success: false, error: "transactionId is required for verification." },
        { status: 400 }
      );
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { success: false, error: "action must be either 'approve' or 'reject'." },
        { status: 400 }
      );
    }

    const updatedPayment = await verifyAndRecordPaymentByAdmin(
      quotationId,
      transactionId,
      action,
      session.email,
      verificationNotes
    );

    return NextResponse.json({
      success: true,
      message:
        action === "approve"
          ? `Transaction ${transactionId} confirmed and payment status updated to "${updatedPayment.status}".`
          : `Transaction ${transactionId} rejected.`,
      data: updatedPayment,
    });
  } catch (error) {
    console.error(`Failed to verify payment for quotation ${quotationId}:`, error);
    if (error instanceof PaymentServiceError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to verify transaction." },
      { status: 500 }
    );
  }
}

