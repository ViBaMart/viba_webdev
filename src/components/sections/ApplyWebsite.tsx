"use client";

import React, { useState, useEffect } from "react";
import { AGENCY_CONFIG } from "@/config/agency";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Textarea";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { isValidEmail } from "@/lib/utils";
import { InquiryBudgetRange, InquiryServiceType } from "@/types/inquiry";
import {
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Zap,
  Database,
  ShoppingBag,
  Layers,
  ShieldCheck,
  ArrowRight,
  Eye,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

interface ApplicationFormState {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  serviceType: InquiryServiceType;
  selectedPackageName?: string;
  selectedPackagePricing?: string;
  budgetRange: InquiryBudgetRange;
  timeline: string;
  existingUrl: string;
  message: string;
}

const initialApplicationState: ApplicationFormState = {
  fullName: "",
  email: "",
  company: "",
  phone: "",
  serviceType: "static_website",
  selectedPackageName: undefined,
  selectedPackagePricing: undefined,
  budgetRange: "under_5k",
  timeline: "2_to_4_weeks",
  existingUrl: "",
  message: "",
};

export function ApplyWebsite() {
  const [formData, setFormData] = useState<ApplicationFormState>(initialApplicationState);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormState, string>>>({});
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    referenceId?: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const handlePackageSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{
        packageId?: string;
        packageName?: string;
        serviceType?: InquiryServiceType;
        pricingSummary?: string;
      }>;
      if (customEvent.detail) {
        const { packageName, serviceType, pricingSummary } = customEvent.detail;
        setFormData((prev) => ({
          ...prev,
          serviceType: serviceType || prev.serviceType,
          selectedPackageName: packageName,
          selectedPackagePricing: pricingSummary,
          message:
            prev.message && !prev.message.startsWith("Interested in")
              ? prev.message
              : `Interested in applying for the ${packageName || "website"} package (${pricingSummary || ""}). Please deliver our project technical proposal and fixed quote.`,
        }));
      }
    };

    window.addEventListener("viba-select-package", handlePackageSelect);
    return () => window.removeEventListener("viba-select-package", handlePackageSelect);
  }, []);

  const websiteTypes: {
    type: InquiryServiceType;
    title: string;
    description: string;
    icon: typeof Zap;
  }[] = [
      {
        type: "static_website",
        title: "Static Website",
        description: "Fast marketing site, portfolio or corporate landing page.",
        icon: Zap,
      },
      {
        type: "dynamic_website",
        title: "Dynamic Web App",
        description: "Interactive portal with user logins & cloud database.",
        icon: Database,
      },
      {
        type: "ecommerce",
        title: "E-Commerce Store",
        description: "High-converting online store with Stripe & inventory.",
        icon: ShoppingBag,
      },
      {
        type: "custom_web_app",
        title: "Custom SaaS / Cloud",
        description: "Multi-tenant architecture & scalable cloud system.",
        icon: Layers,
      },
    ];

  const budgetOptions: { value: InquiryBudgetRange; label: string }[] = [
    { value: "under_5k", label: "$500 – $1,500 (Starter / Static)" },
    { value: "5k_to_15k", label: "$1,500 – $3,500 (Growth / Dynamic)" },
    { value: "15k_to_30k", label: "$3,500 – $7,000 (E-Commerce)" },
    { value: "30k_plus", label: "$7,000+ (Custom / Enterprise)" },
  ];

  const timelineOptions = [
    { value: "urgent", label: "Urgent (< 2 weeks)" },
    { value: "2_to_4_weeks", label: "2–4 Weeks (Standard)" },
    { value: "1_to_2_months", label: "1–2 Months" },
    { value: "flexible", label: "Flexible Timeline" },
  ];

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ApplicationFormState, string>> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full name (at least 2 characters).";
    }

    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid business email address.";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Please provide your business or organization name.";
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = "Please briefly outline your website requirements (at least 10 characters).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionResult(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        company: formData.company,
        phone: formData.phone || undefined,
        serviceType: formData.serviceType,
        budgetRange: formData.budgetRange,
        message: `[WEBSITE APPLICATION]
Selected Package: ${formData.selectedPackageName || "Not specified"} ${formData.selectedPackagePricing ? `(${formData.selectedPackagePricing})` : ""}
Website Type: ${formData.serviceType}
Timeline: ${formData.timeline}
Existing URL: ${formData.existingUrl || "None"}
Details: ${formData.message}`,
      };

      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const referenceId =
          data.data?.id || `APP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setSubmissionResult({
          success: true,
          referenceId,
          message:
            "Thank you! Your website application has been registered successfully. Our lead architect will review your project details and deliver a comprehensive proposal and fixed quote within 24 hours.",
        });
        setFormData(initialApplicationState);
        setErrors({});
      } else {
        setSubmissionResult({
          success: false,
          message: data.error || "Failed to submit application. Please verify your details or email us directly.",
        });
      }
    } catch {
      setSubmissionResult({
        success: false,
        message: "Network error occurred while submitting your application. Please check your internet connection or email us directly at " + AGENCY_CONFIG.contactEmail,
      });
    } finally {
      setSubmitting(false);
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
    <section id="apply" className="py-20 sm:py-24 bg-white border-b border-slate-200/80 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="primary" size="md" className="mb-3 bg-blue-50 text-blue-700 border-blue-200">
            Apply for Website
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Start Your Website Application
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Select your desired website specification, specify your project vision, and receive a
            formal technical proposal and guaranteed fixed quote within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Application Form */}
          <div className="lg:col-span-8">
            <Card className="p-6 sm:p-10 border border-slate-200 bg-white rounded-3xl shadow-xl shadow-blue-900/5">
              {submissionResult?.success ? (
                <div className="py-8 text-center space-y-4">
                  <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    Application Successfully Submitted!
                  </h3>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-800 text-xs font-mono font-bold">
                    <span>Reference: {submissionResult.referenceId}</span>
                  </div>
                  <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                    {submissionResult.message}
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSubmissionResult(null)}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                    >
                      Submit Another Application
                    </button>
                    <a
                      href="#demo"
                      onClick={(e) => scrollTo(e, "demo")}
                      className="px-6 py-2.5 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold transition-colors"
                    >
                      Explore Website Demos
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Selected Package Banner (Automatically Filled from Pricing Section) */}
                  {formData.selectedPackageName && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/70 to-blue-50 border-2 border-blue-600/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shrink-0 shadow-xs">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                              Package Selected &amp; Pre-filled
                            </span>
                          </div>
                          <span className="font-extrabold text-base text-slate-900 block mt-0.5">
                            {formData.selectedPackageName}
                          </span>
                          {formData.selectedPackagePricing && (
                            <span className="text-slate-600 text-xs block font-medium mt-0.5">
                              {formData.selectedPackagePricing}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            selectedPackageName: undefined,
                            selectedPackagePricing: undefined,
                          }))
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors shadow-2xs self-end sm:self-center"
                        title="Clear pre-filled package selection"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Change</span>
                      </button>
                    </div>
                  )}

                  {/* Step 1: Website Type Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                      1. Select Your Website Type *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {websiteTypes.map((item) => {
                        const Icon = item.icon;
                        const isSelected = formData.serviceType === item.type;
                        return (
                          <div
                            key={item.type}
                            onClick={() => setFormData({ ...formData, serviceType: item.type })}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all ${isSelected
                                ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600/30"
                                : "border-slate-200 hover:border-blue-300 hover:bg-slate-50/50"
                              }`}
                          >
                            <div className="flex items-center gap-3 mb-1.5">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                                  }`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <span className="font-bold text-sm text-slate-900">{item.title}</span>
                            </div>
                            <p className="text-xs text-slate-500 pl-11">{item.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Contact Information */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                      2. Your Business & Contact Details *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name *"
                        placeholder="John Anderson"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        error={errors.fullName}
                        required
                      />
                      <Input
                        label="Business / Company Name *"
                        placeholder="Acme Enterprises LLC"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        error={errors.company}
                        required
                      />
                      <Input
                        label="Business Email Address *"
                        type="email"
                        placeholder="john@acme.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        error={errors.email}
                        required
                      />
                      <Input
                        label="Phone Number (Optional)"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Step 3: Project Specifications */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                      3. Project Scope & Investment Range *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Estimated Budget Tier
                        </label>
                        <select
                          value={formData.budgetRange}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              budgetRange: e.target.value as InquiryBudgetRange,
                            })
                          }
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        >
                          {budgetOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Target Launch Timeline
                        </label>
                        <select
                          value={formData.timeline}
                          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        >
                          {timelineOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <Input
                          label="Current Website URL (if redesigning or migrating)"
                          placeholder="https://example.com"
                          value={formData.existingUrl}
                          onChange={(e) => setFormData({ ...formData, existingUrl: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Project Requirements */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                      4. Tell Us About Your Website Goals *
                    </label>
                    <Textarea
                      placeholder="Briefly describe your company, target audience, preferred pages (Home, About, Services, Contact), and any special features (e.g. appointment booking, e-commerce catalog, payment gateway)..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      error={errors.message}
                      required
                    />
                  </div>

                  {submissionResult && !submissionResult.success && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{submissionResult.message}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Strict confidentiality & fixed-quote guarantee</span>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      variant="primary"
                      disabled={submitting}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold px-8 shadow-md"
                    >
                      <FileCheck className="h-4 w-4" />
                      <span>{submitting ? "Submitting Application..." : "Submit Website Application"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>

          {/* Right Column: Guarantees & Why Apply */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-7 shadow-xl border border-slate-800">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-800">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <h4 className="font-bold text-base text-white">What Happens Next?</h4>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-[11px] shrink-0">
                    1
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Requirement Assessment</strong>
                    <span>Our principal engineer evaluates your website specifications and tech stack requirements.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-[11px] shrink-0">
                    2
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Fixed-Price Proposal</strong>
                    <span>Within 24 hours, you receive a detailed written scope, milestones, and binding fixed pricing.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-[11px] shrink-0">
                    3
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Rapid Development & Launch</strong>
                    <span>We build and deploy on staging, review together, and launch on your domain with 100% code ownership.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Commitments */}
            <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-6 space-y-3.5">
              <h4 className="font-bold text-sm text-blue-950">ViBa Engineering Commitments</h4>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>100% Mobile, Tablet & Desktop Responsive</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>98+ Google Lighthouse Speed Score</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>No proprietary platform lock-in</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Free SSL & Custom Domain Setup</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-blue-200/80">
                <a
                  href="#demo"
                  onClick={(e) => scrollTo(e, "demo")}
                  className="flex items-center justify-between text-xs font-bold text-blue-700 hover:text-blue-900 group"
                >
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview Live Demos First</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
