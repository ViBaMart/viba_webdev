"use client";

import React, { useState, useEffect, useCallback, useId } from "react";
import Link from "next/link";
import { VbMonogram } from "@/components/common/VbMonogram";
import {
  CustomerApplication,
  ApplicationStatus,
  WebsiteType,
} from "@/types/application";
import {
  CustomerProjectRecord,
  ProjectStage,
  PROJECT_STAGES_LIST,
} from "@/types/customerProject";
import { QuotationRecord, AdditionalChargeItem } from "@/types/quotation";
import { PaymentRecord, PaymentStatus, PaymentTransaction } from "@/types/payment";
import {
  DomainWithExpiryMeta,
  DomainStats,
  CustomerPaymentStatus,
  DomainManagementStatus,
  CreateDomainDTO,
  RecordRenewalDTO,
} from "@/types/domain";
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Download,
  ExternalLink,
  Layers,
  Briefcase,
  DollarSign,
  LogOut,
  RefreshCw,
  X,
  AlertCircle,
  Plus,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Tag,
  Paperclip,
  Lock,
  CreditCard,
  Printer,
  Check,
  Clock,
  MessageSquare,
  UploadCloud,
  Share2,
  Copy,
  AlertTriangle,
  History,
  Calendar,
  Pencil,
} from "lucide-react";

const ALL_APPLICATION_STATUSES: ApplicationStatus[] = [
  "New Application",
  "Under Review",
  "Quotation Prepared",
  "Awaiting Approval",
  "Payment Pending",
  "Project Started",
  "Completed",
  "Rejected",
];

const WEBSITE_TYPES: WebsiteType[] = [
  "Static Website",
  "Dynamic Business Website",
  "E-commerce Website",
];

const ALL_PAYMENT_STATUSES: PaymentStatus[] = [
  "Unpaid",
  "Pending Advance Verification",
  "Advance Paid",
  "Pending Final Verification",
  "Fully Paid",
  "Refunded",
];

function getStatusBadgeStyle(status: string) {
  switch (status) {
    case "New Application":
    case "pending":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
    case "Under Review":
    case "under_review":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "Quotation Prepared":
      return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    case "Awaiting Approval":
      return "bg-purple-500/15 text-purple-400 border-purple-500/30";
    case "Payment Pending":
      return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
    case "Project Started":
    case "in_development":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "Completed":
      return "bg-teal-500/15 text-teal-300 border-teal-500/30";
    case "Rejected":
      return "bg-rose-500/15 text-rose-400 border-rose-500/30";
    default:
      return "bg-slate-800 text-slate-300 border-slate-700";
  }
}

