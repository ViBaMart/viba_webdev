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
    sm: 32,
    md: 40,
    lg: 48,
    xl: 60,
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 shrink-0 select-none ${className}`}>
      {/* VB Monogram Icon */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 overflow-hidden rounded-xl shadow-xs ${
          variant === "badge"
            ? "border border-blue-400/40 shadow-blue-500/10 ring-1 ring-blue-500/10"
            : ""
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
        <div className="flex flex-col text-left shrink-0">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight ${
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
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-200/80 rounded px-1.5 py-0.5">
              SOLUTIONS
            </span>
          </div>
          <span
            className={`hidden sm:block font-medium tracking-wide uppercase leading-tight mt-0.5 ${
              size === "sm"
                ? "text-[9px]"
                : "text-[10px]"
            } ${subtextColor}`}
          >
            Web Development Solutions
          </span>
        </div>
      )}
    </div>
  );
}
