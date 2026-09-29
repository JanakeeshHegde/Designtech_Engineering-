import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

    const timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={ref} id="trust-section" className="hts section" aria-labelledby="hts-heading">
      {/* Background Structural Network & Ties */}
      <div className="hts-structural-backdrop" aria-hidden="true">
        <svg className="hts-structural-svg" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="hts-net-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(168,117,36,0.04)" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="2" fill="rgba(168,117,36,0.12)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hts-net-grid)" />
          
          <g className="hts-network-lines" stroke="rgba(168,117,36,0.15)" strokeWidth="0.8">
            <line x1="160" y1="0" x2="160" y2="900" strokeDasharray="6 6" />
            <line x1="720" y1="0" x2="720" y2="900" strokeDasharray="6 6" />
            <line x1="1280" y1="0" x2="1280" y2="900" strokeDasharray="6 6" />
            
            {/* Structural Tie Rods across columns */}
            <line x1="160" y1="200" x2="720" y2="500" strokeDasharray="4 4" opacity="0.6" />
            <line x1="720" y1="500" x2="1280" y2="200" strokeDasharray="4 4" opacity="0.6" />
            <line x1="160" y1="600" x2="720" y2="300" strokeDasharray="4 4" opacity="0.6" />
            <line x1="720" y1="300" x2="1280" y2="600" strokeDasharray="4 4" opacity="0.6" />
            
            {/* Structural Hub Circles */}
            <circle cx="720" cy="400" r="180" stroke="rgba(168,117,36,0.08)" strokeWidth="1" strokeDasharray="6 6" />
            <circle cx="720" cy="400" r="320" stroke="rgba(168,117,36,0.05)" strokeWidth="1" />
          </g>

          <text x="720" y="210" fill="rgba(168,117,36,0.25)" fontSize="8" fontFamily="DM Mono,monospace" textAnchor="middle">STRUCTURAL HUB // CENTRAL REPOSITORY</text>
        </svg>
      </div>

      <div className="container">
        {/* Header */}
        <div className="hts-header">
          <div className="hts-header-left">
            <span className="hts-eyebrow">CLIENT &amp; TRUST ECOSYSTEM</span>
            <h2 id="hts-heading" className="hts-headline">
              TRUSTED BY INSTITUTIONS &amp; INDUSTRY LEADERS
            </h2>
          </div>
          <p className="hts-header-desc">
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
              <p className="hts-client-project">{c.project}</p>
              <div className="hts-client-badge">
                <span className="hts-badge-dot" aria-hidden="true" />
                <span>Verified Delivery</span>
              </div>
            </div>
          ))}
        </div>

        {/* Geographies strip */}
        <div className="hts-geo-strip">
          <span className="hts-geo-label">ACTIVE FOOTPRINT:</span>
          <div className="hts-geo-tags">
            {["Bengaluru", "Manipal", "Mangalore", "Hyderabad", "Alur", "Peenya"].map((geo) => (
              <span key={geo} className="hts-geo-tag">
                {geo}
              </span>
            ))}
          </div>
          <Link to="/about#clients" className="hts-geo-link">
            <span>VIEW CLIENT DIRECTORY</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
