import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Capabilities.css";

gsap.registerPlugin(ScrollTrigger);

const CAPABILITIES = [
  {
    id: "civil-structural",
    number: "01",
    tag: "STRUCTURAL ENGINEERING",
    title: "CIVIL & STRUCTURAL DESIGN",
    description: "Comprehensive structural analysis and design for high-rise, commercial, and industrial facilities. From geotechnical substructure modeling to complex roof truss systems — engineered for safety, structural efficiency, and complete building code compliance.",
    visual: "structural",
  },
  {
    id: "soil-investigation",
    number: "02",
    tag: "GEOTECHNICAL SCIENCE",
    title: "SOIL INVESTIGATION & SURVEYING",
    description: "Multi-stratum borehole drilling, geotechnical characterization, and digital topographic surveys to establish safe foundation bearing capacity and seismic site classifications.",
    visual: "soil",
  },
  {
    id: "cost-estimation",
    number: "03",
    tag: "QUANTITY SURVEYING & DPR",
    title: "COST ESTIMATION & DETAILED PROJECT REPORTS",
    description: "Exhaustive bills of quantities (BOQ), material rate benchmarking, cashflow forecasting, and comprehensive Detailed Project Reports (DPR) to provide complete financial clarity prior to tender release.",
    visual: "data",
  },
  {
    id: "peer-review",
    number: "04",
    tag: "QUALITY AUDIT & VALUE ENGINEERING",
    title: "INDEPENDENT PEER REVIEW",
    description: "Rigorous third-party structural design audits, mathematical verification, finite-element validation, and value engineering ensuring structural robustness while identifying significant material savings.",
    visual: "inspect",
  },
];

const StructuralViz = () => (
  <svg viewBox="0 0 240 200" fill="none" aria-hidden="true" className="cap-viz-svg">
    <line x1="30" y1="180" x2="210" y2="180" stroke="#A87524" strokeWidth="2" />
    <line x1="50" y1="180" x2="50" y2="40" stroke="#202124" strokeWidth="2" />
    <line x1="120" y1="180" x2="120" y2="40" stroke="#A87524" strokeWidth="1.5" />
    <line x1="190" y1="180" x2="190" y2="40" stroke="#202124" strokeWidth="2" />
    <line x1="40" y1="140" x2="200" y2="140" stroke="#A87524" strokeWidth="1" strokeOpacity="0.6" />
    <line x1="40" y1="95" x2="200" y2="95" stroke="#A87524" strokeWidth="1" strokeOpacity="0.6" />
    <line x1="40" y1="50" x2="200" y2="50" stroke="#A87524" strokeWidth="1.5" />
    <path d="M 40 50 L 120 20 L 200 50" stroke="#A87524" strokeWidth="1.8" fill="none" />
    <rect x="70" y="105" width="35" height="35" stroke="#A87524" strokeWidth="0.8" strokeOpacity="0.4" fill="rgba(168,117,36,0.05)" />
    <rect x="135" y="105" width="35" height="35" stroke="#A87524" strokeWidth="0.8" strokeOpacity="0.4" fill="rgba(168,117,36,0.05)" />
    <text x="10" y="185" fill="#A87524" fontSize="6.5" fontFamily="DM Mono,monospace" opacity="0.6">BASE</text>
    <text x="10" y="145" fill="#A87524" fontSize="6.5" fontFamily="DM Mono,monospace" opacity="0.6">L01</text>
    <text x="10" y="100" fill="#A87524" fontSize="6.5" fontFamily="DM Mono,monospace" opacity="0.6">L02</text>
    <text x="10" y="55" fill="#A87524" fontSize="6.5" fontFamily="DM Mono,monospace" opacity="0.6">ROOF</text>
  </svg>
);

const SoilViz = () => (
  <svg viewBox="0 0 240 200" fill="none" aria-hidden="true" className="cap-viz-svg">
    {[
      { layer: "SURFACE FILL / TOPSOIL", depth: "0 - 1.5m", color: "0.04" },
      { layer: "SOFT SILTY CLAY", depth: "1.5 - 4.0m", color: "0.08" },
      { layer: "MEDIUM DENSE CLAYEY SAND", depth: "4.0 - 7.5m", color: "0.14" },
      { layer: "DENSE COARSE SAND & GRAVEL", depth: "7.5 - 11.0m", color: "0.22" },
      { layer: "WEATHERED BEDROCK", depth: "11.0 - 15.0m", color: "0.32" },
      { layer: "HARD COMPETENT ROCK", depth: "> 15.0m", color: "0.45" },
    ].map((item, i) => (
      <g key={i}>
        <rect
          x="30"
          y={15 + i * 30}
          width="180"
          height="25"
          stroke="#A87524"
          strokeWidth="0.8"
          fill={`rgba(168, 117, 36, ${item.color})`}
        />
        <text x="38" y={32 + i * 30} fill="#202124" fontSize="6.5" fontFamily="Manrope,sans-serif" fontWeight="700">
          {item.layer}
        </text>
        <text x="165" y={32 + i * 30} fill="#A87524" fontSize="6" fontFamily="DM Mono,monospace">
          {item.depth}
        </text>
      </g>
    ))}
    <line x1="20" y1="15" x2="20" y2="190" stroke="#A87524" strokeWidth="0.8" strokeOpacity="0.5" />
  </svg>
);

