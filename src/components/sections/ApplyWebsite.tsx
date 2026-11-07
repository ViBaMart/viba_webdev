"use client";

import React, { useState, useEffect, useRef } from "react";
import { AGENCY_CONFIG } from "@/config/agency";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Card } from "@/components/common/Card";
import { isValidEmail } from "@/lib/utils";
import { WebsiteType, DomainRequirement } from "@/types/application";
import {
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Zap,
  Database,
  ShoppingBag,
  ArrowRight,
  UploadCloud,
  X,
  Clock,
  Sparkles,
  Paperclip,
  Check,
  RefreshCw,
  Copy,
} from "lucide-react";

interface ApplicationFormState {
  customerName: string;
  businessName: string;
  email: string;
  mobileNumber: string;
  businessAddress: string;
  websiteType: WebsiteType;
  selectedPackage: string;
  businessDescription: string;
  requiredPages: string;
  requiredFunctionality: string;
  preferredDesign: string;
  referenceLinks: string;
  domainRequirement: DomainRequirement | string;
  additionalRequirements: string;
}

const initialFormState: ApplicationFormState = {
  customerName: "",
  businessName: "",
  email: "",
  mobileNumber: "",
  businessAddress: "",
  websiteType: "Static Website",
  selectedPackage: "Basic Static Website (₹15,998 first year)",
  businessDescription: "",
  requiredPages: "Home, About Us, Services, Portfolio / Gallery, Contact Us",
  requiredFunctionality: "Contact inquiry form, Google Maps, SEO metadata, SSL encryption",
  preferredDesign: "Modern, Minimalist & High-Performance",
  referenceLinks: "",
  domainRequirement: "I already have a registered domain name",
  additionalRequirements: "",
};

