"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import {
  Monitor,
  Tablet,
  Smartphone,
  FileCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Database,
  ShoppingBag,
} from "lucide-react";

interface DemoPreset {
  id: string;
  name: string;
  tagline: string;
  category: "corporate" | "saas" | "ecommerce" | "services";
  badge: string;
  lighthouse: {
    perf: number;
    seo: number;
    acc: number;
    best: number;
  };
  features: string[];
  bannerHeadline: string;
  bannerDescription: string;
  ctaText: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "corporate",
    name: "Corporate & Financial Advisory",
    tagline: "Enterprise consulting portal engineered for institutional authority.",
    category: "corporate",
    badge: "Corporate Showcase",
    lighthouse: { perf: 99, seo: 100, acc: 100, best: 100 },
    features: [
      "Sub-250ms Server-Side Rendered pages",
      "Executive team profiles & case studies",
      "Encrypted client consultation scheduler",
      "Compliance & ISO-certified security rules",
    ],
    bannerHeadline: "Strategic Financial Counsel for Global Enterprises",
    bannerDescription:
      "We provide institutional-grade wealth strategy, risk mitigation, and corporate advisory backed by verifiable data models.",
    ctaText: "Schedule Consultation",
    colorScheme: {
      primary: "bg-blue-600",
      secondary: "bg-slate-900",
      accent: "text-blue-600",
    },
  },
  {
    id: "saas",
    name: "Cloud SaaS Platform Engine",
    tagline: "High-conversion tech product landing page with interactive pricing.",
    category: "saas",
    badge: "SaaS Product",
    lighthouse: { perf: 98, seo: 100, acc: 98, best: 100 },
    features: [
      "Dynamic interactive feature simulator",
      "Multi-currency monthly/yearly pricing toggles",
      "Instant sign-up OAuth modal preview",
      "API documentation & sandbox explorer",
    ],
    bannerHeadline: "Unified Multi-Tenant Cloud Architecture at Scale",
    bannerDescription:
      "Deploy scalable customer applications with automated tenant onboarding, role-based access control, and zero infrastructure overhead.",
    ctaText: "Start 14-Day Trial",
    colorScheme: {
      primary: "bg-indigo-600",
      secondary: "bg-slate-900",
      accent: "text-indigo-600",
    },
  },
  {
    id: "ecommerce",
    name: "Next-Gen E-Commerce Store",
    tagline: "High-concurrency storefront with instant cart and Stripe checkout.",
    category: "ecommerce",
    badge: "E-Commerce",
    lighthouse: { perf: 97, seo: 98, acc: 100, best: 98 },
    features: [
      "Instant search & category filter engine",
      "Slide-out shopping bag with real-time totals",
      "Optimized single-page checkout flow",
      "Inventory tracking & order status webhooks",
    ],
    bannerHeadline: "Curated Luxury Goods Crafted With Sustainable Materials",
    bannerDescription:
      "Explore our award-winning seasonal collection, engineered for timeless elegance, minimal footprint, and effortless modern living.",
    ctaText: "Shop Collection",
    colorScheme: {
      primary: "bg-emerald-600",
      secondary: "bg-slate-900",
      accent: "text-emerald-600",
    },
  },
  {
    id: "services",
    name: "Medical & Specialist Practice",
    tagline: "Patient booking portal with appointment availability and doctor bios.",
    category: "services",
    badge: "Healthcare & Clinic",
    lighthouse: { perf: 100, seo: 100, acc: 100, best: 100 },
    features: [
      "HIPAA-compliant patient booking portal",
      "Specialist directory & verified credentials",
      "Insurance verification & telehealth intake",
      "Mobile-first emergency appointment triage",
    ],
    bannerHeadline: "Compassionate Modern Healthcare Centered Around You",
    bannerDescription:
      "Book top-tier clinical appointments, access diagnostic results, and consult with board-certified physicians from the comfort of home.",
    ctaText: "Book Appointment",
    colorScheme: {
      primary: "bg-cyan-600",
      secondary: "bg-slate-900",
      accent: "text-cyan-600",
    },
  },
];

