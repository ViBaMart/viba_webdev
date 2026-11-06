import { getAdminFirebase } from "@/lib/firebase/admin";
import {
  CustomerQuotation,
  CustomerProject,
  QuotationStatus,
} from "@/types/application";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

const QUOTATIONS_COLLECTION = "quotations";
const PROJECTS_COLLECTION = "customer_projects";

// In-memory fallback stores for dev environments without active Firestore credentials
const memoryQuotations = new Map<string, CustomerQuotation>();
const memoryProjects = new Map<string, CustomerProject>();

export class AdminServiceError extends Error {
  code: "VALIDATION_FAILED" | "NOT_FOUND" | "DATABASE_ERROR";

  constructor(
    message: string,
    code: "VALIDATION_FAILED" | "NOT_FOUND" | "DATABASE_ERROR"
  ) {
    super(message);
    this.name = "AdminServiceError";
    this.code = code;
  }
}

/**
 * Generates an official human-readable Quotation ID.
 * Format: VIBA-QUOTE-2026-XXXXX
 */
export function generateQuotationId(): string {
  const currentYear = 2026;
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `VIBA-QUOTE-${currentYear}-${suffix}`;
}

/**
 * Generates an official human-readable Project ID.
 * Format: VIBA-PRJ-2026-XXXXX
 */
export function generateProjectId(): string {
  const currentYear = 2026;
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `VIBA-PRJ-${currentYear}-${suffix}`;
}

/**
 * Saves a quotation into Firestore collection `quotations`.
 */
export async function createQuotation(
  data: Omit<CustomerQuotation, "id" | "createdAt" | "updatedAt">
): Promise<CustomerQuotation> {
  const quotationId = generateQuotationId();
  const now = new Date().toISOString();

  const quotation: CustomerQuotation = {
    ...data,
    id: quotationId,
    createdAt: now,
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(QUOTATIONS_COLLECTION).doc(quotationId).set(quotation);
    } catch (err) {
      console.warn("Firestore write failed for quotation, falling back to memory:", err);
      memoryQuotations.set(quotationId, quotation);
    }
  } else {
    memoryQuotations.set(quotationId, quotation);
  }

  return quotation;
}

/**
 * Lists quotations from Firestore.
 */
export async function listQuotations(): Promise<CustomerQuotation[]> {
  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      const snapshot = await db
        .collection(QUOTATIONS_COLLECTION)
        .orderBy("createdAt", "desc")
        .get();

      if (!snapshot.empty) {
        return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...(doc.data() as Omit<CustomerQuotation, "id">),
        }));
      }
    } catch (err) {
      console.error("Failed to query quotations from Firestore:", err);
    }
  }

  return Array.from(memoryQuotations.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Updates quotation status in Firestore.
 */
export async function updateQuotationStatus(
  id: string,
  status: QuotationStatus
): Promise<CustomerQuotation> {
  const quotations = await listQuotations();
  const quotation = quotations.find((q) => q.id === id);
  if (!quotation) {
    throw new AdminServiceError(`Quotation ${id} was not found.`, "NOT_FOUND");
  }

  const now = new Date().toISOString();
  const updated: CustomerQuotation = {
    ...quotation,
    status,
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(QUOTATIONS_COLLECTION).doc(id).update({
        status,
        updatedAt: now,
      });
    } catch (err) {
      console.warn("Failed to update quotation in Firestore, updating local memory:", err);
      memoryQuotations.set(id, updated);
    }
  } else {
    memoryQuotations.set(id, updated);
  }

  return updated;
}

/**
 * Creates and tracks a customer project in Firestore collection `customer_projects`.
 */
export async function createCustomerProject(
  data: Omit<CustomerProject, "id" | "createdAt" | "updatedAt">
): Promise<CustomerProject> {
  const projectId = generateProjectId();
  const now = new Date().toISOString();

  const project: CustomerProject = {
    ...data,
    id: projectId,
    createdAt: now,
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(PROJECTS_COLLECTION).doc(projectId).set(project);
    } catch (err) {
      console.warn("Firestore write failed for project, falling back to memory:", err);
      memoryProjects.set(projectId, project);
    }
  } else {
    memoryProjects.set(projectId, project);
  }

  return project;
}

/**
 * Lists all active and completed customer projects.
 */
export async function listCustomerProjects(): Promise<CustomerProject[]> {
  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      const snapshot = await db
        .collection(PROJECTS_COLLECTION)
        .orderBy("createdAt", "desc")
        .get();

      if (!snapshot.empty) {
        return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...(doc.data() as Omit<CustomerProject, "id">),
        }));
      }
    } catch (err) {
      console.error("Failed to query customer projects from Firestore:", err);
    }
  }

  return Array.from(memoryProjects.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Updates a customer project (status, progress, milestones, notes, URLs).
 */
export async function updateCustomerProject(
  id: string,
  updates: Partial<CustomerProject>
): Promise<CustomerProject> {
  const projects = await listCustomerProjects();
  const project = projects.find((p) => p.id === id);
  if (!project) {
    throw new AdminServiceError(`Project ${id} was not found.`, "NOT_FOUND");
  }

  const now = new Date().toISOString();
  const updated: CustomerProject = {
    ...project,
    ...updates,
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      const payload: Partial<CustomerProject> = { ...updated };
      delete payload.id;
      await db.collection(PROJECTS_COLLECTION).doc(id).set(payload, { merge: true });
    } catch (err) {
      console.warn("Failed to update project in Firestore, updating local memory:", err);
      memoryProjects.set(id, updated);
    }
  } else {
    memoryProjects.set(id, updated);
  }

  return updated;
}
