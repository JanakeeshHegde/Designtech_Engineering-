import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HomeCapabilitiesPreview.css";

gsap.registerPlugin(ScrollTrigger);

const CAPABILITIES_LIST = [
  {
    num: "01",
    title: "CIVIL & STRUCTURAL DESIGN",
    category: "SUPERSTRUCTURE & SUBSTRUCTURE",
    desc: "Comprehensive structural analysis, finite-element modeling, and detailed engineering for commercial, residential, industrial, and institutional developments.",
    visual: (
      <svg viewBox="0 0 80 50" fill="none" aria-hidden="true">
        {/* Superstructure frame schematic */}
        <rect x="10" y="8" width="60" height="34" stroke="#A87524" strokeWidth="1" opacity="0.6" />
        <line x1="30" y1="8" x2="30" y2="42" stroke="#A87524" strokeWidth="0.8" opacity="0.4" />
        <line x1="50" y1="8" x2="50" y2="42" stroke="#A87524" strokeWidth="0.8" opacity="0.4" />
        <line x1="10" y1="24" x2="70" y2="24" stroke="#A87524" strokeWidth="0.8" opacity="0.4" />
        <line x1="10" y1="42" x2="70" y2="42" stroke="#18191C" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "SOIL INVESTIGATION & SURVEYING",
    category: "GEOTECHNICAL & TOPOGRAPHY",
    desc: "In-depth sub-soil stratigraphy analysis, bearing capacity testing, and digital topographical surveying to anchor every structural foundation safely.",
    visual: (
      <svg viewBox="0 0 80 50" fill="none" aria-hidden="true">
        {/* Geotechnical soil strata schematic */}
        <line x1="8" y1="12" x2="72" y2="12" stroke="#18191C" strokeWidth="1" />
        <line x1="8" y1="22" x2="72" y2="22" stroke="#A87524" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
        <line x1="8" y1="34" x2="72" y2="34" stroke="#A87524" strokeWidth="0.8" opacity="0.5" />
        <rect x="36" y="6" width="8" height="28" fill="#A87524" opacity="0.25" stroke="#A87524" strokeWidth="0.8" />
        <line x1="40" y1="34" x2="40" y2="44" stroke="#A87524" strokeWidth="1.2" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "COST ESTIMATION & DPR PREPARATION",
    category: "PROJECT FEASIBILITY & TENDER",
    desc: "Precision quantity take-offs, rigorous rate analysis, and Detailed Project Reports (DPR) to provide total budgetary confidence and tender readiness.",
    visual: (
      <svg viewBox="0 0 80 50" fill="none" aria-hidden="true">
        {/* DPR estimation graph/matrix schematic */}
        <rect x="12" y="10" width="56" height="30" stroke="#A87524" strokeWidth="0.8" opacity="0.4" />
        <line x1="12" y1="20" x2="68" y2="20" stroke="#A87524" strokeWidth="0.6" opacity="0.3" />
        <line x1="12" y1="30" x2="68" y2="30" stroke="#A87524" strokeWidth="0.6" opacity="0.3" />
        <polyline points="18,34 32,24 46,26 62,14" stroke="#A87524" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "INDEPENDENT PEER REVIEW",
    category: "QUALITY AUDIT & COMPLIANCE",
    desc: "Meticulous third-party structural audit, code-compliance verification (IS / International Codes), and value engineering to optimize safety and materials.",
    visual: (
      <svg viewBox="0 0 80 50" fill="none" aria-hidden="true">
        {/* Compliance check and audit stamp schematic */}
        <circle cx="40" cy="25" r="16" stroke="#A87524" strokeWidth="1" opacity="0.6" strokeDasharray="3 2" />
        <circle cx="40" cy="25" r="11" stroke="#A87524" strokeWidth="0.8" opacity="0.4" />
        <polyline points="34,25 38,29 47,20" stroke="#A87524" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export default function HomeCapabilitiesPreview() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hcp-header-row",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: { trigger: ".hcp-header-row", start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        ".hcp-list-item",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".hcp-list", start: "top 80%", once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="capabilities-preview" className="hcp section" aria-labelledby="hcp-heading">
      {/* Background Structural Grid & Engineering Geometry */}
      <div className="hcp-structural-backdrop" aria-hidden="true">
        <svg className="hcp-structural-svg" viewBox="0 0 1440 850" fill="none" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="hcp-node-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(168,117,36,0.05)" strokeWidth="0.7" />
              <circle cx="0" cy="0" r="2.5" fill="rgba(168,117,36,0.12)" stroke="rgba(168,117,36,0.25)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hcp-node-grid)" />
          
          <g className="hcp-structural-lines" stroke="rgba(168,117,36,0.18)" strokeWidth="0.8">
            <line x1="200" y1="0" x2="200" y2="850" strokeDasharray="6 6" />
            <line x1="720" y1="0" x2="720" y2="850" strokeDasharray="6 6" />
            <line x1="1240" y1="0" x2="1240" y2="850" strokeDasharray="6 6" />
            
            <line x1="0" y1="180" x2="1440" y2="180" strokeDasharray="6 6" />
            <line x1="0" y1="580" x2="1440" y2="580" strokeDasharray="6 6" />
            
            {/* Structural portal frame framing */}
            <path d="M 200 180 L 720 180 L 720 580 L 200 580 Z" stroke="rgba(24,25,28,0.06)" strokeWidth="1" fill="none" />
            <path d="M 720 180 L 1240 180 L 1240 580 L 720 580 Z" stroke="rgba(24,25,28,0.06)" strokeWidth="1" fill="none" />
          </g>

          <text x="208" y="172" fill="rgba(168,117,36,0.3)" fontSize="8" fontFamily="DM Mono,monospace">GRID X1</text>
          <text x="728" y="172" fill="rgba(168,117,36,0.3)" fontSize="8" fontFamily="DM Mono,monospace">GRID X2</text>
          <text x="1248" y="172" fill="rgba(168,117,36,0.3)" fontSize="8" fontFamily="DM Mono,monospace">GRID X3</text>
        </svg>
      </div>

      <div className="container">
        {/* Section Header */}
        <div className="hcp-header-row">
          <div className="hcp-header-left">
            <span className="hcp-eyebrow">CORE EXPERTISE</span>
            <h2 id="hcp-heading" className="hcp-headline">
              PRECISION CAPABILITIES
            </h2>
          </div>
          <p className="hcp-header-desc">
            End-to-end civil &amp; structural consultancy ensuring architectural vision is built on
            uncompromised structural integrity and economic efficiency.
          </p>
        </div>

        {/* Vertical Editorial List */}
        <div className="hcp-list" role="list">
          {CAPABILITIES_LIST.map((cap) => (
            <div key={cap.num} className="hcp-list-item" role="listitem">
              <div className="hcp-item-num">{cap.num}</div>

              <div className="hcp-item-main">
                <span className="hcp-item-category">{cap.category}</span>
                <h3 className="hcp-item-title">{cap.title}</h3>
              </div>

              <div className="hcp-item-desc">
                <p>{cap.desc}</p>
              </div>

              <div className="hcp-item-visual" aria-hidden="true">
                {cap.visual}
              </div>

              <div className="hcp-item-arrow" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Action */}
        <div className="hcp-cta-row">
          <Link to="/about" className="btn btn-outline hcp-cta" aria-label="Explore our detailed technical capabilities">
            <span>EXPLORE FULL CAPABILITIES</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
