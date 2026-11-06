export type PackageCategory = "static" | "dynamic" | "ecommerce" | "custom";

export interface WebsitePackage {
  id: string;
  name: string;
  category: PackageCategory;
  categoryLabel: string;
  tagline: string;
  price: string;
  priceDetail: string;
  popular?: boolean;
  badge?: string;
  turnaround: string;
  description: string;
  idealFor: string;
  features: string[];
  deliverables: string[];
  techStack: string[];
}

