import { getAdminFirebase } from "@/lib/firebase/admin";
import {
  DomainRecord,
  DomainWithExpiryMeta,
  CreateDomainDTO,
  UpdateDomainDTO,
  RecordRenewalDTO,
  DomainRenewalRecord,
  DomainStats,
  DomainManagementStatus,
} from "@/types/domain";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

const DOMAINS_COLLECTION = "domains";

// In-memory fallback store for local development when Firebase Admin is in offline mode
const memoryDomains = new Map<string, DomainRecord>();

export class DomainServiceError extends Error {
  code: "NOT_FOUND" | "VALIDATION_FAILED" | "DATABASE_ERROR";

  constructor(message: string, code: "NOT_FOUND" | "VALIDATION_FAILED" | "DATABASE_ERROR") {
    super(message);
    this.name = "DomainServiceError";
    this.code = code;
  }
}

export function generateDomainId(): string {
  const year = 2026;
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `VIBA-DOM-${year}-${suffix}`;
}

export function cleanDomainName(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/.*$/, "");
}

/**
 * Calculates remaining days until expiry from given ISO date (YYYY-MM-DD).
 * Positive = active/upcoming, 0 = today, Negative = expired.
 */
export function calculateDaysUntilExpiry(expiryDateStr: string): number {
  if (!expiryDateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Computes appropriate management status based on expiry countdown,
 * while preserving manual overrides (Transferred Out, Cancelled, Pending Transfer).
 */
export function computeManagementStatus(
  expiryDateStr: string,
  explicitStatus?: DomainManagementStatus
): DomainManagementStatus {
  if (
    explicitStatus === "Cancelled" ||
    explicitStatus === "Pending Transfer" ||
    explicitStatus === "Transferred Out"
  ) {
    return explicitStatus;
  }

  const days = calculateDaysUntilExpiry(expiryDateStr);
  if (days < 0) return "Expired";
  if (days <= 30) return "Expiring Soon";
  return "Active";
}

/**
 * Decorates a DomainRecord with live expiry metadata.
 */
export function attachExpiryMeta(domain: DomainRecord): DomainWithExpiryMeta {
  const daysUntilExpiry = calculateDaysUntilExpiry(domain.expiryDate);
  const isExpired = daysUntilExpiry < 0;
  const isExpiringSoon = daysUntilExpiry >= 0 && daysUntilExpiry <= 30;

  // Dynamically update status if it is date-driven
  let managementStatus = domain.managementStatus;
  if (managementStatus === "Active" || managementStatus === "Expiring Soon" || managementStatus === "Expired") {
    managementStatus = computeManagementStatus(domain.expiryDate, domain.managementStatus);
  }

  return {
    ...domain,
    managementStatus,
    daysUntilExpiry,
    isExpiringSoon,
    isExpired,
  };
}

/**
 * Creates and registers a new managed customer domain record in Firestore.
 */
export async function createDomain(dto: CreateDomainDTO): Promise<DomainWithExpiryMeta> {
  const domainName = cleanDomainName(dto.domainName);
  if (!domainName || !domainName.includes(".")) {
    throw new DomainServiceError("A valid domain name is required (e.g. yourbusiness.com).", "VALIDATION_FAILED");
  }

  if (!dto.customerName || !dto.customerName.trim()) {
    throw new DomainServiceError("Customer name is required.", "VALIDATION_FAILED");
  }

  if (!dto.registrar || !dto.registrar.trim()) {
    throw new DomainServiceError("Domain registrar is required (e.g. GoDaddy, Namecheap, Cloudflare).", "VALIDATION_FAILED");
  }

  if (!dto.registrationDate || !dto.expiryDate) {
    throw new DomainServiceError("Registration date and expiry date are required.", "VALIDATION_FAILED");
  }

  if (new Date(dto.expiryDate) <= new Date(dto.registrationDate)) {
    throw new DomainServiceError("Expiry date must be after registration date.", "VALIDATION_FAILED");
  }

  const id = generateDomainId();
  const now = new Date().toISOString();
  const initialStatus = computeManagementStatus(dto.expiryDate, dto.managementStatus);

  const domain: DomainRecord = {
    id,
    customerName: dto.customerName.trim(),
    customerEmail: dto.customerEmail?.trim().toLowerCase(),
    customerId: dto.customerId?.trim(),
    applicationId: dto.applicationId?.trim(),
    domainName,
    registrar: dto.registrar.trim(),
    registrationDate: dto.registrationDate,
    expiryDate: dto.expiryDate,
    registrationCost: Number(dto.registrationCost) || 0,
    renewalCost: Number(dto.renewalCost) || 0,
    customerPaymentStatus: dto.customerPaymentStatus || "Pending",
    managementStatus: initialStatus,
    currency: dto.currency || "INR",
    autoRenewalConfigured: Boolean(dto.autoRenewalConfigured),
    dnsProvider: dto.dnsProvider?.trim() || dto.registrar.trim(),
    nameservers: Array.isArray(dto.nameservers) ? dto.nameservers : [],
    notes: dto.notes?.trim() || "",
    renewalHistory: [],
    createdAt: now,
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(DOMAINS_COLLECTION).doc(id).set(domain);
    } catch (err) {
      console.warn("Firestore domain write failed, using memory:", err);
      memoryDomains.set(id, domain);
    }
  } else {
    memoryDomains.set(id, domain);
  }

  return attachExpiryMeta(domain);
}

/**
 * Retrieves a single domain record with expiry metadata by ID.
 */
export async function getDomainById(id: string): Promise<DomainWithExpiryMeta | null> {
  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      const doc = await db.collection(DOMAINS_COLLECTION).doc(id).get();
      if (doc.exists) {
        const domain = {
          id: doc.id,
          ...(doc.data() as Omit<DomainRecord, "id">),
        };
        return attachExpiryMeta(domain);
      }
    } catch (err) {
      console.error("Failed to query domain from Firestore:", err);
    }
  }

  const local = memoryDomains.get(id);
  return local ? attachExpiryMeta(local) : null;
}

