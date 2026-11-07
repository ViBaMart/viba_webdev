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
  Award,
  Sparkles,
  Calendar,
  Globe2,
  FileText,
  SlidersHorizontal,
  ArrowUpRight,
} from "lucide-react";

interface GalleryProject {
  id: string;
  title: string;
  category: "commercial" | "residential" | "cultural" | "interiors";
  categoryLabel: string;
  location: string;
  year: string;
  area: string;
  image: string;
  client: string;
  description: string;
  highlights: string[];
  materials?: string[];
  certification?: string;
}

const GALLERY_PROJECTS: GalleryProject[] = [
  {
    id: "proj-1",
    title: "Vanguard Global Asset Headquarters",
    category: "commercial",
    categoryLabel: "Commercial High-Rise",
    location: "Bandra-Kurla Complex, Mumbai",
    year: "2025",
    area: "480,000 sq ft",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85",
    client: "Vanguard Global Asset Management",
    description: "A 36-story carbon-neutral headquarters utilizing kinetic solar louvers, triple-height biophilic atrium gardens, and rainwater harvesting cisterns integrated into the deep basement foundations.",
    highlights: ["LEED Platinum Certified (92 Points)", "42% Reduction in Peak HVAC Power", "Double-glazed acoustic facade rating STC 48"],
    materials: ["Architectural Terracotta", "Low-E Triple Glazing", "Post-Tensioned Recycled Concrete"],
    certification: "LEED Platinum",
  },
  {
    id: "proj-2",
    title: "The Solarium Coastal Eco-Villa",
    category: "residential",
    categoryLabel: "Luxury Residential",
    location: "Alibaug Coast, Maharashtra",
    year: "2024",
    area: "14,500 sq ft",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
    client: "Private Family Estate",
    description: "Cantilevered glass pavilion framing uninterrupted coastal panoramas. Built with hand-dressed local basalt stone walls, rooftop microgrid battery storage, and an infinity reservoir.",
    highlights: ["Passive Solar Microclimate Orientation", "Locally Quarried Basalt Stone", "Private Geothermal Sub-Soil Cooling Loop"],
    materials: ["Hand-Chiseled Basalt", "Burmese Teak Millwork", "Seamless Terrazzo Floors"],
    certification: "GRIHA 5-Star Exemplary",
  },
  {
    id: "proj-3",
    title: "National Heritage Library & Arts Pavilion",
    category: "cultural",
    categoryLabel: "Cultural & Civic",
    location: "Central Vista Precinct, New Delhi",
    year: "2025",
    area: "120,000 sq ft",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=1400&q=85",
    client: "Ministry of Culture & Arts Foundation",
    description: "Sculptural public library and auditorium inspired by traditional geometric jali screens, with daylight-optimized reading galleries and acoustic isolation timber shells.",
    highlights: ["Parametric Terracotta Screen Envelope", "Acoustic Resonance Rating NC-20", "Public Tiered Amphitheater Plaza"],
    materials: ["Perforated Sandstone Jali", "Structural Glulam Timber", "Acoustic Fabric Baffles"],
    certification: "IGBC Platinum Rated",
  },
  {
    id: "proj-4",
    title: "Nexus Therapeutics Innovation Campus",
    category: "commercial",
    categoryLabel: "Commercial High-Rise",
    location: "HITEC City, Hyderabad",
    year: "2024",
    area: "650,000 sq ft",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=85",
    client: "Nexus Therapeutics Labs",
    description: "Four interconnected R&D laboratory wings connected by elevated sky-bridges, rooftop botanical terraces, and Class 100 sterile containment cleanrooms.",
    highlights: ["ISO Class 5 Certified Cleanroom Architecture", "Zero-Discharge On-Site Water Treatment", "Rooftop 1.2MW Microgrid Integration"],
    materials: ["Anti-Microbial Phenolic Panels", "Electrochromic Smart Glass", "Exposed Cast Concrete"],
    certification: "LEED Gold Certified",
  },
  {
    id: "proj-5",
    title: "The Horizon Glass Sky-Residence",
    category: "residential",
    categoryLabel: "Luxury Residential",
    location: "Worli Sea Face, Mumbai",
    year: "2025",
    area: "8,200 sq ft",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
    client: "HNI Executive Suite",
    description: "Duplex penthouse offering 360-degree Arabian Sea views, frameless motorized glazing, book-matched Italian Carrara marble finishes, and private cantilevered plunge pool.",
    highlights: ["Custom Smart Home Automation Mesh", "Italian Carrara & Calacatta Stone", "Acoustically Decoupled Private Cinema"],
    materials: ["Calacatta Gold Marble", "Smoked Oak Joinery", "Acoustic Float Glass"],
    certification: "Bespoke Residential Commission",
  },
  {
    id: "proj-6",
    title: "Civic Botanical Conservatory & Forum",
    category: "cultural",
    categoryLabel: "Cultural & Civic",
    location: "Koregaon Park, Pune",
    year: "2023",
    area: "95,000 sq ft",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85",
    client: "Municipal Urban Beautification Council",
    description: "Geodesic lightweight steel-and-ETFE cushion dome complex harboring endangered tropical flora with a public botanical discovery center and open atrium cafe.",
    highlights: ["Self-Regulating Passive Microclimate", "Rainwater Mist Ultrasonic Irrigation", "Accessible Elevated Canopy Walkway"],
    materials: ["ETFE Multi-Layer Cushions", "Galvanized Space-Frame Steel", "Rammed Earth Retaining Walls"],
    certification: "GRIHA 5-Star Benchmark",
  },
  {
    id: "proj-7",
    title: "Serenade Corporate Private Lounge",
    category: "interiors",
    categoryLabel: "Interior Architecture",
    location: "Indiranagar, Bengaluru",
    year: "2025",
    area: "18,000 sq ft",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1400&q=85",
    client: "Serenade Capital Partners",
    description: "High-touch executive hospitality suite featuring curved fluted timber partitions, concealed architectural lighting, custom walnut boardroom tables, and discrete acoustic phone booths.",
    highlights: ["Custom Acoustical Fluted Wall Profiles", "Circadian Architectural Lighting Design", "Concealed Audio-Visual Infrastructure"],
    materials: ["American Walnut", "Brushed Brass Trims", "Acoustic Felt Baffles"],
    certification: "WELL Gold Certified",
  },
  {
    id: "proj-8",
    title: "Aura Lakeside Sanctuary Retreat",
    category: "residential",
    categoryLabel: "Luxury Residential",
    location: "Udaipur, Rajasthan",
    year: "2024",
    area: "22,000 sq ft",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1400&q=85",
    client: "Private Wellness Trust",
    description: "Lakeside stone pavilion honoring Mewar architectural archetypes through stepped water courts, open colonnades, handcrafted sandstone screens, and passive evaporative cooling.",
    highlights: ["Traditional Mewar Jharokha Adaptations", "Stepped Water Basin Cooling Courts", "Solar-Powered Radiant Floor Conditioning"],
    materials: ["Dholpur Beige Sandstone", "Lime Plaster (Chunam)", "Copper Roof Detailing"],
    certification: "Heritage Conservation Honors",
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
    company: "",
    serviceType: "Architectural Planning & Blueprinting",
    budget: "₹50 Lakhs - ₹1.5 Crores",
    location: "",
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

  const navItems: { id: StaticTab; label: string; number: string }[] = [
    { id: "home", label: "Overview", number: "01" },
    { id: "about", label: "Studio & Manifesto", number: "02" },
    { id: "services", label: "Practice & Scope", number: "03" },
    { id: "gallery", label: "Portfolio Works", number: "04" },
    { id: "contact", label: "Consultation", number: "05" },
  ];

  const handleNavClick = (tabId: StaticTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] font-sans selection:bg-[#e7d8c4] selection:text-[#1c1917] antialiased">
      {/* Editorial Top Authority Strip */}
      <div className="bg-[#1c1917] text-[#d6d0c7] text-[11px] font-mono tracking-widest uppercase border-b border-[#2d2925] px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#c28833]" />
          <span>Apex Horizon Studio • Architectural & Spatial Engineering</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[#9e9689]">
          <span>Mumbai • Bengaluru • Dubai</span>
          <span>COA Reg. No. CA/2012/58129</span>
          <span className="text-[#e8b96f]">Accepting Q3/Q4 Commissions</span>
        </div>
      </div>

      {/* Primary Brand Navigation Header */}
      <header className="sticky top-11 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e7e2db] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand Mark */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3.5 text-left group focus:outline-hidden"
          >
            <div className="h-11 w-11 rounded-sm bg-[#1c1917] text-[#e8b96f] flex items-center justify-center font-serif text-2xl font-bold border border-[#38332c] group-hover:border-[#c28833] transition-colors shadow-xs">
              A
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1c1917] block leading-tight">
                Apex Horizon
              </span>
              <span className="text-[10px] tracking-[0.22em] uppercase font-semibold text-[#8c6b38] block mt-0.5">
                Architectural Studio
              </span>
            </div>
          </button>

          {/* Desktop Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${
                    isActive
                      ? "text-[#1c1917] font-bold"
                      : "text-[#78716c] hover:text-[#1c1917]"
                  }`}
                >
                  <span className="text-[10px] font-mono text-[#a89f91] mr-1.5">{item.number}</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#8c6b38]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Header Action Button */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => handleNavClick("contact")}
              className="bg-[#1c1917] hover:bg-[#2d2925] text-[#faf8f5] px-5 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-widest transition-all border border-[#1c1917] hover:border-[#8c6b38] inline-flex items-center gap-2 shadow-xs group"
            >
              <span>Initiate Commission</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#e8b96f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-md text-[#1c1917] hover:bg-[#f0ece5] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#e7e2db] bg-[#faf8f5] px-5 py-6 space-y-2.5 animate-fadeIn">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-md text-xs uppercase tracking-wider font-semibold flex items-center justify-between ${
                  activeTab === item.id
                    ? "bg-[#1c1917] text-[#faf8f5]"
                    : "text-[#44403c] hover:bg-[#f0ece5]"
                }`}
              >
                <span>{item.label}</span>
                <span className="font-mono text-[10px] opacity-60">{item.number}</span>
              </button>
            ))}
            <div className="pt-3">
              <button
                onClick={() => handleNavClick("contact")}
                className="w-full bg-[#8c6b38] hover:bg-[#73572d] text-white py-3 rounded-md text-xs font-bold uppercase tracking-widest text-center"
              >
                Initiate Commission Brief
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================
          VIEW 1: OVERVIEW / HOME
         ======================================================== */}
      {activeTab === "home" && (
        <main>
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-[#141210] text-[#faf8f5] border-b border-[#2d2925]">
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85"
                alt="Contemporary architectural landmark"
                className="w-full h-full object-cover object-center opacity-30 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#141210] via-[#141210]/90 to-[#141210]/40" />
              <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#141210]/50 to-[#141210]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
              <div className="max-w-3xl space-y-7">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-sm bg-[#24201c] border border-[#3d3730] text-[#e8b96f] text-xs font-mono tracking-wider">
                  <Compass className="h-3.5 w-3.5 text-[#c28833]" />
                  <span>MONOGRAPH 2026 • SPATIAL FIDELITY & NET-ZERO MASSING</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-[#faf8f5] leading-[1.08]">
                  Architecture of Purpose, Permanence & Light.
                </h1>

                <p className="text-base sm:text-xl text-[#c7c1b7] leading-relaxed font-light max-w-2xl">
                  Apex Horizon engineers commercial corporate towers, civic landmarks, and bespoke luxury residences designed to endure for generations through sustainable materiality and rigorous digital-twin BIM precision.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <button
                    onClick={() => handleNavClick("gallery")}
                    className="bg-[#c28833] hover:bg-[#a97529] text-[#141210] font-bold px-7 py-4 rounded-sm text-xs uppercase tracking-widest transition-all shadow-md inline-flex items-center gap-2.5"
                  >
                    <span>Inspect Built Portfolio</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleNavClick("about")}
                    className="bg-transparent hover:bg-white/5 text-[#faf8f5] font-semibold px-7 py-4 rounded-sm text-xs uppercase tracking-widest transition-all border border-[#524a41] hover:border-[#e8b96f]"
                  >
                    Studio Philosophy
                  </button>
                </div>
              </div>

              {/* Verified Metrics Strip */}
              <div className="mt-20 pt-10 border-t border-[#2e2924] grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e8b96f]">14+</div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-[#9e9689] mt-1.5">Years of Practice</div>
                  <div className="text-xs text-[#736c61] mt-0.5">Established Mumbai 2012</div>
                </div>
                <div>
                  <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e8b96f]">320+</div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-[#9e9689] mt-1.5">Completed Structures</div>
                  <div className="text-xs text-[#736c61] mt-0.5">Across India & MENA</div>
                </div>
                <div>
                  <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e8b96f]">₹4,200 Cr</div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-[#9e9689] mt-1.5">Managed Commission Value</div>
                  <div className="text-xs text-[#736c61] mt-0.5">99.8% On-Budget Metric</div>
                </div>
                <div>
                  <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e8b96f]">28</div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-[#9e9689] mt-1.5">Design & Green Accolades</div>
                  <div className="text-xs text-[#736c61] mt-0.5">LEED & GRIHA Benchmarks</div>
                </div>
              </div>
            </div>
          </section>

          {/* Architectural Pillars / Studio Ethos */}
          <section className="py-24 sm:py-32 bg-[#faf8f5] border-b border-[#e7e2db]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mb-16">
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#8c6b38] font-bold block mb-2">
                  01 / Methodological Rigor
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1c1917] tracking-tight">
                  Engineered for Longevity, Daylight Fidelity, and Climate Resilience.
                </h2>
                <p className="mt-4 text-[#57534e] text-base leading-relaxed">
                  Every project at Apex Horizon is treated as an enduring civic contribution. We refuse transient stylistic novelty in favor of structural honesty, passive thermal comfort, and rigorous computational verification.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 sm:p-10 rounded-sm border border-[#e7e2db] shadow-xs hover:border-[#8c6b38] transition-all group">
                  <div className="h-12 w-12 rounded-sm bg-[#faf8f5] border border-[#e7e2db] text-[#8c6b38] flex items-center justify-center mb-6 group-hover:bg-[#1c1917] group-hover:text-[#e8b96f] transition-colors">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div className="text-[11px] font-mono text-[#a89f91] uppercase tracking-wider mb-2">Pillar 01</div>
                  <h3 className="text-xl font-serif font-bold text-[#1c1917] mb-3">Biophilic Climate Response</h3>
                  <p className="text-sm text-[#57534e] leading-relaxed">
                    Integration of natural light corridors, living vertical gardens, and computational solar shading that reduces active HVAC refrigeration load by up to 42%.
                  </p>
                </div>

                <div className="bg-white p-8 sm:p-10 rounded-sm border border-[#e7e2db] shadow-xs hover:border-[#8c6b38] transition-all group">
                  <div className="h-12 w-12 rounded-sm bg-[#faf8f5] border border-[#e7e2db] text-[#8c6b38] flex items-center justify-center mb-6 group-hover:bg-[#1c1917] group-hover:text-[#e8b96f] transition-colors">
                    <Layers className="h-6 w-6" />
                  </div>
                  <div className="text-[11px] font-mono text-[#a89f91] uppercase tracking-wider mb-2">Pillar 02</div>
                  <h3 className="text-xl font-serif font-bold text-[#1c1917] mb-3">Sub-Millimeter BIM Coordination</h3>
                  <p className="text-sm text-[#57534e] leading-relaxed">
                    Full Level-300 BIM coordination resolving MEP, structural rebar, and facade intersections prior to groundbreaking to prevent site rework.
                  </p>
                </div>

                <div className="bg-white p-8 sm:p-10 rounded-sm border border-[#e7e2db] shadow-xs hover:border-[#8c6b38] transition-all group">
                  <div className="h-12 w-12 rounded-sm bg-[#faf8f5] border border-[#e7e2db] text-[#8c6b38] flex items-center justify-center mb-6 group-hover:bg-[#1c1917] group-hover:text-[#e8b96f] transition-colors">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div className="text-[11px] font-mono text-[#a89f91] uppercase tracking-wider mb-2">Pillar 03</div>
                  <h3 className="text-xl font-serif font-bold text-[#1c1917] mb-3">Embodied Carbon Stewardship</h3>
                  <p className="text-sm text-[#57534e] leading-relaxed">
                    Prioritizing locally quarried basalt, regional sandstones, recycled fly-ash structural mixes, and FSC-certified timbers to ensure certified net-zero envelopes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Curated Landmark Projects Strip */}
          <section className="py-24 sm:py-32 bg-[#171513] text-[#faf8f5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                  <span className="text-[11px] font-mono tracking-widest uppercase text-[#e8b96f] font-bold block mb-2">
                    02 / Selected Works
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#faf8f5] tracking-tight">
                    Recent Architectural Commissions
                  </h2>
                </div>
                <button
                  onClick={() => handleNavClick("gallery")}
                  className="text-xs uppercase tracking-widest text-[#e8b96f] hover:text-white font-bold inline-flex items-center gap-2 transition-colors self-start md:self-auto"
                >
                  <span>Browse Full Monograph ({GALLERY_PROJECTS.length} Projects)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {GALLERY_PROJECTS.slice(0, 3).map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="group cursor-pointer bg-[#201d1a] border border-[#332e29] hover:border-[#c28833] transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-16/11 overflow-hidden bg-[#2b2723]">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-3 left-3 bg-[#171513]/90 text-[#e8b96f] text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 border border-[#38332c]">
                        {project.categoryLabel}
                      </div>
                      <div className="absolute inset-0 bg-[#171513]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider text-white">
                        <Eye className="h-4 w-4 text-[#e8b96f]" />
                        <span>Inspect Specs</span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-7 space-y-3">
                      <div className="text-[11px] font-mono text-[#9e9689] flex items-center justify-between">
                        <span>{project.location}</span>
                        <span>{project.year}</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#e8b96f] transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <p className="text-xs text-[#a89f91] line-clamp-2 leading-relaxed font-light">
                        {project.description}
                      </p>
                      <div className="pt-3 border-t border-[#2e2a25] flex items-center justify-between text-xs font-mono">
                        <span className="text-[#9e9689]">Area: <strong className="text-[#faf8f5]">{project.area}</strong></span>
                        <span className="text-[#e8b96f] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Details <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Client Monograph Quotation Strip */}
          <section className="py-24 bg-[#f0ece5] border-b border-[#e2dcd4]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#8c6b38] font-bold">
                Client Testimonial & Endorsement
              </span>
              <blockquote className="text-xl sm:text-3xl font-serif italic text-[#1c1917] leading-relaxed">
                “Apex Horizon delivered our corporate headquarters ahead of schedule with remarkable fidelity to the initial renders. Their mastery over daylighting and acoustic separation created an inspiring environment our executives and staff genuinely cherish.”
              </blockquote>
              <div className="pt-2">
                <div className="font-serif font-bold text-base text-[#1c1917]">Rajesh V. Singhania</div>
                <div className="text-xs text-[#78716c] font-mono mt-0.5">Managing Director, Vanguard Asset Management</div>
              </div>
            </div>
          </section>

          {/* Quick CTA strip */}
          <section className="py-20 bg-[#1c1917] text-[#faf8f5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <span className="text-[11px] font-mono text-[#e8b96f] uppercase tracking-widest block mb-1">
                  Commissioning Inquiries
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Preparing an Architectural or Interior Project?
                </h3>
                <p className="text-sm text-[#a89f91] mt-1 font-light">
                  Direct engagement with our founding partners for site feasibility, zoning review, and budgetary appraisal.
                </p>
              </div>
              <button
                onClick={() => handleNavClick("contact")}
                className="bg-[#c28833] hover:bg-[#a97529] text-[#141210] font-bold px-8 py-4 rounded-sm text-xs uppercase tracking-widest transition-all shrink-0"
              >
                Schedule Atelier Consultation
              </button>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================
          VIEW 2: STUDIO & MANIFESTO (ABOUT)
         ======================================================== */}
      {activeTab === "about" && (
        <main className="py-16 sm:py-24 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="max-w-3xl mb-16">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#8c6b38] font-bold block mb-2">
                Studio Monograph & History
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1c1917] tracking-tight">
                Architects of Purpose, Space, and Permanence.
              </h1>
              <p className="mt-4 text-[#57534e] text-base sm:text-lg leading-relaxed font-light">
                Founded in Mumbai in 2012, Apex Horizon is a boutique multidisciplinary architectural practice specializing in high-performance corporate towers, institutional campuses, and bespoke private estates.
              </p>
            </div>

            {/* Split Story Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
              <div className="lg:col-span-6 relative aspect-4/3 overflow-hidden rounded-sm border border-[#e7e2db] shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=85"
                  alt="Architectural studio modeling workshop"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 right-3 bg-[#1c1917]/90 text-[#e8b96f] text-[10px] font-mono px-3 py-1 uppercase tracking-wider">
                  BKC Design Atelier, Mumbai
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c1917]">
                  Our Studio Manifesto
                </h2>
                <p className="text-sm sm:text-base text-[#57534e] leading-relaxed">
                  We believe that authentic architecture begins with site forensics—analyzing seasonal solar angles, prevailing air corridors, rainfall basins, and regional geological conditions before a single line is drawn.
                </p>
                <div className="space-y-3 pt-2">
                  {[
                    "100% Digital Twin & BIM Coordination resolving MEP clashes prior to ground breaking",
                    "Stringent carbon accounting verifying embodied concrete and steel metrics",
                    "Direct partnerships with regional stonemasonry guilds and sustainable timber mills",
                    "Acoustic separation and passive natural ventilation engineered into core floorplates",
                  ].map((pt, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#44403c]">
                      <CheckCircle2 className="h-4 w-4 text-[#8c6b38] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Principal Leadership */}
            <div className="mb-24">
              <div className="max-w-2xl mb-12">
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#8c6b38] font-bold block mb-1">
                  Studio Principals
                </span>
                <h3 className="text-3xl font-serif font-bold text-[#1c1917]">
                  Design Partners & Technical Directors
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    name: "Ar. Vikramaditya Sen",
                    role: "Founding Partner & Chief Architect",
                    cred: "B.Arch (SPA Delhi), M.Arch (AA London), Fellow IIA",
                    bio: "Over 22 years spearheading major institutional campuses, commercial high-rises, and passive cooling building envelopes across South Asia.",
                  },
                  {
                    name: "Ar. Sunita Merchant",
                    role: "Design Principal & Interior Architecture Director",
                    cred: "M.Des (Politecnico di Milano), LEED AP BD+C",
                    bio: "Directs luxury residential interior commissions, bespoke furniture joinery details, and biophilic indoor landscape installations.",
                  },
                  {
                    name: "Dr. Farhan Qureshi",
                    role: "Structural & Sustainability Consultant",
                    cred: "Ph.D. Civil Engineering (IIT Bombay), GRIHA Evaluator",
                    bio: "Leads computational seismic simulation, deep foundation engineering, and net-zero thermal massing audits.",
                  },
                ].map((member, i) => (
                  <div key={i} className="bg-white p-8 rounded-sm border border-[#e7e2db] space-y-4 shadow-xs">
                    <div className="h-12 w-12 rounded-sm bg-[#1c1917] text-[#e8b96f] font-serif font-bold text-lg flex items-center justify-center">
                      0{i + 1}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#1c1917]">{member.name}</h4>
                      <div className="text-xs font-mono text-[#8c6b38] uppercase tracking-wider mt-0.5">{member.role}</div>
                      <div className="text-[11px] text-[#78716c] font-mono mt-1">{member.cred}</div>
                    </div>
                    <p className="text-xs text-[#57534e] leading-relaxed font-light">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Studio Timeline */}
            <div className="p-8 sm:p-12 bg-[#1c1917] text-[#faf8f5] rounded-sm border border-[#2e2a25]">
              <div className="max-w-xl mb-10">
                <span className="text-[11px] font-mono text-[#e8b96f] uppercase tracking-widest block mb-1">Chronology</span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">Studio Milestones & Accreditation</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="border-l-2 border-[#8c6b38] pl-5 space-y-1">
                  <div className="text-xs font-mono text-[#e8b96f]">2012</div>
                  <div className="font-serif font-bold text-white">Studio Founded</div>
                  <div className="text-xs text-[#9e9689] font-light">Established in South Mumbai with an initial atelier of four architects.</div>
                </div>
                <div className="border-l-2 border-[#8c6b38] pl-5 space-y-1">
                  <div className="text-xs font-mono text-[#e8b96f]">2016</div>
                  <div className="font-serif font-bold text-white">National Honors</div>
                  <div className="text-xs text-[#9e9689] font-light">Awarded Commercial Architect of the Year for Vanguard schematic.</div>
                </div>
                <div className="border-l-2 border-[#8c6b38] pl-5 space-y-1">
                  <div className="text-xs font-mono text-[#e8b96f]">2021</div>
                  <div className="font-serif font-bold text-white">Net-Zero Standard</div>
                  <div className="text-xs text-[#9e9689] font-light">All new studio commissions mandated to meet LEED Platinum or GRIHA 5-Star.</div>
                </div>
                <div className="border-l-2 border-[#8c6b38] pl-5 space-y-1">
                  <div className="text-xs font-mono text-[#e8b96f]">2026</div>
                  <div className="font-serif font-bold text-white">Cross-Border Practice</div>
                  <div className="text-xs text-[#9e9689] font-light">Over 320 projects delivered across India, GCC, and Southeast Asia.</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          VIEW 3: PRACTICE & SCOPE (SERVICES)
         ======================================================== */}
      {activeTab === "services" && (
        <main className="py-16 sm:py-24 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#8c6b38] font-bold block mb-2">
                03 / Comprehensive Architectural Practice
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1c1917] tracking-tight">
                Architectural & Spatial Disciplines.
              </h1>
              <p className="mt-4 text-[#57534e] text-base leading-relaxed font-light">
                From preliminary site viability analysis through turnkey structural sign-off, we provide fully coordinated design services certified to international codes.
              </p>
            </div>

            {/* Scope Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {[
                {
                  title: "Architectural Planning & Blueprinting",
                  price: "From ₹45 / sq ft",
                  turnaround: "4-6 weeks for complete schematics",
                  desc: "Comprehensive 2D spatial layouts, 3D parametric massing models, structural load coordination, and municipal sanction clearances.",
                  deliverables: ["Full architectural drawing sets", "3D photorealistic render suite", "Municipal sanction dossiers"],
                },
                {
                  title: "Bespoke Interior Architecture",
                  price: "From ₹65 / sq ft",
                  turnaround: "3-5 weeks",
                  desc: "Custom corporate and luxury residential interior fit-outs with custom joinery details, acoustic engineering, and curated material specifications.",
                  deliverables: ["Reflected ceiling plans", "Custom millwork joinery details", "Lighting fixture schedules & lux studies"],
                },
                {
                  title: "Sustainable Green Building Audits",
                  price: "From ₹1.5 Lakhs flat",
                  turnaround: "2-3 weeks",
                  desc: "Energy simulation, daylight factor computation, embodied carbon audits, and documentation preparation for LEED Platinum and GRIHA 5-Star ratings.",
                  deliverables: ["ASHRAE 90.1 energy models", "Sun path & shading studies", "Official green certification dossier"],
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
                  className="bg-white rounded-sm border border-[#e7e2db] p-8 shadow-xs flex flex-col justify-between hover:border-[#8c6b38] transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#f0ece5] pb-3">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8c6b38]">
                        Tier 0{idx + 1}
                      </span>
                      <span className="text-xs font-mono px-2.5 py-1 bg-[#faf8f5] text-[#1c1917] border border-[#e7e2db]">
                        {svc.price}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-[#1c1917]">{svc.title}</h3>
                    <p className="text-xs text-[#57534e] leading-relaxed font-light">{svc.desc}</p>

                    <div className="pt-2">
                      <div className="text-[11px] font-mono font-bold text-[#1c1917] mb-2 uppercase tracking-wider">
                        Deliverables:
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#57534e]">
                        {svc.deliverables.map((d, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="h-3.5 w-3.5 text-[#8c6b38] shrink-0" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#f0ece5] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#78716c] flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#a89f91]" />
                      <span>{svc.turnaround}</span>
                    </span>
                    <button
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, serviceType: svc.title }));
                        handleNavClick("contact");
                      }}
                      className="text-xs font-mono font-bold text-[#8c6b38] hover:text-[#1c1917] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Inquire Scope</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 4-Phase Delivery Protocol */}
            <div className="bg-[#1c1917] text-[#faf8f5] p-8 sm:p-12 rounded-sm border border-[#2e2a25]">
              <div className="max-w-xl mb-10">
                <span className="text-[11px] font-mono text-[#e8b96f] uppercase tracking-widest block mb-1">
                  Structured Methodology
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Our 4-Phase Delivery Protocol
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: "01", title: "Forensic Discovery", text: "Site survey, zoning code audit, soil geotechnical report, and client spatial brief." },
                  { step: "02", title: "Conceptual Schematic", text: "Hand sketches, 3D volumetric massing studies, solar trajectory and preliminary budget." },
                  { step: "03", title: "Parametric BIM", text: "Detailed construction drawing sets, structural calculation seals, and MEP coordination." },
                  { step: "04", title: "Site Realization", text: "Contractor supervision, bi-weekly snag audits, material checks, and occupancy handoff." },
                ].map((p, i) => (
                  <div key={i} className="p-5 bg-[#24201c] border border-[#38332c] rounded-sm">
                    <div className="text-2xl font-serif font-bold text-[#e8b96f] mb-1">{p.step}</div>
                    <div className="font-serif font-bold text-white text-base mb-1">{p.title}</div>
                    <div className="text-xs text-[#a89f91] leading-relaxed font-light">{p.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          VIEW 4: PORTFOLIO WORKS (GALLERY)
         ======================================================== */}
      {activeTab === "gallery" && (
        <main className="py-16 sm:py-24 bg-[#141210] text-[#faf8f5] min-h-[85vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#e8b96f] font-bold block mb-2">
                04 / Architectural Archive
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight">
                Project Monograph & Portfolio.
              </h1>
              <p className="mt-4 text-[#a89f91] text-base leading-relaxed font-light">
                Click any project card to inspect structural highlights, materials palette, and verified engineering certifications.
              </p>

              {/* Filter Pills */}
              <div className="mt-8 flex flex-wrap items-center gap-2">
                {[
                  { id: "all", label: "All Works" },
                  { id: "commercial", label: "Commercial High-Rise" },
                  { id: "residential", label: "Luxury Residential" },
                  { id: "cultural", label: "Cultural & Civic" },
                  { id: "interiors", label: "Interior Architecture" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setGalleryFilter(f.id)}
                    className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-all ${
                      galleryFilter === f.id
                        ? "bg-[#c28833] text-[#141210] font-bold shadow-xs"
                        : "bg-[#201d1a] text-[#a89f91] hover:text-white border border-[#332e29]"
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
                  className="group cursor-pointer bg-[#1c1917] border border-[#2e2a25] hover:border-[#c28833] transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-16/11 overflow-hidden bg-[#24201c]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-[#141210]/90 text-[#e8b96f] text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 border border-[#38332c]">
                      {project.categoryLabel}
                    </div>
                    {project.certification && (
                      <div className="absolute top-3 right-3 bg-[#141210]/90 text-white text-[10px] font-mono px-2 py-0.5 border border-[#38332c]">
                        {project.certification}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-[#141210]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider text-white">
                      <Eye className="h-4 w-4 text-[#e8b96f]" />
                      <span>Inspect Blueprint</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#9e9689]">
                      <span>{project.location}</span>
                      <span>{project.year}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#e8b96f] transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#a89f91] line-clamp-2 leading-relaxed font-light">
                      {project.description}
                    </p>
                    <div className="pt-3 border-t border-[#2e2a25] flex items-center justify-between text-xs font-mono">
                      <span className="text-[#9e9689]">Scale: <strong className="text-white">{project.area}</strong></span>
                      <span className="text-[#e8b96f] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Specs <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          PROJECT DETAILS MODAL (LIGHTBOX)
         ======================================================== */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-[#141210]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-sm max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-[#1c1917] border border-[#e7e2db] animate-fadeIn">
            <div className="relative aspect-16/9 w-full overflow-hidden bg-[#1c1917]">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-[#141210]/80 hover:bg-[#141210] text-white p-2 rounded-full backdrop-blur-xs transition-colors"
                aria-label="Close project modal"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-4 bg-[#141210]/90 text-[#e8b96f] text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-sm border border-[#38332c]">
                {selectedProject.categoryLabel} • {selectedProject.year}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <div className="text-xs font-mono text-[#78716c]">
                  Location: {selectedProject.location} • Client: {selectedProject.client}
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c1917] mt-1.5">
                  {selectedProject.title}
                </h3>
              </div>

              <p className="text-sm text-[#57534e] leading-relaxed">
                {selectedProject.description}
              </p>

              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1c1917] mb-3">
                  Architectural Highlights & Engineering Specs:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedProject.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-sm bg-[#faf8f5] text-xs font-medium text-[#44403c] border border-[#e7e2db]">
                      <CheckCircle2 className="h-4 w-4 text-[#8c6b38] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedProject.materials && (
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#1c1917] mb-2">
                    Primary Materiality:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.materials.map((mat, i) => (
                      <span key={i} className="px-3 py-1 bg-[#f0ece5] text-xs font-mono text-[#57534e] border border-[#e2dcd4]">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 sm:p-5 bg-[#faf8f5] border border-[#e7e2db] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-[#78716c] block">Built-Up Gross Floor Area:</span>
                  <span className="text-lg font-serif font-bold text-[#1c1917]">{selectedProject.area}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setFormData((prev) => ({
                      ...prev,
                      message: `Inquiry regarding commissioning a project similar to ${selectedProject.title} (${selectedProject.area}, ${selectedProject.location}).`,
                    }));
                    handleNavClick("contact");
                  }}
                  className="bg-[#1c1917] hover:bg-[#2d2925] text-[#e8b96f] px-5 py-2.5 rounded-sm text-xs font-mono font-bold uppercase tracking-wider transition-colors text-center"
                >
                  Request Similar Blueprint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 5: CONSULTATION BRIEF (CONTACT)
         ======================================================== */}
      {activeTab === "contact" && (
        <main className="py-16 sm:py-24 bg-[#faf8f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#8c6b38] font-bold block mb-2">
                05 / Initiate Consultation
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1c1917] tracking-tight">
                Architectural Commission Brief.
              </h1>
              <p className="mt-4 text-[#57534e] text-base leading-relaxed font-light">
                Submit your initial site specifications and spatial objectives to arrange an architectural discovery consultation with our principal design partners.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Office & Atelier Info */}
              <div className="lg:col-span-5 space-y-8">
                <div className="p-8 rounded-sm bg-[#1c1917] text-[#faf8f5] border border-[#2e2a25] space-y-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#e8b96f] block mb-1">
                      Atelier Location
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-white">Studio Headquarters</h3>
                  </div>

                  <p className="text-xs text-[#a89f91] leading-relaxed font-light">
                    Our Bandra-Kurla Complex atelier is available for physical scale model inspections, materiality review, and private executive walkthroughs by prior appointment.
                  </p>

                  <div className="space-y-4 pt-2 text-xs font-light">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-[#e8b96f] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">Apex Horizon Studio Tower</div>
                        <div className="text-[#a89f91]">Suite 800, Horizon Commercial District, Bandra-Kurla Complex, Mumbai, MH 400051</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-[#e8b96f] shrink-0" />
                      <div>
                        <div className="font-semibold text-white">+91 (022) 4892-7400</div>
                        <div className="text-[#a89f91] font-mono">Mon - Fri: 09:00 - 18:30 IST</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-[#e8b96f] shrink-0" />
                      <div>
                        <div className="font-semibold text-white">consult@apexhorizonstudio.com</div>
                        <div className="text-[#a89f91]">Confidential executive correspondence</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#2e2a25]">
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-[#a89f91]">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Studio Active Today • Accepting Q3/Q4 Works</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white border border-[#e7e2db] rounded-sm space-y-4">
                  <h4 className="font-serif font-bold text-[#1c1917] text-base">Frequently Asked Questions</h4>
                  <div className="space-y-3 text-xs text-[#57534e]">
                    <div>
                      <strong className="text-[#1c1917] block mb-0.5">Do you take projects across India & overseas?</strong>
                      <span>Yes, over 60% of our portfolio spans Bengaluru, Delhi NCR, Hyderabad, Dubai, and Southeast Asia.</span>
                    </div>
                    <div>
                      <strong className="text-[#1c1917] block mb-0.5">How are professional architectural fees calculated?</strong>
                      <span>Fees are structured per built-up square foot or as staged milestones aligned with municipal sanctions and casting stages.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Inquiry Form */}
              <div className="lg:col-span-7">
                <div className="p-8 sm:p-10 bg-white border border-[#e7e2db] rounded-sm shadow-xs">
                  {formSubmitted ? (
                    <div className="text-center py-12 space-y-4 animate-fadeIn">
                      <div className="h-14 w-14 bg-[#f0ece5] text-[#8c6b38] rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-7 w-7" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-[#1c1917]">
                        Commission Brief Registered
                      </h3>
                      <p className="text-xs sm:text-sm text-[#57534e] max-w-md mx-auto leading-relaxed">
                        Thank you, <strong className="text-[#1c1917]">{formData.name}</strong>. A partner from our studio will contact you at <strong className="text-[#1c1917]">{formData.email}</strong> within one business day to arrange an initial schematic feasibility review.
                      </p>
                      <div className="p-3 bg-[#faf8f5] border border-[#e7e2db] rounded-sm inline-block text-xs font-mono text-[#78716c]">
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
                              company: "",
                              serviceType: "Architectural Planning & Blueprinting",
                              budget: "₹50 Lakhs - ₹1.5 Crores",
                              location: "",
                              message: "",
                            });
                          }}
                          className="text-xs font-mono font-bold text-[#8c6b38] hover:text-[#1c1917] underline underline-offset-4"
                        >
                          Submit Another Project Brief
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-5">
                      <div>
                        <h3 className="text-2xl font-serif font-bold text-[#1c1917]">
                          Project Discovery Brief
                        </h3>
                        <p className="text-xs text-[#78716c] font-light mt-1">
                          Please outline your site details, zoning parameters, and programmatic needs.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#44403c] mb-1.5">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Vikramaditya Singhania"
                            className="w-full px-4 py-2.5 rounded-sm border border-[#d6d0c7] focus:outline-hidden focus:border-[#8c6b38] text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#44403c] mb-1.5">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="vikram@vanguard.com"
                            className="w-full px-4 py-2.5 rounded-sm border border-[#d6d0c7] focus:outline-hidden focus:border-[#8c6b38] text-sm bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#44403c] mb-1.5">
                            Phone / WhatsApp
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 98200 12345"
                            className="w-full px-4 py-2.5 rounded-sm border border-[#d6d0c7] focus:outline-hidden focus:border-[#8c6b38] text-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#44403c] mb-1.5">
                            Project Location / City
                          </label>
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="e.g. Alibaug, Maharashtra"
                            className="w-full px-4 py-2.5 rounded-sm border border-[#d6d0c7] focus:outline-hidden focus:border-[#8c6b38] text-sm bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#44403c] mb-1.5">
                            Architectural Scope
                          </label>
                          <select
                            value={formData.serviceType}
                            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-sm border border-[#d6d0c7] focus:outline-hidden focus:border-[#8c6b38] text-xs font-mono bg-white"
                          >
                            <option>Architectural Planning & Blueprinting</option>
                            <option>Bespoke Interior Architecture</option>
                            <option>Sustainable Green Building Audits</option>
                            <option>Structural Engineering & Feasibility</option>
                            <option>Landscape & Master Planning</option>
                            <option>Construction Administration & QA</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#44403c] mb-1.5">
                            Estimated Budget Tier
                          </label>
                          <select
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-sm border border-[#d6d0c7] focus:outline-hidden focus:border-[#8c6b38] text-xs font-mono bg-white"
                          >
                            <option>₹25 Lakhs - ₹50 Lakhs</option>
                            <option>₹50 Lakhs - ₹1.5 Crores</option>
                            <option>₹1.5 Crores - ₹5 Crores</option>
                            <option>₹5+ Crores (Institutional / Masterplan)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#44403c] mb-1.5">
                          Project Description & Programmatic Goals *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Describe your site area, zoning guidelines, preferred architectural typology, and desired completion timeline..."
                          className="w-full px-4 py-2.5 rounded-sm border border-[#d6d0c7] focus:outline-hidden focus:border-[#8c6b38] text-sm resize-none bg-white font-light"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#1c1917] hover:bg-[#2d2925] text-[#faf8f5] font-semibold py-3.5 px-6 rounded-sm text-xs font-mono uppercase tracking-widest transition-all shadow-xs flex items-center justify-center gap-2 border border-[#1c1917] hover:border-[#8c6b38]"
                      >
                        <Send className="h-3.5 w-3.5 text-[#e8b96f]" />
                        <span>Submit Architectural Brief</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Upgraded Professional Firm Footer */}
      <footer className="border-t border-[#e7e2db] bg-[#1c1917] text-[#a89f91] py-16 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-sm bg-[#2b2723] text-[#e8b96f] font-serif font-bold text-lg flex items-center justify-center border border-[#3d3730]">
                  A
                </div>
                <div>
                  <div className="font-serif font-bold text-white text-base">Apex Horizon</div>
                  <div className="text-[10px] font-mono tracking-widest uppercase text-[#8c6b38]">Architectural Studio</div>
                </div>
              </div>
              <p className="text-xs text-[#857e74] leading-relaxed font-light">
                High-performance spatial engineering, parametric digital twins, and climate-positive civic landmarks.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#faf8f5] mb-3">
                Studio Navigation
              </div>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className="hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#faf8f5] mb-3">
                Practices
              </div>
              <ul className="space-y-2 text-[#857e74]">
                <li>Commercial Towers & Campuses</li>
                <li>Luxury Private Residences</li>
                <li>Civic & Cultural Institutions</li>
                <li>LEED & GRIHA Green Certification</li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#faf8f5] mb-3">
                Prototype Dossier
              </div>
              <div className="p-3.5 bg-[#24201c] border border-[#332e29] rounded-sm space-y-1.5 font-mono text-[11px]">
                <div className="text-[#e8b96f]">Demo 1: Static Architecture Site</div>
                <div className="text-[#857e74]">Speed Index: 0.28s • Zero Server Lag</div>
                <div className="text-[#857e74]">Engineered by ViBa WebDev</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#2e2a25] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#736c61]">
            <div>© 2026 Apex Horizon Studio LLP. All architectural rights reserved.</div>
            <div>COA Registration No. CA/2012/58129 • ISO 9001:2015 Practice</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
