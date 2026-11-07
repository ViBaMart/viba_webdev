"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { VbLogo } from "@/components/common/VbLogo";
import { Button } from "@/components/common/Button";
import {
  Menu,
  X,
  ArrowRight,
  Eye,
  FileCheck,
  Sparkles,
  User,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Our Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "Website Demo", href: "/demo" },
    { label: "Contact Us", href: "/contact" },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || (pathname?.startsWith(href) ?? false);
  };

  if (pathname?.startsWith("/demos")) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 bg-white ${
        scrolled
          ? "border-b border-blue-100 shadow-sm shadow-blue-900/5 bg-white/95 backdrop-blur-md"
          : "border-b border-slate-200/80 bg-white"
      }`}
    >
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-xs py-1.5 px-4 text-center font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden md:inline-flex items-center gap-1.5 text-blue-100 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Specialized Next.js, React &amp; Cloud Solutions • 98+ Lighthouse Performance Guaranteed
          </span>
          <span className="mx-auto md:mx-0 text-[11px] sm:text-xs">
            Accepting New Website Development Clients for Q4/Q1
          </span>
          <div className="hidden md:flex items-center gap-4 text-[11px]">
            <Link
              href="/demo"
              className="text-white hover:text-blue-100 underline underline-offset-2 transition-colors"
            >
              Interactive Live Demos
            </Link>
            <span className="text-blue-300">•</span>
            <Link
              href="/apply"
              className="text-amber-300 font-semibold hover:text-white transition-colors"
            >
              Apply Online &rarr;
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* 1. Left: Brand Logo & Title */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="group flex items-center gap-2.5 transition-transform hover:opacity-95"
              aria-label="ViBa Web Development Solutions - Home"
            >
              <VbLogo
                size="md"
                variant="badge"
                showText={true}
                textColor="text-slate-900 group-hover:text-blue-600 transition-colors"
                subtextColor="text-slate-500 font-semibold"
              />
            </Link>
          </div>

          {/* 2. Center: Desktop Main Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all relative ${
                    active
                      ? "text-blue-600 bg-blue-50/80 font-bold"
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right: Action Buttons (Client Portal & Apply) */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <Link href="/customer">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50 font-semibold text-xs xl:text-sm"
              >
                <User className="h-3.5 w-3.5 text-blue-600" />
                <span>Client Portal</span>
              </Button>
            </Link>

            <Link href="/apply">
              <Button
                size="sm"
                variant="primary"
                className="gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/20 font-semibold text-xs xl:text-sm"
              >
                <FileCheck className="h-3.5 w-3.5" />
                <span>Apply for Website</span>
              </Button>
            </Link>
          </div>

          {/* 4. Mobile Right Controls (Compact Apply + Hamburger) */}
          <div className="flex lg:hidden items-center gap-2">
            <Link href="/apply">
              <Button size="sm" variant="primary" className="text-xs px-3 py-1.5 gap-1 bg-blue-600">
                <FileCheck className="h-3.5 w-3.5" />
                <span>Apply</span>
              </Button>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-slate-100 hover:text-blue-600 focus:outline-none border border-slate-200 transition"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-blue-100 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {navLinks.map((link, idx) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-[10px] text-blue-500 font-mono">0{idx + 1}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Action Buttons */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Link
              href="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button
                variant="outline"
                size="md"
                className="w-full justify-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Eye className="h-4 w-4 text-blue-600" />
                <span>View Demo</span>
              </Button>
            </Link>

            <Link
              href="/customer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button
                variant="outline"
                size="md"
                className="w-full justify-center gap-2 border-slate-300 text-slate-700 hover:text-blue-600 hover:bg-slate-50 font-semibold"
              >
                <User className="h-4 w-4 text-blue-600" />
                <span>Client Portal &amp; Dashboard</span>
              </Button>
            </Link>

            <Link
              href="/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full sm:col-span-2"
            >
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20"
              >
                <FileCheck className="h-4 w-4" />
                <span>Apply for Website</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
