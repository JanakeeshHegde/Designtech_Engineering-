import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "../../data/projects";
import BeforeAfter from "../common/BeforeAfter";
import "./ProjectCinematicChapter.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  project: Project;
  index: number;
}

export default function ProjectCinematicChapter({ project, index }: Props) {
  const isEven = index % 2 === 0;
  const sectionRef = useRef<HTMLElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);

  // Collect all valid image URLs
  const allImages: string[] = [
    project.heroImage,
    ...(project.gallery || []),
    ...(project.constructionImages || []),
    ...(project.completedImages || []),
  ]
    .filter((img): img is string => Boolean(img && img.trim().length > 0))
    .filter((img, idx, self) => self.indexOf(img) === idx);

  const hasImage = allImages.length > 0;
  const [activeImage, setActiveImage] = useState<string>(allImages[0] || "");
  const [imgError, setImgError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<"media" | "beforeAfter">(
    project.hasBeforeAfter && project.beforeImage && project.afterImage ? "beforeAfter" : "media"
  );

  // GSAP Cinematic Reveal & Parallax Sequence
  useEffect(() => {
    const el = sectionRef.current;
    const imgEl = imageFrameRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // 1. Staggered reveal sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        el.querySelector(".proj-ch-num-watermark"),
        { opacity: 0, scale: 0.92, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(
          el.querySelector(".proj-ch-axis-line"),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7, ease: "power2.inOut" },
          "-=0.5"
        )
        .fromTo(
          el.querySelector(".proj-ch-visual-wrap"),
          { opacity: 0, y: 40, clipPath: "inset(0 0 10% 0)" },
          { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          el.querySelector(".proj-ch-editorial-wrap"),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        );

      // 2. Subtle Parallax for the visual canvas
      if (imgEl) {
        gsap.to(imgEl, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id={`project-${project.id}`}
      ref={sectionRef}
      className={`proj-cinematic-chapter ${isEven ? "proj-ch--even" : "proj-ch--odd"}`}
      aria-labelledby={`ch-title-${project.id}`}
    >
      {/* Background Section Backdrop Linework */}
      <div className="proj-ch-bg-layer" aria-hidden="true">
        <div className="proj-ch-bg-grid" />
        <div className="proj-ch-bg-code">DT-PRJ // {project.number} // {project.category.toUpperCase()}</div>
      </div>

      <div className="container proj-ch-container">
        {/* Top Chapter Header Strip */}
        <div className="proj-ch-top-bar">
          <div className="proj-ch-top-left">
            <span className="proj-ch-category-pill">{project.category}</span>
            <span className="proj-ch-coord-tag">
              CHAPTER {project.number} &bull; {project.location ? project.location.toUpperCase() : "KARNATAKA"}
            </span>
          </div>

          <div className="proj-ch-top-right">
            <span className="proj-ch-spec-badge">ENGINEERING SPECIFICATION</span>
            <span className="proj-ch-status-indicator" />
          </div>
        </div>

        {/* Animated Engineering Horizon Line */}
        <div className="proj-ch-axis-line" aria-hidden="true" />

        {/* Cinematic Split Composition */}
        <div className="proj-ch-stage-grid">
          {/* ── 1. VISUAL / HERO IMAGE COLUMN ── */}
          <div className="proj-ch-visual-col">
            <div className="proj-ch-visual-wrap" ref={imageFrameRef}>
              {/* Engineering Corner Brackets */}
              <div className="proj-ch-corner proj-ch-corner--tl" aria-hidden="true" />
              <div className="proj-ch-corner proj-ch-corner--tr" aria-hidden="true" />
              <div className="proj-ch-corner proj-ch-corner--bl" aria-hidden="true" />
              <div className="proj-ch-corner proj-ch-corner--br" aria-hidden="true" />

              {/* Viewport Scale Indicator */}
              <div className="proj-ch-frame-header">
                <span className="proj-ch-frame-tag">DWG REF: DT-{project.number}</span>
                <span className="proj-ch-frame-scale">SCALE: 1:100 // IS 456</span>
              </div>

              {/* Image Frame Canvas */}
              <div className="proj-ch-frame-canvas">
                {hasImage && !imgError ? (
                  viewMode === "beforeAfter" && project.beforeImage && project.afterImage ? (
                    <div className="proj-ch-ba-container">
                      <BeforeAfter
                        beforeSrc={project.beforeImage}
                        afterSrc={project.afterImage}
                        beforeLabel="CONSTRUCTION STAGE"
                        afterLabel="COMPLETED STRUCTURE"
                      />
                    </div>
                  ) : (
                    <img
                      src={activeImage}
                      alt={`${project.title} — ${project.category}`}
                      loading="lazy"
                      className="proj-ch-hero-img"
                      onError={() => setImgError(true)}
                    />
                  )
                ) : (
                  /* Architectural Drafting Blueprint Canvas */
                  <div className="proj-ch-drafting-canvas" aria-hidden="true">
                    <svg className="proj-ch-drafting-svg" viewBox="0 0 540 360" fill="none">
                      <defs>
                        <pattern id={`draft-grid-${project.id}`} width="30" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(168,117,36,0.09)" strokeWidth="0.6" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#draft-grid-${project.id})`} />

                      {/* Structural Framing Grid */}
                      <rect x="30" y="30" width="480" height="300" stroke="rgba(168,117,36,0.3)" strokeWidth="1" strokeDasharray="6 4" fill="rgba(168,117,36,0.015)" />
                      <rect x="50" y="50" width="440" height="260" stroke="rgba(24,25,28,0.12)" strokeWidth="0.8" fill="none" />

                      {/* Center Crosshairs */}
                      <line x1="270" y1="15" x2="270" y2="345" stroke="rgba(168,117,36,0.22)" strokeWidth="0.8" strokeDasharray="4 4" />
                      <line x1="15" y1="180" x2="525" y2="180" stroke="rgba(168,117,36,0.22)" strokeWidth="0.8" strokeDasharray="4 4" />

                      {/* Central Structural Identity Badge */}
                      <circle cx="270" cy="180" r="54" stroke="rgba(168,117,36,0.3)" strokeWidth="1" />
                      <circle cx="270" cy="180" r="46" stroke="rgba(168,117,36,0.15)" strokeWidth="0.6" strokeDasharray="3 3" />
                      
                      <text x="270" y="174" fill="var(--color-gold, #A87524)" fontSize="13" fontFamily="DM Mono, monospace" fontWeight="700" textAnchor="middle" letterSpacing="0.12em">
                        DT-{project.number}
                      </text>
                      <text x="270" y="192" fill="var(--color-text-secondary, #5A6270)" fontSize="8.5" fontFamily="DM Mono, monospace" textAnchor="middle" letterSpacing="0.1em">
                        {project.category.toUpperCase()}
                      </text>

                      {/* Technical Footers */}
                      <text x="50" y="300" fill="var(--color-text-secondary, #5A6270)" fontSize="7.5" fontFamily="DM Mono, monospace">
                        CIVIL &amp; STRUCTURAL RECORD // {project.location ? project.location.toUpperCase() : "KARNATAKA"}
                      </text>
                      <text x="490" y="300" fill="var(--color-gold, #A87524)" fontSize="7.5" fontFamily="DM Mono, monospace" textAnchor="end">
                        IS 456 &bull; IS 800
                      </text>
                    </svg>
                  </div>
                )}
              </div>

              {/* Multi-image Sequence Filmstrip (if multiple images exist) */}
              {allImages.length > 1 && (
                <div className="proj-ch-sequence-bar">
                  <span className="proj-ch-seq-label">PROJECT VIEWS:</span>
                  <div className="proj-ch-seq-strip">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`proj-ch-seq-btn ${activeImage === img && viewMode === "media" ? "proj-ch-seq-btn--active" : ""}`}
                        onClick={() => {
                          setActiveImage(img);
                          setViewMode("media");
                          setImgError(false);
                        }}
                        aria-label={`View documentation image ${i + 1} for ${project.title}`}
                      >
                        <img src={img} alt="" />
                        <span className="proj-ch-seq-idx">{String(i + 1).padStart(2, "0")}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── 2. EDITORIAL METADATA & DOCUMENTATION COLUMN ── */}
          <div className="proj-ch-editorial-col">
            <div className="proj-ch-editorial-wrap">
              {/* Huge Cinematic Watermark Project Number */}
              <div className="proj-ch-num-watermark" aria-hidden="true">
                {project.number}
              </div>

              <div className="proj-ch-meta-header">
                <span className="proj-ch-meta-eyebrow">PROJECT SPECIFICATION // ARCHIVE</span>
                <h2 id={`ch-title-${project.id}`} className="proj-ch-title t-display-md">
                  {project.title}
                </h2>
                {project.type && (
                  <div className="proj-ch-typology-tag">{project.type}</div>
                )}
              </div>

              {/* Description Paragraph */}
              {project.description && (
                <p className="proj-ch-description t-body">
                  {project.description}
                </p>
              )}

              {/* Editorial Technical Specification Grid */}
              <dl className="proj-ch-spec-grid">
                {project.client && (
                  <div className="proj-ch-spec-row">
                    <dt className="proj-ch-dt">CLIENT</dt>
                    <dd className="proj-ch-dd">{project.client}</dd>
                  </div>
                )}

                {project.type && (
                  <div className="proj-ch-spec-row">
                    <dt className="proj-ch-dt">SCOPE / TYPOLOGY</dt>
                    <dd className="proj-ch-dd">{project.type}</dd>
                  </div>
                )}

                {project.floors && (
                  <div className="proj-ch-spec-row">
                    <dt className="proj-ch-dt">FLOORS / LEVELS</dt>
                    <dd className="proj-ch-dd">{project.floors}</dd>
                  </div>
                )}

                {project.builtUpArea && (
                  <div className="proj-ch-spec-row">
                    <dt className="proj-ch-dt">BUILT-UP AREA</dt>
                    <dd className="proj-ch-dd">{project.builtUpArea}</dd>
                  </div>
                )}

                {project.location && (
                  <div className="proj-ch-spec-row">
                    <dt className="proj-ch-dt">LOCATION</dt>
                    <dd className="proj-ch-dd">{project.location}</dd>
                  </div>
                )}

                <div className="proj-ch-spec-row">
                  <dt className="proj-ch-dt">CLASSIFICATION</dt>
                  <dd className="proj-ch-dd">{project.category}</dd>
                </div>
              </dl>

              {/* Inline In-Scene Detailed Specifications Toggle */}
              {((project.facilities && project.facilities.length > 0) ||
                (project.technicalHighlights && project.technicalHighlights.length > 0)) && (
                <div className="proj-ch-expand-container">
                  <button
                    type="button"
                    className="proj-ch-expand-btn"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                    aria-controls={`expand-details-${project.id}`}
                  >
                    <span>{isExpanded ? "COLLAPSE SPECIFICATIONS" : "EXPAND DETAILED TECHNICAL SPECIFICATIONS"}</span>
                    <span className={`proj-ch-expand-arrow ${isExpanded ? "proj-ch-expand-arrow--open" : ""}`}>
                      ↓
                    </span>
                  </button>

                  {/* Expandable Specifications Drawer */}
                  {isExpanded && (
                    <div
                      id={`expand-details-${project.id}`}
                      className="proj-ch-expanded-drawer"
                      role="region"
                      aria-label="Detailed technical highlights and facilities"
                    >
                      {project.facilities && project.facilities.length > 0 && (
                        <div className="proj-ch-exp-section">
                          <span className="proj-ch-exp-label">FACILITIES &amp; SPACES PROVIDED:</span>
                          <ul className="proj-ch-exp-list" role="list">
                            {project.facilities.map((fac, i) => (
                              <li key={i} className="proj-ch-exp-item" role="listitem">
                                <span className="proj-ch-exp-bullet" aria-hidden="true" />
                                <span>{fac}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {project.technicalHighlights && project.technicalHighlights.length > 0 && (
                        <div className="proj-ch-exp-section">
                          <span className="proj-ch-exp-label">TECHNICAL PARAMETERS &amp; SPANS:</span>
                          <div className="proj-ch-tech-chips">
                            {project.technicalHighlights.map((tech, i) => (
                              <span key={i} className="proj-ch-tech-chip">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
