/* eslint-disable @next/next/no-img-element */
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
  Cpu,
  Layers,
  Database,
  Globe2,
  Sliders,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

interface DynamicService {
  id: string;
  title: string;
  category: string;
  price: string;
  description: string;
  features: string[];
  sla?: string;
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
    title: "Kubernetes Multi-Region Mesh & Autoscaling",
    category: "DevOps & Cloud",
    price: "₹45,000 / mo",
    description: "Zero-downtime microservice orchestration across multi-region AWS EKS and GCP GKE clusters with automated horizontal pod autoscaling.",
    features: ["Terraform Infrastructure as Code", "ArgoCD GitOps continuous deployment pipeline", "99.99% SLA uptime guarantee with financial penalty"],
    sla: "99.99% SLA",
  },
  {
    id: "svc-2",
    title: "Serverless Edge API Acceleration & WAF",
    category: "Performance Engineering",
    price: "₹32,000 / mo",
    description: "Sub-40ms globally distributed REST and GraphQL edge endpoints powered by Cloudflare Workers and anycast caching layers.",
    features: ["Global edge CDN with automated caching", "Automated Layer-7 DDoS mitigation & WAF rules", "Real-time edge latency analytics telemetry"],
    sla: "Sub-40ms P99",
  },
  {
    id: "svc-3",
    title: "24/7 SRE Incident Response & Telemetry",
    category: "Managed Infrastructure",
    price: "₹58,000 / mo",
    description: "Round-the-clock site reliability engineering with automated anomaly detection, PagerDuty alerting, and automated failover scripts.",
    features: ["Datadog & Prometheus real-time dashboards", "15-minute emergency SLA with dedicated liaison", "Automated chaos engineering & disaster recovery drills"],
    sla: "15-min SLA",
  },
  {
    id: "svc-4",
    title: "Enterprise Database Sharding & Active Replication",
    category: "Data Systems",
    price: "₹40,000 / mo",
    description: "High-throughput PostgreSQL and MongoDB distributed clustering with automated cross-continental point-in-time snapshot replication.",
    features: ["Zero-data-loss automated failover", "Encrypted point-in-time recovery", "Automated query index optimization and connection pooling"],
    sla: "RPO < 1s",
  },
];

const DEFAULT_TESTIMONIALS: DynamicTestimonial[] = [
  {
    id: "test-1",
    author: "Ananya Deshmukh",
    role: "Chief Technology Officer",
    company: "FinFlow Technologies",
    quote: "PulseTech restructured our legacy monolithic payments engine into a resilient containerized Kubernetes mesh. Our peak Diwali checkout latency dropped from 1.8s down to 120ms with zero failed transactions.",
    metrics: "93% Latency Drop",
  },
  {
    id: "test-2",
    author: "Karan Johar-Smith",
    role: "VP of Engineering",
    company: "Aura Logistics Cloud",
    quote: "Their dynamic infrastructure autoscaling and spot instance orchestration saved our team over ₹14 Lakhs in idle cloud computing costs in our very first quarter.",
    metrics: "₹14L Cloud Savings",
  },
];

