import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import { createCustomerProject, listCustomerProjects } from "@/services/adminService";
import { updateApplicationStatus } from "@/services/applicationService";
import { CustomerProject } from "@/types/application";

export async function GET(request: NextRequest) {
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
  } catch (error) {
    console.error("Failed to query projects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects from database." },
      { status: 500 }
    );
  }
}

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
    const payload = body as Partial<CustomerProject>;

    if (!payload.projectName || !payload.clientName) {
      return NextResponse.json(
        { success: false, error: "Project name and client name are required." },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split("T")[0];
    const targetDate =
      payload.targetLaunchDate ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const defaultMilestones = [
      { id: "m-1", title: "Discovery & Design Mockup Signoff", completed: false },
      { id: "m-2", title: "Frontend Architecture & Responsive Layouts", completed: false },
      { id: "m-3", title: "Backend, Database & Forms Integration", completed: false },
      { id: "m-4", title: "Client Demo & Revisions", completed: false },
      { id: "m-5", title: "SEO, Performance Testing & Production Launch", completed: false },
    ];

    const project = await createCustomerProject({
      applicationId: payload.applicationId,
      quotationId: payload.quotationId,
      projectName: payload.projectName.trim(),
      clientName: payload.clientName.trim(),
      clientBusiness: payload.clientBusiness?.trim() || "",
      clientEmail: payload.clientEmail?.trim() || "",
      clientMobile: payload.clientMobile?.trim() || "",
      websiteType: payload.websiteType || "Dynamic Business Website",
      status: payload.status || "Planning",
      progressPercent: typeof payload.progressPercent === "number" ? payload.progressPercent : 0,
      startDate: payload.startDate || today,
      targetLaunchDate: targetDate,
      liveUrl: payload.liveUrl?.trim() || "",
      stagingUrl: payload.stagingUrl?.trim() || "",
      repositoryUrl: payload.repositoryUrl?.trim() || "",
      assignedLead: payload.assignedLead?.trim() || "ViBa Lead Engineer",
      milestones: Array.isArray(payload.milestones) && payload.milestones.length > 0
        ? payload.milestones
        : defaultMilestones,
      internalNotes: payload.internalNotes?.trim() || "",
    });

    // If linked to an application, update application status to "Project Started"
    if (payload.applicationId) {
      try {
        await updateApplicationStatus(payload.applicationId, "Project Started");
      } catch {
        // Ignored if update fails
      }
    }

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
    return NextResponse.json(
      { success: false, error: "Failed to save project to database." },
      { status: 500 }
    );
  }
}
