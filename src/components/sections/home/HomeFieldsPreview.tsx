import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./HomeFieldsPreview.css";

gsap.registerPlugin(ScrollTrigger);

import { FIELDS_PREVIEW } from "../../../data/sectors";


export default function HomeFieldsPreview() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hfpw-header-row",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: { trigger: ".hfpw-header-row", start: "top 88%", once: true },
        }
      );

      gsap.fromTo(
        ".hfpw-card",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".hfpw-grid", start: "top 88%", once: true },
        }
      );
    }, ref);

    const timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={ref} id="fields-preview" className="hfpw section" aria-labelledby="hfpw-heading">
      <div className="container">
        <div className="hfpw-header-row">
          <div className="hfpw-header-left">
            <span className="hfpw-eyebrow">FIELDS OF OPERATION</span>
            <h2 id="hfpw-heading" className="hfpw-headline">
              DIVERSE SECTORS, ONE STANDARD OF EXCELLENCE
            </h2>
          </div>
          <p className="hfpw-header-desc">
            From towering urban landmarks to critical hydraulic utilities and heavy industrial facilities,
            our engineering adapts to rigorous domain challenges.
          </p>
        </div>

        <div className="hfpw-grid" role="list">
          {FIELDS_PREVIEW.map((f) => (
            <Link
              key={f.num}
              to="/sectors"
              className="hfpw-card"
              role="listitem"
              aria-label={`Explore sector: ${f.title}`}
            >
              <div className="hfpw-card-top">
                <span className="hfpw-card-num">{f.num}</span>
                <span className="hfpw-card-cat">{f.category}</span>
              </div>
              <h3 className="hfpw-card-title">{f.title}</h3>
              <p className="hfpw-card-desc">{f.desc}</p>
              <div className="hfpw-card-bottom">
                <span className="hfpw-card-tag">{f.tag}</span>
                <div className="hfpw-card-arrow" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="hfpw-cta-row">
          <Link to="/sectors" className="btn btn-outline hfpw-cta">
            <span>EXPLORE ALL SPECIALIZED SECTORS</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
