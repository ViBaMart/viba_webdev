/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import {
  Compass,
  Building2,
  Layers,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ChevronRight,
  Eye,
  X,
  Send,
  Shield,
  Check,
  Menu,
} from "lucide-react";

interface GalleryProject {
  id: string;
  title: string;
  category: "commercial" | "residential" | "cultural";
  categoryLabel: string;
  location: string;
  year: string;
  area: string;
  image: string;
  client: string;
  description: string;
  highlights: string[];
}

const GALLERY_PROJECTS: GalleryProject[] = [
  {
    id: "proj-1",
    title: "Vanguard Corporate Financial Tower",
    category: "commercial",
    categoryLabel: "Commercial High-Rise",
    location: "Bengaluru, India",
    year: "2025",
    area: "480,000 sq ft",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    client: "Vanguard Global Asset Management",
    description: "A 36-story carbon-neutral headquarters utilizing kinetic solar louvers, biophilic atrium gardens, and rainwater harvesting.",
    highlights: ["LEED Platinum Certified", "42% Reduction in HVAC Consumption", "Double-glazed acoustic facade"],
  },
  {
    id: "proj-2",
    title: "The Solarium Eco-Villa",
    category: "residential",
    categoryLabel: "Luxury Residential",
    location: "Alibaug, Maharashtra",
    year: "2024",
    area: "14,500 sq ft",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    client: "Private Family Estate",
    description: "Cantilevered glass pavilion framing coastal panoramas with exposed basalt stone walls, solar-driven battery storage, and an infinity reservoir.",
    highlights: ["Passive Solar Orientation", "Locally Quarried Basalt Stone", "Private Geothermal Cooling"],
  },
  {
    id: "proj-3",
    title: "National Heritage Library & Arts Pavilion",
    category: "cultural",
    categoryLabel: "Cultural & Civic",
    location: "New Delhi, India",
    year: "2025",
    area: "120,000 sq ft",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=1200&q=80",
    client: "Ministry of Culture & Arts Foundation",
    description: "Sculptural public library and auditorium inspired by traditional geometric jali screens, with daylight-optimized reading galleries.",
    highlights: ["Parametric Terracotta Screen", "Acoustic Resonance Rating NC-20", "Public Amphitheater Plaza"],
  },
  {
    id: "proj-4",
    title: "Nexus Innovation Bio-Campus",
    category: "commercial",
    categoryLabel: "Commercial High-Rise",
    location: "Hyderabad, India",
    year: "2024",
    area: "650,000 sq ft",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    client: "Nexus Therapeutics Labs",
    description: "Four interconnected R&D laboratories with rooftop botanical terraces, collaborative pods, and advanced biosafety containment zones.",
    highlights: ["ISO Class 5 Cleanrooms", "Zero-Discharge Water Treatment", "Rooftop Microgrid Power"],
  },
  {
    id: "proj-5",
    title: "The Horizon Glass Penthouse",
    category: "residential",
    categoryLabel: "Luxury Residential",
    location: "Mumbai, India",
    year: "2025",
    area: "8,200 sq ft",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    client: "HNI Executive",
    description: "Duplex sky residence offering 360-degree Arabian Sea views, seamless indoor-outdoor terrazzo flooring, and integrated ambient lighting.",
    highlights: ["Custom Smart Home Automation", "Italian Carrara Marble Finishes", "Private Sky Deck Plunge Pool"],
  },
  {
    id: "proj-6",
    title: "Civic Botanical Conservatory & Forum",
    category: "cultural",
    categoryLabel: "Cultural & Civic",
    location: "Pune, India",
    year: "2023",
    area: "95,000 sq ft",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    client: "Municipal Urban Beautification Council",
    description: "Geodesic glass dome complex harboring endangered tropical flora with a public amphitheater, educational discovery center, and cafe.",
    highlights: ["Self-Regulating Microclimate", "Rainwater Mist Irrigation", "Accessible Elevated Canopy Walk"],
  },
];

