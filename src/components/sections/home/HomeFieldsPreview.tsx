import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HomeFieldsPreview.css";
import { FIELDS_PREVIEW } from "../../../data/sectors";

gsap.registerPlugin(ScrollTrigger);

const SECTOR_SCHEMATICS: Record<string, React.ReactNode> = {
  "01": (
    <svg viewBox="0 0 120 120" fill="none" className="hfpw-wireframe-svg" aria-hidden="true">
      {/* High-rise tower elevation wireframe */}
      <rect x="25" y="15" width="70" height="95" stroke="#A87524" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35" />
      <line x1="25" y1="35" x2="95" y2="35" stroke="#A87524" strokeWidth="0.6" opacity="0.25" />
      <line x1="25" y1="55" x2="95" y2="55" stroke="#A87524" strokeWidth="0.6" opacity="0.25" />
      <line x1="25" y1="75" x2="95" y2="75" stroke="#A87524" strokeWidth="0.6" opacity="0.25" />
      <line x1="25" y1="95" x2="95" y2="95" stroke="#A87524" strokeWidth="0.6" opacity="0.25" />
      {/* Central core shear wall */}
      <rect x="50" y="15" width="20" height="95" stroke="#A87524" strokeWidth="1" opacity="0.3" fill="rgba(168,117,36,0.03)" />
      {/* Dimension tick */}
      <line x1="15" y1="15" x2="15" y2="110" stroke="#A87524" strokeWidth="0.5" opacity="0.2" />
      <path d="M 12 15 L 18 15 M 12 110 L 18 110" stroke="#A87524" strokeWidth="0.5" opacity="0.3" />
    </svg>
  ),
  "02": (
    <svg viewBox="0 0 120 120" fill="none" className="hfpw-wireframe-svg" aria-hidden="true">
      {/* Hydraulic circular basin & weir wireframe */}
      <ellipse cx="60" cy="65" rx="48" ry="24" stroke="#A87524" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35" fill="rgba(168,117,36,0.02)" />
      <ellipse cx="60" cy="52" rx="48" ry="24" stroke="#A87524" strokeWidth="0.8" opacity="0.3" />
      <ellipse cx="60" cy="52" rx="20" ry="10" stroke="#A87524" strokeWidth="0.7" opacity="0.35" />
      <line x1="12" y1="52" x2="12" y2="65" stroke="#A87524" strokeWidth="0.8" opacity="0.35" />
      <line x1="108" y1="52" x2="108" y2="65" stroke="#A87524" strokeWidth="0.8" opacity="0.35" />
      {/* Radial flow lines */}
      <line x1="60" y1="42" x2="60" y2="28" stroke="#A87524" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.25" />
      <line x1="60" y1="62" x2="60" y2="76" stroke="#A87524" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.25" />
      <line x1="40" y1="52" x2="12" y2="52" stroke="#A87524" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.25" />
      <line x1="80" y1="52" x2="108" y2="52" stroke="#A87524" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.25" />
    </svg>
  ),
  "03": (
    <svg viewBox="0 0 120 120" fill="none" className="hfpw-wireframe-svg" aria-hidden="true">
      {/* PEB industrial portal frame & gantry wireframe */}
      <path d="M 18 105 L 18 55 L 60 25 L 102 55 L 102 105" stroke="#A87524" strokeWidth="0.9" opacity="0.4" fill="none" />
      {/* Rafter tie & apex strut */}
      <line x1="18" y1="55" x2="102" y2="55" stroke="#A87524" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.25" />
      <line x1="60" y1="25" x2="60" y2="55" stroke="#A87524" strokeWidth="0.6" opacity="0.3" />
      <line x1="39" y1="40" x2="39" y2="55" stroke="#A87524" strokeWidth="0.5" opacity="0.25" />
      <line x1="81" y1="40" x2="81" y2="55" stroke="#A87524" strokeWidth="0.5" opacity="0.25" />
      {/* Crane gantry bracket */}
      <line x1="18" y1="75" x2="30" y2="75" stroke="#A87524" strokeWidth="1" opacity="0.4" />
      <line x1="102" y1="75" x2="90" y2="75" stroke="#A87524" strokeWidth="1" opacity="0.4" />
      <line x1="12" y1="105" x2="108" y2="105" stroke="#A87524" strokeWidth="0.8" opacity="0.3" />
    </svg>
  ),
  "04": (
    <svg viewBox="0 0 120 120" fill="none" className="hfpw-wireframe-svg" aria-hidden="true">
      {/* Solar MMS tracker & panel array wireframe */}
      <line x1="15" y1="100" x2="105" y2="100" stroke="#A87524" strokeWidth="0.8" opacity="0.3" />
      {/* Support posts */}
      <line x1="40" y1="100" x2="40" y2="65" stroke="#A87524" strokeWidth="0.9" opacity="0.35" />
      <line x1="80" y1="100" x2="80" y2="45" stroke="#A87524" strokeWidth="0.9" opacity="0.35" />
      {/* Angled array plane (15 deg slope) */}
      <line x1="20" y1="75" x2="100" y2="35" stroke="#A87524" strokeWidth="1.2" opacity="0.45" />
      {/* Module frames */}
      <rect x="25" y="60" width="22" height="14" transform="rotate(-26.5 25 60)" stroke="#A87524" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.3" fill="rgba(168,117,36,0.03)" />
      <rect x="52" y="46" width="22" height="14" transform="rotate(-26.5 52 46)" stroke="#A87524" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.3" fill="rgba(168,117,36,0.03)" />
      <rect x="79" y="32" width="22" height="14" transform="rotate(-26.5 79 32)" stroke="#A87524" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.3" fill="rgba(168,117,36,0.03)" />
    </svg>
  ),
};

