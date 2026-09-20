import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuredProjects, allProjects } from "../data/projects";
import ProjectChapter from "./ProjectChapter";
import "./EngineeringJourney.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  onScrollToProject: (id: string) => void;
}

export default function EngineeringJourney({ onScrollToProject }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".ej-header", { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".ej-header", start: "top 80%" },
      });

      gsap.fromTo(".ej-universe-item", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, stagger: 0.07, duration: 0.5,
        scrollTrigger: { trigger: ".ej-universe", start: "top 75%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToProject = (id: string) => {
    const el = document.getElementById(`project-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    onScrollToProject(id);
  };

  return (
    <section id="journey" ref={sectionRef} className="eng-journey" aria-labelledby="ej-heading">
      {/* Header */}
      <div className="ej-intro container">
        <div className="ej-header section-header">
          <div className="section-number">05 / ENGINEERING JOURNEY</div>
          <h2 id="ej-heading" className="t-display-md">
            FROM DRAWINGS<br />TO REAL STRUCTURES.
          </h2>
          <div className="section-divider" />
          <p className="t-body" style={{ maxWidth: "520px" }}>
            Explore our engineering portfolio — each project a story of structural innovation, problem-solving, and collaboration.
          </p>
        </div>

        {/* Project Universe - horizontal rail */}
        <div className="ej-universe" role="navigation" aria-label="Project navigation">
          <div className="ej-universe-label">FEATURED PROJECTS INDEX</div>
          <div className="ej-universe-rail">
            {allProjects.map((p) => (
              <button
                key={p.id}
                className="ej-universe-item"
                onClick={() => scrollToProject(p.id)}
                aria-label={`Go to project: ${p.title}`}
              >
                <div className="ej-universe-thumb">
                  <div className="ej-universe-thumb-inner img-fallback">
                    <img
                      src={p.heroImage}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="ej-universe-thumb-overlay" aria-hidden="true" />
                  </div>
                </div>
                <div className="ej-universe-info">
                  <span className="ej-universe-num t-label">{p.number}</span>
                  <span className="ej-universe-title">{p.title}</span>
                  <span className="ej-universe-loc t-label">{p.location}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project chapters */}
      <div className="ej-chapters" role="list">
        {featuredProjects.map((project, i) => (
          <div key={project.id} role="listitem">
            <ProjectChapter project={project} index={i} />
          </div>
        ))}
      </div>

      {/* Other projects compact grid */}
      <div className="ej-other container">
        <div className="ej-other-header section-header">
          <div className="section-number">OTHER PROJECTS</div>
          <h3 className="t-heading">MORE FROM OUR PORTFOLIO</h3>
          <div className="section-divider" />
        </div>
        <div className="ej-other-grid">
          {allProjects.filter(p => !p.featured).map((p) => (
            <button
              key={p.id}
              className="ej-other-card"
              onClick={() => scrollToProject(p.id)}
              aria-label={`${p.title}, ${p.location}`}
            >
              <div className="ej-other-thumb img-fallback">
                <img
                  src={p.heroImage}
                  alt={p.title}
                  loading="lazy"
                  onError={(e) => {
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) parent.setAttribute("data-error", "true");
                  }}
                />
              </div>
              <div className="ej-other-info">
                <span className="ej-other-num t-label">{p.number}</span>
                <div className="ej-other-title">{p.title}</div>
                <div className="ej-other-loc t-label">{p.location}</div>
                {p.type && <div className="ej-other-type t-label">{p.type}</div>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
