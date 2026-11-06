import { NextRequest, NextResponse } from "next/server";
import {
  createApplication,
  listApplications,
  ApplicationServiceError,
  IncomingFileUpload,
} from "@/services/applicationService";
import { CreateApplicationDTO, WebsiteType } from "@/types/application";
import { validateApiKey, isRateLimited, getRequestMetadata } from "@/lib/api/security";

/**
 * POST /api/applications
 * Public endpoint: Customers can apply for a website without creating an account.
 * Supports both multipart/form-data (with file uploads) and application/json.
 */
export async function POST(request: NextRequest) {
  // 1. Rate limiting check (protect server from abuse)
  const rateLimit = isRateLimited(request, { maxRequests: 30, windowMs: 60_000 });
  if (rateLimit.limited) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many application requests from your network. Please wait a moment before trying again.",
      },
      { status: 429 }
    );
  }

  const contentType = request.headers.get("content-type") || "";
  const metadata = getRequestMetadata(request);

  try {
    let dto: CreateApplicationDTO;
    const incomingFiles: IncomingFileUpload[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      dto = {
        customerName: (formData.get("customerName") as string) || "",
        businessName: (formData.get("businessName") as string) || "",
        email: (formData.get("email") as string) || "",
        mobileNumber: (formData.get("mobileNumber") as string) || "",
        businessAddress: (formData.get("businessAddress") as string) || "",
        websiteType: (formData.get("websiteType") as WebsiteType) || "Static Website",
        selectedPackage: (formData.get("selectedPackage") as string) || "",
        businessDescription: (formData.get("businessDescription") as string) || "",
        requiredPages: (formData.get("requiredPages") as string) || "",
        requiredFunctionality: (formData.get("requiredFunctionality") as string) || "",
        preferredDesign: (formData.get("preferredDesign") as string) || "",
        referenceLinks: (formData.get("referenceLinks") as string) || "",
        domainRequirement: (formData.get("domainRequirement") as string) || "",
        additionalRequirements: (formData.get("additionalRequirements") as string) || "",
      };

      // Extract all uploaded files
      const rawFiles = formData.getAll("files");
      for (const item of rawFiles) {
        if (item instanceof File && item.size > 0) {
          const arrayBuffer = await item.arrayBuffer();
          incomingFiles.push({
            buffer: Buffer.from(arrayBuffer),
            originalName: item.name,
            contentType: item.type || "application/octet-stream",
          });
        }
      }
    } else {
      // JSON payload
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { success: false, error: "Invalid JSON in request payload." },
          { status: 400 }
        );
      }

      if (!body || typeof body !== "object") {
        return NextResponse.json(
          { success: false, error: "Request payload must be a valid JSON object." },
          { status: 400 }
        );
      }

      dto = body as CreateApplicationDTO;
    }

    // Persist application in Firestore and files in Storage
    const application = await createApplication(dto, incomingFiles, {
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    });

    return NextResponse.json(
      {
        success: true,
        data: application,
        applicationId: application.id,
        message: "Your website application has been submitted successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ApplicationServiceError) {
      if (error.code === "VALIDATION_FAILED") {
        return NextResponse.json(
          { success: false, error: error.message, code: error.code },
          { status: 400 }
        );
      }
      if (error.code === "STORAGE_ERROR") {
        return NextResponse.json(
          { success: false, error: error.message, code: error.code },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error occurred.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/applications
 * Secure endpoint: Prevents unauthorized access to customer data.
 * Requires valid administrator API key or Bearer token.
 */
export async function GET(request: NextRequest) {
  // Prevent unauthorized access to sensitive customer application data
  if (!validateApiKey(request)) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized: Access to customer application data is restricted to authorized personnel.",
        code: "UNAUTHORIZED_ACCESS",
      },
      { status: 401 }
    );
  }

  try {
    const applications = await listApplications();
    return NextResponse.json(
      {
        success: true,
        data: applications,
        total: applications.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to retrieve applications.",
      },
      { status: 500 }
    );
  }
}
