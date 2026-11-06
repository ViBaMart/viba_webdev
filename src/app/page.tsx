import { Hero } from "@/components/sections/Hero";
import { AboutAgency } from "@/components/sections/AboutAgency";
import { Services } from "@/components/sections/Services";
import { WebsitePackages } from "@/components/sections/WebsitePackages";
import { WebsiteDemo } from "@/components/sections/WebsiteDemo";
import { ApplyWebsite } from "@/components/sections/ApplyWebsite";
import { ContactForm } from "@/components/sections/ContactForm";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Home Section */}
      <Hero />

      {/* 2. About Us Section */}
      <AboutAgency />

      {/* 3. Our Services Section */}
      <Services />

      {/* 4. Pricing Section */}
      <WebsitePackages />

      {/* 5. Website Demo Section */}
      <WebsiteDemo />

      {/* 6. Apply for Website Section */}
      <ApplyWebsite />

      {/* 7. Contact Us Section */}
      <ContactForm />
    </div>
  );
}
