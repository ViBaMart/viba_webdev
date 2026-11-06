import React from "react";
import { AGENCY_CONFIG } from "@/config/agency";
import { Button } from "@/components/common/Button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="bg-slate-900 py-16 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center lg:text-left space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Production-Ready Engineering</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Build with {AGENCY_CONFIG.name}?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Whether bootstrapping a high-growth multi-tenant SaaS or modernizing legacy web
              infrastructure, partner with an agency specialized in modern Next.js and Firebase cloud systems.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a href="#contact" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-lg bg-blue-500 hover:bg-blue-600">
                <span>Start Discovery Call</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="#services" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700">
                <span>Browse Services</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
