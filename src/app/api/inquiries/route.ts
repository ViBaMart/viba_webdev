import { NextRequest, NextResponse } from "next/server";
import { createInquiry, listInquiries, InquiryServiceError } from "@/services/inquiryService";
import { CreateInquiryDTO } from "@/types/inquiry";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Request payload must be a valid JSON object." },
        { status: 400 }
      );
    }

    const payload = body as Partial<CreateInquiryDTO>;
    const ipAddress = request.headers.get("x-forwarded-for") || undefined;
    const userAgent = request.headers.get("user-agent") || undefined;
    const tenantId = request.headers.get("x-tenant-id") || undefined;

    const result = await createInquiry(
      {
        fullName: payload.fullName || "",
        email: payload.email || "",
        company: payload.company,
        phone: payload.phone,
        serviceType: payload.serviceType || "custom_web_app",
        budgetRange: payload.budgetRange,
        message: payload.message || "",
      },
      { ipAddress, userAgent, tenantId }
    );

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Inquiry successfully recorded.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof InquiryServiceError) {
      if (error.code === "VALIDATION_FAILED") {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
      if (error.code === "NOT_CONFIGURED") {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
            code: "DATABASE_NOT_CONFIGURED",
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const inquiries = await listInquiries();
    return NextResponse.json({ success: true, data: inquiries }, { status: 200 });
  } catch (error) {
    if (error instanceof InquiryServiceError && error.code === "NOT_CONFIGURED") {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: "DATABASE_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error.",
      },
      { status: 500 }
    );
  }
}
