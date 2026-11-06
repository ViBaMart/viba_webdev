import { getAdminFirebase } from "@/lib/firebase/admin";
import {
  QuotationRecord,
  CreateQuotationDTO,
  QuotationStatus,
  QuotationFinancialBreakdown,
} from "@/types/quotation";
import { updateApplicationStatus } from "@/services/applicationService";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

const QUOTATIONS_COLLECTION = "quotations";

// In-memory fallback for local development or when Firebase credentials are not provisioned
const memoryQuotations = new Map<string, QuotationRecord>();

export class QuotationServiceError extends Error {
  code: "VALIDATION_FAILED" | "NOT_FOUND" | "DATABASE_ERROR";

  constructor(message: string, code: "VALIDATION_FAILED" | "NOT_FOUND" | "DATABASE_ERROR") {
    super(message);
    this.name = "QuotationServiceError";
    this.code = code;
  }
}

/**
 * Generates an official human-readable Quotation ID.
 * Format: VIBA-QT-2026-XXXXX
 */
export function generateQuotationId(): string {
  const currentYear = 2026;
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `VIBA-QT-${currentYear}-${suffix}`;
}

/**
 * Calculates complete financial breakdown including package, development,
 * annual service charges, additional charges, taxes, advance, and remaining payment.
 */
export function calculateQuotationBreakdown(params: {
  packagePrice: number;
  developmentCharges: number;
  annualServiceCharges: number;
  additionalCharges: number;
  discount?: number;
  taxRatePercent?: number;
  advancePaymentPercentOrAmount?: number;
}): QuotationFinancialBreakdown {
  const packagePrice = Math.max(0, Number(params.packagePrice) || 0);
  const developmentCharges = Math.max(0, Number(params.developmentCharges) || 0);
  const annualServiceCharges = Math.max(0, Number(params.annualServiceCharges) || 0);
  const additionalCharges = Math.max(0, Number(params.additionalCharges) || 0);

  const subtotal = packagePrice + developmentCharges + annualServiceCharges + additionalCharges;
  const discount = Math.max(0, Number(params.discount) || 0);
  const discountedSubtotal = Math.max(0, subtotal - discount);

  const taxRate = typeof params.taxRatePercent === "number" ? Math.max(0, params.taxRatePercent) : 18;
  const taxAmount = Math.round((discountedSubtotal * taxRate) / 100);
  const totalAmount = discountedSubtotal + taxAmount;

  // Determine advance payment (if <= 100, treated as percentage e.g. 50%, else flat amount)
  let advance = Math.round(totalAmount * 0.5); // Default 50%
  if (typeof params.advancePaymentPercentOrAmount === "number" && params.advancePaymentPercentOrAmount > 0) {
    if (params.advancePaymentPercentOrAmount <= 100) {
      advance = Math.round((totalAmount * params.advancePaymentPercentOrAmount) / 100);
    } else {
      advance = Math.min(totalAmount, Math.round(params.advancePaymentPercentOrAmount));
    }
  }

  const remainingPayment = Math.max(0, totalAmount - advance);

  return {
    packagePrice,
    developmentCharges,
    annualServiceCharges,
    additionalCharges,
    subtotal,
    discount,
    taxRatePercent: taxRate,
    taxAmount,
    totalAmount,
    advancePayment: advance,
    remainingPayment,
  };
}

/**
 * Creates and persists a new quotation in Firestore.
 */
