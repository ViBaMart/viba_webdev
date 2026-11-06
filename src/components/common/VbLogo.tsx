import React from "react";

interface VbLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
  variant?: "badge" | "plain";
}

export function VbLogo({
  className = "",
  size = "md",
  showText = true,
  textColor = "text-slate-900",
  subtextColor = "text-slate-500",
  variant = "badge",
}: VbLogoProps) {
  // Dimensions for SVG icon
  const iconDimensions = {
    sm: { width: 34, height: 34, viewBox: "0 0 64 64" },
    md: { width: 44, height: 44, viewBox: "0 0 64 64" },
    lg: { width: 56, height: 56, viewBox: "0 0 64 64" },
    xl: { width: 72, height: 72, viewBox: "0 0 64 64" },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* VB Merged Icon */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
          variant === "badge"
            ? "rounded-2xl p-1 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-md shadow-blue-600/25 border border-blue-400/30"
            : ""
        }`}
      >
        <svg
          width={iconDimensions.width}
          height={iconDimensions.height}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="ViBa Merged VB Logo"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="vb-blue-v" x1="8" y1="12" x2="32" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E0E7FF" />
            </linearGradient>
            <linearGradient id="vb-blue-b" x1="28" y1="12" x2="56" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <filter id="vb-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#0F172A" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Merged VB Monogram Vector */}
          <g filter="url(#vb-shadow)">
            {/* The Left V Stroke (Angles down into the merged center spine) */}
            <path
              d="M11 15L27 49H33L17 15H11Z"
              fill="url(#vb-blue-v)"
            />
            {/* The Shared Center Stem & B Structure */}
            {/* Vertical spine shared by V and B */}
            <path
              d="M27 15H35V49H27V15Z"
              fill="#FFFFFF"
            />
            {/* Upper Bowl of B - merges from center spine */}
            <path
              d="M33 15H43C48 15 51.5 18 51.5 22.5C51.5 27 48 30 43 30H33V15ZM39 25.5H42.5C44.5 25.5 46 24.5 46 22.5C46 20.5 44.5 19.5 42.5 19.5H39V25.5Z"
              fill="url(#vb-blue-b)"
            />
            {/* Lower Bowl of B - merges from waist to base */}
            <path
              d="M33 28H44.5C50 28 54 31.5 54 36.5C54 41.5 49.5 45 44 45H33V28ZM39 40.5H43.5C46 40.5 48 39 48 36.5C48 34 46 32.5 43.5 32.5H39V40.5Z"
              fill="url(#vb-blue-b)"
            />
            {/* Sleek dynamic connector dot in tech blue */}
            <circle cx="31" cy="49" r="2.5" fill="#38BDF8" />
          </g>
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight leading-none ${
                size === "sm"
                  ? "text-base"
                  : size === "md"
                  ? "text-lg sm:text-xl"
                  : size === "lg"
                  ? "text-2xl"
                  : "text-3xl"
              } ${textColor}`}
            >
              ViBa
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-200/80 rounded px-1.5 py-0.5">
              SOLUTIONS
            </span>
          </div>
          <span
            className={`font-medium tracking-wide uppercase leading-tight ${
              size === "sm"
                ? "text-[9px]"
                : "text-[10px] sm:text-[11px]"
            } ${subtextColor}`}
          >
            Web Development Solutions
          </span>
        </div>
      )}
    </div>
  );
}

