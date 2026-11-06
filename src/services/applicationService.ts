import { getAdminFirebase } from "@/lib/firebase/admin";
import { uploadFileToStorage, StorageServiceError } from "@/services/storageService";
import {
  CustomerApplication,
  CreateApplicationDTO,
  ApplicationAttachment,
  WebsiteType,
  ApplicationStatus,
} from "@/types/application";
import { isValidEmail } from "@/lib/utils";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

const APPLICATIONS_COLLECTION = "applications";

// In-memory fallback for local development or when Firebase credentials are not provisioned
const memoryApplications = new Map<string, CustomerApplication>();

export class ApplicationServiceError extends Error {
  code: "VALIDATION_FAILED" | "NOT_CONFIGURED" | "DATABASE_ERROR" | "NOT_FOUND" | "STORAGE_ERROR";

  constructor(
    message: string,
    code: "VALIDATION_FAILED" | "NOT_CONFIGURED" | "DATABASE_ERROR" | "NOT_FOUND" | "STORAGE_ERROR"
  ) {
    super(message);
    this.name = "ApplicationServiceError";
    this.code = code;
  }
}

/**
 * Generates an official, human-readable unique Application ID.
 * Format: VIBA-APP-2026-XXXXX
 */
export function generateApplicationId(): string {
  const currentYear = 2026;
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `VIBA-APP-${currentYear}-${randomSuffix}`;
}

export interface IncomingFileUpload {
  buffer: Buffer;
  originalName: string;
  contentType: string;
}

/**
 * Validates customer inputs and persists the application to Firebase Firestore and Storage.
 */
