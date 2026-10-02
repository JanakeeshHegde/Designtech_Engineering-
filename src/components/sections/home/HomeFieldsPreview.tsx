import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FIELDS_PREVIEW } from "../../../data/sectors";
import "./HomeFieldsPreview.css";

gsap.registerPlugin(ScrollTrigger);

/* ── Distinct Visual World Artworks for Each Sector ── */
function SectorVisualArtwork({ num }: { num: string }) {
  if (num === "01") {
    // Residential & Commercial: Architectural High-Rise & Facade
    return (
      <div className="hfpw-world-art hfpw-world-art--residential" aria-hidden="true">
        <svg viewBox="0 0 200 140" fill="none">
          <line x1="20" y1="125" x2="180" y2="125" stroke="#B78736" strokeWidth="1.5" />
          <rect x="45" y="25" width="110" height="100" stroke="#12141A" strokeWidth="1.2" fill="rgba(255,255,255,0.85)" rx="2" />
          {[45, 65, 85, 105].map((y) => (
            <line key={y} x1="45" y1={y} x2="155" y2={y} stroke="#B78736" strokeWidth="0.8" strokeOpacity="0.5" />
          ))}
          {[60, 85, 110, 135].map((x) => (
            <line key={x} x1={x} y1="25" x2={x} y2="125" stroke="#B78736" strokeWidth="0.8" strokeOpacity="0.4" />
          ))}
          <path d="M 40 25 L 100 8 L 160 25" stroke="#B78736" strokeWidth="1.5" />
          <rect x="85" y="95" width="30" height="30" fill="rgba(183, 135, 54, 0.12)" stroke="#B78736" strokeWidth="0.8" />
        </svg>
      </div>
    );
  }

  if (num === "02") {
    // Water & Sewage: Hydraulic Clarifier & Underground Reservoir
    return (
      <div className="hfpw-world-art hfpw-world-art--water" aria-hidden="true">
        <svg viewBox="0 0 200 140" fill="none">
          <ellipse cx="100" cy="95" rx="75" ry="28" stroke="#B78736" strokeWidth="1.5" fill="rgba(183,135,54,0.06)" />
          <ellipse cx="100" cy="65" rx="75" ry="22" stroke="#12141A" strokeWidth="1.2" fill="rgba(255,255,255,0.9)" />
          <rect x="25" y="65" width="150" height="30" stroke="#B78736" strokeWidth="0.8" fill="rgba(183,135,54,0.04)" />
          <path d="M 40 75 Q 70 68 100 75 Q 130 82 160 75" stroke="#B78736" strokeWidth="0.8" fill="none" />
          <rect x="88" y="25" width="24" height="40" stroke="#12141A" strokeWidth="1.2" fill="#FFFFFF" />
          <line x1="100" y1="12" x2="100" y2="25" stroke="#B78736" strokeWidth="1.2" strokeDasharray="2 2" />
        </svg>
      </div>
    );
  }

  if (num === "03") {
    // Industrial & Institutions: Large Span PEB Portal & Gantry
    return (
      <div className="hfpw-world-art hfpw-world-art--industrial" aria-hidden="true">
        <svg viewBox="0 0 200 140" fill="none">
          <line x1="15" y1="120" x2="185" y2="120" stroke="#B78736" strokeWidth="1.5" />
          <rect x="30" y="55" width="140" height="65" stroke="#12141A" strokeWidth="1.2" fill="rgba(255,255,255,0.9)" rx="2" />
          <path d="M 30 55 L 60 28 L 100 28 L 100 55" stroke="#B78736" strokeWidth="1.2" fill="rgba(183,135,54,0.08)" />
          <path d="M 100 28 L 140 10 L 170 28 L 170 55" stroke="#B78736" strokeWidth="1.2" fill="rgba(183,135,54,0.08)" />
          {[55, 80, 105, 130, 155].map((x) => (
            <line key={x} x1={x} y1="55" x2={x} y2="120" stroke="#B78736" strokeWidth="0.6" strokeOpacity="0.5" />
          ))}
          <rect x="135" y="75" width="25" height="45" stroke="#B78736" strokeWidth="0.8" fill="rgba(183,135,54,0.12)" />
        </svg>
      </div>
    );
  }

  // Solar & Renewable Energy: Photovoltaic Array
  return (
    <div className="hfpw-world-art hfpw-world-art--solar" aria-hidden="true">
      <svg viewBox="0 0 200 140" fill="none">
        {[[20,30],[55,22],[90,30],[125,22],[160,30],[20,70],[55,62],[90,70],[125,62],[160,70]].map(([x,y], i) => (
          <rect key={i} x={x} y={y} width="24" height="18" stroke="#B78736" strokeWidth="0.8" fill="rgba(183,135,54,0.08)" rx="1" />
        ))}
        {[[20,30],[90,30],[160,30]].map(([x,y], i) => (
          <line key={i} x1={x+12} y1={y+18} x2={x+12} y2={y+38} stroke="#12141A" strokeWidth="1" strokeOpacity="0.6" />
        ))}
        <line x1="15" y1="120" x2="185" y2="120" stroke="#B78736" strokeWidth="1.5" />
        <circle cx="100" cy="120" r="8" stroke="#B78736" strokeWidth="1" fill="rgba(183,135,54,0.15)" />
      </svg>
    </div>
  );
}

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
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".hfpw-grid", start: "top 88%", once: true },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="fields-preview" className="hfpw section" aria-labelledby="hfpw-heading">
      <div className="container">
        <div className="hfpw-header-row">
          <div className="hfpw-header-left">
            <span className="hfpw-eyebrow">FIELDS OF OPERATION</span>
            <h2 id="hfpw-heading" className="hfpw-headline t-display-md">
              DIVERSE SECTORS, ONE STANDARD OF EXCELLENCE
            </h2>
          </div>
          <p className="hfpw-header-desc t-body">
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
              {/* Visual scene top illustration */}
              <div className="hfpw-card-visual-scene">
                <SectorVisualArtwork num={f.num} />
              </div>

              <div className="hfpw-card-body">
                <div className="hfpw-card-top">
                  <span className="hfpw-card-num">{f.num}</span>
                  <span className="hfpw-card-cat">{f.category}</span>
                </div>
                <h3 className="hfpw-card-title">{f.title}</h3>
                <p className="hfpw-card-desc t-body-sm">{f.desc}</p>
                <div className="hfpw-card-bottom">
                  <span className="hfpw-card-tag">{f.tag}</span>
                  <div className="hfpw-card-arrow" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
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
