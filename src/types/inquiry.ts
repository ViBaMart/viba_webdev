export type InquiryServiceType =
  | "static_website"
  | "dynamic_website"
  | "ecommerce"
  | "custom_web_app"
  | "saas_platform"
  | "api_backend"
  | "enterprise_migration"
  | "ui_ux_design"
  | "other";

export type InquiryBudgetRange =
  | "under_5k"
  | "5k_to_15k"
  | "15k_to_30k"
  | "30k_plus"
  | "not_specified";

export interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  phone?: string;
  serviceType: InquiryServiceType;
  budgetRange: InquiryBudgetRange;
  message: string;
  status: "new" | "contacted" | "qualified" | "closed";
  tenantId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface CreateInquiryDTO {
  fullName: string;
  email: string;
  company?: string;
  phone?: string;
  serviceType: InquiryServiceType;
  budgetRange?: InquiryBudgetRange;
  message: string;
}

