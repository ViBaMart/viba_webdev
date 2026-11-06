import { NextRequest, NextResponse } from "next/server";
import { getProjects } from "@/services/projectService";
import {
  createCustomerProject,
  listCustomerProjects,
  CustomerProjectServiceError,
} from "@/services/customerProjectService";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import { CreateCustomerProjectDTO } from "@/types/customerProject";

/**
 * GET /api/projects
 * - With `type=customer` or Admin session: Lists customer development projects.
 * - Otherwise: Returns portfolio showcase projects (preserving existing website showcase).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "customer") {
    const session = verifyAdminRequest(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin privileges required." },
        { status: 401 }
      );
    }

    try {
      const projects = await listCustomerProjects();
      return NextResponse.json({
        success: true,
        data: projects,
        count: projects.length,
      });
    } catch (err) {
      console.error("Failed to list customer projects:", err);
      return NextResponse.json(
        { success: false, error: "Failed to query customer projects from database." },
        { status: 500 }
      );
    }
  }

  // Default: Agency Portfolio Showcase Projects (preserved functionality)
  const showcaseProjects = await getProjects();
  return NextResponse.json(
    {
      success: true,
      data: showcaseProjects,
      total: showcaseProjects.length,
    },
    { status: 200 }
  );
}

/**
 * POST /api/projects
 * Admin creates a customer project after quotation approval & payment confirmation.
 */
export async function POST(request: NextRequest) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin privileges required to initialize customer projects." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const dto = body as CreateCustomerProjectDTO;

    const project = await createCustomerProject(dto, session.email);

    return NextResponse.json(
      {
        success: true,
        message: `Customer project ${project.projectName} created successfully.`,
        data: project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create customer project:", error);
    if (error instanceof CustomerProjectServiceError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to save project to database." },
      { status: 500 }
    );
  }
}
