import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HomeContactCTA.css";

gsap.registerPlugin(ScrollTrigger);

export default function HomeContactCTA() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hcc-text", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 78%" },
      });

      // Collapsing lines animation
      gsap.fromTo(".hcc-line", { scaleX: 1 }, {
        scaleX: 0.2, stagger: { each: 0.08, from: "center" }, duration: 1.2,
        ease: "power2.inOut", transformOrigin: "center",
        scrollTrigger: { trigger: ref.current, start: "top 70%", scrub: 1 },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="home-contact-cta" className="hcc section" aria-labelledby="hcc-heading">
      {/* Blueprint lines converging */}
      <div className="hcc-lines" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="hcc-line" style={{ opacity: 0.04 + i * 0.015 }} />
        ))}
      </div>

      <div className="container hcc-container">
        <div className="hcc-text">
          <div className="section-number">START A PROJECT</div>
          <h2 id="hcc-heading" className="hcc-heading t-display-lg">
            LET&apos;S BUILD<br />WHAT LASTS.
          </h2>
          <div className="section-divider" />
          <Link to="/contact" className="btn btn-primary hcc-btn">
            START A PROJECT
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
