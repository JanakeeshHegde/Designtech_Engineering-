import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./EngineeringJourney.css";

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    num: "01",
    phase: "DRAWING & MATH",
    title: "ANALYSIS & MATHEMATICAL MODELING",
    desc: "Every project begins with rigorous analytical calculations and finite element modeling. We simulate dead loads, live loads, seismic forces (Zone II/III), and wind pressures to establish the most efficient load transfer mechanisms before drafting commences.",
    visual: (
      <svg viewBox="0 0 160 90" fill="none" className="ej-visual-svg" aria-hidden="true">
        <rect x="10" y="10" width="140" height="70" stroke="#B78736" strokeWidth="0.8" strokeDasharray="3 3" fill="none" opacity="0.4" />
        <line x1="10" y1="45" x2="150" y2="45" stroke="#B78736" strokeWidth="0.8" opacity="0.3" />
        <line x1="80" y1="10" x2="80" y2="80" stroke="#B78736" strokeWidth="0.8" opacity="0.3" />
        <polyline points="25,65 55,30 90,45 135,20" stroke="#B78736" strokeWidth="1.8" />
        <circle cx="55" cy="30" r="3" fill="#B78736" />
        <circle cx="90" cy="45" r="3" fill="#B78736" />
        <circle cx="135" cy="20" r="3" fill="#B78736" />
      </svg>
    ),
  },
  {
    num: "02",
    phase: "GEOMETRY & STRATA",
    title: "GEOTECHNICAL & SUBSTRUCTURE DESIGN",
    desc: "Correlating borehole soil investigation data with structural requirements, we engineer site-specific foundation solutions—from isolated pad footings and combined rafts to deep bored cast-in-situ piles with high water tables.",
    visual: (
      <svg viewBox="0 0 160 90" fill="none" className="ej-visual-svg" aria-hidden="true">
        <line x1="10" y1="25" x2="150" y2="25" stroke="#12141A" strokeWidth="1.2" />
        <line x1="10" y1="45" x2="150" y2="45" stroke="#B78736" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
        <line x1="10" y1="70" x2="150" y2="70" stroke="#B78736" strokeWidth="1" opacity="0.8" />
        <rect x="65" y="15" width="30" height="10" stroke="#B78736" strokeWidth="1" fill="rgba(183,135,54,0.15)" />
        <rect x="75" y="25" width="10" height="45" stroke="#12141A" strokeWidth="1" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    num: "03",
    phase: "STRUCTURE & FRAMING",
    title: "STRUCTURAL STEEL, PEB & RCC DETAILING",
    desc: "Translating design loads into clash-free structural documentation. We specialize in long clear spans (up to 22m+), industrial gantry girders, pre-engineered building (PEB) frameworks, and ductile reinforced concrete frames.",
    visual: (
      <svg viewBox="0 0 160 90" fill="none" className="ej-visual-svg" aria-hidden="true">
        <line x1="15" y1="80" x2="145" y2="80" stroke="#B78736" strokeWidth="1.5" />
        <line x1="30" y1="80" x2="30" y2="25" stroke="#12141A" strokeWidth="1.8" />
        <line x1="130" y1="80" x2="130" y2="25" stroke="#12141A" strokeWidth="1.8" />
        <path d="M 25 25 L 80 10 L 135 25" stroke="#B78736" strokeWidth="2" fill="none" />
        <line x1="30" y1="52" x2="130" y2="52" stroke="#B78736" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="80" y1="10" x2="80" y2="80" stroke="#B78736" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
  },
  {
    num: "04",
    phase: "COMPLETED ARCHITECTURE",
    title: "CONSTRUCTION SUPERVISION & PERMANENCE",
    desc: "From steel rebar placement inspections to concrete pour verification, our engineering team ensures that what was designed on CAD drawings is constructed with uncompromising precision on site.",
    visual: (
      <svg viewBox="0 0 160 90" fill="none" className="ej-visual-svg" aria-hidden="true">
        <line x1="10" y1="80" x2="150" y2="80" stroke="#B78736" strokeWidth="1.5" />
        <rect x="35" y="20" width="90" height="60" stroke="#12141A" strokeWidth="1.5" fill="rgba(183,135,54,0.08)" rx="2" />
        {[35, 50, 65].map((y) => (
          <line key={y} x1="35" y1={y} x2="125" y2={y} stroke="#B78736" strokeWidth="0.8" opacity="0.6" />
        ))}
        {[55, 75, 95, 115].map((x) => (
          <line key={x} x1={x} y1="20" x2={x} y2="80" stroke="#B78736" strokeWidth="0.8" opacity="0.5" />
        ))}
        <path d="M 30 20 L 80 8 L 130 20" stroke="#B78736" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
];

export default function EngineeringJourney() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ej-header",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ej-header", start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        ".ej-journey-step",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ej-journey-steps", start: "top 80%", once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="engineering-journey" ref={sectionRef} className="eng-journey section" aria-labelledby="ej-heading">
      <div className="container">
        <div className="ej-header section-header">
          <div className="section-number">FEATURED ENGINEERING JOURNEY</div>
          <h2 id="ej-heading" className="t-display-md ej-title">
            FROM DRAWINGS<br />TO REAL STRUCTURES.
          </h2>
          <div className="section-divider" />
          <p className="t-body" style={{ maxWidth: "560px" }}>
            A selection from our portfolio. Each project tells the story of structural precision, problem-solving, and commitment to delivery.
          </p>
        </div>

        {/* Engineering Methodology Journey (Drawing -> Geometry -> Structure -> Built Architecture) */}
        <div className="ej-journey-steps" role="list">
          {STAGES.map((st) => (
            <div key={st.num} className="ej-journey-step" role="listitem">
              <div className="ej-step-header">
                <span className="ej-step-num">{st.num}</span>
                <span className="ej-step-phase">{st.phase}</span>
              </div>

              <div className="ej-step-visual-box">
                {st.visual}
              </div>

              <div className="ej-step-content">
                <h3 className="ej-step-title">{st.title}</h3>
                <p className="ej-step-desc t-body-sm">{st.desc}</p>
              </div>
              <div className="ej-step-edge" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
