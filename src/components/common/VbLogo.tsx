import React from "react";
import Image from "next/image";

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
  const pixelDimensions = {
    sm: 36,
    md: 46,
    lg: 58,
    xl: 72,
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* VB Monogram Icon */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 overflow-hidden ${
          variant === "badge"
            ? "rounded-2xl shadow-md shadow-blue-600/20 border border-blue-400/30"
            : "rounded-xl"
        }`}
        style={{ width: `${pixelDimensions}px`, height: `${pixelDimensions}px` }}
      >
        <Image
          src="/vb-monogram-full.png"
          alt="ViBa Web Development Solutions VB Monogram"
          width={pixelDimensions}
          height={pixelDimensions}
          className="w-full h-full object-cover"
          priority
        />
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
