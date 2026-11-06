import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import { getDomainById, updateDomain, deleteDomain, DomainServiceError } from "@/services/domainService";
import { UpdateDomainDTO } from "@/types/domain";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/domains/[id]
 * Retrieves single domain details, expiry countdown, and full renewal history.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const domain = await getDomainById(id);
    if (!domain) {
      return NextResponse.json(
        { success: false, error: `Domain record "${id}" was not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: domain,
    });
  } catch (error) {
    console.error("Failed to query domain:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch domain record." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/domains/[id]
 * Admin updates domain fields (costs, status, payment status, registrar, dates).
 */
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
    const updates = body as UpdateDomainDTO;

    const updated = await updateDomain(id, updates);

    return NextResponse.json({
      success: true,
      message: `Domain ${updated.domainName} updated successfully.`,
      data: updated,
    });
  } catch (error) {
    console.error("Failed to update domain:", error);
    if (error instanceof DomainServiceError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update domain record." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/domains/[id]
 * Admin deletes a domain record from management.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin privileges required." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    await deleteDomain(id);
    return NextResponse.json({
      success: true,
      message: `Domain record "${id}" was removed from management.`,
    });
  } catch (error) {
    console.error("Failed to delete domain:", error);
    if (error instanceof DomainServiceError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to delete domain record." },
      { status: 500 }
    );
  }
}

