import { useEffect } from "react";
import Hero from "../components/sections/home/Hero";
import HomeAboutTeaser from "../components/sections/home/HomeAboutTeaser";
import HomeCapabilitiesPreview from "../components/sections/home/HomeCapabilitiesPreview";
import HomeFieldsPreview from "../components/sections/home/HomeFieldsPreview";
import HomeTrustSection from "../components/sections/home/HomeTrustSection";
import HomeContactCTA from "../components/sections/home/HomeContactCTA";

export default function HomePage() {
  useEffect(() => {
    document.title = "Designtech Engineering | Civil & Structural Engineering Consultancy";
  }, []);

  return (
    <main id="main-content">
      {/* 01 — Cinematic Hero */}
      <Hero onEnter={() => {
        const el = document.getElementById("about-intro");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }} />

      {/* 02 — Company Introduction */}
      <HomeAboutTeaser />

      {/* 03 — Core Expertise / Precision Capabilities */}
      <HomeCapabilitiesPreview />

      {/* 04 — Fields of Operation */}
      <HomeFieldsPreview />

      {/* 05 — Client / Trust Section */}
      <HomeTrustSection />

      {/* 06 — Contact CTA */}
      <HomeContactCTA />
    </main>
  );
}
