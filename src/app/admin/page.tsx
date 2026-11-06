"use client";

import React, { useState, useEffect, useCallback, useId } from "react";
import Link from "next/link";
import { VbMonogram } from "@/components/common/VbMonogram";
import {
  CustomerApplication,
  ApplicationStatus,
  WebsiteType,
  CustomerQuotation,
  CustomerProject,
  QuotationLineItem,
  QuotationStatus,
  ProjectStatus,
  ProjectMilestone,
} from "@/types/application";
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
  CheckSquare,
  Square,
  Lock,
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

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
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
  const [activeTab, setActiveTab] = useState<"applications" | "quotations" | "projects">("applications");

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
  const [quotations, setQuotations] = useState<CustomerQuotation[]>([]);
  const [isLoadingQuotations, setIsLoadingQuotations] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [isSavingQuotation, setIsSavingQuotation] = useState(false);
  const [quotationError, setQuotationError] = useState<string | null>(null);
  const [quotationForm, setQuotationForm] = useState<{
    applicationId: string;
    customerName: string;
    businessName: string;
    email: string;
    mobileNumber: string;
    websiteType: WebsiteType;
    currency: "INR" | "USD";
    items: QuotationLineItem[];
    discount: number;
    taxRate: number;
    estimatedTimelineWeeks: number;
    scopeDeliverables: string;
    termsAndConditions: string;
  }>({
    applicationId: "",
    customerName: "",
    businessName: "",
    email: "",
    mobileNumber: "",
    websiteType: "Static Website",
    currency: "INR",
    items: [
      { id: "item-1", description: "UI/UX Architecture & Responsive Design", quantity: 1, unitPrice: 8000, total: 8000 },
      { id: "item-2", description: "Frontend Development & Interactive Components", quantity: 1, unitPrice: 10000, total: 10000 },
    ],
    discount: 0,
    taxRate: 18,
    estimatedTimelineWeeks: 2,
    scopeDeliverables: "Full responsive layout, SEO meta setup, Contact intake, SSL deployment",
    termsAndConditions: "50% advance mobilization deposit, 50% upon successful testing and production launch.",
  });

  // Projects State
  const [projects, setProjects] = useState<CustomerProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<{
    applicationId: string;
    projectName: string;
    clientName: string;
    clientBusiness: string;
    clientEmail: string;
    clientMobile: string;
    websiteType: WebsiteType;
    status: ProjectStatus;
    targetLaunchDate: string;
    stagingUrl: string;
    repositoryUrl: string;
    assignedLead: string;
    internalNotes: string;
  }>({
    applicationId: "",
    projectName: "",
    clientName: "",
    clientBusiness: "",
    clientEmail: "",
    clientMobile: "",
    websiteType: "Dynamic Business Website",
    status: "Planning",
    targetLaunchDate: "",
    stagingUrl: "",
    repositoryUrl: "",
    assignedLead: "ViBa Engineering Team",
    internalNotes: "",
  });

  // Accessible IDs for form controls
  const searchInputId = useId();
  const typeFilterId = useId();
  const statusFilterId = useId();
  const appStatusSelectId = useId();
  const quoteAppSelectId = useId();
  const quoteCustNameId = useId();
  const quoteBizNameId = useId();
  const quoteEmailId = useId();
  const quoteMobileId = useId();
  const quoteWebTypeId = useId();
  const quoteCurrencyId = useId();
  const quoteTimelineId = useId();
  const quoteDiscountId = useId();
  const quoteTaxRateId = useId();
  const quoteDeliverablesId = useId();
  const quoteTermsId = useId();
  const projNameId = useId();
  const projClientNameId = useId();
  const projClientBizId = useId();
  const projClientEmailId = useId();
  const projClientMobileId = useId();
  const projWebTypeId = useId();
  const projStatusId = useId();
  const projLaunchDateId = useId();
  const projLeadId = useId();
  const projStagingId = useId();
  const projRepoId = useId();
  const projNotesId = useId();

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

  // 2. Fetch Applications Helper (for manual triggers like Refresh or Status Update)
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
      const res = await fetch("/api/admin/quotations", { cache: "no-store" });
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

  // 4. Fetch Projects Helper
  const fetchProjects = useCallback(async () => {
    try {
      setIsLoadingProjects(true);
      const res = await fetch("/api/admin/projects", { cache: "no-store" });
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

  // 5. Synchronize data when Authenticated and Tab/Filters change
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
      fetch("/api/admin/quotations", { cache: "no-store" })
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
    } else if (activeTab === "projects") {
      fetch("/api/admin/projects", { cache: "no-store" })
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
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, activeTab, searchQuery, selectedType, selectedStatus]);

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

      // Update in applications list
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
    setQuotationForm({
      applicationId: app.id,
      customerName: app.customerName,
      businessName: app.businessName,
      email: app.email,
      mobileNumber: app.mobileNumber,
      websiteType: app.websiteType,
      currency: "INR",
      items: [
        {
          id: "item-1",
          description: `${app.websiteType} - Custom Architecture & Design`,
          quantity: 1,
          unitPrice: app.websiteType === "E-commerce Website" ? 18000 : 10000,
          total: app.websiteType === "E-commerce Website" ? 18000 : 10000,
        },
        {
          id: "item-2",
          description: "Database, CMS & Integration of Required Features",
          quantity: 1,
          unitPrice: app.websiteType === "E-commerce Website" ? 12000 : 6000,
          total: app.websiteType === "E-commerce Website" ? 12000 : 6000,
        },
      ],
      discount: 0,
      taxRate: 18,
      estimatedTimelineWeeks: app.websiteType === "E-commerce Website" ? 4 : 2,
      scopeDeliverables: `Pages: ${app.requiredPages}\nFeatures: ${app.requiredFunctionality}\nDomain: ${app.domainRequirement}`,
      termsAndConditions:
        "50% advance mobilization deposit, 50% upon successful testing and production launch. Includes 30 days of post-launch support.",
    });
    setQuotationError(null);
    setShowQuotationModal(true);
  };

  // Save Quotation to Database
  const handleSaveQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingQuotation(true);
    setQuotationError(null);

    try {
      const subtotal = quotationForm.items.reduce((acc, it) => acc + (Number(it.total) || 0), 0);
      const discount = Number(quotationForm.discount) || 0;
      const taxAmount = ((subtotal - discount) * (Number(quotationForm.taxRate) || 0)) / 100;
      const totalAmount = Math.max(0, subtotal - discount + taxAmount);

      const res = await fetch("/api/admin/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: quotationForm.applicationId,
          customerName: quotationForm.customerName,
          businessName: quotationForm.businessName,
          email: quotationForm.email,
          mobileNumber: quotationForm.mobileNumber,
          websiteType: quotationForm.websiteType,
          currency: quotationForm.currency,
          items: quotationForm.items,
          subtotal,
          discount,
          tax: taxAmount,
          totalAmount,
          estimatedTimelineWeeks: quotationForm.estimatedTimelineWeeks,
          scopeDeliverables: quotationForm.scopeDeliverables.split("\n").filter(Boolean),
          termsAndConditions: quotationForm.termsAndConditions,
          status: "Draft",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save quotation to database.");
      }

      setShowQuotationModal(false);
      fetchQuotations();
      fetchApplications();
      setActiveTab("quotations");
    } catch (err) {
      setQuotationError(err instanceof Error ? err.message : "Error saving quotation.");
    } finally {
      setIsSavingQuotation(false);
    }
  };

  // Open Project Creator for Application
  const openProjectCreator = (app: CustomerApplication) => {
    setProjectForm({
      applicationId: app.id,
      projectName: `${app.businessName} Website`,
      clientName: app.customerName,
      clientBusiness: app.businessName,
      clientEmail: app.email,
      clientMobile: app.mobileNumber,
      websiteType: app.websiteType,
      status: "Planning",
      targetLaunchDate: "",
      stagingUrl: "",
      repositoryUrl: "",
      assignedLead: "ViBa Engineering Team",
      internalNotes: `Requirements: ${app.businessDescription.substring(0, 200)}...`,
    });
    setProjectError(null);
    setShowProjectModal(true);
  };

  // Save Project to Database
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProject(true);
    setProjectError(null);

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projectForm,
          progressPercent: 10,
        }),
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

  // Toggle Project Milestone
  const handleToggleMilestone = async (project: CustomerProject, milestoneId: string) => {
    const updatedMilestones = project.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const progressPercent = Math.round((completedCount / updatedMilestones.length) * 100);

    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          milestones: updatedMilestones,
          progressPercent,
        }),
      });

      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === project.id
              ? { ...p, milestones: updatedMilestones, progressPercent }
              : p
          )
        );
      }
    } catch {
      // Ignored
    }
  };

  // Update Project Status
  const handleUpdateProjectStatus = async (projectId: string, newStatus: ProjectStatus) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
        );
      }
    } catch {
      // Ignored
    }
  };

  // Update Quotation Status
  const handleUpdateQuotationStatus = async (quoteId: string, newStatus: QuotationStatus) => {
    try {
      const res = await fetch(`/api/admin/quotations/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setQuotations((prev) =>
          prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
        );
      }
    } catch {
      // Ignored
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
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/10 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl mb-4">
              <VbMonogram className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">ViBa Admin Portal</h1>
            <p className="text-slate-400 text-sm mt-1">
              Restricted management console for customer applications & projects
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

          {/* Navigation Tabs */}
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
              <span>Applications</span>
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
              <span>Quotations</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {quotations.length}
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
              <span>Projects</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {projects.length}
              </span>
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
                {/* Website Type Filter */}
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

                {/* Status Filter */}
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

            {/* Applications Table / Cards */}
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Client Quotations</h2>
                <p className="text-xs text-slate-400">
                  Prepare, price, and deliver official agency quotations for customer applications
                </p>
              </div>
              <button
                onClick={() => {
                  if (applications.length > 0) {
                    openQuotationBuilder(applications[0]);
                  } else {
                    setQuotationError("Please submit or select a customer application first.");
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-xs font-semibold hover:from-cyan-300 hover:to-sky-300 transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Prepare New Quotation</span>
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
                  You can prepare custom quotations directly from any customer application.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quotations.map((quote) => (
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
                          <span className="text-slate-500">Website Type:</span>
                          <span className="font-medium text-slate-200">{quote.websiteType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Timeline:</span>
                          <span className="font-medium text-slate-200">{quote.estimatedTimelineWeeks} Weeks</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Deliverables:</span>
                          <span className="font-medium text-slate-200">{quote.items?.length || 0} line items</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                          <span>Total Amount:</span>
                          <span className="text-cyan-400 font-mono">
                            {quote.currency === "INR" ? "₹" : "$"}{quote.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <select
                        value={quote.status}
                        onChange={(e) =>
                          handleUpdateQuotationStatus(quote.id, e.target.value as QuotationStatus)
                        }
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Sent to Customer">Sent to Customer</option>
                        <option value="Approved">Approved</option>
                        <option value="Revised">Revised</option>
                        <option value="Declined">Declined</option>
                      </select>

                      <button
                        onClick={() => window.print()}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                      >
                        Print / PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PROJECTS                                           */}
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
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-cyan-400 font-semibold">{proj.id}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {proj.websiteType}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white">{proj.projectName}</h3>
                        <p className="text-xs text-slate-400">{proj.clientBusiness} • {proj.clientName}</p>
                      </div>

                      <select
                        value={proj.status}
                        onChange={(e) =>
                          handleUpdateProjectStatus(proj.id, e.target.value as ProjectStatus)
                        }
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
                      >
                        <option value="Planning">Planning</option>
                        <option value="In Development">In Development</option>
                        <option value="Client Review">Client Review</option>
                        <option value="Testing & QA">Testing & QA</option>
                        <option value="Launched">Launched</option>
                        <option value="On Hold">On Hold</option>
                      </select>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Development Progress</span>
                        <span className="font-mono text-cyan-400 font-semibold">{proj.progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full transition-all duration-300"
                          style={{ width: `${proj.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Milestones Checklist */}
                    <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-2">
                      <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Milestones & Tasks
                      </p>
                      <div className="space-y-1.5">
                        {proj.milestones?.map((m: ProjectMilestone) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => handleToggleMilestone(proj, m.id)}
                            className="w-full flex items-center gap-2.5 text-left text-xs p-1.5 rounded hover:bg-slate-800/60 transition group"
                          >
                            {m.completed ? (
                              <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0" />
                            )}
                            <span
                              className={`${
                                m.completed ? "line-through text-slate-500" : "text-slate-200"
                              }`}
                            >
                              {m.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* URLs and Details */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-slate-800/60">
                      <div className="flex items-center gap-2">
                        {proj.stagingUrl && (
                          <a
                            href={proj.stagingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-400 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Staging
                          </a>
                        )}
                        {proj.repositoryUrl && (
                          <a
                            href={proj.repositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-slate-400 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Repo
                          </a>
                        )}
                      </div>
                      <span className="text-slate-500 font-mono text-[11px]">
                        Target: {proj.targetLaunchDate || "TBD"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: COMPLETE APPLICATION DETAILS (ALL 15 FIELDS)       */}
      {/* ========================================================= */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
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

            {/* Status Feedback Notification */}
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

            {/* Modal Body: All 15 Fields */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-sm text-slate-300">
              {/* Status Selector Bar */}
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

              {/* Grid: 1-5 Customer Details */}
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

              {/* Fields 6 - 7: Website Type & Package */}
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

              {/* Field 8: Business Description */}
              <div className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  8. Business Description
                </span>
                <p className="text-slate-200 leading-relaxed whitespace-pre-line">
                  {selectedApp.businessDescription}
                </p>
              </div>

              {/* Fields 9 - 10: Required Pages & Functionality */}
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

              {/* Fields 11 - 12: Preferred Design & Reference Links */}
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

              {/* Fields 13 - 14: Domain & Additional Requirements */}
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

              {/* Field 15: File and Image Uploads */}
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

                        {/* Direct Download File Button */}
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

            {/* Modal Footer Actions */}
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
      {/* MODAL: PREPARE QUOTATION                                  */}
      {/* ========================================================= */}
      {showQuotationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Prepare Client Quotation</h3>
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

              {/* Link Application Selector */}
              <div>
                <label htmlFor={quoteAppSelectId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Customer Application
                </label>
                <select
                  id={quoteAppSelectId}
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

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={quoteCustNameId} className="block text-xs text-slate-400 mb-1">Customer Name</label>
                  <input
                    id={quoteCustNameId}
                    type="text"
                    required
                    value={quotationForm.customerName}
                    onChange={(e) => setQuotationForm({ ...quotationForm, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label htmlFor={quoteBizNameId} className="block text-xs text-slate-400 mb-1">Business Name</label>
                  <input
                    id={quoteBizNameId}
                    type="text"
                    required
                    value={quotationForm.businessName}
                    onChange={(e) => setQuotationForm({ ...quotationForm, businessName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label htmlFor={quoteEmailId} className="block text-xs text-slate-400 mb-1">Email</label>
                  <input
                    id={quoteEmailId}
                    type="email"
                    required
                    value={quotationForm.email}
                    onChange={(e) => setQuotationForm({ ...quotationForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label htmlFor={quoteMobileId} className="block text-xs text-slate-400 mb-1">Mobile</label>
                  <input
                    id={quoteMobileId}
                    type="text"
                    value={quotationForm.mobileNumber}
                    onChange={(e) => setQuotationForm({ ...quotationForm, mobileNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
              </div>

              {/* Currency & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor={quoteWebTypeId} className="block text-xs text-slate-400 mb-1">Website Type</label>
                  <select
                    id={quoteWebTypeId}
                    value={quotationForm.websiteType}
                    onChange={(e) =>
                      setQuotationForm({ ...quotationForm, websiteType: e.target.value as WebsiteType })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  >
                    {WEBSITE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={quoteCurrencyId} className="block text-xs text-slate-400 mb-1">Currency</label>
                  <select
                    id={quoteCurrencyId}
                    value={quotationForm.currency}
                    onChange={(e) =>
                      setQuotationForm({ ...quotationForm, currency: e.target.value as "INR" | "USD" })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={quoteTimelineId} className="block text-xs text-slate-400 mb-1">Timeline (Weeks)</label>
                  <input
                    id={quoteTimelineId}
                    type="number"
                    min={1}
                    max={52}
                    value={quotationForm.estimatedTimelineWeeks}
                    onChange={(e) =>
                      setQuotationForm({ ...quotationForm, estimatedTimelineWeeks: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Quotation Line Items
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuotationForm({
                        ...quotationForm,
                        items: [
                          ...quotationForm.items,
                          {
                            id: `item-${Date.now()}`,
                            description: "Feature / Service line item",
                            quantity: 1,
                            unitPrice: 2000,
                            total: 2000,
                          },
                        ],
                      })
                    }
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-2">
                  {quotationForm.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Deliverable Description"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...quotationForm.items];
                          updated[idx].description = e.target.value;
                          setQuotationForm({ ...quotationForm, items: updated });
                        }}
                        className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100"
                      />
                      <input
                        type="number"
                        min={1}
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => {
                          const updated = [...quotationForm.items];
                          const qty = Number(e.target.value) || 1;
                          updated[idx].quantity = qty;
                          updated[idx].total = qty * updated[idx].unitPrice;
                          setQuotationForm({ ...quotationForm, items: updated });
                        }}
                        className="w-16 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 text-center"
                      />
                      <input
                        type="number"
                        min={0}
                        placeholder="Price"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const updated = [...quotationForm.items];
                          const price = Number(e.target.value) || 0;
                          updated[idx].unitPrice = price;
                          updated[idx].total = updated[idx].quantity * price;
                          setQuotationForm({ ...quotationForm, items: updated });
                        }}
                        className="w-24 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 font-mono text-right"
                      />
                      <span className="w-20 text-xs font-mono text-cyan-400 text-right">
                        {item.total.toLocaleString()}
                      </span>
                      {quotationForm.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = quotationForm.items.filter((_, i) => i !== idx);
                            setQuotationForm({ ...quotationForm, items: updated });
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Summary */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs">
                <div>
                  <label htmlFor={quoteDiscountId} className="block text-slate-400 mb-1">Discount ({quotationForm.currency === "INR" ? "₹" : "$"})</label>
                  <input
                    id={quoteDiscountId}
                    type="number"
                    min={0}
                    value={quotationForm.discount}
                    onChange={(e) => setQuotationForm({ ...quotationForm, discount: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
                  />
                </div>
                <div>
                  <label htmlFor={quoteTaxRateId} className="block text-slate-400 mb-1">Tax Rate (%)</label>
                  <input
                    id={quoteTaxRateId}
                    type="number"
                    min={0}
                    max={100}
                    value={quotationForm.taxRate}
                    onChange={(e) => setQuotationForm({ ...quotationForm, taxRate: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100"
                  />
                </div>
              </div>

              {/* Terms & Scope */}
              <div>
                <label htmlFor={quoteDeliverablesId} className="block text-xs text-slate-400 mb-1">Scope of Deliverables</label>
                <textarea
                  id={quoteDeliverablesId}
                  rows={2}
                  value={quotationForm.scopeDeliverables}
                  onChange={(e) => setQuotationForm({ ...quotationForm, scopeDeliverables: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                />
              </div>

              <div>
                <label htmlFor={quoteTermsId} className="block text-xs text-slate-400 mb-1">Terms and Conditions</label>
                <textarea
                  id={quoteTermsId}
                  rows={2}
                  value={quotationForm.termsAndConditions}
                  onChange={(e) => setQuotationForm({ ...quotationForm, termsAndConditions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                />
              </div>

              {/* Submit Button */}
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-xs font-semibold hover:from-cyan-300 hover:to-sky-300 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isSavingQuotation ? "Saving to Database..." : "Save & Generate Quotation"}
                </button>
              </div>
            </form>
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
                  Launch production development tracking for this client
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
                <label htmlFor={projNameId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Project Title
                </label>
                <input
                  id={projNameId}
                  type="text"
                  required
                  value={projectForm.projectName}
                  onChange={(e) => setProjectForm({ ...projectForm, projectName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={projClientNameId} className="block text-xs text-slate-400 mb-1">Client Name</label>
                  <input
                    id={projClientNameId}
                    type="text"
                    required
                    value={projectForm.clientName}
                    onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label htmlFor={projClientBizId} className="block text-xs text-slate-400 mb-1">Business Name</label>
                  <input
                    id={projClientBizId}
                    type="text"
                    required
                    value={projectForm.clientBusiness}
                    onChange={(e) => setProjectForm({ ...projectForm, clientBusiness: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label htmlFor={projClientEmailId} className="block text-xs text-slate-400 mb-1">Email</label>
                  <input
                    id={projClientEmailId}
                    type="email"
                    value={projectForm.clientEmail}
                    onChange={(e) => setProjectForm({ ...projectForm, clientEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label htmlFor={projClientMobileId} className="block text-xs text-slate-400 mb-1">Mobile</label>
                  <input
                    id={projClientMobileId}
                    type="text"
                    value={projectForm.clientMobile}
                    onChange={(e) => setProjectForm({ ...projectForm, clientMobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor={projWebTypeId} className="block text-xs text-slate-400 mb-1">Website Type</label>
                  <select
                    id={projWebTypeId}
                    value={projectForm.websiteType}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, websiteType: e.target.value as WebsiteType })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  >
                    {WEBSITE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={projStatusId} className="block text-xs text-slate-400 mb-1">Initial Status</label>
                  <select
                    id={projStatusId}
                    value={projectForm.status}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, status: e.target.value as ProjectStatus })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Development">In Development</option>
                    <option value="Client Review">Client Review</option>
                    <option value="Testing & QA">Testing & QA</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={projLaunchDateId} className="block text-xs text-slate-400 mb-1">Target Launch Date</label>
                  <input
                    id={projLaunchDateId}
                    type="date"
                    value={projectForm.targetLaunchDate}
                    onChange={(e) => setProjectForm({ ...projectForm, targetLaunchDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={projLeadId} className="block text-xs text-slate-400 mb-1">Assigned Lead / Team</label>
                <input
                  id={projLeadId}
                  type="text"
                  value={projectForm.assignedLead}
                  onChange={(e) => setProjectForm({ ...projectForm, assignedLead: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={projStagingId} className="block text-xs text-slate-400 mb-1">Staging URL (Optional)</label>
                  <input
                    id={projStagingId}
                    type="url"
                    placeholder="https://staging.vibawebdev.com/client"
                    value={projectForm.stagingUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, stagingUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label htmlFor={projRepoId} className="block text-xs text-slate-400 mb-1">Repository URL (Optional)</label>
                  <input
                    id={projRepoId}
                    type="url"
                    placeholder="https://github.com/viba-webdev/..."
                    value={projectForm.repositoryUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, repositoryUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={projNotesId} className="block text-xs text-slate-400 mb-1">Internal Notes</label>
                <textarea
                  id={projNotesId}
                  rows={2}
                  value={projectForm.internalNotes}
                  onChange={(e) => setProjectForm({ ...projectForm, internalNotes: e.target.value })}
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
                  {isSavingProject ? "Creating Project..." : "Launch Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
