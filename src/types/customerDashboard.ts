import { CustomerApplication } from "@/types/application";
import { QuotationRecord } from "@/types/quotation";
import { PaymentRecord } from "@/types/payment";
import { CustomerProjectRecord } from "@/types/customerProject";

export interface CustomerProfile {
  uid: string;
  email: string;
  displayName: string;
  businessName: string;
  mobileNumber: string;
  businessAddress?: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDocumentItem {
  id: string;
  title: string;
  category: "Approved Quotation" | "Design Deliverable" | "Preview Build" | "Documentation" | "Customer Attachment";
  url: string;
  size?: number;
  createdAt: string;
  type: "pdf" | "image" | "archive" | "document" | "link";
  sourceId: string;
}

export interface CustomerDashboardStats {
  totalApplications: number;
  approvedQuotations: number;
  totalAgreedAmount: number;
  totalPaidAmount: number;
  remainingAmount: number;
  activeProjects: number;
  deliveredProjects: number;
}

export interface CustomerDashboardData {
  profile: CustomerProfile;
  applications: CustomerApplication[];
  quotations: QuotationRecord[];
  payments: PaymentRecord[];
  projects: CustomerProjectRecord[];
  documents: CustomerDocumentItem[];
  stats: CustomerDashboardStats;
}

export interface UpdateCustomerProfileDTO {
  displayName?: string;
  businessName?: string;
  mobileNumber?: string;
  businessAddress?: string;
}