const STORAGE_KEY = "pulsetech_dynamic_data_v2";

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

  // Dynamic Content State with localStorage persistence
  const [bannerText, setBannerText] = useState(
    () => getInitialStorageData()?.bannerText || "⚡ PulseTech Q4 Update: Multi-Region Kubernetes Mesh engine now available for all enterprise tiers."
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
        service: "Kubernetes Multi-Region Mesh & Autoscaling",
        scale: "10M+ Requests / mo",
        message: "We need zero-downtime migration from on-prem to AWS EKS next month ahead of our Series B rollout.",
        date: "Today, 10:45 AM",
        status: "New",
      },
      {
        id: "INQ-884",
        name: "Devina Rao",
        email: "d.rao@zenithhealth.in",
        company: "Zenith Health AI",
        service: "24/7 SRE Incident Response & Telemetry",
        scale: "50M+ Requests / mo",
        message: "Looking for dedicated SRE retainer to manage multi-tenant HIPAA-compliant microservices.",
        date: "Yesterday, 4:20 PM",
        status: "In Review",
      },
    ]
  );

  // Sync state changes to localStorage
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

  // Interactive Architecture Calculator State
  const [reqVolume, setReqVolume] = useState<number>(10); // Millions
  const [k8sNodes, setK8sNodes] = useState<number>(6);
  const [dbStorage, setDbStorage] = useState<number>(500); // GB

  const estimatedMonthly = Math.round(
    18000 + reqVolume * 2200 + k8sNodes * 3800 + (dbStorage / 50) * 950
  );

  // New Service CMS Form State
  const [newSvcTitle, setNewSvcTitle] = useState("");
  const [newSvcCategory, setNewSvcCategory] = useState("DevOps & Cloud");
  const [newSvcPrice, setNewSvcPrice] = useState("₹35,000 / mo");
  const [newSvcDesc, setNewSvcDesc] = useState("");
  const [cmsSuccessMessage, setCmsSuccessMessage] = useState<string | null>(null);

  // Inquiries filter in CMS tab
  const [inquiryFilter, setInquiryFilter] = useState<"all" | "New" | "In Review" | "Resolved">("all");

  // Contact / RFP Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "Kubernetes Multi-Region Mesh & Autoscaling",
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
      features: [
        "Automated Terraform deployment templates",
        "Dedicated Tier-3 DevOps SRE liaison",
        "Real-time SLA telemetry dashboard integration",
      ],
      sla: "99.95% SLA",
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
    showCmsNotice("Live announcement banner saved and broadcasted!");
  };

  const handleResetDefaults = () => {
    setServices(DEFAULT_SERVICES);
    setTestimonials(DEFAULT_TESTIMONIALS);
    setBannerText("⚡ PulseTech Q4 Update: Multi-Region Kubernetes Mesh engine now available for all enterprise tiers.");
    setBannerActive(true);
    setBannerType("blue");
    setInquiries([
      {
        id: "INQ-901",
        name: "Rohan Kapoor",
        email: "rohan@quickpay.io",
        company: "QuickPay Solutions",
        service: "Kubernetes Multi-Region Mesh & Autoscaling",
        scale: "10M+ Requests / mo",
        message: "We need zero-downtime migration from on-prem to AWS EKS next month ahead of our Series B rollout.",
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
    showCmsNotice("Inquiry archived from pipeline.");
  };

  const handleNavClick = (tab: DynamicTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const filteredInquiries =
    inquiryFilter === "all"
      ? inquiries
      : inquiries.filter((inq) => inq.status === inquiryFilter);

  const pendingInquiriesCount = inquiries.filter((i) => i.status === "New").length;

  return (
    <div className="min-h-screen bg-[#090d16] text-[#e2e8f0] font-sans selection:bg-cyan-500 selection:text-slate-950 antialiased">
      {/* 1. Live Dynamic Announcement Banner (Configured via CMS!) */}
      {bannerActive && bannerText && (
        <div
          className={`px-4 py-2 text-xs font-mono font-medium text-center flex items-center justify-between sm:justify-center gap-3 border-b transition-all ${
            bannerType === "blue"
              ? "bg-[#0b1c3d] text-[#60a5fa] border-[#1d4ed8]/40"
              : bannerType === "emerald"
              ? "bg-[#06241a] text-[#34d399] border-[#059669]/40"
              : "bg-[#271a06] text-[#fbbf24] border-[#d97706]/40"
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse shrink-0" />
            <span className="truncate">{bannerText}</span>
          </div>
          <button
            onClick={() => handleNavClick("cms")}
            className="shrink-0 text-[11px] underline underline-offset-2 opacity-80 hover:opacity-100 font-bold ml-2"
          >
            Edit in CMS
          </button>
        </div>
      )}

      {/* 2. Enterprise Navigation Header */}
      <header className="sticky top-11 z-40 bg-[#090d16]/95 backdrop-blur-md border-b border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 text-left group shrink-0"
          >
            <div className="h-10 w-10 rounded-sm bg-[#0f172a] border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-mono font-bold text-lg shadow-sm shadow-cyan-500/20 group-hover:border-cyan-400 transition-colors">
              <Zap className="h-5 w-5 fill-cyan-400/20" />
            </div>
            <div>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-white block leading-tight font-sans">
                PulseTech
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 block mt-0.5">
                Cloud & DevOps Engine
              </span>
            </div>
          </button>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 font-mono text-xs" aria-label="Primary Navigation">
            {([
              { id: "home", label: "Overview" },
              { id: "about", label: "Architecture" },
              { id: "services", label: `Catalog (${services.length})` },
              {
                id: "cms",
                label: "CMS & CRM",
                badge: pendingInquiriesCount > 0 ? `${pendingInquiriesCount} New` : undefined,
              },
              { id: "contact", label: "Consultation RFP" },
            ] as { id: DynamicTab; label: string; badge?: string }[]).map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 rounded-sm uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === item.id
                    ? "bg-[#1e293b] text-cyan-400 border border-cyan-500/30 font-bold"
                    : "text-[#94a3b8] hover:text-white hover:bg-[#111827]"
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-cyan-400 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Action: Status indicator & CMS Shortcut */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#0f172a] border border-[#1e293b] text-xs font-mono text-[#94a3b8]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>99.992% SLA Uptime</span>
            </div>
            <button
              onClick={() => handleNavClick("cms")}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm shadow-cyan-500/20"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Console</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-sm text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#1e293b] bg-[#090d16] px-4 pt-3 pb-6 space-y-2 font-mono text-xs">
            {([
              { id: "home", label: "Overview" },
              { id: "about", label: "Platform Architecture" },
              { id: "services", label: `Catalog (${services.length} Services)` },
              { id: "cms", label: `CMS & CRM (${inquiries.length} Inquiries)` },
              { id: "contact", label: "Consultation RFP" },
            ] as { id: DynamicTab; label: string }[]).map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-sm uppercase tracking-wider flex items-center justify-between ${
                  activeTab === item.id
                    ? "bg-[#1e293b] text-cyan-400 font-bold"
                    : "text-[#94a3b8] hover:bg-[#111827]"
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              </button>
            ))}
            <div className="pt-2">
              <button
                onClick={() => handleNavClick("cms")}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-3 rounded-sm font-bold uppercase tracking-wider text-center"
              >
                Open CMS Admin Console
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Notification Toast if CMS action */}
      {cmsSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] border border-cyan-500/60 text-white px-5 py-3 rounded-sm shadow-xl font-mono text-xs flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>{cmsSuccessMessage}</span>
        </div>
      )}

      {/* ========================================================
          VIEW 1: OVERVIEW (HOME)
         ======================================================== */}
      {activeTab === "home" && (
        <main>
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-[#090d16] border-b border-[#1e293b] py-20 sm:py-28 lg:py-36">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#0f172a] border border-[#1e293b] text-cyan-400 text-xs font-mono">
                  <Activity className="h-3.5 w-3.5 text-cyan-400" />
                  <span>ENTERPRISE DISTRIBUTED SYSTEMS & KUBERNETES AUTOMATION</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                  Autonomous Cloud Infrastructure at Sub-Second Velocity.
                </h1>

                <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed max-w-2xl font-light">
                  PulseTech architects multi-cloud Kubernetes meshes, automated GitOps deployment pipelines, and global edge caching engines for high-concurrency fintech, health, and enterprise SaaS workloads.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <button
                    onClick={() => handleNavClick("services")}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold px-6 py-3.5 rounded-sm text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 inline-flex items-center gap-2"
                  >
                    <span>Inspect Infrastructure Services ({services.length})</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleNavClick("cms")}
                    className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-mono font-semibold px-6 py-3.5 rounded-sm text-xs uppercase tracking-wider transition-all border border-[#334155]"
                  >
                    Launch Live CMS Console
                  </button>
                </div>
              </div>

              {/* Telemetry Strip */}
              <div className="mt-20 pt-10 border-t border-[#1e293b] grid grid-cols-2 md:grid-cols-4 gap-8 font-mono">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-cyan-400">99.992%</div>
                  <div className="text-xs uppercase tracking-wider text-[#94a3b8] mt-1">Production SLA Guarantee</div>
                  <div className="text-[11px] text-[#64748b] mt-0.5">Continuous Monitoring</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-cyan-400">Sub-40ms</div>
                  <div className="text-xs uppercase tracking-wider text-[#94a3b8] mt-1">P99 Edge Latency</div>
                  <div className="text-[11px] text-[#64748b] mt-0.5">Across 280+ Global POPs</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-cyan-400">1.4 PB+</div>
                  <div className="text-xs uppercase tracking-wider text-[#94a3b8] mt-1">Sharded Distributed Data</div>
                  <div className="text-[11px] text-[#64748b] mt-0.5">Zero Failover Loss</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-cyan-400">38% Avg</div>
                  <div className="text-xs uppercase tracking-wider text-[#94a3b8] mt-1">Cloud Spend Reduction</div>
                  <div className="text-[11px] text-[#64748b] mt-0.5">Spot Auto-Orchestration</div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Cloud Cost & Capacity Calculator */}
          <section className="py-24 bg-[#0d1322] border-b border-[#1e293b]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mb-14">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                  Interactive Simulator
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Infrastructure Architecture & Cost Estimator
                </h2>
                <p className="mt-3 text-[#94a3b8] text-sm sm:text-base font-light">
                  Dynamically simulate compute nodes, API request throughput, and sharded storage to project monthly cloud expenditures and SLA coverage.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Sliders Console */}
                <div className="lg:col-span-7 bg-[#090d16] border border-[#1e293b] p-8 rounded-sm space-y-7">
                  {/* Slider 1 */}
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs mb-2">
                      <span className="text-[#94a3b8] uppercase tracking-wider">Monthly Request Volume:</span>
                      <span className="text-cyan-400 font-bold text-sm">{reqVolume} Million req/mo</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={100}
                      step={1}
                      value={reqVolume}
                      onChange={(e) => setReqVolume(Number(e.target.value))}
                      className="w-full accent-cyan-400 bg-[#1e293b] h-2 rounded-sm cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#64748b] mt-1">
                      <span>1M</span>
                      <span>50M</span>
                      <span>100M+</span>
                    </div>
                  </div>

                  {/* Slider 2 */}
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs mb-2">
                      <span className="text-[#94a3b8] uppercase tracking-wider">Kubernetes Pod Worker Nodes:</span>
                      <span className="text-cyan-400 font-bold text-sm">{k8sNodes} Worker Nodes</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={32}
                      step={1}
                      value={k8sNodes}
                      onChange={(e) => setK8sNodes(Number(e.target.value))}
                      className="w-full accent-cyan-400 bg-[#1e293b] h-2 rounded-sm cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#64748b] mt-1">
                      <span>2 Nodes (Dual-AZ)</span>
                      <span>16 Nodes</span>
                      <span>32 Nodes (Multi-Cloud)</span>
                    </div>
                  </div>

                  {/* Slider 3 */}
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs mb-2">
                      <span className="text-[#94a3b8] uppercase tracking-wider">Sharded Database Storage:</span>
                      <span className="text-cyan-400 font-bold text-sm">{dbStorage} GB NVMe</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={2000}
                      step={50}
                      value={dbStorage}
                      onChange={(e) => setDbStorage(Number(e.target.value))}
                      className="w-full accent-cyan-400 bg-[#1e293b] h-2 rounded-sm cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#64748b] mt-1">
                      <span>50 GB</span>
                      <span>1,000 GB</span>
                      <span>2,000 GB</span>
                    </div>
                  </div>
                </div>

                {/* Projected Cost & Architecture Summary Card */}
                <div className="lg:col-span-5 bg-[#0f172a] border border-cyan-500/40 p-8 rounded-sm space-y-6">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 block mb-1">
                      Projected Architecture Cost
                    </span>
                    <div className="text-4xl font-mono font-bold text-white">
                      ₹{estimatedMonthly.toLocaleString("en-IN")}{" "}
                      <span className="text-xs font-normal text-[#94a3b8]">/ month</span>
                    </div>
                    <div className="text-xs text-[#64748b] font-mono mt-1">Includes 24/7 dedicated SRE triage tier</div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-[#1e293b] text-xs font-mono">
                    <div className="flex justify-between text-[#94a3b8]">
                      <span>Mesh Autoscaling Engine:</span>
                      <span className="text-white font-bold">₹{(k8sNodes * 3800).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-[#94a3b8]">
                      <span>Edge Ingress & Anycast CDN:</span>
                      <span className="text-white font-bold">₹{(reqVolume * 2200).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-[#94a3b8]">
                      <span>Encrypted Sharded DB Replicas:</span>
                      <span className="text-white font-bold">₹{Math.round((dbStorage / 50) * 950).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-[#94a3b8]">
                      <span>SRE Retainer & Incident SLA:</span>
                      <span className="text-emerald-400 font-bold">INCLUDED</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setContactForm((prev) => ({
                        ...prev,
                        message: `Calculated requirements: ${reqVolume}M requests/mo, ${k8sNodes} Kubernetes nodes, ${dbStorage}GB storage (Estimated ₹${estimatedMonthly.toLocaleString("en-IN")}/mo). Requesting tailored technical scoping.`,
                      }));
                      handleNavClick("contact");
                    }}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold py-3.5 px-4 rounded-sm text-xs uppercase tracking-wider transition-all text-center block"
                  >
                    Lock Architecture Blueprint
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Dynamic Services Grid */}
          <section className="py-24 bg-[#090d16] border-b border-[#1e293b]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                    Managed Catalog
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    Active Production Services
                  </h2>
                </div>
                <button
                  onClick={() => handleNavClick("cms")}
                  className="text-xs font-mono font-bold text-cyan-400 hover:text-white uppercase tracking-wider inline-flex items-center gap-1.5 self-start md:self-auto"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Publish New Service via CMS</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="bg-[#0d1322] border border-[#1e293b] p-8 rounded-sm hover:border-cyan-500/50 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between font-mono text-xs border-b border-[#1e293b] pb-3">
                        <span className="text-cyan-400 font-bold uppercase tracking-wider">
                          {svc.category}
                        </span>
                        <div className="flex items-center gap-2">
                          {svc.sla && (
                            <span className="px-2 py-0.5 bg-[#090d16] text-[#94a3b8] border border-[#1e293b] rounded-sm text-[10px]">
                              {svc.sla}
                            </span>
                          )}
                          <span className="text-white font-bold">{svc.price}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white">{svc.title}</h3>
                      <p className="text-sm text-[#94a3b8] leading-relaxed font-light">{svc.description}</p>

                      <div className="space-y-2 pt-2">
                        {svc.features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-[#cbd5e1]">
                            <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-[#1e293b] flex items-center justify-between font-mono text-xs">
                      <span className="text-[#64748b]">ID: {svc.id}</span>
                      <button
                        onClick={() => {
                          setContactForm((prev) => ({ ...prev, service: svc.title }));
                          handleNavClick("contact");
                        }}
                        className="text-cyan-400 hover:text-white font-bold inline-flex items-center gap-1"
                      >
                        <span>Deploy Scope</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonial Endorsement Strip */}
          <section className="py-24 bg-[#0d1322] border-b border-[#1e293b]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((test) => (
                  <div
                    key={test.id}
                    className="bg-[#090d16] border border-[#1e293b] p-8 rounded-sm space-y-4"
                  >
                    <div className="inline-block px-2.5 py-1 rounded-sm bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
                      {test.metrics}
                    </div>
                    <p className="text-sm sm:text-base text-[#cbd5e1] leading-relaxed italic">
                      “{test.quote}”
                    </p>
                    <div className="pt-2 font-mono text-xs">
                      <div className="font-bold text-white">{test.author}</div>
                      <div className="text-[#94a3b8]">{test.role}, {test.company}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================
          VIEW 2: ARCHITECTURE & PLATFORM (ABOUT)
         ======================================================== */}
      {activeTab === "about" && (
        <main className="py-16 sm:py-24 bg-[#090d16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                Infrastructure Architecture
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                Engineered for High-Concurrency Fault Tolerance.
              </h1>
              <p className="mt-4 text-[#94a3b8] text-base leading-relaxed font-light">
                PulseTech provides bare-metal and multi-cloud Kubernetes orchestration engineered to withstand regional data center outages with zero transaction loss.
              </p>
            </div>

            {/* Architecture Stack Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="bg-[#0d1322] border border-[#1e293b] p-8 rounded-sm space-y-4">
                <div className="h-10 w-10 rounded-sm bg-[#090d16] border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Kubernetes Autoscaling Mesh</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Autonomous Horizontal Pod Autoscaling (HPA) and Karpenter node provisioning scaling from 2 to 200 nodes in under 45 seconds during flash traffic spikes.
                </p>
              </div>

              <div className="bg-[#0d1322] border border-[#1e293b] p-8 rounded-sm space-y-4">
                <div className="h-10 w-10 rounded-sm bg-[#090d16] border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                  <Globe2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Anycast Global Edge Layer</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Cloudflare Workers and Fastly VCL routing requests to the geographically nearest server with integrated TLS 1.3 termination and DDoS mitigation.
                </p>
              </div>

              <div className="bg-[#0d1322] border border-[#1e293b] p-8 rounded-sm space-y-4">
                <div className="h-10 w-10 rounded-sm bg-[#090d16] border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Zero-Loss Sharded DB Clusters</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Distributed PostgreSQL and MongoDB replicas with multi-region quorum synchronization, point-in-time snapshots, and instant automated failover.
                </p>
              </div>
            </div>

            {/* Compliance & Security Certifications */}
            <div className="bg-[#0d1322] border border-[#1e293b] p-8 sm:p-12 rounded-sm space-y-6">
              <div className="max-w-xl">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                  Enterprise Security Posture
                </span>
                <h3 className="text-2xl font-bold text-white">Verified Compliance Standards</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono text-xs">
                <div className="p-4 bg-[#090d16] border border-[#1e293b] rounded-sm">
                  <div className="text-cyan-400 font-bold text-sm">SOC 2 Type II</div>
                  <div className="text-[#94a3b8] text-[11px] mt-1">Audited Security Controls</div>
                </div>
                <div className="p-4 bg-[#090d16] border border-[#1e293b] rounded-sm">
                  <div className="text-cyan-400 font-bold text-sm">ISO 27001</div>
                  <div className="text-[#94a3b8] text-[11px] mt-1">Information Security Mgmt</div>
                </div>
                <div className="p-4 bg-[#090d16] border border-[#1e293b] rounded-sm">
                  <div className="text-cyan-400 font-bold text-sm">HIPAA BAA</div>
                  <div className="text-[#94a3b8] text-[11px] mt-1">Encrypted Healthcare Clouds</div>
                </div>
                <div className="p-4 bg-[#090d16] border border-[#1e293b] rounded-sm">
                  <div className="text-cyan-400 font-bold text-sm">GDPR & DPDP</div>
                  <div className="text-[#94a3b8] text-[11px] mt-1">Data Residency Compliant</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          VIEW 3: SERVICES CATALOG
         ======================================================== */}
      {activeTab === "services" && (
        <main className="py-16 sm:py-24 bg-[#090d16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                  Complete Service Catalog
                </span>
                <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                  Managed Cloud & SRE Engagements
                </h1>
                <p className="mt-3 text-[#94a3b8] text-base font-light">
                  All scopes include automated disaster recovery drills, code-level observability, and verified SLA contracts.
                </p>
              </div>

              <button
                onClick={() => handleNavClick("cms")}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold px-5 py-3 rounded-sm text-xs uppercase tracking-wider inline-flex items-center gap-2 self-start md:self-auto shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Add Service via CMS</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="bg-[#0d1322] border border-[#1e293b] p-8 rounded-sm hover:border-cyan-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between font-mono text-xs border-b border-[#1e293b] pb-3">
                      <span className="text-cyan-400 font-bold uppercase tracking-wider">
                        {svc.category}
                      </span>
                      <span className="text-white font-bold">{svc.price}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white">{svc.title}</h3>
                    <p className="text-sm text-[#94a3b8] leading-relaxed font-light">{svc.description}</p>

                    <div className="space-y-2 pt-2">
                      <div className="text-[11px] font-mono text-[#64748b] uppercase tracking-wider">
                        Included Technical Deliverables:
                      </div>
                      {svc.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#cbd5e1]">
                          <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#1e293b] flex items-center justify-between font-mono text-xs">
                    <span className="text-[#64748b]">Catalog ID: {svc.id}</span>
                    <button
                      onClick={() => {
                        setContactForm((prev) => ({ ...prev, service: svc.title }));
                        handleNavClick("contact");
                      }}
                      className="bg-[#1e293b] hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 font-bold px-4 py-2 rounded-sm transition-all"
                    >
                      Inquire Service RFP
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          VIEW 4: CMS & CRM ADMIN CONSOLE
         ======================================================== */}
      {activeTab === "cms" && (
        <main className="py-16 sm:py-24 bg-[#090d16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Header with quick stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1e293b] pb-8">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                  Console • Real-Time CMS & CRM
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Dynamic Business Management Center
                </h1>
                <p className="mt-2 text-[#94a3b8] text-sm font-light">
                  Add or delete published services, broadcast emergency header announcements, and triage client inquiries in real time.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetDefaults}
                  className="bg-[#1e293b] hover:bg-[#334155] text-[#cbd5e1] font-mono text-xs px-4 py-2.5 rounded-sm transition-all flex items-center gap-2"
                  title="Reset demo data to original factory state"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>

            {/* Metric KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs">
              <div className="p-5 bg-[#0d1322] border border-[#1e293b] rounded-sm">
                <div className="text-[#94a3b8] uppercase tracking-wider">Active Services</div>
                <div className="text-2xl font-bold text-white mt-1">{services.length} Published</div>
              </div>
              <div className="p-5 bg-[#0d1322] border border-[#1e293b] rounded-sm">
                <div className="text-[#94a3b8] uppercase tracking-wider">Total Inquiries</div>
                <div className="text-2xl font-bold text-white mt-1">{inquiries.length} Registered</div>
              </div>
              <div className="p-5 bg-[#0d1322] border border-[#1e293b] rounded-sm">
                <div className="text-[#94a3b8] uppercase tracking-wider">Pending Action</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">{pendingInquiriesCount} New RFPs</div>
              </div>
              <div className="p-5 bg-[#0d1322] border border-[#1e293b] rounded-sm">
                <div className="text-[#94a3b8] uppercase tracking-wider">Live Broadcast</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{bannerActive ? "Active" : "Disabled"}</div>
              </div>
            </div>

            {/* Module 1: Live Announcement Banner Management */}
            <div className="bg-[#0d1322] border border-[#1e293b] p-8 rounded-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
                <div className="flex items-center gap-2.5 font-mono text-sm font-bold text-white">
                  <Bell className="h-4 w-4 text-cyan-400" />
                  <span>Announcement Banner Broadcast Controller</span>
                </div>
                <span className="text-xs font-mono text-[#64748b]">Updates Site Header in Real-Time</span>
              </div>

              <form onSubmit={handleUpdateBanner} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                    Broadcast Message Text
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerText}
                    onChange={(e) => setBannerText(e.target.value)}
                    placeholder="Enter announcement text..."
                    className="w-full px-4 py-2.5 rounded-sm bg-[#090d16] border border-[#1e293b] focus:outline-hidden focus:border-cyan-500 text-sm text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                      Visual Alert Theme
                    </label>
                    <select
                      value={bannerType}
                      onChange={(e) => setBannerType(e.target.value as BannerType)}
                      className="w-full px-4 py-2.5 rounded-sm bg-[#090d16] border border-[#1e293b] focus:outline-hidden focus:border-cyan-500 text-xs font-mono text-white"
                    >
                      <option value="blue">Blue (Platform Update / General)</option>
                      <option value="emerald">Emerald (New Feature Launch)</option>
                      <option value="amber">Amber (Maintenance Notification)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                      Banner State
                    </label>
                    <div className="flex items-center gap-4 pt-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer font-mono text-xs text-[#cbd5e1]">
                        <input
                          type="checkbox"
                          checked={bannerActive}
                          onChange={(e) => setBannerActive(e.target.checked)}
                          className="accent-cyan-400 h-4 w-4 rounded-sm"
                        />
                        <span>Enable Announcement Strip</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold px-6 py-2.5 rounded-sm text-xs uppercase tracking-wider transition-all"
                >
                  Save & Broadcast Live
                </button>
              </form>
            </div>

            {/* Module 2: Add New Service to Catalog */}
            <div className="bg-[#0d1322] border border-[#1e293b] p-8 rounded-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
                <div className="flex items-center gap-2.5 font-mono text-sm font-bold text-white">
                  <Plus className="h-4 w-4 text-cyan-400" />
                  <span>Publish New Service to Catalog</span>
                </div>
                <span className="text-xs font-mono text-[#64748b]">Persists to LocalStorage</span>
              </div>

              <form onSubmit={handleCreateService} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSvcTitle}
                      onChange={(e) => setNewSvcTitle(e.target.value)}
                      placeholder="e.g. Distributed Redis Cluster Caching"
                      className="w-full px-4 py-2.5 rounded-sm bg-[#090d16] border border-[#1e293b] focus:outline-hidden focus:border-cyan-500 text-sm text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                      Category
                    </label>
                    <select
                      value={newSvcCategory}
                      onChange={(e) => setNewSvcCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-sm bg-[#090d16] border border-[#1e293b] focus:outline-hidden focus:border-cyan-500 text-xs font-mono text-white"
                    >
                      <option>DevOps & Cloud</option>
                      <option>Performance Engineering</option>
                      <option>Managed Infrastructure</option>
                      <option>Data Systems</option>
                      <option>Security & Compliance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                      Billing Rate
                    </label>
                    <input
                      type="text"
                      value={newSvcPrice}
                      onChange={(e) => setNewSvcPrice(e.target.value)}
                      placeholder="e.g. ₹35,000 / mo"
                      className="w-full px-4 py-2.5 rounded-sm bg-[#090d16] border border-[#1e293b] focus:outline-hidden focus:border-cyan-500 text-sm text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                    Technical Scope Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newSvcDesc}
                    onChange={(e) => setNewSvcDesc(e.target.value)}
                    placeholder="Describe deployment orchestration, SLA, and monitoring guarantees..."
                    className="w-full px-4 py-2.5 rounded-sm bg-[#090d16] border border-[#1e293b] focus:outline-hidden focus:border-cyan-500 text-sm text-white resize-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold px-6 py-2.5 rounded-sm text-xs uppercase tracking-wider transition-all"
                >
                  Publish to Live Catalog
                </button>
              </form>

              {/* Service Management Table */}
              <div className="pt-6 border-t border-[#1e293b]">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#94a3b8] mb-4">
                  Existing Catalog Entries ({services.length})
                </div>
                <div className="space-y-2">
                  {services.map((svc) => (
                    <div
                      key={svc.id}
                      className="p-4 bg-[#090d16] border border-[#1e293b] rounded-sm flex items-center justify-between gap-4 font-mono text-xs"
                    >
                      <div>
                        <span className="font-bold text-white block">{svc.title}</span>
                        <span className="text-[#64748b] text-[11px]">{svc.category} • {svc.price}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteService(svc.id)}
                        className="text-rose-400 hover:text-rose-300 p-2 rounded-sm hover:bg-rose-950/30 transition-colors"
                        title="Remove service from catalog"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Module 3: Live Inquiries CRM Pipeline */}
            <div className="bg-[#0d1322] border border-[#1e293b] p-8 rounded-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
                <div className="flex items-center gap-2.5 font-mono text-sm font-bold text-white">
                  <Mail className="h-4 w-4 text-cyan-400" />
                  <span>Enterprise Client Inquiries & RFP Pipeline</span>
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  {(["all", "New", "In Review", "Resolved"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setInquiryFilter(status)}
                      className={`px-3 py-1 rounded-sm uppercase tracking-wider transition-all ${
                        inquiryFilter === status
                          ? "bg-cyan-500 text-slate-950 font-bold"
                          : "bg-[#090d16] text-[#94a3b8] hover:text-white border border-[#1e293b]"
                      }`}
                    >
                      {status === "all" ? "All" : status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredInquiries.length === 0 ? (
                  <div className="p-8 text-center text-xs font-mono text-[#64748b] bg-[#090d16] rounded-sm">
                    No inquiries in this category.
                  </div>
                ) : (
                  filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 bg-[#090d16] border border-[#1e293b] rounded-sm space-y-3 font-mono text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e293b] pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{inq.company}</span>
                          <span className="text-[#64748b]">({inq.name})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#64748b] text-[11px]">{inq.date}</span>
                          <button
                            onClick={() => handleToggleInquiryStatus(inq.id)}
                            className={`px-2.5 py-1 rounded-sm font-bold uppercase tracking-wider text-[10px] cursor-pointer transition-all ${
                              inq.status === "New"
                                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                                : inq.status === "In Review"
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            }`}
                            title="Click to cycle status: New -> In Review -> Resolved"
                          >
                            {inq.status} (Click to toggle)
                          </button>
                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="text-[#64748b] hover:text-rose-400 p-1"
                            title="Archive inquiry"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#94a3b8]">
                        <div>Email: <strong className="text-white">{inq.email}</strong></div>
                        <div>Service: <strong className="text-cyan-400">{inq.service}</strong></div>
                        <div>Scale: <strong className="text-white">{inq.scale}</strong></div>
                        <div>Inquiry Reference: <span className="text-[#64748b]">{inq.id}</span></div>
                      </div>

                      <div className="p-3 bg-[#0d1322] border border-[#1e293b] rounded-sm text-[#cbd5e1] text-xs font-light">
                        {inq.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          VIEW 5: CONSULTATION RFP (CONTACT)
         ======================================================== */}
      {activeTab === "contact" && (
        <main className="py-16 sm:py-24 bg-[#090d16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                Enterprise Engagement
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                Submit an Infrastructure Scoping RFP.
              </h1>
              <p className="mt-4 text-[#94a3b8] text-base leading-relaxed font-light">
                Connect with our principal site reliability architects to evaluate migration feasibility, security compliance, and guaranteed SLA contracts.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Technical Contacts */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-8 bg-[#0d1322] border border-[#1e293b] rounded-sm space-y-6 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-1">
                      Engineering Desk
                    </span>
                    <h3 className="text-xl font-bold text-white font-sans">PulseTech SRE Command</h3>
                  </div>

                  <p className="text-[#94a3b8] leading-relaxed font-light font-sans text-xs">
                    Submissions are immediately routed to our senior cloud architects and populate the live CMS console in real-time.
                  </p>

                  <div className="space-y-4 pt-2">
                    <div>
                      <div className="text-white font-bold">Emergency Operations Desk:</div>
                      <div className="text-cyan-400 font-mono">+91 (080) 4920-3300</div>
                    </div>
                    <div>
                      <div className="text-white font-bold">Encrypted Architecture RFP:</div>
                      <div className="text-cyan-400 font-mono">enterprise@pulsetech.cloud</div>
                    </div>
                    <div>
                      <div className="text-white font-bold">SRE SLA Response:</div>
                      <div className="text-[#94a3b8]">15 minutes for critical severity</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1e293b]">
                    <div className="inline-flex items-center gap-2 text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>All Global Data Centers Operational</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Form */}
              <div className="lg:col-span-7">
                <div className="p-8 sm:p-10 bg-[#0d1322] border border-[#1e293b] rounded-sm">
                  {contactSubmitted ? (
                    <div className="text-center py-12 space-y-4 font-mono animate-fadeIn">
                      <div className="h-12 w-12 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto border border-cyan-500/40">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-white font-sans">
                        Inquiry Successfully Dispatched!
                      </h3>
                      <p className="text-xs text-[#94a3b8] max-w-md mx-auto leading-relaxed font-sans">
                        Thank you, <strong className="text-white">{contactForm.name}</strong>. Your scoping request for <strong className="text-cyan-400">{contactForm.company}</strong> has been saved and immediately published to our live CRM pipeline.
                      </p>
                      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                        <button
                          onClick={() => handleNavClick("cms")}
                          className="bg-cyan-500 text-slate-950 font-bold px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider"
                        >
                          View in CMS Inquiries Inbox
                        </button>
                        <button
                          onClick={() => {
                            setContactSubmitted(false);
                            setContactForm({
                              name: "",
                              email: "",
                              company: "",
                              service: "Kubernetes Multi-Region Mesh & Autoscaling",
                              scale: "1M - 10M req/mo",
                              message: "",
                            });
                          }}
                          className="text-xs text-[#94a3b8] hover:text-white underline underline-offset-4"
                        >
                          Submit Another RFP
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-5 font-mono text-xs">
                      <div>
                        <h3 className="text-2xl font-bold text-white font-sans">
                          Enterprise Architecture RFP
                        </h3>
                        <p className="text-xs text-[#94a3b8] font-light mt-1 font-sans">
                          Describe your tech stack, current cloud provider, and scaling objectives.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                            Lead Architect Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            placeholder="e.g. Rohan Kapoor"
                            className="w-full px-4 py-2.5 rounded-sm bg-[#090d16] border border-[#1e293b] focus:outline-hidden focus:border-cyan-500 text-sm text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                            Work Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            placeholder="rohan@enterprise.com"
                            className="w-full px-4 py-2.5 rounded-sm bg-[#090d16] border border-[#1e293b] focus:outline-hidden focus:border-cyan-500 text-sm text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                            Company / Organization
                          </label>
                          <input
                            type="text"
                            value={contactForm.company}
                            onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                            placeholder="e.g. QuickPay Solutions"
                            className="w-full px-4 py-2.5 rounded-sm bg-[#090d16] border border-[#1e293b] focus:outline-hidden focus:border-cyan-500 text-sm text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                            Monthly Request Scale
                          </label>
                          <select
                            value={contactForm.scale}
                            onChange={(e) => setContactForm({ ...contactForm, scale: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-sm bg-[#090d16] border border-[#1e293b] focus:outline-hidden focus:border-cyan-500 text-xs text-white"
                          >
                            <option>1M - 10M req/mo</option>
                            <option>10M - 50M req/mo</option>
                            <option>50M - 250M req/mo</option>
                            <option>250M+ High Concurrency Scale</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                          Target Primary Service
                        </label>
                        <select
                          value={contactForm.service}
                          onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-sm bg-[#090d16] border border-[#1e293b] focus:outline-hidden focus:border-cyan-500 text-xs text-white"
                        >
                          {services.map((s) => (
                            <option key={s.id} value={s.title}>{s.title}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
                          Architecture Scoping Message *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="Outline current container stack, cloud providers, peak throughput, and target rollout schedule..."
                          className="w-full px-4 py-2.5 rounded-sm bg-[#090d16] border border-[#1e293b] focus:outline-hidden focus:border-cyan-500 text-sm text-white resize-none font-mono"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3.5 px-6 rounded-sm text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                      >
                        <Send className="h-4 w-4" />
                        <span>Dispatch Architecture RFP</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Upgraded Enterprise Footer */}
      <footer className="border-t border-[#1e293b] bg-[#090d16] text-[#64748b] py-16 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="space-y-3 font-sans">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-sm bg-[#0f172a] border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold">
                  <Zap className="h-4 w-4 fill-cyan-400/20" />
                </div>
                <div>
                  <div className="font-bold text-white text-base">PulseTech Cloud</div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">SRE Platforms</div>
                </div>
              </div>
              <p className="text-xs text-[#94a3b8] leading-relaxed font-light">
                High-throughput distributed microservice orchestration, Kubernetes horizontal scaling, and anycast edge delivery.
              </p>
            </div>

            <div>
              <div className="text-white font-bold uppercase tracking-wider mb-3">Console Navigation</div>
              <ul className="space-y-2">
                <li><button onClick={() => handleNavClick("home")} className="hover:text-cyan-400">Overview</button></li>
                <li><button onClick={() => handleNavClick("about")} className="hover:text-cyan-400">Architecture Stack</button></li>
                <li><button onClick={() => handleNavClick("services")} className="hover:text-cyan-400">Catalog</button></li>
                <li><button onClick={() => handleNavClick("cms")} className="hover:text-cyan-400">Live CMS & CRM</button></li>
                <li><button onClick={() => handleNavClick("contact")} className="hover:text-cyan-400">Consultation RFP</button></li>
              </ul>
            </div>

            <div>
              <div className="text-white font-bold uppercase tracking-wider mb-3">Infrastructure</div>
              <ul className="space-y-2 text-[#94a3b8]">
                <li>Multi-Cloud EKS & GKE Mesh</li>
                <li>Anycast Cloudflare Edge CDN</li>
                <li>Zero-Loss PostgreSQL Sharding</li>
                <li>24/7 Datadog Telemetry</li>
              </ul>
            </div>

            <div>
              <div className="text-white font-bold uppercase tracking-wider mb-3">Live Telemetry</div>
              <div className="p-3.5 bg-[#0d1322] border border-[#1e293b] rounded-sm space-y-1.5 text-[11px]">
                <div className="text-cyan-400">Demo 2: Dynamic Business Platform</div>
                <div className="text-[#94a3b8]">Persistent LocalStorage State</div>
                <div className="text-[#94a3b8]">Engineered by ViBa WebDev</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div>© 2026 PulseTech Distributed Cloud Technologies Inc. All rights reserved.</div>
            <div>Status: Operational • Global SLA 99.992% • ISO 27001 Certified</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