function getPaymentBadgeStyle(status: PaymentStatus) {
  switch (status) {
    case "Fully Paid":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "Advance Paid":
      return "bg-teal-500/15 text-teal-300 border-teal-500/30";
    case "Pending Advance Verification":
    case "Pending Final Verification":
      return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    case "Refunded":
      return "bg-purple-500/15 text-purple-400 border-purple-500/30";
    case "Unpaid":
    default:
      return "bg-rose-500/15 text-rose-400 border-rose-500/30";
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function computeDefaultLaunchDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
}

export default function AdminDashboardPage() {
  // Authentication State
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Dashboard Tab
  const [activeTab, setActiveTab] = useState<
    "applications" | "quotations" | "payments" | "projects" | "domains"
  >("applications");

  // Applications State
  const [applications, setApplications] = useState<CustomerApplication[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [appsError, setAppsError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [stats, setStats] = useState<Record<string, number>>({});

  // Selected Application for Details Modal
  const [selectedApp, setSelectedApp] = useState<CustomerApplication | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; error?: boolean } | null>(null);

  // Quotations State
  const [quotations, setQuotations] = useState<QuotationRecord[]>([]);
  const [isLoadingQuotations, setIsLoadingQuotations] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [isSavingQuotation, setIsSavingQuotation] = useState(false);
  const [quotationError, setQuotationError] = useState<string | null>(null);

  // Payments State
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [verifyingTxnId, setVerifyingTxnId] = useState<string | null>(null);
  const [paymentActionMessage, setPaymentActionMessage] = useState<{ text: string; error?: boolean } | null>(null);

  // Quotation Preparation Form with the 4 Explicit Charge Categories:
  // 1. Selected Package
  // 2. Development Charges
  // 3. Annual Service Charges
  // 4. Approved Additional Charges
  // 5. Total, Advance & Remaining Payment
  const [quotationForm, setQuotationForm] = useState<{
    applicationId: string;
    customerName: string;
    businessName: string;
    email: string;
    mobileNumber: string;
    businessAddress: string;
    websiteType: WebsiteType;
    currency: "INR" | "USD";
    packageName: string;
    packagePrice: number;
    developmentDescription: string;
    developmentAmount: number;
    annualServiceDescription: string;
    annualServiceAmount: number;
    additionalCharges: AdditionalChargeItem[];
    discount: number;
    taxRatePercent: number;
    advancePaymentPercentOrAmount: number;
    estimatedTimeline: string;
    paymentTerms: string;
    scopeDeliverables: string;
  }>({
    applicationId: "",
    customerName: "",
    businessName: "",
    email: "",
    mobileNumber: "",
    businessAddress: "",
    websiteType: "Static Website",
    currency: "INR",
    packageName: "Static Business Starter",
    packagePrice: 9999,
    developmentDescription: "Frontend UI/UX design, mobile responsiveness, contact workflow",
    developmentAmount: 5000,
    annualServiceDescription: "Annual cloud hosting, domain renewal, SSL security & maintenance",
    annualServiceAmount: 2500,
    additionalCharges: [],
    discount: 0,
    taxRatePercent: 18,
    advancePaymentPercentOrAmount: 50,
    estimatedTimeline: "2-3 weeks from advance payment receipt",
    paymentTerms: "50% advance mobilization deposit, 50% upon final signoff and delivery.",
    scopeDeliverables: "Custom responsive layouts\nContact inquiry intake\nSSL deployment & hosting\n30-day bug warranty",
  });

  // Projects State
  const [projects, setProjects] = useState<CustomerProjectRecord[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [copiedProjectId, setCopiedProjectId] = useState<string | null>(null);

  // Note Modal State
  const [noteModalProject, setNoteModalProject] = useState<CustomerProjectRecord | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // File Modal State
  const [fileModalProject, setFileModalProject] = useState<CustomerProjectRecord | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileCategory, setFileCategory] = useState<
    "Design Mockups" | "Preview Builds" | "Documentation" | "Source / Assets"
  >("Design Mockups");
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const [projectForm, setProjectForm] = useState<{
    applicationId: string;
    quotationId: string;
    paymentId?: string;
    projectName: string;
    clientName: string;
    clientBusiness: string;
    clientEmail: string;
    clientMobile: string;
    websiteType: string;
    expectedDeliveryDate: string;
    stagingUrl: string;
    repositoryUrl: string;
    assignedLead: string;
    initialNotes: string;
  }>({
    applicationId: "",
    quotationId: "",
    paymentId: "",
    projectName: "",
    clientName: "",
    clientBusiness: "",
    clientEmail: "",
    clientMobile: "",
    websiteType: "Dynamic Business Website",
    expectedDeliveryDate: "",
    stagingUrl: "",
    repositoryUrl: "",
    assignedLead: "ViBa Engineering Team",
    initialNotes: "",
  });

  // Domains State
  const [domains, setDomains] = useState<DomainWithExpiryMeta[]>([]);
  const [domainStats, setDomainStats] = useState<DomainStats | null>(null);
  const [isLoadingDomains, setIsLoadingDomains] = useState(false);
  const [domainSearchQuery, setDomainSearchQuery] = useState("");
  const [domainExpiryFilter, setDomainExpiryFilter] = useState<"all" | "30_days" | "60_days" | "expired" | "active">("all");
  const [domainPaymentFilter, setDomainPaymentFilter] = useState<string>("All");
  const [domainStatusFilter, setDomainStatusFilter] = useState<string>("All");

  const [showDomainModal, setShowDomainModal] = useState(false);
  const [editingDomain, setEditingDomain] = useState<DomainWithExpiryMeta | null>(null);
  const [domainForm, setDomainForm] = useState<CreateDomainDTO>({
    customerName: "",
    customerEmail: "",
    domainName: "",
    registrar: "GoDaddy",
    registrationDate: "",
    expiryDate: "",
    registrationCost: 999,
    renewalCost: 1299,
    customerPaymentStatus: "Paid",
    managementStatus: "Active",
    currency: "INR",
    autoRenewalConfigured: true,
    dnsProvider: "Cloudflare",
    notes: "",
  });
  const [isSavingDomain, setIsSavingDomain] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);

  // Domain Renewal Modal State
  const [renewalModalDomain, setRenewalModalDomain] = useState<DomainWithExpiryMeta | null>(null);
  const [renewalForm, setRenewalForm] = useState<RecordRenewalDTO>({
    newExpiryDate: "",
    renewalCost: 1299,
    customerPaymentStatus: "Paid",
    invoiceReference: "",
    notes: "",
  });
  const [isSavingRenewal, setIsSavingRenewal] = useState(false);

  // Domain History Modal State
  const [historyModalDomain, setHistoryModalDomain] = useState<DomainWithExpiryMeta | null>(null);

  // Accessible IDs for Form Controls
  const searchInputId = useId();
  const typeFilterId = useId();
  const statusFilterId = useId();
  const appStatusSelectId = useId();

  // 1. Initial Authentication Check on Mount
  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/auth/me", { cache: "no-store" })
      .then(async (res) => {
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.authenticated) {
            setIsAuthenticated(true);
            setAdminUser(data.user);
            return;
          }
        }
        if (isMounted) {
          setIsAuthenticated(false);
          setAdminUser(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsAuthenticated(false);
          setAdminUser(null);
        }
      })
      .finally(() => {
        if (isMounted) setIsCheckingAuth(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch Applications Helper
  const fetchApplications = useCallback(async () => {
    try {
      setIsLoadingApps(true);
      setAppsError(null);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (selectedType !== "All") params.set("type", selectedType);
      if (selectedStatus !== "All") params.set("status", selectedStatus);

      const res = await fetch(`/api/admin/applications?${params.toString()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401) {
          setIsAuthenticated(false);
          return;
        }
        throw new Error(`Failed to load applications (${res.status})`);
      }

      const json = await res.json();
      if (json.success) {
        setApplications(json.data || []);
        if (json.stats) setStats(json.stats);
      } else {
        throw new Error(json.error || "Failed to load applications");
      }
    } catch (err) {
      setAppsError(err instanceof Error ? err.message : "Error querying applications from database.");
    } finally {
      setIsLoadingApps(false);
    }
  }, [searchQuery, selectedType, selectedStatus]);

  // 3. Fetch Quotations Helper
  const fetchQuotations = useCallback(async () => {
    try {
      setIsLoadingQuotations(true);
      const res = await fetch("/api/quotations", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setQuotations(json.data || []);
        }
      }
    } catch {
      // Ignored
    } finally {
      setIsLoadingQuotations(false);
    }
  }, []);

  // 4. Fetch Payments Helper
  const fetchPayments = useCallback(async () => {
    try {
      setIsLoadingPayments(true);
      const res = await fetch("/api/payments", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setPayments(json.data || []);
        }
      }
    } catch {
      // Ignored
    } finally {
      setIsLoadingPayments(false);
    }
  }, []);

  // 5. Fetch Projects Helper
  const fetchProjects = useCallback(async () => {
    try {
      setIsLoadingProjects(true);
      const res = await fetch("/api/projects?type=customer", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setProjects(json.data || []);
        }
      }
    } catch {
      // Ignored
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  // 6. Fetch Domains Helper
  const fetchDomains = useCallback(async () => {
    try {
      setIsLoadingDomains(true);
      const params = new URLSearchParams();
      if (domainSearchQuery.trim()) params.set("search", domainSearchQuery.trim());
      if (domainExpiryFilter !== "all") params.set("expiryFilter", domainExpiryFilter);
      if (domainPaymentFilter !== "All") params.set("paymentStatus", domainPaymentFilter);
      if (domainStatusFilter !== "All") params.set("status", domainStatusFilter);

      const res = await fetch(`/api/domains?${params.toString()}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setDomains(json.data || []);
          if (json.stats) setDomainStats(json.stats);
        }
      }
    } catch {
      // Ignored
    } finally {
      setIsLoadingDomains(false);
    }
  }, [domainSearchQuery, domainExpiryFilter, domainPaymentFilter, domainStatusFilter]);

  // 7. Synchronize Tab Data
  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;

    if (activeTab === "applications") {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (selectedType !== "All") params.set("type", selectedType);
      if (selectedStatus !== "All") params.set("status", selectedStatus);

      fetch(`/api/admin/applications?${params.toString()}`, { cache: "no-store" })
        .then(async (res) => {
          if (!isMounted) return;
          if (res.status === 401) {
            setIsAuthenticated(false);
            return;
          }
          const json = await res.json();
          if (isMounted && json.success) {
            setApplications(json.data || []);
            if (json.stats) setStats(json.stats);
          }
        })
        .catch((err) => {
          if (isMounted) setAppsError(err instanceof Error ? err.message : "Error querying applications.");
        })
        .finally(() => {
          if (isMounted) setIsLoadingApps(false);
        });
    } else if (activeTab === "quotations") {
      fetch("/api/quotations", { cache: "no-store" })
        .then(async (res) => {
          if (!isMounted) return;
          const json = await res.json();
          if (isMounted && json.success) {
            setQuotations(json.data || []);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setIsLoadingQuotations(false);
        });
    } else if (activeTab === "payments") {
      fetch("/api/payments", { cache: "no-store" })
        .then(async (res) => {
          if (!isMounted) return;
          const json = await res.json();
          if (isMounted && json.success) {
            setPayments(json.data || []);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setIsLoadingPayments(false);
        });
    } else if (activeTab === "projects") {
      fetch("/api/projects?type=customer", { cache: "no-store" })
        .then(async (res) => {
          if (!isMounted) return;
          const json = await res.json();
          if (isMounted && json.success) {
            setProjects(json.data || []);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setIsLoadingProjects(false);
        });
    } else if (activeTab === "domains") {
      const params = new URLSearchParams();
      if (domainSearchQuery.trim()) params.set("search", domainSearchQuery.trim());
      if (domainExpiryFilter !== "all") params.set("expiryFilter", domainExpiryFilter);
      if (domainPaymentFilter !== "All") params.set("paymentStatus", domainPaymentFilter);
      if (domainStatusFilter !== "All") params.set("status", domainStatusFilter);

      fetch(`/api/domains?${params.toString()}`, { cache: "no-store" })
        .then(async (res) => {
          if (!isMounted) return;
          const json = await res.json();
          if (isMounted && json.success) {
            setDomains(json.data || []);
            if (json.stats) setDomainStats(json.stats);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setIsLoadingDomains(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [
    isAuthenticated,
    activeTab,
    searchQuery,
    selectedType,
    selectedStatus,
    domainSearchQuery,
    domainExpiryFilter,
    domainPaymentFilter,
    domainStatusFilter,
  ]);

  // Handle Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Authentication failed. Check your admin credentials.");
      }

      setIsAuthenticated(true);
      setAdminUser(json.user);
      setLoginPassword("");
      fetchApplications();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Admin Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      setIsAuthenticated(false);
      setAdminUser(null);
      setSelectedApp(null);
    }
  };

  // Change Application Status
  const handleUpdateStatus = async (appId: string, newStatus: ApplicationStatus) => {
    try {
      setIsUpdatingStatus(true);
      setStatusMessage(null);

      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update status in database.");
      }

      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }

      setStatusMessage({ text: `Status updated to "${newStatus}".` });
      setTimeout(() => setStatusMessage(null), 3000);
      fetchApplications();
    } catch (err) {
      setStatusMessage({
        text: err instanceof Error ? err.message : "Database error updating status.",
        error: true,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Open Quotation Builder for Application
  const openQuotationBuilder = (app: CustomerApplication) => {
    const isEcom = app.websiteType === "E-commerce Website";
    const isDyn = app.websiteType === "Dynamic Business Website";

    const defaultPackagePrice = isEcom ? 24999 : isDyn ? 14999 : 9999;
    const defaultDevPrice = isEcom ? 12000 : isDyn ? 8000 : 5000;
    const defaultAnnualPrice = isEcom ? 4500 : isDyn ? 3000 : 2500;

    setQuotationForm({
      applicationId: app.id,
      customerName: app.customerName,
      businessName: app.businessName,
      email: app.email,
      mobileNumber: app.mobileNumber,
      businessAddress: app.businessAddress,
      websiteType: app.websiteType,
      currency: "INR",
      packageName: `${app.selectedPackage || app.websiteType + " Package"}`,
      packagePrice: defaultPackagePrice,
      developmentDescription: `Frontend & backend engineering for ${app.websiteType} with responsive UI`,
      developmentAmount: defaultDevPrice,
      annualServiceDescription: "Cloud hosting, SSL certificates, database backups & maintenance",
      annualServiceAmount: defaultAnnualPrice,
      additionalCharges: [],
      discount: 0,
      taxRatePercent: 18,
      advancePaymentPercentOrAmount: 50,
      estimatedTimeline: isEcom ? "3-4 weeks" : "2-3 weeks",
      paymentTerms: "50% advance mobilization deposit, balance upon final client signoff.",
      scopeDeliverables: `Pages: ${app.requiredPages}\nFeatures: ${app.requiredFunctionality}\nDomain: ${app.domainRequirement}`,
    });
    setQuotationError(null);
    setShowQuotationModal(true);
  };

  // Live Calculation for Quotation Builder
  const subtotalCalc =
    (Number(quotationForm.packagePrice) || 0) +
    (Number(quotationForm.developmentAmount) || 0) +
    (Number(quotationForm.annualServiceAmount) || 0) +
    quotationForm.additionalCharges.reduce((s, it) => s + (Number(it.amount) || 0), 0);
  const discountCalc = Number(quotationForm.discount) || 0;
  const discountedSubtotal = Math.max(0, subtotalCalc - discountCalc);
  const taxCalc = Math.round((discountedSubtotal * (Number(quotationForm.taxRatePercent) || 0)) / 100);
  const totalCalc = discountedSubtotal + taxCalc;
  const advanceCalc =
    quotationForm.advancePaymentPercentOrAmount <= 100
      ? Math.round((totalCalc * quotationForm.advancePaymentPercentOrAmount) / 100)
      : Math.min(totalCalc, Math.round(quotationForm.advancePaymentPercentOrAmount));
  const remainingCalc = Math.max(0, totalCalc - advanceCalc);

  // Save Quotation to Database
  const handleSaveQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingQuotation(true);
    setQuotationError(null);

    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: quotationForm.applicationId,
          customerName: quotationForm.customerName,
          businessName: quotationForm.businessName,
          email: quotationForm.email,
          mobileNumber: quotationForm.mobileNumber,
          businessAddress: quotationForm.businessAddress,
          websiteType: quotationForm.websiteType,
          currency: quotationForm.currency,
          selectedPackage: {
            name: quotationForm.packageName,
            price: Number(quotationForm.packagePrice),
          },
          developmentCharges: {
            description: quotationForm.developmentDescription,
            amount: Number(quotationForm.developmentAmount),
          },
          annualServiceCharges: {
            description: quotationForm.annualServiceDescription,
            amount: Number(quotationForm.annualServiceAmount),
            billingCycle: "Annually",
          },
          additionalCharges: quotationForm.additionalCharges,
          discount: quotationForm.discount,
          taxRatePercent: quotationForm.taxRatePercent,
          advancePaymentPercentOrAmount: quotationForm.advancePaymentPercentOrAmount,
          estimatedTimeline: quotationForm.estimatedTimeline,
          paymentTerms: quotationForm.paymentTerms,
          scopeDeliverables: quotationForm.scopeDeliverables.split("\n").filter(Boolean),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save quotation to database.");
      }

      setShowQuotationModal(false);
      fetchQuotations();
      fetchPayments();
      fetchApplications();
      setActiveTab("quotations");
    } catch (err) {
      setQuotationError(err instanceof Error ? err.message : "Error saving quotation.");
    } finally {
      setIsSavingQuotation(false);
    }
  };

  // Admin Verifies Customer Payment Transaction
  const handleVerifyTransaction = async (
    quotationId: string,
    transactionId: string,
    action: "approve" | "reject"
  ) => {
    try {
      setVerifyingTxnId(transactionId);
      setPaymentActionMessage(null);

      const res = await fetch(`/api/payments/${quotationId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId,
          action,
          verificationNotes:
            action === "approve"
              ? "Reconciled against official bank account settlement."
              : "UTR verification failed: amount not received in statement.",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to verify transaction.");
      }

      setPaymentActionMessage({
        text: `Transaction ${transactionId} ${action === "approve" ? "verified & credited" : "declined"}.`,
      });
      fetchPayments();
      if (selectedPayment && selectedPayment.quotationId === quotationId) {
        setSelectedPayment(json.data);
      }
    } catch (err) {
      setPaymentActionMessage({
        text: err instanceof Error ? err.message : "Error verifying payment.",
        error: true,
      });
    } finally {
      setVerifyingTxnId(null);
    }
  };

  // Admin Direct Payment Status Update
  const handleDirectPaymentStatusUpdate = async (quotationId: string, newStatus: PaymentStatus) => {
    try {
      setPaymentActionMessage(null);
      const res = await fetch(`/api/payments/${quotationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          notes: `Manually updated by admin ${adminUser?.email}`,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update payment status.");
      }

      setPaymentActionMessage({ text: `Payment status updated to "${newStatus}".` });
      fetchPayments();
      if (selectedPayment && selectedPayment.quotationId === quotationId) {
        setSelectedPayment(json.data);
      }
    } catch (err) {
      setPaymentActionMessage({
        text: err instanceof Error ? err.message : "Error updating payment status.",
        error: true,
      });
    }
  };

  // Open Project Creator
  const openProjectCreator = (
    app?: CustomerApplication,
    quote?: QuotationRecord,
    payment?: PaymentRecord
  ) => {
    const clientName = app?.customerName || quote?.customerName || payment?.customerName || "";
    const clientBusiness = app?.businessName || quote?.businessName || payment?.businessName || "";
    const clientEmail = app?.email || quote?.email || payment?.customerEmail || "";
    const clientMobile = app?.mobileNumber || quote?.mobileNumber || "";
    const websiteType = app?.websiteType || quote?.websiteType || "Dynamic Business Website";
    const defaultName = clientBusiness ? `${clientBusiness} Website Platform` : `${clientName}'s Website`;
    const targetDate = computeDefaultLaunchDate();

    setProjectForm({
      applicationId: app?.id || quote?.applicationId || "",
      quotationId: quote?.id || payment?.quotationId || "",
      paymentId: payment?.id || "",
      projectName: defaultName,
      clientName,
      clientBusiness,
      clientEmail,
      clientMobile,
      websiteType,
      expectedDeliveryDate: targetDate,
      stagingUrl: "",
      repositoryUrl: "",
      assignedLead: "ViBa Engineering Team",
      initialNotes: app?.businessDescription
        ? `Customer requirements: ${app.businessDescription.substring(0, 200)}...`
        : "Project initialized after quotation approval and advance payment confirmation.",
    });
    setProjectError(null);
    setShowProjectModal(true);
  };

  // Save Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProject(true);
    setProjectError(null);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectForm),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to create project in database.");
      }

      setShowProjectModal(false);
      fetchProjects();
      fetchApplications();
      setActiveTab("projects");
    } catch (err) {
      setProjectError(err instanceof Error ? err.message : "Error saving project.");
    } finally {
      setIsSavingProject(false);
    }
  };

  // Update Project Stage (The 6 Stages)
  const handleUpdateProjectStage = async (projectId: string, newStage: ProjectStage) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setProjects((prev) =>
            prev.map((p) => (p.id === projectId ? json.data : p))
          );
        }
      }
    } catch (err) {
      console.error("Failed to update project stage:", err);
    }
  };

  // Update Expected Delivery Date
  const handleUpdateExpectedDate = async (projectId: string, expectedDeliveryDate: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: { expectedDeliveryDate } }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setProjects((prev) =>
            prev.map((p) => (p.id === projectId ? json.data : p))
          );
        }
      }
    } catch (err) {
      console.error("Failed to update expected delivery date:", err);
    }
  };

  // Add Progress Note
  const handleAddProgressNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteModalProject || !noteTitle.trim() || !noteContent.trim()) return;

    setIsSubmittingNote(true);
    try {
      const res = await fetch(`/api/projects/${noteModalProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          progressNote: {
            title: noteTitle.trim(),
            content: noteContent.trim(),
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setProjects((prev) =>
            prev.map((p) => (p.id === noteModalProject.id ? json.data : p))
          );
          setNoteModalProject(null);
          setNoteTitle("");
          setNoteContent("");
        }
      }
    } catch (err) {
      console.error("Failed to add progress note:", err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  // Add Shared Project File
  const handleAddProjectFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileModalProject || !fileName.trim() || !fileUrl.trim()) return;

    setIsUploadingFile(true);
    try {
      const res = await fetch(`/api/projects/${fileModalProject.id}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fileName.trim(),
          url: fileUrl.trim(),
          category: fileCategory,
          size: 1024 * 1024 * 2,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setProjects((prev) =>
            prev.map((p) => (p.id === fileModalProject.id ? json.data : p))
          );
          setFileModalProject(null);
          setFileName("");
          setFileUrl("");
        }
      }
    } catch (err) {
      console.error("Failed to add project file:", err);
    } finally {
      setIsUploadingFile(false);
    }
  };

  // Copy Tracking Portal Link with Token
  const copyTrackingLink = (projectId: string, token: string) => {
    const url = `${window.location.origin}/projects/${projectId}?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedProjectId(projectId);
    setTimeout(() => setCopiedProjectId(null), 2500);
  };

  // Open Create Domain Modal
  const openCreateDomainModal = (preset?: { customerName?: string; customerEmail?: string; domainName?: string }) => {
    const today = new Date().toISOString().split("T")[0];
    const expiry = computeDefaultLaunchDate();
    setEditingDomain(null);
    setDomainForm({
      customerName: preset?.customerName || "",
      customerEmail: preset?.customerEmail || "",
      domainName: preset?.domainName || "",
      registrar: "GoDaddy",
      registrationDate: today,
      expiryDate: expiry,
      registrationCost: 999,
      renewalCost: 1299,
      customerPaymentStatus: "Paid",
      managementStatus: "Active",
      currency: "INR",
      autoRenewalConfigured: true,
      dnsProvider: "Cloudflare",
      notes: "",
    });
    setDomainError(null);
    setShowDomainModal(true);
  };

  // Open Edit Domain Modal
  const openEditDomainModal = (domain: DomainWithExpiryMeta) => {
    setEditingDomain(domain);
    setDomainForm({
      customerName: domain.customerName,
      customerEmail: domain.customerEmail || "",
      customerId: domain.customerId || "",
      applicationId: domain.applicationId || "",
      domainName: domain.domainName,
      registrar: domain.registrar,
      registrationDate: domain.registrationDate,
      expiryDate: domain.expiryDate,
      registrationCost: domain.registrationCost,
      renewalCost: domain.renewalCost,
      customerPaymentStatus: domain.customerPaymentStatus,
      managementStatus: domain.managementStatus,
      currency: domain.currency,
      autoRenewalConfigured: Boolean(domain.autoRenewalConfigured),
      dnsProvider: domain.dnsProvider || domain.registrar,
      notes: domain.notes || "",
    });
    setDomainError(null);
    setShowDomainModal(true);
  };

  // Save Domain (Create or Update)
  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingDomain(true);
    setDomainError(null);

    try {
      const url = editingDomain ? `/api/domains/${editingDomain.id}` : "/api/domains";
      const method = editingDomain ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(domainForm),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save domain record.");
      }

      setShowDomainModal(false);
      fetchDomains();
    } catch (err) {
      setDomainError(err instanceof Error ? err.message : "Error saving domain record.");
    } finally {
      setIsSavingDomain(false);
    }
  };

  // Open Record Renewal Modal
  const openRenewalModal = (domain: DomainWithExpiryMeta) => {
    // Add 1 year to current expiry
    const curr = new Date(domain.expiryDate);
    curr.setFullYear(curr.getFullYear() + 1);
    const nextYearDate = curr.toISOString().split("T")[0];

    setRenewalModalDomain(domain);
    setRenewalForm({
      newExpiryDate: nextYearDate,
      renewalCost: domain.renewalCost || 1299,
      customerPaymentStatus: "Paid",
      invoiceReference: "",
      notes: `Manual renewal logged by admin at ${domain.registrar}`,
    });
  };

  // Save Renewal
  const handleSaveRenewal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renewalModalDomain) return;

    setIsSavingRenewal(true);
    try {
      const res = await fetch(`/api/domains/${renewalModalDomain.id}/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(renewalForm),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to record renewal.");
      }

      setRenewalModalDomain(null);
      fetchDomains();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to record domain renewal.");
    } finally {
      setIsSavingRenewal(false);
    }
  };

  // Delete Domain
  const handleDeleteDomain = async (domain: DomainWithExpiryMeta) => {
    if (!confirm(`Are you sure you want to remove ${domain.domainName} from ViBa management?`)) return;

    try {
      const res = await fetch(`/api/domains/${domain.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete domain record.");
      }
      fetchDomains();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting domain record.");
    }
  };

  // ==========================================
  // RENDER: Loading Authentication
  // ==========================================
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-6">
        <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-mono text-sm tracking-wide">
          Verifying ViBa Admin Authentication...
        </p>
      </div>
    );
  }

  // ==========================================
  // RENDER: Admin Login Screen
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/10 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl mb-4">
              <VbMonogram className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">ViBa Admin Portal</h1>
            <p className="text-slate-400 text-sm mt-1">
              Management console for quotations, payments & customer projects
            </p>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@vibawebdev.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-sm transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 text-sm transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-2 py-3 px-4 rounded-xl font-medium text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Authenticate as Administrator</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span>Secure Session Guard</span>
              <Link href="/" className="text-cyan-400 hover:underline">
                Return to Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: Authenticated Dashboard
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <VbMonogram className="w-8 h-8 transition-transform group-hover:scale-105" />
              <div className="flex flex-col">
                <span className="font-bold text-white text-sm tracking-tight">ViBa WebDevloper</span>
                <span className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase font-semibold">
                  Admin Command Console
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Tabs (Applications, Quotations, Payments, Projects) */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab("applications")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                activeTab === "applications"
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Applications</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {stats.total ?? applications.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("quotations")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                activeTab === "quotations"
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Quotations</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {quotations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("payments")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                activeTab === "payments"
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payments</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {payments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                activeTab === "projects"
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Projects</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("domains")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                activeTab === "domains"
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Domains</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {domains.length}
              </span>
              {domainStats && domainStats.expiringSoon > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  {domainStats.expiringSoon} urgent
                </span>
              )}
            </button>
          </nav>

          {/* User profile & Logout */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-xs font-mono text-slate-400">
              {adminUser?.email}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ========================================================= */}
        {/* TAB 1: APPLICATIONS                                       */}
        {/* ========================================================= */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            {/* Status Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
                <p className="text-slate-400 text-xs font-medium">Total Applications</p>
                <p className="text-xl font-bold text-white mt-1">{stats.total ?? applications.length}</p>
              </div>
              <div className="bg-slate-900 border border-cyan-500/20 p-3.5 rounded-xl">
                <p className="text-cyan-400 text-xs font-medium">New</p>
                <p className="text-xl font-bold text-cyan-300 mt-1">{stats.newApplications ?? 0}</p>
              </div>
              <div className="bg-slate-900 border border-amber-500/20 p-3.5 rounded-xl">
                <p className="text-amber-400 text-xs font-medium">Under Review</p>
                <p className="text-xl font-bold text-amber-300 mt-1">{stats.underReview ?? 0}</p>
              </div>
              <div className="bg-slate-900 border border-blue-500/20 p-3.5 rounded-xl">
                <p className="text-blue-400 text-xs font-medium">Quotation Ready</p>
                <p className="text-xl font-bold text-blue-300 mt-1">{stats.quotationPrepared ?? 0}</p>
              </div>
              <div className="bg-slate-900 border border-emerald-500/20 p-3.5 rounded-xl">
                <p className="text-emerald-400 text-xs font-medium">Project Started</p>
                <p className="text-xl font-bold text-emerald-300 mt-1">{stats.projectStarted ?? 0}</p>
              </div>
              <div className="bg-slate-900 border border-teal-500/20 p-3.5 rounded-xl">
                <p className="text-teal-400 text-xs font-medium">Completed</p>
                <p className="text-xl font-bold text-teal-300 mt-1">{stats.completed ?? 0}</p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <label htmlFor={searchInputId} className="sr-only">Search applications</label>
                <input
                  id={searchInputId}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by customer name, business, email, phone, or ID..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <label htmlFor={typeFilterId} className="sr-only">Filter by website type</label>
                  <select
                    id={typeFilterId}
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer py-1"
                  >
                    <option value="All" className="bg-slate-900 text-slate-200">
                      All Website Types
                    </option>
                    {WEBSITE_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-slate-900 text-slate-200">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  <label htmlFor={statusFilterId} className="sr-only">Filter by status</label>
                  <select
                    id={statusFilterId}
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer py-1"
                  >
                    <option value="All" className="bg-slate-900 text-slate-200">
                      All Statuses
                    </option>
                    {ALL_APPLICATION_STATUSES.map((st) => (
                      <option key={st} value={st} className="bg-slate-900 text-slate-200">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={fetchApplications}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition"
                  title="Refresh Database Records"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingApps ? "animate-spin text-cyan-400" : ""}`} />
                </button>
              </div>
            </div>

            {/* Applications Table */}
            {appsError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{appsError}</span>
              </div>
            )}

            {isLoadingApps ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Querying Firestore records...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-200">No applications found</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
                  {searchQuery || selectedType !== "All" || selectedStatus !== "All"
                    ? "No records matched your search or filter criteria."
                    : "No customer applications have been submitted through the portal yet. Live customer submissions will appear here automatically."}
                </p>
              </div>
            ) : (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Application ID</th>
                        <th className="py-3.5 px-4">Customer & Business</th>
                        <th className="py-3.5 px-4">Website Type</th>
                        <th className="py-3.5 px-4">Package</th>
                        <th className="py-3.5 px-4">Files</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3.5 px-4 font-mono text-xs text-cyan-400">
                            {app.id}
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : ""}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-100">{app.customerName}</div>
                            <div className="text-xs text-slate-400">{app.businessName}</div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5">{app.email}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700">
                              {app.websiteType}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-300">{app.selectedPackage}</td>
                          <td className="py-3.5 px-4">
                            {app.files && app.files.length > 0 ? (
                              <span className="inline-flex items-center gap-1 text-xs text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                                <Paperclip className="w-3 h-3" />
                                {app.files.length}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-600">None</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyle(
                                app.status
                              )}`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-medium border border-cyan-500/30 transition"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: QUOTATIONS                                         */}
        {/* ========================================================= */}
        {activeTab === "quotations" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white">Customer Quotations</h2>
                <p className="text-xs text-slate-400">
                  Itemized pricing: Selected Package, Development Charges, Annual Service & Add-ons
                </p>
              </div>
              <button
                onClick={() => {
                  if (applications.length > 0) {
                    openQuotationBuilder(applications[0]);
                  } else {
                    setQuotationError("Please submit or select a customer application first.");
                    setShowQuotationModal(true);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-xs font-semibold hover:from-cyan-300 hover:to-sky-300 transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 w-fit"
              >
                <Plus className="w-4 h-4" />
                <span>Prepare Customer Quotation</span>
              </button>
            </div>

            {isLoadingQuotations ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Loading quotations...</p>
              </div>
            ) : quotations.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <DollarSign className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-200">No quotations prepared yet</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
                  You can prepare custom quotations directly from any customer application with package, dev, and annual service breakdowns.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quotations.map((quote) => {
                  const curr = quote.currency === "INR" ? "₹" : "$";
                  return (
                    <div
                      key={quote.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-xs text-cyan-400 font-semibold">{quote.id}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border ${
                              quote.status === "Approved"
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : quote.status === "Sent to Customer"
                                ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                                : "bg-slate-800 text-slate-300 border-slate-700"
                            }`}
                          >
                            {quote.status}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white">{quote.businessName || quote.customerName}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{quote.customerName} • {quote.email}</p>

                        <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Selected Package:</span>
                            <span className="font-medium text-slate-200">{quote.selectedPackage?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Dev Charges:</span>
                            <span className="font-mono text-slate-300">
                              {curr}{quote.developmentCharges?.amount?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Annual Service:</span>
                            <span className="font-mono text-slate-300">
                              {curr}{quote.annualServiceCharges?.amount?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between font-semibold text-teal-300 pt-1 border-t border-slate-800">
                            <span>Advance Required:</span>
                            <span className="font-mono">
                              {curr}{quote.breakdown?.advancePayment?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm font-bold text-white pt-1">
                            <span>Total Amount:</span>
                            <span className="text-cyan-400 font-mono">
                              {curr}{quote.breakdown?.totalAmount?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        {/* Direct link to customer portal & print PDF */}
                        <Link
                          href={`/quotations/${quote.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-medium border border-cyan-500/30 transition flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Customer Portal & PDF</span>
                        </Link>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              openProjectCreator(undefined, quote);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition flex items-center gap-1"
                            title="Start or track customer project"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Track Project</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab("payments");
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                          >
                            View Payment
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PAYMENTS & VERIFICATION                            */}
        {/* ========================================================= */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white">Payment & Bank Reconciliation</h2>
                <p className="text-xs text-slate-400">
                  Verify customer UTR reference numbers, credit advance deposits, and manage billing state
                </p>
              </div>
              <button
                onClick={fetchPayments}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition w-fit"
                title="Refresh Payments"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingPayments ? "animate-spin text-cyan-400" : ""}`} />
              </button>
            </div>

            {paymentActionMessage && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  paymentActionMessage.error
                    ? "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                    : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                }`}
              >
                {paymentActionMessage.error ? (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                )}
                <span>{paymentActionMessage.text}</span>
              </div>
            )}

            {/* Payments Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
                <p className="text-slate-400 text-xs">Total Tracked Billings</p>
                <p className="text-xl font-bold text-white mt-1">
                  ₹{payments.reduce((s, p) => s + (p.totalAmount || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-900 border border-teal-500/20 p-3.5 rounded-xl">
                <p className="text-teal-400 text-xs">Advance Required</p>
                <p className="text-xl font-bold text-teal-300 mt-1">
                  ₹{payments.reduce((s, p) => s + (p.advanceRequired || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-900 border border-emerald-500/20 p-3.5 rounded-xl">
                <p className="text-emerald-400 text-xs">Verified Collected</p>
                <p className="text-xl font-bold text-emerald-300 mt-1">
                  ₹{payments.reduce((s, p) => s + (p.amountPaid || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-900 border border-amber-500/20 p-3.5 rounded-xl">
                <p className="text-amber-400 text-xs">Pending Verification</p>
                <p className="text-xl font-bold text-amber-300 mt-1">
                  {payments.filter((p) => p.status.includes("Pending")).length} Records
                </p>
              </div>
            </div>

            {/* Payment Records Table */}
            {isLoadingPayments ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Loading payments from database...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-200">No payment records found</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
                  Payment records are automatically initialized whenever a customer quotation is prepared.
                </p>
              </div>
            ) : (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Payment ID & Quote</th>
                        <th className="py-3.5 px-4">Client</th>
                        <th className="py-3.5 px-4">Total Amount</th>
                        <th className="py-3.5 px-4">Advance</th>
                        <th className="py-3.5 px-4">Amount Paid</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {payments.map((pay) => {
                        const curr = pay.currency === "INR" ? "₹" : "$";
                        return (
                          <tr key={pay.id} className="hover:bg-slate-800/40 transition">
                            <td className="py-3.5 px-4 font-mono text-xs text-cyan-400">
                              {pay.id}
                              <div className="text-[10px] text-slate-500">
                                Quote: {pay.quotationId}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-slate-100">{pay.businessName || pay.customerName}</div>
                              <div className="text-xs text-slate-400">{pay.customerEmail}</div>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-medium text-white">
                              {curr}{pay.totalAmount.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-teal-300">
                              {curr}{pay.advanceRequired.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">
                              {curr}{pay.amountPaid.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${getPaymentBadgeStyle(
                                  pay.status
                                )}`}
                              >
                                {pay.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {(pay.status === "Advance Paid" || pay.status === "Fully Paid") && (
                                  <button
                                    onClick={() => openProjectCreator(undefined, undefined, pay)}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition flex items-center gap-1"
                                    title="Start Customer Project tracking"
                                  >
                                    <Layers className="w-3.5 h-3.5" />
                                    <span>Track Project</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => setSelectedPayment(pay)}
                                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-medium border border-cyan-500/30 transition"
                                >
                                  Manage Payment
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PROJECTS                                           */}
        {/* ========================================================= */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Client Development Projects</h2>
                <p className="text-xs text-slate-400">
                  Track ongoing customer web development milestones, staging URLs, and delivery
                </p>
              </div>
              <button
                onClick={() => {
                  if (applications.length > 0) {
                    openProjectCreator(applications[0]);
                  } else {
                    setProjectError("Please submit or select a customer application first.");
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-xs font-semibold hover:from-cyan-300 hover:to-sky-300 transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Start New Project</span>
              </button>
            </div>

            {isLoadingProjects ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Loading customer projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-200">No active client projects yet</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
                  Convert an approved application into an active project to track milestones and delivery.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition space-y-4 shadow-xl"
                  >
                    {/* Header: Title, Client, Badges */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-xs text-cyan-400 font-semibold">{proj.id}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {proj.websiteType}
                          </span>
                          {proj.isDeliveryApproved ? (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Delivery Approved
                            </span>
                          ) : (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              Active Track
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-white">{proj.projectName}</h3>
                        <p className="text-xs text-slate-400">
                          {proj.clientBusiness} • {proj.clientName} ({proj.clientEmail})
                        </p>
                      </div>

                      {/* Stage Selector (The 6 Stages) */}
                      <div className="flex flex-col items-end gap-1">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          Current Stage
                        </label>
                        <select
                          value={proj.currentStage}
                          onChange={(e) =>
                            handleUpdateProjectStage(proj.id, e.target.value as ProjectStage)
                          }
                          className="bg-slate-950 border border-cyan-500/40 rounded-xl px-3 py-1.5 text-xs font-semibold text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer shadow"
                        >
                          {PROJECT_STAGES_LIST.map((stage) => (
                            <option key={stage} value={stage} className="bg-slate-900 text-slate-200">
                              {stage}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Progress Bar with 6 Stages */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                        <span className="font-medium text-slate-300">Stage Progress</span>
                        <span className="font-mono text-cyan-400 font-semibold">{proj.stageProgressPercent}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${proj.stageProgressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Target Delivery Date & Lead Engineer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-1">
                          Expected Delivery Date
                        </span>
                        <input
                          type="date"
                          defaultValue={proj.expectedDeliveryDate || ""}
                          onBlur={(e) => {
                            if (e.target.value && e.target.value !== proj.expectedDeliveryDate) {
                              handleUpdateExpectedDate(proj.id, e.target.value);
                            }
                          }}
                          className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-1">
                          Assigned Lead
                        </span>
                        <span className="text-slate-200 font-mono text-xs">{proj.assignedLead || "ViBa Engineering Lead"}</span>
                      </div>
                    </div>

                    {/* Client Tracking Link & Share Portal */}
                    <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-cyan-300 min-w-0">
                        <Share2 className="w-4 h-4 shrink-0 text-cyan-400" />
                        <span className="truncate font-mono text-[11px] text-cyan-200">
                          /projects/{proj.id}?token={proj.accessToken?.substring(0, 8)}...
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => copyTrackingLink(proj.id, proj.accessToken)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1"
                        >
                          {copiedProjectId === proj.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                        <Link
                          href={`/projects/${proj.id}?token=${proj.accessToken}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1 shadow-md shadow-cyan-500/20"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Customer Portal</span>
                        </Link>
                      </div>
                    </div>

                    {/* Collapsible Details: Progress Notes, Files, Feedback */}
                    <div className="space-y-3 pt-2 border-t border-slate-800/80 text-xs">
                      {/* Notes Summary & Add Button */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Progress Notes ({proj.progressNotes?.length || 0})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setNoteModalProject(proj);
                            setNoteTitle("");
                            setNoteContent("");
                          }}
                          className="px-2 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[11px] font-semibold border border-cyan-500/30 transition flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Note</span>
                        </button>
                      </div>

                      {/* Display Latest Note */}
                      {proj.progressNotes && proj.progressNotes.length > 0 && (
                        <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1">
                          <div className="flex items-center justify-between text-slate-400">
                            <span className="font-semibold text-cyan-300">
                              {proj.progressNotes[proj.progressNotes.length - 1].stage}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(proj.progressNotes[proj.progressNotes.length - 1].createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="font-medium text-slate-200">
                            {proj.progressNotes[proj.progressNotes.length - 1].title}
                          </p>
                          <p className="text-slate-400 italic">
                            &ldquo;{proj.progressNotes[proj.progressNotes.length - 1].content}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Files Summary & Upload Button */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                          <Paperclip className="w-3.5 h-3.5 text-teal-400" />
                          <span>Shared Files ({proj.sharedFiles?.length || 0})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFileModalProject(proj);
                            setFileName("");
                            setFileUrl("");
                          }}
                          className="px-2 py-0.5 rounded bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-[11px] font-semibold border border-teal-500/30 transition flex items-center gap-1"
                        >
                          <UploadCloud className="w-3 h-3" />
                          <span>Share File</span>
                        </button>
                      </div>

                      {/* Display Shared Files */}
                      {proj.sharedFiles && proj.sharedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {proj.sharedFiles.map((file) => (
                            <a
                              key={file.id}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 flex items-center gap-1.5 hover:text-cyan-400 transition"
                            >
                              <Paperclip className="w-3 h-3 text-slate-500" />
                              <span className="max-w-[140px] truncate">{file.name}</span>
                              <span className="text-[9px] text-slate-500 font-mono">({file.category})</span>
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Customer Feedback section if present */}
                      {proj.customerFeedback && proj.customerFeedback.length > 0 && (
                        <div className="pt-2 border-t border-slate-800/60">
                          <div className="flex items-center gap-1.5 font-semibold text-amber-300 mb-1.5">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Customer Feedback ({proj.customerFeedback.length})</span>
                          </div>
                          <div className="space-y-1.5">
                            {proj.customerFeedback.slice(-2).map((fb) => (
                              <div
                                key={fb.id}
                                className="p-2 bg-amber-500/5 border border-amber-500/20 rounded-lg text-[11px]"
                              >
                                <div className="flex justify-between text-[10px] text-amber-400/80 mb-0.5">
                                  <span>{fb.customerName} ({fb.stage})</span>
                                  <span>{new Date(fb.submittedAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-200">&ldquo;{fb.message}&rdquo;</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: DOMAIN MANAGEMENT MODULE                           */}
        {/* ========================================================= */}
        {activeTab === "domains" && (
          <div className="space-y-6">
            {/* Top Bar: Title & Primary Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <span>Domain Portfolio Management</span>
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Track client domains, registrar accounts, renewal deadlines &amp; payment settlement statuses
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchDomains}
                  disabled={isLoadingDomains}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition flex items-center gap-1.5"
                  title="Refresh domains"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDomains ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={() => openCreateDomainModal()}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-xs font-semibold hover:from-cyan-300 hover:to-sky-300 transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Customer Domain</span>
                </button>
              </div>
            </div>

            {/* Live Domain Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Total Managed
                </span>
                <span className="text-2xl font-bold text-slate-100 mt-1 block">
                  {domainStats?.totalDomains ?? domains.length}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Client domain names</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Expiring Soon
                </span>
                <span className="text-2xl font-bold text-amber-300 mt-1 block">
                  {domainStats?.expiringSoon ?? 0}
                </span>
                <span className="text-[10px] text-amber-400/80 mt-0.5 block">Within next 30 days</span>
              </div>

              <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Expired
                </span>
                <span className="text-2xl font-bold text-rose-300 mt-1 block">
                  {domainStats?.expired ?? 0}
                </span>
                <span className="text-[10px] text-rose-400/80 mt-0.5 block">Requires urgent recovery</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                  Active &amp; Healthy
                </span>
                <span className="text-2xl font-bold text-emerald-300 mt-1 block">
                  {domainStats?.activeDomains ?? 0}
                </span>
                <span className="text-[10px] text-emerald-400/80 mt-0.5 block">SSL &amp; DNS connected</span>
              </div>

              <div className="col-span-2 lg:col-span-1 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">
                  Annual Renewal Cost
                </span>
                <span className="text-2xl font-bold text-cyan-300 mt-1 block">
                  ₹{(domainStats?.totalAnnualRenewalCost ?? 0).toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-cyan-400/80 mt-0.5 block">Projected registrar cost</span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Search query */}
                <div className="md:col-span-2 relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by domain, customer name, registrar, or notes..."
                    value={domainSearchQuery}
                    onChange={(e) => setDomainSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  {domainSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setDomainSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Expiry filter */}
                <div>
                  <select
                    value={domainExpiryFilter}
                    onChange={(e) =>
                      setDomainExpiryFilter(e.target.value as "all" | "30_days" | "60_days" | "expired" | "active")
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="all">All Expiry Deadlines</option>
                    <option value="30_days">Expiring ≤ 30 Days (Urgent)</option>
                    <option value="60_days">Expiring ≤ 60 Days</option>
                    <option value="expired">Expired Domains</option>
                    <option value="active">Active &gt; 60 Days</option>
                  </select>
                </div>

                {/* Customer payment filter */}
                <div>
                  <select
                    value={domainPaymentFilter}
                    onChange={(e) => setDomainPaymentFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="All">All Payment Statuses</option>
                    <option value="Paid">Customer Paid</option>
                    <option value="Pending">Payment Pending</option>
                    <option value="Overdue">Payment Overdue</option>
                    <option value="Invoiced">Invoiced</option>
                    <option value="Waived">Waived / Complementary</option>
                  </select>
                </div>

                {/* Management status filter */}
                <div>
                  <select
                    value={domainStatusFilter}
                    onChange={(e) => setDomainStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="All">All Domain Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                    <option value="Pending Transfer">Pending Transfer</option>
                    <option value="Transferred Out">Transferred Out</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Domain Listing / Cards */}
            {isLoadingDomains ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Loading domain portfolio...</p>
              </div>
            ) : domains.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <Globe className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-200">No domain records found</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">
                  {domainSearchQuery || domainExpiryFilter !== "all" || domainPaymentFilter !== "All"
                    ? "Try adjusting your search queries or filter selections."
                    : "Track your clients' domains, registrars, and renewal expirations in one central console."}
                </p>
                <button
                  type="button"
                  onClick={() => openCreateDomainModal()}
                  className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold inline-flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register First Domain</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {domains.map((d) => {
                  const daysLeft = d.daysUntilExpiry;
                  const isExp = d.isExpired;
                  const isSoon = d.isExpiringSoon;

                  // Status badge color
                  const statusColors: Record<DomainManagementStatus, string> = {
                    Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                    "Expiring Soon": "bg-amber-500/10 text-amber-300 border-amber-500/30",
                    Expired: "bg-rose-500/10 text-rose-400 border-rose-500/30",
                    "Pending Transfer": "bg-purple-500/10 text-purple-400 border-purple-500/30",
                    "Transferred Out": "bg-slate-800 text-slate-400 border-slate-700",
                    Cancelled: "bg-slate-800 text-slate-500 border-slate-700",
                  };

                  // Payment badge color
                  const paymentColors: Record<CustomerPaymentStatus, string> = {
                    Paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                    Pending: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
                    Overdue: "bg-rose-500/10 text-rose-300 border-rose-500/30",
                    Invoiced: "bg-blue-500/10 text-blue-300 border-blue-500/30",
                    Waived: "bg-slate-800 text-slate-400 border-slate-700",
                  };

                  return (
                    <div
                      key={d.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition space-y-4 shadow-xl flex flex-col justify-between"
                    >
                      {/* Card Header: Domain name, Statuses */}
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <a
                                href={`https://${d.domainName}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-base font-bold text-white hover:text-cyan-400 flex items-center gap-1.5 transition font-mono"
                              >
                                {d.domainName}
                                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                              </a>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                {d.id}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                              <span className="text-slate-300 font-medium">Client:</span> {d.customerName}
                              {d.customerEmail && (
                                <span className="text-slate-500">({d.customerEmail})</span>
                              )}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1.5">
                            <span
                              className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${
                                statusColors[d.managementStatus] || statusColors.Active
                              }`}
                            >
                              {d.managementStatus}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                                paymentColors[d.customerPaymentStatus] || paymentColors.Pending
                              }`}
                            >
                              Client Payment: {d.customerPaymentStatus}
                            </span>
                          </div>
                        </div>

                        {/* Expiry Tracking Badge */}
                        <div
                          className={`mt-3 p-2.5 rounded-xl border flex items-center justify-between text-xs font-medium ${
                            isExp
                              ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                              : isSoon
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                              : "bg-slate-950 border-slate-800 text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isExp ? (
                              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                            ) : isSoon ? (
                              <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                            ) : (
                              <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                            )}
                            <span>
                              {isExp
                                ? `Expired on ${d.expiryDate} (${Math.abs(daysLeft)} days ago)`
                                : isSoon
                                ? `Urgent: Expires on ${d.expiryDate} (${daysLeft} days remaining)`
                                : `Expires on ${d.expiryDate} (${daysLeft} days remaining)`}
                            </span>
                          </div>
                          {d.autoRenewalConfigured && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                              Auto-Renew Active
                            </span>
                          )}
                        </div>

                        {/* 9 Maintained Fields Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-slate-800/80 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Registrar</span>
                            <span className="font-semibold text-slate-200 mt-0.5 block">{d.registrar}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Registered Date</span>
                            <span className="font-mono text-slate-300 mt-0.5 block">{d.registrationDate}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Expiry Date</span>
                            <span className="font-mono text-slate-300 mt-0.5 block">{d.expiryDate}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Registration Cost</span>
                            <span className="font-semibold text-slate-200 mt-0.5 block">
                              ₹{d.registrationCost.toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Renewal Cost</span>
                            <span className="font-semibold text-cyan-400 mt-0.5 block">
                              ₹{d.renewalCost.toLocaleString("en-IN")} /yr
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">DNS Provider</span>
                            <span className="text-slate-300 mt-0.5 block truncate">
                              {d.dnsProvider || d.registrar}
                            </span>
                          </div>
                        </div>

                        {/* Domain Notes if present */}
                        {d.notes && (
                          <p className="mt-3 text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 italic">
                            &ldquo;{d.notes}&rdquo;
                          </p>
                        )}
                      </div>

                      {/* Card Footer: Action Buttons */}
                      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openRenewalModal(d)}
                            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Record Renewal</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setHistoryModalDomain(d)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1"
                            title="View customer renewal history"
                          >
                            <History className="w-3 h-3 text-slate-400" />
                            <span>History ({d.renewalHistory?.length || 0})</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditDomainModal(d)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Edit domain record"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDomain(d)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                            title="Delete domain record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: APPLICATION DETAILS                                */}
      {/* ========================================================= */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-cyan-400 font-bold">{selectedApp.id}</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full border ${getStatusBadgeStyle(
                      selectedApp.status
                    )}`}
                  >
                    {selectedApp.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">Customer Application Details</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMessage && (
              <div
                className={`mx-6 mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  statusMessage.error
                    ? "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                    : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                }`}
              >
                {statusMessage.error ? (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-sm text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label htmlFor={appStatusSelectId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Change Application Status
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Directly updates the customer record in Firestore
                  </p>
                </div>
                <select
                  id={appStatusSelectId}
                  disabled={isUpdatingStatus}
                  value={selectedApp.status}
                  onChange={(e) =>
                    handleUpdateStatus(selectedApp.id, e.target.value as ApplicationStatus)
                  }
                  className="bg-slate-900 border border-cyan-500/40 rounded-xl px-3 py-1.5 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer disabled:opacity-50"
                >
                  {ALL_APPLICATION_STATUSES.map((st) => (
                    <option key={st} value={st} className="bg-slate-900 text-slate-200">
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    1. Customer Name
                  </span>
                  <p className="font-semibold text-white">{selectedApp.customerName}</p>
                </div>

                <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    2. Business Name
                  </span>
                  <p className="font-semibold text-white">{selectedApp.businessName}</p>
                </div>

                <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    3. Email
                  </span>
                  <a
                    href={`mailto:${selectedApp.email}`}
                    className="text-cyan-400 hover:underline flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {selectedApp.email}
                  </a>
                </div>

                <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    4. Mobile Number
                  </span>
                  <a
                    href={`tel:${selectedApp.mobileNumber}`}
                    className="text-cyan-400 hover:underline flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {selectedApp.mobileNumber}
                  </a>
                </div>

                <div className="sm:col-span-2 p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    5. Business Address
                  </span>
                  <p className="text-slate-200 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>{selectedApp.businessAddress}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    6. Website Type
                  </span>
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {selectedApp.websiteType}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    7. Selected Package
                  </span>
                  <p className="font-semibold text-slate-100">{selectedApp.selectedPackage}</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  8. Business Description
                </span>
                <p className="text-slate-200 leading-relaxed whitespace-pre-line">
                  {selectedApp.businessDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    9. Required Website Pages
                  </span>
                  <p className="text-slate-200 whitespace-pre-line">{selectedApp.requiredPages}</p>
                </div>

                <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    10. Required Functionality
                  </span>
                  <p className="text-slate-200 whitespace-pre-line">
                    {selectedApp.requiredFunctionality}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    11. Preferred Website Design
                  </span>
                  <p className="text-slate-200">{selectedApp.preferredDesign}</p>
                </div>

                <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    12. Reference Website Links
                  </span>
                  <p className="text-slate-200 break-words">
                    {selectedApp.referenceLinks || "None provided"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    13. Domain Requirement
                  </span>
                  <p className="text-slate-200 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    {selectedApp.domainRequirement}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    14. Additional Requirements
                  </span>
                  <p className="text-slate-200">
                    {selectedApp.additionalRequirements || "None specified"}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  15. Customer Uploaded Files & References
                </span>
                {selectedApp.files && selectedApp.files.length > 0 ? (
                  <div className="space-y-2">
                    {selectedApp.files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                          <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                          <div className="truncate">
                            <p className="font-medium text-slate-100 truncate">
                              {file.originalName || file.name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              {formatBytes(file.size)} • {file.contentType}
                            </p>
                          </div>
                        </div>

                        <a
                          href={file.url}
                          download={file.originalName || file.name}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 text-xs font-medium border border-cyan-500/30 transition flex items-center gap-1.5 shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No files attached to this application.</p>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-950/70 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-mono">
                Submitted: {selectedApp.createdAt ? new Date(selectedApp.createdAt).toLocaleString() : ""}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    openQuotationBuilder(selectedApp);
                    setSelectedApp(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/30 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Prepare Quotation</span>
                </button>

                <button
                  onClick={() => {
                    openProjectCreator(selectedApp);
                    setSelectedApp(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-xs font-semibold hover:from-cyan-300 hover:to-sky-300 transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                >
                  <Layers className="w-4 h-4" />
                  <span>Start Customer Project</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PREPARE CUSTOMER QUOTATION                         */}
      {/* (All 4 Charge Categories + Advance & Remaining)           */}
      {/* ========================================================= */}
      {showQuotationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Prepare Customer Quotation</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  App: {quotationForm.applicationId} • {quotationForm.businessName}
                </p>
              </div>
              <button
                onClick={() => setShowQuotationModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuotation} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
              {quotationError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{quotationError}</span>
                </div>
              )}

              {/* Target Application & Customer Details */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Customer Application
                </label>
                <select
                  value={quotationForm.applicationId}
                  onChange={(e) => {
                    const target = applications.find((a) => a.id === e.target.value);
                    if (target) {
                      setQuotationForm({
                        ...quotationForm,
                        applicationId: target.id,
                        customerName: target.customerName,
                        businessName: target.businessName,
                        email: target.email,
                        mobileNumber: target.mobileNumber,
                        businessAddress: target.businessAddress,
                        websiteType: target.websiteType,
                      });
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                >
                  {applications.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.id} - {a.businessName} ({a.customerName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={quotationForm.customerName}
                    onChange={(e) => setQuotationForm({ ...quotationForm, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    value={quotationForm.businessName}
                    onChange={(e) => setQuotationForm({ ...quotationForm, businessName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              {/* 1. Selected Package */}
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                  1. Selected Package
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Package Name</label>
                    <input
                      type="text"
                      required
                      value={quotationForm.packageName}
                      onChange={(e) => setQuotationForm({ ...quotationForm, packageName: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={quotationForm.packagePrice}
                      onChange={(e) => setQuotationForm({ ...quotationForm, packagePrice: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Development Charges */}
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                  2. Development Charges
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Engineering Scope</label>
                    <input
                      type="text"
                      required
                      value={quotationForm.developmentDescription}
                      onChange={(e) => setQuotationForm({ ...quotationForm, developmentDescription: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={quotationForm.developmentAmount}
                      onChange={(e) => setQuotationForm({ ...quotationForm, developmentAmount: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Annual Service Charges */}
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                  3. Annual Service Charges (AMC / Cloud Hosting)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Service & Hosting Scope</label>
                    <input
                      type="text"
                      required
                      value={quotationForm.annualServiceDescription}
                      onChange={(e) => setQuotationForm({ ...quotationForm, annualServiceDescription: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Amount (₹/Yr)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={quotationForm.annualServiceAmount}
                      onChange={(e) => setQuotationForm({ ...quotationForm, annualServiceAmount: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Approved Additional Charges */}
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    4. Approved Additional Charges (Custom Add-ons)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setQuotationForm({
                        ...quotationForm,
                        additionalCharges: [
                          ...quotationForm.additionalCharges,
                          {
                            id: `add-${Date.now()}`,
                            description: "Extra page / custom integration",
                            amount: 2000,
                          },
                        ],
                      });
                    }}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Additional Charge
                  </button>
                </div>

                {quotationForm.additionalCharges.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add-on description"
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...quotationForm.additionalCharges];
                        updated[idx].description = e.target.value;
                        setQuotationForm({ ...quotationForm, additionalCharges: updated });
                      }}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                    />
                    <input
                      type="number"
                      min={0}
                      placeholder="Amount"
                      value={item.amount}
                      onChange={(e) => {
                        const updated = [...quotationForm.additionalCharges];
                        updated[idx].amount = Number(e.target.value) || 0;
                        setQuotationForm({ ...quotationForm, additionalCharges: updated });
                      }}
                      className="w-24 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setQuotationForm({
                          ...quotationForm,
                          additionalCharges: quotationForm.additionalCharges.filter((_, i) => i !== idx),
                        });
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Financial Calculation & Payment Terms */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Discount (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={quotationForm.discount}
                      onChange={(e) => setQuotationForm({ ...quotationForm, discount: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Tax Rate (%)</label>
                    <input
                      type="number"
                      min={0}
                      value={quotationForm.taxRatePercent}
                      onChange={(e) => setQuotationForm({ ...quotationForm, taxRatePercent: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1">Advance Payment (%)</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={quotationForm.advancePaymentPercentOrAmount}
                      onChange={(e) =>
                        setQuotationForm({
                          ...quotationForm,
                          advancePaymentPercentOrAmount: Number(e.target.value),
                        })
                      }
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-mono"
                    />
                  </div>
                </div>

                {/* Real-time Calculated Total & Payment Split */}
                <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span className="font-mono text-slate-200">₹{subtotalCalc.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Taxes & GST ({quotationForm.taxRatePercent}%):</span>
                    <span className="font-mono text-slate-200">+₹{taxCalc.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-white pt-1 border-t border-slate-800">
                    <span>Total Amount (Calculated):</span>
                    <span className="text-cyan-400 font-mono">₹{totalCalc.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-teal-300 font-semibold pt-1">
                    <span>Advance Payment Required:</span>
                    <span className="font-mono">₹{advanceCalc.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Remaining Balance on Completion:</span>
                    <span className="font-mono text-slate-200">₹{remainingCalc.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuotationModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingQuotation}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-xs font-bold hover:from-cyan-300 hover:to-sky-300 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isSavingQuotation ? "Generating Quotation..." : "Save & Generate Customer Quotation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: MANAGE PAYMENT & VERIFY TRANSACTION                */}
      {/* ========================================================= */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan-400 font-bold">{selectedPayment.id}</span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full border ${getPaymentBadgeStyle(
                      selectedPayment.status
                    )}`}
                  >
                    {selectedPayment.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Manage Payment: {selectedPayment.businessName || selectedPayment.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
              {/* Financial Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase block">Total Agreed</span>
                  <span className="text-sm font-bold text-white font-mono mt-0.5 block">
                    ₹{selectedPayment.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-teal-500/20">
                  <span className="text-teal-400 text-[10px] uppercase block">Advance Required</span>
                  <span className="text-sm font-bold text-teal-300 font-mono mt-0.5 block">
                    ₹{selectedPayment.advanceRequired.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/20">
                  <span className="text-emerald-400 text-[10px] uppercase block">Amount Paid</span>
                  <span className="text-sm font-bold text-emerald-300 font-mono mt-0.5 block">
                    ₹{selectedPayment.amountPaid.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase block">Remaining Balance</span>
                  <span className="text-sm font-bold text-slate-200 font-mono mt-0.5 block">
                    ₹{selectedPayment.remainingAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Change Payment Status Dropdown */}
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-slate-300 uppercase tracking-wider block">
                    Direct Payment Status Update
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Logged with admin email signature and timestamp
                  </span>
                </div>
                <select
                  value={selectedPayment.status}
                  onChange={(e) =>
                    handleDirectPaymentStatusUpdate(
                      selectedPayment.quotationId,
                      e.target.value as PaymentStatus
                    )
                  }
                  className="bg-slate-900 border border-cyan-500/40 rounded-xl px-3 py-1.5 text-xs text-cyan-300 focus:outline-none"
                >
                  {ALL_PAYMENT_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Transactions List with Admin Verification Actions */}
              <div>
                <span className="font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                  Customer Submitted Transactions (UTR / Bank Proofs)
                </span>

                {selectedPayment.transactions && selectedPayment.transactions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedPayment.transactions.map((txn: PaymentTransaction) => (
                      <div
                        key={txn.id}
                        className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white">{txn.id}</span>
                            <span className="capitalize text-slate-400">• {txn.type}</span>
                            <span className="text-slate-400">• {txn.paymentMethod}</span>
                          </div>
                          <span className="font-mono text-sm font-bold text-cyan-300">
                            ₹{txn.amount.toLocaleString()}
                          </span>
                        </div>

                        <div className="p-2 bg-slate-900 rounded-lg font-mono text-[11px] flex justify-between items-center text-slate-300">
                          <span>UTR: <strong className="text-white">{txn.transactionReference}</strong></span>
                          <span>Date: {txn.transactionDate}</span>
                        </div>

                        {txn.customerNotes && (
                          <p className="text-[11px] text-slate-400 italic">
                            Remarks: &ldquo;{txn.customerNotes}&rdquo;
                          </p>
                        )}

                        {/* Verification Action Buttons */}
                        <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                          {txn.verifiedByAdmin ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Verified by {txn.verifiedByEmail || "Accounts"}
                            </span>
                          ) : (
                            <div className="flex items-center gap-2 w-full justify-end">
                              <button
                                type="button"
                                disabled={verifyingTxnId === txn.id}
                                onClick={() =>
                                  handleVerifyTransaction(selectedPayment.quotationId, txn.id, "reject")
                                }
                                className="px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs transition"
                              >
                                Decline
                              </button>
                              <button
                                type="button"
                                disabled={verifyingTxnId === txn.id}
                                onClick={() =>
                                  handleVerifyTransaction(selectedPayment.quotationId, txn.id, "approve")
                                }
                                className="px-3.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Verify & Credit Payment</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic p-4 bg-slate-950/40 rounded-xl text-center">
                    No transactions submitted by customer yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: START CUSTOMER PROJECT                             */}
      {/* ========================================================= */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Start Customer Project</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Launch production development tracking with the 6 official project stages
                </p>
              </div>
              <button
                onClick={() => setShowProjectModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-sm">
              {projectError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{projectError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.projectName}
                  onChange={(e) => setProjectForm({ ...projectForm, projectName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    value={projectForm.clientName}
                    onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Business Name</label>
                  <input
                    type="text"
                    required
                    value={projectForm.clientBusiness}
                    onChange={(e) => setProjectForm({ ...projectForm, clientBusiness: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={projectForm.clientEmail}
                    onChange={(e) => setProjectForm({ ...projectForm, clientEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Mobile</label>
                  <input
                    type="text"
                    value={projectForm.clientMobile}
                    onChange={(e) => setProjectForm({ ...projectForm, clientMobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Website Type</label>
                  <select
                    value={projectForm.websiteType}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, websiteType: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  >
                    {WEBSITE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Expected Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={projectForm.expectedDeliveryDate}
                    onChange={(e) => setProjectForm({ ...projectForm, expectedDeliveryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 text-xs">Initial Progress / Kickoff Notes</label>
                <textarea
                  rows={3}
                  value={projectForm.initialNotes}
                  onChange={(e) => setProjectForm({ ...projectForm, initialNotes: e.target.value })}
                  placeholder="Kickoff notes visible on customer tracking portal..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProject}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-xs font-semibold hover:from-cyan-300 hover:to-sky-300 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isSavingProject ? "Initializing Project..." : "Launch Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD PROGRESS NOTE                                  */}
      {/* ========================================================= */}
      {noteModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Add Progress Note</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {noteModalProject.projectName} ({noteModalProject.currentStage})
                </p>
              </div>
              <button
                onClick={() => setNoteModalProject(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProgressNote} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Note Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-fidelity UI mockups completed for review"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Progress Details / Engineering Notes
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed update for customer and development audit log..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNoteModalProject(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNote}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isSubmittingNote ? "Publishing..." : "Publish Progress Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: UPLOAD / SHARE FILE                                */}
      {/* ========================================================= */}
      {fileModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Share Project File</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Share deliverables, designs or preview builds with {fileModalProject.clientName}
                </p>
              </div>
              <button
                onClick={() => setFileModalProject(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProjectFile} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Deliverable Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ViBa_Homepage_Design_v2.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Category
                </label>
                <select
                  value={fileCategory}
                  onChange={(e) =>
                    setFileCategory(
                      e.target.value as "Design Mockups" | "Preview Builds" | "Documentation" | "Source / Assets"
                    )
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                >
                  <option value="Design Mockups">Design Mockups</option>
                  <option value="Preview Builds">Preview Builds</option>
                  <option value="Documentation">Documentation</option>
                  <option value="Source / Assets">Source / Assets</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  File URL / Hosted Asset Link
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFileModalProject(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingFile}
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition shadow-lg shadow-teal-500/20 disabled:opacity-50"
                >
                  {isUploadingFile ? "Sharing..." : "Share File with Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT CUSTOMER DOMAIN                       */}
      {/* ========================================================= */}
      {showDomainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>{editingDomain ? "Edit Managed Domain" : "Register New Customer Domain"}</span>
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Maintain domain registrar details, registration/renewal costs, and customer payment status
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDomainModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDomain} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {domainError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{domainError}</span>
                </div>
              )}

              {/* 1. Customer Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sharma"
                    value={domainForm.customerName}
                    onChange={(e) => setDomainForm({ ...domainForm, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    placeholder="client@company.com"
                    value={domainForm.customerEmail || ""}
                    onChange={(e) => setDomainForm({ ...domainForm, customerEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* 2. Domain Name & Registrar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Domain Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. mycompany.com"
                    value={domainForm.domainName}
                    onChange={(e) => setDomainForm({ ...domainForm, domainName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Domain Registrar *
                  </label>
                  <input
                    type="text"
                    required
                    list="registrar-suggestions"
                    placeholder="e.g. GoDaddy, Namecheap, Cloudflare"
                    value={domainForm.registrar}
                    onChange={(e) => setDomainForm({ ...domainForm, registrar: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <datalist id="registrar-suggestions">
                    <option value="GoDaddy" />
                    <option value="Namecheap" />
                    <option value="Cloudflare" />
                    <option value="Google Domains" />
                    <option value="Hostinger" />
                    <option value="BigRock" />
                    <option value="AWS Route 53" />
                    <option value="Porkbun" />
                  </datalist>
                </div>
              </div>

              {/* 3. Registration Date & Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Registration Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={domainForm.registrationDate}
                    onChange={(e) => setDomainForm({ ...domainForm, registrationDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={domainForm.expiryDate}
                    onChange={(e) => setDomainForm({ ...domainForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* 4. Registration Cost & Renewal Cost */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Registration Cost (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1}
                    value={domainForm.registrationCost}
                    onChange={(e) =>
                      setDomainForm({ ...domainForm, registrationCost: Number(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Annual Renewal Cost (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1}
                    value={domainForm.renewalCost}
                    onChange={(e) =>
                      setDomainForm({ ...domainForm, renewalCost: Number(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* 5. Customer Payment Status & Domain Management Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Customer Payment Status *
                  </label>
                  <select
                    value={domainForm.customerPaymentStatus}
                    onChange={(e) =>
                      setDomainForm({
                        ...domainForm,
                        customerPaymentStatus: e.target.value as CustomerPaymentStatus,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Invoiced">Invoiced</option>
                    <option value="Waived">Waived / Complimentary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Domain Management Status *
                  </label>
                  <select
                    value={domainForm.managementStatus}
                    onChange={(e) =>
                      setDomainForm({
                        ...domainForm,
                        managementStatus: e.target.value as DomainManagementStatus,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                    <option value="Pending Transfer">Pending Transfer</option>
                    <option value="Transferred Out">Transferred Out</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* DNS Provider & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    DNS Provider (Nameservers)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cloudflare DNS, GoDaddy DNS"
                    value={domainForm.dnsProvider || ""}
                    onChange={(e) => setDomainForm({ ...domainForm, dnsProvider: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={Boolean(domainForm.autoRenewalConfigured)}
                      onChange={(e) =>
                        setDomainForm({ ...domainForm, autoRenewalConfigured: e.target.checked })
                      }
                      className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                    />
                    <span>Auto-Renewal configured at Registrar</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Administrative Notes / Access Details
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Registered via client's credit card; renewal due notice sent to client email on 1st of month"
                  value={domainForm.notes || ""}
                  onChange={(e) => setDomainForm({ ...domainForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDomainModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingDomain}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-xs font-bold hover:from-cyan-300 hover:to-sky-300 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isSavingDomain ? "Saving..." : editingDomain ? "Update Domain" : "Register Domain"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: RECORD DOMAIN RENEWAL                            */}
      {/* ========================================================= */}
      {renewalModalDomain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  <span>Record Domain Renewal</span>
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Log renewal payment and extend expiration date in registry records
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRenewalModalDomain(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRenewal} className="p-6 space-y-4">
              {/* Domain Overview Box */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Domain Name:</span>
                  <span className="font-mono font-bold text-white">{renewalModalDomain.domainName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="text-slate-200">{renewalModalDomain.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Expiry:</span>
                  <span className="font-mono text-amber-300">{renewalModalDomain.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registrar:</span>
                  <span className="text-slate-200">{renewalModalDomain.registrar}</span>
                </div>
              </div>

              {/* New Expiry Date */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  New Extended Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={renewalForm.newExpiryDate}
                  onChange={(e) => setRenewalForm({ ...renewalForm, newExpiryDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Renewal Cost & Customer Payment Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Renewal Cost (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1}
                    value={renewalForm.renewalCost}
                    onChange={(e) =>
                      setRenewalForm({ ...renewalForm, renewalCost: Number(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Customer Payment Status *
                  </label>
                  <select
                    value={renewalForm.customerPaymentStatus}
                    onChange={(e) =>
                      setRenewalForm({
                        ...renewalForm,
                        customerPaymentStatus: e.target.value as CustomerPaymentStatus,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Paid">Customer Paid</option>
                    <option value="Pending">Payment Pending</option>
                    <option value="Overdue">Payment Overdue</option>
                    <option value="Invoiced">Invoiced</option>
                    <option value="Waived">Waived / Complimentary</option>
                  </select>
                </div>
              </div>

              {/* Invoice Reference */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Invoice Reference / Receipt ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. INV-DOM-2026-042 or Registrar Order ID"
                  value={renewalForm.invoiceReference || ""}
                  onChange={(e) => setRenewalForm({ ...renewalForm, invoiceReference: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Renewal Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Renewed for 1 additional year via credit card on GoDaddy"
                  value={renewalForm.notes || ""}
                  onChange={(e) => setRenewalForm({ ...renewalForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRenewalModalDomain(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingRenewal}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isSavingRenewal ? "Logging Renewal..." : "Confirm Renewal Log"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CUSTOMER DOMAIN RENEWAL HISTORY                   */}
      {/* ========================================================= */}
      {historyModalDomain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  <span>Domain &amp; Renewal History</span>
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Timeline of all registered lifecycle events and manual renewals for this domain
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHistoryModalDomain(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Domain Metadata Header */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
                      {historyModalDomain.domainName}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Customer: <span className="text-slate-200 font-semibold">{historyModalDomain.customerName}</span>
                      {historyModalDomain.customerEmail && (
                        <span className="text-slate-500"> ({historyModalDomain.customerEmail})</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2.5 py-0.5 rounded-full border bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-semibold">
                      {historyModalDomain.managementStatus}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Registrar: <span className="text-slate-300 font-medium">{historyModalDomain.registrar}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">First Registered</span>
                    <span className="font-mono text-slate-200">{historyModalDomain.registrationDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Current Expiry</span>
                    <span className="font-mono text-cyan-300">{historyModalDomain.expiryDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Days Remaining</span>
                    <span
                      className={`font-semibold ${
                        historyModalDomain.isExpired
                          ? "text-rose-400"
                          : historyModalDomain.isExpiringSoon
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {historyModalDomain.daysUntilExpiry} days
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Renewal Pipeline</span>
                    <span className="font-semibold text-slate-200">
                      ₹{historyModalDomain.renewalCost.toLocaleString("en-IN")} /yr
                    </span>
                  </div>
                </div>
              </div>

              {/* Renewal History Timeline */}
              <div className="space-y-3">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Renewal Audit Trail ({historyModalDomain.renewalHistory?.length || 0})</span>
                </h5>

                {!historyModalDomain.renewalHistory || historyModalDomain.renewalHistory.length === 0 ? (
                  <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                    <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">No previous renewals recorded yet for this domain.</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Use the &quot;Record Renewal&quot; button to log registrar extension events.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {historyModalDomain.renewalHistory
                      .slice()
                      .reverse()
                      .map((rec) => (
                        <div
                          key={rec.id}
                          className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] text-cyan-400 font-bold">{rec.id}</span>
                              <span className="text-slate-400">
                                Renewed on <span className="text-slate-200 font-semibold">{rec.renewalDate}</span>
                              </span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                              Payment: {rec.customerPaymentStatus}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-400 pt-1">
                            <div>
                              <span>Validity Extended: </span>
                              <span className="font-mono text-slate-200">
                                {rec.previousExpiryDate} &rarr;{" "}
                                <span className="text-emerald-300 font-bold">{rec.newExpiryDate}</span>
                              </span>
                            </div>
                            <div>
                              <span>Cost: </span>
                              <span className="font-semibold text-slate-200">
                                ₹{rec.cost.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <div>
                              <span>Logged By: </span>
                              <span className="font-mono text-slate-300">{rec.renewedBy}</span>
                            </div>
                          </div>

                          {rec.invoiceReference && (
                            <div className="text-[11px] text-slate-400">
                              Invoice / Receipt:{" "}
                              <span className="font-mono text-cyan-400">{rec.invoiceReference}</span>
                            </div>
                          )}

                          {rec.notes && (
                            <p className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded border border-slate-800 italic">
                              &ldquo;{rec.notes}&rdquo;
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-950/70 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setHistoryModalDomain(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
