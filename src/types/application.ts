export type WebsiteType =
  | "Static Website"
  | "Dynamic Business Website"
  | "E-commerce Website";

export type DomainRequirement =
  | "I already have a registered domain name"
  | "I need ViBa to register a new domain for me"
  | "I need assistance transferring an existing domain"
  | "Not sure / need consultation";

export interface ApplicationAttachment {
  name: string;
  originalName: string;
  size: number;
  contentType: string;
  url: string;
  storagePath?: string;
  uploadedAt: string;
}

export type ApplicationStatus =
  | "New Application"
  | "Under Review"
  | "Quotation Prepared"
  | "Awaiting Approval"
  | "Payment Pending"
  | "Project Started"
  | "Completed"
  | "Rejected"
  // Legacy / fallback mapping
  | "pending"
  | "under_review"
  | "approved"
  | "in_development";

export interface QuotationLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type QuotationStatus =
  | "Draft"
  | "Sent to Customer"
  | "Approved"
  | "Revised"
  | "Declined";

export interface CustomerQuotation {
  id: string; // e.g. VIBA-QUOTE-2026-XXXXX
  applicationId: string;
  customerName: string;
  businessName: string;
  email: string;
  mobileNumber: string;
  websiteType: WebsiteType;
  currency: "INR" | "USD";
  items: QuotationLineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  estimatedTimelineWeeks: number;
  scopeDeliverables: string[];
  termsAndConditions: string;
  status: QuotationStatus;
  createdAt: string;
  updatedAt: string;
  validUntil: string;
}

export type ProjectStatus =
  | "Planning"
  | "In Development"
  | "Client Review"
  | "Testing & QA"
  | "Launched"
  | "On Hold";

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface CustomerProject {
  id: string; // e.g. VIBA-PRJ-2026-XXXXX
  applicationId?: string;
  quotationId?: string;
  projectName: string;
  clientName: string;
  clientBusiness: string;
  clientEmail: string;
  clientMobile: string;
  websiteType: WebsiteType;
  status: ProjectStatus;
  progressPercent: number; // 0 - 100
  startDate: string;
  targetLaunchDate: string;
  liveUrl?: string;
  stagingUrl?: string;
  repositoryUrl?: string;
  assignedLead?: string;
  milestones: ProjectMilestone[];
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerApplication {
  id: string; // Unique Application ID e.g. VIBA-APP-2026-89412
  // 1. Customer name
  customerName: string;
  // 2. Business name
  businessName: string;
  // 3. Email
  email: string;
  // 4. Mobile number
  mobileNumber: string;
  // 5. Business address
  businessAddress: string;
  // 6. Website type
  websiteType: WebsiteType;
  // 7. Selected package
  selectedPackage: string;
  // 8. Business description
  businessDescription: string;
  // 9. Required website pages
  requiredPages: string;
  // 10. Required functionality
  requiredFunctionality: string;
  // 11. Preferred website design
  preferredDesign: string;
  // 12. Reference website links
  referenceLinks: string;
  // 13. Domain requirement
  domainRequirement: DomainRequirement | string;
  // 14. Additional requirements
  additionalRequirements?: string;
  // 15. File and image uploads
  files: ApplicationAttachment[];

  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface CreateApplicationDTO {
  customerName: string;
  businessName: string;
  email: string;
  mobileNumber: string;
  businessAddress: string;
  websiteType: WebsiteType;
  selectedPackage: string;
  businessDescription: string;
  requiredPages: string;
  requiredFunctionality: string;
  preferredDesign: string;
  referenceLinks?: string;
  domainRequirement: DomainRequirement | string;
  additionalRequirements?: string;
}

