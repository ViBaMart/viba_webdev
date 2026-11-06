import { NextRequest, NextResponse } from "next/server";
import { createCustomer, listCustomers, CustomerServiceError } from "@/services/customerService";
import { CreateCustomerDTO } from "@/types/customer";

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

    const payload = body as Partial<CreateCustomerDTO>;

    if (!payload.companyName) {
      return NextResponse.json(
        { success: false, error: "companyName is required." },
        { status: 400 }
      );
    }

    if (!payload.primaryContactEmail) {
      return NextResponse.json(
        { success: false, error: "primaryContactEmail is required." },
        { status: 400 }
      );
    }

    const customer = await createCustomer({
      companyName: payload.companyName,
      primaryContactName: payload.primaryContactName || "Admin",
      primaryContactEmail: payload.primaryContactEmail,
      contactPhone: payload.contactPhone,
      tier: payload.tier || "growth",
      primaryDomain: payload.primaryDomain,
    });

    return NextResponse.json(
      {
        success: true,
        data: customer,
        message: "Customer tenant created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof CustomerServiceError) {
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
    const customers = await listCustomers();
    return NextResponse.json({ success: true, data: customers }, { status: 200 });
  } catch (error) {
    if (error instanceof CustomerServiceError && error.code === "NOT_CONFIGURED") {
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
