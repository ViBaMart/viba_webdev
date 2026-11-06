import { getAdminFirebase } from "@/lib/firebase/admin";
import {
  CustomerProfile,
  CustomerDocumentItem,
  CustomerDashboardData,
  CustomerDashboardStats,
  UpdateCustomerProfileDTO,
} from "@/types/customerDashboard";
import { listApplications } from "@/services/applicationService";
import { listQuotations } from "@/services/quotationService";
import { listPayments } from "@/services/paymentService";
import { listCustomerProjects } from "@/services/customerProjectService";
import { CustomerApplication } from "@/types/application";
import { QuotationRecord } from "@/types/quotation";
import { PaymentRecord } from "@/types/payment";
import { CustomerProjectRecord } from "@/types/customerProject";

const PROFILES_COLLECTION = "customer_profiles";
const APPLICATIONS_COLLECTION = "applications";
const QUOTATIONS_COLLECTION = "quotations";
const PAYMENTS_COLLECTION = "payments";
const PROJECTS_COLLECTION = "customer_projects";

// In-memory fallback cache for development or when Firebase credentials are not provisioned
const memoryCustomerProfiles = new Map<string, CustomerProfile>();

export class CustomerDashboardError extends Error {
  code: "NOT_FOUND" | "UNAUTHORIZED" | "VALIDATION_FAILED" | "DATABASE_ERROR";

  constructor(message: string, code: "NOT_FOUND" | "UNAUTHORIZED" | "VALIDATION_FAILED" | "DATABASE_ERROR") {
    super(message);
    this.name = "CustomerDashboardError";
    this.code = code;
  }
}

/**
 * Creates or synchronizes a customer profile document upon authentication,
 * and permanently links customer records (applications, quotations, payments, projects)
 * using their authenticated user ID (uid).
 */
export async function syncCustomerProfile(userData: {
  uid: string;
  email: string;
  displayName?: string;
  businessName?: string;
  mobileNumber?: string;
  businessAddress?: string;
  photoURL?: string;
}): Promise<CustomerProfile> {
  const uid = userData.uid;
  const email = userData.email.toLowerCase().trim();
  const now = new Date().toISOString();

  const { db, configured } = getAdminFirebase();

  let existingProfile: CustomerProfile | null = null;

  if (configured && db) {
    try {
      const doc = await db.collection(PROFILES_COLLECTION).doc(uid).get();
      if (doc.exists) {
        existingProfile = {
          uid: doc.id,
          ...(doc.data() as Omit<CustomerProfile, "uid">),
        };
      }
    } catch (err) {
      console.warn("Failed to read customer profile from Firestore:", err);
    }
  } else {
    existingProfile = memoryCustomerProfiles.get(uid) || null;
  }

  const profile: CustomerProfile = {
    uid,
    email,
    displayName: userData.displayName?.trim() || existingProfile?.displayName || "Valued Client",
    businessName: userData.businessName?.trim() || existingProfile?.businessName || "My Business",
    mobileNumber: userData.mobileNumber?.trim() || existingProfile?.mobileNumber || "",
    businessAddress: userData.businessAddress?.trim() || existingProfile?.businessAddress || "",
    photoURL: userData.photoURL || existingProfile?.photoURL || "",
    createdAt: existingProfile?.createdAt || now,
    updatedAt: now,
  };

  // Persist Profile
  if (configured && db) {
    try {
      await db.collection(PROFILES_COLLECTION).doc(uid).set(profile, { merge: true });
    } catch (err) {
      console.warn("Failed to persist customer profile in Firestore:", err);
      memoryCustomerProfiles.set(uid, profile);
    }
  } else {
    memoryCustomerProfiles.set(uid, profile);
  }

  // Connect customer records using authenticated user ID (uid) across all collections
  if (configured && db) {
    try {
      // 1. Applications
      const appSnap = await db.collection(APPLICATIONS_COLLECTION).where("email", "==", email).get();
      const appBatch = db.batch();
      let appsUpdated = false;
      appSnap.forEach((doc) => {
        const data = doc.data();
        if (data.userId !== uid) {
          appBatch.update(doc.ref, { userId: uid, updatedAt: now });
          appsUpdated = true;
        }
      });
      if (appsUpdated) await appBatch.commit();

      // 2. Quotations
      const quoteSnap = await db.collection(QUOTATIONS_COLLECTION).where("email", "==", email).get();
      const quoteBatch = db.batch();
      let quotesUpdated = false;
      quoteSnap.forEach((doc) => {
        const data = doc.data();
        if (data.userId !== uid) {
          quoteBatch.update(doc.ref, { userId: uid, updatedAt: now });
          quotesUpdated = true;
        }
      });
      if (quotesUpdated) await quoteBatch.commit();

      // 3. Payments
      const paySnap = await db.collection(PAYMENTS_COLLECTION).where("customerEmail", "==", email).get();
      const payBatch = db.batch();
      let paysUpdated = false;
      paySnap.forEach((doc) => {
        const data = doc.data();
        if (data.userId !== uid) {
          payBatch.update(doc.ref, { userId: uid, updatedAt: now });
          paysUpdated = true;
        }
      });
      if (paysUpdated) await payBatch.commit();

      // 4. Projects
      const projSnap = await db.collection(PROJECTS_COLLECTION).where("clientEmail", "==", email).get();
      const projBatch = db.batch();
      let projsUpdated = false;
      projSnap.forEach((doc) => {
        const data = doc.data();
        if (data.userId !== uid) {
          projBatch.update(doc.ref, { userId: uid, updatedAt: now });
          projsUpdated = true;
        }
      });
      if (projsUpdated) await projBatch.commit();
    } catch (err) {
      console.warn("Failed to link customer records in Firestore:", err);
    }
  }

  return profile;
}

