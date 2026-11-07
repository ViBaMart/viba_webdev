import { NextRequest } from "next/server";
import { uploadFileToStorage, StorageServiceError } from "@/services/storageService";
import { apiSuccess, apiError } from "@/lib/api/response";
import { isRateLimited, validateApiKey, getRequestMetadata } from "@/lib/api/security";
import { verifyAdminRequest } from "@/lib/api/adminAuth";
import { verifyCustomerRequest } from "@/lib/api/customerAuth";
import { getAdminFirebaseStorage } from "@/lib/firebase/storage";

export async function GET() {
  const { configured, bucket } = getAdminFirebaseStorage();
  return apiSuccess({
    service: "ViBa Storage API",
    configured,
    bucketName: bucket ? bucket.name : null,
    status: configured ? "ready" : "not_configured",
  });
}

export async function POST(request: NextRequest) {
  // 1. Rate limiting check
  const rateLimit = isRateLimited(request, { maxRequests: 20, windowMs: 60_000 });
  if (rateLimit.limited) {
    return apiError("Too many upload requests. Please try again later.", {
      status: 429,
      code: "RATE_LIMITED",
    });
  }

  // 2. Authentication check: Admin, Authenticated Customer, or Valid API Key
  const isAdmin = !!verifyAdminRequest(request);
  const customer = isAdmin ? null : await verifyCustomerRequest(request);
  const hasValidApiKey = validateApiKey(request);

  if (!isAdmin && !customer && !hasValidApiKey) {
    return apiError("Unauthorized: Valid API key or authentication session required.", {
      status: 401,
      code: "UNAUTHORIZED",
    });
  }

  // 3. Process multipart form data
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "agency-assets";
    const isPublic = formData.get("isPublic") === "true";

    if (!file) {
      return apiError("No file provided in form data field 'file'.", {
        status: 400,
        code: "MISSING_FILE",
      });
    }

    const metadata = getRequestMetadata(request);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploaded = await uploadFileToStorage(buffer, file.name, file.type, {
      folder,
      isPublic,
      tenantId: customer ? customer.uid : metadata.tenantId,
    });

    return apiSuccess(uploaded, {
      status: 201,
      message: "File uploaded successfully.",
    });
  } catch (error) {
    if (error instanceof StorageServiceError) {
      const statusMap: Record<string, number> = {
        VALIDATION_FAILED: 400,
        NOT_CONFIGURED: 503,
        FILE_NOT_FOUND: 404,
        STORAGE_ERROR: 500,
      };
      return apiError(error.message, {
        status: statusMap[error.code] || 500,
        code: error.code,
      });
    }

    return apiError(
      `Upload failed: ${error instanceof Error ? error.message : "Internal server error"}`,
      { status: 500, code: "INTERNAL_ERROR" }
    );
  }
}

