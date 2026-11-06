import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import {
  getApplicationById,
  updateApplicationStatus,
} from "@/services/applicationService";
import { ApplicationStatus } from "@/types/application";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const VALID_STATUSES: ApplicationStatus[] = [
  "New Application",
  "Under Review",
  "Quotation Prepared",
  "Awaiting Approval",
  "Payment Pending",
  "Project Started",
  "Completed",
  "Rejected",
];

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin privileges required." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const application = await getApplicationById(id);

  if (!application) {
    return NextResponse.json(
      { success: false, error: `Application ${id} not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: application,
  });
}

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
    const { status, adminNotes } = body || {};

    if (!status || !VALID_STATUSES.includes(status as ApplicationStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const updated = await updateApplicationStatus(
      id,
      status as ApplicationStatus,
      typeof adminNotes === "string" ? adminNotes : undefined
    );

    return NextResponse.json({
      success: true,
      message: `Application status updated to "${status}".`,
      data: updated,
    });
  } catch (error) {
    console.error(`Failed to update application ${id}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update application.",
      },
      { status: 500 }
    );
  }
}
