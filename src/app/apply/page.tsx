import type { Metadata } from "next";
import { ApplyWebsite } from "@/components/sections/ApplyWebsite";
import { AGENCY_CONFIG } from "@/config/agency";

export const metadata: Metadata = {
  title: `Apply for Website | ${AGENCY_CONFIG.name}`,
  description: `Submit your website project requirements, select your package, specify design preferences, and receive a guaranteed fixed quotation within 24 hours.`,
};

export default function ApplyPage() {
  return (
    <div className="flex flex-col w-full">
      <ApplyWebsite />
    </div>
  );
}

