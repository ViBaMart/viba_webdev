"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Monitor, Database, ShoppingBag, ExternalLink, Sparkles } from "lucide-react";

export default function DemosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const demos = [
    {
      id: "static",
      label: "Demo 1: Static Business",
      shortLabel: "1. Static",
      href: "/demos/static-business",
      icon: Monitor,
      badge: "Fast & Elegant",
    },
    {
      id: "dynamic",
      label: "Demo 2: Dynamic Business",
      shortLabel: "2. Dynamic",
      href: "/demos/dynamic-business",
      icon: Database,
      badge: "CMS & Realtime",
    },
    {
      id: "ecommerce",
      label: "Demo 3: E-Commerce",
      shortLabel: "3. E-Commerce",
      href: "/demos/ecommerce",
      icon: ShoppingBag,
      badge: "Cart & Checkout",
    },
  ];

  const currentDemo = demos.find((d) => pathname?.includes(d.href)) || demos[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans antialiased text-slate-900">
      {/* Top Demo Showcase Control Bar */}
      <aside aria-label="Demo Navigation Bar" className="sticky top-0 z-50 w-full bg-slate-950 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: ViBa Agency Back Button & Identity */}
          <div className="flex items-center gap-3">
            <Link
              href="/#demo"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Agency Main Site</span>
            </Link>

            <div className="hidden md:flex items-center gap-2 border-l border-slate-800 pl-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300">
                Live Prototype Environment
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                (Zero Customer Data)
              </span>
            </div>
          </div>

          {/* Center: Switch Between the 3 Demos */}
          <nav aria-label="Website Demonstrations" className="flex items-center gap-1 sm:gap-2">
            {demos.map((d) => {
              const Icon = d.icon;
              const isActive = pathname?.startsWith(d.href);
              return (
                <Link
                  key={d.id}
                  href={d.href}
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-slate-800 text-blue-400 border border-blue-500/40 shadow-xs"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden sm:inline">{d.label}</span>
                  <span className="sm:hidden">{d.shortLabel}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Order this website CTA */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="text-slate-400">Like this architecture?</span>
            <Link
              href="/#apply"
              className="font-bold text-blue-400 hover:text-blue-300 underline underline-offset-2 flex items-center gap-1"
            >
              <span>Get Your Website</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Demo Page Content */}
      <main className="flex-1 w-full bg-white">{children}</main>
    </div>
  );
}

