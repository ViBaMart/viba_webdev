import { NextRequest, NextResponse } from "next/server";
import {
  getCustomerProjectById,
  submitCustomerFeedback,
  verifyCustomerAccess,
  CustomerProjectServiceError,
} from "@/services/customerProjectService";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import { SubmitFeedbackDTO } from "@/types/customerProject";
import { isRateLimited } from "@/lib/api/security";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/projects/[id]/feedback
 * Customer submits feedback on project progress.
 *
 * NOTE: Security Requirement:
 * Strictly verifies customer token or email to restrict customer to their own project.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const rateLimit = isRateLimited(request, { windowMs: 60_000, maxRequests: 10 });
  if (rateLimit.limited) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
  }

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
        error: "Forbidden: You are only authorized to submit feedback on your own project.",
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const dto = body as SubmitFeedbackDTO;

    const customerName = adminSession ? "Admin (On Behalf of Client)" : project.clientName;
    const customerEmail = adminSession ? adminSession.email : project.clientEmail;

    const updated = await submitCustomerFeedback(id, dto, customerName, customerEmail);

    return NextResponse.json({
      success: true,
      message: "Your feedback has been submitted to the ViBa engineering team.",
      data: updated,
    });
  } catch (error) {
    console.error(`Failed to submit feedback for project ${id}:`, error);
    if (error instanceof CustomerProjectServiceError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to submit feedback." },
      { status: 500 }
    );
  }
}

