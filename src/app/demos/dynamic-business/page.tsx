"use client";

import React, { useState } from "react";
import {
  Server,
  ShieldCheck,
  Zap,
  Activity,
  Settings,
  Plus,
  Trash2,
  CheckCircle,
  Bell,
  RefreshCw,
  Mail,
  Send,
  ArrowRight,
  Check,
  Clock,
  Terminal,
  Menu,
  X,
} from "lucide-react";

interface DynamicService {
  id: string;
  title: string;
  category: string;
  price: string;
  description: string;
  features: string[];
}

interface DynamicInquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  scale: string;
  message: string;
  date: string;
  status: "New" | "In Review" | "Resolved";
}

interface DynamicTestimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  quote: string;
  metrics: string;
}

const DEFAULT_SERVICES: DynamicService[] = [
  {
    id: "svc-1",
    title: "Kubernetes Cluster Auto-Scaling",
    category: "DevOps & Cloud",
    price: "₹45,000 / mo",
    description: "Zero-downtime microservice orchestration across multi-region AWS and GCP clusters with automated horizontal pod autoscaling.",
    features: ["Terraform Infrastructure as Code", "ArgoCD GitOps continuous deployment", "99.99% SLA uptime guarantee"],
  },
  {
    id: "svc-2",
    title: "Serverless Edge API Acceleration",
    category: "Performance Engineering",
    price: "₹32,000 / mo",
    description: "Sub-50ms distributed REST and GraphQL edge endpoints powered by Cloudflare Workers and global caching layers.",
    features: ["Global edge caching", "DDoS mitigation & Web Application Firewall", "Real-time latency monitoring"],
  },
  {
    id: "svc-3",
    title: "24/7 SRE Incident Response & Monitoring",
    category: "Managed Infrastructure",
    price: "₹58,000 / mo",
    description: "Round-the-clock site reliability engineering with automated anomaly detection, telemetry alerts, and automated failovers.",
    features: ["Datadog & Prometheus dashboards", "15-minute emergency SLA", "Automated disaster recovery drills"],
  },
  {
    id: "svc-4",
    title: "Enterprise Database Sharding & Backup",
    category: "Data Systems",
    price: "₹40,000 / mo",
    description: "High-throughput PostgreSQL and MongoDB distributed clustering with automated cross-continental snapshot replication.",
    features: ["Zero-data-loss failover", "Encrypted point-in-time recovery", "Automated query index optimization"],
  },
];

const DEFAULT_TESTIMONIALS: DynamicTestimonial[] = [
  {
    id: "test-1",
    author: "Ananya Deshmukh",
    role: "Chief Technology Officer",
    company: "FinFlow Technologies",
    quote: "PulseTech restructured our legacy monolith into a resilient containerized Kubernetes architecture. Our peak payment latency dropped from 1.8s to 120ms.",
    metrics: "93% Latency Drop",
  },
  {
    id: "test-2",
    author: "Karan Johar-Smith",
    role: "VP of Engineering",
    company: "Aura Logistics Cloud",
    quote: "Their dynamic infrastructure autoscaling saved our team over ₹12 Lakhs in idle cloud computing costs during our off-peak quarters.",
    metrics: "₹12L Cloud Savings",
  },
];

const STORAGE_KEY = "pulsetech_dynamic_data_v1";

type DynamicTab = "home" | "about" | "services" | "cms" | "contact";
type BannerType = "blue" | "emerald" | "amber";

function generateUniqueId(prefix: string): string {
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
}

interface SavedStorageData {
  bannerText?: string;
  bannerActive?: boolean;
  bannerType?: BannerType;
  services?: DynamicService[];
  testimonials?: DynamicTestimonial[];
  inquiries?: DynamicInquiry[];
}

