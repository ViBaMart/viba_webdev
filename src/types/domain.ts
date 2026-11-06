export type CustomerPaymentStatus =
  | "Paid"
  | "Pending"
  | "Overdue"
  | "Waived"
  | "Invoiced";

export type DomainManagementStatus =
  | "Active"
  | "Expiring Soon"
  | "Expired"
  | "Pending Transfer"
  | "Transferred Out"
  | "Cancelled";

export interface DomainRenewalRecord {
  id: string; // e.g. REN-XXXXX
  renewalDate: string; // ISO date
  previousExpiryDate: string;
  newExpiryDate: string;
  cost: number;
  customerPaymentStatus: CustomerPaymentStatus;
  renewedBy: string; // Admin email
  invoiceReference?: string;
  notes?: string;
  createdAt: string;
}

export interface DomainRecord {
  id: string; // e.g. VIBA-DOM-2026-XXXXX
  // 1. Customer name
  customerName: string;
  customerEmail?: string;
  customerId?: string;
  applicationId?: string;

  // 2. Customer domain name
  domainName: string; // e.g. "apexfitness.in", "vibawebdev.com"

  // 3. Domain registrar
  registrar: string; // e.g. "GoDaddy", "Namecheap", "Cloudflare", "Hostinger", "Google Domains", "BigRock"

  // 4. Registration date
  registrationDate: string; // ISO YYYY-MM-DD

  // 5. Expiry date
  expiryDate: string; // ISO YYYY-MM-DD

  // 6. Domain registration cost
  registrationCost: number;

  // 7. Renewal cost
  renewalCost: number;

  // 8. Customer payment status
  customerPaymentStatus: CustomerPaymentStatus;

  // 9. Domain management status
  managementStatus: DomainManagementStatus;

  currency: "INR" | "USD";
  autoRenewalConfigured?: boolean;
  dnsProvider?: string;
  nameservers?: string[];
  notes?: string;

  // Renewal Records & History
  renewalHistory: DomainRenewalRecord[];

  createdAt: string;
  updatedAt: string;
}

export interface DomainWithExpiryMeta extends DomainRecord {
  daysUntilExpiry: number;
  isExpiringSoon: boolean; // <= 30 days
  isExpired: boolean;
}

export interface CreateDomainDTO {
  customerName: string;
  customerEmail?: string;
  customerId?: string;
  applicationId?: string;
  domainName: string;
  registrar: string;
  registrationDate: string;
  expiryDate: string;
  registrationCost: number;
  renewalCost: number;
  customerPaymentStatus?: CustomerPaymentStatus;
  managementStatus?: DomainManagementStatus;
  currency?: "INR" | "USD";
  autoRenewalConfigured?: boolean;
  dnsProvider?: string;
  nameservers?: string[];
  notes?: string;
}

export interface UpdateDomainDTO {
  customerName?: string;
  customerEmail?: string;
  customerId?: string;
  applicationId?: string;
  domainName?: string;
  registrar?: string;
  registrationDate?: string;
  expiryDate?: string;
  registrationCost?: number;
  renewalCost?: number;
  customerPaymentStatus?: CustomerPaymentStatus;
  managementStatus?: DomainManagementStatus;
  currency?: "INR" | "USD";
  autoRenewalConfigured?: boolean;
  dnsProvider?: string;
  nameservers?: string[];
  notes?: string;
}

export interface RecordRenewalDTO {
  newExpiryDate: string;
  renewalCost: number;
  renewalDate?: string;
  customerPaymentStatus?: CustomerPaymentStatus;
  invoiceReference?: string;
  notes?: string;
}

export interface DomainStats {
  totalDomains: number;
  activeDomains: number;
  expiringSoon: number; // <= 30 days
  expired: number;
  totalAnnualRenewalCost: number;
  pendingCustomerPayments: number;
}

