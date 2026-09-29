import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./EngineeringJourney.css";

gsap.registerPlugin(ScrollTrigger);

export default function EngineeringJourney() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ej-header",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".ej-header", start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".ej-journey-step",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ej-journey-steps", start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="journey" ref={sectionRef} className="eng-journey" aria-labelledby="ej-heading">
      {/* Header — Kept exactly as required */}
      <div className="ej-intro container">
        <div className="ej-header section-header">
          <div className="section-number">FEATURED ENGINEERING JOURNEY</div>
          <h2 id="ej-heading" className="t-display-md">
            FROM DRAWINGS<br />TO REAL STRUCTURES.
          </h2>
          <div className="section-divider" />
          <p className="t-body" style={{ maxWidth: "560px" }}>
            A selection from our portfolio. Each project tells the story of structural precision, problem-solving, and commitment to delivery.
          </p>
        </div>

        {/* Engineering Methodology Journey (No project cards) */}
        <div className="ej-journey-steps">
          <div className="ej-journey-step">
            <div className="ej-step-num">01</div>
            <div className="ej-step-content">
              <h3 className="ej-step-title">ANALYSIS &amp; MATHEMATICAL MODELING</h3>
              <p className="ej-step-desc t-body">
                Every project begins with rigorous analytical calculations and finite element modeling. We simulate dead loads, live loads, seismic forces (Zone II/III), and wind pressures to establish the most efficient load transfer mechanisms before drafting commences.
              </p>
            </div>
          </div>

          <div className="ej-journey-step">
            <div className="ej-step-num">02</div>
            <div className="ej-step-content">
              <h3 className="ej-step-title">GEOTECHNICAL &amp; SUBSTRUCTURE DESIGN</h3>
              <p className="ej-step-desc t-body">
                Correlating borehole soil investigation data with structural requirements, we engineer site-specific foundation solutions—from isolated pad footings and combined rafts to deep bored cast-in-situ piles with high water tables.
              </p>
            </div>
          </div>

          <div className="ej-journey-step">
            <div className="ej-step-num">03</div>
            <div className="ej-step-content">
              <h3 className="ej-step-title">STRUCTURAL STEEL, PEB &amp; RCC DETAILING</h3>
              <p className="ej-step-desc t-body">
                Translating design loads into clash-free structural documentation. We specialize in long clear spans (up to 22m+), industrial gantry girders, pre-engineered building (PEB) frameworks, and ductile reinforced concrete frames.
              </p>
            </div>
          </div>

          <div className="ej-journey-step">
            <div className="ej-step-num">04</div>
            <div className="ej-step-content">
              <h3 className="ej-step-title">CONSTRUCTION SUPERVISION &amp; PERMANENCE</h3>
              <p className="ej-step-desc t-body">
                From steel rebar placement inspections to concrete pour verification, our engineering team ensures that what was designed on CAD drawings is constructed with uncompromising precision on site.
              </p>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
