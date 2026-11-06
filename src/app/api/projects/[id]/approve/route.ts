import { NextRequest, NextResponse } from "next/server";
import {
  getCustomerProjectById,
  approveFinalDelivery,
  verifyCustomerAccess,
  CustomerProjectServiceError,
} from "@/services/customerProjectService";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import { ApproveDeliveryDTO } from "@/types/customerProject";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/projects/[id]/approve
 * Customer approves final project delivery signoff.
 *
 * NOTE: Security Requirement:
 * Strictly verifies customer token or email to restrict customer to their own project.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const project = await getCustomerProjectById(id);

  if (!project) {
    return NextResponse.json(
      { success: false, error: `Customer project "${id}" not found.` },
      { status: 404 }
    );
  }

  // Authorization check: Admin OR authorized Customer for THIS project
  const adminSession = verifyAdminRequest(request);
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || request.headers.get("x-project-token");
  const email = searchParams.get("email") || request.headers.get("x-client-email");

  const isAuthorized = adminSession ? true : verifyCustomerAccess(project, token, email);
  if (!isAuthorized) {
    return NextResponse.json(
      {
        success: false,
        error: "Forbidden: You are only authorized to approve final delivery for your own project.",
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const dto = (body || {}) as ApproveDeliveryDTO;

    const updated = await approveFinalDelivery(id, dto.approvalNotes);

    return NextResponse.json({
      success: true,
      message: "Congratulations! Final project delivery has been formally approved.",
      data: updated,
    });
  } catch (error) {
    console.error(`Failed to approve delivery for project ${id}:`, error);
    if (error instanceof CustomerProjectServiceError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to record delivery approval." },
      { status: 500 }
    );
  }
}

