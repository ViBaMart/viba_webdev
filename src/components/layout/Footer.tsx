"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AGENCY_CONFIG } from "@/config/agency";
import { VbLogo } from "@/components/common/VbLogo";
import { Button } from "@/components/common/Button";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  ShieldCheck,
  Eye,
  FileCheck,
  Sparkles,
} from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const currentYear = 2026;

  if (pathname?.startsWith("/demos")) {
    return null;
  }

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

  const sectionsList = [
    { label: "1. Home", href: "#home", id: "home" },
    { label: "2. About Us", href: "#about", id: "about" },
    { label: "3. Our Services", href: "#services", id: "services" },
    { label: "4. Pricing", href: "#pricing", id: "pricing" },
    { label: "5. Website Demo", href: "#demo", id: "demo" },
    { label: "6. Apply for Website", href: "#apply", id: "apply" },
    { label: "7. Contact Us", href: "#contact", id: "contact" },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand & Agency Info Column */}
          <div className="lg:col-span-5 space-y-5">
            <a
              href="#home"
              onClick={(e) => scrollTo(e, "home")}
              className="inline-block group"
            >
              <VbLogo
                size="md"
                variant="badge"
                showText={true}
                textColor="text-slate-900 group-hover:text-blue-600 transition-colors"
                subtextColor="text-slate-500 font-semibold"
              />
            </a>

            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              {AGENCY_CONFIG.name} specializes in high-performance web development.
              We build ultra-fast static websites, interactive dynamic applications, and high-concurrency
              e-commerce storefronts on modern Next.js and resilient cloud infrastructure.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600 shrink-0" />
                <span>
                  Official Domain:{" "}
                  <strong className="text-slate-900 font-mono">{AGENCY_CONFIG.domain}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                <span>{AGENCY_CONFIG.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                <a
                  href={`mailto:${AGENCY_CONFIG.contactEmail}`}
                  className="hover:text-blue-600 transition-colors font-medium text-slate-800"
                >
                  {AGENCY_CONFIG.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600 shrink-0" />
                <span className="font-medium text-slate-800">{AGENCY_CONFIG.phone}</span>
              </div>
            </div>
          </div>

          {/* Website Sections Navigation */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Main Website Sections</span>
            </h3>
            <ul className="space-y-2 text-sm">
              {sectionsList.map((sec) => (
                <li key={sec.id}>
                  <a
                    href={sec.href}
                    onClick={(e) => scrollTo(e, sec.id)}
                    className="hover:text-blue-600 transition-colors flex items-center justify-between py-0.5 text-slate-700 font-medium"
                  >
                    <span>{sec.label}</span>
                    <span className="text-xs text-blue-500 font-mono">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions & Reassurance Column */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Quick Actions
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore live preview demos or submit your project application for a guaranteed quote.
            </p>

            <div className="space-y-2.5 pt-2">
              <a
                href="#apply"
                onClick={(e) => scrollTo(e, "apply")}
                className="block w-full"
              >
                <Button
                  size="md"
                  variant="primary"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 justify-center shadow-xs"
                >
                  <FileCheck className="h-4 w-4" />
                  <span>Apply for Website</span>
                </Button>
              </a>

              <a
                href="#demo"
                onClick={(e) => scrollTo(e, "demo")}
                className="block w-full"
              >
                <Button
                  size="md"
                  variant="outline"
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 font-bold gap-2 justify-center"
                >
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span>View Demo</span>
                </Button>
              </a>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>100% Client Code Ownership</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Fixed-Price Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Trust Strip */}
        <div className="mt-14 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {currentYear} {AGENCY_CONFIG.legalName}. All rights reserved. Official domain:{" "}
            <span className="font-semibold text-slate-800">{AGENCY_CONFIG.domain}</span>
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-medium">
            <span className="flex items-center gap-1 text-slate-700">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              98+ Lighthouse Guaranteed
            </span>
            <span>Next.js 16</span>
            <span>React 19</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
