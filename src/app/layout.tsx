import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AGENCY_CONFIG } from "@/config/agency";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(AGENCY_CONFIG.canonicalUrl),
  title: {
    default: `${AGENCY_CONFIG.name} | Modern Web & Cloud Development Agency`,
    template: `%s | ${AGENCY_CONFIG.name}`,
  },
  description: `${AGENCY_CONFIG.tagline}. Specializing in Next.js, TypeScript, Tailwind CSS, Firebase, and scalable multi-tenant cloud platforms.`,
  keywords: [
    "ViBa Web Development Solutions",
    "ViBa WebDevloper",
    "vibawebdev.com",
    "web development solutions",
    "Next.js agency",
    "TypeScript engineering",
    "Tailwind CSS",
    "Firebase cloud platform",
    "cloud SaaS architecture",
    "REST API development",
  ],
  authors: [{ name: AGENCY_CONFIG.name, url: AGENCY_CONFIG.canonicalUrl }],
  creator: AGENCY_CONFIG.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: AGENCY_CONFIG.canonicalUrl,
    title: `${AGENCY_CONFIG.name} | Modern Web & Cloud Development Agency`,
    description: AGENCY_CONFIG.tagline,
    siteName: AGENCY_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: AGENCY_CONFIG.name,
    description: AGENCY_CONFIG.tagline,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased light`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
