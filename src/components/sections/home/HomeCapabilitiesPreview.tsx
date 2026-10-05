import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HomeCapabilitiesPreview.css";

gsap.registerPlugin(ScrollTrigger);

interface Capability {
  id: string;
  num: string;
  title: string;
  category: string;
  desc: string;
  image: string;
  alt: string;
  objectPosition: string;
}

const CAPABILITIES_LIST: Capability[] = [
  {
    id: "structural",
    num: "01",
    title: "CIVIL & STRUCTURAL DESIGN",
    category: "SUPERSTRUCTURE & SUBSTRUCTURE",
    desc: "Comprehensive structural analysis, finite-element modeling, and detailed engineering for commercial, residential, industrial, and institutional developments.",
    image: "/services/civil-structural-design.png",
    alt: "Civil and Structural Design — modern building structure with BIM 3D structural wireframe visualization and engineering analysis",
    objectPosition: "center 40%",
  },
  {
    id: "soil",
    num: "02",
    title: "SOIL INVESTIGATION & SURVEYING",
    category: "GEOTECHNICAL & TOPOGRAPHY",
    desc: "In-depth sub-soil stratigraphy analysis, bearing capacity testing, and digital topographical surveying to anchor every structural foundation safely.",
    image: "/services/soil-investigation-surveying.png",
    alt: "Soil Investigation & Surveying — geotechnical engineering with drilling rig, digital total station, terrain mapping, and soil core analysis",
    objectPosition: "center center",
  },
  {
    id: "cost",
    num: "03",
    title: "COST ESTIMATION & DPR PREPARATION",
    category: "PROJECT FEASIBILITY & TENDER",
    desc: "Precision quantity take-offs, rigorous rate analysis, and Detailed Project Reports (DPR) to provide total budgetary confidence and tender readiness.",
    image: "/services/cost-estimation-dpr.png",
    alt: "Cost Estimation & DPR Preparation — precision quantity take-offs, construction budgeting, DPR documentation, and rate analysis",
    objectPosition: "center center",
  },
  {
    id: "review",
    num: "04",
    title: "INDEPENDENT PEER REVIEW",
    category: "QUALITY AUDIT & COMPLIANCE",
    desc: "Meticulous third-party structural audit, code-compliance verification (IS / International Codes), and value engineering to optimize safety and materials.",
    image: "/services/independent-peer-review.png",
    alt: "Independent Peer Review — expert structural engineers conducting third-party structural audit, IS code compliance, and value engineering",
    objectPosition: "center center",
  },
];

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

  const activeCap = CAPABILITIES_LIST.find((c) => c.id === activeCapId) || CAPABILITIES_LIST[0];

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
                      <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Clean Architectural Image Viewport */}
          <div className="hcp-viewport-col" aria-live="polite">
            <div className="hcp-viewport-container" id={`hcp-panel-${activeCap.id}`}>
              {/* Dynamic Image Display with Smooth Cross-fade Reveal */}
              <div className="hcp-image-stage">
                {CAPABILITIES_LIST.map((cap) => {
                  const isVisible = cap.id === activeCapId;
                  return (
                    <div
                      key={cap.id}
                      className={`hcp-image-wrapper ${isVisible ? "hcp-image-wrapper--active" : ""}`}
                      aria-hidden={!isVisible}
                    >
                      <img
                        src={cap.image}
                        alt={cap.alt}
                        className="hcp-service-image"
                        style={{ objectPosition: cap.objectPosition }}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="hcp-image-overlay">
                        <span className="hcp-overlay-tag">{cap.category}</span>
                        <h4 className="hcp-overlay-title">{cap.title}</h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
