import type { Metadata } from "next";
import { Services } from "@/components/sections/Services";
import { AGENCY_CONFIG } from "@/config/agency";

export const metadata: Metadata = {
  title: `Our Services | ${AGENCY_CONFIG.name}`,
  description: `Explore our specialized web development services: ultra-fast static websites, scalable dynamic business applications, and full-stack e-commerce platforms.`,
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col w-full">
      <Services />
    </div>
  );
}

