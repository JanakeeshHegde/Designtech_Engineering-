import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CLIENTS } from "../../../data/clients";
import "./ClientEcosystem.css";

gsap.registerPlugin(ScrollTrigger);

export default function ClientEcosystem() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(
        ".ce-header",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ce-header", start: "top 88%", once: true },
        }
      );

      gsap.fromTo(
        ".ce-slider-wrapper",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ce-slider-wrapper", start: "top 90%", once: true },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // Duplicate clients array to enable seamless infinite marquee loop
  const duplicatedClients = [...CLIENTS, ...CLIENTS, ...CLIENTS];

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="client-eco section"
      aria-labelledby="ce-heading"
    >
      <div className="container">
        <div className="ce-header section-header">
          <div className="section-number">CLIENTS</div>
          <h2 id="ce-heading" className="t-display-md">
            CLIENT ECOSYSTEM
          </h2>
          <div className="section-divider" />
          <p className="t-body" style={{ maxWidth: "560px" }}>
            A network of institutions, developers, and industrial organizations that trust Designtech
            Engineering for their civil and structural challenges.
          </p>
        </div>
      </div>

      {/* Infinite Auto-Scrolling Slider Showcase */}
      <div className="ce-slider-wrapper" aria-label="Auto-scrolling client logos">
        <div className="ce-slider-fade ce-slider-fade--left" aria-hidden="true" />
        <div className="ce-slider-fade ce-slider-fade--right" aria-hidden="true" />

        <div className="ce-marquee-track">
          <div className="ce-marquee-content" role="list">
            {duplicatedClients.map((c, i) => (
              <div key={`${c.id}-${i}`} className="ce-client-card" role="listitem">
                <div className="ce-logo-frame">
                  {c.logo ? (
                    <img
                      src={c.logo}
                      alt={c.id || `Client ${(i % CLIENTS.length) + 1}`}
                      className="ce-client-logo-img"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="ce-logo-placeholder">
                      <span className="t-mono">{c.id}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
