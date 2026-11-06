"use client";

import React from "react";
import { AGENCY_CONFIG } from "@/config/agency";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import {
  ShieldCheck,
  Zap,
  Users2,
  CheckCircle2,
  Award,
  Layers,
  ArrowRight,
  Eye,
  FileCheck,
} from "lucide-react";

export function AboutAgency() {
  const pillars = [
    {
      icon: Zap,
      title: "Lighthouse 98+ Performance",
      description:
        "Every line of HTML, CSS, and TypeScript is engineered for sub-second speeds. We eliminate third-party script bloat and optimize Core Web Vitals to maximize search rankings and customer engagement.",
      badge: "Speed Guaranteed",
    },
    {
      icon: Layers,
      title: "Modern Next.js & React Stack",
      description:
        "We build on industry-leading frameworks: Next.js App Router, React 19, TypeScript, and Tailwind CSS. Clean, maintainable code with strict end-to-end type safety and zero technical debt.",
      badge: "Modern Tech",
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Cloud Reliability",
      description:
        "From lightning-fast static marketing websites to isolated multi-tenant cloud platforms, our architectures leverage Google Firebase and global edge CDNs for 99.95% uptime.",
      badge: "Cloud Ready",
    },
    {
      icon: Users2,
      title: "100% Client Code Ownership",
      description:
        "No proprietary builder lock-in. You receive full ownership of your clean Git repository, design assets, and automated deployment pipelines from day one.",
      badge: "Zero Lock-In",
    },
  ];

  const highlights = [
    { number: "120+", label: "Websites & Web Apps Launched" },
    { number: "98+", label: "Average Mobile Lighthouse Score" },
    { number: "99.95%", label: "Cloud Architecture Uptime SLA" },
    { number: "100%", label: "On-Time Milestone Delivery" },
  ];

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <section id="about" className="py-20 sm:py-24 bg-white border-b border-slate-200/80 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-3 bg-blue-50 text-blue-700 border-blue-200">
            About Us
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Engineering Next-Gen Web Solutions With Precision
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Founded with a singular engineering mission: to bridge the gap between world-class design
            and resilient cloud architecture. At <strong className="text-slate-900 font-semibold">{AGENCY_CONFIG.name}</strong>,
            we build websites that load fast, scale effortlessly, and generate measurable commercial ROI.
          </p>
        </div>

        {/* Narrative & Agency Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Left Narrative */}
          <div className="lg:col-span-7 space-y-5 text-slate-600 text-sm sm:text-base leading-relaxed">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              Why Forward-Thinking Businesses Choose ViBa Web Development Solutions
            </h3>
            <p>
              Traditional agencies often rely on bloated WordPress themes, fragile third-party plugins,
              or restrictive closed builders that suffer from slow load times, frequent security vulnerabilities,
              and expensive recurring maintenance fees.
            </p>
            <p>
              At <strong className="text-slate-900">{AGENCY_CONFIG.name}</strong>, we take a modern
              engineering approach. Every project—from an ultra-fast static business showcase to a complex
              multi-tenant SaaS application—is hand-crafted with modern Next.js, TypeScript, and Tailwind CSS,
              deployed on high-speed global edge networks.
            </p>
            <p>
              Whether you need a high-converting static website that loads in under 300 milliseconds or a
              secure dynamic e-commerce system with payment gateways and Firebase database integration, our team delivers
              predictable, transparent results backed by strict delivery guarantees.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Responsive on Desktop, Tablet & Mobile</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Automated CI/CD & Edge Caching</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>SEO-Optimized Metadata & Schema</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Transparent Fixed-Price Deliverables</span>
              </div>
            </div>

            {/* In-Section Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a href="#apply" onClick={(e) => scrollTo(e, "apply")}>
                <Button size="sm" variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 font-semibold">
                  <FileCheck className="h-4 w-4" />
                  <span>Apply for Website</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </a>
              <a href="#demo" onClick={(e) => scrollTo(e, "demo")}>
                <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 gap-1.5 font-semibold">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span>View Website Demo</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Right Highlights & Values Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-900/30">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/30 border border-blue-500/40 text-blue-400">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">Agency Quality Standard</h4>
                  <p className="text-xs text-blue-300 font-mono">vibawebdev.com / standards</p>
                </div>
              </div>

              <blockquote className="text-sm sm:text-base text-slate-200 italic leading-relaxed mb-6">
                &ldquo;We treat your website as your business&apos;s most vital digital asset. It must load
                instantly, convey authority, convert visitors, and perform flawlessly across every device.&rdquo;
              </blockquote>

              <div className="space-y-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Company Brand:</span>
                  <span className="font-semibold text-white">{AGENCY_CONFIG.name}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Official Domain:</span>
                  <span className="font-mono text-blue-400 font-semibold">{AGENCY_CONFIG.domain}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-medium text-slate-200">{AGENCY_CONFIG.location}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-400">Support Availability:</span>
                  <span className="font-medium text-emerald-400">24/7 Dedicated Monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={idx}
                hoverEffect
                className="bg-slate-50/70 border-slate-200 p-6 flex flex-col justify-between hover:border-blue-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" size="sm" className="text-[10px] border-blue-200 text-blue-700 bg-white">
                      {pillar.badge}
                    </Badge>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Numbers Bar */}
        <div className="mt-14 pt-10 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {highlights.map((item, idx) => (
            <div key={idx} className="p-3">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 font-mono tracking-tight">
                {item.number}
              </div>
              <div className="mt-1.5 text-xs sm:text-sm font-semibold text-slate-800">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
