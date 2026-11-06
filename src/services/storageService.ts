import { getAdminFirebaseStorage } from "@/lib/firebase/storage";
import { UploadedFileMetadata, StorageUploadOptions } from "@/types/storage";

export class StorageServiceError extends Error {
  constructor(
    message: string,
    public code: "NOT_CONFIGURED" | "VALIDATION_FAILED" | "STORAGE_ERROR" | "FILE_NOT_FOUND"
  ) {
    super(message);
    this.name = "StorageServiceError";
  }
}

const DEFAULT_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
];

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates and uploads a file buffer to Firebase Storage.
 */
export async function uploadFileToStorage(
  buffer: Buffer,
  originalFilename: string,
  contentType: string,
  options: StorageUploadOptions = {}
): Promise<UploadedFileMetadata> {
  const allowedTypes = options.allowedTypes || DEFAULT_ALLOWED_TYPES;
  const maxSizeBytes = options.maxSizeBytes || DEFAULT_MAX_SIZE;

  // Validation
  if (buffer.length === 0) {
    throw new StorageServiceError("Uploaded file cannot be empty.", "VALIDATION_FAILED");
  }

  if (buffer.length > maxSizeBytes) {
    const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
    throw new StorageServiceError(`File size exceeds the ${maxMb}MB limit.`, "VALIDATION_FAILED");
  }

  if (!allowedTypes.includes(contentType)) {
    throw new StorageServiceError(
      `File type "${contentType}" is not allowed. Allowed types: ${allowedTypes.join(", ")}`,
      "VALIDATION_FAILED"
    );
  }

  const { bucket, configured } = getAdminFirebaseStorage();
  if (!configured || !bucket) {
    throw new StorageServiceError(
      "Firebase Storage is not configured. Verify FIREBASE_PROJECT_ID and NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET.",
      "NOT_CONFIGURED"
    );
  }

  const sanitizedOriginal = originalFilename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const timestamp = Date.now();
  const folder = options.folder ? `${options.folder.replace(/^\/+|\/+$/g, "")}/` : "uploads/";
  const tenantPrefix = options.tenantId ? `tenants/${options.tenantId}/` : "";
  const uniqueName = `${timestamp}-${sanitizedOriginal}`;
  const filePath = `${folder}${tenantPrefix}${uniqueName}`;

  try {
    const file = bucket.file(filePath);

    await file.save(buffer, {
      metadata: {
        contentType,
        metadata: {
          originalName: originalFilename,
          tenantId: options.tenantId || "default",
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    let downloadUrl: string;
    if (options.isPublic) {
      await file.makePublic();
      downloadUrl = file.publicUrl();
    } else {
      // Generate a signed URL valid for 7 days
      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      });
      downloadUrl = signedUrl;
    }

    return {
      name: uniqueName,
      originalName: originalFilename,
      size: buffer.length,
      contentType,
      downloadUrl,
      path: filePath,
      createdAt: new Date().toISOString(),
      tenantId: options.tenantId,
    };
  } catch (error) {
    if (error instanceof StorageServiceError) throw error;
    console.error("Firebase Storage upload failed:", error);
    throw new StorageServiceError(
      `Storage upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      "STORAGE_ERROR"
    );
  }
}

/**
 * Deletes a file from Firebase Storage.
 */
export async function deleteFileFromStorage(filePath: string): Promise<boolean> {
  const { bucket, configured } = getAdminFirebaseStorage();
  if (!configured || !bucket) {
    throw new StorageServiceError("Firebase Storage is not configured.", "NOT_CONFIGURED");
  }

  try {
    const file = bucket.file(filePath);
    const [exists] = await file.exists();
    if (!exists) {
      throw new StorageServiceError(`File "${filePath}" not found.`, "FILE_NOT_FOUND");
    }

    await file.delete();
    return true;
  } catch (error) {
    if (error instanceof StorageServiceError) throw error;
    console.error("Firebase Storage delete failed:", error);
    throw new StorageServiceError(
      `Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`,
      "STORAGE_ERROR"
    );
  }
}

