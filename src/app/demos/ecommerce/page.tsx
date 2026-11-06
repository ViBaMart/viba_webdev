/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  Star,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  QrCode,
  CheckCircle2,
  X,
  ChevronRight,
  Sparkles,
  Heart,
  Eye,
  Menu,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: "audio" | "workspace" | "lifestyle";
  categoryLabel: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  description: string;
  colors: { name: string; hex: string }[];
  inStock: boolean;
  stockCount: number;
  features: string[];
  specs: Record<string, string>;
}

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Aurelia Horizon ANC Studio Headphones",
    category: "audio",
    categoryLabel: "Audio",
    price: 14999,
    originalPrice: 19999,
    rating: 4.9,
    reviewCount: 142,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    badge: "Best Seller",
    description: "Hybrid active noise cancellation with 40mm titanium drivers, 45-hour battery reserve, and memory-foam acoustic protein leather earcups.",
    colors: [
      { name: "Matte Black", hex: "#1e293b" },
      { name: "Silver Frost", hex: "#94a3b8" },
      { name: "Warm Champagne", hex: "#d97706" },
    ],
    inStock: true,
    stockCount: 8,
    features: ["45-Hour Playtime with Fast Charge", "Multipoint Bluetooth 5.3 + AAC/LDAC", "Quad-mic beamforming voice isolation"],
    specs: {
      Driver: "40mm Titanium Dynamic",
      Battery: "45h ANC On / 60h ANC Off",
      Weight: "250g",
      Warranty: "2 Years Official Manufacturer",
    },
  },
  {
    id: "prod-2",
    name: "Apex Master Craft Mechanical Keyboard",
    category: "workspace",
    categoryLabel: "Workspace",
    price: 8499,
    originalPrice: 10999,
    rating: 4.8,
    reviewCount: 98,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    badge: "Staff Pick",
    description: "CNC-milled aerospace aluminum chassis with hot-swappable lubricated linear switches, gasket mounting, and south-facing RGB backlighting.",
    colors: [
      { name: "Midnight Navy", hex: "#0f172a" },
      { name: "Anodized Silver", hex: "#cbd5e1" },
    ],
    inStock: true,
    stockCount: 14,
    features: ["Gasket Mount for Cushioned Typing", "Hot-Swappable 5-Pin Switch Sockets", "Tri-Mode (Bluetooth, 2.4Ghz, Type-C)"],
    specs: {
      Layout: "75% Compact (82 Keys)",
      Switches: "Gateron Pro Yellow (Pre-Lubed)",
      Battery: "4000mAh Lithium Rechargeable",
      Connectivity: "Wireless + USB-C Braided",
    },
  },
  {
    id: "prod-3",
    name: "Lumina Balance Smart Studio Desk Lamp",
    category: "workspace",
    categoryLabel: "Workspace",
    price: 4999,
    originalPrice: 6499,
    rating: 4.7,
    reviewCount: 76,
    image: "https://images.unsplash.com/photo-1534972195531-a756b1126f24?auto=format&fit=crop&w=800&q=80",
    description: "Ultra-wide 800-lumen asymmetrical optical light bar with touch color temperature dialing, ambient sensor auto-dimming, and CRI 96+ clarity.",
    colors: [
      { name: "Space Gray", hex: "#334155" },
      { name: "Alpine White", hex: "#f8fafc" },
    ],
    inStock: true,
    stockCount: 19,
    features: ["CRI 96+ True Color Rendering", "Glare-Free Asymmetrical Optics", "Rotary Dial Wireless Puck Controller"],
    specs: {
      Brightness: "800 Lumens Max",
      ColorTemp: "2700K - 6500K Stepless",
      Power: "15W USB-C PD Powered",
      Mount: "Heavyweighted Cast Metal Base",
    },
  },
  {
    id: "prod-4",
    name: "Orbit MagLock 3-in-1 Fast Charging Station",
    category: "lifestyle",
    categoryLabel: "Lifestyle",
    price: 3799,
    originalPrice: 4999,
    rating: 4.9,
    reviewCount: 112,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
    description: "Simultaneously fast-charges smartphone, smartwatch, and wireless earbuds with MagSafe-compatible 15W Qi2 certified magnetic docking.",
    colors: [
      { name: "Matte Black", hex: "#1e293b" },
      { name: "Pure White", hex: "#f1f5f9" },
    ],
    inStock: true,
    stockCount: 22,
    features: ["15W Qi2 Certified Fast Magnetic Charging", "Aircraft Grade Aluminum Articulated Arm", "Foldable Travel Design"],
    specs: {
      Output: "Phone 15W + Watch 5W + Buds 5W",
      Input: "USB-C 30W Adapter Included",
      Weight: "185g",
      Certification: "Qi2, MFi, CE, FCC",
    },
  },
  {
    id: "prod-5",
    name: "Voyager Cordura All-Weather Commuter Pack",
    category: "lifestyle",
    categoryLabel: "Lifestyle",
    price: 5999,
    originalPrice: 7999,
    rating: 4.8,
    reviewCount: 84,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    description: "Water-resistant 500D Cordura nylon backpack with dedicated suspended 16-inch laptop cocoon, hidden luggage pass-through, and YKK Aquaguard zips.",
    colors: [
      { name: "Charcoal Slate", hex: "#334155" },
      { name: "Olive Field", hex: "#3f6212" },
    ],
    inStock: true,
    stockCount: 11,
    features: ["Weatherproof 500D Cordura Nylon", "Suspended 16-Inch MacBook Sleeve", "Magnetic Fidlock Buckles"],
    specs: {
      Capacity: "22 Liters Expandable",
      Zippers: "Genuine YKK AquaGuard",
      Dimensions: "46 x 30 x 15 cm",
      Warranty: "Lifetime Craftsmanship Guarantee",
    },
  },
  {
    id: "prod-6",
    name: "Aura Pulse OLED Smart Fitness Tracker",
    category: "lifestyle",
    categoryLabel: "Lifestyle",
    price: 6499,
    originalPrice: 8999,
    rating: 4.6,
    reviewCount: 65,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80",
    description: "Continuous SpO2, heart rate variability (HRV), and deep sleep stage analytics housed in a titanium casing with 14-day battery life.",
    colors: [
      { name: "Obsidian Black", hex: "#0f172a" },
      { name: "Titanium Silver", hex: "#cbd5e1" },
    ],
    inStock: true,
    stockCount: 16,
    features: ["14-Day Single Charge Endurance", "5ATM Water Resistance (50m Swim)", "Continuous Biometric Health AI"],
    specs: {
      Display: "1.47-inch AMOLED Curved",
      Sensors: "PPG Optical, 3-Axis Gyro, Barometer",
      Compatibility: "iOS & Android Companion App",
      Weight: "24g (without strap)",
    },
  },
];

