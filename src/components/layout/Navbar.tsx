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
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (pathname?.startsWith("/demos")) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sectionIds = ["home", "about", "services", "pricing", "demo", "apply", "contact"];
      const scrollPos = window.scrollY + 120;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const leftNavLinks = [
    { label: "Home", href: "#home", id: "home" },
    { label: "About Us", href: "#about", id: "about" },
    { label: "Our Services", href: "#services", id: "services" },
  ];

  const rightNavLinks = [
    { label: "Pricing", href: "#pricing", id: "pricing" },
    { label: "Website Demo", href: "#demo", id: "demo" },
    { label: "Apply for Website", href: "#apply", id: "apply" },
    { label: "Contact Us", href: "#contact", id: "contact" },
  ];

  const allNavLinks = [
    { label: "Home", href: "#home", id: "home" },
    { label: "About Us", href: "#about", id: "about" },
    { label: "Our Services", href: "#services", id: "services" },
    { label: "Pricing", href: "#pricing", id: "pricing" },
    { label: "Website Demo", href: "#demo", id: "demo" },
    { label: "Apply for Website", href: "#apply", id: "apply" },
    { label: "Contact Us", href: "#contact", id: "contact" },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace("#", "");
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const navOffset = 80;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      window.history.pushState(null, "", href);
    }
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
            Specialized Next.js, React & Cloud Solutions • 98+ Lighthouse Performance Guaranteed
          </span>
          <span className="mx-auto md:mx-0 text-[11px] sm:text-xs">
            Accepting New Website Development Clients for Q4/Q1
          </span>
          <div className="hidden md:flex items-center gap-4 text-[11px]">
            <a
              href="#demo"
              onClick={(e) => handleLinkClick(e, "#demo")}
              className="text-white hover:text-blue-100 underline underline-offset-2 transition-colors"
            >
              Interactive Live Demos
            </a>
            <span className="text-blue-300">•</span>
            <a
              href="#apply"
              onClick={(e) => handleLinkClick(e, "#apply")}
              className="text-amber-300 font-semibold hover:text-white transition-colors"
            >
              Apply Online &rarr;
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Desktop Left Navigation (Home, About Us, Our Services) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-start">
            {leftNavLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`text-sm font-semibold transition-colors py-1 relative ${
                  activeSection === link.id
                    ? "text-blue-600 font-bold"
                    : "text-slate-700 hover:text-blue-600"
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </a>
            ))}
          </nav>

          {/* Center Brand: VB Merged Logo In The Center */}
          <div className="flex items-center justify-center shrink-0 px-2 lg:px-6">
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, "#home")}
              className="group flex flex-col sm:flex-row items-center gap-2.5 transition-transform hover:scale-[1.02]"
              aria-label="ViBa Web Development Solutions - Home"
            >
              <VbLogo
                size="md"
                variant="badge"
                showText={true}
                textColor="text-slate-900 group-hover:text-blue-700 transition-colors"
                subtextColor="text-slate-500 font-semibold"
              />
            </a>
          </div>

          {/* Desktop Right Navigation & Action Buttons */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 justify-end">
            <nav className="flex items-center gap-5 xl:gap-6">
              {rightNavLinks.slice(0, 2).map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-sm font-semibold transition-colors py-1 relative ${
                    activeSection === link.id
                      ? "text-blue-600 font-bold"
                      : "text-slate-700 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, "#contact")}
                className={`text-sm font-semibold transition-colors py-1 relative ${
                  activeSection === "contact"
                    ? "text-blue-600 font-bold"
                    : "text-slate-700 hover:text-blue-600"
                }`}
              >
                Contact Us
              </a>
            </nav>

            {/* Clear Action Buttons */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <a
                href="#demo"
                onClick={(e) => handleLinkClick(e, "#demo")}
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 font-semibold"
                >
                  <Eye className="h-3.5 w-3.5 text-blue-600" />
                  <span>View Demo</span>
                </Button>
              </a>

              <a
                href="#apply"
                onClick={(e) => handleLinkClick(e, "#apply")}
              >
                <Button
                  size="sm"
                  variant="primary"
                  className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 font-semibold"
                >
                  <FileCheck className="h-3.5 w-3.5" />
                  <span>Apply for Website</span>
                </Button>
              </a>

              <Link href="/customer">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 border-slate-300 text-slate-700 hover:text-blue-600 hover:bg-slate-50 font-semibold"
                >
                  <User className="h-3.5 w-3.5 text-blue-600" />
                  <span>Client Portal</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Right Icons & Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="#apply"
              onClick={(e) => handleLinkClick(e, "#apply")}
              className="sm:inline-flex hidden"
            >
              <Button size="sm" variant="primary" className="text-xs px-2.5 py-1.5 gap-1 bg-blue-600">
                <FileCheck className="h-3 w-3" />
                <span>Apply</span>
              </Button>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-slate-100 hover:text-blue-600 focus:outline-none border border-slate-200"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-blue-100 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allNavLinks.map((link, idx) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  activeSection === link.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                <span>{link.label}</span>
                <span className="text-[10px] text-blue-500 font-mono">0{idx + 1}</span>
              </a>
            ))}
          </div>

          {/* Mobile Clear Action Buttons */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href="#demo"
              onClick={(e) => handleLinkClick(e, "#demo")}
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
            </a>

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
                <span>Client Portal & Dashboard</span>
              </Button>
            </Link>

            <a
              href="#apply"
              onClick={(e) => handleLinkClick(e, "#apply")}
              className="w-full"
            >
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FileCheck className="h-4 w-4" />
                <span>Apply for Website</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
