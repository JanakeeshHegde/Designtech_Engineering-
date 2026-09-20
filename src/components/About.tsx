import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    num: "01",
    title: "UNCOMPROMISING QUALITY",
    desc: "Robust structural engineering designed for maximum durability, structural integrity, and long-term asset value.",
  },
  {
    num: "02",
    title: "INNOVATIVE METHODOLOGY",
    desc: "Deploying state-of-the-art structural modeling, seismic design, and advanced computational finite-element analysis.",
  },
  {
    num: "03",
    title: "COST OPTIMIZATION",
    desc: "Rigorous material efficiency and intelligent value-engineering without sacrificing safety factors or architectural intent.",
  },
  {
    num: "04",
    title: "SCHEDULE DISCIPLINE",
    desc: "Strict project management protocols ensuring construction documentation and approvals arrive on time, every time.",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(".about-eyebrow", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6,
        scrollTrigger: { trigger: ".about-eyebrow", start: "top 85%" },
      });

      gsap.fromTo(".about-title-line", { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".about-title", start: "top 82%" },
      });

      // Text block
      gsap.fromTo(".about-lead, .about-body-p", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: ".about-text-block", start: "top 78%" },
      });

      // SVG visual reveal
      gsap.fromTo(".about-struct-line", { strokeDashoffset: 400 }, {
        strokeDashoffset: 0, duration: 1.6, ease: "power2.out",
        scrollTrigger: { trigger: ".about-visual", start: "top 72%" },
      });

      // Value rows
      gsap.fromTo(".about-value-item", { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: ".about-values-list", start: "top 78%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about section" aria-labelledby="about-heading">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="about-header">
          <span className="about-eyebrow">01 / WHO WE ARE</span>
          <div className="about-header-rule" aria-hidden="true" />
        </div>

        <div className="about-grid">
          {/* Left Column: Narrative & Address */}
          <div className="about-narrative-col">
            <h2 id="about-heading" className="about-title">
              <span className="about-title-line">ENGINEERING</span>
              <span className="about-title-line">WITH ENDURING</span>
              <span className="about-title-line about-title-accent">PURPOSE.</span>
            </h2>

            <div className="about-text-block">
              <p className="about-lead">
                Designtech Engineering is a premier Civil and Structural Engineering
                Consultancy headquartered in Bengaluru, providing end-to-end structural
                engineering solutions for landmark architectural projects.
              </p>
              <p className="about-body-p">
                Our practice bridges architectural ambition with rigorous engineering science.
                From high-density residential towers and commercial headquarters to complex
                industrial facilities and institutional campuses, we deliver structures
                optimized for permanence, constructability, and structural efficiency.
              </p>
            </div>

            {/* Office Location Card */}
            <div className="about-office-card" role="contentinfo">
              <div className="about-office-header">
                <span className="about-office-badge">CONSULTANCY HQ</span>
                <span className="about-office-city">BENGALURU, INDIA</span>
              </div>
              <address className="about-office-address">
                <p>880, Nehru Road, BEML Layout 4th Stage</p>
                <p>RR Nagar, Bangalore – 560098, Karnataka</p>
              </address>
            </div>
          </div>

          {/* Right Column: Architectural Drawing + Core Pillars */}
          <div className="about-drawing-col">
            {/* Structural Drawing Visual */}
            <div className="about-visual" aria-hidden="true">
              <div className="about-visual-header">
                <span className="about-visual-tag">STRUCTURAL ASSEMBLY ELEVATION</span>
                <span className="about-visual-scale">SCALE 1:100</span>
              </div>

              <svg viewBox="0 0 340 420" fill="none" className="about-svg">
                {/* Soil layer */}
                <rect x="20" y="370" width="300" height="30" stroke="#A87524" strokeWidth="0.8" strokeOpacity="0.25" fill="#EFEBE3" />
                <line className="about-struct-line" x1="20" y1="385" x2="320" y2="385" stroke="#A87524" strokeWidth="0.5" strokeDasharray="4,4" strokeDashoffset="400" />

                {/* Foundation footing */}
                <rect className="about-struct-line" x="60" y="340" width="220" height="30" stroke="#A87524" strokeWidth="1.2" strokeDasharray="400" strokeDashoffset="400" fill="rgba(168,117,36,0.04)" />

                {/* Primary Columns */}
                <line className="about-struct-line" x1="80" y1="340" x2="80" y2="70" stroke="#202124" strokeWidth="2" strokeDasharray="400" strokeDashoffset="400" />
                <line className="about-struct-line" x1="170" y1="340" x2="170" y2="70" stroke="#A87524" strokeWidth="1.5" strokeDasharray="400" strokeDashoffset="400" />
                <line className="about-struct-line" x1="260" y1="340" x2="260" y2="70" stroke="#202124" strokeWidth="2" strokeDasharray="400" strokeDashoffset="400" />

                {/* Floor Beams & Slabs */}
                <line className="about-struct-line" x1="70" y1="260" x2="270" y2="260" stroke="#A87524" strokeWidth="1.2" strokeDasharray="400" strokeDashoffset="400" />
                <line className="about-struct-line" x1="70" y1="180" x2="270" y2="180" stroke="#A87524" strokeWidth="1.2" strokeDasharray="400" strokeDashoffset="400" />
                <line className="about-struct-line" x1="70" y1="100" x2="270" y2="100" stroke="#A87524" strokeWidth="1.5" strokeDasharray="400" strokeDashoffset="400" />

                {/* Roof Truss */}
                <path className="about-struct-line" d="M 60 100 L 170 45 L 280 100" stroke="#A87524" strokeWidth="1.8" strokeDasharray="400" strokeDashoffset="400" fill="none" />

                {/* Elevation Level Labels */}
                <text x="10" y="390" fill="#A87524" fontSize="7" fontFamily="DM Mono,monospace" opacity="0.6">GL ±0.00</text>
                <text x="10" y="360" fill="#A87524" fontSize="7" fontFamily="DM Mono,monospace" opacity="0.6">FOUNDATION</text>
                <text x="10" y="265" fill="#A87524" fontSize="7" fontFamily="DM Mono,monospace" opacity="0.6">LEVEL 01</text>
                <text x="10" y="185" fill="#A87524" fontSize="7" fontFamily="DM Mono,monospace" opacity="0.6">LEVEL 02</text>
                <text x="10" y="105" fill="#A87524" fontSize="7" fontFamily="DM Mono,monospace" opacity="0.6">ROOF BEAM</text>
              </svg>
            </div>

            {/* Core Values Editorial List */}
            <div className="about-values-list" role="list">
              {values.map((v) => (
                <div key={v.num} className="about-value-item" role="listitem">
                  <span className="about-value-num">{v.num}</span>
                  <div className="about-value-content">
                    <h3 className="about-value-title">{v.title}</h3>
                    <p className="about-value-desc">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