type StaticTab = "home" | "about" | "services" | "gallery" | "contact";

export default function StaticBusinessDemoPage() {
  const [activeTab, setActiveTab] = useState<StaticTab>("home");
  const [galleryFilter, setGalleryFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "Architectural Planning & Blueprinting",
    budget: "₹25 Lakhs - ₹50 Lakhs",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const filteredProjects =
    galleryFilter === "all"
      ? GALLERY_PROJECTS
      : GALLERY_PROJECTS.filter((p) => p.category === galleryFilter);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
  };

  const navItems: { id: StaticTab; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (tabId: StaticTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-200">
      {/* Brand Header */}
      <header className="sticky top-11 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 text-left group"
          >
            <div className="h-11 w-11 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-serif text-2xl font-bold shadow-md group-hover:bg-stone-800 transition-colors">
              A
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 block leading-tight">
                Apex Horizon
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700">
                Architectural & Interior Studio
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === item.id
                    ? "bg-stone-900 text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleNavClick("contact")}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
            >
              Consult an Architect
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold ${
                  activeTab === item.id
                    ? "bg-stone-900 text-white"
                    : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick("contact")}
              className="w-full mt-2 bg-amber-600 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-center"
            >
              Consult an Architect
            </button>
          </div>
        )}
      </header>

      {/* ========================================================
          VIEW 1: HOME
         ======================================================== */}
      {activeTab === "home" && (
        <div>
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-stone-900 text-white py-20 lg:py-32">
            <div
              className="absolute inset-0 opacity-25 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
                  <Compass className="h-3.5 w-3.5" />
                  <span>Precision Spatial Engineering & Sustainable Design</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
                  Timeless Architecture Crafted with Scientific Precision.
                </h1>

                <p className="text-base sm:text-lg text-stone-300 leading-relaxed font-light">
                  Apex Horizon merges visionary aesthetics, structural sustainability, and cutting-edge BIM modeling to deliver iconic corporate towers, civic landmarks, and bespoke luxury residences.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => handleNavClick("gallery")}
                    className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 inline-flex items-center gap-2"
                  >
                    <span>Explore Featured Projects</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleNavClick("about")}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-all border border-white/20"
                  >
                    Our Studio Story
                  </button>
                </div>
              </div>

              {/* Statistics Strip */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-stone-800">
                <div>
                  <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-400">14+</div>
                  <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">Years of Practice</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-400">320+</div>
                  <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">Projects Delivered</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-400">99.8%</div>
                  <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">On-Budget Delivery</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-400">28</div>
                  <div className="text-xs uppercase tracking-wider text-stone-400 mt-1">Design Awards</div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Philosophy Preview */}
          <section className="py-20 bg-stone-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-14">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
                  Architectural Pillars
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-2">
                  Engineered for Longevity & Aesthetic Authority
                </h2>
                <p className="mt-4 text-stone-600 text-sm sm:text-base">
                  Every structure we conceive responds directly to climate, materiality, and human experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-900">Biophilic Urban Design</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Integrating living plant ecosystems, natural light penetration, and airflow ventilation to reduce mechanical HVAC loads by up to 40%.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Layers className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-900">Parametric BIM Modeling</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Sub-millimeter Autodesk Revit and Rhino modeling to eliminate construction site conflicts, ensuring strict compliance and zero schedule drift.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-900">Net-Zero Energy Standards</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Passive thermal massing, photovoltaic skin integration, and smart rainwater recycling designed to achieve LEED Platinum and GRIHA 5-Star status.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Services Preview */}
          <section className="py-20 bg-white border-t border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
                    Comprehensive Practice
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-2">
                    Our Core Disciplines
                  </h2>
                </div>
                <button
                  onClick={() => handleNavClick("services")}
                  className="text-amber-700 hover:text-amber-800 font-bold text-sm inline-flex items-center gap-1"
                >
                  <span>View All Services & Pricing</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Master Planning", desc: "Regional site layout, circulation analysis, and ecological land zoning." },
                  { title: "Commercial Architecture", desc: "Corporate headquarters, hospitality resorts, and institutional campuses." },
                  { title: "Luxury Interiors", desc: "Bespoke millwork, acoustic finishes, lighting design, and material curation." },
                  { title: "Green Certification", desc: "Comprehensive LEED, IGBC, and GRIHA audit documentation and testing." },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                  >
                    <div className="text-amber-700 font-serif font-bold text-lg mb-2">0{idx + 1}.</div>
                    <h4 className="font-serif font-bold text-stone-900 text-lg mb-2">{s.title}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Projects Highlight Strip */}
          <section className="py-20 bg-stone-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                    Portfolio Highlights
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
                    Recent Landmark Commissions
                  </h2>
                </div>
                <button
                  onClick={() => handleNavClick("gallery")}
                  className="text-amber-400 hover:text-amber-300 font-bold text-sm inline-flex items-center gap-1"
                >
                  <span>Browse Full Gallery ({GALLERY_PROJECTS.length} Projects)</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {GALLERY_PROJECTS.slice(0, 3).map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="group cursor-pointer rounded-2xl overflow-hidden bg-stone-800 border border-stone-700 hover:border-amber-500/50 transition-all"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-amber-400 text-xs px-2.5 py-1 rounded-md font-medium">
                        {project.categoryLabel}
                      </div>
                    </div>
                    <div className="p-6 space-y-2">
                      <div className="text-xs text-stone-400">{project.location} • {project.year}</div>
                      <h4 className="text-lg font-serif font-bold text-white group-hover:text-amber-400 transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-xs text-stone-400 line-clamp-2">{project.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonial Banner */}
          <section className="py-20 bg-amber-50 border-t border-amber-200/60">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-800">
                Client Testimonial
              </span>
              <blockquote className="text-xl sm:text-2xl font-serif italic text-stone-800 leading-relaxed">
                “Apex Horizon delivered our corporate headquarters ahead of schedule with remarkable fidelity to the initial renders. Their mastery over daylighting and acoustic separation created an inspiring environment our employees genuinely love.”
              </blockquote>
              <div>
                <div className="font-bold text-stone-900">Rajesh V. Singhania</div>
                <div className="text-xs text-stone-600">Managing Director, Vanguard Asset Management</div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================
          VIEW 2: ABOUT
         ======================================================== */}
      {activeTab === "about" && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
                About Apex Horizon
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mt-3">
                Architects of Purpose, Space, and Permanence
              </h1>
              <p className="mt-4 text-stone-600 text-base leading-relaxed">
                Established in 2012, Apex Horizon is a boutique multidisciplinary architectural studio headquartered in Mumbai, with projects across India, Dubai, and Singapore.
              </p>
            </div>

            {/* Story & Vision Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/3">
                <img
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80"
                  alt="Architectural studio workshop"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                  Our Architectural Philosophy
                </h2>
                <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                  We reject transient stylistic trends in favor of structural clarity, enduring natural materials, and climate-responsive ergonomics. Every project begins with an intensive forensic site analysis—assessing microclimates, seasonal sun angles, prevailing winds, and regional soil ecology.
                </p>
                <div className="space-y-3 pt-2">
                  {[
                    "100% Digital Twin & BIM Coordination before site breaking",
                    "Stringent carbon budget calculations on all structural concrete & steel",
                    "Handcrafted regional stonework partnered with local artisan guilds",
                    "Zero-tolerance tolerance thresholds on MEP and acoustic dampening",
                  ].map((pt, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-stone-700">
                      <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Leadership Team */}
            <div className="mb-20">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
                  Principal Leadership
                </span>
                <h3 className="text-3xl font-serif font-bold text-stone-900 mt-2">
                  Meet the Design Partners
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    name: "Ar. Vikramaditya Sen",
                    role: "Founding Partner & Chief Architect",
                    cred: "B.Arch (SPA Delhi), M.Arch (AA London), Council of Architecture",
                    bio: "Over 20 years leading large-scale corporate campuses and institutional landmarks with extensive focus on passive cooling systems.",
                  },
                  {
                    name: "Ar. Sunita Merchant",
                    role: "Design Principal & Interior Director",
                    cred: "M.Des (Politecnico di Milano), LEED AP BD+C",
                    bio: "Specializes in high-end residential interiors, custom furniture joinery, and biophilic interior landscape integration.",
                  },
                  {
                    name: "Dr. Farhan Qureshi",
                    role: "Structural & Sustainability Consultant",
                    cred: "Ph.D. Civil Eng (IIT Bombay), GRIHA Evaluator",
                    bio: "Directs computational structural simulation, seismic isolation design, and net-zero envelope testing.",
                  },
                ].map((member, i) => (
                  <div key={i} className="p-6 rounded-2xl border border-stone-200 bg-stone-50 space-y-4">
                    <div className="h-14 w-14 rounded-2xl bg-stone-900 text-amber-400 font-serif font-bold text-xl flex items-center justify-center">
                      {member.name.charAt(4)}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-lg">{member.name}</h4>
                      <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">{member.role}</div>
                      <div className="text-[11px] text-stone-500 font-mono mt-1">{member.cred}</div>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Firm Milestones */}
            <div className="p-8 sm:p-12 rounded-3xl bg-stone-900 text-white">
              <h3 className="text-2xl font-serif font-bold text-amber-400 mb-8 text-center">
                Studio Timeline & Milestones
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-stone-300">
                <div className="border-l-2 border-amber-500 pl-4 space-y-1">
                  <div className="text-amber-400 font-bold font-mono text-sm">2012</div>
                  <div className="font-serif font-semibold text-white">Studio Inception</div>
                  <div className="text-xs text-stone-400">Founded in Mumbai with an initial team of 4 visionary architects.</div>
                </div>
                <div className="border-l-2 border-amber-500 pl-4 space-y-1">
                  <div className="text-amber-400 font-bold font-mono text-sm">2016</div>
                  <div className="font-serif font-semibold text-white">National Recognition</div>
                  <div className="text-xs text-stone-400">Awarded the National Architect of the Year for Vanguard Tower schematic.</div>
                </div>
                <div className="border-l-2 border-amber-500 pl-4 space-y-1">
                  <div className="text-amber-400 font-bold font-mono text-sm">2021</div>
                  <div className="font-serif font-semibold text-white">Net-Zero Transition</div>
                  <div className="text-xs text-stone-400">100% of studio projects transition to net-zero energy design compliance.</div>
                </div>
                <div className="border-l-2 border-amber-500 pl-4 space-y-1">
                  <div className="text-amber-400 font-bold font-mono text-sm">2026</div>
                  <div className="font-serif font-semibold text-white">Global Practice</div>
                  <div className="text-xs text-stone-400">Over 320 projects delivered across India, GCC, and Southeast Asia.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 3: SERVICES
         ======================================================== */}
      {activeTab === "services" && (
        <div className="py-16 bg-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
                Professional Scope
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mt-3">
                Architectural & Engineering Services
              </h1>
              <p className="mt-4 text-stone-600 text-base leading-relaxed">
                From initial site feasibility through turnkey construction oversight, we provide end-to-end spatial design backed by certified structural audits.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: "Architectural Planning & Blueprinting",
                  price: "From ₹45 / sq ft",
                  turnaround: "4-6 weeks for schematics",
                  desc: "Comprehensive 2D spatial drawings, 3D parametric facade models, structural load coordination, and municipal building sanction clearances.",
                  deliverables: ["Full architectural drawing set", "3D photorealistic render suite", "Sanction submission packages"],
                },
                {
                  title: "Bespoke Interior Architecture",
                  price: "From ₹65 / sq ft",
                  turnaround: "3-5 weeks",
                  desc: "Custom corporate and luxury residential interior fit-outs with custom joinery details, acoustic engineering, and curated material specifications.",
                  deliverables: ["Reflected ceiling plans", "Custom millwork details", "Lighting fixture schedules"],
                },
                {
                  title: "Sustainable Green Building Audits",
                  price: "From ₹1.5 Lakhs flat",
                  turnaround: "2 weeks",
                  desc: "Energy simulation, daylight factor computation, embodied carbon audits, and documentation preparation for LEED Platinum and GRIHA 5-Star ratings.",
                  deliverables: ["ASHRAE 90.1 energy model", "Sun path & shading study", "Official green certification dossier"],
                },
                {
                  title: "Structural Engineering & Feasibility",
                  price: "From ₹35 / sq ft",
                  turnaround: "3-4 weeks",
                  desc: "STAAD.Pro and ETABS seismic load simulations, deep pile foundation engineering, and structural retrofitting assessments for complex terrains.",
                  deliverables: ["Seismic analysis reports", "Rebar & bar bending schedules", "Geotechnical review summary"],
                },
                {
                  title: "Landscape & Master Planning",
                  price: "From ₹3.5 Lakhs",
                  turnaround: "4-8 weeks",
                  desc: "Large acreage layout planning, pedestrian and vehicular circulation routes, botanical zoning, stormwater retention swales, and outdoor lighting.",
                  deliverables: ["Circulation master plan", "Irrigation & grading maps", "Indigenous flora planting guide"],
                },
                {
                  title: "Construction Administration & QA",
                  price: "Retainer based",
                  turnaround: "Full project lifecycle",
                  desc: "Bi-weekly on-site inspections, contractor bill verification, material lab test audits, and continuous defect rectification protocols.",
                  deliverables: ["Site progress snag logs", "Material verification stamp", "Completion certificate handoff"],
                },
              ].map((svc, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                        Tier 0{idx + 1}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        {svc.price}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-stone-900">{svc.title}</h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{svc.desc}</p>

                    <div className="pt-2">
                      <div className="text-xs font-bold text-stone-900 mb-2 uppercase tracking-wider">
                        Key Deliverables:
                      </div>
                      <ul className="space-y-1.5 text-xs text-stone-600">
                        {svc.deliverables.map((d, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-stone-400" />
                      <span>{svc.turnaround}</span>
                    </span>
                    <button
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, serviceType: svc.title }));
                        handleNavClick("contact");
                      }}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1"
                    >
                      <span>Inquire Scope</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Process steps */}
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-stone-200">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
                  Methodology
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
                  Our 4-Phase Delivery Protocol
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: "01", title: "Forensic Discovery", text: "Site inspection, zoning codes review, soil reports, and client lifestyle questionnaire." },
                  { step: "02", title: "Conceptual Schematic", text: "Hand sketches, 3D volumetric massing studies, and preliminary budgetary envelope." },
                  { step: "03", title: "Parametric BIM", text: "Comprehensive construction drawings, structural calculation seals, and MEP coordination." },
                  { step: "04", title: "Site Realization", text: "Contractor supervision, periodic milestone audits, snag lists, and final handover." },
                ].map((p, i) => (
                  <div key={i} className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div className="text-2xl font-serif font-bold text-amber-600 mb-1">{p.step}</div>
                    <div className="font-serif font-bold text-stone-900 text-sm mb-1">{p.title}</div>
                    <div className="text-xs text-stone-600 leading-relaxed">{p.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 4: GALLERY
         ======================================================== */}
      {activeTab === "gallery" && (
        <div className="py-16 bg-stone-900 text-white min-h-[80vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                Visual Showcase
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mt-3">
                Project Gallery & Portfolio
              </h1>
              <p className="mt-4 text-stone-400 text-base leading-relaxed">
                Click any project card to inspect detailed architectural specifications, material palettes, and client briefs.
              </p>

              {/* Filter Pills */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                {[
                  { id: "all", label: "All Projects" },
                  { id: "commercial", label: "Commercial High-Rise" },
                  { id: "residential", label: "Luxury Residential" },
                  { id: "cultural", label: "Cultural & Civic" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setGalleryFilter(f.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      galleryFilter === f.id
                        ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20"
                        : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-stone-800/90 border border-stone-700 hover:border-amber-400 transition-all flex flex-col justify-between"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-xs text-amber-400 text-xs px-2.5 py-1 rounded-md font-semibold">
                      {project.categoryLabel}
                    </div>
                    <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                      <Eye className="h-4 w-4" />
                      <span>View Specifications</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>{project.location}</span>
                      <span>{project.year}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-stone-700/60 text-xs">
                      <span className="text-stone-400">Scale: <strong className="text-stone-200">{project.area}</strong></span>
                      <span className="text-amber-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Inspect <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          PROJECT DETAILS MODAL (LIGHTBOX)
         ======================================================== */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-stone-900 border border-stone-300">
            <div className="relative h-72 sm:h-80 w-full overflow-hidden">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-stone-900/80 hover:bg-stone-900 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-4 bg-stone-900/90 backdrop-blur-xs text-amber-400 text-xs px-3 py-1.5 rounded-lg font-bold">
                {selectedProject.categoryLabel}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <div className="text-xs text-stone-500 font-medium">
                  {selectedProject.location} • Completed in {selectedProject.year}
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
                  {selectedProject.title}
                </h3>
                <div className="text-xs font-bold text-amber-800 mt-1">
                  Client: {selectedProject.client}
                </div>
              </div>

              <p className="text-stone-600 text-sm leading-relaxed">
                {selectedProject.description}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
                  Architectural Highlights & Engineering Specs:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedProject.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-100 text-xs font-medium text-stone-800">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-900 block">Total Built-Up Area:</span>
                  <span className="text-base font-serif font-bold text-stone-900">{selectedProject.area}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setFormData((prev) => ({
                      ...prev,
                      message: `I am interested in designing a project similar to ${selectedProject.title} (${selectedProject.area}).`,
                    }));
                    handleNavClick("contact");
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Request Similar Blueprint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 5: CONTACT
         ======================================================== */}
      {activeTab === "contact" && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
                Direct Consultation
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 mt-3">
                Initiate Your Architectural Commission
              </h1>
              <p className="mt-4 text-stone-600 text-base leading-relaxed">
                Schedule a confidential consultation with our principal design partners to discuss your site, budget, and spatial objectives.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Office info */}
              <div className="lg:col-span-5 space-y-8">
                <div className="p-8 rounded-3xl bg-stone-900 text-white space-y-6">
                  <h3 className="text-2xl font-serif font-bold text-amber-400">Studio Headquarters</h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Our design atelier is open for client walkthroughs, material sample reviews, and scale model presentations by prior appointment.
                  </p>

                  <div className="space-y-4 pt-2 text-xs">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-white">Apex Horizon Studio Tower</div>
                        <div className="text-stone-400">Suite 800, Horizon Commercial District, Bandra-Kurla Complex, Mumbai, MH 400051</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-amber-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white">+91 (022) 4892-7400</div>
                        <div className="text-stone-400">Mon - Fri: 09:00 - 18:30 IST</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-amber-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white">consult@apexhorizonstudio.com</div>
                        <div className="text-stone-400">Average response within 1 business day</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-800">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Studio Open Today • Accepting Q3/Q4 Commissions</span>
                    </div>
                  </div>
                </div>

                {/* FAQ Accordion Preview */}
                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                  <h4 className="font-serif font-bold text-stone-900 text-base">Frequently Asked Questions</h4>
                  <div className="space-y-3 text-xs text-stone-600">
                    <div>
                      <strong className="text-stone-800 block">Do you undertake projects outside Mumbai?</strong>
                      <span>Yes, over 60% of our portfolio spans across Bengaluru, Delhi NCR, Hyderabad, and international locations.</span>
                    </div>
                    <div>
                      <strong className="text-stone-800 block">How are architectural fees structured?</strong>
                      <span>Depending on project complexity, fees are billed per square foot or as a fixed milestone schedule aligned with council sanctions and site casting.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="lg:col-span-7">
                <div className="p-8 sm:p-10 rounded-3xl bg-white border border-stone-200 shadow-xl">
                  {formSubmitted ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="h-16 w-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-stone-900">
                        Inquiry Successfully Registered
                      </h3>
                      <p className="text-sm text-stone-600 max-w-md mx-auto">
                        Thank you, <strong className="text-stone-900">{formData.name}</strong>. A senior associate from our architectural studio will contact you at <strong className="text-stone-900">{formData.email}</strong> within 24 business hours to arrange an initial schematic discovery session.
                      </p>
                      <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl inline-block text-xs font-mono text-stone-700">
                        Reference Dossier: APEX-2026-9481
                      </div>
                      <div className="pt-4">
                        <button
                          onClick={() => {
                            setFormSubmitted(false);
                            setFormData({
                              name: "",
                              email: "",
                              phone: "",
                              serviceType: "Architectural Planning & Blueprinting",
                              budget: "₹25 Lakhs - ₹50 Lakhs",
                              message: "",
                            });
                          }}
                          className="text-xs font-bold text-amber-700 hover:underline"
                        >
                          Submit Another Project Inquiry
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-5">
                      <div>
                        <h3 className="text-2xl font-serif font-bold text-stone-900">
                          Project Discovery Brief
                        </h3>
                        <p className="text-xs text-stone-500 mt-1">
                          Share your initial site specifications and spatial goals.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Vikramaditya Singhania"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-amber-600 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                            Business / Personal Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="vikram@enterprise.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-amber-600 text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                            Phone / WhatsApp
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 98200 12345"
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-amber-600 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                            Primary Architectural Service
                          </label>
                          <select
                            value={formData.serviceType}
                            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-amber-600 text-sm bg-white"
                          >
                            <option>Architectural Planning & Blueprinting</option>
                            <option>Bespoke Interior Architecture</option>
                            <option>Sustainable Green Building Audits</option>
                            <option>Structural Engineering & Feasibility</option>
                            <option>Landscape & Master Planning</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                          Estimated Construction / Design Budget
                        </label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-amber-600 text-sm bg-white"
                        >
                          <option>₹15 Lakhs - ₹25 Lakhs</option>
                          <option>₹25 Lakhs - ₹50 Lakhs</option>
                          <option>₹50 Lakhs - ₹1.5 Crores</option>
                          <option>₹1.5 Crores - ₹5+ Crores</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                          Project Description & Site Location *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Please describe your plot size, zoning requirements, target completion timeline, and spatial objectives..."
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-amber-600 text-sm resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider"
                      >
                        <Send className="h-4 w-4" />
                        <span>Submit Architectural Inquiry</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Footer */}
      <footer className="border-t border-stone-200 bg-stone-100 py-12 text-stone-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-stone-900 text-amber-400 font-serif font-bold flex items-center justify-center">
              A
            </div>
            <div>
              <div className="font-serif font-bold text-stone-900 text-sm">Apex Horizon Architectural Studio</div>
              <div className="text-[11px] text-stone-500">Demo 1: Static Business Website Prototype • Engineered by ViBa WebDev</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => handleNavClick("home")} className="hover:text-stone-900">Home</button>
            <button onClick={() => handleNavClick("about")} className="hover:text-stone-900">About</button>
            <button onClick={() => handleNavClick("services")} className="hover:text-stone-900">Services</button>
            <button onClick={() => handleNavClick("gallery")} className="hover:text-stone-900">Gallery</button>
            <button onClick={() => handleNavClick("contact")} className="hover:text-stone-900">Contact</button>
          </div>

          <div className="text-stone-500 text-[11px]">
            © 2026 Apex Horizon Design Atelier. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
