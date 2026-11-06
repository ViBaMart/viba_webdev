import React from "react";

interface VbMonogramProps {
  className?: string;
  size?: number | string;
  title?: string;
}

/**
 * ViBa Web Development Solutions - Official VB Monogram
 *
 * Design features:
 * - Interconnected V and B in a unified, modern tech glyph
 * - Deep navy blue into vibrant electric cyan gradient
 * - Integrated coding chevron '>' in the waist of the letter B
 * - Square 1:1 aspect ratio, centered, transparent background
 * - Optimized for legibility from 16x16 favicons to 512x512 retina icons
 */
export function VbMonogram({
  className = "",
  size = 64,
  title = "ViBa Web Development Solutions VB Monogram",
}: VbMonogramProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label={title}
      className={`overflow-visible ${className}`}
    >
      <defs>
        {/* Master Navy-to-Electric Cyan Brand Gradient */}
        <linearGradient id="vb-mono-brand-grad" x1="92" y1="96" x2="420" y2="416" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B132B" />
          <stop offset="25%" stopColor="#1C3782" />
          <stop offset="55%" stopColor="#1D4ED8" />
          <stop offset="78%" stopColor="#0284C7" />
          <stop offset="92%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#00F5FF" />
        </linearGradient>

        {/* Deep Navy Gradient for Left V Stroke */}
        <linearGradient id="vb-mono-v-grad" x1="92" y1="96" x2="276" y2="416" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="35%" stopColor="#1E3A8A" />
          <stop offset="70%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Electric Cyan Gradient for B Double Loops */}
        <linearGradient id="vb-mono-b-grad" x1="212" y1="96" x2="420" y2="416" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="40%" stopColor="#0284C7" />
          <stop offset="75%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#00F5FF" />
        </linearGradient>

        {/* Code Bracket Chevron Gradient */}
        <linearGradient id="vb-mono-chevron-grad" x1="326" y1="218" x2="392" y2="294" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#00F5FF" />
          <stop offset="100%" stopColor="#A5F3FC" />
        </linearGradient>
      </defs>

      <g id="viba-vb-monogram-root">
        {/* Left V Stroke */}
        <path
          d="M92 96 H156 L276 416 H212 L92 96 Z"
          fill="url(#vb-mono-v-grad)"
        />

        {/* Center Interconnected Spine */}
        <path
          d="M212 96 H276 V416 H212 V96 Z"
          fill="url(#vb-mono-brand-grad)"
        />

        {/* Letter B Double Loops */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M276 96
             H344
             C384 96 412 122 412 162
             C412 198 388 226 352 238
             L324 246
             L358 258
             C398 272 420 302 420 344
             C420 388 388 416 344 416
             H276
             V96 Z

             M276 150
             V214
             H338
             C358 214 372 202 372 182
             C372 162 358 150 338 150
             H276 Z

             M276 288
             V362
             H344
             C368 362 382 348 382 325
             C382 302 368 288 344 288
             H276 Z"
          fill="url(#vb-mono-b-grad)"
        />

        {/* Subtle Coding-Inspired Element: The Forward Angle Bracket (Chevron '>') */}
        <path
          d="M326 230 
             L364 256 
             L326 282 
             L342 294 
             L392 256 
             L342 218 
             Z"
          fill="url(#vb-mono-chevron-grad)"
        />

        {/* Base Convergence Anchor Dot */}
        <circle cx="244" cy="416" r="3.5" fill="#00F5FF" />
      </g>
    </svg>
  );
}
