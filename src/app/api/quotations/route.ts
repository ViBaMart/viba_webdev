import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import {
  createQuotation,
  listQuotations,
  QuotationServiceError,
} from "@/services/quotationService";
import { getOrCreatePaymentForQuotation } from "@/services/paymentService";
import { CreateQuotationDTO, QuotationStatus } from "@/types/quotation";

/**
 * GET /api/quotations
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
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId") || undefined;
    const status = (searchParams.get("status") as QuotationStatus) || undefined;

    const quotations = await listQuotations({ applicationId, status });
    return NextResponse.json({
      success: true,
      data: quotations,
      count: quotations.length,
    });
  } catch (error) {
    console.error("Failed to list quotations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to query quotations from database." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/quotations
 * Admin prepares customer quotation with:
 * 1. Selected package
 * 2. Development charges
 * 3. Annual service charges
 * 4. Approved additional charges
 * 5. Total amount
 * 6. Advance payment
 * 7. Remaining payment
 */
export async function POST(request: NextRequest) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin privileges required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const dto = body as CreateQuotationDTO;

    const quotation = await createQuotation(dto);

    // Initialize the associated payment record in Firestore
    const payment = await getOrCreatePaymentForQuotation(quotation);

    return NextResponse.json(
      {
        success: true,
        message: `Quotation ${quotation.id} prepared successfully.`,
        data: {
          quotation,
          paymentId: payment.id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create quotation:", error);
    if (error instanceof QuotationServiceError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal server error preparing quotation." },
      { status: 500 }
    );
  }
}

