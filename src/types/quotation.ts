import { WebsiteType } from "@/types/application";

export interface QuotationPackageItem {
  name: string;
  price: number;
  description?: string;
}

export interface DevelopmentChargeItem {
  description: string;
  amount: number;
}

export interface AnnualServiceChargeItem {
  description: string;
  amount: number;
  billingCycle: "Annually" | "Monthly" | "One-Time First Year";
}

export interface AdditionalChargeItem {
  id: string;
  description: string;
  amount: number;
}

export interface QuotationFinancialBreakdown {
  packagePrice: number;
  developmentCharges: number;
  annualServiceCharges: number;
  additionalCharges: number;
  subtotal: number;
  discount: number;
  taxRatePercent: number;
  taxAmount: number;
  totalAmount: number;
  advancePayment: number;
  remainingPayment: number;
}

export type QuotationStatus =
  | "Draft"
  | "Sent to Customer"
  | "Approved"
  | "Rejected"
  | "Revised";

export interface QuotationRecord {
  id: string; // e.g. VIBA-QT-2026-XXXXX
  userId?: string; // Authenticated Customer UID
  applicationId: string;
  customerName: string;
  businessName: string;
  email: string;
  mobileNumber: string;
  businessAddress?: string;
  websiteType: WebsiteType;
  currency: "INR" | "USD";

  // The 4 Core Charge Categories
  selectedPackage: QuotationPackageItem;
  developmentCharges: DevelopmentChargeItem;
  annualServiceCharges: AnnualServiceChargeItem;
  additionalCharges: AdditionalChargeItem[];

  // Calculation Breakdown
  breakdown: QuotationFinancialBreakdown;

  // Deliverables & Terms
  scopeDeliverables: string[];
  estimatedTimeline: string;
  paymentTerms: string;
  validUntil: string;

  // Lifecycle
  status: QuotationStatus;
  customerFeedback?: string;
  approvedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuotationDTO {
  applicationId: string;
  customerName: string;
  businessName: string;
  email: string;
  mobileNumber: string;
  businessAddress?: string;
  websiteType: WebsiteType;
  currency?: "INR" | "USD";

  selectedPackage: QuotationPackageItem;
  developmentCharges: DevelopmentChargeItem;
  annualServiceCharges: AnnualServiceChargeItem;
  additionalCharges?: AdditionalChargeItem[];

  discount?: number;
  taxRatePercent?: number;
  advancePaymentPercentOrAmount?: number; // Either percentage (e.g. 50) or fixed amount

  scopeDeliverables?: string[];
  estimatedTimeline?: string;
  paymentTerms?: string;
  validUntil?: string;
}

