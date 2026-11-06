"use client";

import React, { useState } from "react";
import { FEATURED_PROJECTS } from "@/config/agency";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import {
  CheckCircle2,
  TrendingUp,
  Zap,
  Database,
  ShoppingBag,
  Cpu,
} from "lucide-react";

export function Portfolio() {
  const [filter, setFilter] = useState<"all" | "static" | "dynamic" | "ecommerce" | "custom">("all");

  const filteredProjects =
    filter === "all"
      ? FEATURED_PROJECTS
      : FEATURED_PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="portfolio" className="py-20 sm:py-24 bg-slate-50/50 border-b border-slate-200/80">
      {/* Anchor for backward compatibility with #work */}
      <div id="work" className="-mt-20 pt-20" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="primary" size="md" className="mb-3">
            Our Work & Case Studies
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Proven Engineering & Portfolio Showcase
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Real enterprise case studies demonstrating how ViBa WebDevloper delivers high-performance
            static showcases, dynamic platforms, and high-concurrency e-commerce systems.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs max-w-xl mx-auto">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Projects ({FEATURED_PROJECTS.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("static")}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filter === "static"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Static</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter("dynamic")}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filter === "dynamic"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Database className="h-3.5 w-3.5" />
              <span>Dynamic</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter("ecommerce")}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filter === "ecommerce"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>E-Commerce</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter("custom")}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filter === "custom"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Custom SaaS</span>
            </button>
          </div>
        </div>

        {/* Portfolio Grid: Responsive (1-col mobile, 2-col tablet md, 3-col desktop lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              hoverEffect
              className="flex flex-col justify-between h-full bg-white border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" size="sm" className="font-semibold text-[11px]">
                    {project.industry}
                  </Badge>
                  {project.highlightMetric && (
                    <span className="text-[11px] font-bold font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {project.highlightMetric}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-1 leading-snug">
                  {project.title}
                </h3>
                <p className="text-xs font-semibold text-blue-600 mb-4">
                  Client: {project.client}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {project.summary}
                </p>

                {/* Measurable Outcomes Box */}
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2 mb-6">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Measurable Outcomes</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {project.results.map((result, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Tech & Verification */}
              <div className="pt-4 border-t border-slate-100 mt-auto space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                    Production Verified
                  </span>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    <span>Request Similar Project →</span>
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