export default function HomeFieldsPreview() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hfpw-header-row",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: { trigger: ".hfpw-header-row", start: "top 88%", once: true },
        }
      );

      gsap.fromTo(
        ".hfpw-card",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".hfpw-grid", start: "top 88%", once: true },
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
    <section ref={ref} id="fields-preview" className="hfpw section" aria-labelledby="hfpw-heading">
      <div className="container">
        <div className="hfpw-header-row">
          <div className="hfpw-header-left">
            <span className="hfpw-eyebrow">FIELDS OF OPERATION</span>
            <h2 id="hfpw-heading" className="hfpw-headline">
              DIVERSE SECTORS, ONE STANDARD OF EXCELLENCE
            </h2>
          </div>
          <p className="hfpw-header-desc">
            From towering urban landmarks to critical hydraulic utilities and heavy industrial facilities,
            our engineering adapts to rigorous domain challenges.
          </p>
        </div>

        <div className="hfpw-grid" role="list">
          {FIELDS_PREVIEW.map((f) => (
            <Link
              key={f.num}
              to="/sectors"
              className="hfpw-card"
              role="listitem"
              aria-label={`Explore sector: ${f.title}`}
            >
              {/* Sector-Specific Architectural Blueprint Wireframe Backdrop */}
              <div className="hfpw-card-wireframe" aria-hidden="true">
                {SECTOR_SCHEMATICS[f.num] || (
                  <svg viewBox="0 0 100 100" fill="none" className="hfpw-wireframe-svg">
                    <rect x="10" y="10" width="80" height="80" stroke="#A87524" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.2" />
                    <line x1="10" y1="50" x2="90" y2="50" stroke="#A87524" strokeWidth="0.5" opacity="0.15" />
                    <line x1="50" y1="10" x2="50" y2="90" stroke="#A87524" strokeWidth="0.5" opacity="0.15" />
                  </svg>
                )}
              </div>

              <div className="hfpw-card-top">
                <span className="hfpw-card-num">{f.num}</span>
                <span className="hfpw-card-cat">{f.category}</span>
              </div>
              <h3 className="hfpw-card-title">{f.title}</h3>
              <p className="hfpw-card-desc">{f.desc}</p>
              <div className="hfpw-card-bottom">
                <span className="hfpw-card-tag">{f.tag}</span>
                <div className="hfpw-card-arrow" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="hfpw-cta-row">
          <Link to="/sectors" className="btn btn-outline hfpw-cta">
            <span>EXPLORE ALL SPECIALIZED SECTORS</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
