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
  User,
  Package,
  MapPin,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Download,
  Check,
  Award,
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
    categoryLabel: "Studio Audio",
    price: 14999,
    originalPrice: 19999,
    rating: 4.9,
    reviewCount: 142,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85",
    badge: "Best Seller",
    description: "Hybrid active noise cancellation with 40mm titanium dynamic drivers, 45-hour battery reserve, and memory-foam acoustic protein leather ear cushions.",
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
      Weight: "250g Ultra-Lightweight",
      Warranty: "2 Years Official Manufacturer",
    },
  },
  {
    id: "prod-2",
    name: "Apex Master Craft Mechanical Keyboard",
    category: "workspace",
    categoryLabel: "Workspace Peripherals",
    price: 8499,
    originalPrice: 10999,
    rating: 4.8,
    reviewCount: 98,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85",
    badge: "Staff Pick",
    description: "CNC-milled aerospace aluminum chassis with hot-swappable factory-lubricated linear switches, gasket acoustic dampening, and south-facing RGB backlighting.",
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
    categoryLabel: "Workspace Peripherals",
    price: 4999,
    originalPrice: 6499,
    rating: 4.7,
    reviewCount: 76,
    image: "https://images.unsplash.com/photo-1534972195531-a756b1126f24?auto=format&fit=crop&w=1000&q=85",
    description: "Ultra-wide 800-lumen asymmetrical optical light bar with touch color temperature dialing, ambient optical auto-dimming, and CRI 96+ true color clarity.",
    colors: [
      { name: "Space Gray", hex: "#334155" },
      { name: "Alpine White", hex: "#f8fafc" },
    ],
    inStock: true,
    stockCount: 19,
    features: ["CRI 96+ True Color Rendering", "Glare-Free Asymmetrical Optics", "Rotary Dial Wireless Puck Controller"],
    specs: {
      Brightness: "800 Lumens Max Output",
      ColorTemp: "2700K - 6500K Stepless",
      Power: "15W USB-C PD Powered",
      Mount: "Heavyweighted Cast Metal Base",
    },
  },
  {
    id: "prod-4",
    name: "Orbit MagLock 3-in-1 Fast Charging Dock",
    category: "lifestyle",
    categoryLabel: "Everyday Carry",
    price: 3799,
    originalPrice: 4999,
    rating: 4.9,
    reviewCount: 112,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=85",
    badge: "Trending",
    description: "Simultaneously fast-charges smartphone, smartwatch, and wireless earbuds with MagSafe-compatible 15W Qi2 certified magnetic articulated docking.",
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
      Weight: "185g Travel-Friendly",
      Certification: "Qi2, MFi, CE, FCC Certified",
    },
  },
  {
    id: "prod-5",
    name: "Voyager Cordura All-Weather Commuter Pack",
    category: "lifestyle",
    categoryLabel: "Everyday Carry",
    price: 5999,
    originalPrice: 7999,
    rating: 4.8,
    reviewCount: 84,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",
    description: "Water-resistant 500D Cordura nylon backpack with dedicated suspended 16-inch laptop cocoon, hidden luggage pass-through, and YKK Aquaguard zips.",
    colors: [
      { name: "Charcoal Slate", hex: "#334155" },
      { name: "Olive Field", hex: "#3f6212" },
    ],
    inStock: true,
    stockCount: 11,
    features: ["Weatherproof 500D Cordura Nylon", "Suspended 16-Inch MacBook Sleeve", "Magnetic Fidlock Hardware Buckles"],
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
    categoryLabel: "Everyday Carry",
    price: 6499,
    originalPrice: 8999,
    rating: 4.6,
    reviewCount: 65,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=1000&q=85",
    description: "Continuous SpO2, heart rate variability (HRV), and deep sleep stage analytics housed in an aerospace titanium casing with 14-day single-charge endurance.",
    colors: [
      { name: "Obsidian Black", hex: "#0f172a" },
      { name: "Titanium Silver", hex: "#cbd5e1" },
    ],
    inStock: true,
    stockCount: 16,
    features: ["14-Day Single Charge Endurance", "5ATM Water Resistance (50m Swim)", "Continuous Biometric Health AI"],
    specs: {
      Display: "1.47-inch Curved AMOLED",
      Sensors: "PPG Optical, 3-Axis Gyro, Barometer",
      Compatibility: "iOS & Android Companion App",
      Weight: "24g (without strap)",
    },
  },
];

const CART_STORAGE_KEY = "aurelia_ecommerce_cart_v2";

