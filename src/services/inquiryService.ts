import { getAdminFirebase } from "@/lib/firebase/admin";
import { ContactInquiry, CreateInquiryDTO } from "@/types/inquiry";
import { isValidEmail } from "@/lib/utils";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

const INQUIRIES_COLLECTION = "inquiries";

export class InquiryServiceError extends Error {
  constructor(
    message: string,
    public code: "NOT_CONFIGURED" | "VALIDATION_FAILED" | "DATABASE_ERROR"
  ) {
    super(message);
    this.name = "InquiryServiceError";
  }
}

/**
 * Validates input and persists consultation requests to Firebase Firestore.
 */
export async function createInquiry(
  dto: CreateInquiryDTO,
  metadata?: { ipAddress?: string; userAgent?: string; tenantId?: string }
): Promise<ContactInquiry> {
  // Input validation
  if (!dto.fullName || dto.fullName.trim().length < 2) {
    throw new InquiryServiceError("Full name must be at least 2 characters.", "VALIDATION_FAILED");
  }

  if (!dto.email || !isValidEmail(dto.email)) {
    throw new InquiryServiceError("A valid email address is required.", "VALIDATION_FAILED");
  }

  if (!dto.message || dto.message.trim().length < 10) {
    throw new InquiryServiceError("Message must be at least 10 characters.", "VALIDATION_FAILED");
  }

  const { db, configured } = getAdminFirebase();

  if (!configured || !db) {
    throw new InquiryServiceError(
      "Firebase database is not configured. Please supply FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.",
      "NOT_CONFIGURED"
    );
  }

  const now = new Date().toISOString();
  const inquiryData: Omit<ContactInquiry, "id"> = {
    fullName: dto.fullName.trim(),
    email: dto.email.trim().toLowerCase(),
    company: dto.company?.trim() || undefined,
    phone: dto.phone?.trim() || undefined,
    serviceType: dto.serviceType || "custom_web_app",
    budgetRange: dto.budgetRange || "not_specified",
    message: dto.message.trim(),
    status: "new",
    tenantId: metadata?.tenantId,
    ipAddress: metadata?.ipAddress,
    userAgent: metadata?.userAgent,
    createdAt: now,
  };

  try {
    const docRef = await db.collection(INQUIRIES_COLLECTION).add(inquiryData);
    return {
      id: docRef.id,
      ...inquiryData,
    };
  } catch (error) {
    throw new InquiryServiceError(
      `Database error while saving inquiry: ${error instanceof Error ? error.message : "Unknown error"}`,
      "DATABASE_ERROR"
    );
  }
}

export async function listInquiries(limitCount: number = 50): Promise<ContactInquiry[]> {
  const { db, configured } = getAdminFirebase();

  if (!configured || !db) {
    throw new InquiryServiceError(
      "Firebase database is not configured.",
      "NOT_CONFIGURED"
    );
  }

  try {
    const snapshot = await db
      .collection(INQUIRIES_COLLECTION)
      .orderBy("createdAt", "desc")
      .limit(limitCount)
      .get();

    return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...(doc.data() as Omit<ContactInquiry, "id">),
    }));
  } catch (error) {
    throw new InquiryServiceError(
      `Failed to query inquiries: ${error instanceof Error ? error.message : "Unknown error"}`,
      "DATABASE_ERROR"
    );
  }
}
