"use client";

import React, { useState } from "react";
import { AGENCY_CONFIG } from "@/config/agency";
import { VbLogo } from "@/components/common/VbLogo";
import { Button } from "@/components/common/Button";
import {
  ArrowRight,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  Eye,
  FileCheck,
} from "lucide-react";

export function Hero() {
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white pt-10 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-200/80"
    >
      {/* Background Subtle Gradient & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#2563eb_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-[0.035] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-transparent pointer-events-none -z-10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Agency Badge Pill */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 shadow-xs hover:border-blue-300 transition-colors">
            <span className="flex h-5 w-5 items-center justify-center rounded-md overflow-hidden shrink-0">
              <VbLogo size="sm" variant="plain" showText={false} />
            </span>
            <span className="text-xs font-bold text-blue-950 tracking-tight">
              ViBa Web Development Solutions
            </span>
            <span className="hidden sm:inline text-blue-300">•</span>
            <span className="hidden sm:inline text-xs font-semibold text-blue-700">
              Verified Web Engineering
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse ml-0.5" />
          </div>
        </div>

        {/* Hero Main Content */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
            Transform Your Business With{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
              High-Performance Websites
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-normal">
            Welcome to <strong className="text-slate-900 font-semibold">{AGENCY_CONFIG.name}</strong>.
            We design and engineer lightning-fast static websites, scalable dynamic web applications,
            and high-converting e-commerce solutions built on modern Next.js and secure cloud architectures.
          </p>

          {/* Quick Key Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-slate-700 pt-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>98+ Lighthouse Performance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>100% Responsive Design</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Custom Domain & SSL Ready</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Full Code Ownership</span>
            </div>
          </div>

          {/* Clear Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#apply"
              onClick={(e) => scrollToSection(e, "apply")}
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="primary"
                className="w-full sm:w-auto shadow-md shadow-blue-600/25 gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base"
              >
                <FileCheck className="h-5 w-5" />
                <span>Apply for Website</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </a>

            <a
              href="#demo"
              onClick={(e) => scrollToSection(e, "demo")}
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto gap-2 px-8 py-3.5 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 font-bold text-base bg-white shadow-xs"
              >
                <Eye className="h-5 w-5 text-blue-600" />
                <span>View Demo</span>
              </Button>
            </a>
          </div>
        </div>

        {/* Interactive Device Preview Showcase */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xl shadow-blue-900/5">
            {/* Viewport bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md ml-2">
                  https://vibawebdev.com/solutions
                </span>
              </div>

              {/* Viewport switch buttons */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setDeviceView("desktop")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    deviceView === "desktop"
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView("tablet")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    deviceView === "tablet"
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Tablet className="h-3.5 w-3.5" />
                  <span>Tablet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView("mobile")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    deviceView === "mobile"
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Simulated Live Responsive Canvas */}
            <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 text-white min-h-[320px] flex flex-col items-center justify-center transition-all">
              <div
                className={`transition-all duration-300 w-full ${
                  deviceView === "desktop"
                    ? "max-w-full"
                    : deviceView === "tablet"
                    ? "max-w-[480px]"
                    : "max-w-[300px]"
                }`}
              >
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-2xl">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-md bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                        VB
                      </div>
                      <span className="font-bold text-white text-xs truncate">
                        ViBa Web Solutions
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-semibold">
                      99 Speed Score
                    </span>
                  </div>

                  {/* Body Preview */}
                  <div className="space-y-3">
                    <div className="h-4 w-2/3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded" />
                    <div className="h-2 w-full bg-slate-800 rounded" />
                    <div className="h-2 w-4/5 bg-slate-800 rounded" />

                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                        <span className="text-[10px] font-bold text-blue-400 block">Static</span>
                        <span className="text-[9px] text-slate-400">&lt;250ms</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                        <span className="text-[10px] font-bold text-indigo-400 block">Dynamic</span>
                        <span className="text-[9px] text-slate-400">Database</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                        <span className="text-[10px] font-bold text-emerald-400 block">E-Commerce</span>
                        <span className="text-[9px] text-slate-400">Checkout</span>
                      </div>
                    </div>

                    <div className="mt-3 p-2 rounded bg-blue-950/60 border border-blue-800/60 flex items-center justify-between text-[10px]">
                      <span className="text-blue-300 font-medium">Ready to deploy your website?</span>
                      <a
                        href="#apply"
                        onClick={(e) => scrollToSection(e, "apply")}
                        className="bg-blue-600 text-white px-2 py-0.5 rounded font-semibold hover:bg-blue-500"
                      >
                        Apply Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <span className="text-xs text-slate-400 font-medium">
                  Active Viewport:{" "}
                  <span className="text-blue-400 font-bold uppercase">{deviceView}</span> • Optimized for all screen sizes
                </span>
              </div>
            </div>

            {/* Bottom Proof Strip */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xl font-extrabold text-blue-600">120+</div>
                <div className="text-[11px] font-medium text-slate-600">Websites Launched</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xl font-extrabold text-blue-600">98+</div>
                <div className="text-[11px] font-medium text-slate-600">Lighthouse Score</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xl font-extrabold text-blue-600">99.9%</div>
                <div className="text-[11px] font-medium text-slate-600">Uptime SLA</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xl font-extrabold text-blue-600">24/7</div>
                <div className="text-[11px] font-medium text-slate-600">Dedicated Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
