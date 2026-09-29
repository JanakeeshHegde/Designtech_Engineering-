import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HomeAboutTeaser.css";

gsap.registerPlugin(ScrollTrigger);

export default function HomeAboutTeaser() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hat-statement",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".hat-inner", start: "top 82%", once: true },
        }
      );
      gsap.fromTo(
        ".hat-content-right",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".hat-inner", start: "top 82%", once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="about-intro" className="home-about-teaser section" aria-labelledby="hat-heading">
      {/* Background Architectural Blueprint Linework */}
      <div className="hat-blueprint-backdrop" aria-hidden="true">
        <svg className="hat-blueprint-svg" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="hat-fine-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168,117,36,0.05)" strokeWidth="0.5" />
            </pattern>
            <pattern id="hat-major-grid" width="200" height="200" patternUnits="userSpaceOnUse">
              <rect width="200" height="200" fill="url(#hat-fine-grid)" />
              <path d="M 200 0 L 0 0 0 200" fill="none" stroke="rgba(168,117,36,0.12)" strokeWidth="1" />
              <circle cx="0" cy="0" r="2" fill="rgba(168,117,36,0.2)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hat-major-grid)" />
          
          <g className="hat-blueprint-lines" stroke="rgba(168,117,36,0.18)" strokeWidth="0.8">
            <line x1="120" y1="0" x2="120" y2="800" strokeDasharray="6 6" />
            <line x1="560" y1="0" x2="560" y2="800" strokeDasharray="6 6" />
            <line x1="1000" y1="0" x2="1000" y2="800" strokeDasharray="6 6" />
            <line x1="0" y1="120" x2="1440" y2="120" strokeDasharray="8 4" opacity="0.6" />
            <line x1="0" y1="500" x2="1440" y2="500" strokeDasharray="8 4" opacity="0.6" />
            
            {/* Corner Drafting Marks */}
            <path d="M 40 40 L 60 40 M 40 40 L 40 60" stroke="rgba(168,117,36,0.35)" strokeWidth="1.2" />
            <path d="M 1400 40 L 1380 40 M 1400 40 L 1400 60" stroke="rgba(168,117,36,0.35)" strokeWidth="1.2" />
            <path d="M 40 760 L 60 760 M 40 760 L 40 740" stroke="rgba(168,117,36,0.35)" strokeWidth="1.2" />
            <path d="M 1400 760 L 1380 760 M 1400 760 L 1400 740" stroke="rgba(168,117,36,0.35)" strokeWidth="1.2" />
          </g>

          <text x="120" y="24" fill="rgba(168,117,36,0.3)" fontSize="8" fontFamily="DM Mono,monospace" textAnchor="middle">GRID 01-A</text>
          <text x="560" y="24" fill="rgba(168,117,36,0.3)" fontSize="8" fontFamily="DM Mono,monospace" textAnchor="middle">GRID 02-B</text>
          <text x="1000" y="24" fill="rgba(168,117,36,0.3)" fontSize="8" fontFamily="DM Mono,monospace" textAnchor="middle">GRID 03-C</text>
        </svg>
      </div>

      <div className="container">
        <div className="hat-inner">
          <div className="hat-header-row">
            <span className="hat-eyebrow">WHO WE ARE</span>
            <div className="hat-rule" aria-hidden="true" />
            <span className="hat-telemetry" aria-hidden="true">12.9716° N, 77.5946° E &bull; DT-ENG-01</span>
          </div>

          <div className="hat-grid">
            <div className="hat-left">
              <h2 id="hat-heading" className="hat-statement">
                Engineered with purpose. Built to endure.
              </h2>


            </div>

            <div className="hat-content-right">
              <p className="hat-body">
                Designtech Engineering is a premier Civil and Structural Engineering Consultancy
                headquartered in Bengaluru. We design and deliver resilient, cost-effective
                structural solutions across residential, commercial, industrial, and
                institutional developments — engineered for performance, constructed to endure.
              </p>

              <div className="hat-pillars" role="list">
                {["QUALITY FIRST", "INNOVATION", "COST-EFFECTIVE", "ON-TIME DELIVERY"].map((pillar, idx) => (
                  <div key={pillar} className="hat-pillar" role="listitem">
                    <span className="hat-pillar-num">0{idx + 1}</span>
                    <span className="hat-pillar-label">{pillar}</span>
                  </div>
                ))}
              </div>

              <div className="hat-action">
                <Link to="/about" className="btn btn-outline hat-cta" aria-label="Learn more about Designtech Engineering">
                  <span>DISCOVER OUR STORY &amp; CAPABILITIES</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
