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
      gsap.fromTo(".hat-statement", { opacity: 0, y: 35 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".hat-inner", start: "top 82%" },
      });
      gsap.fromTo(".hat-content-right", { opacity: 0, y: 35 }, {
        opacity: 1, y: 0, duration: 0.9, delay: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: ".hat-inner", start: "top 82%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="about-intro" className="home-about-teaser section" aria-labelledby="hat-heading">
      <div className="container">
        <div className="hat-inner">
          <div className="hat-header-row">
            <span className="hat-eyebrow">WHO WE ARE</span>
            <div className="hat-rule" aria-hidden="true" />
          </div>

          <div className="hat-grid">
            <div className="hat-left">
              <h2 id="hat-heading" className="hat-statement">
                Engineering with uncompromising purpose, precision, and longevity.
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
                  <span>DISCOVER OUR STORY & CAPABILITIES</span>
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
