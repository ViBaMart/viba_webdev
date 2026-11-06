import { getAdminFirebase } from "@/lib/firebase/admin";
import { CreateCustomerDTO, Customer, CustomerStatus, CustomerTier } from "@/types/customer";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

const COLLECTION_NAME = "customers";

export class CustomerServiceError extends Error {
  constructor(message: string, public code: "NOT_CONFIGURED" | "VALIDATION_FAILED" | "DATABASE_ERROR" | "NOT_FOUND") {
    super(message);
    this.name = "CustomerServiceError";
  }
}

/**
 * Service managing customer records and tenant configurations for multi-tenant scaling.
 */
export async function createCustomer(dto: CreateCustomerDTO): Promise<Customer> {
  const { db, configured } = getAdminFirebase();

  if (!configured || !db) {
    throw new CustomerServiceError(
      "Firebase Admin database is not configured. Please supply FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.",
      "NOT_CONFIGURED"
    );
  }

  if (!dto.companyName?.trim()) {
    throw new CustomerServiceError("Company name is required.", "VALIDATION_FAILED");
  }
  if (!dto.primaryContactEmail?.trim()) {
    throw new CustomerServiceError("Contact email is required.", "VALIDATION_FAILED");
  }

  const now = new Date().toISOString();
  const tenantId = `tenant_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const tier: CustomerTier = dto.tier || "growth";
  const status: CustomerStatus = "onboarding";

  const customerData: Omit<Customer, "id"> = {
    tenantId,
    companyName: dto.companyName.trim(),
    primaryContactName: dto.primaryContactName.trim(),
    primaryContactEmail: dto.primaryContactEmail.trim().toLowerCase(),
    contactPhone: dto.contactPhone?.trim(),
    tier,
    status,
    settings: {
      primaryDomain: dto.primaryDomain?.trim() || `${tenantId}.vibawebdev.com`,
      customDomainEnabled: tier === "enterprise",
      sslStatus: "pending",
      allowedOrigins: [`https://${dto.primaryDomain || `${tenantId}.vibawebdev.com`}`],
      featuresEnabled: ["web_portal", "api_access", "analytics"],
      maxProjects: tier === "enterprise" ? 100 : tier === "growth" ? 25 : 5,
    },
    createdAt: now,
    updatedAt: now,
  };

  try {
    const docRef = await db.collection(COLLECTION_NAME).add(customerData);
    return {
      id: docRef.id,
      ...customerData,
    };
  } catch (error) {
    throw new CustomerServiceError(
      `Failed to create customer record in Firestore: ${error instanceof Error ? error.message : "Unknown error"}`,
      "DATABASE_ERROR"
    );
  }
}

export async function listCustomers(limitCount: number = 50): Promise<Customer[]> {
  const { db, configured } = getAdminFirebase();

  if (!configured || !db) {
    throw new CustomerServiceError(
      "Firebase Admin database is not configured.",
      "NOT_CONFIGURED"
    );
  }

  try {
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .orderBy("createdAt", "desc")
      .limit(limitCount)
      .get();

    return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...(doc.data() as Omit<Customer, "id">),
    }));
  } catch (error) {
    throw new CustomerServiceError(
      `Failed to query customers: ${error instanceof Error ? error.message : "Unknown error"}`,
      "DATABASE_ERROR"
    );
  }
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const { db, configured } = getAdminFirebase();

  if (!configured || !db) {
    throw new CustomerServiceError(
      "Firebase Admin database is not configured.",
      "NOT_CONFIGURED"
    );
  }

  try {
    const doc = await db.collection(COLLECTION_NAME).doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return {
      id: doc.id,
      ...(doc.data() as Omit<Customer, "id">),
    };
  } catch (error) {
    throw new CustomerServiceError(
      `Failed to fetch customer: ${error instanceof Error ? error.message : "Unknown error"}`,
      "DATABASE_ERROR"
    );
  }
}
