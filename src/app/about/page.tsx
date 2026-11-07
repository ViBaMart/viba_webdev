import type { Metadata } from "next";
import { AboutAgency } from "@/components/sections/AboutAgency";
import { AGENCY_CONFIG } from "@/config/agency";

export const metadata: Metadata = {
  title: `About Us | ${AGENCY_CONFIG.name}`,
  description: `Learn more about ${AGENCY_CONFIG.name}, our engineering ethos, cloud-native architecture, and web development philosophy.`,
};

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">
      <AboutAgency />
    </div>
  );
}