export async function createQuotation(dto: CreateQuotationDTO): Promise<QuotationRecord> {
  if (!dto.applicationId) {
    throw new QuotationServiceError("Application ID is required to prepare quotation.", "VALIDATION_FAILED");
  }
  if (!dto.customerName || !dto.email) {
    throw new QuotationServiceError("Customer name and email are required.", "VALIDATION_FAILED");
  }
  if (!dto.selectedPackage || typeof dto.selectedPackage.price !== "number") {
    throw new QuotationServiceError("Selected package and valid package price are required.", "VALIDATION_FAILED");
  }
  if (!dto.developmentCharges || typeof dto.developmentCharges.amount !== "number") {
    throw new QuotationServiceError("Development charges must be specified.", "VALIDATION_FAILED");
  }
  if (!dto.annualServiceCharges || typeof dto.annualServiceCharges.amount !== "number") {
    throw new QuotationServiceError("Annual service charges must be specified.", "VALIDATION_FAILED");
  }

  const additionalSum = (dto.additionalCharges || []).reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );

  const breakdown = calculateQuotationBreakdown({
    packagePrice: dto.selectedPackage.price,
    developmentCharges: dto.developmentCharges.amount,
    annualServiceCharges: dto.annualServiceCharges.amount,
    additionalCharges: additionalSum,
    discount: dto.discount,
    taxRatePercent: dto.taxRatePercent,
    advancePaymentPercentOrAmount: dto.advancePaymentPercentOrAmount,
  });

  const quotationId = generateQuotationId();
  const now = new Date().toISOString();
  const defaultValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const quotation: QuotationRecord = {
    id: quotationId,
    applicationId: dto.applicationId,
    customerName: dto.customerName.trim(),
    businessName: dto.businessName.trim(),
    email: dto.email.trim().toLowerCase(),
    mobileNumber: dto.mobileNumber.trim(),
    businessAddress: dto.businessAddress?.trim() || "",
    websiteType: dto.websiteType,
    currency: dto.currency || "INR",
    selectedPackage: dto.selectedPackage,
    developmentCharges: dto.developmentCharges,
    annualServiceCharges: dto.annualServiceCharges,
    additionalCharges: dto.additionalCharges || [],
    breakdown,
    scopeDeliverables: dto.scopeDeliverables || [
      "Custom responsive interface architecture",
      "Dynamic CMS & database integration",
      "SEO semantic optimization & metadata",
      "SSL deployment & high-speed cloud hosting setup",
      "30-day post-launch warranty & bug fixes",
    ],
    estimatedTimeline: dto.estimatedTimeline || "2-3 weeks from advance payment receipt",
    paymentTerms:
      dto.paymentTerms ||
      `${breakdown.advancePayment} advance mobilization deposit upon acceptance. Balance ${breakdown.remainingPayment} payable upon final demonstration and production signoff.`,
    validUntil: dto.validUntil || defaultValidUntil,
    status: "Sent to Customer",
    createdAt: now,
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(QUOTATIONS_COLLECTION).doc(quotationId).set(quotation);
    } catch (err) {
      console.warn("Firestore quotation write failed, falling back to memory:", err);
      memoryQuotations.set(quotationId, quotation);
    }
  } else {
    memoryQuotations.set(quotationId, quotation);
  }

  // Update associated application status to "Quotation Prepared"
  try {
    await updateApplicationStatus(dto.applicationId, "Quotation Prepared");
  } catch (err) {
    console.warn("Could not transition application status:", err);
  }

  return quotation;
}

/**
 * Retrieves a quotation by its unique ID.
 */
export async function getQuotationById(id: string): Promise<QuotationRecord | null> {
  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      const doc = await db.collection(QUOTATIONS_COLLECTION).doc(id).get();
      if (doc.exists) {
        return {
          id: doc.id,
          ...(doc.data() as Omit<QuotationRecord, "id">),
        };
      }
    } catch (err) {
      console.error("Failed to query quotation from Firestore:", err);
    }
  }

  return memoryQuotations.get(id) || null;
}

/**
 * Lists quotations with optional application or status filtering.
 */
export async function listQuotations(options: {
  applicationId?: string;
  status?: QuotationStatus;
  limit?: number;
} = {}): Promise<QuotationRecord[]> {
  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      let query = db.collection(QUOTATIONS_COLLECTION).orderBy("createdAt", "desc");
      if (options.applicationId) {
        query = query.where("applicationId", "==", options.applicationId);
      }
      if (options.status) {
        query = query.where("status", "==", options.status);
      }
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const snapshot = await query.get();
      if (!snapshot.empty) {
        return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...(doc.data() as Omit<QuotationRecord, "id">),
        }));
      }
    } catch (err) {
      console.error("Failed to list quotations from Firestore:", err);
    }
  }

  let list = Array.from(memoryQuotations.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (options.applicationId) {
    list = list.filter((q) => q.applicationId === options.applicationId);
  }
  if (options.status) {
    list = list.filter((q) => q.status === options.status);
  }

  return list;
}

/**
 * Updates quotation status (e.g. Approved or Rejected by customer, or Revised by admin).
 */
export async function updateQuotationStatus(
  id: string,
  newStatus: QuotationStatus,
  feedback?: string
): Promise<QuotationRecord> {
  const quotation = await getQuotationById(id);
  if (!quotation) {
    throw new QuotationServiceError(`Quotation ${id} was not found.`, "NOT_FOUND");
  }

  const now = new Date().toISOString();
  const updated: QuotationRecord = {
    ...quotation,
    status: newStatus,
    updatedAt: now,
    ...(feedback ? { customerFeedback: feedback } : {}),
    ...(newStatus === "Approved" ? { approvedAt: now } : {}),
    ...(newStatus === "Rejected" ? { rejectedAt: now } : {}),
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      const updatePayload: Record<string, unknown> = {
        status: newStatus,
        updatedAt: now,
      };
      if (feedback) updatePayload.customerFeedback = feedback;
      if (newStatus === "Approved") updatePayload.approvedAt = now;
      if (newStatus === "Rejected") updatePayload.rejectedAt = now;

      await db.collection(QUOTATIONS_COLLECTION).doc(id).update(updatePayload);
    } catch (err) {
      console.warn("Failed to update quotation in Firestore, updating local memory:", err);
      memoryQuotations.set(id, updated);
    }
  } else {
    memoryQuotations.set(id, updated);
  }

  // Update application status in sync
  try {
    if (newStatus === "Approved") {
      await updateApplicationStatus(quotation.applicationId, "Payment Pending");
    } else if (newStatus === "Rejected") {
      await updateApplicationStatus(quotation.applicationId, "Under Review");
    }
  } catch (err) {
    console.warn("Could not synchronize application status:", err);
  }

  return updated;
}