/**
 * Lists all managed domains with search, expiry filtering, customer filtering, and summary statistics.
 */
export async function listDomains(options: {
  search?: string;
  status?: string;
  expiryFilter?: "all" | "30_days" | "60_days" | "expired" | "active";
  paymentStatus?: string;
  customerEmail?: string;
  customerName?: string;
  limit?: number;
} = {}): Promise<{ domains: DomainWithExpiryMeta[]; stats: DomainStats }> {
  let records: DomainRecord[] = [];

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      const snapshot = await db.collection(DOMAINS_COLLECTION).orderBy("expiryDate", "asc").get();
      if (!snapshot.empty) {
        records = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...(doc.data() as Omit<DomainRecord, "id">),
        }));
      }
    } catch (err) {
      console.warn("Failed to query domains from Firestore, using memory:", err);
      records = Array.from(memoryDomains.values());
    }
  } else {
    records = Array.from(memoryDomains.values());
  }

  // Attach metadata
  let list = records.map(attachExpiryMeta);

  // 1. Search Query (matches domainName, customerName, registrar, or notes)
  if (options.search && options.search.trim()) {
    const q = options.search.trim().toLowerCase();
    list = list.filter(
      (d) =>
        d.domainName.toLowerCase().includes(q) ||
        d.customerName.toLowerCase().includes(q) ||
        (d.customerEmail && d.customerEmail.toLowerCase().includes(q)) ||
        d.registrar.toLowerCase().includes(q) ||
        (d.notes && d.notes.toLowerCase().includes(q))
    );
  }

  // 2. Status Filter
  if (options.status && options.status !== "All") {
    list = list.filter((d) => d.managementStatus.toLowerCase() === options.status?.toLowerCase());
  }

  // 3. Expiry Filter
  if (options.expiryFilter && options.expiryFilter !== "all") {
    if (options.expiryFilter === "30_days") {
      list = list.filter((d) => d.daysUntilExpiry >= 0 && d.daysUntilExpiry <= 30);
    } else if (options.expiryFilter === "60_days") {
      list = list.filter((d) => d.daysUntilExpiry >= 0 && d.daysUntilExpiry <= 60);
    } else if (options.expiryFilter === "expired") {
      list = list.filter((d) => d.daysUntilExpiry < 0);
    } else if (options.expiryFilter === "active") {
      list = list.filter((d) => d.daysUntilExpiry >= 0);
    }
  }

  // 4. Payment Status Filter
  if (options.paymentStatus && options.paymentStatus !== "All") {
    list = list.filter((d) => d.customerPaymentStatus.toLowerCase() === options.paymentStatus?.toLowerCase());
  }

  // 5. Customer Email or Name Filter (Customer-wise history)
  if (options.customerEmail) {
    const emailLower = options.customerEmail.toLowerCase().trim();
    list = list.filter((d) => d.customerEmail && d.customerEmail.toLowerCase() === emailLower);
  } else if (options.customerName) {
    const nameLower = options.customerName.toLowerCase().trim();
    list = list.filter((d) => d.customerName.toLowerCase().includes(nameLower));
  }

  // Sort by urgency: expired and soonest expiring first
  list.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

  // Calculate live statistics
  const allDecorated = records.map(attachExpiryMeta);
  const stats: DomainStats = {
    totalDomains: allDecorated.length,
    activeDomains: allDecorated.filter((d) => d.managementStatus === "Active" || d.daysUntilExpiry > 30).length,
    expiringSoon: allDecorated.filter((d) => d.isExpiringSoon).length,
    expired: allDecorated.filter((d) => d.isExpired).length,
    totalAnnualRenewalCost: allDecorated.reduce((sum, d) => sum + (d.renewalCost || 0), 0),
    pendingCustomerPayments: allDecorated.filter(
      (d) => d.customerPaymentStatus === "Pending" || d.customerPaymentStatus === "Overdue"
    ).length,
  };

  const limitCount = options.limit || 100;
  return {
    domains: list.slice(0, limitCount),
    stats,
  };
}

