import { Suspense, use } from "react";
import QuotationClientView from "./QuotationClientView";

interface PageProps {
  params: Promise<{ id: string }>;
}

function QuotationContent({ params }: PageProps) {
  const { id } = use(params);
  return <QuotationClientView quotationId={id} />;
}

export default function CustomerQuotationPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
          <p className="text-slate-400 font-mono text-sm">Loading official quotation...</p>
        </div>
      }
    >
      <QuotationContent params={params} />
    </Suspense>
  );
}