type PaymentMethod = "card" | "upi" | "cod";
type AccountSubTab = "orders" | "addresses" | "payments" | "wishlist";

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
  const [activeView, setActiveView] = useState<"home" | "products" | "cart" | "checkout" | "account">("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Customer Account state
  const [accountSubTab, setAccountSubTab] = useState<AccountSubTab>("orders");
  const [wishlist, setWishlist] = useState<string[]>(["prod-1", "prod-2"]);

  // Cart State (lazily initialized from localStorage)
  const [cart, setCart] = useState<CartItem[]>(getInitialCart);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Selected Color & Quantity in modal
  const [modalColor, setModalColor] = useState<string>("");
  const [modalQuantity, setModalQuantity] = useState<number>(1);

  // Toast notice for interactions
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

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
    paymentMethod: "card" as PaymentMethod,
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

  const showToast = (msg: string) => {
    setNoticeMessage(msg);
    setTimeout(() => setNoticeMessage(null), 3000);
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
    showToast(`Added ${product.name} (${color}) to bag.`);
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
    showToast("Item removed from bag.");
  };

  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
      showToast("Removed from your saved wishlist.");
    } else {
      setWishlist([...wishlist, productId]);
      showToast("Saved to your wishlist.");
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "VIBA10") {
      setDiscountPercent(10);
      setCouponMessage({ text: "Coupon VIBA10 Applied: 10% Off Entire Order!", success: true });
    } else if (couponCode.trim().toUpperCase() === "FREESHIP") {
      setDiscountPercent(5);
      setCouponMessage({ text: "Coupon FREESHIP Applied: Extra 5% Off & Free Priority Delivery!", success: true });
    } else {
      setCouponMessage({ text: "Invalid promo code. Try 'VIBA10' or 'FREESHIP'", success: false });
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
    return 0;
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

  const handleNavigate = (view: "home" | "products" | "cart" | "checkout" | "account") => {
    setActiveView(view);
    setCartDrawerOpen(false);
    setSelectedProduct(null);
    setMobileMenuOpen(false);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0f172a] font-sans selection:bg-[#dcfce7] selection:text-[#065f46] antialiased">
      {/* 1. Promotional Micro-Bar */}
      <div className="bg-[#0f172a] text-[#e2e8f0] text-xs font-mono py-2 px-4 text-center border-b border-[#1e293b] flex items-center justify-between">
        <span className="hidden sm:inline">
          Use code <strong className="text-[#34d399] font-bold">VIBA10</strong> for 10% instant discount at checkout
        </span>
        <span className="mx-auto sm:mx-0">
          Complimentary Express Delivery on orders above ₹2,000
        </span>
        <span className="hidden md:inline text-[#94a3b8]">
          2-Year Comprehensive Brand Warranty
        </span>
      </div>

      {/* 2. Store Header */}
      <header className="sticky top-11 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavigate("home")}
            className="flex items-center gap-3.5 text-left group shrink-0 focus:outline-hidden"
          >
            <div className="h-10 w-10 rounded-sm bg-[#065f46] text-white flex items-center justify-center font-bold text-lg shadow-xs group-hover:bg-[#047857] transition-colors">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-[#0f172a] block leading-tight font-sans">
                Aurelia
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#059669] block mt-0.5">
                Artisan Tech & Living
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-[#64748b]">
            <button
              onClick={() => handleNavigate("home")}
              className={`hover:text-[#0f172a] transition-colors ${
                activeView === "home" ? "text-[#065f46] font-bold border-b-2 border-[#065f46] pb-1" : ""
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                setSelectedCategory("all");
                handleNavigate("products");
              }}
              className={`hover:text-[#0f172a] transition-colors ${
                activeView === "products" ? "text-[#065f46] font-bold border-b-2 border-[#065f46] pb-1" : ""
              }`}
            >
              Collections ({PRODUCTS.length})
            </button>
            <button
              onClick={() => {
                setSelectedCategory("audio");
                handleNavigate("products");
              }}
              className="hover:text-[#0f172a] transition-colors"
            >
              Audio
            </button>
            <button
              onClick={() => {
                setSelectedCategory("workspace");
                handleNavigate("products");
              }}
              className="hover:text-[#0f172a] transition-colors"
            >
              Workspace
            </button>
            <button
              onClick={() => {
                setSelectedCategory("lifestyle");
                handleNavigate("products");
              }}
              className="hover:text-[#0f172a] transition-colors"
            >
              Everyday Carry
            </button>
          </nav>

          {/* Search Input Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs relative font-mono text-xs">
            <Search className="h-3.5 w-3.5 text-[#94a3b8] absolute left-3.5" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== "products") setActiveView("products");
              }}
              className="w-full pl-9 pr-4 py-2 rounded-sm bg-[#f1f5f9] border border-[#e2e8f0] focus:outline-hidden focus:bg-white focus:border-[#059669] transition-all text-xs"
            />
          </div>

          {/* Right Action Icons: Account, Wishlist, Cart Drawer */}
          <div className="flex items-center gap-3">
            {/* Account Icon */}
            <button
              onClick={() => handleNavigate("account")}
              className={`p-2.5 rounded-sm border transition-colors flex items-center gap-1.5 text-xs font-mono ${
                activeView === "account"
                  ? "bg-[#065f46] text-white border-[#065f46]"
                  : "bg-white text-[#475569] border-[#e2e8f0] hover:text-[#0f172a] hover:bg-[#f8fafc]"
              }`}
              title="Customer Account Portal"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline font-semibold">Account</span>
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2.5 rounded-sm bg-[#065f46] hover:bg-[#047857] text-white transition-all flex items-center gap-2 shadow-xs"
              title="Open Shopping Bag"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-mono font-bold">
                ₹{cartSubtotal.toLocaleString("en-IN")}
              </span>
              {totalItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-[#0f172a] text-white text-[10px] font-mono font-bold flex items-center justify-center border-2 border-white">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-sm text-[#475569] hover:bg-[#f1f5f9]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#e2e8f0] bg-white px-4 pt-3 pb-6 space-y-3 font-mono text-xs">
            <div className="relative">
              <Search className="h-4 w-4 text-[#94a3b8] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeView !== "products") setActiveView("products");
                }}
                className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-[#f1f5f9] border border-[#e2e8f0] text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 font-semibold">
              <button
                onClick={() => handleNavigate("home")}
                className="p-3 rounded-sm bg-[#f8fafc] text-left border border-[#e2e8f0]"
              >
                Overview
              </button>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  handleNavigate("products");
                }}
                className="p-3 rounded-sm bg-[#f8fafc] text-left border border-[#e2e8f0]"
              >
                All Products
              </button>
              <button
                onClick={() => handleNavigate("account")}
                className="p-3 rounded-sm bg-[#ecfdf5] text-[#065f46] text-left border border-[#a7f3d0] font-bold"
              >
                My Account
              </button>
              <button
                onClick={() => handleNavigate("checkout")}
                className="p-3 rounded-sm bg-[#065f46] text-white text-left font-bold"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Interactive Toast Notification */}
      {noticeMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] text-white px-5 py-3 rounded-sm shadow-xl font-mono text-xs flex items-center gap-3 border border-[#334155] animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-[#34d399] shrink-0" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* ========================================================
          VIEW 1: OVERVIEW / LOOKBOOK (HOME)
         ======================================================== */}
      {activeView === "home" && (
        <main>
          {/* Hero Lookbook Banner */}
          <section className="relative overflow-hidden bg-[#0f172a] text-white py-20 sm:py-28 lg:py-36">
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=2000&q=85"
                alt="Minimalist luxury audio equipment"
                className="w-full h-full object-cover object-center opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/90 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl space-y-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#065f46]/40 text-[#34d399] border border-[#065f46] font-mono text-xs uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AUTUMN / WINTER 2026 COLLECTION</span>
                </span>

                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                  Precision Hardware for Inspired Workspaces.
                </h1>

                <p className="text-base sm:text-lg text-[#cbd5e1] leading-relaxed font-light">
                  Elevate your daily flow with acoustically tuned studio headphones, tactile mechanical peripherals, and minimalist everyday carry engineered with zero compromise.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <button
                    onClick={() => handleNavigate("products")}
                    className="bg-[#065f46] hover:bg-[#047857] text-white font-mono font-bold px-7 py-4 rounded-sm text-xs uppercase tracking-widest transition-all shadow-md inline-flex items-center gap-2"
                  >
                    <span>Shop Complete Catalog</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory("audio");
                      handleNavigate("products");
                    }}
                    className="bg-transparent hover:bg-white/10 text-white font-mono font-semibold px-7 py-4 rounded-sm text-xs uppercase tracking-widest transition-all border border-[#475569]"
                  >
                    Studio Audio
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Value Propositions Strip */}
          <section className="bg-white border-b border-[#e2e8f0] py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-[#475569]">
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-sm bg-[#f0fdf4] text-[#065f46] flex items-center justify-center shrink-0 border border-[#bbf7d0]">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-[#0f172a] block">Complimentary Shipping</strong>
                    <span className="text-[11px] text-[#64748b]">On orders exceeding ₹2,000</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-sm bg-[#f0fdf4] text-[#065f46] flex items-center justify-center shrink-0 border border-[#bbf7d0]">
                    <RotateCcw className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-[#0f172a] block">30-Day Risk-Free Trial</strong>
                    <span className="text-[11px] text-[#64748b]">Hassle-free doorstep pickup</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-sm bg-[#f0fdf4] text-[#065f46] flex items-center justify-center shrink-0 border border-[#bbf7d0]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-[#0f172a] block">2-Year Official Warranty</strong>
                    <span className="text-[11px] text-[#64748b]">Direct brand replacement</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-sm bg-[#f0fdf4] text-[#065f46] flex items-center justify-center shrink-0 border border-[#bbf7d0]">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="text-[#0f172a] block">256-Bit SSL Checkout</strong>
                    <span className="text-[11px] text-[#64748b]">UPI, RuPay, Cards & NetBanking</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Highlights Showcase Grid */}
          <section className="py-24 bg-[#fafaf9] border-b border-[#e2e8f0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#059669] font-bold block mb-1">
                    Curated Hardware
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] tracking-tight">
                    Seasonal Signature Releases
                  </h2>
                </div>
                <button
                  onClick={() => handleNavigate("products")}
                  className="text-xs font-mono uppercase tracking-wider text-[#065f46] hover:text-[#0f172a] font-bold inline-flex items-center gap-1.5 transition-colors self-start md:self-auto"
                >
                  <span>Explore All Products ({PRODUCTS.length})</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {PRODUCTS.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-sm border border-[#e2e8f0] overflow-hidden hover:border-[#065f46] hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div
                      className="relative aspect-4/3 overflow-hidden bg-[#f1f5f9] cursor-pointer"
                      onClick={() => handleOpenProductModal(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {product.badge && (
                        <div className="absolute top-3 left-3 bg-[#065f46] text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-xs shadow-xs font-bold">
                          {product.badge}
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
                          wishlist.includes(product.id)
                            ? "bg-white text-rose-600"
                            : "bg-white/90 text-[#64748b] hover:text-rose-600"
                        }`}
                        aria-label="Save to wishlist"
                      >
                        <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-rose-600" : ""}`} />
                      </button>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="uppercase text-[#059669] font-bold">
                          {product.categoryLabel}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-sans">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-[#0f172a]">{product.rating}</span>
                          <span className="text-[#94a3b8]">({product.reviewCount})</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => handleOpenProductModal(product)}
                        className="text-base font-bold text-[#0f172a] group-hover:text-[#065f46] transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-[#64748b] line-clamp-2 leading-relaxed font-light">
                        {product.description}
                      </p>

                      <div className="pt-2 flex items-baseline gap-2 font-mono">
                        <span className="text-xl font-bold text-[#0f172a]">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-[#94a3b8] line-through">
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] font-bold text-[#065f46] bg-[#ecfdf5] px-1.5 py-0.5 rounded-xs border border-[#a7f3d0]">
                          Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-0 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenProductModal(product)}
                        className="flex-1 py-2.5 rounded-sm border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#0f172a] text-xs font-mono uppercase tracking-wider font-bold transition-colors"
                      >
                        Specs
                      </button>
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="flex-1 py-2.5 rounded-sm bg-[#065f46] hover:bg-[#047857] text-white text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ========================================================
          VIEW 2: PRODUCT LISTING CATALOG
         ======================================================== */}
      {activeView === "products" && (
        <main className="py-12 bg-[#fafaf9] min-h-[85vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 space-y-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#059669] font-bold block mb-1">
                    Store Catalog
                  </span>
                  <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">
                    All Products ({filteredProducts.length})
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Category Filter Pills */}
                  <div className="flex items-center bg-white p-1 rounded-sm border border-[#e2e8f0] font-mono text-xs">
                    {[
                      { id: "all", label: "All Works" },
                      { id: "audio", label: "Audio" },
                      { id: "workspace", label: "Workspace" },
                      { id: "lifestyle", label: "Carry" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xs uppercase tracking-wider font-bold transition-all ${
                          selectedCategory === cat.id
                            ? "bg-[#065f46] text-white shadow-xs"
                            : "text-[#64748b] hover:text-[#0f172a]"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Sort Selector */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-sm bg-white border border-[#e2e8f0] text-xs font-mono text-[#0f172a] focus:outline-hidden"
                  >
                    <option value="featured">Sort: Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                  </select>
                </div>
              </div>

              {searchQuery && (
                <div className="flex items-center justify-between p-3 bg-white rounded-sm border border-[#e2e8f0] text-xs font-mono">
                  <span>Filtered by: &ldquo;<strong className="text-[#0f172a]">{searchQuery}</strong>&rdquo;</span>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-[#065f46] font-bold hover:underline"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-sm border border-[#e2e8f0] overflow-hidden hover:border-[#065f46] hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div
                    className="relative aspect-4/3 overflow-hidden bg-[#f1f5f9] cursor-pointer"
                    onClick={() => handleOpenProductModal(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-[#065f46] text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-xs shadow-xs font-bold">
                        {product.badge}
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors shadow-xs ${
                        wishlist.includes(product.id)
                          ? "bg-white text-rose-600"
                          : "bg-white/90 text-[#64748b] hover:text-rose-600"
                      }`}
                      aria-label="Save to wishlist"
                    >
                      <Heart className={`h-4 w-4 ${wishlist.includes(product.id) ? "fill-rose-600" : ""}`} />
                    </button>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="uppercase text-[#059669] font-bold">
                        {product.categoryLabel}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-sans">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-[#0f172a]">{product.rating}</span>
                        <span className="text-[#94a3b8]">({product.reviewCount})</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => handleOpenProductModal(product)}
                      className="text-base font-bold text-[#0f172a] group-hover:text-[#065f46] transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#64748b] line-clamp-2 leading-relaxed font-light">
                      {product.description}
                    </p>

                    <div className="pt-2 flex items-baseline gap-2 font-mono">
                      <span className="text-xl font-bold text-[#0f172a]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-[#94a3b8] line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] font-bold text-[#065f46] bg-[#ecfdf5] px-1.5 py-0.5 rounded-xs border border-[#a7f3d0]">
                        Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => handleOpenProductModal(product)}
                      className="flex-1 py-2.5 rounded-sm border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#0f172a] text-xs font-mono uppercase tracking-wider font-bold transition-colors"
                    >
                      Specs
                    </button>
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="flex-1 py-2.5 rounded-sm bg-[#065f46] hover:bg-[#047857] text-white text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          VIEW 3: CUSTOMER ACCOUNT INTERFACE (NEW & REQUESTED!)
         ======================================================== */}
      {activeView === "account" && (
        <main className="py-12 sm:py-16 bg-[#fafaf9] min-h-[85vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Customer Profile Banner Card */}
            <div className="bg-white border border-[#e2e8f0] p-6 sm:p-8 rounded-sm shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-sm bg-[#0f172a] text-white flex items-center justify-center font-bold text-2xl font-mono">
                  AS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a]">
                      Arunava Sharma
                    </h1>
                    <span className="px-2 py-0.5 rounded-xs bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-[10px] font-mono font-bold uppercase tracking-wider">
                      Gold Member
                    </span>
                  </div>
                  <div className="text-xs text-[#64748b] font-mono mt-0.5">
                    arunava@example.com • Member since March 2024
                  </div>
                  <div className="text-xs text-[#059669] font-mono mt-1 flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" />
                    <span>1,450 Aurelia Rewards Points Available</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavigate("products")}
                  className="bg-[#065f46] hover:bg-[#047857] text-white px-4 py-2.5 rounded-sm font-mono text-xs uppercase tracking-wider font-bold transition-all"
                >
                  Shop New Releases
                </button>
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex border-b border-[#e2e8f0] gap-4 font-mono text-xs uppercase tracking-wider">
              {[
                { id: "orders", label: "Orders & Tracking", icon: Package },
                { id: "addresses", label: "Saved Addresses", icon: MapPin },
                { id: "payments", label: "Payment Methods", icon: CreditCard },
                { id: "wishlist", label: `Wishlist (${wishlist.length})`, icon: Heart },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAccountSubTab(tab.id as AccountSubTab)}
                    className={`pb-3 border-b-2 font-bold flex items-center gap-2 transition-all ${
                      accountSubTab === tab.id
                        ? "border-[#065f46] text-[#065f46]"
                        : "border-transparent text-[#64748b] hover:text-[#0f172a]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-View 1: Orders & Tracking */}
            {accountSubTab === "orders" && (
              <div className="space-y-6">
                {/* Active Order Card */}
                <div className="bg-white border border-[#e2e8f0] p-6 sm:p-8 rounded-sm shadow-xs space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e8f0] pb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#059669] font-bold block mb-0.5">
                        In Transit • Priority Air Courier
                      </span>
                      <h3 className="text-base font-bold text-[#0f172a] font-mono">
                        Order AUR-892104 • ₹14,999
                      </h3>
                      <div className="text-xs text-[#64748b] font-mono">Placed on 5 Nov 2026 • Tracking: DTDC-99218204</div>
                    </div>

                    <button
                      onClick={() => showToast("Downloading Tax Invoice PDF...")}
                      className="px-3.5 py-1.5 rounded-sm border border-[#cbd5e1] hover:bg-[#f8fafc] text-xs font-mono font-bold text-[#0f172a] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Invoice PDF</span>
                    </button>
                  </div>

                  {/* 4-Step Tracking Bar */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center font-mono text-[11px]">
                      <div className="space-y-1">
                        <div className="h-2 rounded-full bg-[#065f46]" />
                        <span className="text-[#065f46] font-bold block">1. Confirmed</span>
                        <span className="text-[10px] text-[#64748b]">Nov 5, 10:30 AM</span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 rounded-full bg-[#065f46]" />
                        <span className="text-[#065f46] font-bold block">2. Packed</span>
                        <span className="text-[10px] text-[#64748b]">Nov 5, 03:45 PM</span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 rounded-full bg-[#065f46]" />
                        <span className="text-[#065f46] font-bold block">3. In Transit</span>
                        <span className="text-[10px] text-[#059669] font-bold">Bengaluru Hub</span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 rounded-full bg-[#e2e8f0]" />
                        <span className="text-[#94a3b8] block">4. Out for Delivery</span>
                        <span className="text-[10px] text-[#94a3b8]">Est. Tomorrow</span>
                      </div>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="flex items-center gap-4 p-4 bg-[#f8fafc] rounded-sm border border-[#e2e8f0]">
                    <img
                      src={PRODUCTS[0].image}
                      alt={PRODUCTS[0].name}
                      className="h-16 w-16 rounded-sm object-cover bg-white"
                    />
                    <div className="flex-1 font-mono text-xs">
                      <div className="font-bold text-[#0f172a] font-sans text-sm">{PRODUCTS[0].name}</div>
                      <div className="text-[#64748b]">Finish: Matte Black • Qty: 1</div>
                      <div className="text-[#059669] font-bold mt-0.5">₹14,999 • 2-Year Active Warranty</div>
                    </div>
                  </div>
                </div>

                {/* Past Completed Order */}
                <div className="bg-white border border-[#e2e8f0] p-6 rounded-sm shadow-xs space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
                    <div>
                      <span className="font-bold text-[#0f172a]">Order AUR-741289 • Delivered</span>
                      <div className="text-[11px] text-[#64748b]">Delivered on 18 Oct 2026 to Bellandur, Bengaluru</div>
                    </div>
                    <span className="font-bold text-[#0f172a]">₹8,499</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={PRODUCTS[1].image}
                      alt={PRODUCTS[1].name}
                      className="h-12 w-12 rounded-sm object-cover bg-white"
                    />
                    <div className="font-sans text-xs">
                      <div className="font-bold text-[#0f172a]">{PRODUCTS[1].name}</div>
                      <div className="text-[#64748b] font-mono text-[11px]">Finish: Midnight Navy</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-View 2: Saved Addresses */}
            {accountSubTab === "addresses" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                <div className="bg-white border-2 border-[#065f46] p-6 rounded-sm space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#065f46] bg-[#ecfdf5] px-2 py-0.5 rounded-xs">
                      Default Shipping Address
                    </span>
                    <span className="text-[#64748b]">Home</span>
                  </div>
                  <div className="font-sans font-bold text-sm text-[#0f172a]">Arunava Sharma</div>
                  <div className="text-[#64748b] leading-relaxed">
                    Flat 402, Green Glen Heights, Outer Ring Road, Bellandur<br />
                    Bengaluru, Karnataka - 560103<br />
                    Phone: +91 98450 11223
                  </div>
                </div>

                <div className="bg-white border border-[#e2e8f0] p-6 rounded-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded-xs">
                      Secondary Address
                    </span>
                    <span className="text-[#64748b]">Office</span>
                  </div>
                  <div className="font-sans font-bold text-sm text-[#0f172a]">Arunava Sharma (Work)</div>
                  <div className="text-[#64748b] leading-relaxed">
                    Tower B, 6th Floor, Ecospace Tech Park, Marathahalli<br />
                    Bengaluru, Karnataka - 560103<br />
                    Phone: +91 98450 11223
                  </div>
                </div>
              </div>
            )}

            {/* Sub-View 3: Payment Methods */}
            {accountSubTab === "payments" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                {/* Visual Card Component */}
                <div className="bg-[#0f172a] text-white p-6 rounded-sm space-y-6 shadow-md border border-[#334155]">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] tracking-widest text-[#34d399] uppercase">Primary Card</span>
                    <span className="font-bold text-sm">VISA</span>
                  </div>
                  <div className="text-lg tracking-widest font-mono">
                    4532 •••• •••• 8891
                  </div>
                  <div className="flex justify-between text-[11px] text-[#94a3b8]">
                    <div>
                      <span className="block text-[9px] uppercase">Cardholder</span>
                      <span className="text-white font-bold">ARUNAVA SHARMA</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase">Expires</span>
                      <span className="text-white font-bold">09/28</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#e2e8f0] p-6 rounded-sm space-y-4">
                  <div className="font-bold text-sm text-[#0f172a]">Verified UPI Handles</div>
                  <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm flex items-center justify-between">
                    <span className="text-[#0f172a] font-bold">arunava@oksbi</span>
                    <span className="text-[10px] text-[#059669] font-bold uppercase">Default UPI</span>
                  </div>
                  <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm flex items-center justify-between">
                    <span className="text-[#0f172a]">sharma.tech@icici</span>
                    <span className="text-[10px] text-[#64748b]">Verified</span>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-View 4: Wishlist */}
            {accountSubTab === "wishlist" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.length === 0 ? (
                  <div className="col-span-3 text-center py-16 bg-white border border-[#e2e8f0] rounded-sm font-mono text-xs text-[#64748b]">
                    Your wishlist is currently empty.
                  </div>
                ) : (
                  PRODUCTS.filter((p) => wishlist.includes(p.id)).map((p) => (
                    <div key={p.id} className="bg-white border border-[#e2e8f0] p-5 rounded-sm space-y-3 font-mono text-xs">
                      <img src={p.image} alt={p.name} className="h-36 w-full object-cover rounded-sm bg-[#f1f5f9]" />
                      <div className="font-sans font-bold text-sm text-[#0f172a] line-clamp-1">{p.name}</div>
                      <div className="text-[#065f46] font-bold text-base">₹{p.price.toLocaleString("en-IN")}</div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => addToCart(p, 1)}
                          className="flex-1 bg-[#065f46] hover:bg-[#047857] text-white py-2 rounded-sm font-bold uppercase tracking-wider"
                        >
                          Move to Bag
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="p-2 border border-[#e2e8f0] hover:bg-[#f8fafc] text-rose-500 rounded-sm"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      )}

      {/* ========================================================
          PRODUCT DETAILS MODAL (LIGHTBOX)
         ======================================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-sm max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-[#0f172a] border border-[#cbd5e1] animate-fadeIn">
            <div className="relative aspect-16/10 w-full overflow-hidden bg-[#f1f5f9]">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-[#0f172a]/80 hover:bg-[#0f172a] text-white p-2 rounded-full backdrop-blur-xs transition-colors"
                aria-label="Close product modal"
              >
                <X className="h-5 w-5" />
              </button>
              {selectedProduct.badge && (
                <div className="absolute bottom-4 left-4 bg-[#065f46] text-white text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-xs font-bold shadow-sm">
                  {selectedProduct.badge}
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#059669]">
                  <span className="uppercase font-bold">{selectedProduct.categoryLabel}</span>
                  <div className="flex items-center gap-1 text-amber-500 font-sans">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-[#0f172a]">{selectedProduct.rating}</span>
                    <span className="text-[#94a3b8]">({selectedProduct.reviewCount} customer reviews)</span>
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mt-1.5 font-sans">
                  {selectedProduct.name}
                </h3>
                <div className="flex items-baseline gap-3 mt-2 font-mono">
                  <span className="text-2xl font-bold text-[#0f172a]">
                    ₹{selectedProduct.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-[#94a3b8] line-through">
                    ₹{selectedProduct.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs font-bold text-[#065f46] bg-[#ecfdf5] px-2 py-0.5 rounded-xs border border-[#a7f3d0]">
                    Save {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}%
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#475569] leading-relaxed font-light">
                {selectedProduct.description}
              </p>

              {/* Color Swatch Selection */}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#64748b] block mb-2 font-bold">
                  Select Finish: <strong className="text-[#0f172a]">{modalColor || selectedProduct.colors[0].name}</strong>
                </span>
                <div className="flex items-center gap-3">
                  {selectedProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setModalColor(c.name)}
                      className={`h-8 w-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        modalColor === c.name ? "border-[#065f46] ring-2 ring-[#065f46]/30 scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {modalColor === c.name && (
                        <Check className="h-4 w-4 text-white drop-shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specifications Table */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0f172a] mb-2.5">
                  Technical Specifications:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {Object.entries(selectedProduct.specs).map(([key, val]) => (
                    <div key={key} className="p-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xs">
                      <span className="text-[#64748b] block text-[10px] uppercase font-bold">{key}</span>
                      <span className="text-[#0f172a] font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                <div className="flex items-center border border-[#cbd5e1] rounded-sm p-1 bg-white">
                  <button
                    onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                    className="p-1.5 hover:bg-[#f1f5f9] rounded-xs"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{modalQuantity}</span>
                  <button
                    onClick={() => setModalQuantity(modalQuantity + 1)}
                    className="p-1.5 hover:bg-[#f1f5f9] rounded-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    addToCart(selectedProduct, modalQuantity, modalColor || selectedProduct.colors[0].name);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 bg-[#065f46] hover:bg-[#047857] text-white py-3.5 px-6 rounded-sm uppercase tracking-wider font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add {modalQuantity} to Bag • ₹{(selectedProduct.price * modalQuantity).toLocaleString("en-IN")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SLIDE-OVER SHOPPING CART DRAWER
         ======================================================== */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/70 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between font-mono animate-fadeIn">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-[#065f46]" />
                <h3 className="font-bold text-sm text-[#0f172a] uppercase tracking-wider">
                  Shopping Bag ({totalItemCount})
                </h3>
              </div>
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="p-1.5 rounded-sm text-[#64748b] hover:bg-[#e2e8f0]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free shipping indicator */}
            <div className="p-3 bg-[#ecfdf5] border-b border-[#a7f3d0] text-xs text-center text-[#065f46]">
              {cartSubtotal >= 2000 ? (
                <span className="font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#059669]" />
                  <span>Unlocked Complimentary Express Shipping</span>
                </span>
              ) : (
                <span>
                  Add <strong>₹{(2000 - cartSubtotal).toLocaleString("en-IN")}</strong> more for Free Delivery
                </span>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <ShoppingBag className="h-10 w-10 text-[#cbd5e1] mx-auto" />
                  <div className="font-bold text-[#475569] text-sm">Your bag is empty</div>
                  <p className="text-xs text-[#94a3b8] font-light">Explore our curated collections to get started.</p>
                  <button
                    onClick={() => {
                      setCartDrawerOpen(false);
                      handleNavigate("products");
                    }}
                    className="bg-[#065f46] text-white font-bold text-xs px-5 py-2.5 rounded-sm uppercase tracking-wider mt-2"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}-${idx}`}
                    className="flex gap-3.5 p-3 rounded-sm bg-[#f8fafc] border border-[#e2e8f0]"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-xs object-cover shrink-0 bg-white"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="font-sans font-bold text-xs text-[#0f172a] line-clamp-1">
                            {item.product.name}
                          </h4>
                          <span className="text-[11px] text-[#64748b] block mt-0.5">
                            Finish: {item.selectedColor}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="text-[#94a3b8] hover:text-rose-500 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-[#cbd5e1] rounded-xs bg-white p-0.5 text-xs">
                          <button
                            onClick={() => updateQuantity(idx, -1)}
                            className="p-1 hover:bg-[#f1f5f9] rounded-xs"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(idx, 1)}
                            className="p-1 hover:bg-[#f1f5f9] rounded-xs"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="font-bold text-xs text-[#0f172a]">
                          ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Subtotals & Checkout CTA */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-[#e2e8f0] bg-[#f8fafc] space-y-3">
                {/* Coupon input */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Coupon (e.g. VIBA10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-sm bg-white border border-[#cbd5e1] uppercase font-bold"
                  />
                  <button
                    type="submit"
                    className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-4 py-2 rounded-sm uppercase tracking-wider font-bold"
                  >
                    Apply
                  </button>
                </form>

                {couponMessage && (
                  <div
                    className={`text-[11px] p-2 rounded-sm text-center ${
                      couponMessage.success
                        ? "bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {couponMessage.text}
                  </div>
                )}

                {/* Subtotals */}
                <div className="space-y-1.5 text-xs text-[#64748b] border-t border-[#e2e8f0] pt-3">
                  <div className="flex items-center justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-[#0f172a]">₹{cartSubtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex items-center justify-between text-[#065f46] font-bold">
                      <span>Promo Discount ({discountPercent}%):</span>
                      <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Shipping:</span>
                    <span className="font-bold text-[#0f172a]">
                      {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#e2e8f0] text-sm font-bold text-[#0f172a]">
                    <span>Total Amount:</span>
                    <span className="text-base text-[#065f46]">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleNavigate("checkout")}
                  className="w-full bg-[#065f46] hover:bg-[#047857] text-white font-bold py-3.5 px-4 rounded-sm text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
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
          VIEW 4: CHECKOUT FLOW
         ======================================================== */}
      {activeView === "checkout" && (
        <main className="py-12 sm:py-16 bg-[#fafaf9] min-h-[85vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <span className="text-xs font-mono uppercase tracking-widest text-[#059669] font-bold block mb-1">
                256-Bit SSL Encrypted Checkout
              </span>
              <h1 className="text-3xl font-bold text-[#0f172a] tracking-tight">
                Delivery & Payment Verification
              </h1>
            </div>

            {orderPlaced ? (
              /* Realistic Order Confirmation Screen */
              <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-sm bg-white border border-[#e2e8f0] shadow-xl text-center space-y-6 font-mono animate-fadeIn">
                <div className="h-16 w-16 bg-[#ecfdf5] text-[#065f46] rounded-full flex items-center justify-center mx-auto border border-[#a7f3d0]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div>
                  <h2 className="text-2xl font-sans font-bold text-[#0f172a]">
                    Payment Verified & Order Confirmed!
                  </h2>
                  <p className="text-xs text-[#64748b] mt-2 font-sans">
                    Thank you, <strong className="text-[#0f172a]">{checkoutData.name}</strong>. Your transaction has been registered and scheduled for dispatch.
                  </p>
                </div>

                <div className="p-5 bg-[#f8fafc] border border-[#e2e8f0] text-xs space-y-2.5 text-left rounded-sm">
                  <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                    <span className="text-[#64748b]">Order Dossier:</span>
                    <span className="font-bold text-[#065f46]">{orderPlaced.orderId}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                    <span className="text-[#64748b]">Estimated Delivery:</span>
                    <span className="font-bold text-[#0f172a]">Within 2–3 Business Days</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                    <span className="text-[#64748b]">Shipping Destination:</span>
                    <span className="font-semibold text-[#0f172a] text-right font-sans">
                      {checkoutData.address}, {checkoutData.city} - {checkoutData.pincode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 font-bold">
                    <span className="text-[#0f172a]">Total Amount Settled:</span>
                    <span className="text-base text-[#065f46]">
                      ₹{orderPlaced.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setOrderPlaced(null);
                      handleNavigate("products");
                    }}
                    className="w-full sm:w-auto bg-[#065f46] hover:bg-[#047857] text-white font-bold py-3 px-6 rounded-sm text-xs uppercase tracking-wider transition-all"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => handleNavigate("account")}
                    className="w-full sm:w-auto bg-white border border-[#cbd5e1] text-[#0f172a] font-bold py-3 px-6 rounded-sm text-xs uppercase tracking-wider hover:bg-[#f8fafc] transition-colors"
                  >
                    Track in Account
                  </button>
                </div>
              </div>
            ) : (
              /* Two-Column Checkout Layout */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
                  {/* Step 1: Customer Details */}
                  <div className="p-6 sm:p-8 bg-white border border-[#e2e8f0] rounded-sm space-y-4">
                    <h3 className="text-sm font-mono font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                      <span className="h-5 w-5 rounded-sm bg-[#065f46] text-white text-[11px] flex items-center justify-center">1</span>
                      <span>Delivery Details & Address</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <label className="block text-[#475569] font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={checkoutData.name}
                          onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-sm border border-[#cbd5e1] text-xs focus:outline-hidden focus:border-[#065f46] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[#475569] font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={checkoutData.email}
                          onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-sm border border-[#cbd5e1] text-xs focus:outline-hidden focus:border-[#065f46] bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <label className="block text-[#475569] font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                          Mobile WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={checkoutData.phone}
                          onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-sm border border-[#cbd5e1] text-xs focus:outline-hidden focus:border-[#065f46] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[#475569] font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                          Postal PIN Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={checkoutData.pincode}
                          onChange={(e) => setCheckoutData({ ...checkoutData, pincode: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-sm border border-[#cbd5e1] text-xs focus:outline-hidden focus:border-[#065f46] bg-white"
                        />
                      </div>
                    </div>

                    <div className="text-xs font-mono">
                      <label className="block text-[#475569] font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                        Street Address / Apartment *
                      </label>
                      <input
                        type="text"
                        required
                        value={checkoutData.address}
                        onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-sm border border-[#cbd5e1] text-xs focus:outline-hidden focus:border-[#065f46] bg-white"
                      />
                    </div>
                  </div>

                  {/* Step 2: Shipping Speed */}
                  <div className="p-6 sm:p-8 bg-white border border-[#e2e8f0] rounded-sm space-y-4 font-mono text-xs">
                    <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                      <span className="h-5 w-5 rounded-sm bg-[#065f46] text-white text-[11px] flex items-center justify-center">2</span>
                      <span>Delivery Method</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label
                        className={`p-4 rounded-sm border cursor-pointer flex items-center justify-between transition-all ${
                          checkoutData.deliverySpeed === "standard"
                            ? "border-[#065f46] bg-[#ecfdf5]"
                            : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="delivery"
                            checked={checkoutData.deliverySpeed === "standard"}
                            onChange={() => setCheckoutData({ ...checkoutData, deliverySpeed: "standard" })}
                            className="accent-[#065f46]"
                          />
                          <div>
                            <strong className="block text-[#0f172a]">Standard Delivery</strong>
                            <span className="text-[11px] text-[#64748b]">3–5 Business Days</span>
                          </div>
                        </div>
                        <span className="font-bold text-[#065f46]">FREE</span>
                      </label>

                      <label
                        className={`p-4 rounded-sm border cursor-pointer flex items-center justify-between transition-all ${
                          checkoutData.deliverySpeed === "express"
                            ? "border-[#065f46] bg-[#ecfdf5]"
                            : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="delivery"
                            checked={checkoutData.deliverySpeed === "express"}
                            onChange={() => setCheckoutData({ ...checkoutData, deliverySpeed: "express" })}
                            className="accent-[#065f46]"
                          />
                          <div>
                            <strong className="block text-[#0f172a]">Priority Air Express</strong>
                            <span className="text-[11px] text-[#64748b]">Guaranteed 24–48 Hours</span>
                          </div>
                        </div>
                        <span className="font-bold text-[#0f172a]">₹150</span>
                      </label>
                    </div>
                  </div>

                  {/* Step 3: Payment Method */}
                  <div className="p-6 sm:p-8 bg-white border border-[#e2e8f0] rounded-sm space-y-4 font-mono text-xs">
                    <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider flex items-center gap-2">
                      <span className="h-5 w-5 rounded-sm bg-[#065f46] text-white text-[11px] flex items-center justify-center">3</span>
                      <span>Payment Simulation</span>
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {([
                        { id: "card", label: "Cards", icon: CreditCard },
                        { id: "upi", label: "Instant UPI", icon: QrCode },
                        { id: "cod", label: "Cash on Delivery", icon: Truck },
                      ] as const).map((m) => {
                        const Icon = m.icon;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setCheckoutData({ ...checkoutData, paymentMethod: m.id })}
                            className={`flex items-center gap-2 px-4 py-2 rounded-sm font-bold border transition-all ${
                              checkoutData.paymentMethod === m.id
                                ? "bg-[#065f46] text-white border-[#065f46]"
                                : "bg-[#f8fafc] text-[#475569] border-[#e2e8f0]"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{m.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {checkoutData.paymentMethod === "card" && (
                      <div className="p-4 rounded-sm bg-[#f8fafc] border border-[#e2e8f0] space-y-3">
                        <div>
                          <label className="block text-[#64748b] mb-1 font-bold text-[11px]">Card Number</label>
                          <input
                            type="text"
                            value={checkoutData.cardNumber}
                            onChange={(e) => setCheckoutData({ ...checkoutData, cardNumber: e.target.value })}
                            className="w-full px-3 py-2 rounded-sm bg-white border border-[#cbd5e1]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[#64748b] mb-1 font-bold text-[11px]">Expiry</label>
                            <input
                              type="text"
                              value={checkoutData.cardExpiry}
                              onChange={(e) => setCheckoutData({ ...checkoutData, cardExpiry: e.target.value })}
                              className="w-full px-3 py-2 rounded-sm bg-white border border-[#cbd5e1]"
                            />
                          </div>
                          <div>
                            <label className="block text-[#64748b] mb-1 font-bold text-[11px]">CVV</label>
                            <input
                              type="text"
                              value={checkoutData.cardCvv}
                              onChange={(e) => setCheckoutData({ ...checkoutData, cardCvv: e.target.value })}
                              className="w-full px-3 py-2 rounded-sm bg-white border border-[#cbd5e1]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {checkoutData.paymentMethod === "upi" && (
                      <div className="p-4 rounded-sm bg-[#f8fafc] border border-[#e2e8f0] space-y-2">
                        <label className="block text-[#64748b] font-bold text-[11px]">UPI VPA Handle</label>
                        <input
                          type="text"
                          value={checkoutData.upiId}
                          onChange={(e) => setCheckoutData({ ...checkoutData, upiId: e.target.value })}
                          className="w-full px-3 py-2 rounded-sm bg-white border border-[#cbd5e1]"
                        />
                        <span className="text-[11px] text-[#64748b] block">Supports PhonePe, Google Pay, BHIM & Paytm</span>
                      </div>
                    )}

                    {checkoutData.paymentMethod === "cod" && (
                      <div className="p-4 rounded-sm bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#64748b]">
                        Pay cash or scan courier QR upon arrival at your doorstep. Standard identity verification applies.
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessingOrder || cart.length === 0}
                    className="w-full bg-[#065f46] hover:bg-[#047857] disabled:opacity-50 text-white font-mono font-bold py-4 px-6 rounded-sm text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
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

                {/* Right 5 cols: Order Items Summary */}
                <div className="lg:col-span-5 p-6 sm:p-8 bg-white border border-[#e2e8f0] rounded-sm space-y-4 font-mono text-xs">
                  <h3 className="font-bold text-[#0f172a] border-b border-[#e2e8f0] pb-3 uppercase tracking-wider">
                    Order Items ({totalItemCount})
                  </h3>

                  <div className="space-y-3 max-h-72 overflow-y-auto">
                    {cart.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-12 w-12 rounded-xs object-cover bg-[#f1f5f9] shrink-0"
                        />
                        <div className="flex-1">
                          <div className="font-sans font-bold text-[#0f172a] line-clamp-1">{item.product.name}</div>
                          <div className="text-[11px] text-[#64748b]">
                            Qty: {item.quantity} • {item.selectedColor}
                          </div>
                        </div>
                        <div className="font-bold text-[#0f172a]">
                          ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal breakdown */}
                  <div className="pt-4 border-t border-[#e2e8f0] space-y-2">
                    <div className="flex items-center justify-between text-[#64748b]">
                      <span>Subtotal:</span>
                      <span className="font-bold text-[#0f172a]">₹{cartSubtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between text-[#065f46] font-bold">
                        <span>Discount ({discountPercent}%):</span>
                        <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[#64748b]">
                      <span>Shipping:</span>
                      <span className="font-bold text-[#0f172a]">
                        {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#64748b]">
                      <span>GST (Included in pricing):</span>
                      <span className="text-[#0f172a]">₹{Math.round((grandTotal * 18) / 118).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0] text-sm font-bold text-[#0f172a]">
                      <span>Total Amount:</span>
                      <span className="text-base text-[#065f46]">₹{grandTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Upgraded Professional E-Commerce Footer */}
      <footer className="border-t border-[#e2e8f0] bg-white py-16 text-[#64748b] text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="space-y-3 font-sans">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-sm bg-[#065f46] text-white flex items-center justify-center font-bold">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-[#0f172a] text-base">Aurelia</div>
                  <div className="text-[10px] font-mono text-[#059669] uppercase tracking-widest">Artisan Hardware</div>
                </div>
              </div>
              <p className="text-xs text-[#64748b] leading-relaxed font-light">
                Precision studio audio, tactile mechanical peripherals, and minimalist everyday carry designed for longevity.
              </p>
            </div>

            <div>
              <div className="text-[#0f172a] font-bold uppercase tracking-wider mb-3">Customer Service</div>
              <ul className="space-y-2">
                <li><button onClick={() => handleNavigate("account")} className="hover:text-[#065f46]">Track Your Shipment</button></li>
                <li><button onClick={() => handleNavigate("account")} className="hover:text-[#065f46]">Warranty Registration</button></li>
                <li><button onClick={() => handleNavigate("account")} className="hover:text-[#065f46]">Returns & Exchange Portal</button></li>
                <li><button onClick={() => handleNavigate("products")} className="hover:text-[#065f46]">Corporate Bulk Gifting</button></li>
              </ul>
            </div>

            <div>
              <div className="text-[#0f172a] font-bold uppercase tracking-wider mb-3">Collections</div>
              <ul className="space-y-2">
                <li><button onClick={() => { setSelectedCategory("audio"); handleNavigate("products"); }} className="hover:text-[#065f46]">Studio Audio & ANC</button></li>
                <li><button onClick={() => { setSelectedCategory("workspace"); handleNavigate("products"); }} className="hover:text-[#065f46]">Mechanical Keyboards</button></li>
                <li><button onClick={() => { setSelectedCategory("lifestyle"); handleNavigate("products"); }} className="hover:text-[#065f46]">Cordura Commuter Packs</button></li>
                <li><button onClick={() => { setSelectedCategory("lifestyle"); handleNavigate("products"); }} className="hover:text-[#065f46]">Qi2 Magnetic Docks</button></li>
              </ul>
            </div>

            <div>
              <div className="text-[#0f172a] font-bold uppercase tracking-wider mb-3">Prototype Details</div>
              <div className="p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-sm space-y-1.5 text-[11px]">
                <div className="text-[#065f46] font-bold">Demo 3: E-Commerce Storefront</div>
                <div>Cart, Checkout & Customer Accounts</div>
                <div className="text-[#94a3b8]">Engineered by ViBa WebDev</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div>© 2026 Aurelia Retail Goods LLP. All rights reserved.</div>
            <div className="flex items-center gap-4 text-[#94a3b8]">
              <span>256-Bit SSL Secured</span>
              <span>•</span>
              <span>Official Manufacturer Warranty</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
