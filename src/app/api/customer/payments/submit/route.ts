import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerRequest } from "@/lib/api/customerAuth";
import {
  submitCustomerTransaction,
  getPaymentByQuotationId,
  PaymentServiceError,
} from "@/services/paymentService";
import { SubmitTransactionDTO } from "@/types/payment";

export async function POST(request: NextRequest) {
  const customer = await verifyCustomerRequest(request);
  if (!customer) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Customer authentication required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { quotationId, ...dto } = body as { quotationId: string } & SubmitTransactionDTO;

    if (!quotationId) {
      return NextResponse.json(
        { success: false, error: "quotationId is required." },
        { status: 400 }
      );
    }

    // Verify ownership
    const payment = await getPaymentByQuotationId(quotationId);
    if (payment) {
      const isOwner =
        payment.userId === customer.uid ||
        payment.customerEmail.toLowerCase() === customer.email.toLowerCase();

      if (!isOwner) {
        return NextResponse.json(
          { success: false, error: "Forbidden: You are only permitted to submit payments for your own account." },
          { status: 403 }
        );
      }
    }

    const updatedPayment = await submitCustomerTransaction(quotationId, dto);

    return NextResponse.json({
      success: true,
      message: "Payment transaction submitted successfully. Admin verification is pending.",
      data: updatedPayment,
    });
  } catch (error) {
    console.error("Failed to submit customer transaction:", error);
    if (error instanceof PaymentServiceError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to record transaction." },
      { status: 500 }
    );
  }
}

