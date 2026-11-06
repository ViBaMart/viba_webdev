import { AgencyInfo, AgencyMetric, ProcessStep, ServiceOffering } from "@/types/agency";
import { ProjectCaseStudy } from "@/types/project";

export const AGENCY_CONFIG: AgencyInfo = {
  name: "ViBa Web Development Solutions",
  legalName: "ViBa Web Development Solutions Inc.",
  tagline: "Professional Web Development Solutions & High-Performance Cloud Platforms",
  domain: "vibawebdev.com",
  canonicalUrl: "https://vibawebdev.com",
  contactEmail: "contact@vibawebdev.com",
  supportEmail: "support@vibawebdev.com",
  phone: "+1 (800) 555-VIBA",
  location: "San Francisco, CA & Global Remote",
  foundedYear: 2024,
};

export const AGENCY_METRICS: AgencyMetric[] = [
  {
    label: "Web & SaaS Apps Launched",
    value: "120+",
    description: "Production applications engineered with zero-downtime architecture",
  },
  {
    label: "Lighthouse Performance",
    value: "98+",
    description: "Average core web vitals and speed optimization across all deployments",
  },
  {
    label: "Enterprise SLA",
    value: "99.95%",
    description: "Guaranteed cloud uptime and resilient serverless reliability",
  },
  {
    label: "Client Retention Rate",
    value: "96%",
    description: "Long-term engineering partnerships and multi-tenant scaling",
  },
];

