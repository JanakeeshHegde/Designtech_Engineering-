import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./EngineeringProcess.css";

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    num: "01",
    label: "SOIL",
    title: "GROUND TRUTH",
    desc: "Every structure begins below the surface. Soil investigation and site surveying establish the ground truth that informs every design decision.",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="stage-icon">
        {[0,1,2,3].map((i) => (
          <rect key={i} x="10" y={10 + i*18} width="60" height="14"
            stroke="#A87524" strokeWidth="1"
            fill={`rgba(168, 117, 36,${0.05 + i*0.05})`}
            strokeOpacity={0.4 + i*0.1}
          />
        ))}
        <text x="14" y="22" fill="#A87524" fontSize="6" fontFamily="DM Mono,monospace" opacity="0.6">STRATUM 01</text>
        <text x="14" y="40" fill="#A87524" fontSize="6" fontFamily="DM Mono,monospace" opacity="0.6">STRATUM 02</text>
        <text x="14" y="58" fill="#A87524" fontSize="6" fontFamily="DM Mono,monospace" opacity="0.6">STRATUM 03</text>
        <text x="14" y="76" fill="#A87524" fontSize="6" fontFamily="DM Mono,monospace" opacity="0.6">STRATUM 04</text>
      </svg>
    ),
  },
  {
    num: "02",
    label: "ANALYZE",
    title: "STRUCTURAL ANALYSIS",
    desc: "Advanced structural analysis software and engineering principles are applied to model loads, stresses, and deformations.",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="stage-icon">
        <polyline points="10,70 25,45 40,55 55,20 70,30" stroke="#A87524" strokeWidth="1.5" fill="none" />
        <circle cx="25" cy="45" r="3" fill="#A87524" fillOpacity="0.6" />
        <circle cx="40" cy="55" r="3" fill="#A87524" fillOpacity="0.6" />
        <circle cx="55" cy="20" r="3" fill="#A87524" fillOpacity="0.6" />
        <line x1="10" y1="70" x2="70" y2="70" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.3" />
        <line x1="10" y1="10" x2="10" y2="70" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.3" />
        {[10,30,50,70].map((y) => (
          <line key={y} x1="8" y1={y} x2="72" y2={y} stroke="#A87524" strokeWidth="0.25" strokeOpacity="0.15" />
        ))}
      </svg>
    ),
  },
  {
    num: "03",
    label: "DESIGN",
    title: "STRUCTURAL DESIGN",
    desc: "Detailed structural design drawings and specifications are prepared — covering all members, connections, and reinforcement.",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="stage-icon">
        <line x1="15" y1="70" x2="65" y2="70" stroke="#A87524" strokeWidth="2" />
        <line x1="20" y1="70" x2="20" y2="15" stroke="#A87524" strokeWidth="2" />
        <line x1="60" y1="70" x2="60" y2="15" stroke="#A87524" strokeWidth="2" />
        <line x1="15" y1="50" x2="65" y2="50" stroke="#A87524" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="15" y1="30" x2="65" y2="30" stroke="#A87524" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="15" y1="15" x2="65" y2="15" stroke="#A87524" strokeWidth="1.5" />
        <line x1="5" y1="15" x2="5" y2="70" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="2,2" />
        <line x1="4" y1="15" x2="6" y2="15" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.4" />
        <line x1="4" y1="70" x2="6" y2="70" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.4" />
      </svg>
    ),
  },
  {
    num: "04",
    label: "ESTIMATE",
    title: "COST ESTIMATION",
    desc: "Accurate, detailed cost estimates and project reports support planning, financial management, and procurement decisions.",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="stage-icon">
        {[["CONCRETE", 55],["STEEL", 40],["EXCAVATION", 20],["FINISHES", 35]].map(([label, w], i) => (
          <g key={i}>
            <text x="10" y={15 + i*18} fill="#A87524" fontSize="6" fontFamily="DM Mono,monospace" opacity="0.6">{label}</text>
            <rect x="10" y={18 + i*18} width="60" height="6" fill="rgba(168, 117, 36,0.1)" />
            <rect x="10" y={18 + i*18} width={w} height="6" fill="rgba(168, 117, 36,0.45)" />
          </g>
        ))}
      </svg>
    ),
  },
  {
    num: "05",
    label: "REVIEW",
    title: "PEER REVIEW",
    desc: "Independent peer review verifies design integrity and code compliance, adding an essential quality-assurance layer before construction.",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="stage-icon">
        <circle cx="40" cy="40" r="28" stroke="#A87524" strokeWidth="1" strokeOpacity="0.5" fill="none" />
        <circle cx="40" cy="40" r="18" stroke="#A87524" strokeWidth="1" strokeOpacity="0.4" fill="none" strokeDasharray="3,3" />
        <path d="M 28 40 L 37 49 L 52 31" stroke="#A87524" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "06",
    label: "STRUCTURE",
    title: "BUILT REALITY",
    desc: "The engineering journey culminates in a standing structure — designed with precision, built with confidence, tested by time.",
    icon: (
      <svg viewBox="0 0 80 80" fill="none" className="stage-icon">
        <line x1="10" y1="72" x2="70" y2="72" stroke="#A87524" strokeWidth="2" />
        <line x1="18" y1="72" x2="18" y2="20" stroke="#A87524" strokeWidth="2" />
        <line x1="62" y1="72" x2="62" y2="20" stroke="#A87524" strokeWidth="2" />
        <line x1="35" y1="72" x2="35" y2="25" stroke="#A87524" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="45" y1="72" x2="45" y2="25" stroke="#A87524" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="12" y1="50" x2="68" y2="50" stroke="#A87524" strokeWidth="1" strokeOpacity="0.6" />
        <line x1="12" y1="30" x2="68" y2="30" stroke="#A87524" strokeWidth="1" strokeOpacity="0.6" />
        <path d="M 10 20 L 40 8 L 70 20" stroke="#A87524" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
];

export default function EngineeringProcess() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".process-header", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: ".process-header", start: "top 80%" },
      });

      gsap.fromTo(".process-stage", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: ".process-grid", start: "top 75%" },
      });

      // Connecting line draw
      gsap.fromTo(".process-connector", { scaleX: 0 }, {
        scaleX: 1, duration: 1.2, ease: "power2.out",
        scrollTrigger: { trigger: ".process-grid", start: "top 70%" },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="eng-process section" aria-labelledby="process-heading">
      <div className="container">
        <div className="process-header section-header">
          <div className="section-number">PROCESS</div>
          <h2 id="process-heading" className="t-display-md">FROM SOIL TO SKYLINE</h2>
          <div className="section-divider" />
          <p className="t-body" style={{ maxWidth: "480px" }}>
            Every project follows a disciplined engineering process — from ground investigation to structural completion.
          </p>
        </div>

        <div className="process-track" aria-hidden="true">
          <div className="process-connector" />
        </div>

        <div className="process-grid" role="list">
          {STAGES.map((stage, i) => (
            <article
              key={stage.num}
              className="process-stage"
              role="listitem"
              style={{ "--i": i } as React.CSSProperties}
            >
              <div className="process-stage-num" aria-hidden="true">{stage.num}</div>
              <div className="process-stage-icon" aria-hidden="true">{stage.icon}</div>
              <div className="process-stage-label">{stage.label}</div>
              <h3 className="process-stage-title">{stage.title}</h3>
              <p className="process-stage-desc t-body">{stage.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
