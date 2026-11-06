import React from "react";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import {
  Users,
  Database,
  Server,
  Monitor,
  Workflow,
  Lock,
} from "lucide-react";

export function MultiTenantArchitecture() {
  const architecturalLayers = [
    {
      layer: "Layer 1: Modern Presentation Tier",
      icon: Monitor,
      title: "Responsive Frontend (Next.js & Tailwind)",
      description:
        "High-performance client interfaces rendered server-side with Next.js App Router and optimized with light, professional Tailwind CSS styling.",
      components: [
        "Dynamic tenant routing (tenant.vibawebdev.com or custom domains)",
        "Reusable, accessible React 19 UI component library",
        "Client-side state management with input validation",
        "Edge-cached static pages and optimistic UI updates",
      ],
      color: "border-blue-500/30 bg-blue-50/30 text-blue-700",
    },
    {
      layer: "Layer 2: API & Integration Tier",
      icon: Server,
      title: "REST Route Handlers (/api/*)",
      description:
        "Isolated backend API layer under /api with structured response envelopes, strict JSON validation, and error classification.",
      components: [
        "Inquiry processing (/api/inquiries)",
        "Multi-tenant customer provisioning (/api/customers)",
        "Portfolio & services inspection endpoints",
        "Structured HTTP status codes (200, 201, 400, 500, 503)",
      ],
      color: "border-indigo-500/30 bg-indigo-50/30 text-indigo-700",
    },
    {
      layer: "Layer 3: Cloud Database Tier",
      icon: Database,
      title: "Firebase Admin & Firestore Services",
      description:
        "Decoupled data access layer abstracting database operations with tenant ID partitioning and typed schemas.",
      components: [
        "Multi-tenant customer partitions with dedicated settings",
        "Firebase Admin SDK initialization with service credentials",
        "Granular security rules preventing cross-tenant leakage",
        "Diagnostic health monitors verifying credentials readiness",
      ],
      color: "border-emerald-500/30 bg-emerald-50/30 text-emerald-700",
    },
  ];

  return (
    <section id="multitenant" className="py-20 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-3">
            Scalable Cloud Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Multi-Tenant Scale & Separation of Concerns
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            ViBa WebDevloper follows a strict three-tier architecture that cleanly isolates the frontend
            presentation layer, backend REST API routes, and cloud database services.
          </p>
        </div>

        {/* 3-Tier Architecture Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {architecturalLayers.map((layer, index) => {
            const IconComponent = layer.icon;
            return (
              <Card
                key={index}
                className="relative flex flex-col justify-between border-slate-200 bg-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {layer.layer}
                    </span>
                    <div className={`p-2 rounded-lg border ${layer.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">{layer.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {layer.description}
                  </p>

                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                      Architecture Features:
                    </p>
                    <ul className="space-y-2 text-xs text-slate-600">
                      {layer.components.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Multi-Customer Isolation Deep-Dive */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2.5 py-1 rounded-md">
                <Users className="h-4 w-4" />
                <span>Multi-Customer Tenant Partitioning</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                How We Support Multiple Customers on a Single Scalable Core
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Rather than deploying separate fragile instances for each client, our platform supports
                a unified multi-tenant architecture with logical isolation at the Firestore and API layer.
                Each customer receives their own dedicated tenant context, custom subdomain, and customizable settings.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-blue-600">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Tenant Data Isolation</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Scoped queries filtered by tenantId prevent cross-customer access.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-indigo-600">
                    <Workflow className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Automated Provisioning</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Self-serve or admin REST API creation of customer accounts and tiers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs font-mono text-xs">
              <div className="text-slate-500 border-b border-slate-100 pb-2 mb-3 flex items-center justify-between">
                <span>MultiTenant Model Spec</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  Schema v1
                </span>
              </div>
              <pre className="text-slate-800 text-[11px] overflow-x-auto leading-relaxed">
{`interface Customer {
  id: string;
  tenantId: "tenant_corp_749";
  companyName: string;
  tier: "starter" | "growth" | "enterprise";
  status: "active" | "onboarding";
  settings: {
    primaryDomain: "client.vibawebdev.com";
    customDomainEnabled: boolean;
    sslStatus: "active";
    allowedOrigins: string[];
    maxProjects: number;
  };
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
