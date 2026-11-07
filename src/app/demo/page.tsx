import type { Metadata } from "next";
import { WebsiteDemo } from "@/components/sections/WebsiteDemo";
import { AGENCY_CONFIG } from "@/config/agency";

export const metadata: Metadata = {
  title: `Interactive Website Demo | ${AGENCY_CONFIG.name}`,
  description: `Experience live interactive demonstrations of our static websites, dynamic business platforms, and e-commerce storefronts across responsive device viewports.`,
};

export default function DemoPage() {
  return (
    <div className="flex flex-col w-full">
      <WebsiteDemo />
    </div>
  );
}

