import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import { updateQuotationStatus, listQuotations } from "@/services/adminService";
import { QuotationStatus } from "@/types/application";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin privileges required." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const quotations = await listQuotations();
  const quotation = quotations.find((q) => q.id === id);

  if (!quotation) {
    return NextResponse.json(
      { success: false, error: `Quotation ${id} was not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: quotation,
  });
}

const VALID_QUOTATION_STATUSES: QuotationStatus[] = [
  "Draft",
  "Sent to Customer",
  "Approved",
  "Revised",
  "Declined",
];

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin privileges required." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body || {};

    if (!status || !VALID_QUOTATION_STATUSES.includes(status as QuotationStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${VALID_QUOTATION_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updated = await updateQuotationStatus(id, status as QuotationStatus);

    return NextResponse.json({
      success: true,
      message: `Quotation status updated to "${status}".`,
      data: updated,
    });
  } catch (error) {
    console.error(`Failed to update quotation ${id}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update quotation.",
      },
      { status: 500 }
    );
  }
}
