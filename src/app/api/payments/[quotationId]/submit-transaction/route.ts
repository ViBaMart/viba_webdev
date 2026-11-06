import { NextRequest, NextResponse } from "next/server";
import {
  submitCustomerTransaction,
  PaymentServiceError,
} from "@/services/paymentService";
import { SubmitTransactionDTO } from "@/types/payment";
import { isRateLimited } from "@/lib/api/security";

interface RouteParams {
  params: Promise<{ quotationId: string }>;
}

/**
 * POST /api/payments/[quotationId]/submit-transaction
 * Customer submits UTR/Transaction reference after making manual bank/UPI transfer.
 *
 * NOTE: Payment is set to "Pending Verification". Never automatically credited!
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  // Rate limit transaction submissions to prevent spam
  const rateLimit = isRateLimited(request, { windowMs: 60_000, maxRequests: 10 });
  if (rateLimit.limited) {
    return NextResponse.json(
      { success: false, error: "Too many submission attempts. Please wait 1 minute." },
      { status: 429 }
    );
  }

  const { quotationId } = await params;

  try {
    const body = await request.json();
    const dto = body as SubmitTransactionDTO;

    const result = await submitCustomerTransaction(quotationId, dto);

    return NextResponse.json(
      {
        success: true,
        message:
          "Transaction reference submitted successfully. ViBa Accounts will verify against the bank statement and update your payment status.",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Failed to submit transaction for quotation ${quotationId}:`, error);
    if (error instanceof PaymentServiceError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to submit transaction reference." },
      { status: 500 }
    );
  }
}

