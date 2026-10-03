import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./EngineeringProcess.css";

gsap.registerPlugin(ScrollTrigger);

interface ProcessStage {
  num: string;
  label: string;
  title: string;
  desc: string;
  image: string;
  alt: string;
}

const STAGES: ProcessStage[] = [
  {
    num: "01",
    label: "SOIL",
    title: "GROUND TRUTH",
    desc: "Every structure begins below the surface. Soil investigation and site surveying establish the ground truth that informs every design decision.",
    image: "/process/01-soil-investigation.jpg",
    alt: "Geotechnical soil investigation with core sample box, drilling rig, and surveying total station on site",
  },
  {
    num: "02",
    label: "ANALYZE",
    title: "STRUCTURAL ANALYSIS",
    desc: "Advanced structural analysis software and engineering principles are applied to model loads, stresses, and deformations.",
    image: "/process/02-structural-analysis.jpg",
    alt: "3D Finite Element Analysis (FEA) and BIM structural modeling workstation displaying stress contours and deflection diagrams",
  },
  {
    num: "03",
    label: "DESIGN",
    title: "STRUCTURAL DESIGN",
    desc: "Detailed structural design drawings and specifications are prepared — covering all members, connections, and reinforcement.",
    image: "/process/03-structural-design.jpg",
    alt: "Architectural and structural engineering blueprints with foundation rebar schedule, drafting tools, and scale ruler",
  },
  {
    num: "04",
    label: "ESTIMATE",
    title: "COST ESTIMATION",
    desc: "Accurate, detailed cost estimates and project reports support planning, financial management, and procurement decisions.",
    image: "/process/04-cost-estimation.jpg",
    alt: "Detailed Project Report (DPR), Bill of Quantities (BOQ) spreadsheets, and financial calculation sheets",
  },
  {
    num: "05",
    label: "REVIEW",
    title: "PEER REVIEW",
    desc: "Independent peer review verifies design integrity and code compliance, adding an essential quality-assurance layer before construction.",
    image: "/process/05-peer-review.jpg",
    alt: "Senior civil and structural engineers conducting peer review audit and building code compliance check",
  },
  {
    num: "06",
    label: "STRUCTURE",
    title: "BUILT REALITY",
    desc: "The engineering journey culminates in a standing structure — designed with precision, built with confidence, tested by time.",
    image: "/process/06-built-reality.jpg",
    alt: "Completed modern commercial skyscraper with glass and concrete structural facade reaching the skyline",
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
              key={stage.label}
              className="process-stage"
              role="listitem"
              style={{ "--i": i } as React.CSSProperties}
            >
              {/* Top Row: Stage Label Badge */}
              <div className="process-stage-topbar">
                <span className="process-stage-label">{stage.label}</span>
              </div>

              {/* Photorealistic Thumbnail Preview */}
              <div className="process-stage-thumb-wrap">
                <img
                  src={stage.image}
                  alt={stage.alt}
                  className="process-stage-thumb"
                  loading="lazy"
                  decoding="async"
                />
                <div className="process-stage-thumb-overlay" aria-hidden="true" />
              </div>

              {/* Content Details */}
              <div className="process-stage-body">
                <h3 className="process-stage-title">{stage.title}</h3>
                <p className="process-stage-desc t-body">{stage.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
