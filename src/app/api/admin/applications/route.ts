import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import { listApplications } from "@/services/applicationService";
import { ApplicationStatus, WebsiteType } from "@/types/application";

export async function GET(request: NextRequest) {
  const session = verifyAdminRequest(request);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin privileges required." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim();
    const typeFilter = searchParams.get("type") as WebsiteType | null;
    const statusFilter = searchParams.get("status") as ApplicationStatus | null;

    // Fetch actual records from Firestore
    let applications = await listApplications(200);

    // Apply search filter
    if (search) {
      applications = applications.filter(
        (app) =>
          app.id.toLowerCase().includes(search) ||
          app.customerName.toLowerCase().includes(search) ||
          app.businessName.toLowerCase().includes(search) ||
          app.email.toLowerCase().includes(search) ||
          app.mobileNumber.toLowerCase().includes(search)
      );
    }

    // Apply website type filter
    if (typeFilter && typeFilter !== ("All" as unknown)) {
      applications = applications.filter((app) => app.websiteType === typeFilter);
    }

    // Apply status filter
    if (statusFilter && statusFilter !== ("All" as unknown)) {
      applications = applications.filter((app) => app.status === statusFilter);
    }

    // Compute actual stats from real applications
    const all = await listApplications(200);
    const stats = {
      total: all.length,
      newApplications: all.filter(
        (a) => a.status === "New Application" || a.status === ("pending" as unknown)
      ).length,
      underReview: all.filter((a) => a.status === "Under Review" || a.status === ("under_review" as unknown)).length,
      quotationPrepared: all.filter((a) => a.status === "Quotation Prepared").length,
      awaitingApproval: all.filter((a) => a.status === "Awaiting Approval").length,
      paymentPending: all.filter((a) => a.status === "Payment Pending").length,
      projectStarted: all.filter(
        (a) => a.status === "Project Started" || a.status === ("in_development" as unknown)
      ).length,
      completed: all.filter((a) => a.status === "Completed").length,
      rejected: all.filter((a) => a.status === "Rejected").length,
    };

    return NextResponse.json({
      success: true,
      data: applications,
      stats,
      count: applications.length,
    });
  } catch (error) {
    console.error("Failed to query applications for admin:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications from database." },
      { status: 500 }
    );
  }
}
