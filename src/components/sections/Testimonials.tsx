import React from "react";
import { CUSTOMER_TESTIMONIALS } from "@/config/testimonials";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Award,
} from "lucide-react";

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-3">
            Client Reviews & Proof
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Ambitious Founders & Tech Leaders
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            See how ViBa WebDevloper transforms technical vision into high-performing digital realities.
            Read unedited feedback from our long-term client partners.
          </p>

          {/* Social Proof Stats Banner */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-slate-900">4.9 / 5.0</span>
              <span>Client Rating</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>100% Verified Reviews</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4 text-blue-600" />
              <span>120+ Delivered Applications</span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid (Responsive: 1-col mobile, 2-col tablet md, 3-col desktop lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {CUSTOMER_TESTIMONIALS.map((testimonial) => (
            <Card
              key={testimonial.id}
              hoverEffect
              className="flex flex-col justify-between h-full bg-slate-50/60 border border-slate-200 p-6 sm:p-7 shadow-xs hover:bg-white hover:shadow-md transition-all relative"
            >
              <div>
                {/* Rating & Project Type */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <Badge variant="outline" size="sm" className="text-[10px]">
                    {testimonial.projectType}
                  </Badge>
                </div>

                {/* Key Metric Highlight */}
                <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100/80 text-blue-700 text-xs font-bold font-mono">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                  <span>{testimonial.keyMetric}</span>
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-200/80 mt-auto flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-xs shrink-0">
                  {testimonial.avatarText}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-slate-900 truncate">
                      {testimonial.name}
                    </span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