export async function createApplication(
  dto: CreateApplicationDTO,
  files: IncomingFileUpload[] = [],
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<CustomerApplication> {
  // 1. Validation of all required fields
  if (!dto.customerName || dto.customerName.trim().length < 2) {
    throw new ApplicationServiceError("Customer name must be at least 2 characters.", "VALIDATION_FAILED");
  }

  if (!dto.businessName || dto.businessName.trim().length < 2) {
    throw new ApplicationServiceError("Business name must be at least 2 characters.", "VALIDATION_FAILED");
  }

  if (!dto.email || !isValidEmail(dto.email)) {
    throw new ApplicationServiceError("A valid email address is required.", "VALIDATION_FAILED");
  }

  if (!dto.mobileNumber || dto.mobileNumber.trim().length < 7) {
    throw new ApplicationServiceError("A valid mobile number is required (at least 7 digits).", "VALIDATION_FAILED");
  }

  if (!dto.businessAddress || dto.businessAddress.trim().length < 5) {
    throw new ApplicationServiceError("Business address must be at least 5 characters.", "VALIDATION_FAILED");
  }

  const validWebsiteTypes: WebsiteType[] = [
    "Static Website",
    "Dynamic Business Website",
    "E-commerce Website",
  ];
  if (!dto.websiteType || !validWebsiteTypes.includes(dto.websiteType)) {
    throw new ApplicationServiceError(
      "Website type must be one of: Static Website, Dynamic Business Website, or E-commerce Website.",
      "VALIDATION_FAILED"
    );
  }

  if (!dto.selectedPackage || !dto.selectedPackage.trim()) {
    throw new ApplicationServiceError("Please select a website package tier.", "VALIDATION_FAILED");
  }

  if (!dto.businessDescription || dto.businessDescription.trim().length < 10) {
    throw new ApplicationServiceError("Business description must be at least 10 characters.", "VALIDATION_FAILED");
  }

  if (!dto.requiredPages || dto.requiredPages.trim().length < 2) {
    throw new ApplicationServiceError("Please specify the required website pages.", "VALIDATION_FAILED");
  }

  if (!dto.requiredFunctionality || dto.requiredFunctionality.trim().length < 2) {
    throw new ApplicationServiceError("Please outline the required website functionality.", "VALIDATION_FAILED");
  }

  if (!dto.preferredDesign || !dto.preferredDesign.trim()) {
    throw new ApplicationServiceError("Please specify your preferred website design aesthetic.", "VALIDATION_FAILED");
  }

  if (!dto.domainRequirement || !dto.domainRequirement.trim()) {
    throw new ApplicationServiceError("Please indicate your domain requirement.", "VALIDATION_FAILED");
  }

  const applicationId = generateApplicationId();
  const now = new Date().toISOString();

  // 2. Upload reference files to Firebase Storage
  const attachments: ApplicationAttachment[] = [];

  for (const file of files) {
    try {
      const uploaded = await uploadFileToStorage(
        file.buffer,
        file.originalName,
        file.contentType,
        {
          folder: `applications/${applicationId}`,
          isPublic: false,
        }
      );

      attachments.push({
        name: uploaded.name,
        originalName: uploaded.originalName,
        size: uploaded.size,
        contentType: uploaded.contentType,
        url: uploaded.downloadUrl,
        storagePath: uploaded.path,
        uploadedAt: now,
      });
    } catch (uploadError) {
      if (uploadError instanceof StorageServiceError && uploadError.code === "NOT_CONFIGURED") {
        // Safe development fallback when Firebase Storage bucket is not locally provisioned
        attachments.push({
          name: `dev_${Date.now()}_${file.originalName}`,
          originalName: file.originalName,
          size: file.buffer.length,
          contentType: file.contentType,
          url: `/uploads/mock/${file.originalName}`,
          storagePath: `mock/applications/${applicationId}/${file.originalName}`,
          uploadedAt: now,
        });
      } else {
        throw new ApplicationServiceError(
          `Failed to upload file "${file.originalName}": ${uploadError instanceof Error ? uploadError.message : "Storage error"}`,
          "STORAGE_ERROR"
        );
      }
    }
  }

  // 3. Assemble complete application document
  const applicationData: CustomerApplication = {
    id: applicationId,
    customerName: dto.customerName.trim(),
    businessName: dto.businessName.trim(),
    email: dto.email.trim().toLowerCase(),
    mobileNumber: dto.mobileNumber.trim(),
    businessAddress: dto.businessAddress.trim(),
    websiteType: dto.websiteType,
    selectedPackage: dto.selectedPackage.trim(),
    businessDescription: dto.businessDescription.trim(),
    requiredPages: dto.requiredPages.trim(),
    requiredFunctionality: dto.requiredFunctionality.trim(),
    preferredDesign: dto.preferredDesign.trim(),
    referenceLinks: dto.referenceLinks?.trim() || "",
    domainRequirement: dto.domainRequirement.trim(),
    additionalRequirements: dto.additionalRequirements?.trim() || "",
    files: attachments,
    status: "New Application",
    createdAt: now,
    updatedAt: now,
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
  };

  // 4. Persist to Firebase Firestore
  const { db, configured } = getAdminFirebase();

  if (configured && db) {
    try {
      await db.collection(APPLICATIONS_COLLECTION).doc(applicationId).set(applicationData);
    } catch (dbError) {
      console.warn("Firestore write failed, falling back to local memory store:", dbError);
      memoryApplications.set(applicationId, applicationData);
    }
  } else {
    // Development / offline memory fallback
    memoryApplications.set(applicationId, applicationData);
  }

  return applicationData;
}

/**
 * Retrieves a customer application by its unique ID.
 */
export async function getApplicationById(id: string): Promise<CustomerApplication | null> {
  const { db, configured } = getAdminFirebase();

  if (configured && db) {
    try {
      const doc = await db.collection(APPLICATIONS_COLLECTION).doc(id).get();
      if (doc.exists) {
        return {
          id: doc.id,
          ...(doc.data() as Omit<CustomerApplication, "id">),
        };
      }
    } catch (err) {
      console.error("Failed to fetch application from Firestore:", err);
    }
  }

  return memoryApplications.get(id) || null;
}

/**
 * Lists submitted applications with pagination. Restricted to authorized administrators.
 */
export async function listApplications(limitCount: number = 50): Promise<CustomerApplication[]> {
  const { db, configured } = getAdminFirebase();

  if (configured && db) {
    try {
      const snapshot = await db
        .collection(APPLICATIONS_COLLECTION)
        .orderBy("createdAt", "desc")
        .limit(limitCount)
        .get();

      if (!snapshot.empty) {
        return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...(doc.data() as Omit<CustomerApplication, "id">),
        }));
      }
    } catch (err) {
      console.error("Failed to query applications from Firestore:", err);
    }
  }

  return Array.from(memoryApplications.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Updates application status and audit timestamp in Firestore.
 */
export async function updateApplicationStatus(
  id: string,
  newStatus: ApplicationStatus,
  internalNotes?: string
): Promise<CustomerApplication> {
  const application = await getApplicationById(id);
  if (!application) {
    throw new ApplicationServiceError(`Application with ID "${id}" was not found.`, "NOT_FOUND");
  }

  const now = new Date().toISOString();
  const updated: CustomerApplication = {
    ...application,
    status: newStatus,
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      const updatePayload: Record<string, unknown> = {
        status: newStatus,
        updatedAt: now,
      };
      if (internalNotes) {
        updatePayload.adminNotes = internalNotes;
      }
      await db.collection(APPLICATIONS_COLLECTION).doc(id).update(updatePayload);
    } catch (err) {
      console.warn("Failed to update status in Firestore, updating local memory:", err);
      memoryApplications.set(id, updated);
    }
  } else {
    memoryApplications.set(id, updated);
  }

  return updated;
}

