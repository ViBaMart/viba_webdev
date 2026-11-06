import { NextRequest, NextResponse } from "next/server";
import {
  getQuotationById,
  updateQuotationStatus,
  QuotationServiceError,
} from "@/services/quotationService";
import { getOrCreatePaymentForQuotation } from "@/services/paymentService";
import { QuotationStatus } from "@/types/quotation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/quotations/[id]
 * Customer & Admin can view complete quotation and financial details.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const quotation = await getQuotationById(id);

  if (!quotation) {
    return NextResponse.json(
      { success: false, error: `Quotation "${id}" not found.` },
      { status: 404 }
    );
  }

  // Ensure payment record exists for this quotation
  const payment = await getOrCreatePaymentForQuotation(quotation);

  return NextResponse.json({
    success: true,
    data: {
      quotation,
      payment: {
        id: payment.id,
        status: payment.status,
        totalAmount: payment.totalAmount,
        advanceRequired: payment.advanceRequired,
        remainingAmount: payment.remainingAmount,
        amountPaid: payment.amountPaid,
        bankDetails: payment.bankDetails,
      },
    },
  });
}

/**
 * PATCH /api/quotations/[id]
 * Customer: Approve or reject quotation.
 * Admin: Update status.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { status, customerFeedback } = body || {};

    const validStatuses: QuotationStatus[] = [
      "Draft",
      "Sent to Customer",
      "Approved",
      "Rejected",
      "Revised",
    ];

    if (!status || !validStatuses.includes(status as QuotationStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid quotation status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updated = await updateQuotationStatus(
      id,
      status as QuotationStatus,
      typeof customerFeedback === "string" ? customerFeedback.trim() : undefined
    );

    return NextResponse.json({
      success: true,
      message: `Quotation status updated to "${status}".`,
      data: updated,
    });
  } catch (error) {
    console.error(`Failed to update quotation ${id}:`, error);
    if (error instanceof QuotationServiceError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update quotation in database." },
      { status: 500 }
    );
  }
}

