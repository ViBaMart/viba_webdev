"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  SERVICES_AND_PRICING_PACKAGES,
  ECOMMERCE_PACKAGES,
} from "@/config/packages";
import { WebsitePackage } from "@/types/package";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import {
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  Sparkles,
  Database,
  ShoppingBag,
  ShieldCheck,
  FileCheck,
  CreditCard,
  RefreshCw,
  Layers,
  ChevronDown,
  Eye,
  ExternalLink,
} from "lucide-react";

export function WebsitePackages() {
  // Selected tier for E-Commerce (default to approved Starter Storefront $3,499)
  const [selectedEcomTierIndex, setSelectedEcomTierIndex] = useState(0);
  const [showAllEcomTiers, setShowAllEcomTiers] = useState(false);

  // Active e-commerce approved tier
  const activeEcomTier = ECOMMERCE_PACKAGES[selectedEcomTierIndex] || ECOMMERCE_PACKAGES[0];

  const handleApplyNow = (pkg: WebsitePackage, customPricingSummary?: string) => {
    const pricingSummary =
      customPricingSummary ||
      (pkg.firstYearPayment
        ? `First-year: ${pkg.firstYearPayment} (Dev: ${pkg.developmentCharges || pkg.price} + Annual: ${pkg.annualServiceCharges || "N/A"})`
        : pkg.price);

    // 1. Dispatch custom event for ApplyWebsite component
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("viba-select-package", {
          detail: {
            packageId: pkg.id,
            packageName: pkg.name,
            serviceType: pkg.serviceType || (pkg.category === "static" ? "static_website" : pkg.category === "dynamic" ? "dynamic_website" : "ecommerce"),
            pricingSummary,
            developmentCharges: pkg.developmentCharges,
            annualServiceCharges: pkg.annualServiceCharges,
            firstYearPayment: pkg.firstYearPayment,
            renewalCharges: pkg.renewalCharges,
          },
        })
      );

      // 2. Smoothly scroll to the customer application section
      const applyElement = document.getElementById("apply");
      if (applyElement) {
        const navOffset = 80;
        const elementPosition = applyElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        window.history.pushState(null, "", "#apply");
      }
    }
  };

  const getCategoryIcon = (category: string) => {
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

  return (
    <section id="pricing" className="py-20 sm:py-24 bg-white border-b border-slate-200/80 relative">
      {/* Anchor for backward compatibility with #packages */}
      <div id="packages" className="-mt-20 pt-20" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-3 bg-blue-50 text-blue-700 border-blue-200">
            Services & Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Services and Pricing Packages
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Transparent, all-inclusive engineering packages with zero hidden costs. Every tier includes
            custom design, production development, deployment, full code ownership, and dedicated annual service with clear renewal terms.
          </p>
        </div>

        {/* 3 Main Packages Grid: Responsive (1-col on mobile, 2-col on tablet, 3-col on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {/* ========================================================
              PACKAGE 1: BASIC STATIC WEBSITE
              Development: ₹9,999
              Annual Service: ₹5,999
              First-year payment: ₹15,998
              Second-year renewal: ₹5,999
             ======================================================== */}
          {(() => {
            const pkg = SERVICES_AND_PRICING_PACKAGES[0];
            return (
              <Card
                key={pkg.id}
                hoverEffect
                className="flex flex-col justify-between h-full p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs hover:border-blue-300 hover:shadow-xl transition-all relative"
              >
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
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {pkg.tagline}
                  </p>

                  {/* Comprehensive Charges Breakdown */}
                  <div className="mb-6 rounded-2xl bg-slate-50 border border-slate-200/80 p-5 space-y-3.5">
                    {/* First-Year Payment (Highlight) */}
                    <div className="pb-3 border-b border-slate-200">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          First-Year Payment
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-blue-700 font-mono tracking-tight">
                          {pkg.firstYearPayment}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Total investment for initial year (Development + Annual Service)
                      </span>
                    </div>

                    {/* Breakdown Rows */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-600 font-medium flex items-center gap-1.5">
                          <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                          <span>Development Charges:</span>
                        </span>
                        <span className="font-bold font-mono text-slate-900 text-sm">
                          {pkg.developmentCharges}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-600 font-medium flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Annual Service Charges:</span>
                        </span>
                        <span className="font-bold font-mono text-slate-900 text-sm">
                          {pkg.annualServiceCharges}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1 pt-2 border-t border-slate-200/60">
                        <span className="text-slate-600 font-medium flex items-center gap-1.5">
                          <RefreshCw className="h-3.5 w-3.5 text-amber-600" />
                          <span>Second-Year Renewal:</span>
                        </span>
                        <span className="font-bold font-mono text-emerald-700 text-sm">
                          {pkg.renewalCharges}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Included Services List */}
                  <div className="space-y-2.5 mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                      <span>Included Services:</span>
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

                  {/* Apply Now Button */}
                  <Button
                    type="button"
                    onClick={() => handleApplyNow(pkg)}
                    size="md"
                    variant="outline"
                    className="w-full justify-center gap-2 font-bold shadow-xs border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all"
                  >
                    <FileCheck className="h-4 w-4" />
                    <span>Apply Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  {/* View Live Demo Button */}
                  <Link href="/demos/static-business" className="block w-full">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="w-full justify-center gap-1.5 font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
                    >
                      <Eye className="h-3.5 w-3.5 text-blue-600" />
                      <span>View Live Static Demo</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })()}

          {/* ========================================================
              PACKAGE 2: BUSINESS / DYNAMIC WEBSITE (MOST POPULAR)
              Development: ₹24,999
              Annual Service: ₹11,999
              First-year payment: ₹36,998
              Second-year renewal: ₹11,999
             ======================================================== */}
          {(() => {
            const pkg = SERVICES_AND_PRICING_PACKAGES[1];
            return (
              <Card
                key={pkg.id}
                hoverEffect
                className="flex flex-col justify-between h-full p-6 sm:p-8 rounded-3xl border-2 border-blue-600 bg-gradient-to-b from-blue-50/40 via-white to-white shadow-xl shadow-blue-500/10 ring-1 ring-blue-600/20 relative"
              >
                {/* Popular / Feature Ribbon */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-sm uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" />
                    <span>Most Popular</span>
                  </span>
                </div>

                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between gap-2 mb-3 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      {getCategoryIcon(pkg.category)}
                      <span>{pkg.categoryLabel}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-blue-700 font-semibold bg-blue-100/70 px-2.5 py-0.5 rounded-full">
                      <Clock className="h-3 w-3 text-blue-600" />
                      <span>{pkg.turnaround}</span>
                    </div>
                  </div>

                  {/* Package Name & Tagline */}
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {pkg.tagline}
                  </p>

                  {/* Comprehensive Charges Breakdown */}
                  <div className="mb-6 rounded-2xl bg-blue-50/70 border border-blue-200/80 p-5 space-y-3.5">
                    {/* First-Year Payment (Highlight) */}
                    <div className="pb-3 border-b border-blue-200/80">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                          First-Year Payment
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-blue-700 font-mono tracking-tight">
                          {pkg.firstYearPayment}
                        </span>
                      </div>
                      <span className="text-[11px] text-blue-800/80 block mt-0.5">
                        Total investment for initial year (Development + Annual Service)
                      </span>
                    </div>

                    {/* Breakdown Rows */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-700 font-medium flex items-center gap-1.5">
                          <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                          <span>Development Charges:</span>
                        </span>
                        <span className="font-bold font-mono text-slate-900 text-sm">
                          {pkg.developmentCharges}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-700 font-medium flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Annual Service Charges:</span>
                        </span>
                        <span className="font-bold font-mono text-slate-900 text-sm">
                          {pkg.annualServiceCharges}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1 pt-2 border-t border-blue-200/60">
                        <span className="text-slate-700 font-medium flex items-center gap-1.5">
                          <RefreshCw className="h-3.5 w-3.5 text-amber-600" />
                          <span>Second-Year Renewal:</span>
                        </span>
                        <span className="font-bold font-mono text-emerald-700 text-sm">
                          {pkg.renewalCharges}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Included Services List */}
                  <div className="space-y-2.5 mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                      <span>Included Services:</span>
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
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-4 border-t border-slate-100 mt-auto space-y-3">
                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {pkg.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-blue-100/60 text-blue-800 text-[10px] font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Apply Now Button */}
                  <Button
                    type="button"
                    onClick={() => handleApplyNow(pkg)}
                    size="md"
                    variant="primary"
                    className="w-full justify-center gap-2 font-bold shadow-md bg-blue-600 hover:bg-blue-700 text-white transition-all"
                  >
                    <FileCheck className="h-4 w-4" />
                    <span>Apply Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  {/* View Live Demo Button */}
                  <Link href="/demos/dynamic-business" className="block w-full">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="w-full justify-center gap-1.5 font-bold text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200"
                    >
                      <Eye className="h-3.5 w-3.5 text-blue-600" />
                      <span>View Live Dynamic Demo</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })()}

          {/* ========================================================
              PACKAGE 3: E-COMMERCE WEBSITE
              Use existing approved e-commerce pricing.
              Do not invent or change the price.
             ======================================================== */}
          {(() => {
            const pkg = SERVICES_AND_PRICING_PACKAGES[2];
            return (
              <Card
                key={pkg.id}
                hoverEffect
                className="flex flex-col justify-between h-full p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xs hover:border-emerald-300 hover:shadow-xl transition-all relative"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between gap-2 mb-3 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                      {getCategoryIcon(pkg.category)}
                      <span>{pkg.categoryLabel}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      <Clock className="h-3 w-3 text-emerald-600" />
                      <span>{activeEcomTier.turnaround || pkg.turnaround}</span>
                    </div>
                  </div>

                  {/* Package Name & Tagline */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      {pkg.name}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                      Approved Pricing
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {activeEcomTier.tagline || pkg.tagline}
                  </p>

                  {/* Approved E-Commerce Tiers Selector */}
                  <div className="mb-4 p-2 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between mb-1.5 px-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Approved Tier:
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAllEcomTiers(!showAllEcomTiers)}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5"
                      >
                        <span>{showAllEcomTiers ? "Collapse" : "Change Tier"}</span>
                        <ChevronDown className={`h-3 w-3 transition-transform ${showAllEcomTiers ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {ECOMMERCE_PACKAGES.map((tier, idx) => (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => {
                            setSelectedEcomTierIndex(idx);
                            setShowAllEcomTiers(false);
                          }}
                          className={`p-1.5 rounded-lg text-left transition-all ${
                            selectedEcomTierIndex === idx
                              ? "bg-emerald-600 text-white shadow-xs font-bold"
                              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 font-medium"
                          }`}
                        >
                          <span className="block text-[10px] truncate">{tier.name.replace(" Commerce", "").replace(" Platform", "")}</span>
                          <span className="block text-xs font-mono font-extrabold">{tier.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comprehensive Charges Breakdown */}
                  <div className="mb-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 p-5 space-y-3.5">
                    {/* First-Year Payment (Highlight) */}
                    <div className="pb-3 border-b border-emerald-200">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                          First-Year Payment
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-emerald-800 font-mono tracking-tight">
                          {activeEcomTier.price}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-700 block mt-0.5">
                        {activeEcomTier.priceDetail} ({activeEcomTier.name})
                      </span>
                    </div>

                    {/* Breakdown Rows */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-700 font-medium flex items-center gap-1.5">
                          <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Development Charges:</span>
                        </span>
                        <span className="font-bold font-mono text-slate-900 text-sm">
                          {activeEcomTier.price}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-700 font-medium flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Annual Service Charges:</span>
                        </span>
                        <span className="font-bold text-slate-900 text-xs">
                          {pkg.annualServiceCharges}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1 pt-2 border-t border-emerald-200/60">
                        <span className="text-slate-700 font-medium flex items-center gap-1.5">
                          <RefreshCw className="h-3.5 w-3.5 text-amber-600" />
                          <span>Renewal Charges:</span>
                        </span>
                        <span className="font-bold text-slate-700 text-xs">
                          {pkg.renewalCharges}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Included Services List */}
                  <div className="space-y-2.5 mb-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Included Services ({activeEcomTier.name}):</span>
                    </p>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                      {activeEcomTier.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-4 border-t border-slate-100 mt-auto space-y-3">
                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {activeEcomTier.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-medium border border-emerald-100"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Apply Now Button */}
                  <Button
                    type="button"
                    onClick={() =>
                      handleApplyNow(
                        pkg,
                        `${activeEcomTier.name} (${activeEcomTier.price}) - Approved E-Commerce Pricing`
                      )
                    }
                    size="md"
                    variant="outline"
                    className="w-full justify-center gap-2 font-bold shadow-xs border-emerald-300 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-400 transition-all"
                  >
                    <FileCheck className="h-4 w-4" />
                    <span>Apply Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  {/* View Live Demo Button */}
                  <Link href="/demos/ecommerce" className="block w-full">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="w-full justify-center gap-1.5 font-bold text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                    >
                      <Eye className="h-3.5 w-3.5 text-emerald-600" />
                      <span>View Live E-Commerce Demo</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })()}
        </div>

        {/* Bottom Banner with Actions */}
        <div className="mt-16 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-slate-50 to-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                <span>Guaranteed Deliverables &amp; Full Code Ownership</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                Need a Custom Package or Multi-Tenant SaaS Architecture?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                We also engineer bespoke enterprise systems, custom REST microservices, and multi-tenant cloud platforms.
                Test our work on live viewports in the demo section, or apply directly below.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href="#demo"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("demo");
                  if (el) {
                    const navOffset = 80;
                    const pos = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
                    window.scrollTo({ top: pos, behavior: "smooth" });
                    window.history.pushState(null, "", "#demo");
                  }
                }}
                className="w-full sm:w-auto"
              >
                <Button size="md" variant="outline" className="w-full sm:w-auto border-blue-200 text-blue-700 hover:bg-blue-50 gap-2 font-semibold">
                  <span>Explore Website Demo</span>
                </Button>
              </a>

              <a
                href="#apply"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById("apply");
                  if (el) {
                    const navOffset = 80;
                    const pos = el.getBoundingClientRect().top + window.pageYOffset - navOffset;
                    window.scrollTo({ top: pos, behavior: "smooth" });
                    window.history.pushState(null, "", "#apply");
                  }
                }}
                className="w-full sm:w-auto"
              >
                <Button size="md" variant="primary" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold">
                  <FileCheck className="h-4 w-4" />
                  <span>Start Application</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
