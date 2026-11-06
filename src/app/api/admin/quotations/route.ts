import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import { createQuotation, listQuotations } from "@/services/adminService";
import { updateApplicationStatus } from "@/services/applicationService";
import { CustomerQuotation } from "@/types/application";

export async function GET(request: NextRequest) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin privileges required." },
      { status: 401 }
    );
  }

  try {
    const quotations = await listQuotations();
    return NextResponse.json({
      success: true,
      data: quotations,
      count: quotations.length,
    });
  } catch (error) {
    console.error("Failed to list quotations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch quotations from database." },
      { status: 500 }
    );
  }
}

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
    const payload = body as Partial<CustomerQuotation>;

    if (!payload.applicationId) {
      return NextResponse.json(
        { success: false, error: "applicationId is required to prepare a quotation." },
        { status: 400 }
      );
    }

    if (!payload.customerName || !payload.email) {
      return NextResponse.json(
        { success: false, error: "Customer name and email are required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one quotation line item is required." },
        { status: 400 }
      );
    }

    const subtotal = payload.items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const discount = Number(payload.discount) || 0;
    const tax = Number(payload.tax) || 0;
    const totalAmount = Math.max(0, subtotal - discount + tax);

    const quotation = await createQuotation({
      applicationId: payload.applicationId,
      customerName: payload.customerName.trim(),
      businessName: payload.businessName?.trim() || "",
      email: payload.email.trim(),
      mobileNumber: payload.mobileNumber?.trim() || "",
      websiteType: payload.websiteType || "Static Website",
      currency: payload.currency || "INR",
      items: payload.items,
      subtotal,
      discount,
      tax,
      totalAmount,
      estimatedTimelineWeeks: Number(payload.estimatedTimelineWeeks) || 3,
      scopeDeliverables: Array.isArray(payload.scopeDeliverables) ? payload.scopeDeliverables : [],
      termsAndConditions:
        payload.termsAndConditions ||
        "50% advance mobilization deposit, 50% upon successful testing and launch. Includes 30 days of complimentary post-launch support and bug fixes.",
      status: payload.status || "Draft",
      validUntil:
        payload.validUntil ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });

    // Automatically transition application status to "Quotation Prepared" if currently "New Application" or "Under Review"
    try {
      await updateApplicationStatus(payload.applicationId, "Quotation Prepared");
    } catch {
      // Ignored if application cannot be transitioned
    }

    return NextResponse.json(
      {
        success: true,
        message: `Quotation ${quotation.id} prepared successfully.`,
        data: quotation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to prepare quotation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save quotation to database." },
      { status: 500 }
    );
  }
}
