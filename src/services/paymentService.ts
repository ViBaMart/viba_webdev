import { getAdminFirebase } from "@/lib/firebase/admin";
import {
  PaymentRecord,
  PaymentStatus,
  SubmitTransactionDTO,
  ViBaBankDetails,
  PaymentTransaction,
} from "@/types/payment";
import { QuotationRecord } from "@/types/quotation";
import { updateApplicationStatus } from "@/services/applicationService";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

const PAYMENTS_COLLECTION = "payments";

// In-memory fallback for local development or when Firebase credentials are not provisioned
const memoryPayments = new Map<string, PaymentRecord>();

export class PaymentServiceError extends Error {
  code: "VALIDATION_FAILED" | "NOT_FOUND" | "UNAUTHORIZED" | "DATABASE_ERROR";

  constructor(message: string, code: "VALIDATION_FAILED" | "NOT_FOUND" | "UNAUTHORIZED" | "DATABASE_ERROR") {
    super(message);
    this.name = "PaymentServiceError";
    this.code = code;
  }
}

export const VIBA_OFFICIAL_BANK_DETAILS: ViBaBankDetails = {
  beneficiaryName: "ViBa Web Development Solutions",
  bankName: "HDFC Bank Ltd",
  accountNumber: "50200084920194",
  ifscCode: "HDFC0001234",
  accountType: "Current Account",
  branch: "Bengaluru Tech Hub Branch, Karnataka, India",
  upiId: "vibawebdev@hdfcbank",
  paymentInstructions:
    "Please initiate payment via NEFT, IMPS, RTGS, or UPI using the official details above. Once transferred, submit your unique 12-digit UTR / Transaction Reference number. Your payment status will be updated to verified immediately upon bank settlement reconciliation by our accounts team.",
};

export function generatePaymentId(): string {
  const currentYear = 2026;
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `VIBA-PAY-${currentYear}-${suffix}`;
}

export function generateTransactionId(): string {
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `TXN-${Date.now().toString().slice(-4)}-${suffix}`;
}

/**
 * Retrieves or initializes a payment record tied to a specific quotation.
 */
export async function getOrCreatePaymentForQuotation(
  quotation: QuotationRecord
): Promise<PaymentRecord> {
  const existing = await getPaymentByQuotationId(quotation.id);
  if (existing) {
    return existing;
  }

  const paymentId = generatePaymentId();
  const now = new Date().toISOString();

  const newPayment: PaymentRecord = {
    id: paymentId,
    quotationId: quotation.id,
    applicationId: quotation.applicationId,
    customerName: quotation.customerName,
    businessName: quotation.businessName,
    customerEmail: quotation.email,
    customerMobile: quotation.mobileNumber,
    currency: quotation.currency,
    totalAmount: quotation.breakdown.totalAmount,
    advanceRequired: quotation.breakdown.advancePayment,
    remainingAmount: quotation.breakdown.remainingPayment,
    amountPaid: 0,
    status: "Unpaid",
    bankDetails: VIBA_OFFICIAL_BANK_DETAILS,
    transactions: [],
    createdAt: now,
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(PAYMENTS_COLLECTION).doc(paymentId).set(newPayment);
    } catch (err) {
      console.warn("Firestore payment create failed, falling back to memory:", err);
      memoryPayments.set(paymentId, newPayment);
    }
  } else {
    memoryPayments.set(paymentId, newPayment);
  }

  return newPayment;
}

/**
 * Retrieves payment details by quotation ID.
 */
export async function getPaymentByQuotationId(
  quotationId: string
): Promise<PaymentRecord | null> {
  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      const snapshot = await db
        .collection(PAYMENTS_COLLECTION)
        .where("quotationId", "==", quotationId)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...(doc.data() as Omit<PaymentRecord, "id">),
        };
      }
    } catch (err) {
      console.error("Failed to query payment by quotationId from Firestore:", err);
    }
  }

  for (const pay of memoryPayments.values()) {
    if (pay.quotationId === quotationId) return pay;
  }
  return null;
}

