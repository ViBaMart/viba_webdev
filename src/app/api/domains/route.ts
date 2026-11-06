import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import { createDomain, listDomains, DomainServiceError } from "@/services/domainService";
import { CreateDomainDTO } from "@/types/domain";

/**
 * GET /api/domains
 * List, search, and filter managed customer domains with expiry tracking and stats.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;
  const expiryFilter = (searchParams.get("expiryFilter") as "all" | "30_days" | "60_days" | "expired" | "active") || undefined;
  const paymentStatus = searchParams.get("paymentStatus") || undefined;
  const customerEmail = searchParams.get("customerEmail") || undefined;
  const customerName = searchParams.get("customerName") || undefined;
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : undefined;

  try {
    const { domains, stats } = await listDomains({
      search,
      status,
      expiryFilter,
      paymentStatus,
      customerEmail,
      customerName,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: domains,
      stats,
      count: domains.length,
    });
  } catch (error) {
    console.error("Failed to query domains:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch domains from database." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/domains
 * Admin registers and records a new customer domain under ViBa management.
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
    const dto = body as CreateDomainDTO;

    const domain = await createDomain(dto);

    return NextResponse.json(
      {
        success: true,
        message: `Domain ${domain.domainName} registered under ViBa management successfully.`,
        data: domain,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to register domain:", error);
    if (error instanceof DomainServiceError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to save domain record." },
      { status: 500 }
    );
  }
}