/**
 * Updates domain fields (e.g. registrar, costs, payment status, management status).
 */
export async function updateDomain(id: string, updates: UpdateDomainDTO): Promise<DomainWithExpiryMeta> {
  const current = await getDomainById(id);
  if (!current) {
    throw new DomainServiceError(`Domain record "${id}" was not found.`, "NOT_FOUND");
  }

  const now = new Date().toISOString();
  const newExpiry = updates.expiryDate || current.expiryDate;
  const newStatus = computeManagementStatus(newExpiry, updates.managementStatus || current.managementStatus);

  const updated: DomainRecord = {
    ...current,
    customerName: updates.customerName !== undefined ? updates.customerName.trim() : current.customerName,
    customerEmail: updates.customerEmail !== undefined ? updates.customerEmail.trim().toLowerCase() : current.customerEmail,
    customerId: updates.customerId !== undefined ? updates.customerId.trim() : current.customerId,
    applicationId: updates.applicationId !== undefined ? updates.applicationId.trim() : current.applicationId,
    domainName: updates.domainName ? cleanDomainName(updates.domainName) : current.domainName,
    registrar: updates.registrar !== undefined ? updates.registrar.trim() : current.registrar,
    registrationDate: updates.registrationDate || current.registrationDate,
    expiryDate: newExpiry,
    registrationCost: updates.registrationCost !== undefined ? Number(updates.registrationCost) : current.registrationCost,
    renewalCost: updates.renewalCost !== undefined ? Number(updates.renewalCost) : current.renewalCost,
    customerPaymentStatus: updates.customerPaymentStatus || current.customerPaymentStatus,
    managementStatus: newStatus,
    currency: updates.currency || current.currency,
    autoRenewalConfigured: updates.autoRenewalConfigured !== undefined ? updates.autoRenewalConfigured : current.autoRenewalConfigured,
    dnsProvider: updates.dnsProvider !== undefined ? updates.dnsProvider.trim() : current.dnsProvider,
    nameservers: updates.nameservers !== undefined ? updates.nameservers : current.nameservers,
    notes: updates.notes !== undefined ? updates.notes.trim() : current.notes,
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(DOMAINS_COLLECTION).doc(id).set(updated, { merge: true });
    } catch (err) {
      console.warn("Failed to update domain in Firestore:", err);
      memoryDomains.set(id, updated);
    }
  } else {
    memoryDomains.set(id, updated);
  }

  return attachExpiryMeta(updated);
}

