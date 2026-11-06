export interface ServiceOffering {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  technologies: string[];
  deliverables: string[];
  category: "frontend" | "fullstack" | "cloud" | "enterprise";
}

export interface AgencyMetric {
  label: string;
  value: string;
  description: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  deliverable: string;
}

export interface AgencyInfo {
  name: string;
  legalName: string;
  tagline: string;
  domain: string;
  canonicalUrl: string;
  contactEmail: string;
  supportEmail: string;
  phone: string;
  location: string;
  foundedYear: number;
}

