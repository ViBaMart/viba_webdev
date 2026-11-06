import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerRequest } from "@/lib/api/customerAuth";
import { getCustomerProjectById, submitCustomerFeedback } from "@/services/customerProjectService";
import { ProjectStage } from "@/types/customerProject";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const customer = await verifyCustomerRequest(request);
  if (!customer) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Customer authentication required." },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    const project = await getCustomerProjectById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: `Project "${id}" not found.` },
        { status: 404 }
      );
    }

    // Verify ownership
    const isOwner =
      project.userId === customer.uid ||
      project.clientEmail.toLowerCase() === customer.email.toLowerCase();

    if (!isOwner) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You are only permitted to submit feedback on your own project." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { message, stage } = body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Feedback message cannot be empty." },
        { status: 400 }
      );
    }

    const feedbackStage = (stage || project.currentStage) as ProjectStage;

    const updated = await submitCustomerFeedback(
      id,
      { message: message.trim(), stage: feedbackStage },
      customer.name || customer.email.split("@")[0],
      customer.email
    );

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully to the engineering team.",
      data: updated,
    });
  } catch (error) {
    console.error("Failed to submit customer feedback:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit feedback." },
      { status: 500 }
    );
  }
}
