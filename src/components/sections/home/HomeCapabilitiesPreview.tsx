import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HomeCapabilitiesPreview.css";

gsap.registerPlugin(ScrollTrigger);

interface Capability {
  num: string;
  title: string;
  category: string;
  desc: string;
  id: string;
}

const CAPABILITIES_LIST: Capability[] = [
  {
    id: "structural",
    num: "01",
    title: "CIVIL & STRUCTURAL DESIGN",
    category: "SUPERSTRUCTURE & SUBSTRUCTURE",
    desc: "Comprehensive structural analysis, finite-element modeling, and detailed engineering for commercial, residential, industrial, and institutional developments.",
  },
  {
    id: "soil",
    num: "02",
    title: "SOIL INVESTIGATION & SURVEYING",
    category: "GEOTECHNICAL & TOPOGRAPHY",
    desc: "In-depth sub-soil stratigraphy analysis, bearing capacity testing, and digital topographical surveying to anchor every structural foundation safely.",
  },
  {
    id: "cost",
    num: "03",
    title: "COST ESTIMATION & DPR PREPARATION",
    category: "PROJECT FEASIBILITY & TENDER",
    desc: "Precision quantity take-offs, rigorous rate analysis, and Detailed Project Reports (DPR) to provide total budgetary confidence and tender readiness.",
  },
  {
    id: "review",
    num: "04",
    title: "INDEPENDENT PEER REVIEW",
    category: "QUALITY AUDIT & COMPLIANCE",
    desc: "Meticulous third-party structural audit, code-compliance verification (IS / International Codes), and value engineering to optimize safety and materials.",
  },
];

/* ── SCENE 1: STRUCTURAL FRAME ENVIRONMENT ── */
function StructuralFrameScene() {
  return (
    <div className="hcp-scene hcp-scene--structural" aria-hidden="true">
      <div className="hcp-scene-hud">
        <span className="hcp-hud-tag">3D MOMENT FRAME DYNAMICS</span>
        <span className="hcp-hud-code">IS 456 / IS 1893</span>
      </div>
      <svg viewBox="0 0 340 260" fill="none" className="hcp-scene-svg">
        {/* Ground datum */}
        <line x1="20" y1="230" x2="320" y2="230" stroke="#B78736" strokeWidth="2" />
        <rect x="20" y="230" width="300" height="15" fill="rgba(183, 135, 54, 0.08)" />

        {/* Foundation footings */}
        <rect x="50" y="215" width="40" height="15" stroke="#B78736" strokeWidth="1.2" fill="rgba(18, 20, 26, 0.9)" />
        <rect x="150" y="215" width="40" height="15" stroke="#B78736" strokeWidth="1.2" fill="rgba(18, 20, 26, 0.9)" />
        <rect x="250" y="215" width="40" height="15" stroke="#B78736" strokeWidth="1.2" fill="rgba(18, 20, 26, 0.9)" />

        {/* Heavy columns */}
        <rect x="66" y="50" width="8" height="165" fill="#12141A" stroke="#B78736" strokeWidth="0.8" />
        <rect x="166" y="50" width="8" height="165" fill="#12141A" stroke="#B78736" strokeWidth="0.8" />
        <rect x="266" y="50" width="8" height="165" fill="#12141A" stroke="#B78736" strokeWidth="0.8" />

        {/* Horizontal floor beams */}
        {[70, 120, 170].map((y, idx) => (
          <g key={y}>
            <rect x="50" y={y} width="240" height="8" fill="#B78736" rx="1" />
            <line x1="40" y1={y + 4} x2="300" y2={y + 4} stroke="#12141A" strokeWidth="1" strokeDasharray="3 3" />
            <text x="30" y={y + 7} fill="#B78736" fontSize="7" fontFamily="DM Mono,monospace">L0{3 - idx}</text>
          </g>
        ))}

        {/* Cantilever roof truss */}
        <path d="M 60 50 L 170 20 L 280 50" stroke="#B78736" strokeWidth="2.5" fill="none" />
        <line x1="170" y1="20" x2="170" y2="50" stroke="#B78736" strokeWidth="1.5" />
        <line x1="115" y1="35" x2="115" y2="50" stroke="#B78736" strokeWidth="1.2" />
        <line x1="225" y1="35" x2="225" y2="50" stroke="#B78736" strokeWidth="1.2" />

        {/* Moment stress lines */}
        <path d="M 70 170 Q 115 155 170 170" stroke="#E4B460" strokeWidth="1.2" strokeDasharray="2 2" fill="none" />
        <path d="M 170 170 Q 220 155 270 170" stroke="#E4B460" strokeWidth="1.2" strokeDasharray="2 2" fill="none" />
      </svg>
    </div>
  );
}

