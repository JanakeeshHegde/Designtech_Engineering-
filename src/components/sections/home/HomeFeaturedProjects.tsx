import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuredProjects, allProjects } from "../../../data/projects";
import BeforeAfter from "../../common/BeforeAfter";
import "./HomeFeaturedProjects.css";

gsap.registerPlugin(ScrollTrigger);

// 4 main featured projects derived strictly from centralized data
const HOME_PROJECTS = featuredProjects.length >= 4 
  ? featuredProjects.slice(0, 4) 
  : allProjects.slice(0, 4);

export default function HomeFeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const currentProject = HOME_PROJECTS[activeIndex] || HOME_PROJECTS[0];

  // GSAP initial reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cad-stage-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: { trigger: ".cad-stage-header", start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        ".cad-drawing-board",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: ".cad-drawing-board", start: "top 80%", once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Smooth transition when switching projects
  const handleSelectProject = (index: number) => {
    if (index === activeIndex) return;

    if (stageRef.current) {
      gsap.fromTo(
        stageRef.current,
        { opacity: 0.2, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    }
    setActiveIndex(index);
    setWireframeMode(false);
  };

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
      ref={sectionRef}
      id="home-featured-projects"
      className="cad-stage-section"
      aria-labelledby="cad-stage-heading"
    >
      {/* Background CAD linework */}
      <div className="cad-stage-bg-grid" aria-hidden="true" />

      <div className="container">
        {/* Section Header */}
        <div className="cad-stage-header section-header">
          <div className="section-number">FEATURED WORK</div>
          <h2 id="cad-stage-heading" className="t-display-md cad-stage-title">
            LANDMARK STRUCTURAL PROJECTS
          </h2>
          <div className="section-divider" />
          <p className="t-body cad-stage-subtitle">
            A curated preview of landmark civil &amp; structural engineering developments engineered for permanence, constructability, and structural safety.
          </p>
        </div>

        {/* ── THE INTERACTIVE CAD DRAWING BOARD ── */}
        <div className="cad-drawing-board">
          {/* Top Board Frame Header / Sheet Title Block */}
          <div className="cad-board-top-bar">
            <div className="cad-board-datum-left">
              <span className="cad-board-status-dot">●</span>
              <span className="cad-board-dwg-title">DESIGNTECH ENGINEERING // FEATURED PROJECT STAGE</span>
              <span className="cad-board-scale">SCALE: 1:100</span>
            </div>

            <div className="cad-board-datum-right">
              <span className="cad-board-spec-code">SPEC: IS-456 / IS-800 / NBC-2016</span>
              <span className="cad-board-sheet-no">SHEET {currentProject.number} OF 04</span>
            </div>
          </div>

          {/* Project Selector Ribbon (01 to 04) */}
          <div className="cad-selector-ribbon" role="tablist" aria-label="Select drawing sheet">
            {HOME_PROJECTS.map((p, i) => {
              const isSelected = activeIndex === i;
              return (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={isSelected}
                  className={`cad-ribbon-tab ${isSelected ? "cad-ribbon-tab--active" : ""}`}
                  onClick={() => handleSelectProject(i)}
                >
                  <div className="cad-ribbon-tab-inner">
                    <span className="cad-ribbon-num">{p.number}</span>
                    <div className="cad-ribbon-text">
                      <span className="cad-ribbon-cat">{p.category}</span>
                      <span className="cad-ribbon-title">{p.title}</span>
                    </div>
                  </div>
                  {isSelected && <span className="cad-ribbon-active-bar" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          {/* Main Drawing Stage (Two-Column Layout) */}
          <div ref={stageRef} className="cad-stage-content">
            {/* ── LEFT: SPECIFICATIONS & HUD DATA ── */}
            <div className="cad-hud-column">
              <div className="cad-hud-sheet">
                {/* Meta Stamp */}
                <div className="cad-hud-meta-row">
                  <div className="cad-hud-cat-badge">{currentProject.category}</div>
                  <div className="cad-hud-dwg-ref">DWG: DT-{currentProject.number}</div>
                  <div className="cad-hud-approved-badge">VERIFIED RCC / PEB</div>
                </div>

                {/* Project Title */}
                <h3 className="t-heading cad-hud-project-title">
                  {currentProject.title}
                </h3>

                {/* Location & Typology Sub-bar */}
                <div className="cad-hud-sub-bar">
                  {currentProject.location && (
                    <span className="cad-hud-loc">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M6 1.5a3.5 3.5 0 0 0-3.5 3.5c0 2.5 3.5 5.5 3.5 5.5s3.5-3 3.5-5.5a3.5 3.5 0 0 0-3.5-3.5z" stroke="currentColor" strokeWidth="1.2" />
                        <circle cx="6" cy="5" r="1.2" fill="currentColor" />
                      </svg>
                      {currentProject.location}
                    </span>
                  )}
                  {currentProject.type && (
                    <span className="cad-hud-type">{currentProject.type}</span>
                  )}
                </div>

                {/* Description */}
                {currentProject.description && (
                  <p className="t-body cad-hud-description">
                    {currentProject.description}
                  </p>
                )}

                {/* Technical Parameters Table */}
                <dl className="cad-hud-params-grid">
                  {currentProject.client && (
                    <div className="cad-hud-param-cell">
                      <dt className="cad-hud-dt">CLIENT</dt>
                      <dd className="cad-hud-dd">{currentProject.client}</dd>
                    </div>
                  )}
                  {currentProject.floors && (
                    <div className="cad-hud-param-cell">
                      <dt className="cad-hud-dt">LEVELS / FLOORS</dt>
                      <dd className="cad-hud-dd">{currentProject.floors}</dd>
                    </div>
                  )}
                  {currentProject.builtUpArea && (
                    <div className="cad-hud-param-cell">
                      <dt className="cad-hud-dt">BUILT-UP AREA</dt>
                      <dd className="cad-hud-dd">{currentProject.builtUpArea}</dd>
                    </div>
                  )}
                  {currentProject.location && (
                    <div className="cad-hud-param-cell">
                      <dt className="cad-hud-dt">GEOGRAPHY</dt>
                      <dd className="cad-hud-dd">{currentProject.location}</dd>
                    </div>
                  )}
                </dl>

                {/* Key Facilities & Technical Provisions */}
                {((currentProject.facilities && currentProject.facilities.length > 0) ||
                  (currentProject.technicalHighlights && currentProject.technicalHighlights.length > 0)) && (
                  <div className="cad-hud-features">
                    <span className="cad-hud-feat-label">STRUCTURAL HIGHLIGHTS:</span>
                    <div className="cad-hud-chips">
                      {currentProject.technicalHighlights?.map((t) => (
                        <span key={t} className="cad-chip cad-chip--tech">{t}</span>
                      ))}
                      {currentProject.facilities?.slice(0, 3).map((f) => (
                        <span key={f} className="cad-chip">{f}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Action Link to Archive */}
                <div className="cad-hud-cta-wrap">
                  <Link
                    to={`/projects?id=${currentProject.id}`}
                    className="btn btn-outline cad-hud-inspect-btn"
                  >
                    <span>INSPECT FULL DRAWING IN ARCHIVE</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* ── RIGHT: LARGE BLUEPRINT VISUAL STAGE ── */}
            <div className="cad-visual-column">
              <div className="cad-viewport-frame">
                {/* CAD Corner Crosshairs */}
                <div className="cad-corner cad-corner--tl">+</div>
                <div className="cad-corner cad-corner--tr">+</div>
                <div className="cad-corner cad-corner--bl">+</div>
                <div className="cad-corner cad-corner--br">+</div>

                {/* Viewport Action Bar */}
                <div className="cad-viewport-controls">
                  <span className="cad-vp-indicator">
                    ⌖ VISUAL ELEVATION {currentProject.number}
                  </span>
                  
                  {/* Mode Toggles */}
                  <div className="cad-vp-toggles">
                    <button
                      type="button"
                      className={`cad-vp-mode-btn ${!wireframeMode ? "cad-vp-mode-btn--active" : ""}`}
                      onClick={() => setWireframeMode(false)}
                    >
                      RENDER
                    </button>
                    <button
                      type="button"
                      className={`cad-vp-mode-btn ${wireframeMode ? "cad-vp-mode-btn--active" : ""}`}
                      onClick={() => setWireframeMode(true)}
                    >
                      CAD BLUEPRINT
                    </button>
                  </div>
                </div>

                {/* Main Media Image / Before-After / Blueprint */}
                <div className={`cad-media-container ${wireframeMode ? "cad-media-container--wireframe" : ""}`}>
                  {currentProject.hasBeforeAfter && currentProject.beforeImage && currentProject.afterImage && !wireframeMode ? (
                    <div className="cad-ba-container">
                      <BeforeAfter
                        beforeSrc={currentProject.beforeImage}
                        afterSrc={currentProject.afterImage}
                        beforeLabel="CONSTRUCTION"
                        afterLabel="COMPLETED"
                      />
                    </div>
                  ) : imgErrors[currentProject.id] ? (
                    <div className="cad-fallback-view img-fallback">
                      <svg width="56" height="56" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                        <rect x="4" y="8" width="40" height="32" stroke="#A87524" strokeWidth="1" strokeOpacity="0.4" fill="none" />
                        <line x1="4" y1="8" x2="44" y2="40" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.3" />
                        <line x1="44" y1="8" x2="4" y2="40" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.3" />
                        <circle cx="24" cy="24" r="8" stroke="#A87524" strokeWidth="0.8" strokeOpacity="0.4" />
                      </svg>
                      <span className="cad-fallback-text">STRUCTURAL BLUEPRINT SHEET #{currentProject.number}</span>
                    </div>
                  ) : (
                    <img
                      src={currentProject.heroImage}
                      alt={currentProject.title}
                      className="cad-stage-img"
                      onError={() => handleImgError(currentProject.id)}
                    />
                  )}

                  {/* Wireframe Grid Matrix Overlay */}
                  <div className="cad-wireframe-grid" aria-hidden="true" />

                  {/* Axis Dimension Callout Lines */}
                  <div className="cad-axis-callout cad-axis-callout--bottom" aria-hidden="true">
                    <span className="cad-axis-tick">|</span>
                    <span className="cad-axis-line" />
                    <span className="cad-axis-label">GRID-SPAN: DT-{currentProject.number} // AXIS X-X</span>
                    <span className="cad-axis-line" />
                    <span className="cad-axis-tick">|</span>
                  </div>
                </div>

                {/* Bottom Dimension Indicator */}
                <div className="cad-viewport-footer">
                  <span className="cad-vp-sub">STRUCTURAL MODEL 2.5D ELEVATION</span>
                  <span className="cad-vp-coord">LAT 12.9716° N / LON 77.5946° E</span>
                </div>
              </div>
            </div>
          </div>

          {/* Board Bottom Navigation & Master CTA */}
          <div className="cad-board-bottom-bar">
            <div className="cad-board-nav-arrows">
              <button
                type="button"
                className="cad-arrow-btn"
                onClick={() => handleSelectProject((activeIndex - 1 + HOME_PROJECTS.length) % HOME_PROJECTS.length)}
                aria-label="Previous featured project"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>PREV SHEET</span>
              </button>

              <div className="cad-pagination-dots">
                {HOME_PROJECTS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`cad-dot ${activeIndex === i ? "cad-dot--active" : ""}`}
                    onClick={() => handleSelectProject(i)}
                    aria-label={`Go to project sheet ${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                className="cad-arrow-btn"
                onClick={() => handleSelectProject((activeIndex + 1) % HOME_PROJECTS.length)}
                aria-label="Next featured project"
              >
                <span>NEXT SHEET</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <Link to="/projects" className="btn btn-primary cad-master-cta">
              <span>VIEW ALL PROJECTS</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
