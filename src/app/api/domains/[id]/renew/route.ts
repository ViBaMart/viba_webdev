import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import { recordDomainRenewal, DomainServiceError } from "@/services/domainService";
import { RecordRenewalDTO } from "@/types/domain";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/domains/[id]/renew
 * Admin records a domain renewal event performed at the external registrar.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
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
    const dto = body as RecordRenewalDTO;

    if (!dto.newExpiryDate) {
      return NextResponse.json(
        { success: false, error: "New expiry date is required to record renewal." },
        { status: 400 }
      );
    }

    const updated = await recordDomainRenewal(id, dto, session.email);

    return NextResponse.json({
      success: true,
      message: `Renewal recorded for ${updated.domainName}. New expiry date is ${updated.expiryDate}.`,
      data: updated,
    });
  } catch (error) {
    console.error("Failed to record domain renewal:", error);
    if (error instanceof DomainServiceError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to record renewal event." },
      { status: 500 }
    );
  }
}