/**
 * Customer Action: Submits a transaction reference (UTR) for reconciliation.
 *
 * NOTE: Strict Security Requirement:
 * Never marks payment successful without verified admin confirmation.
 * Moves status to "Pending Advance Verification" or "Pending Final Verification".
 */
export async function submitCustomerTransaction(
  quotationId: string,
  dto: SubmitTransactionDTO
): Promise<{ payment: PaymentRecord; transaction: PaymentTransaction }> {
  if (!dto.transactionReference || dto.transactionReference.trim().length < 4) {
    throw new PaymentServiceError(
      "A valid transaction reference number or UTR is required.",
      "VALIDATION_FAILED"
    );
  }
  if (!dto.amount || dto.amount <= 0) {
    throw new PaymentServiceError("Valid transfer amount is required.", "VALIDATION_FAILED");
  }

  const payment = await getPaymentByQuotationId(quotationId);
  if (!payment) {
    throw new PaymentServiceError(`No payment record found for quotation ${quotationId}.`, "NOT_FOUND");
  }

  const now = new Date().toISOString();
  const transactionId = generateTransactionId();

  const newTransaction: PaymentTransaction = {
    id: transactionId,
    type: dto.type || (payment.amountPaid === 0 ? "advance" : "final"),
    amount: Math.round(Number(dto.amount)),
    paymentMethod: dto.paymentMethod || "UPI",
    transactionReference: dto.transactionReference.trim().toUpperCase(),
    transactionDate: dto.transactionDate || now.split("T")[0],
    customerNotes: dto.customerNotes?.trim() || "",
    submittedAt: now,
    verifiedByAdmin: false, // Strictly unverified until Admin confirms
  };

  const nextStatus: PaymentStatus =
    newTransaction.type === "advance"
      ? "Pending Advance Verification"
      : "Pending Final Verification";

  const updated: PaymentRecord = {
    ...payment,
    status: nextStatus,
    transactions: [...payment.transactions, newTransaction],
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(PAYMENTS_COLLECTION).doc(payment.id).update({
        status: nextStatus,
        transactions: updated.transactions,
        updatedAt: now,
      });
    } catch (err) {
      console.warn("Firestore payment update failed, falling back to memory:", err);
      memoryPayments.set(payment.id, updated);
    }
  } else {
    memoryPayments.set(payment.id, updated);
  }

  // Synchronize application status to Awaiting Approval / Payment Pending
  if (payment.applicationId) {
    try {
      await updateApplicationStatus(payment.applicationId, "Payment Pending");
    } catch {
      // Ignored
    }
  }

  return { payment: updated, transaction: newTransaction };
}

/**
 * Admin Action: Verifies bank settlement of transaction and confirms payment.
 *
 * NOTE: Strict Security Requirement:
 * Only an authorized Administrator can verify payment records and credit the amount.
 */
