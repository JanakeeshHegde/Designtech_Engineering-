import { useEffect, useRef, useState } from "react";
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
  },
  {
    num: "02",
    title: "SOIL INVESTIGATION & SURVEYING",
    category: "GEOTECHNICAL & TOPOGRAPHY",
    desc: "In-depth sub-soil stratigraphy analysis, bearing capacity testing, and digital topographical surveying to anchor every structural foundation safely.",
  },
  {
    num: "03",
    title: "COST ESTIMATION & DPR PREPARATION",
    category: "PROJECT FEASIBILITY & TENDER",
    desc: "Precision quantity take-offs, rigorous rate analysis, and Detailed Project Reports (DPR) to provide total budgetary confidence and tender readiness.",
  },
  {
    num: "04",
    title: "INDEPENDENT PEER REVIEW",
    category: "QUALITY AUDIT & COMPLIANCE",
    desc: "Meticulous third-party structural audit, code-compliance verification (IS / International Codes), and value engineering to optimize safety and materials.",
  },
];

export default function HomeCapabilitiesPreview() {
  const ref = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hcp-header-row", { opacity: 0, y: 25 }, {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: ".hcp-header-row", start: "top 85%" },
      });

      gsap.fromTo(".hcp-list-item", { opacity: 0, y: 35 }, {
        opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: ".hcp-list", start: "top 80%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="capabilities-preview" className="hcp section" aria-labelledby="hcp-heading">
      <div className="container">
        {/* Section Header */}
        <div className="hcp-header-row">
          <div className="hcp-header-left">
            <span className="hcp-eyebrow">02 / CORE EXPERTISE</span>
            <h2 id="hcp-heading" className="hcp-headline">
              PRECISION CAPABILITIES
            </h2>
          </div>
          <p className="hcp-header-desc">
            End-to-end civil & structural consultancy ensuring architectural vision is built on
            uncompromised structural integrity and economic efficiency.
          </p>
        </div>

        {/* Vertical Editorial List */}
        <div className="hcp-list" role="list">
          {CAPABILITIES_LIST.map((cap, idx) => {
            const isHovered = activeIdx === idx;
            return (
              <div
                key={cap.num}
                className={`hcp-list-item ${isHovered ? "hcp-list-item--active" : ""}`}
                role="listitem"
                onMouseEnter={() => setActiveIdx(idx)}
              >
                <div className="hcp-item-num">{cap.num}</div>

                <div className="hcp-item-main">
                  <span className="hcp-item-category">{cap.category}</span>
                  <h3 className="hcp-item-title">{cap.title}</h3>
                </div>

                <div className="hcp-item-desc">
                  <p>{cap.desc}</p>
                </div>

                <div className="hcp-item-arrow" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            );
          })}
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
