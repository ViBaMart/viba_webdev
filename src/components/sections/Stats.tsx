import React from "react";
import { AGENCY_METRICS } from "@/config/agency";

export function Stats() {
  return (
    <section className="bg-white py-12 border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {AGENCY_METRICS.map((metric, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-6 text-center hover:bg-slate-50 transition-colors"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">
                {metric.value}
              </div>
              <div className="mt-2 text-sm font-bold text-slate-900">{metric.label}</div>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