export async function verifyAndRecordPaymentByAdmin(
  quotationId: string,
  transactionId: string,
  action: "approve" | "reject",
  adminEmail: string,
  verificationNotes?: string
): Promise<PaymentRecord> {
  const payment = await getPaymentByQuotationId(quotationId);
  if (!payment) {
    throw new PaymentServiceError(`Payment for quotation ${quotationId} not found.`, "NOT_FOUND");
  }

  const txnIndex = payment.transactions.findIndex((t) => t.id === transactionId);
  if (txnIndex === -1) {
    throw new PaymentServiceError(`Transaction ${transactionId} not found.`, "NOT_FOUND");
  }

  const now = new Date().toISOString();
  const updatedTransactions = [...payment.transactions];
  const targetTxn = { ...updatedTransactions[txnIndex] };

  let newAmountPaid = payment.amountPaid;
  let newStatus: PaymentStatus = payment.status;

  if (action === "approve") {
    targetTxn.verifiedByAdmin = true;
    targetTxn.verifiedAt = now;
    targetTxn.verifiedByEmail = adminEmail;
    targetTxn.verificationNotes = verificationNotes || "Verified against bank settlement record.";

    newAmountPaid += targetTxn.amount;

    if (newAmountPaid >= payment.totalAmount) {
      newStatus = "Fully Paid";
    } else if (newAmountPaid >= payment.advanceRequired) {
      newStatus = "Advance Paid";
    }
  } else {
    targetTxn.verifiedByAdmin = false;
    targetTxn.verificationNotes = verificationNotes || "Verification declined: Transaction record mismatch.";
    newStatus = payment.amountPaid > 0 ? "Advance Paid" : "Unpaid";
  }

  updatedTransactions[txnIndex] = targetTxn;

  const remaining = Math.max(0, payment.totalAmount - newAmountPaid);
  const updated: PaymentRecord = {
    ...payment,
    amountPaid: newAmountPaid,
    remainingAmount: remaining,
    status: newStatus,
    transactions: updatedTransactions,
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(PAYMENTS_COLLECTION).doc(payment.id).update({
        amountPaid: newAmountPaid,
        remainingAmount: remaining,
        status: newStatus,
        transactions: updatedTransactions,
        updatedAt: now,
      });
    } catch (err) {
      console.warn("Firestore payment update failed, falling back to memory:", err);
      memoryPayments.set(payment.id, updated);
    }
  } else {
    memoryPayments.set(payment.id, updated);
  }

  // Update associated application status
  if (payment.applicationId) {
    try {
      if (newStatus === "Advance Paid") {
        await updateApplicationStatus(payment.applicationId, "Project Started");
      } else if (newStatus === "Fully Paid") {
        await updateApplicationStatus(payment.applicationId, "Completed");
      }
    } catch {
      // Ignored
    }
  }

  return updated;
}

/**
 * Admin Action: Directly updates payment status with verified audit note.
 */
export async function updatePaymentStatusDirectly(
  quotationId: string,
  newStatus: PaymentStatus,
  adminEmail: string,
  notes?: string
): Promise<PaymentRecord> {
  const payment = await getPaymentByQuotationId(quotationId);
  if (!payment) {
    throw new PaymentServiceError(`Payment for quotation ${quotationId} not found.`, "NOT_FOUND");
  }

  const now = new Date().toISOString();
  let amountPaid = payment.amountPaid;

  if (newStatus === "Advance Paid" && amountPaid < payment.advanceRequired) {
    amountPaid = payment.advanceRequired;
  } else if (newStatus === "Fully Paid") {
    amountPaid = payment.totalAmount;
  }

  const remaining = Math.max(0, payment.totalAmount - amountPaid);
  const updated: PaymentRecord = {
    ...payment,
    status: newStatus,
    amountPaid,
    remainingAmount: remaining,
    updatedAt: now,
  };

  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      await db.collection(PAYMENTS_COLLECTION).doc(payment.id).update({
        status: newStatus,
        amountPaid,
        remainingAmount: remaining,
        updatedAt: now,
        adminAuditNote: `${adminEmail}: ${notes || "Status updated manually."}`,
      });
    } catch (err) {
      console.warn("Firestore direct payment status update failed, falling back to memory:", err);
      memoryPayments.set(payment.id, updated);
    }
  } else {
    memoryPayments.set(payment.id, updated);
  }

  if (payment.applicationId) {
    try {
      if (newStatus === "Advance Paid") {
        await updateApplicationStatus(payment.applicationId, "Project Started");
      } else if (newStatus === "Fully Paid") {
        await updateApplicationStatus(payment.applicationId, "Completed");
      }
    } catch {
      // Ignored
    }
  }

  return updated;
}

/**
 * Lists all payments (Admin only).
 */
export async function listPayments(): Promise<PaymentRecord[]> {
  const { db, configured } = getAdminFirebase();
  if (configured && db) {
    try {
      const snapshot = await db
        .collection(PAYMENTS_COLLECTION)
        .orderBy("createdAt", "desc")
        .get();

      if (!snapshot.empty) {
        return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...(doc.data() as Omit<PaymentRecord, "id">),
        }));
      }
    } catch (err) {
      console.error("Failed to query payments from Firestore:", err);
    }
  }

  return Array.from(memoryPayments.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

