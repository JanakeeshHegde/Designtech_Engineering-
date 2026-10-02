import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CLIENTS as CLIENT_LOGOS } from "../../../data/clients";
import "./HomeTrustSection.css";

gsap.registerPlugin(ScrollTrigger);

const CLIENTS = [
  {
    name: "St. Joseph's Group of Institutions",
    location: "Bangalore",
    project: "Multi Activity Centre (22m Clear Span)",
    sector: "Institutional",
  },
  {
    name: "CMR Group of Institutions",
    location: "Bangalore",
    project: "PU College & Basement Sports Arena",
    sector: "Institutional",
  },
  {
    name: "Country Inn / Shree Raghupathi Bhat",
    location: "Manipal, Udupi",
    project: "Luxury Hospitality & Rooftop Pool (B2+G+5)",
    sector: "Hospitality",
  },
  {
    name: "Karnataka State Cricket Association (KSCA)",
    location: "Alur",
    project: "Sports Gallery & Convention Centre",
    sector: "Civic Infrastructure",
  },
  {
    name: "Taurus JCB",
    location: "Bangalore",
    project: "Heavy Industrial Manufacturing Facility",
    sector: "Industrial",
  },
  {
    name: "Sagittarius Metals",
    location: "Peenya, Bangalore",
    project: "Industrial Factory & Gantry System",
    sector: "Manufacturing",
  },
  {
    name: "Cross Winds Enclave",
    location: "Hyderabad",
    project: "Premium High-Rise Residential",
    sector: "Residential",
  },
];

export default function HomeTrustSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hts-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: { trigger: ".hts-header", start: "top 88%", once: true },
        }
      );

      gsap.fromTo(
        ".hts-client-item",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: ".hts-client-grid", start: "top 88%", once: true },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  const duplicatedLogos = [...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section ref={ref} id="trust-section" className="hts section" aria-labelledby="hts-heading">
      <div className="container">
        {/* Header */}
        <div className="hts-header">
          <div className="hts-header-left">
            <span className="hts-eyebrow">CLIENT &amp; TRUST ECOSYSTEM</span>
            <h2 id="hts-heading" className="hts-headline t-display-md">
              TRUSTED BY INSTITUTIONS &amp; INDUSTRY LEADERS
            </h2>
          </div>
          <p className="hts-header-desc t-body">
            Long-term partnerships built on structural reliability, exact calculation, and seamless
            architectural collaboration across South India.
          </p>
        </div>

        {/* Client Roster Grid */}
        <div className="hts-client-grid" role="list">
          {CLIENTS.map((c) => (
            <div key={c.name} className="hts-client-item" role="listitem">
              <div className="hts-client-top">
                <span className="hts-client-sector">{c.sector}</span>
                <span className="hts-client-loc">{c.location}</span>
              </div>
              <h3 className="hts-client-name">{c.name}</h3>
              <p className="hts-client-project t-body-sm">{c.project}</p>
              <div className="hts-client-badge">
                <span className="hts-badge-dot" aria-hidden="true" />
                <span>Verified Delivery</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite Auto-Scrolling Client Ecosystem Slider at Bottom */}
      <div className="hts-marquee-wrapper" aria-label="Auto-scrolling client ecosystem logos">
        <div className="hts-marquee-fade hts-marquee-fade--left" aria-hidden="true" />
        <div className="hts-marquee-fade hts-marquee-fade--right" aria-hidden="true" />

        <div className="hts-marquee-track">
          <div className="hts-marquee-content" role="list">
            {duplicatedLogos.map((c, i) => (
              <div key={`${c.id}-${i}`} className="hts-marquee-card" role="listitem">
                <div className="hts-logo-frame">
                  {c.logo ? (
                    <img
                      src={c.logo}
                      alt={c.id || `Client ${(i % CLIENT_LOGOS.length) + 1}`}
                      className="hts-client-logo-img"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="hts-logo-placeholder">
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
