export type CustomerTier = "starter" | "growth" | "enterprise";
export type CustomerStatus = "active" | "onboarding" | "suspended" | "archived";

export interface CustomerSettings {
  primaryDomain: string;
  customDomainEnabled: boolean;
  sslStatus: "active" | "pending" | "failed";
  allowedOrigins: string[];
  featuresEnabled: string[];
  maxProjects: number;
}

export interface Customer {
  id: string;
  tenantId: string;
  companyName: string;
  primaryContactName: string;
  primaryContactEmail: string;
  contactPhone?: string;
  tier: CustomerTier;
  status: CustomerStatus;
  settings: CustomerSettings;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDTO {
  companyName: string;
  primaryContactName: string;
  primaryContactEmail: string;
  contactPhone?: string;
  tier?: CustomerTier;
  primaryDomain?: string;
}

