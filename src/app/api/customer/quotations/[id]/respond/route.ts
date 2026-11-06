import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerRequest } from "@/lib/api/customerAuth";
import { getQuotationById, updateQuotationStatus } from "@/services/quotationService";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const customer = await verifyCustomerRequest(request);
  if (!customer) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Customer authentication required." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const quotation = await getQuotationById(id);
    if (!quotation) {
      return NextResponse.json(
        { success: false, error: `Quotation "${id}" not found.` },
        { status: 404 }
      );
    }

    // Verify ownership: restrict customer to their own quotation
    const isOwner =
      quotation.userId === customer.uid ||
      quotation.email.toLowerCase() === customer.email.toLowerCase();

    if (!isOwner) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You are only permitted to access your own quotation." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, feedback } = body || {};

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { success: false, error: "Invalid action. Must be 'approve' or 'reject'." },
        { status: 400 }
      );
    }

    const newStatus = action === "approve" ? "Approved" : "Rejected";
    const updated = await updateQuotationStatus(id, newStatus, feedback);

    return NextResponse.json({
      success: true,
      message: `Quotation ${id} has been ${newStatus.toLowerCase()} successfully.`,
      data: updated,
    });
  } catch (error) {
    console.error("Failed to respond to quotation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update quotation decision." },
      { status: 500 }
    );
  }
}

