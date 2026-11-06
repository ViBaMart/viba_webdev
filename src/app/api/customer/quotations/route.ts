import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerRequest } from "@/lib/api/customerAuth";
import { listQuotations } from "@/services/quotationService";

export async function GET(request: NextRequest) {
  const customer = await verifyCustomerRequest(request);
  if (!customer) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Customer authentication required." },
      { status: 401 }
    );
  }

  try {
    const allQuotes = await listQuotations({ limit: 100 });
    const normalizedEmail = customer.email.toLowerCase().trim();

    // Isolate only the authenticated customer's quotations
    const customerQuotes = allQuotes.filter(
      (quote) =>
        quote.userId === customer.uid || (quote.email && quote.email.toLowerCase() === normalizedEmail)
    );

    return NextResponse.json({
      success: true,
      data: customerQuotes,
      count: customerQuotes.length,
    });
  } catch (error) {
    console.error("Failed to query customer quotations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch customer quotations." },
      { status: 500 }
    );
  }
}

