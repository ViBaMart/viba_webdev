import { Suspense } from "react";
import CustomerDashboardClientView from "./CustomerDashboardClientView";
import { CustomerAuthProvider } from "@/lib/auth/customerAuthContext";

export default function CustomerDashboardPage() {
  return (
    <CustomerAuthProvider>
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-mono text-sm">Loading secure customer dashboard...</p>
          </div>
        }
      >
        <CustomerDashboardClientView />
      </Suspense>
    </CustomerAuthProvider>
  );
}

