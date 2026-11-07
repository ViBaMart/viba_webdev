import { NextRequest, NextResponse } from "next/server";
import {
  getCustomerProjectById,
  updateProjectStage,
  addProgressNote,
  updateProjectSettings,
  verifyCustomerAccess,
  CustomerProjectServiceError,
} from "@/services/customerProjectService";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import { verifyCustomerRequest } from "@/lib/api/customerAuth";
import { ProjectStage } from "@/types/customerProject";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/projects/[id]
 * Retrieves customer project details.
 *
 * NOTE: Security Requirement:
 * Restricts each customer to their own project using token or verified email.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const project = await getCustomerProjectById(id);

  if (!project) {
    return NextResponse.json(
      { success: false, error: `Customer project "${id}" not found.` },
      { status: 404 }
    );
  }

  // 1. Check if requester is Admin
  const adminSession = verifyAdminRequest(request);
  if (adminSession) {
    return NextResponse.json({
      success: true,
      data: project,
      role: "admin",
    });
  }

  // 2. Check Customer Access (Restricting each customer to their own project)
  const customer = await verifyCustomerRequest(request);
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || request.headers.get("x-project-token");
  const email = searchParams.get("email") || request.headers.get("x-client-email");

  const isAuthorized =
    (customer && (customer.uid === project.userId || (project.clientEmail && customer.email === project.clientEmail.toLowerCase()))) ||
    verifyCustomerAccess(project, token, email);
  if (!isAuthorized) {
    return NextResponse.json(
      {
        success: false,
        error: "Forbidden: You are only authorized to access your own customer project.",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    data: project,
    role: "customer",
  });
}

/**
 * PATCH /api/projects/[id]
 * Admin updates stage, adds progress notes, sets expected delivery date, or updates environments.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const adminSession = verifyAdminRequest(request);
  if (!adminSession) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin privileges required." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { stage, stageNote, progressNote, settings } = body || {};

    let current = await getCustomerProjectById(id);
    if (!current) {
      return NextResponse.json(
        { success: false, error: `Project ${id} not found.` },
        { status: 404 }
      );
    }

    // 1. Update project stage
    if (stage) {
      current = await updateProjectStage(id, stage as ProjectStage, adminSession.email, stageNote);
    }

    // 2. Add progress note
    if (progressNote && progressNote.title && progressNote.content) {
      current = await addProgressNote(id, progressNote, adminSession.email);
    }

    // 3. Update settings / delivery date
    if (settings && typeof settings === "object") {
      current = await updateProjectSettings(id, settings);
    }

    return NextResponse.json({
      success: true,
      message: `Project ${id} updated successfully.`,
      data: current,
    });
  } catch (error) {
    console.error(`Failed to update project ${id}:`, error);
    if (error instanceof CustomerProjectServiceError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update project in database." },
      { status: 500 }
    );
  }
}