const DataViz = () => (
  <svg viewBox="0 0 240 200" fill="none" aria-hidden="true" className="cap-viz-svg">
    {[
      ["EARTHWORK & PILING", "14%"],
      ["SUBSTRUCTURE (RCC)", "22%"],
      ["SUPERSTRUCTURE FRAME", "38%"],
      ["ENVELOPE & FINISHES", "16%"],
      ["MEP & INFRASTRUCTURE", "10%"],
    ].map(([label, val], i) => (
      <g key={i}>
        <text x="25" y={30 + i * 34} fill="#202124" fontSize="7" fontFamily="Manrope,sans-serif" fontWeight="700">
          {label}
        </text>
        <rect x="25" y={36 + i * 34} width="150" height="9" fill="rgba(168, 117, 36, 0.08)" rx="2" />
        <rect x="25" y={36 + i * 34} width={parseInt(val) * 3.8} height="9" fill="#A87524" rx="2" />
        <text x="185" y={44 + i * 34} fill="#A87524" fontSize="7.5" fontFamily="DM Mono,monospace" fontWeight="600">
          {val}
        </text>
      </g>
    ))}
  </svg>
);

const InspectViz = () => (
  <svg viewBox="0 0 240 200" fill="none" aria-hidden="true" className="cap-viz-svg">
    <rect x="45" y="25" width="150" height="150" stroke="#D9D5CC" strokeWidth="1" fill="none" />
    <rect x="65" y="45" width="110" height="110" stroke="#A87524" strokeWidth="1" strokeDasharray="4,4" strokeOpacity="0.6" fill="rgba(168,117,36,0.03)" />
    <circle cx="120" cy="100" r="40" stroke="#A87524" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
    <line x1="120" y1="50" x2="120" y2="150" stroke="#A87524" strokeWidth="0.8" strokeOpacity="0.4" />
    <line x1="70" y1="100" x2="170" y2="100" stroke="#A87524" strokeWidth="0.8" strokeOpacity="0.4" />
    <path d="M 98 100 L 114 116 L 146 84" stroke="#A87524" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <text x="50" y="188" fill="#A87524" fontSize="6.5" fontFamily="DM Mono,monospace" opacity="0.8">
      IS 456 / IS 1893 COMPLIANCE VERIFIED
    </text>
  </svg>
);

const VIZUALS: Record<string, React.ReactNode> = {
  structural: <StructuralViz />,
  soil: <SoilViz />,
  data: <DataViz />,
  inspect: <InspectViz />,
};

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState("civil-structural");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".cap-header", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: ".cap-header", start: "top 80%" },
      });

      gsap.fromTo(".cap-item", { opacity: 0, y: 25 }, {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: ".cap-list", start: "top 78%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const activeCap = CAPABILITIES.find((c) => c.id === active)!;

  return (
    <section id="capabilities" ref={sectionRef} className="capabilities section" aria-labelledby="cap-heading">
      <div className="container">
        {/* Header */}
        <div className="cap-header">
          <div className="cap-header-left">
            <span className="cap-eyebrow">02 / CORE CAPABILITIES</span>
            <h2 id="cap-heading" className="cap-headline">
              COMPREHENSIVE CONSULTING SCOPE
            </h2>
          </div>
          <div className="cap-header-rule" aria-hidden="true" />
        </div>

        <div className="cap-layout">
          {/* Capability list */}
          <div className="cap-list" role="list">
            {CAPABILITIES.map((cap) => {
              const isActive = active === cap.id;
              return (
                <button
                  key={cap.id}
                  className={`cap-item ${isActive ? "cap-item--active" : ""}`}
                  onClick={() => setActive(cap.id)}
                  role="listitem"
                  aria-selected={isActive}
                  aria-controls="cap-viz-panel"
                >
                  <span className="cap-num">{cap.number}</span>
                  <div className="cap-item-content">
                    <span className="cap-item-tag">{cap.tag}</span>
                    <h3 className="cap-item-title">{cap.title}</h3>
                    {isActive && (
                      <p className="cap-item-desc">{cap.description}</p>
                    )}
                  </div>
                  <div className="cap-item-arrow" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Visualization CAD panel */}
          <div id="cap-viz-panel" className="cap-viz-panel" aria-live="polite">
            <div className="cap-viz-card">
              <div className="cap-viz-topbar">
                <div className="cap-viz-status">
                  <span className="cap-viz-dot" />
                  <span className="cap-viz-tag">{activeCap.tag}</span>
                </div>
                <span className="cap-viz-code">SYS-REF // {activeCap.number}</span>
              </div>

              <div className="cap-viz-viewport">
                {VIZUALS[activeCap.visual]}
              </div>

              <div className="cap-viz-footer">
                <span className="cap-viz-title-label">{activeCap.title}</span>
                <span className="cap-viz-status-ok">STATUS: OPTIMIZED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