function getInitialStorageData(): SavedStorageData | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export default function DynamicBusinessDemoPage() {
  const [activeTab, setActiveTab] = useState<DynamicTab>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic Content State - lazily initialized to prevent cascading renders
  const [bannerText, setBannerText] = useState(
    () => getInitialStorageData()?.bannerText || "🚀 PulseTech Q4 Update: Multi-Region Kubernetes Mesh engine now available for all enterprise tiers."
  );
  const [bannerActive, setBannerActive] = useState(
    () => getInitialStorageData()?.bannerActive ?? true
  );
  const [bannerType, setBannerType] = useState<BannerType>(
    () => getInitialStorageData()?.bannerType || "blue"
  );

  const [services, setServices] = useState<DynamicService[]>(
    () => getInitialStorageData()?.services || DEFAULT_SERVICES
  );
  const [testimonials, setTestimonials] = useState<DynamicTestimonial[]>(
    () => getInitialStorageData()?.testimonials || DEFAULT_TESTIMONIALS
  );
  const [inquiries, setInquiries] = useState<DynamicInquiry[]>(
    () => getInitialStorageData()?.inquiries || [
      {
        id: "INQ-901",
        name: "Rohan Kapoor",
        email: "rohan@quickpay.io",
        company: "QuickPay Solutions",
        service: "Kubernetes Cluster Auto-Scaling",
        scale: "10M+ Requests / mo",
        message: "We need zero-downtime migration from on-prem to AWS EKS next month.",
        date: "Today, 10:45 AM",
        status: "New",
      },
    ]
  );

  // Sync to localStorage
  const saveStateToStorage = (updates: SavedStorageData) => {
    if (typeof window !== "undefined") {
      try {
        const current = {
          bannerText,
          bannerActive,
          bannerType,
          services,
          testimonials,
          inquiries,
          ...updates,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Interactive Calculator State
  const [reqVolume, setReqVolume] = useState<number>(5); // Millions
  const [k8sNodes, setK8sNodes] = useState<number>(4);
  const [dbStorage, setDbStorage] = useState<number>(250); // GB

  const estimatedMonthly = Math.round(15000 + reqVolume * 2500 + k8sNodes * 4200 + (dbStorage / 50) * 1200);

  // New Service CMS State
  const [newSvcTitle, setNewSvcTitle] = useState("");
  const [newSvcCategory, setNewSvcCategory] = useState("DevOps & Cloud");
  const [newSvcPrice, setNewSvcPrice] = useState("₹35,000 / mo");
  const [newSvcDesc, setNewSvcDesc] = useState("");
  const [cmsSuccessMessage, setCmsSuccessMessage] = useState<string | null>(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "Kubernetes Cluster Auto-Scaling",
    scale: "1M - 10M req/mo",
    message: "",
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Handlers
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSvcTitle || !newSvcDesc) return;

    const newSvc: DynamicService = {
      id: generateUniqueId("svc"),
      title: newSvcTitle,
      category: newSvcCategory,
      price: newSvcPrice,
      description: newSvcDesc,
      features: ["Custom tailored deployment", "Dedicated DevOps liaison", "Continuous SLA telemetry"],
    };

    const updated = [newSvc, ...services];
    setServices(updated);
    saveStateToStorage({ services: updated });

    setNewSvcTitle("");
    setNewSvcDesc("");
    showCmsNotice("New service successfully published to catalog!");
  };

  const handleDeleteService = (id: string) => {
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    saveStateToStorage({ services: updated });
    showCmsNotice("Service removed from catalog.");
  };

  const handleUpdateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    saveStateToStorage({ bannerText, bannerActive, bannerType });
    showCmsNotice("Live announcement banner updated!");
  };

  const handleResetDefaults = () => {
    setServices(DEFAULT_SERVICES);
    setTestimonials(DEFAULT_TESTIMONIALS);
    setBannerText("🚀 PulseTech Q4 Update: Multi-Region Kubernetes Mesh engine now available for all enterprise tiers.");
    setBannerActive(true);
    setBannerType("blue");
    setInquiries([
      {
        id: "INQ-901",
        name: "Rohan Kapoor",
        email: "rohan@quickpay.io",
        company: "QuickPay Solutions",
        service: "Kubernetes Cluster Auto-Scaling",
        scale: "10M+ Requests / mo",
        message: "We need zero-downtime migration from on-prem to AWS EKS next month.",
        date: "Today, 10:45 AM",
        status: "New",
      },
    ]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    showCmsNotice("Reset dynamic data to factory defaults!");
  };

  const showCmsNotice = (msg: string) => {
    setCmsSuccessMessage(msg);
    setTimeout(() => setCmsSuccessMessage(null), 3500);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    const newInq: DynamicInquiry = {
      id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: contactForm.name,
      email: contactForm.email,
      company: contactForm.company || "Enterprise Client",
      service: contactForm.service,
      scale: contactForm.scale,
      message: contactForm.message,
      date: "Just Now",
      status: "New",
    };

    const updated = [newInq, ...inquiries];
    setInquiries(updated);
    saveStateToStorage({ inquiries: updated });
    setContactSubmitted(true);
  };

  const handleToggleInquiryStatus = (id: string) => {
    const updated = inquiries.map((inq) => {
      if (inq.id === id) {
        const nextStatus: DynamicInquiry["status"] =
          inq.status === "New" ? "In Review" : inq.status === "In Review" ? "Resolved" : "New";
        return { ...inq, status: nextStatus };
      }
      return inq;
    });
    setInquiries(updated);
    saveStateToStorage({ inquiries: updated });
  };

  const handleDeleteInquiry = (id: string) => {
    const updated = inquiries.filter((inq) => inq.id !== id);
    setInquiries(updated);
    saveStateToStorage({ inquiries: updated });
  };

  const handleNavClick = (tab: DynamicTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. Dynamic Live Announcement Banner (Configurable in CMS!) */}
      {bannerActive && bannerText && (
        <div
          className={`px-4 py-2 text-xs font-medium text-center flex items-center justify-center gap-2 border-b ${
            bannerType === "blue"
              ? "bg-blue-600/90 text-white border-blue-500/30"
              : bannerType === "emerald"
              ? "bg-emerald-600/90 text-white border-emerald-500/30"
              : "bg-amber-600/90 text-white border-amber-500/30"
          }`}
        >
          <Bell className="h-3.5 w-3.5 animate-bounce shrink-0" />
          <span>{bannerText}</span>
          <button
            onClick={() => handleNavClick("cms")}
            className="underline ml-2 text-[11px] font-bold hover:text-white/80"
          >
            Edit in CMS
          </button>
        </div>
      )}

      {/* 2. Main Navigation Header */}
      <header className="sticky top-11 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 text-left group"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 fill-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white block leading-tight">
                PulseTech
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                Cloud & DevOps Engine
              </span>
            </div>
          </button>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {([
              { id: "home", label: "Home" },
              { id: "about", label: "About" },
              { id: "services", label: `Services (${services.length})` },
              {
                id: "cms",
                label: "CMS Admin",
                badge: inquiries.filter((i) => i.status === "New").length > 0 ? "Inbox" : undefined,
              },
              { id: "contact", label: "Contact Form" },
            ] as { id: DynamicTab; label: string; badge?: string }[]).map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === item.id
                    ? "bg-slate-800 text-cyan-400 border border-slate-700 shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950">
                    {inquiries.filter((i) => i.status === "New").length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Status Badge & CMS Shortcut */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-mono">99.99% Systems Online</span>
            </div>
            <button
              onClick={() => handleNavClick("cms")}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>CMS Admin</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-2">
            {([
              { id: "home", label: "Home" },
              { id: "about", label: "About" },
              { id: "services", label: `Services (${services.length})` },
              { id: "cms", label: `CMS Admin (${inquiries.length} Inquiries)` },
              { id: "contact", label: "Contact Form" },
            ] as { id: DynamicTab; label: string }[]).map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeTab === item.id
                    ? "bg-slate-800 text-cyan-400"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ========================================================
          VIEW 1: HOME
         ======================================================== */}
      {activeTab === "home" && (
        <div>
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900">
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-xs font-semibold">
                    <Activity className="h-3.5 w-3.5" />
                    <span>Dynamic Enterprise Infrastructure • Next.js & Cloud</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                    Cloud-Native Architecture That Scales With Your Demand.
                  </h1>

                  <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
                    PulseTech deploys high-availability Kubernetes microservices, automated CI/CD pipelines, and real-time database replication designed for zero downtime and hyper-scale concurrency.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={() => handleNavClick("services")}
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
                    >
                      <span>Explore Dynamic Services</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleNavClick("cms")}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4 text-cyan-400" />
                      <span>Open CMS Dashboard</span>
                    </button>
                  </div>

                  <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-800">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-cyan-400" /> SOC2 Type II Certified
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-cyan-400" /> &lt;250ms Global P99 Latency
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-cyan-400" /> Multi-Cloud Failover
                    </span>
                  </div>
                </div>

                {/* Right Interactive Telemetry Terminal */}
                <div className="lg:col-span-5">
                  <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 shadow-2xl space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-cyan-400" />
                        <span>cluster-telemetry.pulsetech.io</span>
                      </div>
                      <span className="text-[10px] text-emerald-400">LIVE SYNC</span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                        <span className="text-slate-400">Active Microservices:</span>
                        <span className="text-cyan-400 font-bold">48 Containers</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                        <span className="text-slate-400">Global Edge Regions:</span>
                        <span className="text-cyan-400 font-bold">14 Active Zones</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                        <span className="text-slate-400">P99 API Response:</span>
                        <span className="text-emerald-400 font-bold">42ms Verified</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                        <span className="text-slate-400">Dynamic Inquiries in CMS:</span>
                        <span className="text-amber-400 font-bold">{inquiries.length} Recorded</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300 flex items-center justify-between">
                      <span>Dynamic Storage Engine:</span>
                      <span className="text-white font-bold">Client LocalStorage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dynamic Services Section on Home */}
          <section className="py-20 bg-slate-900 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                    Live Dynamic Service Catalog
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                    Managed Solutions
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    These services are synchronized in real-time from the dynamic CMS.
                  </p>
                </div>
                <button
                  onClick={() => handleNavClick("cms")}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add / Edit Services via CMS</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-cyan-400 font-medium">{svc.category}</span>
                        <span className="text-white font-bold font-mono">{svc.price}</span>
                      </div>
                      <h4 className="text-base font-bold text-white">{svc.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{svc.description}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800/80">
                      <button
                        onClick={() => {
                          setContactForm((prev) => ({ ...prev, service: svc.title }));
                          handleNavClick("contact");
                        }}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded-lg text-xs font-bold transition-colors"
                      >
                        Request Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Dynamic Testimonials */}
          <section className="py-20 bg-slate-950 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                  Client Validation
                </span>
                <h3 className="text-3xl font-extrabold text-white mt-1">
                  Trusted by Fast-Growing Tech Brands
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4"
                  >
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Verified Result: {t.metrics}
                    </div>
                    <blockquote className="text-slate-300 text-sm sm:text-base italic leading-relaxed">
                      “{t.quote}”
                    </blockquote>
                    <div className="pt-2 border-t border-slate-800">
                      <div className="font-bold text-white text-sm">{t.author}</div>
                      <div className="text-xs text-slate-400">{t.role}, {t.company}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================
          VIEW 2: ABOUT
         ======================================================== */}
      {activeTab === "about" && (
        <div className="py-16 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                About PulseTech
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-white mt-2">
                Engineering Zero-Downtime Digital Foundations
              </h1>
              <p className="mt-4 text-slate-400 text-base leading-relaxed">
                PulseTech provides mission-critical cloud platform engineering for high-growth enterprises and venture-backed SaaS startups globally.
              </p>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold">
                  <Server className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Declarative Infrastructure</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Every server, firewall rule, and cluster configuration is version-controlled in Git, enabling deterministic reprovisioning in seconds.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Zero Trust Security</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  End-to-end mTLS encryption between all microservices, automated secrets rotation via HashiCorp Vault, and continuous vulnerability scanning.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Sub-15m P1 Escalation</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Our distributed Site Reliability Engineering teams in India, Europe, and North America guarantee immediate P1 incident resolution.
                </p>
              </div>
            </div>

            {/* SLA Table */}
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-6">Service Level Agreement (SLA) Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Severity Tier</th>
                      <th className="py-3 px-4">Target Response</th>
                      <th className="py-3 px-4">Uptime Guarantee</th>
                      <th className="py-3 px-4">Failover Automation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-3 px-4 font-bold text-white">P1 - Complete Outage</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">&lt; 15 Minutes</td>
                      <td className="py-3 px-4">99.99% Availability</td>
                      <td className="py-3 px-4">Sub-30s DNS automated routing</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-white">P2 - Degraded Latency</td>
                      <td className="py-3 px-4 text-cyan-400">&lt; 45 Minutes</td>
                      <td className="py-3 px-4">99.95% Availability</td>
                      <td className="py-3 px-4">Automatic autoscaling pods trigger</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-white">P3 - Routine Consultation</td>
                      <td className="py-3 px-4 text-slate-400">&lt; 4 Hours</td>
                      <td className="py-3 px-4">Standard Business SLA</td>
                      <td className="py-3 px-4">Scheduled staging deploy</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 3: SERVICES & COST CALCULATOR
         ======================================================== */}
      {activeTab === "services" && (
        <div className="py-16 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                Service Catalog
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-white mt-2">
                Cloud & DevOps Managed Services
              </h1>
              <p className="mt-4 text-slate-400 text-base leading-relaxed">
                Current active offerings. You can add or modify services dynamically using the CMS Admin tab!
              </p>
            </div>

            {/* Dynamic Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                        {svc.category}
                      </span>
                      <span className="text-sm font-bold font-mono text-emerald-400">
                        {svc.price}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white">{svc.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{svc.description}</p>

                    <div className="pt-2">
                      <div className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                        Included Features:
                      </div>
                      <ul className="space-y-2 text-xs text-slate-400">
                        {svc.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setContactForm((prev) => ({ ...prev, service: svc.title }));
                        handleNavClick("contact");
                      }}
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    >
                      Inquire This Service
                    </button>
                    <button
                      onClick={() => handleNavClick("cms")}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Manage in CMS
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Dynamic Infrastructure Cost Estimator */}
            <div className="p-8 sm:p-12 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                  Dynamic Cost Calculator
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                  Interactive Cloud Workload Estimator
                </h3>
                <p className="text-xs text-slate-400 mt-2">
                  Adjust parameters below to see real-time dynamic infrastructure pricing calculation.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  {/* Slider 1 */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                      <span>Monthly API Requests:</span>
                      <span className="text-cyan-400 font-mono text-sm">{reqVolume} Million req/mo</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      step={1}
                      value={reqVolume}
                      onChange={(e) => setReqVolume(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  {/* Slider 2 */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                      <span>Kubernetes Worker Nodes:</span>
                      <span className="text-cyan-400 font-mono text-sm">{k8sNodes} High-Mem Nodes</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={24}
                      step={1}
                      value={k8sNodes}
                      onChange={(e) => setK8sNodes(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  {/* Slider 3 */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                      <span>Distributed Storage & Backups:</span>
                      <span className="text-cyan-400 font-mono text-sm">{dbStorage} GB SSD NVMe</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={2000}
                      step={50}
                      value={dbStorage}
                      onChange={(e) => setDbStorage(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                </div>

                {/* Estimate Result Box */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-cyan-800/40 text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Estimated Monthly Architecture
                  </span>
                  <div className="text-4xl font-mono font-black text-cyan-400">
                    ₹{estimatedMonthly.toLocaleString("en-IN")}
                    <span className="text-xs text-slate-400 font-sans font-normal block mt-1">/ month + standard cloud usage</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>✓ Includes 24/7 SRE Uptime SLA</div>
                    <div>✓ Automated CI/CD deployments included</div>
                    <div>✓ Custom Terraform codebase ownership</div>
                  </div>
                  <button
                    onClick={() => {
                      setContactForm((prev) => ({
                        ...prev,
                        scale: `${reqVolume}M req, ${k8sNodes} nodes, ${dbStorage}GB (Est: ₹${estimatedMonthly})`,
                      }));
                      handleNavClick("contact");
                    }}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-3 rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    Lock-In This Architecture Estimate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 4: DYNAMIC CONTENT MANAGEMENT (CMS ADMIN HUB)
         ======================================================== */}
      {activeTab === "cms" && (
        <div className="py-16 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* CMS Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/60 text-xs font-mono font-bold">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>PulseTech Dynamic CMS Admin Engine</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                  Dynamic Content Management Hub
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Changes made here update the website instantly across views and persist in your browser!
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetDefaults}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Reset Demo State</span>
                </button>
              </div>
            </div>

            {/* Notification alert */}
            {cmsSuccessMessage && (
              <div className="p-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{cmsSuccessMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Announcement & Catalog CMS */}
              <div className="lg:col-span-7 space-y-8">
                {/* 1. Announcement Banner Manager */}
                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Bell className="h-4 w-4 text-cyan-400" />
                    <span>Dynamic Header Announcement</span>
                  </h3>
                  <form onSubmit={handleUpdateBanner} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Announcement Text (Displays at top of all pages)
                      </label>
                      <input
                        type="text"
                        value={bannerText}
                        onChange={(e) => setBannerText(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bannerActive}
                            onChange={(e) => setBannerActive(e.target.checked)}
                            className="rounded accent-cyan-400"
                          />
                          <span className="text-slate-300">Banner Enabled</span>
                        </label>
                        <select
                          value={bannerType}
                          onChange={(e) => setBannerType(e.target.value as BannerType)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                        >
                          <option value="blue">Blue Accent</option>
                          <option value="emerald">Emerald Success</option>
                          <option value="amber">Amber Alert</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        Publish Banner Update
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2. Create New Service Catalog Item */}
                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Plus className="h-4 w-4 text-cyan-400" />
                    <span>Publish New Service Item to Catalog</span>
                  </h3>

                  <form onSubmit={handleCreateService} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Service Title *</label>
                        <input
                          type="text"
                          required
                          value={newSvcTitle}
                          onChange={(e) => setNewSvcTitle(e.target.value)}
                          placeholder="e.g. AI Model Serving Gateway"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                        <select
                          value={newSvcCategory}
                          onChange={(e) => setNewSvcCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        >
                          <option>DevOps & Cloud</option>
                          <option>Performance Engineering</option>
                          <option>Managed Infrastructure</option>
                          <option>Data Systems</option>
                          <option>AI & LLM Ops</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Price Tag</label>
                        <input
                          type="text"
                          value={newSvcPrice}
                          onChange={(e) => setNewSvcPrice(e.target.value)}
                          placeholder="e.g. ₹50,000 / mo"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Brief Description *</label>
                        <input
                          type="text"
                          required
                          value={newSvcDesc}
                          onChange={(e) => setNewSvcDesc(e.target.value)}
                          placeholder="High-throughput inference endpoints with auto-scaling GPUs"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Publish to Live Services Page</span>
                    </button>
                  </form>
                </div>

                {/* 3. Existing Services Manager List */}
                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Active Catalog ({services.length} Services)</h3>
                    <span className="text-xs text-slate-400">Click trash to remove</span>
                  </div>

                  <div className="space-y-2">
                    {services.map((svc) => (
                      <div
                        key={svc.id}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">{svc.title}</div>
                          <div className="text-slate-400">{svc.category} • {svc.price}</div>
                        </div>
                        <button
                          onClick={() => handleDeleteService(svc.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
                          title="Delete Service"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Inquiry & Contact Submissions Inbox */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Mail className="h-4 w-4 text-cyan-400" />
                        <span>Dynamic Inquiries Inbox</span>
                      </h3>
                      <span className="text-xs text-slate-400">
                        Submissions from the Contact Form arrive here in real-time.
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono text-xs font-bold">
                      {inquiries.length} Total
                    </span>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">
                      No customer inquiries received yet. Submit one through the Contact Form!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-cyan-400 font-bold">{inq.id}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleInquiryStatus(inq.id)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                  inq.status === "New"
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                    : inq.status === "In Review"
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                }`}
                                title="Click to cycle status"
                              >
                                {inq.status} (cycle)
                              </button>
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="text-slate-500 hover:text-red-400"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <div className="font-bold text-white">{inq.name} ({inq.company})</div>
                            <div className="text-slate-400 text-[11px]">{inq.email} • {inq.date}</div>
                          </div>

                          <div className="p-2 rounded-lg bg-slate-950 text-slate-300 text-[11px] italic">
                            &ldquo;{inq.message}&rdquo;
                          </div>

                          <div className="text-[11px] text-cyan-400/90 font-mono">
                            Service: {inq.service} ({inq.scale})
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 text-center">
                    <button
                      onClick={() => handleNavClick("contact")}
                      className="text-xs text-cyan-400 hover:underline font-bold"
                    >
                      Test Submit Contact Form ↗
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 5: CONTACT FORM
         ======================================================== */}
      {activeTab === "contact" && (
        <div className="py-16 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
                Direct Engineering Intake
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-white mt-2">
                Connect With a Cloud Solutions Architect
              </h1>
              <p className="mt-4 text-slate-400 text-base leading-relaxed">
                Submit this dynamic form to see it instantly synchronized into the CMS Admin Inbox!
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl">
                {contactSubmitted ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Inquiry Successfully Dispatched!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                      Your technical request from <strong className="text-white">{contactForm.name}</strong> was recorded in the dynamic database.
                    </p>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={() => handleNavClick("cms")}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                      >
                        <Settings className="h-4 w-4" />
                        <span>View Your Submission in CMS Inbox</span>
                      </button>
                      <button
                        onClick={() => {
                          setContactSubmitted(false);
                          setContactForm({
                            name: "",
                            email: "",
                            company: "",
                            service: "Kubernetes Cluster Auto-Scaling",
                            scale: "1M - 10M req/mo",
                            message: "",
                          });
                        }}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Submit Another Inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-5 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="Arjun Mehta"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Work Email *</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="arjun@company.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Company / Organization</label>
                        <input
                          type="text"
                          value={contactForm.company}
                          onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                          placeholder="AuraPay Technologies"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-hidden focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Service Needed</label>
                        <select
                          value={contactForm.service}
                          onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                        >
                          {services.map((s) => (
                            <option key={s.id} value={s.title}>{s.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Target Traffic Scale</label>
                      <select
                        value={contactForm.scale}
                        onChange={(e) => setContactForm({ ...contactForm, scale: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                      >
                        <option>Under 1M requests / month</option>
                        <option>1M - 10M requests / month</option>
                        <option>10M - 50M requests / month</option>
                        <option>50M+ requests / month (Enterprise Mesh)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Project Technical Description *</label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Provide details on your current stack, database size, and target migration timeline..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm resize-none focus:outline-hidden focus:border-cyan-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>Submit Dynamic Technical Inquiry</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">PulseTech Cloud Solutions</div>
              <div className="text-[11px] text-slate-400">Demo 2: Dynamic Business Website Prototype • Engineered by ViBa WebDev</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button onClick={() => handleNavClick("home")} className="hover:text-white">Home</button>
            <button onClick={() => handleNavClick("about")} className="hover:text-white">About</button>
            <button onClick={() => handleNavClick("services")} className="hover:text-white">Services</button>
            <button onClick={() => handleNavClick("cms")} className="hover:text-white">CMS Admin</button>
            <button onClick={() => handleNavClick("contact")} className="hover:text-white">Contact</button>
          </div>

          <div className="text-slate-500 text-[11px]">
            © 2026 PulseTech Platforms Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
