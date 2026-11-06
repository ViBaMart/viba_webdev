export type PaymentStatus =
  | "Unpaid"
  | "Pending Advance Verification"
  | "Advance Paid"
  | "Pending Final Verification"
  | "Fully Paid"
  | "Refunded";

export interface ViBaBankDetails {
  beneficiaryName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: string;
  branch: string;
  upiId: string;
  paymentInstructions: string;
}

export interface PaymentTransaction {
  id: string; // e.g. TXN-XXXX
  type: "advance" | "final" | "full";
  amount: number;
  paymentMethod:
    | "Bank Transfer / NEFT"
    | "IMPS / RTGS"
    | "UPI"
    | "Cheque / Cash Deposit";
  transactionReference: string; // Customer submitted UTR / Ref ID
  transactionDate: string;
  customerNotes?: string;
  submittedAt: string;

  // Verification Audit
  verifiedByAdmin: boolean;
  verifiedAt?: string;
  verifiedByEmail?: string;
  verificationNotes?: string;
}

export interface PaymentRecord {
  id: string; // e.g. VIBA-PAY-2026-XXXXX
  userId?: string; // Authenticated Customer UID
  quotationId: string;
  applicationId?: string;
  customerName: string;
  businessName: string;
  customerEmail: string;
  customerMobile: string;
  currency: "INR" | "USD";

  totalAmount: number;
  advanceRequired: number;
  remainingAmount: number;
  amountPaid: number;
  status: PaymentStatus;

  bankDetails: ViBaBankDetails;
  transactions: PaymentTransaction[];

  createdAt: string;
  updatedAt: string;
}

export interface SubmitTransactionDTO {
  type: "advance" | "final" | "full";
  amount: number;
  paymentMethod:
    | "Bank Transfer / NEFT"
    | "IMPS / RTGS"
    | "UPI"
    | "Cheque / Cash Deposit";
  transactionReference: string;
  transactionDate: string;
  customerNotes?: string;
}

export interface VerifyPaymentDTO {
  transactionId: string;
  action: "approve" | "reject";
  verificationNotes?: string;
  newStatus?: PaymentStatus;
}

