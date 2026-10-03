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
        ".hat-header-row",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".hat-inner", start: "top 85%", once: true },
        }
      );
      gsap.fromTo(
        ".hat-statement",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".hat-grid", start: "top 82%", once: true },
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
          scrollTrigger: { trigger: ".hat-grid", start: "top 82%", once: true },
        }
      );
      gsap.fromTo(
        ".hat-pillar",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: ".hat-pillars", start: "top 85%", once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="about-intro" className="home-about-teaser section" aria-labelledby="hat-heading">
      {/* Subtle architectural datum background */}
      <div className="hat-backdrop" aria-hidden="true">
        <div className="hat-datum-axis" />
        <div className="hat-elevation-grid" />
      </div>

      <div className="container">
        <div className="hat-inner">
          <div className="hat-header-row">
            <span className="hat-eyebrow">WHO WE ARE</span>
            <div className="hat-rule" aria-hidden="true" />
          </div>

          <div className="hat-grid">
            <div className="hat-left">
              <h2 id="hat-heading" className="hat-statement t-display-lg">
                Engineered with purpose. Built to endure.
              </h2>
            </div>

            <div className="hat-content-right">
              <p className="hat-body t-body">
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
                <Link to="/about" className="btn btn-primary hat-cta" aria-label="Learn more about Designtech Engineering">
                  <span>DISCOVER OUR STORY</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
