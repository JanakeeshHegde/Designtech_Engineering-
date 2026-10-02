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
        scrollTrigger: { trigger: ".about-eyebrow", start: "top 88%", once: true },
      });

      gsap.fromTo(".about-title-line", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".about-title", start: "top 85%", once: true },
      });

      // Text block
      gsap.fromTo(".about-lead, .about-body-p", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: ".about-text-block", start: "top 82%", once: true },
      });

      // Value rows
      gsap.fromTo(".about-value-item", { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: ".about-values-list", start: "top 80%", once: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="about section" aria-labelledby="about-heading">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="about-header">
          <span className="about-eyebrow">WHO WE ARE</span>
          <div className="about-header-rule" aria-hidden="true" />
        </div>

        <div className="about-grid">
          {/* Left Column: Narrative & Address */}
          <div className="about-narrative-col">
            <h2 id="about-heading" className="about-title t-display-lg">
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
              <p className="about-body-p t-body">
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

          {/* Right Column: Values Grid */}
          <div className="about-values-col">
            <div className="about-values-list" role="list">
              {values.map((v) => (
                <div key={v.num} className="about-value-item" role="listitem">
                  <div className="about-value-top">
                    <span className="about-value-num">{v.num}</span>
                    <span className="about-value-indicator" aria-hidden="true" />
                  </div>
                  <div className="about-value-content">
                    <h3 className="about-value-title">{v.title}</h3>
                    <p className="about-value-desc t-body-sm">{v.desc}</p>
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
