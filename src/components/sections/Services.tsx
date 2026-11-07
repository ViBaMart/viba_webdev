"use client";

import React from "react";
import Link from "next/link";
import { AGENCY_SERVICES } from "@/config/agency";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import {
  Layout,
  Server,
  Cpu,
  ShieldCheck,
  ShoppingBag,
  Palette,
  CheckCircle2,
  LucideIcon,
  ArrowRight,
  Eye,
  FileCheck,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Layout,
  Server,
  Cpu,
  ShieldCheck,
  ShoppingBag,
  Palette,
};

export function Services() {
  return (
    <section id="services" className="py-20 sm:py-24 bg-slate-50/60 border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-3 bg-blue-50 text-blue-700 border-blue-200">
            Our Services
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Web Development Services
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            From lightning-fast static marketing websites to enterprise-grade dynamic platforms,
            we engineer digital solutions designed for maximum conversions, accessibility, and high performance.
          </p>
        </div>

        {/* Services Grid (Responsive: 1-col on mobile, 2-col on tablet, 3-col on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {AGENCY_SERVICES.map((service) => {
            const IconComponent = ICON_MAP[service.icon] || Layout;

            return (
              <Card
                key={service.id}
                hoverEffect
                className="flex flex-col justify-between h-full bg-white border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all rounded-2xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge variant="outline" size="sm" className="uppercase font-semibold text-[10px] tracking-wider text-blue-700 bg-blue-50/50 border-blue-200">
                      {service.category}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2.5">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-6 border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Key Capabilities
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 mb-6 border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Project Deliverables
                    </p>
                    <ul className="space-y-1 text-xs text-slate-500">
                      {service.deliverables.map((del, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-auto space-y-4">
                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {service.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Link */}
                  <Link
                    href="/apply"
                    className="flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-800 pt-2 border-t border-slate-50 group transition-colors"
                  >
                    <span>Apply for this service</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-900/10">
          <div className="text-center md:text-left space-y-1.5">
            <h4 className="text-xl sm:text-2xl font-black">
              Ready to Build Your New Website?
            </h4>
            <p className="text-sm text-blue-100 max-w-xl">
              We offer structured pricing packages with fixed turnaround times, or custom development
              tailored to your company&apos;s unique architecture.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto justify-center">
            <Link href="/demo">
              <Button size="md" variant="outline" className="border-blue-300 text-white hover:bg-white/10 gap-1.5 font-semibold">
                <Eye className="h-4 w-4" />
                <span>View Demo</span>
              </Button>
            </Link>
            <Link href="/apply">
              <Button size="md" variant="primary" className="bg-white text-blue-900 hover:bg-slate-100 gap-1.5 font-bold shadow-md">
                <FileCheck className="h-4 w-4" />
                <span>Apply for Website</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
