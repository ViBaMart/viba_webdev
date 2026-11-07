"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AGENCY_CONFIG } from "@/config/agency";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common/Textarea";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { isValidEmail } from "@/lib/utils";
import { InquiryBudgetRange, InquiryServiceType } from "@/types/inquiry";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  Clock,
  Shield,
  Eye,
  FileCheck,
  Globe2,
} from "lucide-react";

interface FormState {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  serviceType: InquiryServiceType;
  budgetRange: InquiryBudgetRange;
  message: string;
}

const initialFormState: FormState = {
  fullName: "",
  email: "",
  company: "",
  phone: "",
  serviceType: "static_website",
  budgetRange: "under_5k",
  message: "",
};

export function ContactForm() {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [serverFeedback, setServerFeedback] = useState<{
    type: "success" | "error" | "config_notice";
    message: string;
    details?: string;
  } | null>(null);

  const validate = (): boolean => {
    const errors: Partial<Record<keyof FormState, string>> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errors.fullName = "Please enter your full name (minimum 2 characters).";
    }

    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      errors.email = "Please enter a valid business email address.";
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errors.message = "Please describe your message or requirements (minimum 10 characters).";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerFeedback(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.status === 201 && result.success) {
        setServerFeedback({
          type: "success",
          message:
            "Thank you! Your message has been sent successfully. Our senior web development team will reply to your email within 24 hours.",
        });
        setFormData(initialFormState);
        setFieldErrors({});
      } else if (response.status === 503) {
        setServerFeedback({
          type: "config_notice",
          message: "Inquiry received in local session mode.",
          details:
            result.error ||
            "Your message has been processed. For production cloud sync, ensure Firebase environment variables are configured.",
        });
      } else {
        setServerFeedback({
          type: "error",
          message: result.error || "Failed to submit message. Please verify your entries.",
        });
      }
    } catch (err) {
      setServerFeedback({
        type: "error",
        message:
          err instanceof Error
            ? `Network request failed: ${err.message}`
            : "An unexpected error occurred while communicating with the server.",
      });
    } finally {
      setLoading(false);
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
    <section id="contact" className="py-20 sm:py-24 bg-slate-50/70 border-b border-slate-200/80 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" size="md" className="mb-3 bg-blue-50 text-blue-700 border-blue-200">
            Contact Us
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Get in Touch With Our Team
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Have questions about your upcoming website project or need technical advice?
            Reach out directly or apply for a comprehensive website proposal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Agency Channels */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-white border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {AGENCY_CONFIG.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                We design and engineer high-performance websites for businesses worldwide.
                Every project is managed directly by senior web developers.
              </p>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Mail className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Email Address
                    </span>
                    <a
                      href={`mailto:${AGENCY_CONFIG.contactEmail}`}
                      className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      {AGENCY_CONFIG.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Phone className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Direct Phone
                    </span>
                    <span className="font-semibold text-slate-900">{AGENCY_CONFIG.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Response Time
                    </span>
                    <span className="font-semibold text-slate-900">
                      Guaranteed within 24 hours
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Globe2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Official Domain
                    </span>
                    <span className="font-semibold text-slate-900 font-mono text-xs">
                      {AGENCY_CONFIG.domain}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>NDA & Client confidentiality guaranteed on all discussions</span>
              </div>
            </Card>

            {/* Quick Action Navigation Card */}
            <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 shadow-md">
              <h4 className="font-bold text-base mb-1.5">Ready to Get Started Immediately?</h4>
              <p className="text-xs text-blue-100 mb-4 leading-relaxed">
                Skip the back-and-forth and submit your project requirements through our official website application.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <Link href="/apply" className="w-full">
                  <Button size="sm" variant="primary" className="w-full bg-white text-blue-900 hover:bg-slate-100 font-bold gap-1.5 justify-center">
                    <FileCheck className="h-4 w-4" />
                    <span>Apply for Website</span>
                  </Button>
                </Link>
                <Link href="/demo" className="w-full">
                  <Button size="sm" variant="outline" className="w-full border-white/40 text-white hover:bg-white/10 font-bold gap-1.5 justify-center">
                    <Eye className="h-4 w-4" />
                    <span>View Demo</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <Card className="bg-white border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Send Us a Direct Message
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill out this brief form and our team will get back to you promptly.
                </p>
              </div>

              {/* Feedback Alert */}
              {serverFeedback && (
                <div
                  className={`mb-6 p-4 rounded-2xl border text-xs sm:text-sm ${
                    serverFeedback.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : serverFeedback.type === "config_notice"
                      ? "bg-amber-50 border-amber-200 text-amber-900"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {serverFeedback.type === "success" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold">{serverFeedback.message}</p>
                      {serverFeedback.details && (
                        <p className="text-xs mt-1 leading-relaxed opacity-90">
                          {serverFeedback.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    name="fullName"
                    placeholder="e.g. Michael Scott"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    error={fieldErrors.fullName}
                  />

                  <Input
                    label="Work Email *"
                    name="email"
                    type="email"
                    placeholder="e.g. michael@company.com"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    error={fieldErrors.email}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Company / Business Name"
                    name="company"
                    placeholder="e.g. Scott Paper Co."
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />

                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="e.g. +1 (555) 019-2834"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Interested In
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          serviceType: e.target.value as InquiryServiceType,
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="static_website">Static Website Package</option>
                      <option value="dynamic_website">Dynamic Website Package</option>
                      <option value="ecommerce">E-Commerce Website Package</option>
                      <option value="custom_web_app">Custom Website & SaaS</option>
                      <option value="other">General Question / Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Target Budget
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          budgetRange: e.target.value as InquiryBudgetRange,
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 shadow-xs focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="under_5k">&lt; $1,500 USD (Starter)</option>
                      <option value="5k_to_15k">$1,500 - $3,500 USD (Growth)</option>
                      <option value="15k_to_30k">$3,500 - $7,000 USD (E-Commerce)</option>
                      <option value="above_30k">$7,000+ USD (Custom / Enterprise)</option>
                      <option value="not_specified">Flexible / Undisclosed</option>
                    </select>
                  </div>
                </div>

                <Textarea
                  label="Message / Inquiry Details *"
                  name="message"
                  required
                  placeholder="How can we help your business? Describe your project vision or ask any question..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  error={fieldErrors.message}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md gap-2"
                  >
                    <span>Send Message</span>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