export function WebsiteDemo() {
  const [selectedDemo, setSelectedDemo] = useState<DemoPreset>(DEMO_PRESETS[0]);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [simulatedActionMessage, setSimulatedActionMessage] = useState<string | null>(null);

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

  const handleSimulateClick = (actionName: string) => {
    setSimulatedActionMessage(`Interactive Demo Response: Triggered "${actionName}" action successfully!`);
    setTimeout(() => {
      setSimulatedActionMessage(null);
    }, 4000);
  };

  return (
    <section id="demo" className="py-20 sm:py-24 bg-slate-50/70 border-b border-slate-200/80 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="primary" size="md" className="mb-3 bg-blue-50 text-blue-700 border-blue-200">
            Website Demo
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Interactive Live Website Demos
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Experience the design polish, fluid responsiveness, and sub-second performance of our websites
            in real time. Switch between industries and screen viewports below, or launch any of our three dedicated standalone working demonstrations.
          </p>
        </div>

        {/* Three Separate Working Website Demonstrations Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Demo 1 */}
          <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 shadow-sm hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <Monitor className="h-3 w-3" />
                  <span>Demo 1</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-stone-500">Route: /demos/static-business</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Static Business Website
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                High-performance presentation site with zero server maintenance overhead. Built for architectural, legal, or consulting practices.
              </p>
              <div className="space-y-1.5 text-xs text-slate-700 mb-6">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Home:</strong> Vision, stats, pillars & testimonials</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span><strong>About:</strong> Studio story, leadership & timeline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Services:</strong> 6 disciplines & 4-phase methodology</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Gallery:</strong> Filterable projects with lightbox modal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Contact:</strong> Interactive brief submission form</span>
                </div>
              </div>
            </div>
            <Link href="/demos/static-business" className="block w-full">
              <Button size="md" variant="primary" className="w-full justify-center gap-2 font-bold bg-stone-900 hover:bg-stone-800 text-amber-400 shadow-sm">
                <span>Launch Static Demo</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Demo 2 */}
          <div className="bg-white rounded-3xl border-2 border-blue-200 p-6 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  <Database className="h-3 w-3" />
                  <span>Demo 2</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500">Route: /demos/dynamic-business</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Dynamic Business Website
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Cloud infrastructure platform with live client-side CMS, dynamic services catalog, cost calculator, and real-time inbox.
              </p>
              <div className="space-y-1.5 text-xs text-slate-700 mb-6">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
                  <span><strong>Home:</strong> Live telemetry terminal & dynamic services</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
                  <span><strong>About:</strong> Cloud architecture, SRE team & SLA matrix</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
                  <span><strong>Services:</strong> Catalog & interactive cost calculator</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
                  <span><strong>Dynamic CMS:</strong> Edit banners, add services & view inbox</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
                  <span><strong>Contact Form:</strong> Real-time dispatch into CMS Admin</span>
                </div>
              </div>
            </div>
            <Link href="/demos/dynamic-business" className="block w-full">
              <Button size="md" variant="primary" className="w-full justify-center gap-2 font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                <span>Launch Dynamic Demo</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Demo 3 */}
          <div className="bg-white rounded-3xl border-2 border-emerald-200 p-6 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShoppingBag className="h-3 w-3" />
                  <span>Demo 3</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500">Route: /demos/ecommerce</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                E-Commerce Storefront
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Complete online retail experience with dynamic catalog, specs modal, reactive shopping cart, coupon codes, and simulated checkout.
              </p>
              <div className="space-y-1.5 text-xs text-slate-700 mb-6">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Home:</strong> Seasonal banner, guarantees & trending picks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Product Listing:</strong> Instant search, category & sort</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Product Details:</strong> Finish selector, stock & specs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Shopping Cart:</strong> Drawer, quantity controls & coupon</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Checkout:</strong> 3-step SSL checkout & verified receipt</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span><strong>Customer Account:</strong> Live order tracking, addresses & payments</span>
                </div>
              </div>
            </div>
            <Link href="/demos/ecommerce" className="block w-full">
              <Button size="md" variant="primary" className="w-full justify-center gap-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                <span>Launch E-Commerce Demo</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Live Simulator Preview Header */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Interactive In-Page Viewport Simulation
          </span>
        </div>

        {/* Demo Controls Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Demo Preset Selector */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 w-full lg:w-auto">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
                Select Demo:
              </span>
              {DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedDemo(preset)}
                  className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    selectedDemo.id === preset.id
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Viewport Switcher & Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
              {/* Device Viewport Pills */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewport("desktop")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewport === "desktop"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Desktop 1200px"
                >
                  <Monitor className="h-4 w-4" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("tablet")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewport === "tablet"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Tablet 768px"
                >
                  <Tablet className="h-4 w-4" />
                  <span className="hidden sm:inline">Tablet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("mobile")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewport === "mobile"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Mobile 375px"
                >
                  <Smartphone className="h-4 w-4" />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
              </div>

              {/* Direct Apply Button */}
              <Link href="/apply">
                <Button size="sm" variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 font-bold shadow-xs">
                  <FileCheck className="h-4 w-4" />
                  <span>Apply for Website</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Lighthouse Score Strip */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">Verified Lighthouse Metrics:</span>
              <span className="text-slate-500 hidden sm:inline">{selectedDemo.name} Demo</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 font-mono font-bold">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="text-[10px] uppercase font-sans">Perf:</span>
                <span>{selectedDemo.lighthouse.perf}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="text-[10px] uppercase font-sans">SEO:</span>
                <span>{selectedDemo.lighthouse.seo}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="text-[10px] uppercase font-sans">Access:</span>
                <span>{selectedDemo.lighthouse.acc}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="text-[10px] uppercase font-sans">Best:</span>
                <span>{selectedDemo.lighthouse.best}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Live Interactive Demo Viewport Window */}
        <div className="bg-slate-900 rounded-3xl p-3 sm:p-6 shadow-2xl border border-slate-800 flex flex-col items-center">
          {/* Simulated Browser URL Bar */}
          {(() => {
            const liveDemoRoute =
              selectedDemo.id === "corporate"
                ? "/demos/static-business"
                : selectedDemo.id === "ecommerce"
                ? "/demos/ecommerce"
                : "/demos/dynamic-business";

            return (
              <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-800 px-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="bg-slate-950 px-3 py-1 rounded-lg text-slate-400 font-mono text-[11px] border border-slate-800 flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">https://</span>
                    <span>vibawebdev.com{liveDemoRoute}</span>
                  </div>
                  <Link
                    href={liveDemoRoute}
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-[11px] font-bold transition-colors shadow-xs"
                  >
                    <span>Launch Full Demo ↗</span>
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px] hidden md:inline">
                    Viewport Mode: <strong className="text-white uppercase">{viewport}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSimulateClick("Refreshed Demo State")}
                    className="p-1 rounded text-slate-400 hover:text-white"
                    title="Refresh preview"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Interactive Simulation Notification */}
          {simulatedActionMessage && (
            <div className="w-full mb-3 p-2.5 bg-blue-600/90 text-white rounded-xl text-xs font-medium text-center animate-fade-in flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>{simulatedActionMessage}</span>
            </div>
          )}

          {/* Responsive Frame Container */}
          <div
            className={`w-full transition-all duration-300 ${
              viewport === "desktop"
                ? "max-w-full"
                : viewport === "tablet"
                ? "max-w-[720px]"
                : "max-w-[360px]"
            }`}
          >
            {/* The Live Interactive Website Screen */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl text-slate-900 border border-slate-300">
              {/* Demo Website Simulated Header */}
              <div className="border-b border-slate-200 bg-white/95 px-4 sm:px-6 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    VB
                  </div>
                  <div>
                    <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 block leading-tight">
                      {selectedDemo.name}
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold tracking-wide uppercase">
                      ViBa Powered
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-600">
                  <button
                    type="button"
                    onClick={() => handleSimulateClick("Home Tab")}
                    className="hover:text-blue-600"
                  >
                    Home
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateClick("Solutions Tab")}
                    className="hover:text-blue-600"
                  >
                    Solutions
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateClick("Pricing Tab")}
                    className="hover:text-blue-600"
                  >
                    Pricing
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleSimulateClick(selectedDemo.ctaText)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
                >
                  {selectedDemo.ctaText}
                </button>
              </div>

              {/* Demo Website Simulated Hero */}
              <div className="px-5 sm:px-8 py-10 sm:py-14 bg-gradient-to-b from-blue-50/50 via-slate-50/20 to-white text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 mb-4">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{selectedDemo.badge}</span>
                </span>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight max-w-2xl mx-auto leading-tight">
                  {selectedDemo.bannerHeadline}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                  {selectedDemo.bannerDescription}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSimulateClick(selectedDemo.ctaText)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all"
                  >
                    {selectedDemo.ctaText}
                  </button>
                  <Link
                    href="/apply"
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Order Similar Site</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Demo Website Feature Cards */}
              <div className="px-5 sm:px-8 py-8 bg-white border-t border-slate-100">
                <div className="text-center mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    Built-in Architecture
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                    Key Features Included in this Specification
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {selectedDemo.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 text-xs text-slate-700"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Simulated Conversion CTA box */}
                <div className="mt-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="text-blue-900 font-bold block">
                      Like this website architecture?
                    </strong>
                    <span className="text-slate-600">
                      We can customize this design with your branding, domain, and content in 5–10 days.
                    </span>
                  </div>
                  <Link href="/apply">
                    <Button size="sm" variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 font-bold">
                      Apply for This Website
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-slate-400">
            Interactive responsive preview is powered by Next.js 16, React 19, and Tailwind CSS.
          </div>
        </div>

        {/* Bottom Section Action Bar */}
        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/apply">
            <Button size="lg" variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold px-8 shadow-md">
              <FileCheck className="h-5 w-5" />
              <span>Apply for Website</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 font-bold px-8 bg-white">
              <span>View Pricing Packages</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