/**
 * Records an official manual domain renewal event performed by admin at the external registrar.
 * Updates expiry date, appends to renewal history, updates status, and tracks costs.
 */
export async function recordDomainRenewal(
  id: string,
  dto: RecordRenewalDTO,
  adminEmail: string
): Promise<DomainWithExpiryMeta> {
  const current = await getDomainById(id);
  if (!current) {
    throw new DomainServiceError(`Domain record "${id}" was not found.`, "NOT_FOUND");
  }

  if (!dto.newExpiryDate) {
    throw new DomainServiceError("New expiry date is required.", "VALIDATION_FAILED");
  }

  if (new Date(dto.newExpiryDate) <= new Date(current.expiryDate)) {
    throw new DomainServiceError("New expiry date must be further in the future than the current expiry date.", "VALIDATION_FAILED");
  }

  const now = new Date().toISOString();
  const renewalItem: DomainRenewalRecord = {
    id: `REN-${Date.now()}`,
    renewalDate: dto.renewalDate || now.split("T")[0],
    previousExpiryDate: current.expiryDate,
    newExpiryDate: dto.newExpiryDate,
    cost: Number(dto.renewalCost) || current.renewalCost,
    customerPaymentStatus: dto.customerPaymentStatus || "Paid",
    renewedBy: adminEmail,
    invoiceReference: dto.invoiceReference?.trim(),
    notes: dto.notes?.trim(),
    createdAt: now,
  };

  const newStatus = computeManagementStatus(dto.newExpiryDate, "Active");

  const updated: DomainRecord = {
    ...current,
    expiryDate: dto.newExpiryDate,
    renewalCost: Number(dto.renewalCost) || current.renewalCost,
    customerPaymentStatus: dto.customerPaymentStatus || current.customerPaymentStatus,
    managementStatus: newStatus,
    renewalHistory: [renewalItem, ...(current.renewalHistory || [])],
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(DOMAINS_COLLECTION).doc(id).set(updated, { merge: true });
    } catch (err) {
      console.warn("Failed to save domain renewal in Firestore:", err);
      memoryDomains.set(id, updated);
    }
  } else {
    memoryDomains.set(id, updated);
  }

  return attachExpiryMeta(updated);
}

/**
 * Deletes a domain record.
 */
export async function deleteDomain(id: string): Promise<boolean> {
  const current = await getDomainById(id);
  if (!current) {
    throw new DomainServiceError(`Domain record "${id}" was not found.`, "NOT_FOUND");
  }

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(DOMAINS_COLLECTION).doc(id).delete();
    } catch (err) {
      console.warn("Failed to delete domain from Firestore:", err);
      memoryDomains.delete(id);
    }
  } else {
    memoryDomains.delete(id);
  }

  return true;
}

/**
 * Retrieves all domains, renewals, and history for a specific customer (customer-wise domain history).
 */
export async function getCustomerDomainHistory(customerIdentifier: string): Promise<DomainWithExpiryMeta[]> {
  const { domains } = await listDomains({
    customerEmail: customerIdentifier.includes("@") ? customerIdentifier : undefined,
    customerName: !customerIdentifier.includes("@") ? customerIdentifier : undefined,
    limit: 100,
  });
  return domains;
}

