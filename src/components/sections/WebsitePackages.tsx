"use client";

import React, { useState } from "react";
import {
  STATIC_PACKAGES,
  DYNAMIC_PACKAGES,
  ECOMMERCE_PACKAGES,
  ALL_PACKAGES,
} from "@/config/packages";
import { PackageCategory } from "@/types/package";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  Sparkles,
  Layers,
  Database,
  ShoppingBag,
  HelpCircle,
  ShieldCheck,
  Eye,
  FileCheck,
} from "lucide-react";

export function WebsitePackages() {
  const [activeTab, setActiveTab] = useState<"all" | PackageCategory>("all");

  const displayedPackages =
    activeTab === "all"
      ? ALL_PACKAGES
      : ALL_PACKAGES.filter((pkg) => pkg.category === activeTab);

  const getCategoryIcon = (category: PackageCategory) => {
    switch (category) {
      case "static":
        return <Zap className="h-4 w-4 text-amber-500" />;
      case "dynamic":
        return <Database className="h-4 w-4 text-blue-500" />;
      case "ecommerce":
        return <ShoppingBag className="h-4 w-4 text-emerald-500" />;
      default:
        return <Layers className="h-4 w-4 text-indigo-500" />;
    }
  };

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
    <section id="pricing" className="py-20 sm:py-24 bg-white border-b border-slate-200/80 relative">
      {/* Anchor for backward compatibility with #packages */}
      <div id="packages" className="-mt-20 pt-20" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="primary" size="md" className="mb-3 bg-blue-50 text-blue-700 border-blue-200">
            Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Transparent Pricing & Website Packages
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Choose the ideal engineering tier for your business. Whether you need a lightning-fast
            static showcase, a database-driven dynamic web app, or a high-concurrency e-commerce store,
            our fixed-price packages guarantee on-time delivery with zero hidden surprises.
          </p>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Packages ({ALL_PACKAGES.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("static")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "static"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Static Websites ({STATIC_PACKAGES.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("dynamic")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "dynamic"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Database className="h-3.5 w-3.5 text-blue-500" />
              <span>Dynamic Websites ({DYNAMIC_PACKAGES.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ecommerce")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "ecommerce"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5 text-emerald-500" />
              <span>E-Commerce ({ECOMMERCE_PACKAGES.length})</span>
            </button>
          </div>
        </div>

        {/* Packages Grid: Responsive (1-col on mobile, 2-col on tablet, 3-col on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {displayedPackages.map((pkg) => (
            <Card
              key={pkg.id}
              hoverEffect
              className={`flex flex-col justify-between h-full p-6 sm:p-8 transition-all rounded-3xl relative ${
                pkg.popular
                  ? "border-2 border-blue-600 bg-gradient-to-b from-blue-50/40 via-white to-white shadow-xl shadow-blue-500/10 ring-1 ring-blue-600/20"
                  : "border border-slate-200 bg-white shadow-xs hover:border-blue-300 hover:shadow-md"
              }`}
            >
              {/* Popular / Feature Ribbon */}
              {pkg.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-sm uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" />
                    <span>{pkg.badge}</span>
                  </span>
                </div>
              )}

              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between gap-2 mb-3 pt-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {getCategoryIcon(pkg.category)}
                    <span>{pkg.categoryLabel}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>{pkg.turnaround}</span>
                  </div>
                </div>

                {/* Package Name & Tagline */}
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {pkg.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  {pkg.tagline}
                </p>

                {/* Price Display */}
                <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
                      {pkg.price}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {pkg.priceDetail}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Fixed Pricing • Full Code Ownership</span>
                  </div>
                </div>

                {/* Ideal For Callout */}
                <div className="mb-5 text-xs text-slate-700 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                  <strong className="text-blue-900 block font-semibold mb-0.5">Ideal For:</strong>
                  <span>{pkg.idealFor}</span>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    What&apos;s Included:
                  </p>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deliverables List */}
                <div className="space-y-1.5 mb-6 pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Deliverables:
                  </p>
                  <ul className="space-y-1 text-xs text-slate-500">
                    {pkg.deliverables.map((del, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-4 border-t border-slate-100 mt-auto space-y-3">
                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {pkg.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Apply Button */}
                <a
                  href="#apply"
                  onClick={(e) => scrollTo(e, "apply")}
                  className="block w-full"
                >
                  <Button
                    size="md"
                    variant={pkg.popular ? "primary" : "outline"}
                    className={`w-full justify-center gap-2 font-bold shadow-xs ${
                      pkg.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "border-blue-200 text-blue-700 hover:bg-blue-50"
                    }`}
                  >
                    <FileCheck className="h-4 w-4" />
                    <span>Apply for {pkg.name}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Banner with Actions */}
        <div className="mt-16 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-slate-50 to-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider">
                <HelpCircle className="h-4 w-4" />
                <span>Need a Custom Solution or Specialized Architecture?</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                Want to Test Our Quality Before Deciding?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Explore our interactive website demo to test responsiveness across desktop, tablet,
                and mobile viewports, or apply directly for your tailored business website.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <a href="#demo" onClick={(e) => scrollTo(e, "demo")} className="w-full sm:w-auto">
                <Button size="md" variant="outline" className="w-full sm:w-auto border-blue-200 text-blue-700 hover:bg-blue-50 gap-2 font-semibold">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span>View Website Demo</span>
                </Button>
              </a>
              <a href="#apply" onClick={(e) => scrollTo(e, "apply")} className="w-full sm:w-auto">
                <Button size="md" variant="primary" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold">
                  <FileCheck className="h-4 w-4" />
                  <span>Apply for Website</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
