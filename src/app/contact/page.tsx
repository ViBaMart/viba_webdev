import type { Metadata } from "next";
import { ContactForm } from "@/components/sections/ContactForm";
import { AGENCY_CONFIG } from "@/config/agency";

export const metadata: Metadata = {
  title: `Contact Us | ${AGENCY_CONFIG.name}`,
  description: `Contact ${AGENCY_CONFIG.name} for enterprise consultations, custom quote requests, or technical scoping discussions.`,
};

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full">
      <ContactForm />
    </div>
  );
}

