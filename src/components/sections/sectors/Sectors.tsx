import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTORS } from "../../../data/sectors";
import { projects } from "../../../data/projects";
import "./Sectors.css";

gsap.registerPlugin(ScrollTrigger);

// Map sector IDs to representative projects dynamically based on category
const getRelatedProjectsForSector = (sectorId: string) => {
  switch (sectorId) {
    case "residential-commercial":
      return projects.filter(
        (p) => p.category === "Residential" || p.category === "Commercial"
      );
    case "industrial-institutions":
      return projects.filter(
        (p) => p.category === "Industrial" || p.category === "Institutional"
      );
    case "solar-renewable-energy":
      return projects.filter((p) => p.category === "Solar & Renewable");
    case "water-sewage-treatment":
      return [];
    default:
      return [];
  }
};

export default function Sectors() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeSectorId, setActiveSectorId] = useState<string>(SECTORS[0].id);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".sectors-header", { opacity: 0, y: 25 }, {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: ".sectors-header", start: "top 88%", once: true },
      });

      gsap.fromTo(".sectors-nav-pills", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.7, delay: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: ".sectors-nav-pills", start: "top 90%", once: true },
      });

      const chapters = gsap.utils.toArray<HTMLElement>(".sector-card-showcase");
      chapters.forEach((ch) => {
        gsap.fromTo(ch, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: ch, start: "top 85%", once: true },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToSector = (id: string) => {
    setActiveSectorId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="sectors" ref={sectionRef} className="sectors section" aria-labelledby="sectors-heading">
      <div className="container">
        {/* Section Header */}
        <div className="sectors-header">
          <div className="sectors-header-left">
            <span className="sectors-eyebrow">SPECIALIZED SECTORS</span>
            <h2 id="sectors-heading" className="sectors-headline t-display-md">
              FIELDS OF OPERATION
            </h2>
            <p className="sectors-header-desc t-body">
              Multi-disciplinary civil and structural engineering adapted to the distinct technical,
              structural, and regulatory requirements of every built environment.
            </p>
          </div>
          <div className="sectors-header-rule" aria-hidden="true" />
        </div>

        {/* Interactive Quick Navigation Pills */}
        <div className="sectors-nav-pills" role="tablist" aria-label="Sectors Quick Navigation">
          {SECTORS.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={activeSectorId === s.id}
              className={`sectors-pill-btn ${activeSectorId === s.id ? "sectors-pill-btn--active" : ""}`}
              onClick={() => scrollToSector(s.id)}
            >
              <span>{s.title}</span>
            </button>
          ))}
        </div>

        {/* Rich Architectural Sector Cards */}
        <div className="sectors-showcase-grid">
          {SECTORS.map((s) => {
            const relatedProjects = getRelatedProjectsForSector(s.id);

            return (
              <article
                key={s.id}
                id={s.id}
                className="sector-card-showcase"
              >
                {/* ── Left Column: Editorial & Technical Specifications ── */}
                <div className="sector-sc-content">
                  <div className="sector-sc-meta">
                    <span className="sector-sc-sub">{s.subtitle}</span>
                  </div>

                  <h3 className="sector-sc-title">{s.title}</h3>
                  <p className="sector-sc-desc t-body">{s.desc}</p>

                  {/* Core Capabilities / Technical Disciplines */}
                  <div className="sector-sc-disciplines">
                    <span className="sector-sc-label">ENGINEERING DISCIPLINES &amp; PARAMETERS</span>
                    <div className="sector-sc-tags" role="list">
                      {s.tags.map((tag) => (
                        <span key={tag} className="tag-chip" role="listitem">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Representative Sector Projects Snippet */}
                  {relatedProjects.length > 0 && (
                    <div className="sector-sc-projects-preview">
                      <div className="sector-sc-projects-header">
                        <span className="sector-sc-label">REPRESENTATIVE DOCUMENTED PROJECTS</span>
                        <span className="sector-sc-count-tag">{relatedProjects.length} PROJECTS</span>
                      </div>
                      <div className="sector-sc-proj-list" role="list">
                        {relatedProjects.map((rp) => (
                          <div
                            key={rp.id}
                            className="sector-sc-proj-item"
                            role="listitem"
                          >
                            <span className="sector-sc-proj-dot" aria-hidden="true" />
                            <span className="sector-sc-proj-name">{rp.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}


                </div>

                {/* ── Right Column: Architectural Visual Stage ── */}
                <div className="sector-sc-visual">
                  <div className="sector-sc-viewport">
                    <img
                      src={s.image}
                      alt={`${s.title} structural visual`}
                      className="sector-sc-img"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="sector-sc-overlay" aria-hidden="true" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