/**
 * Retrieves customer profile.
 */
export async function getCustomerProfile(uid: string, email?: string): Promise<CustomerProfile | null> {
  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      const doc = await db.collection(PROFILES_COLLECTION).doc(uid).get();
      if (doc.exists) {
        return {
          uid: doc.id,
          ...(doc.data() as Omit<CustomerProfile, "uid">),
        };
      }
    } catch (err) {
      console.warn("Failed to get profile from Firestore:", err);
    }
  }

  const memoryProfile = memoryCustomerProfiles.get(uid);
  if (memoryProfile) return memoryProfile;

  if (email) {
    // Generate an in-memory profile if none existed yet
    return syncCustomerProfile({ uid, email });
  }

  return null;
}

/**
 * Updates customer profile details.
 */
export async function updateCustomerProfile(
  uid: string,
  updates: UpdateCustomerProfileDTO
): Promise<CustomerProfile> {
  const profile = await getCustomerProfile(uid);
  if (!profile) {
    throw new CustomerDashboardError(`Profile not found for user ${uid}`, "NOT_FOUND");
  }

  const now = new Date().toISOString();
  const updated: CustomerProfile = {
    ...profile,
    displayName: updates.displayName?.trim() || profile.displayName,
    businessName: updates.businessName?.trim() || profile.businessName,
    mobileNumber: updates.mobileNumber?.trim() || profile.mobileNumber,
    businessAddress: updates.businessAddress?.trim() ?? profile.businessAddress,
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(PROFILES_COLLECTION).doc(uid).set(updated, { merge: true });
    } catch (err) {
      console.warn("Failed to update profile in Firestore:", err);
      memoryCustomerProfiles.set(uid, updated);
    }
  } else {
    memoryCustomerProfiles.set(uid, updated);
  }

  return updated;
}

/**
 * Consolidates all logged-in customer data across the 8 dashboard sections:
 * - Profile
 * - Applications
 * - Quotations
 * - Payments
 * - Projects
 * - Progress
 * - Documents
 * - Final Delivery
 */