/* ── SCENE 2: GEOTECHNICAL & TERRAIN STRATA ── */
function GeotechnicalStrataScene() {
  const strata = [
    { name: "SURFACE COMPACTED FILL", depth: "0.00 - 1.50m", color: "0.06" },
    { name: "STIFF SILTY CLAY LAYER", depth: "1.50 - 4.20m", color: "0.14" },
    { name: "MEDIUM DENSE SILTY SAND", depth: "4.20 - 8.50m", color: "0.24" },
    { name: "DENSE COARSE GRAVEL STRATUM", depth: "8.50 - 12.80m", color: "0.36" },
    { name: "WEATHERED / HARD BEDROCK (SBC > 450 kN/m²)", depth: "> 12.80m", color: "0.52" },
  ];

  return (
    <div className="hcp-scene hcp-scene--soil" aria-hidden="true">
      <div className="hcp-scene-hud">
        <span className="hcp-hud-tag">BOREHOLE STRATIGRAPHY &amp; BEARING CAP</span>
        <span className="hcp-hud-code">SPT N-VALUE / CPT</span>
      </div>
      <div className="hcp-strata-stack">
        {strata.map((s, idx) => (
          <div
            key={s.name}
            className="hcp-strata-layer"
            style={{ backgroundColor: `rgba(183, 135, 54, ${s.color})` }}
          >
            <div className="hcp-strata-info">
              <span className="hcp-strata-name">STRATUM 0{idx + 1} // {s.name}</span>
              <span className="hcp-strata-depth">{s.depth}</span>
            </div>
            <div className="hcp-strata-borehole-drill" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SCENE 3: QUANTITY MATRIX & DPR ENVIRONMENT ── */
function CostEstimationScene() {
  const items = [
    { label: "EARTHWORK & DEEP PILING", pct: 15, bar: 15 },
    { label: "REINFORCED CONCRETE (SUBSTRUCTURE)", pct: 24, bar: 24 },
    { label: "SUPERSTRUCTURE & PEB STEEL", pct: 36, bar: 36 },
    { label: "ARCHITECTURAL FACADE & GLAZING", pct: 15, bar: 15 },
    { label: "MEP, DRAINAGE & SITELINK", pct: 10, bar: 10 },
  ];

  return (
    <div className="hcp-scene hcp-scene--cost" aria-hidden="true">
      <div className="hcp-scene-hud">
        <span className="hcp-hud-tag">DPR BILL OF QUANTITIES &amp; CASHFLOW MATRIX</span>
        <span className="hcp-hud-code">FEASIBILITY BENCHMARK</span>
      </div>
      <div className="hcp-cost-matrix">
        {items.map((it) => (
          <div key={it.label} className="hcp-cost-row">
            <div className="hcp-cost-labels">
              <span className="hcp-cost-title">{it.label}</span>
              <span className="hcp-cost-pct">{it.pct}%</span>
            </div>
            <div className="hcp-cost-bar-track">
              <div className="hcp-cost-bar-fill" style={{ width: `${it.bar}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SCENE 4: PEER REVIEW AUDIT SEAL ── */
function PeerReviewScene() {
  return (
    <div className="hcp-scene hcp-scene--review" aria-hidden="true">
      <div className="hcp-scene-hud">
        <span className="hcp-hud-tag">THIRD-PARTY STRUCTURAL VERIFICATION</span>
        <span className="hcp-hud-code">AUDIT VERIFIED</span>
      </div>
      <div className="hcp-audit-wrapper">
        <svg viewBox="0 0 260 200" fill="none" className="hcp-audit-svg">
          <circle cx="130" cy="100" r="70" stroke="#B78736" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
          <circle cx="130" cy="100" r="58" stroke="#12141A" strokeWidth="1.5" fill="rgba(255,255,255,0.9)" />
          <line x1="130" y1="40" x2="130" y2="160" stroke="#B78736" strokeWidth="0.8" opacity="0.4" />
          <line x1="70" y1="100" x2="190" y2="100" stroke="#B78736" strokeWidth="0.8" opacity="0.4" />
          <path d="M 105 100 L 122 118 L 158 82" stroke="#B78736" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="hcp-audit-badge">
          <span className="hcp-audit-seal-text">IS CODE CONFORMANCE VERIFIED</span>
          <span className="hcp-audit-subtext">STRUCTURAL ROBUSTNESS &amp; VALUE OPTIMIZATION</span>
        </div>
      </div>
    </div>
  );
}

export default function HomeCapabilitiesPreview() {
  const ref = useRef<HTMLElement>(null);
  const [activeCapId, setActiveCapId] = useState<string>("structural");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hcp-header-row",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".hcp-header-row", start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        ".hcp-interactive-layout",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: { trigger: ".hcp-interactive-layout", start: "top 82%", once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="capabilities-preview" className="hcp section" aria-labelledby="hcp-heading">
      <div className="container">
        {/* Section Header */}
        <div className="hcp-header-row">
          <div className="hcp-header-left">
            <span className="hcp-eyebrow">CORE EXPERTISE</span>
            <h2 id="hcp-heading" className="hcp-headline t-display-md">
              PRECISION CAPABILITIES
            </h2>
          </div>
          <p className="hcp-header-desc t-body">
            End-to-end civil &amp; structural consultancy ensuring architectural vision is built on
            uncompromised structural integrity and economic efficiency.
          </p>
        </div>

        {/* Interactive Architectural Split Workspace */}
        <div className="hcp-interactive-layout">
          {/* Left Column: Interactive Capability Selector */}
          <div className="hcp-selector-list" role="tablist" aria-label="Core Engineering Expertise">
            {CAPABILITIES_LIST.map((cap) => {
              const isActive = activeCapId === cap.id;
              return (
                <button
                  key={cap.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`hcp-panel-${cap.id}`}
                  className={`hcp-item ${isActive ? "hcp-item--active" : ""}`}
                  onClick={() => setActiveCapId(cap.id)}
                  onMouseEnter={() => setActiveCapId(cap.id)}
                >
                  <div className="hcp-item-num-wrap">
                    <span className="hcp-item-num">{cap.num}</span>
                    <span className="hcp-item-active-dot" aria-hidden="true" />
                  </div>

                  <div className="hcp-item-main">
                    <span className="hcp-item-category">{cap.category}</span>
                    <h3 className="hcp-item-title">{cap.title}</h3>
                    <p className="hcp-item-desc t-body-sm">{cap.desc}</p>
                  </div>

                  <div className="hcp-item-arrow" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Architectural Scene Viewport */}
          <div className="hcp-viewport-col" aria-live="polite">
            <div className="hcp-viewport-container">
              {activeCapId === "structural" && <StructuralFrameScene />}
              {activeCapId === "soil" && <GeotechnicalStrataScene />}
              {activeCapId === "cost" && <CostEstimationScene />}
              {activeCapId === "review" && <PeerReviewScene />}
            </div>
          </div>
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
