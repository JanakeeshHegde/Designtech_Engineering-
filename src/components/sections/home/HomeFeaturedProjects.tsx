import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuredProjects, allProjects } from "../../../data/projects";
import { getProjectAllImages } from "../../../utils/projectImages";
import BeforeAfter from "../../common/BeforeAfter";
import "./HomeFeaturedProjects.css";

gsap.registerPlugin(ScrollTrigger);

// Exactly 4 featured projects derived strictly from centralized data
const HOME_PROJECTS = featuredProjects.length >= 4 
  ? featuredProjects.slice(0, 4) 
  : allProjects.slice(0, 4);

export default function HomeFeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const currentProject = HOME_PROJECTS[activeIndex] || HOME_PROJECTS[0];
  const allImages = getProjectAllImages(currentProject);
  const [activeImage, setActiveImage] = useState<string>(allImages[0] || "");
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const isEven = activeIndex % 2 === 0;

  useEffect(() => {
    const imgs = getProjectAllImages(currentProject);
    setActiveImage(imgs[0] || "");
  }, [currentProject.id, activeIndex]);

  const handleImageError = (failedSrc: string) => {
    setFailedImages((prev) => {
      const next = new Set(prev);
      next.add(failedSrc);
      return next;
    });
    const remaining = allImages.filter((img) => img !== failedSrc && !failedImages.has(img));
    if (remaining.length > 0) {
      setActiveImage(remaining[0]);
    }
  };

  const availableImages = allImages.filter((img) => !failedImages.has(img));
  const hasValidImage = availableImages.length > 0 && Boolean(activeImage);

  // Initial scroll reveal for section
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hfp-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: { trigger: ".hfp-header", start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        ".hfp-showcase-board",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: ".hfp-showcase-board", start: "top 80%", once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate transition when active project changes
  const handleSelectProject = (index: number) => {
    if (index === activeIndex) return;

    if (stageRef.current) {
      gsap.fromTo(
        stageRef.current,
        { opacity: 0.2, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }

    setActiveIndex(index);
  };

  return (
    <section
      ref={sectionRef}
      id="home-featured-projects"
      className="hfp-section section"
      aria-labelledby="hfp-heading"
    >
      <div className="container">
        {/* Section Header */}
        <div className="hfp-header section-header">
          <div className="section-number">04 // FEATURED WORK</div>
          <h2 id="hfp-heading" className="t-display-md hfp-title">
            FEATURED PROJECTS
          </h2>
          <div className="section-divider" />
        </div>

        {/* ── THE EDITORIAL ENGINEERING SHOWCASE BOARD ── */}
        <div className="hfp-showcase-board">
          {/* Top Status Strip */}
          <div className="hfp-board-top-bar">
            <div className="hfp-datum-left">
              <span className="hfp-status-dot">●</span>
              <span className="hfp-dwg-title">DESIGNTECH ENGINEERING // FEATURED PROJECTS</span>
            </div>

            <div className="hfp-datum-right">
              <span className="hfp-sheet-counter">PROJECT 0{activeIndex + 1} OF 04</span>
            </div>
          </div>

          {/* Project Selector Ribbon */}
          <div className="hfp-selector-ribbon" role="tablist" aria-label="Select featured project sheet">
            {HOME_PROJECTS.map((p, i) => {
              const isSelected = activeIndex === i;
              return (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={isSelected}
                  className={`hfp-ribbon-tab ${isSelected ? "hfp-ribbon-tab--active" : ""}`}
                  onClick={() => handleSelectProject(i)}
                >
                  <div className="hfp-ribbon-tab-inner">
                    <span className="hfp-ribbon-num">{p.number}</span>
                    <div className="hfp-ribbon-text">
                      <span className="hfp-ribbon-cat">{p.category}</span>
                      <span className="hfp-ribbon-title">{p.title}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Presentation Stage */}
          <div
            ref={stageRef}
            className={`hfp-stage-content ${isEven ? "hfp-stage--even" : "hfp-stage--odd"}`}
          >
            {/* ── COLUMN 1: SPECIFICATIONS & HUD DATA ── */}
            <div className="hfp-info-col">
              <div className="hfp-info-sheet">
                {/* Big Number & Category Badge */}
                <div className="hfp-num-row">
                  <div className="hfp-big-number">
                    <span>{currentProject.number}</span>
                  </div>
                  <div className="hfp-num-meta">
                    <span className="badge">{currentProject.category}</span>
                  </div>
                </div>

                {/* Project Title */}
                <h3 className="t-display-sm hfp-project-title">
                  {currentProject.title}
                </h3>

                {/* Location & Typology Sub-bar */}
                <div className="hfp-sub-bar">
                  {currentProject.location && (
                    <span className="hfp-loc-tag">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M6 1.5a3.5 3.5 0 0 0-3.5 3.5c0 2.5 3.5 5.5 3.5 5.5s3.5-3 3.5-5.5a3.5 3.5 0 0 0-3.5-3.5z" stroke="currentColor" strokeWidth="1.2" />
                        <circle cx="6" cy="5" r="1.2" fill="currentColor" />
                      </svg>
                      {currentProject.location}
                    </span>
                  )}
                  {currentProject.type && (
                    <span className="hfp-type-tag">{currentProject.type}</span>
                  )}
                </div>

                {/* Technical Parameters Table */}
                <dl className="hfp-params-grid">
                  {currentProject.client && (
                    <div className="hfp-param-cell">
                      <dt className="hfp-dt">CLIENT</dt>
                      <dd className="hfp-dd">{currentProject.client}</dd>
                    </div>
                  )}
                  {currentProject.floors && (
                    <div className="hfp-param-cell">
                      <dt className="hfp-dt">LEVELS / FLOORS</dt>
                      <dd className="hfp-dd">{currentProject.floors}</dd>
                    </div>
                  )}
                  {currentProject.builtUpArea && (
                    <div className="hfp-param-cell">
                      <dt className="hfp-dt">BUILT-UP AREA</dt>
                      <dd className="hfp-dd">{currentProject.builtUpArea}</dd>
                    </div>
                  )}
                  {currentProject.location && (
                    <div className="hfp-param-cell">
                      <dt className="hfp-dt">GEOGRAPHY</dt>
                      <dd className="hfp-dd">{currentProject.location}</dd>
                    </div>
                  )}
                </dl>

                {/* Structural Highlights & Facilities */}
                {((currentProject.facilities && currentProject.facilities.length > 0) ||
                  (currentProject.technicalHighlights && currentProject.technicalHighlights.length > 0)) && (
                  <div className="hfp-highlights">
                    <span className="hfp-feat-label">STRUCTURAL HIGHLIGHTS:</span>
                    <div className="hfp-chips">
                      {currentProject.technicalHighlights?.map((t) => (
                        <span key={t} className="tag-chip">{t}</span>
                      ))}
                      {currentProject.facilities?.slice(0, 3).map((f) => (
                        <span key={f} className="tag-chip">{f}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Direct Action Link to Archive */}
                <div className="hfp-cta-wrap">
                  <Link
                    to={`/projects?id=${currentProject.id}`}
                    className="btn btn-outline hfp-inspect-btn"
                  >
                    <span>INSPECT FULL CASE STUDY IN ARCHIVE</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* ── COLUMN 2: ARCHITECTURAL VISUAL STAGE ── */}
            <div className="hfp-visual-col">
              <div className="hfp-viewport-frame">
                <div className="hfp-media-container">
                  {currentProject.hasBeforeAfter && currentProject.beforeImage && currentProject.afterImage ? (
                    <div className="hfp-ba-wrap">
                      <BeforeAfter
                        beforeSrc={currentProject.beforeImage}
                        afterSrc={currentProject.afterImage}
                        beforeLabel="CONSTRUCTION"
                        afterLabel="COMPLETED"
                      />
                    </div>
                  ) : hasValidImage ? (
                    <img
                      src={activeImage}
                      alt={`${currentProject.title} architectural view`}
                      className="hfp-stage-img"
                      loading="lazy"
                      onError={() => handleImageError(activeImage)}
                    />
                  ) : (
                    <div className="hfp-no-img-placeholder">
                      <span className="t-mono">{currentProject.title}</span>
                      <span className="t-label">ARCHITECTURAL SCHEMATIC</span>
                    </div>
                  )}
                </div>

                {/* Thumbnail views strip if multiple images exist */}
                {availableImages.length > 1 && (
                  <div className="hfp-thumb-row" role="tablist" aria-label="Project views">
                    {availableImages.map((img, idx) => (
                      <button
                        key={img}
                        type="button"
                        className={`hfp-thumb-btn ${activeImage === img ? "hfp-thumb-btn--active" : ""}`}
                        onClick={() => setActiveImage(img)}
                        aria-label={`View ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="hfp-thumb-img"
                          onError={() => handleImageError(img)}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Board Bottom Navigation & Master CTA */}
          <div className="hfp-board-bottom-bar">
            <div className="hfp-board-nav-arrows">
              <button
                type="button"
                className="hfp-arrow-btn"
                onClick={() => handleSelectProject((activeIndex - 1 + HOME_PROJECTS.length) % HOME_PROJECTS.length)}
                aria-label="Previous featured project"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>PREV SHEET</span>
              </button>

              <div className="hfp-pagination-dots">
                {HOME_PROJECTS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`hfp-dot ${activeIndex === i ? "hfp-dot--active" : ""}`}
                    onClick={() => handleSelectProject(i)}
                    aria-label={`Go to project sheet ${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                className="hfp-arrow-btn"
                onClick={() => handleSelectProject((activeIndex + 1) % HOME_PROJECTS.length)}
                aria-label="Next featured project"
              >
                <span>NEXT SHEET</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <Link to="/projects" className="btn btn-primary hfp-master-cta">
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