export async function getCustomerDashboardData(
  uid: string,
  userEmail: string
): Promise<CustomerDashboardData> {
  const normalizedEmail = userEmail.toLowerCase().trim();

  // 1. Get or sync profile
  let profile = await getCustomerProfile(uid);
  if (!profile) {
    profile = await syncCustomerProfile({ uid, email: normalizedEmail });
  }

  // 2. Fetch all user records concurrently
  const [allApps, allQuotes, allPayments, allProjects] = await Promise.all([
    listApplications(100).catch(() => [] as CustomerApplication[]),
    listQuotations({ limit: 100 }).catch(() => [] as QuotationRecord[]),
    listPayments().catch(() => [] as PaymentRecord[]),
    listCustomerProjects().catch(() => [] as CustomerProjectRecord[]),
  ]);

  // 3. Filter strictly for this customer by authenticated user ID (uid) OR verified email
  const applications = allApps.filter(
    (app) => app.userId === uid || (app.email && app.email.toLowerCase() === normalizedEmail)
  );

  const quotations = allQuotes.filter(
    (q) => q.userId === uid || (q.email && q.email.toLowerCase() === normalizedEmail)
  );

  const payments = allPayments.filter(
    (p) => p.userId === uid || (p.customerEmail && p.customerEmail.toLowerCase() === normalizedEmail)
  );

  const projects = allProjects.filter(
    (proj) => proj.userId === uid || (proj.clientEmail && proj.clientEmail.toLowerCase() === normalizedEmail)
  );

  // 4. Extract approved documents and deliverables for Section 7: "My Documents"
  const documents: CustomerDocumentItem[] = [];

  // Quotation documents
  quotations.forEach((quote) => {
    documents.push({
      id: `doc-quote-${quote.id}`,
      title: `Official Quotation & Scope - ${quote.businessName || quote.customerName} (${quote.id})`,
      category: "Approved Quotation",
      url: `/quotations/${quote.id}`,
      createdAt: quote.approvedAt || quote.createdAt,
      type: "pdf",
      sourceId: quote.id,
    });
  });

  // Project shared deliverables & builds
  projects.forEach((proj) => {
    if (proj.sharedFiles && Array.isArray(proj.sharedFiles)) {
      proj.sharedFiles.forEach((file) => {
        let cat: CustomerDocumentItem["category"] = "Documentation";
        let type: CustomerDocumentItem["type"] = "document";

        if (file.category === "Design Mockups") {
          cat = "Design Deliverable";
          type = "image";
        } else if (file.category === "Preview Builds") {
          cat = "Preview Build";
          type = "link";
        }

        documents.push({
          id: `doc-file-${file.id}`,
          title: file.name,
          category: cat,
          url: file.url,
          size: file.size,
          createdAt: file.uploadedAt,
          type,
          sourceId: proj.id,
        });
      });
    }
  });

  // Application attachments
  applications.forEach((app) => {
    if (app.files && Array.isArray(app.files)) {
      app.files.forEach((f, idx) => {
        documents.push({
          id: `doc-app-${app.id}-${idx}`,
          title: f.originalName || f.name,
          category: "Customer Attachment",
          url: f.url,
          size: f.size,
          createdAt: f.uploadedAt,
          type: "document",
          sourceId: app.id,
        });
      });
    }
  });

  // 5. Compute Stats
  const approvedQuotes = quotations.filter((q) => q.status === "Approved");
  const totalAgreed = payments.reduce((acc, p) => acc + (p.totalAmount || 0), 0);
  const totalPaid = payments.reduce((acc, p) => acc + (p.amountPaid || 0), 0);
  const remaining = Math.max(0, totalAgreed - totalPaid);
  const activeProjectsCount = projects.filter((p) => !p.isDeliveryApproved).length;
  const deliveredProjectsCount = projects.filter((p) => p.isDeliveryApproved).length;

  const stats: CustomerDashboardStats = {
    totalApplications: applications.length,
    approvedQuotations: approvedQuotes.length,
    totalAgreedAmount: totalAgreed,
    totalPaidAmount: totalPaid,
    remainingAmount: remaining,
    activeProjects: activeProjectsCount,
    deliveredProjects: deliveredProjectsCount,
  };

  return {
    profile,
    applications,
    quotations,
    payments,
    projects,
    documents,
    stats,
  };
}
