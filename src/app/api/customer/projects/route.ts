import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerRequest } from "@/lib/api/customerAuth";
import { listCustomerProjects } from "@/services/customerProjectService";

export async function GET(request: NextRequest) {
  const customer = await verifyCustomerRequest(request);
  if (!customer) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Customer authentication required." },
      { status: 401 }
    );
  }

  try {
    const allProjects = await listCustomerProjects();
    const normalizedEmail = customer.email.toLowerCase().trim();

    // Isolate only the authenticated customer's projects
    const customerProjects = allProjects.filter(
      (proj) =>
        proj.userId === customer.uid ||
        (proj.clientEmail && proj.clientEmail.toLowerCase() === normalizedEmail)
    );

    return NextResponse.json({
      success: true,
      data: customerProjects,
      count: customerProjects.length,
    });
  } catch (error) {
    console.error("Failed to query customer projects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch customer projects." },
      { status: 500 }
    );
  }
}

