export type PackageCategory = "static" | "dynamic" | "ecommerce" | "custom";

export interface WebsitePackage {
  id: string;
  name: string;
  category: PackageCategory;
  categoryLabel: string;
  tagline: string;
  price: string;
  priceDetail: string;
  developmentCharges?: string;
  annualServiceCharges?: string;
  firstYearPayment?: string;
  renewalCharges?: string;
  serviceType?: "static_website" | "dynamic_website" | "ecommerce" | "custom_web_app";
  popular?: boolean;
  badge?: string;
  turnaround: string;
  description: string;
  idealFor: string;
  features: string[];
  deliverables: string[];
  techStack: string[];
}


