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
 * - Pure VB monogram: Merged letters V and B into a single iconic technology glyph
 * - Modern navy blue (#0B132B / #1E3A8A) to electric cyan (#06B6D4 / #00F5FF) gradient
 * - Dynamic curved innovation swoosh arcing along the base
 * - Subtle coding symbol (`</>`) seamlessly integrated into the letter B waist
 * - Clean geometric vector curves, centered 1:1 square aspect ratio
 * - Transparent background, optimized for favicons (16x16, 32x32), navbar, and retina app icons
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
        {/* Navy to Cyan Gradient - Primary Brand */}
        <linearGradient id="vb-brand-gradient" x1="80" y1="96" x2="432" y2="416" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B132B" />
          <stop offset="22%" stopColor="#1E3A8A" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="75%" stopColor="#0284C7" />
          <stop offset="90%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#00F5FF" />
        </linearGradient>

        {/* Deep Navy Gradient for V Stroke */}
        <linearGradient id="vb-v-stroke-grad" x1="84" y1="96" x2="260" y2="416" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="40%" stopColor="#1E3A8A" />
          <stop offset="80%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Electric Cyan Gradient for B Loops */}
        <linearGradient id="vb-b-loops-grad" x1="220" y1="96" x2="432" y2="416" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="40%" stopColor="#0284C7" />
          <stop offset="75%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#00F5FF" />
        </linearGradient>

        {/* Dynamic Curved Tech Swoosh Gradient */}
        <linearGradient id="vb-swoosh-grad" x1="120" y1="430" x2="450" y2="280" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.2" />
          <stop offset="30%" stopColor="#0284C7" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#00F5FF" />
        </linearGradient>

        {/* Minimal Code Symbol Gradient */}
        <linearGradient id="vb-code-grad" x1="310" y1="230" x2="390" y2="285" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#00F5FF" />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>
      </defs>

      <g id="viba-vb-monogram-symbol">
        {/* Left V Diagonal Arm */}
        <path
          d="M88 96 H156 L268 416 H200 L88 96 Z"
          fill="url(#vb-v-stroke-grad)"
        />

        {/* Interconnected Vertical Spine (Shares V apex and B back) */}
        <path
          d="M200 96 H268 V416 H200 V96 Z"
          fill="url(#vb-brand-gradient)"
        />

        {/* Letter B Curved Double Loops */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M268 96
             H348
             C390 96 422 124 422 166
             C422 202 396 230 358 244
             C404 258 432 292 432 338
             C432 386 394 416 348 416
             H268
             V96 Z

             M268 152
             V220
             H340
             C362 220 376 206 376 186
             C376 166 362 152 340 152
             H268 Z

             M268 292
             V360
             H346
             C372 360 386 346 386 326
             C386 306 372 292 346 292
             H268 Z"
          fill="url(#vb-b-loops-grad)"
        />

        {/* Dynamic Innovation Swoosh: Sweeps along the bottom base and arcs upward */}
        <path
          d="M136 426
             C210 448 310 442 380 404
             C416 384 442 352 448 312
             C444 324 434 338 420 348
             C360 392 260 412 176 398
             C158 395 144 390 136 426 Z"
          fill="url(#vb-swoosh-grad)"
        />

        {/* Minimal Embedded Code Symbol: `< / >` at the B waist */}
        <g id="vb-code-symbol" fill="url(#vb-code-grad)">
          {/* Left bracket `<` */}
          <path d="M316 256 L332 242 L332 248 L323 256 L332 264 L332 270 Z" />
          {/* Forward slash `/` */}
          <path d="M344 240 L350 240 L340 272 L334 272 Z" />
          {/* Right bracket `>` */}
          <path d="M354 242 L370 256 L354 270 L354 264 L363 256 L354 248 Z" />
        </g>
      </g>
    </svg>
  );
}