export function ApplyWebsite() {
  const [formData, setFormData] = useState<ApplicationFormState>(initialFormState);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormState, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Success result from API only
  const [submittedApplication, setSubmittedApplication] = useState<{
    id: string;
    customerName: string;
    businessName: string;
    websiteType: string;
    selectedPackage: string;
    email: string;
    filesCount: number;
    createdAt: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Listen for package selection events from the pricing section
  useEffect(() => {
    // 1. Check if a package was selected from /pricing and stored in sessionStorage
    try {
      const stored = sessionStorage.getItem("viba_selected_package");
      if (stored) {
        const detail = JSON.parse(stored);
        if (detail) {
          const { packageName, serviceType, pricingSummary } = detail;
          let mappedType: WebsiteType = "Static Website";
          if (serviceType === "dynamic_website") mappedType = "Dynamic Business Website";
          if (serviceType === "ecommerce") mappedType = "E-commerce Website";

          setFormData((prev) => ({
            ...prev,
            websiteType: mappedType,
            selectedPackage: `${packageName || "Selected Package"} ${pricingSummary ? `(${pricingSummary})` : ""}`,
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }

    const handlePackageSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{
        packageId?: string;
        packageName?: string;
        serviceType?: string;
        pricingSummary?: string;
      }>;
      if (customEvent.detail) {
        const { packageName, serviceType, pricingSummary } = customEvent.detail;

        let mappedType: WebsiteType = "Static Website";
        if (serviceType === "dynamic_website") mappedType = "Dynamic Business Website";
        if (serviceType === "ecommerce") mappedType = "E-commerce Website";

        setFormData((prev) => ({
          ...prev,
          websiteType: mappedType,
          selectedPackage: `${packageName || "Selected Package"} ${pricingSummary ? `(${pricingSummary})` : ""}`,
        }));
      }
    };

    window.addEventListener("viba-select-package", handlePackageSelect);
    return () => window.removeEventListener("viba-select-package", handlePackageSelect);
  }, []);

  const websiteTypeOptions: {
    type: WebsiteType;
    title: string;
    description: string;
    icon: typeof Zap;
  }[] = [
    {
      type: "Static Website",
      title: "Static Website",
      description: "Sub-300ms speed, presentation portfolio or corporate landing page.",
      icon: Zap,
    },
    {
      type: "Dynamic Business Website",
      title: "Dynamic Business Website",
      description: "Interactive application, client CMS portals, user auth & database.",
      icon: Database,
    },
    {
      type: "E-commerce Website",
      title: "E-commerce Website",
      description: "Full online store with catalog, shopping cart & Stripe checkout.",
      icon: ShoppingBag,
    },
  ];

  const domainOptions: DomainRequirement[] = [
    "I already have a registered domain name",
    "I need ViBa to register a new domain for me",
    "I need assistance transferring an existing domain",
    "Not sure / need consultation",
  ];

  const packageOptionsByWebsiteType: Record<WebsiteType, string[]> = {
    "Static Website": [
      "Basic Static Website (₹15,998 first year)",
      "Multi-Page Corporate Static (₹19,999)",
      "High-Performance Custom Landing Page (₹12,499)",
    ],
    "Dynamic Business Website": [
      "Business / Dynamic Website (₹36,998 first year)",
      "Full-Stack Web App with Client Portal (₹49,999)",
      "SaaS MVP Engine & API Backend (₹65,000+)",
    ],
    "E-commerce Website": [
      "Starter Storefront ($3,499 / approved pricing)",
      "Growth E-Commerce Store ($5,999)",
      "Multi-Vendor Enterprise Commerce ($8,999+)",
    ],
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      // Limit to 5 files total and 10MB each
      const validFiles = newFiles.filter((f) => {
        if (f.size > 10 * 1024 * 1024) {
          alert(`File "${f.name}" exceeds the 10MB size limit and was skipped.`);
          return false;
        }
        return true;
      });

      setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, 5));
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ApplicationFormState, string>> = {};

    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      newErrors.customerName = "Customer name must be at least 2 characters.";
    }

    if (!formData.businessName.trim() || formData.businessName.trim().length < 2) {
      newErrors.businessName = "Business name must be at least 2 characters.";
    }

    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid business email address.";
    }

    if (!formData.mobileNumber.trim() || formData.mobileNumber.trim().length < 7) {
      newErrors.mobileNumber = "Please enter a valid mobile number (at least 7 digits).";
    }

    if (!formData.businessAddress.trim() || formData.businessAddress.trim().length < 5) {
      newErrors.businessAddress = "Please provide your business or office location address.";
    }

    if (!formData.businessDescription.trim() || formData.businessDescription.trim().length < 10) {
      newErrors.businessDescription = "Please provide a brief business description (at least 10 characters).";
    }

    if (!formData.requiredPages.trim()) {
      newErrors.requiredPages = "Please list the pages required on your website.";
    }

    if (!formData.requiredFunctionality.trim()) {
      newErrors.requiredFunctionality = "Please specify the key functionality needed.";
    }

    if (!formData.preferredDesign.trim()) {
      newErrors.preferredDesign = "Please describe your preferred website design style.";
    }

    if (!formData.domainRequirement.trim()) {
      newErrors.domainRequirement = "Please indicate your domain requirement.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);

    try {
      const payloadData = new FormData();
      payloadData.append("customerName", formData.customerName);
      payloadData.append("businessName", formData.businessName);
      payloadData.append("email", formData.email);
      payloadData.append("mobileNumber", formData.mobileNumber);
      payloadData.append("businessAddress", formData.businessAddress);
      payloadData.append("websiteType", formData.websiteType);
      payloadData.append("selectedPackage", formData.selectedPackage);
      payloadData.append("businessDescription", formData.businessDescription);
      payloadData.append("requiredPages", formData.requiredPages);
      payloadData.append("requiredFunctionality", formData.requiredFunctionality);
      payloadData.append("preferredDesign", formData.preferredDesign);
      payloadData.append("referenceLinks", formData.referenceLinks);
      payloadData.append("domainRequirement", formData.domainRequirement);
      payloadData.append("additionalRequirements", formData.additionalRequirements);

      // Append reference files
      selectedFiles.forEach((file) => {
        payloadData.append("files", file);
      });

      const response = await fetch("/api/applications", {
        method: "POST",
        body: payloadData,
      });

      const result = await response.json();

      if (response.ok && result.success && result.data) {
        // Show application submission confirmation ONLY after successful API response
        setSubmittedApplication({
          id: result.data.id || result.applicationId,
          customerName: result.data.customerName,
          businessName: result.data.businessName,
          websiteType: result.data.websiteType,
          selectedPackage: result.data.selectedPackage,
          email: result.data.email,
          filesCount: result.data.files ? result.data.files.length : selectedFiles.length,
          createdAt: result.data.createdAt,
        });

        // Reset form state
        setFormData(initialFormState);
        setSelectedFiles([]);
        setErrors({});

        // Scroll smoothly to confirmation
        const applySection = document.getElementById("apply");
        if (applySection) {
          applySection.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        setApiError(
          result.error ||
            "Unable to register your website application. Please review your entries and try again."
        );
      }
    } catch {
      setApiError(
        "A network error occurred while communicating with the server. Please verify your connection or reach out directly to " +
          AGENCY_CONFIG.contactEmail
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyApplicationId = (id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  return (
    <section id="apply" className="py-20 sm:py-24 bg-slate-50 border-b border-slate-200/80 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="primary" size="md" className="mb-3 bg-blue-50 text-blue-700 border-blue-200">
            Apply for Website
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Customer Website Application
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Ready to build or scale your digital presence? Submit your comprehensive website specification below.
            No account registration required.
          </p>
        </div>

        {/* ========================================================
            SUBMISSION CONFIRMATION VIEW
            (Rendered ONLY after verified successful API response)
           ======================================================== */}
        {submittedApplication ? (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 shadow-xl text-center space-y-6">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Application Successfully Registered in Cloud Database</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Website Application Received!
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-900">{submittedApplication.customerName}</strong>. Your project application for{" "}
                <strong className="text-slate-900">{submittedApplication.businessName}</strong> has been assigned an official reference dossier.
              </p>
            </div>

            {/* Official Application Reference ID Badge */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto shadow-md">
              <div className="text-left">
                <span className="text-[11px] uppercase tracking-wider text-blue-400 font-bold block">
                  Unique Application ID:
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-white">
                  {submittedApplication.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyApplicationId(submittedApplication.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center gap-1.5 shrink-0"
              >
                {copiedId ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>

            {/* Applied Summary Table */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs text-left space-y-2.5 max-w-xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">Applied Website Type:</span>
                <span className="font-bold text-slate-900">{submittedApplication.websiteType}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">Selected Package:</span>
                <span className="font-bold text-blue-700">{submittedApplication.selectedPackage}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="text-slate-500 font-medium">Primary Contact Email:</span>
                <span className="font-bold text-slate-900">{submittedApplication.email}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500 font-medium">Uploaded Reference Files:</span>
                <span className="font-bold text-slate-900">
                  {submittedApplication.filesCount > 0
                    ? `${submittedApplication.filesCount} file(s) safely archived in Firebase Storage`
                    : "No files attached"}
                </span>
              </div>
            </div>

            {/* SLA Next Steps Guarantee */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-3 max-w-xl mx-auto text-left">
              <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">24-Hour Engineering SLA Review:</strong>
                <span className="text-slate-600">
                  Our Lead Solutions Architect will examine your specifications and reply to {submittedApplication.email} within 24 business hours with an architectural roadmap and formal proposal.
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                onClick={() => setSubmittedApplication(null)}
                variant="outline"
                size="md"
                className="gap-2 font-bold text-slate-700 bg-white"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Submit Another Website Application</span>
              </Button>
            </div>
          </div>
        ) : (
          /* ========================================================
              CUSTOMER APPLICATION FORM (15 SPECIFIED FIELDS)
             ======================================================== */
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* API Server-side Error Alert */}
              {apiError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-red-900">Submission Notice:</strong>
                    <span>{apiError}</span>
                  </div>
                </div>
              )}

              {/* SECTION 1: CUSTOMER & BUSINESS CONTACT DETAILS */}
              <Card className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Step 1 of 4
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    Customer & Business Identity
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your contact details for contract generation, proposal dispatch, and project liaison.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Field 1: Customer Name */}
                  <div id="field-customerName">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      1. Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden ${
                        errors.customerName ? "border-red-400 bg-red-50/30" : "border-slate-300 focus:border-blue-600"
                      }`}
                    />
                    {errors.customerName && (
                      <span className="text-[11px] text-red-600 font-medium block mt-1">
                        {errors.customerName}
                      </span>
                    )}
                  </div>

                  {/* Field 2: Business Name */}
                  <div id="field-businessName">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      2. Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chandra Advisory Services"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden ${
                        errors.businessName ? "border-red-400 bg-red-50/30" : "border-slate-300 focus:border-blue-600"
                      }`}
                    />
                    {errors.businessName && (
                      <span className="text-[11px] text-red-600 font-medium block mt-1">
                        {errors.businessName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Field 3: Email */}
                  <div id="field-email">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      3. Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ramesh@chandraadvisory.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden ${
                        errors.email ? "border-red-400 bg-red-50/30" : "border-slate-300 focus:border-blue-600"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[11px] text-red-600 font-medium block mt-1">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Field 4: Mobile Number */}
                  <div id="field-mobileNumber">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      4. Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98450 12345"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden ${
                        errors.mobileNumber ? "border-red-400 bg-red-50/30" : "border-slate-300 focus:border-blue-600"
                      }`}
                    />
                    {errors.mobileNumber && (
                      <span className="text-[11px] text-red-600 font-medium block mt-1">
                        {errors.mobileNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Field 5: Business Address */}
                <div id="field-businessAddress">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    5. Business Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Full physical office or registered company address..."
                    value={formData.businessAddress}
                    onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all resize-none focus:outline-hidden ${
                      errors.businessAddress ? "border-red-400 bg-red-50/30" : "border-slate-300 focus:border-blue-600"
                    }`}
                  />
                  {errors.businessAddress && (
                    <span className="text-[11px] text-red-600 font-medium block mt-1">
                      {errors.businessAddress}
                    </span>
                  )}
                </div>
              </Card>

              {/* SECTION 2: WEBSITE TYPE & PACKAGE SPECIFICATION */}
              <Card className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Step 2 of 4
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    Website Architecture & Package
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Select your core architectural tier and associated engineering package.
                  </p>
                </div>

                {/* Field 6: Website Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                    6. Website Type *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {websiteTypeOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = formData.websiteType === opt.type;
                      return (
                        <div
                          key={opt.type}
                          onClick={() => {
                            const newDefaultPkg = packageOptionsByWebsiteType[opt.type][0];
                            setFormData({
                              ...formData,
                              websiteType: opt.type,
                              selectedPackage: newDefaultPkg,
                            });
                          }}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-600/20"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className={`p-2 rounded-xl ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-slate-900 mb-1">{opt.title}</div>
                            <div className="text-[11px] text-slate-500 leading-snug">{opt.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Field 7: Selected Package */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    7. Selected Package *
                  </label>
                  <select
                    value={formData.selectedPackage}
                    onChange={(e) => setFormData({ ...formData, selectedPackage: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 bg-white font-medium text-slate-900"
                  >
                    {packageOptionsByWebsiteType[formData.websiteType].map((pkg, i) => (
                      <option key={i} value={pkg}>
                        {pkg}
                      </option>
                    ))}
                    <option value="Custom Bespoke Solution">Custom Bespoke Solution (Discuss on Call)</option>
                  </select>
                </div>

                {/* Field 13: Domain Requirement */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    13. Domain Requirement *
                  </label>
                  <select
                    value={formData.domainRequirement}
                    onChange={(e) => setFormData({ ...formData, domainRequirement: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600 bg-white"
                  >
                    {domainOptions.map((dom, i) => (
                      <option key={i} value={dom}>
                        {dom}
                      </option>
                    ))}
                  </select>
                </div>
              </Card>

              {/* SECTION 3: SCOPE, DESIGN & REQUIREMENTS */}
              <Card className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Step 3 of 4
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    Scope, Content & Functional Deliverables
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Detail the exact structure, capabilities, and styling you envisage for your new website.
                  </p>
                </div>

                {/* Field 8: Business Description */}
                <div id="field-businessDescription">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    8. Business Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Briefly describe what your company does, your unique value proposition, and key target market..."
                    value={formData.businessDescription}
                    onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all resize-none focus:outline-hidden ${
                      errors.businessDescription ? "border-red-400 bg-red-50/30" : "border-slate-300 focus:border-blue-600"
                    }`}
                  />
                  {errors.businessDescription && (
                    <span className="text-[11px] text-red-600 font-medium block mt-1">
                      {errors.businessDescription}
                    </span>
                  )}
                </div>

                {/* Field 9: Required Website Pages */}
                <div id="field-requiredPages">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      9. Required Website Pages *
                    </label>
                    <span className="text-[11px] text-slate-400">Comma separated</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Home, About Us, Services, Portfolio, Pricing, Case Studies, Contact Us"
                    value={formData.requiredPages}
                    onChange={(e) => setFormData({ ...formData, requiredPages: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden ${
                      errors.requiredPages ? "border-red-400 bg-red-50/30" : "border-slate-300 focus:border-blue-600"
                    }`}
                  />
                  {errors.requiredPages && (
                    <span className="text-[11px] text-red-600 font-medium block mt-1">
                      {errors.requiredPages}
                    </span>
                  )}
                </div>

                {/* Field 10: Required Functionality */}
                <div id="field-requiredFunctionality">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    10. Required Functionality *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. Lead capture forms, Stripe/Razorpay payment gateway, CMS admin portal, interactive cost estimator, WhatsApp widget..."
                    value={formData.requiredFunctionality}
                    onChange={(e) => setFormData({ ...formData, requiredFunctionality: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all resize-none focus:outline-hidden ${
                      errors.requiredFunctionality ? "border-red-400 bg-red-50/30" : "border-slate-300 focus:border-blue-600"
                    }`}
                  />
                  {errors.requiredFunctionality && (
                    <span className="text-[11px] text-red-600 font-medium block mt-1">
                      {errors.requiredFunctionality}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Field 11: Preferred Website Design */}
                  <div id="field-preferredDesign">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      11. Preferred Website Design *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Modern Minimalist, Corporate Navy, Clean Dark Mode"
                      value={formData.preferredDesign}
                      onChange={(e) => setFormData({ ...formData, preferredDesign: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-hidden ${
                        errors.preferredDesign ? "border-red-400 bg-red-50/30" : "border-slate-300 focus:border-blue-600"
                      }`}
                    />
                    {errors.preferredDesign && (
                      <span className="text-[11px] text-red-600 font-medium block mt-1">
                        {errors.preferredDesign}
                      </span>
                    )}
                  </div>

                  {/* Field 12: Reference Website Links */}
                  <div id="field-referenceLinks">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      12. Reference Website Links
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://linear.app, https://stripe.com"
                      value={formData.referenceLinks}
                      onChange={(e) => setFormData({ ...formData, referenceLinks: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-blue-600"
                    />
                  </div>
                </div>
              </Card>

              {/* SECTION 4: FILE UPLOADS & ADDITIONAL REQUIREMENTS */}
              <Card className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Step 4 of 4
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    File Uploads & Additional Specifications
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload your logos, wireframes, brand guides, or project documents directly to Firebase Storage.
                  </p>
                </div>

                {/* Field 15: File and image uploads */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    15. Reference Files and Image Uploads
                  </label>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-6 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl bg-slate-50/70 hover:bg-blue-50/30 transition-all text-center cursor-pointer space-y-2"
                  >
                    <UploadCloud className="h-8 w-8 text-blue-600 mx-auto" />
                    <div className="text-xs text-slate-700 font-semibold">
                      <span>Click to select reference documents or drag and drop</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      PNG, JPG, SVG, WebP, PDF or DOCX (Max 10MB per file, up to 5 files)
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,application/pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Selected Files Chips List */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <span className="text-[11px] font-bold text-slate-600 block">
                        Files ready for Firebase Storage upload ({selectedFiles.length}/5):
                      </span>
                      <div className="space-y-1.5">
                        {selectedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Paperclip className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                              <span className="font-semibold text-slate-800 truncate">{file.name}</span>
                              <span className="text-[10px] text-slate-500 shrink-0">
                                ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="text-slate-400 hover:text-red-500 p-1"
                              title="Remove file"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Field 14: Additional Requirements */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    14. Additional Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specific deadlines, hosting preferences, legacy database migrations, compliance standards, or custom instructions..."
                    value={formData.additionalRequirements}
                    onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm transition-all resize-none focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </Card>

              {/* Submission Submit Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="font-extrabold text-base sm:text-lg">
                    Ready to engineer your website?
                  </div>
                  <div className="text-xs text-blue-100">
                    Instant confirmation with verifiable Application ID saved in Firebase.
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  size="lg"
                  className="w-full sm:w-auto bg-white hover:bg-slate-100 text-blue-700 font-extrabold px-8 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>Saving Application...</span>
                    </span>
                  ) : (
                    <>
                      <FileCheck className="h-5 w-5 text-blue-600" />
                      <span>Submit Website Application</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
