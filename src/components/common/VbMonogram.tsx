import React from "react";
import Image from "next/image";

interface VbMonogramProps {
  className?: string;
  size?: number | string;
  title?: string;
  variant?: "full" | "transparent";
}

/**
 * ViBa Web Development Solutions - Official VB Monogram
 *
 * Design features:
 * - Pure VB monogram: Merged stylized letters V and B into an iconic technology glyph
 * - Modern navy blue to electric cyan/azure gradient with white diagonal accents
 * - Clean geometric shapes with high contrast
 * - High resolution 1:1 aspect ratio with transparent and full background variants
 */
export function VbMonogram({
  className = "",
  size,
  title = "ViBa Web Development Solutions VB Monogram",
  variant = "full",
}: VbMonogramProps) {
  const defaultSize = size ? (typeof size === "number" ? size : parseInt(String(size), 10) || 48) : 48;
  const src = variant === "transparent" ? "/vb-monogram.png" : "/vb-monogram-full.png";

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-xl ${className}`}
      style={
        size
          ? {
              width: typeof size === "number" ? `${size}px` : size,
              height: typeof size === "number" ? `${size}px` : size,
            }
          : undefined
      }
      title={title}
    >
      <Image
        src={src}
        alt={title}
        width={defaultSize}
        height={defaultSize}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );
}
