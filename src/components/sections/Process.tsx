import React from "react";
import { Badge } from "@/components/common/Badge";
import {
  Compass,
  Layout,
  Code2,
  Rocket,
  Headphones,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export function Process() {
  const processSteps = [
    {
      step: "01",
      icon: Compass,
      title: "Discovery & Architecture Blueprint",
      duration: "Days 1 - 3",
      description:
        "We analyze your business objectives, target audience, traffic expectations, and third-party integrations to produce a comprehensive technical specification.",
      deliverable: "Architecture blueprint & technical scope sign-off",
    },
    {
      step: "02",
      icon: Layout,
      title: "Design System & Wireframing",
      duration: "Days 4 - 7",
      description:
        "We craft high-fidelity Figma designs, responsive typography hierarchies, and accessible design tokens adhering to modern WCAG 2.1 AA standards.",
      deliverable: "Interactive Figma prototype & approved design tokens",
    },
    {
      step: "03",
      icon: Code2,
      title: "Agile Next.js & Full-Stack Sprints",
      duration: "Weeks 2 - 3",
      description:
        "Clean, typed engineering with Next.js App Router, React 19, TypeScript, and Firebase. Structured Git branches with live staging preview links.",
      deliverable: "Live staging deployment with transparent Git tracking",
    },
    {
      step: "04",
      icon: ShieldCheck,
      title: "QA, Lighthouse 98+ & Security Audit",
      duration: "Week 4",
      description:
        "Rigorous cross-browser verification across mobile, tablet, and desktop viewports. Automated Core Web Vitals audit and database security rule validation.",
      deliverable: "Lighthouse 98+ report & security verification sign-off",
    },
    {
      step: "05",
      icon: Rocket,
      title: "Vercel Production Launch & DNS Cutover",
      duration: "Launch Day",
      description:
        "Zero-downtime DNS deployment to vibawebdev.com or client custom domains on Vercel Global Edge Network with SSL certificates and edge caching.",
      deliverable: "Production live cutover & repository code handover",
    },
    {
      step: "06",
      icon: Headphones,
      title: "Ongoing SLA & Post-Launch Warranty",
      duration: "Ongoing",
      description:
        "30-90 days of dedicated warranty bug fixing, Core Web Vitals monitoring, performance tuning, and technical guidance as your business grows.",
      deliverable: "Dedicated engineering SLA & maintenance support",
    },
  ];

  return (
    <section id="process" className="py-20 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-3">
            Our Development Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            A Disciplined 6-Phase Engineering Lifecycle
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            We eliminate surprises, scope creep, and technical debt. Every sprint delivers tangible,
            testable milestones so you remain in complete control of your digital investment.
          </p>
        </div>

        {/* 6 Steps Grid (Responsive: 1-col mobile, 2-col tablet md, 3-col desktop lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {processSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="relative rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-7 flex flex-col justify-between hover:bg-slate-50 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-blue-600/30 group-hover:text-blue-600 font-mono transition-colors">
                      {step.step}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full shadow-2xs">
                      <span>{step.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700 shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                <div className="border-t border-slate-200/80 pt-4 mt-auto">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wider">
                    Phase Deliverable:
                  </span>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {step.deliverable}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Process Guarantee Banner */}
        <div className="mt-14 rounded-2xl bg-slate-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold">Guaranteed On-Time Milestone Delivery</h4>
            <p className="text-xs sm:text-sm text-slate-300">
              We work in transparent bi-weekly sprints with clear staging demos and strict accountability.
            </p>
          </div>
          <a href="#contact" className="shrink-0 w-full sm:w-auto">
            <span className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-xs sm:text-sm hover:bg-blue-700 transition-colors shadow-xs">
              <span>Start Phase 01 Discovery</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
