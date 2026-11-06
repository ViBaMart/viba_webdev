"use client";

import React, { useState, useEffect, useId } from "react";
import Link from "next/link";
import { VbMonogram } from "@/components/common/VbMonogram";
import {
  CustomerProjectRecord,
  ProjectStage,
  PROJECT_STAGES_LIST,
  ProjectProgressNote,
  ProjectSharedFile,
  CustomerFeedbackItem,
} from "@/types/customerProject";
import {
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Layers,
  ArrowLeft,
  Calendar,
  Send,
  AlertCircle,
  FileText,
  Lock,
  MessageSquare,
  Sparkles,
  RefreshCw,
  X,
  FileCheck,
} from "lucide-react";

interface ProjectTrackingClientViewProps {
  projectId: string;
}

function getStageIndex(stage: ProjectStage): number {
  return PROJECT_STAGES_LIST.indexOf(stage);
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function ProjectTrackingClientView({ projectId }: ProjectTrackingClientViewProps) {
  const [project, setProject] = useState<CustomerProjectRecord | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "customer">("customer");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Authentication & Access Control state
  const [authEmailInput, setAuthEmailInput] = useState("");
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  // Customer Feedback Submission Form
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackStage, setFeedbackStage] = useState<ProjectStage>("Development");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackNotification, setFeedbackNotification] = useState<{ text: string; error?: boolean } | null>(null);

  // Final Delivery Approval Modal
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [approvalNotification, setApprovalNotification] = useState<{ text: string; error?: boolean } | null>(null);

  const authEmailInputId = useId();

  // Load project details
  useEffect(() => {
    let isMounted = true;

    async function fetchProjectData() {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        setAccessDenied(false);

        // Check if token exists in URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token") || "";
        const email = urlParams.get("email") || "";

        const queryStr = new URLSearchParams();
        if (token) queryStr.set("token", token);
        if (email) queryStr.set("email", email);

        const res = await fetch(`/api/projects/${projectId}?${queryStr.toString()}`, {
          cache: "no-store",
        });

        if (!isMounted) return;

        if (res.status === 403) {
          setAccessDenied(true);
          return;
        }

        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? `Customer project "${projectId}" was not found.`
              : "Failed to load project details."
          );
        }

        const json = await res.json();
        if (json.success && isMounted) {
          setProject(json.data);
          setUserRole(json.role || "customer");
          setFeedbackStage(json.data.currentStage);
        } else {
          throw new Error(json.error || "Failed to load project data.");
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err instanceof Error ? err.message : "Error loading project.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchProjectData();
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  // Handle email verification if customer arrived without direct token
  const handleVerifyEmailAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingEmail(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/projects/${projectId}?email=${encodeURIComponent(authEmailInput.trim())}`, {
        cache: "no-store",
      });

      if (res.status === 403 || res.status === 401) {
        throw new Error("This email does not match the project client record.");
      }

      if (!res.ok) {
        throw new Error("Could not verify email access.");
      }

      const json = await res.json();
      if (json.success) {
        setProject(json.data);
        setUserRole(json.role || "customer");
        setAccessDenied(false);
        setFeedbackStage(json.data.currentStage);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Authorization failed.");
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  // Submit Customer Feedback
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    setFeedbackNotification(null);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token") || project?.accessToken || "";

      const res = await fetch(`/api/projects/${projectId}/feedback?token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: feedbackStage,
          message: feedbackMessage,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit feedback.");
      }

      setProject(json.data);
      setShowFeedbackModal(false);
      setFeedbackMessage("");
      setFeedbackNotification({
        text: "Thank you! Your feedback has been forwarded directly to the engineering team.",
      });
      setTimeout(() => setFeedbackNotification(null), 5000);
    } catch (err) {
      setFeedbackNotification({
        text: err instanceof Error ? err.message : "Error submitting feedback.",
        error: true,
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Submit Final Delivery Approval Signoff
  const handleApproveFinalDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingApproval(true);
    setApprovalNotification(null);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token") || project?.accessToken || "";

      const res = await fetch(`/api/projects/${projectId}/approve?token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvalNotes,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to approve final delivery.");
      }

      setProject(json.data);
      setShowApprovalModal(false);
      setApprovalNotification({
        text: "Congratulations! Final project delivery has been formally approved and signed off.",
      });
    } catch (err) {
      setApprovalNotification({
        text: err instanceof Error ? err.message : "Error approving delivery.",
        error: true,
      });
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-mono text-sm">Loading project progress tracker...</p>
      </div>
    );
  }

  // Access Denied Screen (Customer Restriction Enforcement)
  if (accessDenied && !project) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Client Access Verification</h2>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            Project records are strictly restricted to the authorized client. Please enter the email address used during your application.
          </p>

          <form onSubmit={handleVerifyEmailAccess} className="mt-6 space-y-3 text-left">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label htmlFor={authEmailInputId} className="block text-xs font-semibold text-slate-300 mb-1">
                Client Email Address
              </label>
              <input
                id={authEmailInputId}
                type="email"
                required
                value={authEmailInput}
                onChange={(e) => setAuthEmailInput(e.target.value)}
                placeholder="client@yourbusiness.com"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifyingEmail}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isVerifyingEmail ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>Verify Project Access</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80">
            <Link href="/" className="text-xs text-cyan-400 hover:underline">
              Return to ViBa WebDevloper Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !project) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 text-center">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Project Not Found</h2>
          <p className="text-slate-400 text-xs mt-1">{errorMessage || "Invalid Project ID."}</p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStageIndex = getStageIndex(project.currentStage);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Banner Navigation */}
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ViBa WebDevloper</span>
        </Link>

        <div className="flex items-center gap-2">
          {userRole === "admin" && (
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-medium">
              Admin View
            </span>
          )}
          <span className="text-xs font-mono text-slate-400">Ref: {project.id}</span>
        </div>
      </div>

      {/* Main Project Dashboard Container */}
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Project Header Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <VbMonogram size={48} className="shrink-0" />
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold">{project.id}</span>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">{project.projectName}</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Client: <strong className="text-slate-200">{project.clientBusiness || project.clientName}</strong> • {project.websiteType}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Current Stage:</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  {project.currentStage}
                </span>
              </div>
              <p className="text-slate-400 flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Target Delivery: <strong className="text-slate-200">{project.expectedDeliveryDate}</strong></span>
              </p>
            </div>
          </div>

          {/* Quick Environment Links */}
          {(project.stagingUrl || project.liveUrl) && (
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs">
              <span className="text-slate-400 font-semibold">Active Environments:</span>
              {project.stagingUrl && (
                <a
                  href={project.stagingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 hover:bg-cyan-900/60 transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Staging Preview</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/60 transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Production Live Site</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        {approvalNotification && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{approvalNotification.text}</span>
          </div>
        )}
        {feedbackNotification && (
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{feedbackNotification.text}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* 1. VISUAL 6-STAGE PROGRESS STEPPER                        */}
        {/* ========================================================= */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Project Progress Roadmap</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                The 6 milestone stages of your ViBa engineering lifecycle
              </p>
            </div>
            <span className="font-mono text-sm font-bold text-cyan-400">
              {project.stageProgressPercent}% Completed
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${project.stageProgressPercent}%` }}
            />
          </div>

          {/* 6 Stage Icons / Stepper Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PROJECT_STAGES_LIST.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div
                  key={stage}
                  className={`p-3.5 rounded-2xl border transition flex flex-col justify-between ${
                    isCurrent
                      ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/10"
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
                      <span className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                  </div>

                  <p className="font-bold text-xs leading-tight text-white">{stage}</p>

                  <span className="text-[10px] font-mono mt-2 block">
                    {isPast ? "Completed" : isCurrent ? "Active Phase" : "Upcoming"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. PROGRESS UPDATES TIMELINE & NOTES                      */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Progress Updates & Timeline</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Official progress log published by your engineering lead
                  </p>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {project.progressNotes?.length || 0} Updates
                </span>
              </div>

              {project.progressNotes && project.progressNotes.length > 0 ? (
                <div className="space-y-4">
                  {project.progressNotes.map((note: ProjectProgressNote) => (
                    <div
                      key={note.id}
                      className="p-4 bg-slate-950/70 border border-slate-800/90 rounded-2xl space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 text-[10px] font-semibold">
                          {note.stage}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {new Date(note.createdAt).toLocaleDateString()} at{" "}
                          {new Date(note.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{note.title}</h4>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-line">{note.content}</p>

                      <div className="pt-2 border-t border-slate-900 flex justify-between text-[11px] text-slate-500">
                        <span>Lead: {note.authorEmail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic text-center py-6">
                  No progress updates logged yet.
                </p>
              )}
            </div>

            {/* Customer Feedback History */}
            {project.customerFeedback && project.customerFeedback.length > 0 && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal-400" />
                  <span>Your Submitted Feedback</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {project.customerFeedback.map((fb: CustomerFeedbackItem) => (
                    <div
                      key={fb.id}
                      className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1"
                    >
                      <div className="flex justify-between text-slate-400 text-[10px]">
                        <span>Stage: {fb.stage}</span>
                        <span>{new Date(fb.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-200">{fb.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* 3. SHARED FILES & CUSTOMER ACTIONS (RIGHT COLUMN)         */}
          {/* ========================================================= */}
          <div className="space-y-6">
            {/* Shared Files Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Shared Project Files</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  {project.sharedFiles?.length || 0} Files
                </span>
              </div>

              {project.sharedFiles && project.sharedFiles.length > 0 ? (
                <div className="space-y-2.5">
                  {project.sharedFiles.map((file: ProjectSharedFile) => (
                    <div
                      key={file.id}
                      className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                        <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div className="truncate">
                          <p className="font-semibold text-white truncate">{file.originalName || file.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {formatBytes(file.size)} • {file.category}
                          </p>
                        </div>
                      </div>

                      <a
                        href={file.url}
                        download={file.originalName || file.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 font-medium text-xs border border-cyan-500/30 transition flex items-center gap-1 shrink-0"
                      >
                        <Download className="w-3 h-3" />
                        <span>Get</span>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic text-center py-4">
                  No files shared yet. Mockups and documentation will appear here.
                </p>
              )}
            </div>

            {/* Customer Actions Card: Feedback & Delivery Signoff */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Client Actions</span>
              </h3>

              {/* Submit Feedback Button */}
              <button
                type="button"
                onClick={() => setShowFeedbackModal(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition flex items-center justify-center gap-2 border border-slate-700"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Submit Feedback / Revision Note</span>
              </button>

              {/* Final Delivery Signoff Button */}
              {project.isDeliveryApproved ? (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Final Delivery Formally Approved</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Approved on: {new Date(project.deliveryApprovedAt || "").toLocaleDateString()}
                  </p>
                  {project.deliveryApprovalNotes && (
                    <p className="text-[11px] text-slate-300 italic mt-0.5">
                      &ldquo;{project.deliveryApprovalNotes}&rdquo;
                    </p>
                  )}
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-800/80">
                  <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                    Once your website has completed testing and customer review, you can provide final approval signoff.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowApprovalModal(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Approve Final Delivery</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: SUBMIT CUSTOMER FEEDBACK                           */}
      {/* ========================================================= */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Submit Feedback to Engineering Team</span>
              </h3>
              <button onClick={() => setShowFeedbackModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Project Stage</label>
                <select
                  value={feedbackStage}
                  onChange={(e) => setFeedbackStage(e.target.value as ProjectStage)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                >
                  {PROJECT_STAGES_LIST.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold text-white">Your Feedback / Notes *</label>
                <textarea
                  required
                  rows={4}
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder="Share details on design revisions, content changes, or questions..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFeedback}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold hover:from-cyan-300 hover:to-sky-300 transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingFeedback ? "Sending..." : "Submit Feedback"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: APPROVE FINAL DELIVERY                             */}
      {/* ========================================================= */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Approve Final Project Delivery</span>
              </h3>
              <button onClick={() => setShowApprovalModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApproveFinalDelivery} className="space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                By approving, you confirm that you have reviewed the website, tested its features, and accept the final project deliverables.
              </p>

              <div>
                <label className="block text-slate-400 mb-1">Approval Signoff Remarks (Optional)</label>
                <textarea
                  rows={3}
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Website verified and approved for full production release..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingApproval}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold transition disabled:opacity-50"
                >
                  {isSubmittingApproval ? "Recording Approval..." : "Confirm & Signoff Delivery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
