import Link from "next/link";
import { Button } from "@/components/common/Button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl mb-4 font-mono font-bold text-sm">
        404 — Resource Not Located
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
        Page or Route Not Found
      </h1>
      <p className="text-slate-600 max-w-md text-sm leading-relaxed mb-8">
        The requested resource on vibawebdev.com does not exist or has been relocated to another
        architectural endpoint.
      </p>
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="primary" size="md">
            <Home className="h-4 w-4" />
            <span>Return to Agency Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