export const AGENCY_SERVICES: ServiceOffering[] = [
  {
    id: "svc-fullstack",
    title: "Full-Stack Web Engineering",
    slug: "full-stack-web-engineering",
    description:
      "Modern, hyper-fast web applications built on Next.js App Router, React 19, TypeScript, and Tailwind CSS with server-side rendering and edge computing.",
    icon: "Layout",
    category: "fullstack",
    features: [
      "Server-Side Rendering (SSR) & Static Generation (SSG)",
      "Strict TypeScript type safety end-to-end",
      "Tailwind CSS responsive design systems",
      "Optimized Core Web Vitals & technical SEO",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Turbopack"],
    deliverables: [
      "Production-ready codebase",
      "Component design system",
      "Automated CI/CD pipeline",
      "Full API documentation",
    ],
  },
  {
    id: "svc-multitenant",
    title: "Multi-Tenant Cloud SaaS Systems",
    slug: "multi-tenant-cloud-saas",
    description:
      "Enterprise SaaS platforms designed for multiple customers with tenant isolation, custom subdomain routing, tiered billing, and fine-grained permissions.",
    icon: "Server",
    category: "cloud",
    features: [
      "Isolated tenant data models & security boundaries",
      "Firebase Firestore & Cloud Functions orchestration",
      "Automated customer onboarding workflows",
      "Custom domain & SSL certificate routing",
    ],
    technologies: ["Firebase", "Firestore", "Google Cloud", "Next.js API Routes", "Vercel"],
    deliverables: [
      "Multi-tenant customer schema",
      "Role-Based Access Control (RBAC)",
      "Customer management admin portal",
      "Tenant analytics dashboard",
    ],
  },
  {
    id: "svc-api",
    title: "Robust REST & GraphQL APIs",
    slug: "rest-graphql-apis",
    description:
      "Secure, high-throughput microservice endpoints with input sanitization, rate limiting, token authentication, and comprehensive test coverage.",
    icon: "Cpu",
    category: "fullstack",
    features: [
      "Schema validation with strict error handling",
      "Bearer JWT & Firebase Admin auth integration",
      "Structured JSON payloads and response envelopes",
      "Webhook dispatchers & third-party integrations",
    ],
    technologies: ["Next.js API", "Node.js", "Firebase Admin SDK", "REST", "JSON Schema"],
    deliverables: [
      "Standardized REST endpoints",
      "Postman / OpenAPI specs",
      "Unit & integration test suites",
      "Monitoring & logging integration",
    ],
  },
  {
    id: "svc-enterprise",
    title: "Enterprise Modernization & Migration",
    slug: "enterprise-modernization",
    description:
      "Migrate legacy monolithic software to modern composable cloud architectures with zero data loss, modern developer ergonomics, and reduced hosting costs.",
    icon: "ShieldCheck",
    category: "enterprise",
    features: [
      "Legacy codebase audit & refactoring roadmap",
      "Database schema transformation & data migration",
      "Vercel enterprise deployment configuration",
      "Zero-downtime progressive cutover strategies",
    ],
    technologies: ["TypeScript", "Next.js", "Firebase", "Vercel", "GitHub Actions"],
    deliverables: [
      "Architecture migration plan",
      "Automated data migration scripts",
      "Staging validation environments",
      "Post-migration performance verification",
    ],
  },
  {
    id: "svc-ecommerce",
    title: "High-Performance Digital Commerce",
    slug: "digital-commerce",
    description:
      "Custom shopping engines, subscription platforms, and checkout funnels engineered for high concurrency, real-time inventory, and frictionless conversions.",
    icon: "ShoppingBag",
    category: "fullstack",
    features: [
      "Sub-second page navigation & instant search",
      "PCI-compliant payment gateways",
      "Inventory synchronization & webhook handlers",
      "Dynamic customer pricing & regional tax rules",
    ],
    technologies: ["Next.js", "Stripe API", "Firebase", "Tailwind CSS"],
    deliverables: [
      "Custom storefront UI",
      "Admin order management interface",
      "Payment gateway integration",
      "Email receipt notifications",
    ],
  },
  {
    id: "svc-uiux",
    title: "Design Systems & UI/UX Engineering",
    slug: "ui-ux-design-systems",
    description:
      "Pixel-perfect, accessible (WCAG AA compliant) component libraries designed for maximum usability, cohesive brand identity, and rapid product development.",
    icon: "Palette",
    category: "frontend",
    features: [
      "Reusable, composable React component primitives",
      "Light professional theme with refined micro-interactions",
      "Strict accessibility standards (WCAG 2.1 AA)",
      "Comprehensive interactive component documentation",
    ],
    technologies: ["React 19", "Tailwind CSS", "Lucide Icons", "Radix Primitives"],
    deliverables: [
      "Design token library",
      "Reusable component library",
      "Interactive style guide",
      "Figma-to-code mapping",
    ],
  },
];

export const AGENCY_PROCESS: ProcessStep[] = [
  {
    step: "01",
    title: "Discovery & Architectural Blueprint",
    description:
      "We unpack your business objectives, analyze customer scale requirements, and establish the data schemas, technology stack, and security boundaries.",
    deliverable: "Architecture blueprint & technical specification",
  },
  {
    step: "02",
    title: "Design System & Prototyping",
    description:
      "Our team crafts high-fidelity wireframes, interactive user flows, and accessible design tokens adhering to your corporate branding.",
    deliverable: "Interactive prototype & approved design tokens",
  },
  {
    step: "03",
    title: "Iterative Engineering & API Development",
    description:
      "Agile two-week sprints building responsive frontend components, REST route handlers, Firebase data layers, and multi-tenant logic.",
    deliverable: "Bi-weekly staging demo deployments with Git tracking",
  },
  {
    step: "04",
    title: "Rigorous QA, Security & Performance Audit",
    description:
      "Comprehensive automated testing, Lighthouse 95+ performance optimization, cross-browser validation, and database security rules enforcement.",
    deliverable: "Security audit report & Core Web Vitals sign-off",
  },
  {
    step: "05",
    title: "Vercel Production Launch & Multi-Tenant Scale",
    description:
      "Smooth DNS cutover to vibawebdev.com or client custom domains on Vercel Edge Network with automated CI/CD and 24/7 monitoring.",
    deliverable: "Production live cutover & engineering handoff documentation",
  },
];

export const FEATURED_PROJECTS: ProjectCaseStudy[] = [
  {
    id: "proj-nexus",
    title: "NexusFlow Enterprise Cloud",
    slug: "nexusflow-enterprise-cloud",
    client: "NexusFlow Analytics",
    industry: "Fintech & Data Intelligence",
    category: "custom",
    highlightMetric: "99.98% Uptime",
    summary:
      "Multi-tenant SaaS dashboard managing high-frequency transactions with real-time analytics and role-based client workspaces.",
    challenge:
      "The client required sub-second dashboard rendering for over 50,000 active customer tenants without cross-tenant data leakage.",
    solution:
      "Engineered an isolated multi-tenant architecture using Next.js App Router, Firebase Admin SDK, and edge-cached REST microservices.",
    results: [
      "99.98% uptime achieved under peak quarterly load",
      "68% reduction in server infrastructure overhead",
      "Lighthouse desktop performance score of 99",
    ],
    techStack: ["Next.js", "TypeScript", "Firebase Firestore", "Tailwind CSS", "Vercel"],
    liveUrl: "https://vibawebdev.com/case-studies/nexusflow",
    featured: true,
    completionDate: "2024-10",
  },
  {
    id: "proj-orbit",
    title: "OrbitPulse B2B Commerce Engine",
    slug: "orbitpulse-b2b-commerce",
    client: "OrbitPulse Logistics",
    industry: "B2B Supply Chain",
    category: "ecommerce",
    highlightMetric: "380ms Page Load",
    summary:
      "High-throughput commercial portal with customized customer pricing tiers, instant catalog search, and automated quote generation.",
    challenge:
      "Legacy Magento architecture was suffering from 4-second page latency and failure to integrate with custom CRM webhooks.",
    solution:
      "Migrated the frontend to a headless Next.js solution with Tailwind CSS, backed by Firebase real-time state synchronization.",
    results: [
      "Page load latency dropped from 4.2s to 380ms",
      "34% increase in completed online wholesale orders",
      "Seamless integration with internal ERP systems",
    ],
    techStack: ["Next.js", "TypeScript", "Firebase Admin", "Tailwind CSS", "Vercel"],
    liveUrl: "https://vibawebdev.com/case-studies/orbitpulse",
    featured: true,
    completionDate: "2024-08",
  },
  {
    id: "proj-aura",
    title: "AuraHealth Multi-Clinic Telehealth Portal",
    slug: "aurahealth-telehealth",
    client: "Aura Health Networks",
    industry: "Healthcare Technology",
    category: "dynamic",
    highlightMetric: "35+ Clinics Scaled",
    summary:
      "Secure patient-doctor consultation platform with appointment management, encrypted records, and white-label clinic portals.",
    challenge:
      "Strict data privacy regulations required tenant-isolated patient storage and instantaneous booking confirmations.",
    solution:
      "Designed a modular cloud service layer with granular Firebase security rules, strict TypeScript DTOs, and REST API handlers.",
    results: [
      "Passed third-party security & privacy audits with zero findings",
      "Scaled to 35+ regional clinic tenants within 90 days",
      "Patient appointment no-show rates reduced by 22%",
    ],
    techStack: ["Next.js", "TypeScript", "Firebase", "REST APIs", "Tailwind CSS"],
    liveUrl: "https://vibawebdev.com/case-studies/aurahealth",
    featured: true,
    completionDate: "2024-06",
  },
  {
    id: "proj-apex",
    title: "Apex Architects Studio Showcase",
    slug: "apex-architects-showcase",
    client: "Apex Architecture Group",
    industry: "Architecture & Design",
    category: "static",
    highlightMetric: "100/100 Lighthouse",
    summary:
      "Ultra-fast static showcase website with fluid responsive masonry portfolios, edge image optimization, and elegant client presentation.",
    challenge:
      "High-resolution architectural photography was causing massive bandwidth spikes and sluggish 6-second mobile render times on their old site.",
    solution:
      "Built a static Next.js SSG site utilizing WebP responsive picture sets, edge caching, and zero client runtime bloat.",
    results: [
      "Achieved a perfect 100/100 Google Lighthouse score on mobile",
      "Initial render time slashed to under 300ms worldwide",
      "Doubled project consultation inquiries in 60 days",
    ],
    techStack: ["Next.js SSG", "TypeScript", "Tailwind CSS", "Vercel Edge"],
    liveUrl: "https://vibawebdev.com/case-studies/apex-architects",
    featured: true,
    completionDate: "2024-04",
  },
  {
    id: "proj-velox",
    title: "VeloxPay Financial Member Portal",
    slug: "veloxpay-member-portal",
    client: "Velox Financial Inc.",
    industry: "Financial Technology",
    category: "dynamic",
    highlightMetric: "<200ms API Latency",
    summary:
      "Dynamic dashboard providing real-time exchange rates, cross-border remittance tracking, and multi-factor customer profile security.",
    challenge:
      "Needed an enterprise customer portal handling real-time data polling without overwhelming backend services.",
    solution:
      "Created an event-driven Next.js application with Firebase Firestore snapshot listeners and edge-authenticated REST endpoints.",
    results: [
      "Real-time rate synchronization with sub-200ms latency",
      "Bank-grade security with verified 2FA authentication",
      "5-star average customer satisfaction rating",
    ],
    techStack: ["Next.js App Router", "Firebase Auth", "Firestore", "TypeScript", "Tailwind"],
    liveUrl: "https://vibawebdev.com/case-studies/veloxpay",
    featured: true,
    completionDate: "2024-02",
  },
  {
    id: "proj-luminary",
    title: "Luminary Modern Home Store",
    slug: "luminary-modern-home",
    client: "Luminary Living",
    industry: "Home Decor & Furnishings",
    category: "ecommerce",
    highlightMetric: "+45% Mobile Sales",
    summary:
      "Sophisticated e-commerce store with faceted room filtering, interactive product customizer, and one-tap Apple Pay/Google Pay checkout.",
    challenge:
      "Old Shopify theme suffered from slow third-party app scripts and checkout drop-off rates exceeding 72% on mobile devices.",
    solution:
      "Architected a custom headless Next.js storefront with Stripe Checkout and real-time inventory management.",
    results: [
      "Cart checkout abandonment dropped by 28%",
      "Mobile revenue increased by 45% in Q3",
      "Catalog search query latency under 120ms",
    ],
    techStack: ["Next.js", "Stripe API", "Firebase", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://vibawebdev.com/case-studies/luminary-living",
    featured: true,
    completionDate: "2023-12",
  },
];

