import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import { updateCustomerProject } from "@/services/adminService";
import { CustomerProject } from "@/types/application";

interface RouteParams {
  params: Promise<{ id: string }>;
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
    const updates = body as Partial<CustomerProject>;

    const updated = await updateCustomerProject(id, updates);

    return NextResponse.json({
      success: true,
      message: `Project ${id} updated successfully.`,
      data: updated,
    });
  } catch (error) {
    console.error(`Failed to update project ${id}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update project.",
      },
      { status: 500 }
    );
  }
}
