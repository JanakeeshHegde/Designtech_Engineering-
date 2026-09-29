import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FOOTER_NAV_ITEMS } from "../../data/navigation";
import { OFFICE_INFO } from "../../data/company";
import "./Footer.css";

gsap.registerPlugin(ScrollTrigger);

/* ─── Minimal architectural line icons ─────────────────────── */

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="footer-icon">
    <path
      d="M3 2h3.5l1.5 3.5-1.75 1.25a10 10 0 0 0 4.5 4.5L12 9.5 15.5 11V14.5A1.5 1.5 0 0 1 14 16C7.373 16 2 10.627 2 4A1.5 1.5 0 0 1 3.5 2.5"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="footer-icon">
    <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 5.5l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const LocationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="footer-icon">
    <path
      d="M9 2a5 5 0 0 1 5 5c0 3.5-5 9-5 9S4 10.5 4 7a5 5 0 0 1 5-5z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
    <circle cx="9" cy="7" r="1.75" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="footer-arrow">
    <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-draw-line",
        { opacity: 0.2 },
        {
          opacity: 1,
          duration: 1.8,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: ".footer", start: "top 85%", once: true },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="footer" role="contentinfo">
      {/* Architectural Blueprint Structural Linework */}
      <div className="footer-blueprint-backdrop" aria-hidden="true">
        <svg className="footer-blueprint-svg" viewBox="0 0 1440 600" fill="none" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="footer-fine-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(168,117,36,0.05)" strokeWidth="0.5" />
            </pattern>
            <pattern id="footer-major-grid" width="150" height="150" patternUnits="userSpaceOnUse">
              <rect width="150" height="150" fill="url(#footer-fine-grid)" />
              <path d="M 150 0 L 0 0 0 150" fill="none" stroke="rgba(168,117,36,0.12)" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1.5" fill="rgba(168,117,36,0.25)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-major-grid)" />

          {/* Large Architectural Structural Line Drawing */}
          <g className="footer-struct-lines" stroke="rgba(168,117,36,0.2)" strokeWidth="0.8">
            {/* Column Axes */}
            <line className="footer-draw-line" x1="100" y1="40" x2="100" y2="520" strokeDasharray="6 4" />
            <line className="footer-draw-line" x1="450" y1="40" x2="450" y2="520" strokeDasharray="6 4" />
            <line className="footer-draw-line" x1="850" y1="40" x2="850" y2="520" strokeDasharray="6 4" />
            <line className="footer-draw-line" x1="1340" y1="40" x2="1340" y2="520" strokeDasharray="6 4" />

            {/* Horizontal Beams & Floor Slabs */}
            <line className="footer-draw-line" x1="60" y1="120" x2="1380" y2="120" stroke="rgba(24,25,28,0.06)" strokeWidth="1" />
            <line className="footer-draw-line" x1="60" y1="280" x2="1380" y2="280" stroke="rgba(24,25,28,0.06)" strokeWidth="1" />
            <line className="footer-draw-line" x1="60" y1="440" x2="1380" y2="440" stroke="rgba(168,117,36,0.3)" strokeWidth="1.2" />

            {/* Foundation Footings */}
            <rect x="70" y="440" width="60" height="30" stroke="rgba(168,117,36,0.25)" strokeWidth="1" fill="rgba(168,117,36,0.03)" />
            <rect x="420" y="440" width="60" height="30" stroke="rgba(168,117,36,0.25)" strokeWidth="1" fill="rgba(168,117,36,0.03)" />
            <rect x="820" y="440" width="60" height="30" stroke="rgba(168,117,36,0.25)" strokeWidth="1" fill="rgba(168,117,36,0.03)" />
            <rect x="1310" y="440" width="60" height="30" stroke="rgba(168,117,36,0.25)" strokeWidth="1" fill="rgba(168,117,36,0.03)" />

            {/* Diagonal Wind Bracing Crosses */}
            <line className="footer-draw-line" x1="100" y1="120" x2="450" y2="280" stroke="rgba(168,117,36,0.1)" strokeDasharray="4 4" />
            <line className="footer-draw-line" x1="450" y1="120" x2="100" y2="280" stroke="rgba(168,117,36,0.1)" strokeDasharray="4 4" />
            
            <line className="footer-draw-line" x1="450" y1="120" x2="850" y2="280" stroke="rgba(168,117,36,0.1)" strokeDasharray="4 4" />
            <line className="footer-draw-line" x1="850" y1="120" x2="450" y2="280" stroke="rgba(168,117,36,0.1)" strokeDasharray="4 4" />

            <line className="footer-draw-line" x1="850" y1="120" x2="1340" y2="280" stroke="rgba(168,117,36,0.1)" strokeDasharray="4 4" />
            <line className="footer-draw-line" x1="1340" y1="120" x2="850" y2="280" stroke="rgba(168,117,36,0.1)" strokeDasharray="4 4" />

            {/* Roof Truss Geometry */}
            <path className="footer-draw-line" d="M 100 120 L 450 60 L 850 120 L 1340 60" stroke="rgba(168,117,36,0.2)" strokeWidth="1" fill="none" />

            {/* Technical Drafting Registration Marks */}
            <path d="M 40 40 L 60 40 M 40 40 L 40 60" stroke="rgba(168,117,36,0.35)" strokeWidth="1.2" />
            <path d="M 1400 40 L 1380 40 M 1400 40 L 1400 60" stroke="rgba(168,117,36,0.35)" strokeWidth="1.2" />
            <path d="M 40 560 L 60 560 M 40 560 L 40 540" stroke="rgba(168,117,36,0.35)" strokeWidth="1.2" />
            <path d="M 1400 560 L 1380 560 M 1400 560 L 1400 540" stroke="rgba(168,117,36,0.35)" strokeWidth="1.2" />
          </g>

          {/* Axis & Datum Labels */}
          <text x="100" y="30" fill="rgba(168,117,36,0.35)" fontSize="8" fontFamily="DM Mono,monospace" textAnchor="middle">GRID A-1</text>
          <text x="450" y="30" fill="rgba(168,117,36,0.35)" fontSize="8" fontFamily="DM Mono,monospace" textAnchor="middle">GRID B-2</text>
          <text x="850" y="30" fill="rgba(168,117,36,0.35)" fontSize="8" fontFamily="DM Mono,monospace" textAnchor="middle">GRID C-3</text>
          <text x="1340" y="30" fill="rgba(168,117,36,0.35)" fontSize="8" fontFamily="DM Mono,monospace" textAnchor="middle">GRID D-4</text>

          <text x="40" y="124" fill="rgba(168,117,36,0.35)" fontSize="7" fontFamily="DM Mono,monospace">ROOF LEVEL</text>
          <text x="40" y="284" fill="rgba(168,117,36,0.35)" fontSize="7" fontFamily="DM Mono,monospace">LVL +02</text>
          <text x="40" y="444" fill="rgba(168,117,36,0.4)" fontSize="7" fontFamily="DM Mono,monospace">GL ±0.00</text>
        </svg>
      </div>

      <div className="container">
        <div className="footer-inner">

          {/* ── Column 1: Brand ── */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo-link" aria-label="Designtech Engineering — homepage">
              <img src="/Logo.png" alt="Designtech Engineering" className="footer-logo-img" />
            </Link>
            <p className="footer-tagline">
              Civil &amp; Structural Engineering Consultancy dedicated to permanence, precision, and architectural integrity.
            </p>
          </div>

          {/* ── Column 2: Explore ── */}
          <div className="footer-col">
            <span className="footer-heading">EXPLORE</span>
            <nav aria-label="Footer navigation">
              <ul className="footer-nav-list" role="list">
                {FOOTER_NAV_ITEMS.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="footer-nav-link">
                      {item.label}
                      <span className="footer-nav-underline" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ── Column 3: Sectors ── */}
          <div className="footer-col">
            <span className="footer-heading">SPECIALIZATIONS</span>
            <ul className="footer-spec-list" role="list">
              {[
                "Residential & Commercial",
                "Water & Sewage Plants",
                "Industrial Structures",
                "Solar & Renewable Energy",
              ].map((s) => (
                <li key={s} className="footer-spec-item">
                  <span className="footer-spec-dot" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Contact ── */}
          <div className="footer-col">
            <span className="footer-heading">CONTACT</span>
            <div className="footer-contact-block">
              <div className="footer-contact-row">
                <LocationIcon />
                <address className="footer-address">
                  {OFFICE_INFO.addressLine1}<br />
                  {OFFICE_INFO.addressLine2}<br />
                  {OFFICE_INFO.addressLine3}<br />
                  {OFFICE_INFO.addressLine4}<br />
                  {OFFICE_INFO.addressLine5}
                </address>
              </div>

              <div className="footer-contact-row">
                <PhoneIcon />
                <div className="footer-phones">
                  <a href={`tel:+91${OFFICE_INFO.phone1}`} className="footer-link">{OFFICE_INFO.phone1}</a>
                  <a href={`tel:+91${OFFICE_INFO.phone2}`} className="footer-link">{OFFICE_INFO.phone2}</a>
                </div>
              </div>

              <div className="footer-contact-row">
                <EmailIcon />
                <a href={`mailto:${OFFICE_INFO.email}`} className="footer-link footer-email">
                  {OFFICE_INFO.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {currentYear} Designtech Engineering. All Rights Reserved.
          </p>
          <Link to="/contact" className="footer-cta-link">
            <span>Start a Project</span>
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </footer>
  );
}
