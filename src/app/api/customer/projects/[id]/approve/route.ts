import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerRequest } from "@/lib/api/customerAuth";
import { getCustomerProjectById, approveFinalDelivery } from "@/services/customerProjectService";

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
        { success: false, error: "Forbidden: You are only permitted to sign off on your own project." },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { remarks } = body || {};

    const updated = await approveFinalDelivery(id, remarks);

    return NextResponse.json({
      success: true,
      message: `Final delivery for project ${id} has been formally approved. Congratulations!`,
      data: updated,
    });
  } catch (error) {
    console.error("Failed to approve final delivery:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit final delivery approval." },
      { status: 500 }
    );
  }
}

