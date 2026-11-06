export interface ProjectCaseStudy {
  id: string;
  title: string;
  slug: string;
  client: string;
  industry: string;
  category?: "all" | "static" | "dynamic" | "ecommerce" | "custom";
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  techStack: string[];
  liveUrl?: string;
  featured: boolean;
  completionDate: string;
  highlightMetric?: string;
}

