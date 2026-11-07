import type { Metadata } from "next";
import { WebsitePackages } from "@/components/sections/WebsitePackages";
import { AGENCY_CONFIG } from "@/config/agency";

export const metadata: Metadata = {
  title: `Pricing Packages | ${AGENCY_CONFIG.name}`,
  description: `Transparent fixed-price web development packages with no hidden costs. Static websites from ₹15,998, dynamic business solutions, and e-commerce stores.`,
};

export default function PricingPage() {
  return (
    <div className="flex flex-col w-full">
      <WebsitePackages />
    </div>
  );
}

