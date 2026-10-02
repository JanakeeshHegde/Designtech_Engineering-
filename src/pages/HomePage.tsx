import { useEffect } from "react";
import Hero from "../components/sections/home/Hero";
import HomeAboutTeaser from "../components/sections/home/HomeAboutTeaser";
import HomeCapabilitiesPreview from "../components/sections/home/HomeCapabilitiesPreview";
import HomeFieldsPreview from "../components/sections/home/HomeFieldsPreview";
import HomeTrustSection from "../components/sections/home/HomeTrustSection";
import HomeFeaturedProjects from "../components/sections/home/HomeFeaturedProjects";

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

      {/* 04 — Selected Experience // 04 Documented Structures */}
      <HomeFeaturedProjects />

      {/* 05 — Fields of Operation */}
      <HomeFieldsPreview />

      {/* 06 — Client / Trust Section */}
      <HomeTrustSection />
    </main>
  );
}