const CART_STORAGE_KEY = "aurelia_ecommerce_cart_v1";

type PaymentMethod = "card" | "upi" | "cod";

function getInitialCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [
      {
        product: PRODUCTS[0],
        quantity: 1,
        selectedColor: PRODUCTS[0].colors[0].name,
      },
    ];
  }
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return [
    {
      product: PRODUCTS[0],
      quantity: 1,
      selectedColor: PRODUCTS[0].colors[0].name,
    },
  ];
}

export default function EcommerceDemoPage() {
  const [activeView, setActiveView] = useState<"home" | "products" | "cart" | "checkout">("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cart State (lazily initialized from localStorage without cascading renders)
  const [cart, setCart] = useState<CartItem[]>(getInitialCart);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Selected Color in modal
  const [modalColor, setModalColor] = useState<string>("");
  const [modalQuantity, setModalQuantity] = useState<number>(1);

  // Checkout State
  const [checkoutData, setCheckoutData] = useState({
    name: "Arunava Sharma",
    email: "arunava@example.com",
    phone: "+91 98450 11223",
    address: "Flat 402, Green Glen Heights, Bellandur",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560103",
    deliverySpeed: "standard", // standard or express
    paymentMethod: "card" as PaymentMethod, // card, upi, cod
    cardNumber: "4532 •••• •••• 8891",
    cardExpiry: "09/28",
    cardCvv: "•••",
    upiId: "arunava@oksbi",
  });
  const [orderPlaced, setOrderPlaced] = useState<{
    orderId: string;
    items: CartItem[];
    total: number;
    shipping: number;
    discount: number;
    date: string;
  } | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // Save cart to localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, colorName?: string) => {
    const color = colorName || product.colors[0].name;
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedColor === color
    );

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [...cart, { product, quantity, selectedColor: color }];
    }

    saveCart(updatedCart);
    setCartDrawerOpen(true);
  };

  const updateQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }
    saveCart(updated);
  };

  const removeFromCart = (index: number) => {
    const updated = cart.filter((_, i) => i !== index);
    saveCart(updated);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "VIBA10") {
      setDiscountPercent(10);
      setCouponMessage({ text: "Coupon VIBA10 Applied: 10% Off Entire Order!", success: true });
    } else if (couponCode.trim().toUpperCase() === "FREESHIP") {
      setDiscountPercent(5);
      setCouponMessage({ text: "Coupon FREESHIP Applied: Extra 5% Off!", success: true });
    } else {
      setCouponMessage({ text: "Invalid promo code. Try 'VIBA10'", success: false });
    }
  };

  // Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((cartSubtotal * discountPercent) / 100);
  const shippingCharge =
    checkoutData.deliverySpeed === "express" ? 150 : cartSubtotal >= 2000 ? 0 : 99;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingCharge);
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filtered and Sorted Products
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // featured
  });

  const handleOpenProductModal = (product: Product) => {
    setSelectedProduct(product);
    setModalColor(product.colors[0].name);
    setModalQuantity(1);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessingOrder(true);
    setTimeout(() => {
      const order = {
        orderId: `AUR-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...cart],
        total: grandTotal,
        shipping: shippingCharge,
        discount: discountAmount,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      };
      setOrderPlaced(order);
      saveCart([]); // Clear cart
      setIsProcessingOrder(false);
    }, 1200);
  };

  const handleNavigate = (view: "home" | "products" | "cart" | "checkout") => {
    setActiveView(view);
    setCartDrawerOpen(false);
    setSelectedProduct(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200">
      {/* 1. Promotional Micro-Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-between">
        <span className="hidden sm:inline">Use code <strong className="text-white bg-emerald-800 px-1.5 py-0.5 rounded font-mono">VIBA10</strong> for 10% instant discount at checkout!</span>
        <span className="mx-auto sm:mx-0">Free Express Delivery on orders above ₹2,000</span>
        <span className="hidden md:inline text-[11px] text-emerald-200">30-Day Risk-Free Returns</span>
      </div>

      {/* 2. Store Header */}
      <header className="sticky top-11 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => handleNavigate("home")}
            className="flex items-center gap-3 text-left group shrink-0"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:bg-emerald-700 transition-colors">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 block leading-tight">
                Aurelia
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700">
                Artisan Tech & Living
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <button
              onClick={() => handleNavigate("home")}
              className={`hover:text-emerald-700 transition-colors ${activeView === "home" ? "text-emerald-700 font-bold" : ""
                }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setSelectedCategory("all");
                handleNavigate("products");
              }}
              className={`hover:text-emerald-700 transition-colors ${activeView === "products" ? "text-emerald-700 font-bold" : ""
                }`}
            >
              All Products ({PRODUCTS.length})
            </button>
            <button
              onClick={() => {
                setSelectedCategory("audio");
                handleNavigate("products");
              }}
              className="hover:text-emerald-700 transition-colors"
            >
              Audio
            </button>
            <button
              onClick={() => {
                setSelectedCategory("workspace");
                handleNavigate("products");
              }}
              className="hover:text-emerald-700 transition-colors"
            >
              Workspace
            </button>
            <button
              onClick={() => {
                setSelectedCategory("lifestyle");
                handleNavigate("products");
              }}
              className="hover:text-emerald-700 transition-colors"
            >
              Lifestyle
            </button>
          </nav>

          {/* Search Bar (Quick filter) */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== "products") setActiveView("products");
              }}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs focus:outline-hidden focus:bg-white focus:border-emerald-600 transition-colors"
            />
          </div>

          {/* Right Action Icons: Cart & Checkout */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center gap-2"
              title="View Cart"
            >
              <ShoppingCart className="h-5 w-5 text-emerald-700" />
              <span className="hidden sm:inline text-xs font-bold font-mono">
                ₹{cartSubtotal.toLocaleString("en-IN")}
              </span>
              {totalItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {totalItemCount}
                </span>
              )}
            </button>

            {cart.length > 0 && (
              <button
                onClick={() => handleNavigate("checkout")}
                className="hidden sm:inline-flex bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Checkout
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeView !== "products") setActiveView("products");
                }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => handleNavigate("home")}
                className="p-2.5 rounded-lg bg-slate-50 text-left"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  handleNavigate("products");
                }}
                className="p-2.5 rounded-lg bg-slate-50 text-left"
              >
                All Products
              </button>
              <button
                onClick={() => {
                  setSelectedCategory("audio");
                  handleNavigate("products");
                }}
                className="p-2.5 rounded-lg bg-slate-50 text-left"
              >
                Audio
              </button>
              <button
                onClick={() => {
                  setSelectedCategory("workspace");
                  handleNavigate("products");
                }}
                className="p-2.5 rounded-lg bg-slate-50 text-left"
              >
                Workspace
              </button>
              <button
                onClick={() => {
                  setSelectedCategory("lifestyle");
                  handleNavigate("products");
                }}
                className="p-2.5 rounded-lg bg-slate-50 text-left"
              >
                Lifestyle
              </button>
              <button
                onClick={() => handleNavigate("checkout")}
                className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-left"
              >
                Checkout Now
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================
          VIEW 1: HOME
         ======================================================== */}
      {activeView === "home" && (
        <div>
          {/* Hero Banner */}
          <section className="relative overflow-hidden bg-slate-900 text-white py-16 lg:py-24">
            <div
              className="absolute inset-0 opacity-20 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1920&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Curated Autumn / Winter Collection 2026</span>
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                  Aesthetic Hardware for Inspired Workspaces.
                </h1>

                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
                  Elevate your daily rhythm with precision audio, tactile mechanical peripherals, and minimalist everyday carry engineered with zero compromise.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => handleNavigate("products")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                  >
                    <span>Shop All Products</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory("audio");
                      handleNavigate("products");
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-all border border-white/20"
                  >
                    Explore Studio Audio
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Guarantees Strip */}
          <section className="bg-white border-b border-slate-200 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-slate-600">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block">Free Express Delivery</strong>
                    <span>On all orders over ₹2,000</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <RotateCcw className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block">30-Day Hassle-Free Returns</strong>
                    <span>100% money-back guarantee</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block">2-Year Official Warranty</strong>
                    <span>Direct brand replacement</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block">Secure 256-Bit Checkout</strong>
                    <span>UPI, Cards, EMI & COD available</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Categories Grid */}
          <section className="py-16 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Shop by Department
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                    Featured Collections
                  </h2>
                </div>
                <button
                  onClick={() => handleNavigate("products")}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    cat: "audio",
                    title: "Acoustic & Studio Audio",
                    count: "Headphones, Monitors & DACs",
                    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
                  },
                  {
                    cat: "workspace",
                    title: "Ergonomic Workspace",
                    count: "Mechanical Keyboards & Desk Lamps",
                    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
                  },
                  {
                    cat: "lifestyle",
                    title: "Everyday Carry & Tech",
                    count: "Cordura Backpacks & MagLock Docks",
                    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
                  },
                ].map((c, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedCategory(c.cat);
                      handleNavigate("products");
                    }}
                    className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
                  >
                    <img
                      src={c.image}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                        {c.count}
                      </span>
                      <h3 className="text-xl font-bold mt-1 group-hover:text-emerald-300 transition-colors">
                        {c.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Trending Products Grid */}
          <section className="py-16 bg-white border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Community Favorites
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                    Trending This Week
                  </h2>
                </div>
                <button
                  onClick={() => handleNavigate("products")}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <span>See All {PRODUCTS.length} Items</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {PRODUCTS.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-emerald-300 hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div className="relative h-64 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => handleOpenProductModal(product)}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.badge && (
                        <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                          {product.badge}
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs p-1.5 rounded-full text-slate-600 hover:text-red-500 transition-colors shadow-xs">
                        <Heart className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="uppercase font-semibold text-emerald-700 tracking-wider">
                          {product.categoryLabel}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-slate-700">{product.rating}</span>
                          <span className="text-slate-400">({product.reviewCount})</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => handleOpenProductModal(product)}
                        className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="pt-2 flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-900 font-mono">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-slate-400 line-through font-mono">
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-0 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenProductModal(product)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================
          VIEW 2: PRODUCT LISTING (WITH FILTERS & SEARCH)
         ======================================================== */}
      {activeView === "products" && (
        <div className="py-12 bg-slate-50 min-h-[85vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header & Filter Controls Bar */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-emerald-700">
                    Store Catalog
                  </span>
                  <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
                    All Products ({filteredProducts.length})
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Category Pills */}
                  <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200">
                    {[
                      { id: "all", label: "All" },
                      { id: "audio", label: "Audio" },
                      { id: "workspace", label: "Workspace" },
                      { id: "lifestyle", label: "Lifestyle" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedCategory === cat.id
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                          }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    <option value="featured">Sort: Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Active Search Notification */}
              {searchQuery && (
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <span>Showing results matching &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 space-y-4">
                <Search className="h-10 w-10 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-800">No products found</h3>
                <p className="text-xs text-slate-500">Try adjusting your search query or category filters.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Reset Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-emerald-300 hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div
                      className="relative h-64 overflow-hidden bg-slate-100 cursor-pointer"
                      onClick={() => handleOpenProductModal(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.badge && (
                        <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                          {product.badge}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs">
                        <Eye className="h-4 w-4" />
                        <span>Quick View</span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="uppercase font-semibold text-emerald-700 tracking-wider">
                          {product.categoryLabel}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-slate-700">{product.rating}</span>
                          <span className="text-slate-400">({product.reviewCount})</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => handleOpenProductModal(product)}
                        className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="pt-2 flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-900 font-mono">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-slate-400 line-through font-mono">
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-0 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenProductModal(product)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors"
                      >
                        Inspect Specs
                      </button>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          PRODUCT DETAILS MODAL / LIGHTBOX
         ======================================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-slate-900 border border-slate-300">
            <div className="p-6 sm:p-8 relative">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left: Product Image & Badges */}
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-square">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedProduct.badge && (
                      <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-md shadow-xs">
                        {selectedProduct.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="h-4 w-4" /> In Stock ({selectedProduct.stockCount} units remaining)
                    </span>
                    <span>Ships within 24h</span>
                  </div>
                </div>

                {/* Right: Info, Price, Color Selector, Quantity, Actions */}
                <div className="space-y-6">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-widest text-emerald-700">
                      {selectedProduct.categoryLabel}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 leading-tight">
                      {selectedProduct.name}
                    </h2>

                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-800">{selectedProduct.rating} / 5.0</span>
                      </div>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 font-medium">{selectedProduct.reviewCount} Verified Buyer Reviews</span>
                    </div>
                  </div>

                  {/* Price Block */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-baseline gap-3">
                    <span className="text-3xl font-black text-slate-900 font-mono">
                      ₹{selectedProduct.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-slate-400 line-through font-mono">
                      ₹{selectedProduct.originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Save ₹{(selectedProduct.originalPrice - selectedProduct.price).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  {/* Color Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Selected Finish: <strong className="text-slate-900">{modalColor}</strong>
                    </label>
                    <div className="flex items-center gap-2">
                      {selectedProduct.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setModalColor(c.name)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${modalColor === c.name
                              ? "border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                            }`}
                        >
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-slate-300 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity and Cart Buttons */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1">
                        <button
                          onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-sm">{modalQuantity}</span>
                        <button
                          onClick={() => setModalQuantity(modalQuantity + 1)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(selectedProduct, modalQuantity, modalColor);
                          setSelectedProduct(null);
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add to Cart • ₹{(selectedProduct.price * modalQuantity).toLocaleString("en-IN")}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(selectedProduct, modalQuantity, modalColor);
                        setSelectedProduct(null);
                        handleNavigate("checkout");
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all text-center"
                    >
                      Instant Buy Now
                    </button>
                  </div>

                  {/* Technical Specifications Sheet */}
                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                      Technical Specifications:
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(selectedProduct.specs).map(([key, val]) => (
                        <div key={key} className="p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">{key}</span>
                          <span className="text-slate-900 font-semibold">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SLIDE-OVER SHOPPING CART DRAWER
         ======================================================== */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-emerald-700" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Your Cart ({totalItemCount} {totalItemCount === 1 ? "Item" : "Items"})
                </h3>
              </div>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free shipping indicator */}
            <div className="p-3 bg-emerald-50 border-b border-emerald-100 text-xs text-center text-emerald-900 font-medium">
              {cartSubtotal >= 2000 ? (
                <span className="font-bold flex items-center justify-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> You unlocked Free Express Shipping!
                </span>
              ) : (
                <span>
                  Add <strong>₹{(2000 - cartSubtotal).toLocaleString("en-IN")}</strong> more to qualify for Free Shipping!
                </span>
              )}
            </div>

            {/* Cart Item List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-700">Your shopping bag is empty</h4>
                  <p className="text-xs text-slate-500">Discover premium handcrafted essentials in our catalog.</p>
                  <button
                    onClick={() => {
                      setCartDrawerOpen(false);
                      handleNavigate("products");
                    }}
                    className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl mt-2"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}-${idx}`}
                    className="flex gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-xl object-cover shrink-0 bg-white"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 block">
                            Finish: {item.selectedColor}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="text-slate-400 hover:text-red-500 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white p-0.5 text-xs">
                          <button
                            onClick={() => updateQuantity(idx, -1)}
                            className="p-1 hover:bg-slate-100 rounded"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-7 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(idx, 1)}
                            className="p-1 hover:bg-slate-100 rounded"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="font-mono font-bold text-xs text-slate-900">
                          ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer & Checkout Action */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. VIBA10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs uppercase font-mono font-semibold"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold"
                  >
                    Apply
                  </button>
                </form>

                {couponMessage && (
                  <div
                    className={`text-[11px] font-medium p-1.5 rounded-lg text-center ${couponMessage.success
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {couponMessage.text}
                  </div>
                )}

                {/* Subtotals */}
                <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold text-slate-900">₹{cartSubtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex items-center justify-between text-emerald-700 font-bold">
                      <span>Promo Discount ({discountPercent}%):</span>
                      <span className="font-mono">-₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Estimated Shipping:</span>
                    <span className="font-bold text-slate-900">
                      {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                    <span>Grand Total:</span>
                    <span className="font-mono text-base text-emerald-700">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleNavigate("checkout")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 3: CHECKOUT INTERFACE
         ======================================================== */}
      {activeView === "checkout" && (
        <div className="py-12 bg-slate-50 min-h-[85vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-700">
                Secure SSL Gateway
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
                Checkout & Shipping
              </h1>
            </div>

            {orderPlaced ? (
              /* Order Confirmation Receipt Screen */
              <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-2xl text-center space-y-6">
                <div className="h-16 w-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Payment Successful & Order Confirmed!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2">
                    Thank you, <strong className="text-slate-900">{checkoutData.name}</strong>. Your payment was verified and processed securely.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-left">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Order Tracking Number:</span>
                    <span className="font-mono font-bold text-emerald-700">{orderPlaced.orderId}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Estimated Delivery:</span>
                    <span className="font-bold text-slate-800">In 2–3 Business Days</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Shipping To:</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {checkoutData.address}, {checkoutData.city} - {checkoutData.pincode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-900 font-bold">Total Paid:</span>
                    <span className="font-mono font-black text-base text-slate-900">
                      ₹{orderPlaced.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setOrderPlaced(null);
                      handleNavigate("products");
                    }}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-xs transition-all shadow-md"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="w-full sm:w-auto bg-white border border-slate-300 text-slate-800 font-bold py-3 px-6 rounded-xl text-xs hover:bg-slate-50 transition-colors"
                  >
                    Print Receipt
                  </button>
                </div>
              </div>
            ) : (
              /* Checkout Form & Order Summary */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left 7 cols: Shipping & Payment Form */}
                <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
                  {/* Step 1: Customer & Address */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">1</span>
                      <span>Customer & Delivery Address</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={checkoutData.name}
                          onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={checkoutData.email}
                          onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Mobile Phone *</label>
                        <input
                          type="tel"
                          required
                          value={checkoutData.phone}
                          onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Postal PIN Code *</label>
                        <input
                          type="text"
                          required
                          value={checkoutData.pincode}
                          onChange={(e) => setCheckoutData({ ...checkoutData, pincode: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div className="text-xs">
                      <label className="block text-slate-700 font-semibold mb-1">Street Address / Society *</label>
                      <input
                        type="text"
                        required
                        value={checkoutData.address}
                        onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-emerald-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">City</label>
                        <input
                          type="text"
                          value={checkoutData.city}
                          onChange={(e) => setCheckoutData({ ...checkoutData, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">State</label>
                        <input
                          type="text"
                          value={checkoutData.state}
                          onChange={(e) => setCheckoutData({ ...checkoutData, state: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Delivery Speed */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">2</span>
                      <span>Delivery Method</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <label
                        className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${checkoutData.deliverySpeed === "standard"
                            ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20"
                            : "border-slate-200 hover:border-slate-300"
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="delivery"
                            checked={checkoutData.deliverySpeed === "standard"}
                            onChange={() => setCheckoutData({ ...checkoutData, deliverySpeed: "standard" })}
                            className="accent-emerald-600"
                          />
                          <div>
                            <strong className="block text-slate-900">Standard Delivery</strong>
                            <span className="text-[11px] text-slate-500">3-5 Business Days</span>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-700">FREE</span>
                      </label>

                      <label
                        className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${checkoutData.deliverySpeed === "express"
                            ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20"
                            : "border-slate-200 hover:border-slate-300"
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="delivery"
                            checked={checkoutData.deliverySpeed === "express"}
                            onChange={() => setCheckoutData({ ...checkoutData, deliverySpeed: "express" })}
                            className="accent-emerald-600"
                          />
                          <div>
                            <strong className="block text-slate-900">Express Priority Air</strong>
                            <span className="text-[11px] text-slate-500">Guaranteed 24-48 Hours</span>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900 font-mono">₹150</span>
                      </label>
                    </div>
                  </div>

                  {/* Step 3: Payment Method */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">3</span>
                      <span>Payment Simulation</span>
                    </h3>

                    <div className="flex flex-wrap gap-2 text-xs">
                      {([
                        { id: "card", label: "Credit / Debit Card", icon: CreditCard },
                        { id: "upi", label: "Instant UPI / QR", icon: QrCode },
                        { id: "cod", label: "Cash on Delivery", icon: Truck },
                      ] as { id: PaymentMethod; label: string; icon: React.ComponentType<{ className?: string }> }[]).map((m) => {
                        const Icon = m.icon;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setCheckoutData({ ...checkoutData, paymentMethod: m.id })}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold border transition-all ${checkoutData.paymentMethod === m.id
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                              }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{m.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {checkoutData.paymentMethod === "card" && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">Simulated Card Number</label>
                          <input
                            type="text"
                            value={checkoutData.cardNumber}
                            onChange={(e) => setCheckoutData({ ...checkoutData, cardNumber: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-600 font-semibold mb-1">Expiry Date</label>
                            <input
                              type="text"
                              value={checkoutData.cardExpiry}
                              onChange={(e) => setCheckoutData({ ...checkoutData, cardExpiry: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 font-semibold mb-1">CVV</label>
                            <input
                              type="text"
                              value={checkoutData.cardCvv}
                              onChange={(e) => setCheckoutData({ ...checkoutData, cardCvv: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {checkoutData.paymentMethod === "upi" && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        <label className="block text-slate-600 font-semibold mb-1">Virtual Payment Address (VPA / UPI ID)</label>
                        <input
                          type="text"
                          value={checkoutData.upiId}
                          onChange={(e) => setCheckoutData({ ...checkoutData, upiId: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-xs"
                        />
                        <span className="text-[11px] text-slate-500">Supports Google Pay, PhonePe, Paytm & BHIM UPI</span>
                      </div>
                    )}

                    {checkoutData.paymentMethod === "cod" && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                        Pay cash or scan courier QR upon arrival at your doorstep. Standard identity verification applies.
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessingOrder || cart.length === 0}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                  >
                    {isProcessingOrder ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verifying 256-Bit SSL Payment...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Complete Order • ₹{grandTotal.toLocaleString("en-IN")}
                      </span>
                    )}
                  </button>
                </form>

                {/* Right 5 cols: Order Summary Sidebar */}
                <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">
                    Order Items ({totalItemCount})
                  </h3>

                  <div className="space-y-3 max-h-72 overflow-y-auto">
                    {cart.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-12 w-12 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 line-clamp-1">{item.product.name}</div>
                          <div className="text-[11px] text-slate-500">
                            Qty: {item.quantity} • {item.selectedColor}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-slate-900">
                          ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Breakdown */}
                  <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-mono font-bold text-slate-900">₹{cartSubtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between text-emerald-700 font-bold">
                        <span>Discount Coupon ({discountPercent}%):</span>
                        <span className="font-mono">-₹{discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Shipping ({checkoutData.deliverySpeed}):</span>
                      <span className="font-bold text-slate-900">
                        {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>GST (Included in pricing):</span>
                      <span className="font-mono text-slate-900">₹{Math.round((grandTotal * 18) / 118).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-base font-black text-slate-900">
                      <span>Total Amount:</span>
                      <span className="font-mono text-emerald-700">₹{grandTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Aurelia Artisan & Living</div>
              <div className="text-[11px] text-slate-500">Demo 3: E-Commerce Storefront Prototype • Engineered by ViBa WebDev</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => handleNavigate("home")} className="hover:text-slate-900">Home</button>
            <button onClick={() => handleNavigate("products")} className="hover:text-slate-900">Catalog</button>
            <button onClick={() => setCartDrawerOpen(true)} className="hover:text-slate-900">Bag ({totalItemCount})</button>
            <button onClick={() => handleNavigate("checkout")} className="hover:text-slate-900">Checkout</button>
          </div>

          <div className="text-slate-500 text-[11px]">
            © 2026 Aurelia Retail Goods. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
