import React from "react";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import {
  Cpu,
  Server,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Workflow,
  Boxes,
} from "lucide-react";

export function CustomDevelopment() {
  const customSolutions = [
    {
      icon: Cpu,
      title: "Bespoke Web & SaaS Applications",
      description:
        "Engineered from scratch to solve your unique business workflow. We build tailored dashboards, customer portals, and algorithmic processing tools with no arbitrary template restrictions.",
      capabilities: [
        "Interactive analytics dashboards",
        "Role-based permission hierarchies",
        "Real-time event synchronization",
      ],
    },
    {
      icon: Server,
      title: "Multi-Tenant Cloud Architectures",
      description:
        "For software startups and multi-location enterprises needing isolated customer data, dynamic subdomains, custom domain routing, and tiered customer billing.",
      capabilities: [
        "Tenant ID database partitioning",
        "Custom SSL & domain management",
        "Automated customer provisioning",
      ],
    },
    {
      icon: Workflow,
      title: "Custom REST APIs & Microservices",
      description:
        "Connect your web platforms to proprietary internal databases, legacy systems, CRM tools, ERPs, and third-party APIs with high-throughput Next.js route handlers.",
      capabilities: [
        "Structured OpenAPI / Swagger schemas",
        "Token-based JWT & Firebase security",
        "Automated webhook event dispatchers",
      ],
    },
    {
      icon: Boxes,
      title: "Legacy Modernization & Cloud Cutover",
      description:
        "Transform brittle, outdated web applications into modern Next.js and Firebase cloud stacks with zero downtime and guaranteed data integrity.",
      capabilities: [
        "Database schema migrations",
        "Monolith-to-serverless extraction",
        "Performance & latency overhaul",
      ],
    },
  ];

  const comparisonRows = [
    {
      metric: "Load Speed & Lighthouse",
      template: "Slow (40-60 scores due to script & plugin bloat)",
      viba: "98-100 score, sub-400ms edge delivery worldwide",
    },
    {
      metric: "Code Ownership & IP",
      template: "Locked into proprietary builders (Wix, Shopify, WP)",
      viba: "100% Client-Owned clean Git repository & assets",
    },
    {
      metric: "Custom Logic & Workflows",
      template: "Constrained by rigid pre-made plugins and themes",
      viba: "Unlimited: Handcrafted TypeScript & reactive state",
    },
    {
      metric: "Data Security & Isolation",
      template: "Shared database vulnerable to plugin exploits",
      viba: "Firebase Admin, strict RBAC, and SOC2/GDPR-ready rules",
    },
    {
      metric: "Maintenance Costs",
      template: "Constant plugin breakage and unpredictable updates",
      viba: "Zero server patching, serverless reliability on Vercel",
    },
  ];

  return (
    <section id="custom" className="py-20 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-3 bg-blue-500/20 text-blue-300 border-blue-400/30">
            Tailor-Made Solutions
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Custom Website & Software Development
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            When standard templates and pre-built themes fall short of your business vision,
            ViBa WebDevloper crafts bespoke digital solutions engineered to your exact operational specifications.
          </p>
        </div>

        {/* Custom Solutions 4-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {customSolutions.map((sol, idx) => {
            const Icon = sol.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-800/60 p-6 sm:p-8 backdrop-blur-xs hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {sol.title}
                  </h3>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {sol.description}
                </p>

                <div className="space-y-2 pt-4 border-t border-slate-700/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Tailored Capabilities:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {sol.capabilities.map((cap, cIdx) => (
                      <li key={cIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table: Template vs ViBa Custom Engineering */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 sm:p-8 mb-14">
          <div className="text-center sm:text-left mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Why Bespoke Engineering Beats Off-the-Shelf Templates
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Comparing commercial website builders vs ViBa custom Next.js engineering:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="pb-3 font-semibold uppercase tracking-wider">Dimension</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider">Off-the-Shelf Templates</th>
                  <th className="pb-3 font-semibold uppercase tracking-wider text-blue-400">ViBa Custom Development</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {comparisonRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 font-bold text-white pr-4">{row.metric}</td>
                    <td className="py-3.5 text-slate-400 pr-4">
                      <div className="flex items-start gap-1.5">
                        <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{row.template}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-emerald-300 font-medium">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{row.viba}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 sm:p-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Have a Complex Technical Project?
            </h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              Our principal engineers will review your technical specifications, analyze database and API
              requirements, and formulate an architectural roadmap within 24 hours.
            </p>
          </div>
          <a href="#contact" className="shrink-0 w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-blue-700 hover:bg-slate-100 font-bold shadow-md">
              <span>Schedule Architecture Scoping</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
