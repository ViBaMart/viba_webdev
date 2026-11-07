"use client";

import React, { useState, useEffect, useCallback, useId } from "react";
import Link from "next/link";
import { useCustomerAuth } from "@/lib/auth/customerAuthContext";
import { VbMonogram } from "@/components/common/VbMonogram";
import {
  CustomerDashboardData,
  UpdateCustomerProfileDTO,
} from "@/types/customerDashboard";
import { PROJECT_STAGES_LIST } from "@/types/customerProject";
import {
  User,
  Layers,
  FileText,
  DollarSign,
  Activity,
  FolderOpen,
  CheckCircle2,
  Lock,
  LogOut,
  Clock,
  ExternalLink,
  Download,
  AlertCircle,
  MessageSquare,
  Send,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Copy,
  Check,
  RefreshCw,
  Edit3,
  ShieldCheck,
  CreditCard,
  Building,
  Upload,
} from "lucide-react";

export default function CustomerDashboardClientView() {
  const {
    user,
    isLoading: isAuthLoading,
    error: authError,
    signIn,
    signUp,
    signOutCustomer,
    signInDemoUser,
    getToken,
    clearError,
  } = useCustomerAuth();

  // Active section tab
  const [activeTab, setActiveTab] = useState<
    | "profile"
    | "applications"
    | "quotations"
    | "payments"
    | "projects"
    | "progress"
    | "documents"
    | "delivery"
  >("applications");

  // Dashboard Data State
  const [data, setData] = useState<CustomerDashboardData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Auth Forms State (when not logged in)
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const [regFullName, setRegFullName] = useState("");
  const [regBusinessName, setRegBusinessName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regPass, setRegPass] = useState("");

  const [formSubmitting, setFormSubmitting] = useState(false);

  // Profile Edit Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<UpdateCustomerProfileDTO>({
    displayName: "",
    businessName: "",
    mobileNumber: "",
    businessAddress: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Payment Submission State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentQuotationId, setPaymentQuotationId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Bank Transfer" | "NEFT/RTGS" | "Card">("UPI");
  const [paymentUtr, setPaymentUtr] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Feedback State (Section 6: Project Progress)
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState<string | null>(null);

  // Delivery Approval State (Section 8: Final Website Delivery)
  const [deliveryRemarks, setDeliveryRemarks] = useState("");
  const [isApprovingDelivery, setIsApprovingDelivery] = useState(false);
  const [deliverySuccessMsg, setDeliverySuccessMsg] = useState<string | null>(null);

  // Quotation Action Message
  const [quotationActionMsg, setQuotationActionMsg] = useState<string | null>(null);
  const [isRespondingQuotation, setIsRespondingQuotation] = useState(false);

  const [copiedBankInfo, setCopiedBankInfo] = useState(false);

  // Form IDs for accessibility
  const loginEmailId = useId();
  const loginPassId = useId();

  // Load Dashboard Data Refresh Handler
  const loadDashboardData = useCallback(() => {
    if (!user) return;
    setIsLoadingData(true);
    setDataError(null);

    getToken()
      .then((token) => {
        return fetch("/api/customer/dashboard", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          cache: "no-store",
        });
      })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to load customer records.");
        }
        setData(json.data);
        if (json.data?.profile) {
          setProfileForm({
            displayName: json.data.profile.displayName || "",
            businessName: json.data.profile.businessName || "",
            mobileNumber: json.data.profile.mobileNumber || "",
            businessAddress: json.data.profile.businessAddress || "",
          });
        }
      })
      .catch((err) => {
        setDataError(err instanceof Error ? err.message : "Error querying customer records.");
      })
      .finally(() => {
        setIsLoadingData(false);
      });
  }, [user, getToken]);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;

    getToken().then((token) => {
      if (!isMounted) return;
      setIsLoadingData(true);
      setDataError(null);

      fetch("/api/customer/dashboard", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        cache: "no-store",
      })
        .then(async (res) => {
          if (!isMounted) return;
          const json = await res.json();
          if (isMounted && json.success) {
            setData(json.data);
            if (json.data?.profile) {
              setProfileForm({
                displayName: json.data.profile.displayName || "",
                businessName: json.data.profile.businessName || "",
                mobileNumber: json.data.profile.mobileNumber || "",
                businessAddress: json.data.profile.businessAddress || "",
              });
            }
          } else if (isMounted) {
            setDataError(json.error || "Failed to load customer records.");
          }
        })
        .catch((err) => {
          if (isMounted) setDataError(err instanceof Error ? err.message : "Error querying customer records.");
        })
        .finally(() => {
          if (isMounted) setIsLoadingData(false);
        });
    });

    return () => {
      isMounted = false;
    };
  }, [user, getToken]);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    clearError();
    try {
      await signIn(loginEmail, loginPass);
    } catch {
      // Auth error is captured in context
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    clearError();
    try {
      await signUp({
        email: regEmail,
        pass: regPass,
        fullName: regFullName,
        businessName: regBusinessName,
        mobileNumber: regMobile,
        businessAddress: regAddress,
      });
    } catch {
      // Auth error captured in context
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg(null);

    try {
      const token = await getToken();
      const res = await fetch("/api/customer/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(profileForm),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update profile.");
      }

      setProfileSuccessMsg("Profile information updated successfully.");
      setIsEditingProfile(false);
      loadDashboardData();
      setTimeout(() => setProfileSuccessMsg(null), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Quotation Response (Approve / Reject)
  const handleQuotationResponse = async (quotationId: string, action: "approve" | "reject") => {
    if (!confirm(`Are you sure you want to ${action} this quotation?`)) return;

    setIsRespondingQuotation(true);
    setQuotationActionMsg(null);

    try {
      const token = await getToken();
      const res = await fetch(`/api/customer/quotations/${quotationId}/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ action }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || `Failed to ${action} quotation.`);
      }

      setQuotationActionMsg(`Quotation ${action === "approve" ? "approved" : "declined"} successfully.`);
      loadDashboardData();
      setTimeout(() => setQuotationActionMsg(null), 4000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update quotation decision.");
    } finally {
      setIsRespondingQuotation(false);
    }
  };

  // Handle Submit Payment Transaction
  const handleSubmitPaymentTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentQuotationId || !paymentUtr.trim() || paymentAmount <= 0) return;

    setIsSubmittingPayment(true);
    setPaymentSuccessMsg(null);

    try {
      const token = await getToken();
      const res = await fetch("/api/customer/payments/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          quotationId: paymentQuotationId,
          amount: Number(paymentAmount),
          paymentMethod,
          transactionReference: paymentUtr.trim(),
          customerNotes: paymentNotes.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit transaction.");
      }

      setPaymentSuccessMsg("Payment transaction submitted! ViBa accounts team will verify shortly.");
      setShowPaymentModal(false);
      setPaymentUtr("");
      setPaymentNotes("");
      loadDashboardData();
      setTimeout(() => setPaymentSuccessMsg(null), 5000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error submitting payment transaction.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // Handle Submit Customer Feedback (Section 6: Project Progress)
  const handleSubmitFeedback = async (e: React.FormEvent, projectId: string) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    setIsSubmittingFeedback(true);
    setFeedbackSuccessMsg(null);

    try {
      const token = await getToken();
      const res = await fetch(`/api/customer/projects/${projectId}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          message: feedbackMessage.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit feedback.");
      }

      setFeedbackSuccessMsg("Feedback transmitted directly to the assigned lead engineers.");
      setFeedbackMessage("");
      loadDashboardData();
      setTimeout(() => setFeedbackSuccessMsg(null), 4000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error submitting feedback.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Handle Approve Final Delivery (Section 8)
  const handleApproveFinalDelivery = async (projectId: string) => {
    if (!confirm("Confirm formal approval and signoff for final website delivery?")) return;

    setIsApprovingDelivery(true);
    setDeliverySuccessMsg(null);

    try {
      const token = await getToken();
      const res = await fetch(`/api/customer/projects/${projectId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          remarks: deliveryRemarks.trim() || "Approved final website delivery with satisfaction.",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to approve delivery.");
      }

      setDeliverySuccessMsg("Final delivery formally approved! Congratulations on your new website platform.");
      loadDashboardData();
      setTimeout(() => setDeliverySuccessMsg(null), 6000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error approving final delivery.");
    } finally {
      setIsApprovingDelivery(false);
    }
  };

  // Copy Bank Details Helper
  const copyBankDetails = () => {
    const details = `ViBa Web Development Solutions\nBank: ICICI Bank\nAccount: 001205012345\nIFSC: ICIC0000012\nUPI: vibawebdev@icici`;
    navigator.clipboard.writeText(details);
    setCopiedBankInfo(true);
    setTimeout(() => setCopiedBankInfo(false), 2500);
  };

  // =========================================================================
  // RENDER: Loading Auth State
  // =========================================================================
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-mono text-sm">Verifying secure customer session...</p>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Customer Login & Registration Portal (When unauthenticated)
  // =========================================================================
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-md">
          {/* Logo & Headline */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <VbMonogram size={56} />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">ViBa Customer Portal</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Secure client dashboard for website applications, quotations, payments, and development tracking
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl mb-6 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                clearError();
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition ${
                authMode === "login"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                clearError();
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition ${
                authMode === "register"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Create Account
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {authMode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor={loginEmailId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id={loginEmailId}
                    type="email"
                    required
                    placeholder="you@yourbusiness.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={loginPassId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id={loginPassId}
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-xs sm:text-sm font-bold hover:from-cyan-300 hover:to-sky-300 transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {formSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In to Dashboard</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {authMode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Health Clinic"
                  value={regBusinessName}
                  onChange={(e) => setRegBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Business Address (Optional)
                </label>
                <input
                  type="text"
                  placeholder="City, State, Country"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-xs sm:text-sm font-bold hover:from-cyan-300 hover:to-sky-300 transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {formSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    <span>Create Customer Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Access (For Testing & Local Development) */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500 block mb-2 font-mono">
              Development & Quick Access Testing
            </span>
            <button
              type="button"
              onClick={() => signInDemoUser()}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium border border-cyan-500/20 transition inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Instant Test Client Login (Apex Fitness)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Authenticated Customer Dashboard
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <VbMonogram size={36} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-white">ViBa Customer Portal</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Client Account
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {data?.profile?.businessName || user.displayName} • {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => loadDashboardData()}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingData ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={signOutCustomer}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-300 hover:text-rose-400 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome & Stats Hero */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                Authorized Client Portal
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Welcome back, {data?.profile?.displayName || user.displayName}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Track your web development milestones, inspect financial breakdowns, review progress updates, and download official deliverables.
            </p>
          </div>

          {/* Quick Metrics */}
          {data?.stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Applications</span>
                <span className="text-lg font-bold text-white font-mono">{data.stats.totalApplications}</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-cyan-500/20 text-center">
                <span className="text-[10px] text-cyan-400 uppercase block font-semibold">Approved Scope</span>
                <span className="text-lg font-bold text-cyan-300 font-mono">{data.stats.approvedQuotations}</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-emerald-500/20 text-center">
                <span className="text-[10px] text-emerald-400 uppercase block font-semibold">Amount Paid</span>
                <span className="text-lg font-bold text-emerald-300 font-mono">
                  ₹{data.stats.totalPaidAmount.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-amber-500/20 text-center">
                <span className="text-[10px] text-amber-400 uppercase block font-semibold">Active Track</span>
                <span className="text-lg font-bold text-amber-300 font-mono">{data.stats.activeProjects}</span>
              </div>
            </div>
          )}
        </div>

        {/* Global Notifications */}
        {profileSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{profileSuccessMsg}</span>
          </div>
        )}
        {paymentSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{paymentSuccessMsg}</span>
          </div>
        )}
        {feedbackSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedbackSuccessMsg}</span>
          </div>
        )}
        {deliverySuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{deliverySuccessMsg}</span>
          </div>
        )}
        {quotationActionMsg && (
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{quotationActionMsg}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DASHBOARD NAVIGATION TABS (The 8 Exact Sections)                          */}
        {/* ========================================================================= */}
        <nav className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium transition shrink-0 ${
              activeTab === "profile"
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. My Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium transition shrink-0 ${
              activeTab === "applications"
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. My Applications</span>
            {data?.applications && data.applications.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {data.applications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("quotations")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium transition shrink-0 ${
              activeTab === "quotations"
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>3. My Quotations</span>
            {data?.quotations && data.quotations.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {data.quotations.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium transition shrink-0 ${
              activeTab === "payments"
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>4. My Payments</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium transition shrink-0 ${
              activeTab === "projects"
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5. My Projects</span>
            {data?.projects && data.projects.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {data.projects.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("progress")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium transition shrink-0 ${
              activeTab === "progress"
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>6. Project Progress</span>
          </button>

          <button
            onClick={() => setActiveTab("documents")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium transition shrink-0 ${
              activeTab === "documents"
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>7. My Documents</span>
            {data?.documents && data.documents.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {data.documents.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("delivery")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-medium transition shrink-0 ${
              activeTab === "delivery"
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>8. Final Website Delivery</span>
          </button>
        </nav>

        {/* Loading Indicator */}
        {isLoadingData && (
          <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-3xl text-center">
            <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-2" />
            <p className="text-slate-400 text-xs font-mono">Synchronizing customer records from Firestore...</p>
          </div>
        )}

        {dataError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{dataError}</span>
            </div>
            <button
              onClick={loadDashboardData}
              className="px-3 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 1: MY PROFILE                                                     */}
        {/* ========================================================================= */}
        {activeTab === "profile" && data?.profile && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">1. Customer Profile Details</h3>
                <p className="text-xs text-slate-400">
                  Manage your business profile, contact details, and account credentials
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingProfile ? "Cancel Editing" : "Edit Profile"}</span>
              </button>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.displayName}
                      onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.businessName}
                      onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.mobileNumber}
                      onChange={(e) => setProfileForm({ ...profileForm, mobileNumber: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Business Address
                    </label>
                    <input
                      type="text"
                      value={profileForm.businessAddress}
                      onChange={(e) => setProfileForm({ ...profileForm, businessAddress: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 disabled:opacity-50"
                  >
                    {isSavingProfile ? "Saving Changes..." : "Save Profile"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-lg">
                      {data.profile.displayName?.charAt(0) || "C"}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{data.profile.displayName}</h4>
                      <p className="text-xs text-slate-400">{data.profile.businessName}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-slate-400">Email:</span>
                      <span className="font-mono text-white">{data.profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-slate-400">Phone:</span>
                      <span className="font-mono text-white">{data.profile.mobileNumber || "Not specified"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-slate-400">Address:</span>
                      <span className="text-white">{data.profile.businessAddress || "Not specified"}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3 text-xs">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider text-[11px] text-cyan-400">
                    Authentication & Security
                  </h4>
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">User ID (UID)</span>
                    <span className="font-mono text-slate-300 text-xs break-all">{data.profile.uid}</span>
                  </div>
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Security Provider</span>
                    <span className="text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Firebase Authentication with Rule Isolation
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Account Registered</span>
                    <span className="font-mono text-slate-300 text-xs">
                      {new Date(data.profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: MY APPLICATIONS                                                */}
        {/* ========================================================================= */}
        {activeTab === "applications" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">2. My Website Applications</h3>
                <p className="text-xs text-slate-400">
                  Track the submission review and quotation preparation status of your website requests
                </p>
              </div>
              <Link
                href="/apply"
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-xs font-bold hover:from-cyan-300 hover:to-sky-300 transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <span>Apply for Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {!data?.applications || data.applications.length === 0 ? (
              <div className="p-10 bg-slate-900/60 border border-slate-800 rounded-3xl text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-300">No applications on file yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Submit a website application for ViBa WebDevloper to receive an official proposal and package quotation.
                </p>
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition"
                >
                  Start New Application
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl hover:border-slate-700 transition space-y-3 shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-xs font-bold text-cyan-400">{app.id}</span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {app.websiteType}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">{app.businessName}</h4>
                        <p className="text-xs text-slate-400">{app.customerName} • {app.mobileNumber}</p>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        {app.status}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Selected Package:</span>
                        <span className="font-semibold text-white">{app.selectedPackage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Required Pages:</span>
                        <span className="text-slate-300">{app.requiredPages || "Standard Business Pages"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Domain Requirement:</span>
                        <span className="text-slate-300">{app.domainRequirement || "Provided by ViBa"}</span>
                      </div>
                    </div>

                    {app.businessDescription && (
                      <p className="text-xs text-slate-400 line-clamp-2 italic">
                        &ldquo;{app.businessDescription}&rdquo;
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-slate-500 text-[11px]">
                      <span>Submitted: {new Date(app.createdAt).toLocaleDateString()}</span>
                      <span className="text-cyan-400 font-medium">ViBa Engineering Review</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: MY QUOTATIONS                                                  */}
        {/* ========================================================================= */}
        {activeTab === "quotations" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">3. My Official Quotations</h3>
              <p className="text-xs text-slate-400">
                Inspect itemized development & annual service charges, approve proposals, and export official PDF documents
              </p>
            </div>

            {!data?.quotations || data.quotations.length === 0 ? (
              <div className="p-10 bg-slate-900/60 border border-slate-800 rounded-3xl text-center space-y-3">
                <DollarSign className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-300">No quotations prepared yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Once the ViBa engineering team reviews your application requirements, your tailored quotation will be published here for your review and approval.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.quotations.map((quote) => {
                  const curr = quote.currency === "INR" ? "₹" : "$";
                  const isApproved = quote.status === "Approved";
                  const isRejected = quote.status === "Rejected";

                  return (
                    <div
                      key={quote.id}
                      className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-5 shadow-xl"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-xs font-bold text-cyan-400">{quote.id}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {quote.websiteType}
                            </span>
                            <span
                              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                                isApproved
                                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                  : isRejected
                                  ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                                  : "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                              }`}
                            >
                              {quote.status}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-white">{quote.businessName || quote.customerName}</h4>
                          <p className="text-xs text-slate-400">
                            Valid until: {new Date(quote.validUntil).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/quotations/${quote.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Full View & PDF</span>
                          </Link>
                        </div>
                      </div>

                      {/* 4 Charge Categories Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-0.5">
                            1. Selected Package
                          </span>
                          <span className="font-semibold text-white block">{quote.selectedPackage?.name}</span>
                          <span className="font-mono text-cyan-400 font-bold">
                            {curr}{quote.breakdown?.packagePrice?.toLocaleString()}
                          </span>
                        </div>

                        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-0.5">
                            2. Development Charges
                          </span>
                          <span className="text-slate-300 block truncate">{quote.developmentCharges?.description}</span>
                          <span className="font-mono text-cyan-400 font-bold">
                            {curr}{quote.breakdown?.developmentCharges?.toLocaleString()}
                          </span>
                        </div>

                        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-0.5">
                            3. Annual Service
                          </span>
                          <span className="text-slate-300 block truncate">{quote.annualServiceCharges?.description}</span>
                          <span className="font-mono text-cyan-400 font-bold">
                            {curr}{quote.breakdown?.annualServiceCharges?.toLocaleString()}
                          </span>
                        </div>

                        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-0.5">
                            4. Custom Add-ons
                          </span>
                          <span className="text-slate-300 block">
                            {quote.additionalCharges?.length || 0} approved add-on(s)
                          </span>
                          <span className="font-mono text-cyan-400 font-bold">
                            {curr}{quote.breakdown?.additionalCharges?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Financial Bottomline */}
                      <div className="p-4 bg-slate-950/90 rounded-2xl border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-6 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase block">Total Agreed Cost</span>
                            <span className="text-base sm:text-lg font-bold text-white font-mono">
                              {curr}{quote.breakdown?.totalAmount?.toLocaleString()}
                            </span>
                          </div>
                          <div className="pl-4 border-l border-slate-800">
                            <span className="text-[10px] text-teal-400 uppercase block font-semibold">Advance Required</span>
                            <span className="text-base sm:text-lg font-bold text-teal-300 font-mono">
                              {curr}{quote.breakdown?.advancePayment?.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Approval Actions */}
                        {!isApproved && !isRejected && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={isRespondingQuotation}
                              onClick={() => handleQuotationResponse(quote.id, "reject")}
                              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold transition"
                            >
                              Decline
                            </button>
                            <button
                              type="button"
                              disabled={isRespondingQuotation}
                              onClick={() => handleQuotationResponse(quote.id, "approve")}
                              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-bold hover:from-emerald-400 hover:to-teal-300 transition shadow-lg shadow-emerald-500/20"
                            >
                              Approve Quotation
                            </button>
                          </div>
                        )}

                        {isApproved && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" />
                              Approved by You
                            </span>
                            <button
                              onClick={() => {
                                setPaymentQuotationId(quote.id);
                                setPaymentAmount(quote.breakdown?.advancePayment || 0);
                                setShowPaymentModal(true);
                              }}
                              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-500/20"
                            >
                              Submit Payment Proof
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: MY PAYMENTS                                                    */}
        {/* ========================================================================= */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">4. Payment & Reconciled Balances</h3>
                <p className="text-xs text-slate-400">
                  Track advance deposits, bank reconciliation, transaction receipts, and pending balances
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (data?.quotations && data.quotations.length > 0) {
                    setPaymentQuotationId(data.quotations[0].id);
                    setPaymentAmount(data.quotations[0].breakdown?.advancePayment || 0);
                  }
                  setShowPaymentModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 text-xs font-bold hover:from-cyan-300 hover:to-sky-300 transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Submit Payment Receipt</span>
              </button>
            </div>

            {/* Official Bank Details Banner */}
            <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" />
                  Official ViBa Payment Accounts
                </span>
                <p className="font-semibold text-white">
                  ICICI Bank • Current Account: <span className="font-mono text-cyan-300">001205012345</span> • IFSC: <span className="font-mono text-cyan-300">ICIC0000012</span>
                </p>
                <p className="text-slate-400">
                  UPI ID: <span className="font-mono text-emerald-400 font-bold">vibawebdev@icici</span> (Instant 24x7 Reconciliation)
                </p>
              </div>
              <button
                type="button"
                onClick={copyBankDetails}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition shrink-0 flex items-center gap-1.5"
              >
                {copiedBankInfo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBankInfo ? "Copied to Clipboard!" : "Copy Account Details"}</span>
              </button>
            </div>

            {!data?.payments || data.payments.length === 0 ? (
              <div className="p-10 bg-slate-900/60 border border-slate-800 rounded-3xl text-center space-y-3">
                <CreditCard className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-300">No payment accounts active yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Approve an official quotation to generate your project payment ledger and submit mobilization advance.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.payments.map((pay) => {
                  const curr = pay.currency === "INR" ? "₹" : "$";
                  return (
                    <div
                      key={pay.id}
                      className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-4 shadow-xl"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-cyan-400">{pay.id}</span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Quotation: {pay.quotationId}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-white">{pay.businessName || pay.customerName}</h4>
                        </div>

                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          {pay.status}
                        </span>
                      </div>

                      {/* Figures */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                          <span className="text-slate-500 text-[10px] uppercase block">Total Agreed</span>
                          <span className="text-sm font-bold text-white font-mono">
                            {curr}{pay.totalAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-950/80 rounded-xl border border-teal-500/20">
                          <span className="text-teal-400 text-[10px] uppercase block">Advance Required</span>
                          <span className="text-sm font-bold text-teal-300 font-mono">
                            {curr}{pay.advanceRequired.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-500/20">
                          <span className="text-emerald-400 text-[10px] uppercase block">Amount Paid</span>
                          <span className="text-sm font-bold text-emerald-300 font-mono">
                            {curr}{pay.amountPaid.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                          <span className="text-slate-500 text-[10px] uppercase block">Remaining Balance</span>
                          <span className="text-sm font-bold text-slate-200 font-mono">
                            {curr}{pay.remainingAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Transactions History */}
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                          Your Submitted Transactions (UTR / Bank Proofs)
                        </span>
                        {pay.transactions && pay.transactions.length > 0 ? (
                          <div className="space-y-2">
                            {pay.transactions.map((txn) => (
                              <div
                                key={txn.id}
                                className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-white">{txn.id}</span>
                                    <span className="text-slate-400">• {txn.paymentMethod}</span>
                                    <span className="text-slate-400">• {txn.transactionDate}</span>
                                  </div>
                                  <p className="font-mono text-cyan-300 text-[11px]">
                                    UTR / Ref: <strong className="text-white">{txn.transactionReference}</strong>
                                  </p>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-sm font-bold text-emerald-400">
                                    {curr}{txn.amount.toLocaleString()}
                                  </span>
                                  {txn.verifiedByAdmin ? (
                                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" /> Reconciled
                                    </span>
                                  ) : (
                                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                      Pending Verification
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic p-3 bg-slate-950/60 rounded-xl text-center">
                            No payment transactions submitted yet.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 5: MY PROJECTS                                                    */}
        {/* ========================================================================= */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">5. My Client Projects</h3>
              <p className="text-xs text-slate-400">
                Active web development projects initialized after quotation signoff and mobilization deposit
              </p>
            </div>

            {!data?.projects || data.projects.length === 0 ? (
              <div className="p-10 bg-slate-900/60 border border-slate-800 rounded-3xl text-center space-y-3">
                <Layers className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-300">No active customer projects yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Once your quotation is approved and advance payment is confirmed by our accounts team, your dedicated engineering project will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl hover:border-slate-700 transition space-y-4 shadow-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-xs font-bold text-cyan-400">{proj.id}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {proj.websiteType}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white">{proj.projectName}</h4>
                        <p className="text-xs text-slate-400">{proj.clientBusiness}</p>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        {proj.currentStage}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Development Completion</span>
                        <span className="font-mono text-cyan-400 font-semibold">{proj.stageProgressPercent}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${proj.stageProgressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Expected Delivery:</span>
                        <span className="font-mono text-white font-semibold">
                          {proj.expectedDeliveryDate ? new Date(proj.expectedDeliveryDate).toLocaleDateString() : "TBD"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Lead Engineer:</span>
                        <span className="text-slate-200">{proj.assignedLead || "ViBa Lead Engineer"}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setActiveTab("progress");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold transition"
                      >
                        Inspect 6 Stages & Timeline
                      </button>

                      <Link
                        href={`/projects/${proj.id}?token=${proj.accessToken}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1"
                      >
                        <span>External Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 6: PROJECT PROGRESS                                               */}
        {/* ========================================================================= */}
        {activeTab === "progress" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">6. Interactive Project Progress (6 Stages)</h3>
              <p className="text-xs text-slate-400">
                Track each milestone from Requirement Analysis to Final Delivery, inspect engineering notes, and communicate revisions
              </p>
            </div>

            {!data?.projects || data.projects.length === 0 ? (
              <div className="p-10 bg-slate-900/60 border border-slate-800 rounded-3xl text-center space-y-3">
                <Activity className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-300">No project tracking active</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Your project milestones and progress notes will appear here once an authorized project is started.
                </p>
              </div>
            ) : (
              data.projects.map((proj) => {
                const currentStageIdx = PROJECT_STAGES_LIST.indexOf(proj.currentStage);

                return (
                  <div
                    key={proj.id}
                    className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6 shadow-xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <span className="font-mono text-xs text-cyan-400 font-bold block mb-1">{proj.id}</span>
                        <h4 className="text-lg font-bold text-white">{proj.projectName}</h4>
                        <p className="text-xs text-slate-400">
                          Target Launch: {proj.expectedDeliveryDate ? new Date(proj.expectedDeliveryDate).toLocaleDateString() : "TBD"}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                          Current Stage
                        </span>
                        <span className="text-sm font-bold text-cyan-300">{proj.currentStage}</span>
                      </div>
                    </div>

                    {/* Visual 6 Stages Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                      {PROJECT_STAGES_LIST.map((stage, idx) => {
                        const isPast = idx < currentStageIdx;
                        const isCurrent = idx === currentStageIdx;

                        return (
                          <div
                            key={stage}
                            className={`p-3 rounded-2xl border transition flex flex-col justify-between ${
                              isCurrent
                                ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-500/10"
                                : isPast
                                ? "bg-slate-950/60 border-emerald-500/30 text-slate-300"
                                : "bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-60"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono font-bold">Stage {idx + 1}</span>
                              {isPast ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : isCurrent ? (
                                <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                              )}
                            </div>
                            <span className="text-xs font-semibold leading-tight">{stage}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Engineering Timeline Notes */}
                    <div>
                      <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Engineering Timeline & Progress Notes ({proj.progressNotes?.length || 0})</span>
                      </h5>

                      {proj.progressNotes && proj.progressNotes.length > 0 ? (
                        <div className="space-y-2.5">
                          {proj.progressNotes.map((note) => (
                            <div
                              key={note.id}
                              className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-xs space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                                <span className="font-semibold text-cyan-300">{note.stage}</span>
                                <span className="font-mono text-slate-500">
                                  {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="font-bold text-white text-sm">{note.title}</p>
                              <p className="text-slate-300 whitespace-pre-line leading-relaxed">{note.content}</p>
                              <span className="text-[10px] text-slate-500 block pt-1">
                                Author: {note.authorEmail}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic p-4 bg-slate-950/60 rounded-xl text-center">
                          No progress notes posted yet.
                        </p>
                      )}
                    </div>

                    {/* Submit Client Feedback Form */}
                    <form
                      onSubmit={(e) => handleSubmitFeedback(e, proj.id)}
                      className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3"
                    >
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        <span>Submit Revisions / Direct Feedback to Engineering Team</span>
                      </h5>
                      <textarea
                        required
                        rows={3}
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        placeholder="Write questions, feedback, or revision requests regarding the current stage..."
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmittingFeedback}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isSubmittingFeedback ? "Sending..." : "Submit Feedback"}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 7: MY DOCUMENTS                                                   */}
        {/* ========================================================================= */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">7. Approved Documents & Deliverables</h3>
              <p className="text-xs text-slate-400">
                Download approved project specifications, official quotations, UI mockups, and client deliverables
              </p>
            </div>

            {!data?.documents || data.documents.length === 0 ? (
              <div className="p-10 bg-slate-900/60 border border-slate-800 rounded-3xl text-center space-y-3">
                <FolderOpen className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-300">No documents in vault</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Official quotations, design assets, and shared deliverables will be archived here for instant download.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {data.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl hover:border-slate-700 transition flex flex-col justify-between gap-3 shadow-lg"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold inline-block">
                        {doc.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2">{doc.title}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Archived: {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold transition flex items-center justify-center gap-1.5 border border-slate-700"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download / View Document</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 8: FINAL WEBSITE DELIVERY                                         */}
        {/* ========================================================================= */}
        {activeTab === "delivery" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">8. Final Website Delivery & Signoff</h3>
              <p className="text-xs text-slate-400">
                Inspect production deployment, verify domain SSL, approve final signoff, and access post-launch warranty
              </p>
            </div>

            {!data?.projects || data.projects.length === 0 ? (
              <div className="p-10 bg-slate-900/60 border border-slate-800 rounded-3xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-300">No project in delivery stage yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  When your website reaches Stage 6 (Final Delivery), production links and formal approval signoff will activate here.
                </p>
              </div>
            ) : (
              data.projects.map((proj) => {
                const isReadyForDelivery = proj.currentStage === "Final Delivery" || proj.stageProgressPercent >= 83;
                const isApproved = proj.isDeliveryApproved;

                return (
                  <div
                    key={proj.id}
                    className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6 shadow-xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <span className="font-mono text-xs text-cyan-400 font-bold block mb-1">{proj.id}</span>
                        <h4 className="text-lg font-bold text-white">{proj.projectName}</h4>
                        <p className="text-xs text-slate-400">{proj.websiteType} • {proj.clientBusiness}</p>
                      </div>

                      {isApproved ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Delivery Approved
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {isReadyForDelivery ? "Ready for Client Signoff" : "In Development"}
                        </span>
                      )}
                    </div>

                    {/* Environments & Staging URLs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase block font-semibold">Staging Demo URL</span>
                        {proj.stagingUrl ? (
                          <a
                            href={proj.stagingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-cyan-400 hover:underline flex items-center gap-1 break-all"
                          >
                            <span>{proj.stagingUrl}</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">Configured during review stage</span>
                        )}
                      </div>

                      <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase block font-semibold">Live Production URL</span>
                        {proj.liveUrl ? (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-emerald-400 hover:underline flex items-center gap-1 break-all"
                          >
                            <span>{proj.liveUrl}</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">Deployed upon final delivery</span>
                        )}
                      </div>
                    </div>

                    {/* Formal Delivery Signoff Section */}
                    {isApproved ? (
                      <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Final Website Delivery Signed Off</span>
                        </div>
                        <p className="text-slate-300">
                          Signoff Remarks: &ldquo;{proj.deliveryApprovalNotes || "Approved final website delivery."}&rdquo;
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Signed on: {proj.deliveryApprovedAt ? new Date(proj.deliveryApprovedAt).toLocaleString() : "Confirmed"}
                        </p>
                      </div>
                    ) : isReadyForDelivery ? (
                      <div className="p-5 bg-cyan-950/30 border border-cyan-500/30 rounded-2xl space-y-3 text-xs">
                        <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                          <span>Formal Client Signoff & Production Handover</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          Your website has completed quality assurance and testing. Please inspect your staging build. When satisfied, provide your signoff below to authorize live production handover.
                        </p>
                        <textarea
                          rows={2}
                          value={deliveryRemarks}
                          onChange={(e) => setDeliveryRemarks(e.target.value)}
                          placeholder="Add any signoff remarks or confirmation notes..."
                          className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                        />
                        <button
                          type="button"
                          disabled={isApprovingDelivery}
                          onClick={() => handleApproveFinalDelivery(proj.id)}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-300 transition shadow-lg shadow-emerald-500/25 flex items-center gap-2 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isApprovingDelivery ? "Submitting Signoff..." : "Approve Final Delivery"}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>Final delivery signoff will unlock once your project reaches the Final Delivery stage.</span>
                      </div>
                    )}

                    {/* Warranty & Post Launch Support */}
                    <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs space-y-2">
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                        ViBa 30-Day Bug Warranty & Annual Maintenance
                      </span>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        All ViBa WebDevloper deliveries include a 30-day comprehensive bug warranty covering responsive layout fixes, security headers, form intake, and SSL certificates. Ongoing support is handled via your annual maintenance agreement.
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL: SUBMIT PAYMENT RECEIPT (UTR)                                       */}
      {/* ========================================================================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Submit Payment Receipt</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Record your bank transfer or UPI transaction for account reconciliation
                </p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPaymentTransaction} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Associated Quotation
                </label>
                <select
                  required
                  value={paymentQuotationId}
                  onChange={(e) => setPaymentQuotationId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  {data?.quotations?.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.id} ({q.businessName || q.customerName} - ₹{q.breakdown?.totalAmount?.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Amount Paid (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as "UPI" | "Bank Transfer" | "NEFT/RTGS" | "Card")
                    }
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="UPI">UPI Transfer</option>
                    <option value="Bank Transfer">Bank Transfer (IMPS)</option>
                    <option value="NEFT/RTGS">NEFT / RTGS</option>
                    <option value="Card">Debit / Credit Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  UTR / Transaction Reference Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 412389182938"
                  value={paymentUtr}
                  onChange={(e) => setPaymentUtr(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[11px]">
                  Remarks / Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Advance 50% mobilization deposit from HDFC Bank"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isSubmittingPayment ? "Recording..." : "Submit for Verification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
