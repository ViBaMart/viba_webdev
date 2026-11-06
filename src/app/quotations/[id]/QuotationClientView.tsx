"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { VbMonogram } from "@/components/common/VbMonogram";
import { QuotationRecord, QuotationStatus } from "@/types/quotation";
import { PaymentRecord, PaymentStatus, SubmitTransactionDTO } from "@/types/payment";
import {
  CheckCircle2,
  AlertCircle,
  Printer,
  ArrowLeft,
  Building2,
  CreditCard,
  Copy,
  Check,
  Send,
  X,
  Clock,
  Info,
} from "lucide-react";

function getQuotationBadgeClass(status: QuotationStatus) {
  switch (status) {
    case "Approved":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "Sent to Customer":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
    case "Rejected":
      return "bg-rose-500/15 text-rose-400 border-rose-500/30";
    case "Revised":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    default:
      return "bg-slate-800 text-slate-300 border-slate-700";
  }
}

function getPaymentBadgeClass(status: PaymentStatus) {
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

interface QuotationClientViewProps {
  quotationId: string;
}

export default function QuotationClientView({ quotationId }: QuotationClientViewProps) {

  const [quotation, setQuotation] = useState<QuotationRecord | null>(null);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Customer Approval / Rejection Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [decisionType, setDecisionType] = useState<"approve" | "reject">("approve");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);
  const [decisionNotification, setDecisionNotification] = useState<{ text: string; error?: boolean } | null>(null);

  // Payment Transaction Submission Form
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [txnType, setTxnType] = useState<"advance" | "final" | "full">("advance");
  const [txnAmount, setTxnAmount] = useState<number>(0);
  const [txnMethod, setTxnMethod] = useState<SubmitTransactionDTO["paymentMethod"]>("UPI");
  const [txnReference, setTxnReference] = useState("");
  const [txnDate, setTxnDate] = useState("");
  const [txnNotes, setTxnNotes] = useState("");
  const [isSubmittingTxn, setIsSubmittingTxn] = useState(false);
  const [txnNotification, setTxnNotification] = useState<{ text: string; error?: boolean } | null>(null);

  // Copy to clipboard helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Fetch Quotation and Payment
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const res = await fetch(`/api/quotations/${quotationId}`, { cache: "no-store" });
        if (!isMounted) return;

        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? `Quotation "${quotationId}" was not found.`
              : "Failed to load quotation from server."
          );
        }

        const json = await res.json();
        if (json.success && isMounted) {
          setQuotation(json.data.quotation);
          // Set initial default transaction amount based on advance
          if (json.data.quotation.breakdown) {
            setTxnAmount(json.data.quotation.breakdown.advancePayment);
          }
        } else {
          throw new Error(json.error || "Failed to load quotation.");
        }

        // Fetch payment details
        const payRes = await fetch(`/api/payments/${quotationId}`, { cache: "no-store" });
        if (payRes.ok && isMounted) {
          const payJson = await payRes.json();
          if (payJson.success) {
            setPayment(payJson.data);
          }
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err instanceof Error ? err.message : "Error loading quotation.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [quotationId]);

  // Handle Approve or Reject
  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingDecision(true);
    setDecisionNotification(null);

    const newStatus: QuotationStatus = decisionType === "approve" ? "Approved" : "Rejected";

    try {
      const res = await fetch(`/api/quotations/${quotationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          customerFeedback: feedbackText,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to record your decision.");
      }

      setQuotation(json.data);
      setShowFeedbackModal(false);
      setDecisionNotification({
        text:
          decisionType === "approve"
            ? "Thank you! Quotation approved. You can now view official payment details below to initiate advance transfer."
            : "Quotation rejected. Our team has received your feedback and will review requirements.",
      });
    } catch (err) {
      setDecisionNotification({
        text: err instanceof Error ? err.message : "Error updating quotation.",
        error: true,
      });
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  // Handle Transaction Reference Submission
  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTxn(true);
    setTxnNotification(null);

    try {
      const res = await fetch(`/api/payments/${quotationId}/submit-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: txnType,
          amount: txnAmount,
          paymentMethod: txnMethod,
          transactionReference: txnReference,
          transactionDate: txnDate || new Date().toISOString().split("T")[0],
          customerNotes: txnNotes,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit transaction reference.");
      }

      if (json.data?.payment) {
        setPayment(json.data.payment);
      }
      setShowTransactionForm(false);
      setTxnReference("");
      setTxnNotes("");
      setTxnNotification({
        text: "Transaction reference submitted successfully! Our accounts team will verify the settlement and issue your verified payment receipt.",
      });
    } catch (err) {
      setTxnNotification({
        text: err instanceof Error ? err.message : "Submission failed.",
        error: true,
      });
    } finally {
      setIsSubmittingTxn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-mono text-sm">Loading official quotation...</p>
      </div>
    );
  }

  if (errorMessage || !quotation) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 text-center">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">Quotation Not Available</h2>
          <p className="text-slate-400 text-sm mt-1">{errorMessage || "Invalid Quotation ID"}</p>
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

  const { breakdown } = quotation;
  const curr = quotation.currency === "INR" ? "₹" : "$";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Banner Navigation (Hidden in Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ViBa WebDevloper</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Print / PDF Button */}
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 font-medium transition flex items-center gap-1.5 shadow"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Quotation Document Sheet */}
      <div className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Letterhead Header */}
        <div className="p-6 sm:p-8 bg-slate-950/70 border-b border-slate-800 print:bg-white print:border-b-2 print:border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <VbMonogram size={48} className="shrink-0" />
              <div>
                <h1 className="text-xl font-extrabold text-white tracking-tight print:text-black">
                  ViBa WebDevloper
                </h1>
                <p className="text-xs text-cyan-400 font-mono print:text-slate-600">
                  Web Development Solutions • vibawebdev.com
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="flex sm:justify-end items-center gap-2">
                <span className="font-mono text-sm font-bold text-cyan-400 print:text-black">
                  {quotation.id}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full border font-medium print:border-slate-400 print:text-black ${getQuotationBadgeClass(
                    quotation.status
                  )}`}
                >
                  {quotation.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 print:text-slate-600">
                Date: {new Date(quotation.createdAt).toLocaleDateString()} • Valid Until: {quotation.validUntil}
              </p>
            </div>
          </div>
        </div>

        {/* Customer & Agency Information Bar */}
        <div className="p-6 sm:p-8 border-b border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs print:border-b print:border-slate-300">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Quotation Prepared For
            </span>
            <p className="text-sm font-bold text-white print:text-black">{quotation.customerName}</p>
            <p className="font-semibold text-cyan-400 print:text-slate-700">{quotation.businessName}</p>
            <p className="text-slate-400 mt-0.5 print:text-slate-600">{quotation.email} • {quotation.mobileNumber}</p>
            {quotation.businessAddress && (
              <p className="text-slate-400 mt-0.5 print:text-slate-600">{quotation.businessAddress}</p>
            )}
            <p className="text-[11px] text-slate-500 font-mono mt-1">
              Ref Application: {quotation.applicationId}
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Project Specification
            </span>
            <p className="text-sm font-bold text-slate-200 print:text-black">{quotation.websiteType}</p>
            <p className="text-slate-400 mt-0.5 print:text-slate-600">
              Estimated Delivery: <span className="text-slate-200 font-medium print:text-black">{quotation.estimatedTimeline}</span>
            </p>
            <p className="text-slate-400 mt-0.5 print:text-slate-600">
              Billing Currency: <span className="font-mono text-cyan-400 font-bold print:text-black">{quotation.currency} ({curr})</span>
            </p>
          </div>
        </div>

        {/* Financial Charge Items Breakdown */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider print:text-black">
              Itemized Quotation Breakdown
            </h2>
            <span className="text-xs text-slate-400 print:text-slate-600">All prices in {quotation.currency}</span>
          </div>

          <div className="rounded-2xl border border-slate-800 overflow-hidden print:border-slate-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px] tracking-wider print:bg-slate-100 print:text-black print:border-slate-300">
                <tr>
                  <th className="py-3 px-4">Charge Category / Description</th>
                  <th className="py-3 px-4 text-center">Type</th>
                  <th className="py-3 px-4 text-right">Amount ({curr})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-200 text-slate-200 print:text-black">
                {/* 1. Selected Package */}
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white print:text-black block">
                      1. Selected Package: {quotation.selectedPackage.name}
                    </span>
                    <span className="text-[11px] text-slate-400 print:text-slate-600">
                      {quotation.selectedPackage.description || "Core website platform architecture and licensing"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-400 print:text-slate-600">
                    Base Package
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-100 print:text-black">
                    {quotation.selectedPackage.price.toLocaleString()}
                  </td>
                </tr>

                {/* 2. Development Charges */}
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white print:text-black block">
                      2. Development Charges
                    </span>
                    <span className="text-[11px] text-slate-400 print:text-slate-600">
                      {quotation.developmentCharges.description ||
                        "Frontend UI/UX implementation, backend workflows, responsive layout engineering"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-400 print:text-slate-600">
                    Engineering
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-100 print:text-black">
                    {quotation.developmentCharges.amount.toLocaleString()}
                  </td>
                </tr>

                {/* 3. Annual Service Charges */}
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white print:text-black block">
                      3. Annual Service Charges (AMC & Cloud)
                    </span>
                    <span className="text-[11px] text-slate-400 print:text-slate-600">
                      {quotation.annualServiceCharges.description ||
                        "Annual cloud hosting, SSL certificates, security maintenance, and technical support"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-400 print:text-slate-600">
                    {quotation.annualServiceCharges.billingCycle || "Annual"}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-100 print:text-black">
                    {quotation.annualServiceCharges.amount.toLocaleString()}
                  </td>
                </tr>

                {/* 4. Approved Additional Charges */}
                {quotation.additionalCharges && quotation.additionalCharges.length > 0 ? (
                  quotation.additionalCharges.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white print:text-black block">
                          4.{idx + 1} Additional Charge: {item.description}
                        </span>
                        <span className="text-[11px] text-slate-400 print:text-slate-600">
                          Approved custom integration / deliverable
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-400 print:text-slate-600">
                        Add-On
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-100 print:text-black">
                        {item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 text-slate-500 italic">
                      4. Approved Additional Charges
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-500">None</td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-500">0</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Subtotal, Taxes, Total & Payment Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2 text-xs print:border print:border-slate-300 print:bg-white">
              <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] block mb-1 print:text-black">
                Scope & Key Deliverables
              </span>
              <ul className="space-y-1.5 text-slate-400 print:text-slate-700">
                {quotation.scopeDeliverables?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 print:text-black" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2.5 text-xs print:border print:border-slate-300 print:bg-slate-50">
              <div className="flex justify-between text-slate-400 print:text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-200 print:text-black">
                  {curr}{breakdown.subtotal.toLocaleString()}
                </span>
              </div>

              {breakdown.discount > 0 && (
                <div className="flex justify-between text-emerald-400 print:text-emerald-700">
                  <span>Special Agency Discount:</span>
                  <span className="font-mono">
                    -{curr}{breakdown.discount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-400 print:text-slate-600">
                <span>Taxes & GST ({breakdown.taxRatePercent}%):</span>
                <span className="font-mono text-slate-200 print:text-black">
                  +{curr}{breakdown.taxAmount.toLocaleString()}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 print:border-slate-300 flex justify-between items-center text-sm font-bold text-white print:text-black">
                <span>Total Amount:</span>
                <span className="text-base text-cyan-400 font-mono print:text-black">
                  {curr}{breakdown.totalAmount.toLocaleString()}
                </span>
              </div>

              {/* Advance and Remaining Payment Split */}
              <div className="pt-3 border-t border-slate-800/80 print:border-slate-300 space-y-1.5">
                <div className="flex justify-between font-semibold text-teal-300 print:text-teal-800">
                  <span>Advance Payment (Mobilization):</span>
                  <span className="font-mono text-sm">
                    {curr}{breakdown.advancePayment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 print:text-slate-600">
                  <span>Remaining Balance (On Completion):</span>
                  <span className="font-mono text-slate-200 print:text-black">
                    {curr}{breakdown.remainingPayment.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800/80 text-xs text-slate-400 print:border print:border-slate-300 print:bg-white print:text-slate-700">
            <span className="font-semibold text-slate-300 uppercase tracking-wider block mb-1 print:text-black">
              Payment Terms & Conditions
            </span>
            <p className="leading-relaxed">{quotation.paymentTerms}</p>
          </div>
        </div>

        {/* Customer Action Bar (Approve / Reject) (Hidden in Print) */}
        <div className="p-6 sm:p-8 bg-slate-950/70 border-t border-slate-800 print:hidden">
          {decisionNotification && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 mb-4 ${
                decisionNotification.error
                  ? "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                  : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
              }`}
            >
              {decisionNotification.error ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{decisionNotification.text}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400">
                Current Status:{" "}
                <span className="font-bold text-white capitalize">{quotation.status}</span>
              </p>
              {quotation.customerFeedback && (
                <p className="text-[11px] text-slate-500 italic mt-0.5">
                  Feedback: &ldquo;{quotation.customerFeedback}&rdquo;
                </p>
              )}
            </div>

            {/* Action Buttons */}
            {quotation.status === "Sent to Customer" && (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setDecisionType("reject");
                    setShowFeedbackModal(true);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-xs font-semibold text-slate-300 border border-slate-700 transition"
                >
                  Reject / Request Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDecisionType("approve");
                    setShowFeedbackModal(true);
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-xs font-bold text-slate-950 transition shadow-lg shadow-emerald-500/20"
                >
                  Approve Quotation
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* PAYMENT DETAILS & VERIFICATION SECTION (Hidden in Print)  */}
        {/* ========================================================= */}
        {payment && (
          <div className="p-6 sm:p-8 border-t border-slate-800 bg-slate-950/40 print:hidden space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  <span>Payment Details & Status</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Official bank settlement and manual verification portal
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Payment State:</span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${getPaymentBadgeClass(
                    payment.status
                  )}`}
                >
                  {payment.status}
                </span>
              </div>
            </div>

            {txnNotification && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  txnNotification.error
                    ? "bg-rose-500/10 border border-rose-500/30 text-rose-300"
                    : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                }`}
              >
                {txnNotification.error ? (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                )}
                <span>{txnNotification.text}</span>
              </div>
            )}

            {/* Bank Transfer Details Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    ViBa Official Bank Account
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">NEFT / RTGS / IMPS / UPI</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] uppercase block">Beneficiary Name</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-semibold text-slate-200">
                      {payment.bankDetails.beneficiaryName}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(payment.bankDetails.beneficiaryName, "beneficiary")}
                      className="text-slate-500 hover:text-cyan-400"
                    >
                      {copiedKey === "beneficiary" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] uppercase block">Bank Name</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{payment.bankDetails.bankName}</span>
                </div>

                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] uppercase block">Account Number</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-mono font-bold text-cyan-300">
                      {payment.bankDetails.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(payment.bankDetails.accountNumber, "accountNumber")}
                      className="text-slate-500 hover:text-cyan-400"
                    >
                      {copiedKey === "accountNumber" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] uppercase block">IFSC Code</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-mono font-bold text-cyan-300">{payment.bankDetails.ifscCode}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(payment.bankDetails.ifscCode, "ifsc")}
                      className="text-slate-500 hover:text-cyan-400"
                    >
                      {copiedKey === "ifsc" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] uppercase block">UPI ID / VPA</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-mono font-bold text-emerald-400">{payment.bankDetails.upiId}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(payment.bankDetails.upiId, "upi")}
                      className="text-slate-500 hover:text-cyan-400"
                    >
                      {copiedKey === "upi" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px] uppercase block">Account Type</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{payment.bankDetails.accountType}</span>
                </div>
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-800/30 rounded-xl flex items-start gap-2.5 text-xs text-cyan-300">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
                <p className="leading-relaxed">{payment.bankDetails.paymentInstructions}</p>
              </div>
            </div>

            {/* Financial Status Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-slate-500 text-[10px] uppercase block">Total Agreed</span>
                <span className="text-sm font-bold text-white font-mono mt-0.5 block">
                  {curr}{payment.totalAmount.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-slate-900 border border-teal-500/20 rounded-xl">
                <span className="text-teal-400 text-[10px] uppercase block">Advance Required</span>
                <span className="text-sm font-bold text-teal-300 font-mono mt-0.5 block">
                  {curr}{payment.advanceRequired.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-slate-900 border border-emerald-500/20 rounded-xl">
                <span className="text-emerald-400 text-[10px] uppercase block">Verified Paid</span>
                <span className="text-sm font-bold text-emerald-300 font-mono mt-0.5 block">
                  {curr}{payment.amountPaid.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-slate-500 text-[10px] uppercase block">Remaining Balance</span>
                <span className="text-sm font-bold text-slate-200 font-mono mt-0.5 block">
                  {curr}{payment.remainingAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit Transaction Reference Button & Form */}
            {payment.status !== "Fully Paid" && (
              <div className="pt-2">
                {!showTransactionForm ? (
                  <button
                    type="button"
                    onClick={() => setShowTransactionForm(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold text-xs hover:from-cyan-300 hover:to-sky-300 transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Payment Transaction Reference (UTR)</span>
                  </button>
                ) : (
                  <form
                    onSubmit={handleTransactionSubmit}
                    className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 space-y-4 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="font-bold text-white text-sm">
                        Submit Bank / UPI Transfer Reference
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowTransactionForm(false)}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1">Payment Stage</label>
                        <select
                          value={txnType}
                          onChange={(e) => setTxnType(e.target.value as "advance" | "final" | "full")}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                        >
                          <option value="advance">Advance Payment ({curr}{payment.advanceRequired.toLocaleString()})</option>
                          <option value="final">Final Balance ({curr}{payment.remainingAmount.toLocaleString()})</option>
                          <option value="full">Full Amount ({curr}{payment.totalAmount.toLocaleString()})</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Transfer Amount ({curr})</label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={txnAmount}
                          onChange={(e) => setTxnAmount(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Payment Method</label>
                        <select
                          value={txnMethod}
                          onChange={(e) =>
                            setTxnMethod(e.target.value as SubmitTransactionDTO["paymentMethod"])
                          }
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                        >
                          <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                          <option value="Bank Transfer / NEFT">Bank Transfer / NEFT</option>
                          <option value="IMPS / RTGS">IMPS / RTGS</option>
                          <option value="Cheque / Cash Deposit">Cheque / Cash Deposit</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold text-white">
                          Transaction Reference / UTR Number *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 429381029482 or UPI Ref 410294..."
                          value={txnReference}
                          onChange={(e) => setTxnReference(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-cyan-500/40 rounded-xl text-slate-100 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1">Transaction Date</label>
                        <input
                          type="date"
                          value={txnDate}
                          onChange={(e) => setTxnDate(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Additional Notes (Optional)</label>
                      <input
                        type="text"
                        placeholder="Sender account name or payment remarks"
                        value={txnNotes}
                        onChange={(e) => setTxnNotes(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowTransactionForm(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingTxn}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold hover:from-cyan-300 hover:to-sky-300 transition disabled:opacity-50"
                      >
                        {isSubmittingTxn ? "Submitting..." : "Submit for Verification"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Transaction Verification Audit Log */}
            {payment.transactions && payment.transactions.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Submitted Payment Audit Log
                </span>
                <div className="space-y-2">
                  {payment.transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white">{txn.id}</span>
                          <span className="capitalize text-slate-400">• {txn.type}</span>
                          <span className="text-slate-400">• {txn.paymentMethod}</span>
                        </div>
                        <p className="font-mono text-cyan-400 mt-0.5">
                          Ref / UTR: {txn.transactionReference}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Date: {txn.transactionDate} {txn.customerNotes ? `• "${txn.customerNotes}"` : ""}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <span className="font-mono text-sm font-bold text-white block">
                          {curr}{txn.amount.toLocaleString()}
                        </span>
                        {txn.verifiedByAdmin ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified by Accounts
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                            <Clock className="w-3 h-3" />
                            Pending Bank Reconciliation
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: CUSTOMER APPROVE OR REJECT QUOTATION               */}
      {/* ========================================================= */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">
                {decisionType === "approve" ? "Approve Customer Quotation" : "Reject / Request Revision"}
              </h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDecisionSubmit} className="space-y-4 text-xs">
              <p className="text-slate-300 leading-relaxed">
                {decisionType === "approve"
                  ? `You are confirming approval for ${quotation.id} with total investment of ${curr}${breakdown.totalAmount.toLocaleString()}. An advance mobilization deposit of ${curr}${breakdown.advancePayment.toLocaleString()} is required to initiate development.`
                  : "Please let us know what changes or revisions you would like us to make."}
              </p>

              <div>
                <label className="block text-slate-400 mb-1">
                  {decisionType === "approve" ? "Comments or Signoff Note (Optional)" : "Reason / Required Changes *"}
                </label>
                <textarea
                  required={decisionType === "reject"}
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={
                    decisionType === "approve"
                      ? "Approved by business owner, looking forward to starting development..."
                      : "Please adjust the timeline or deliverables..."
                  }
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
                  disabled={isSubmittingDecision}
                  className={`px-5 py-2 rounded-xl font-bold transition disabled:opacity-50 ${
                    decisionType === "approve"
                      ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                      : "bg-rose-500 hover:bg-rose-400 text-white"
                  }`}
                >
                  {isSubmittingDecision
                    ? "Saving Decision..."
                    : decisionType === "approve"
                    ? "Confirm Approval"
                    : "Submit Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
