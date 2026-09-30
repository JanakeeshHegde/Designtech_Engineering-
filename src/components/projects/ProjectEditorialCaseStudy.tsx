import { useState, useEffect } from "react";
import type { Project } from "../../data/projects";
import { getProjectAllImages } from "../../utils/projectImages";
import ProjectTechnicalOverlay from "./ProjectTechnicalOverlay";
import BeforeAfter from "../common/BeforeAfter";
import "./ProjectEditorialCaseStudy.css";

interface Props {
  project: Project;
  index: number;
}

export default function ProjectEditorialCaseStudy({ project, index }: Props) {
  const isEven = index % 2 === 0;

  // Gather unique available images for this project (both explicit and auto-discovered)
  const allImages = getProjectAllImages(project);
  const hasImage = allImages.length > 0;
  const [activeImage, setActiveImage] = useState<string>(allImages[0] || "");
  const [imgError, setImgError] = useState(false);
  const [viewMode, setViewMode] = useState<"media" | "beforeAfter">(
    project.hasBeforeAfter && project.beforeImage && project.afterImage ? "beforeAfter" : "media"
  );

  useEffect(() => {
    setActiveImage(allImages[0] || "");
    setImgError(false);
  }, [project.id, allImages.length]);

  return (
    <article
      id={`project-${project.id}`}
      className={`proj-case-study ${isEven ? "proj-case-study--even" : "proj-case-study--odd"}`}
      aria-labelledby={`case-title-${project.id}`}
    >
      {/* Background Architectural Accent */}
      <div
        className="proj-cs-bg-accent"
        style={{ background: project.accentColor ? `${project.accentColor}05` : "transparent" }}
        aria-hidden="true"
      />

      {/* Top Engineering Classification Strip */}
      <div className="proj-cs-top-strip">
        <div className="proj-cs-top-left">
          <span className="proj-cs-bullet" style={{ backgroundColor: project.accentColor || "var(--color-gold)" }} />
          <span className="proj-cs-category">{project.category}</span>
        </div>

        <div className="proj-cs-top-right">
          <span className="proj-cs-number-label">PROJECT NUMBER</span>
          <span className="proj-cs-number">{project.number}</span>
        </div>
      </div>

      {/* Main Project Title Block */}
      <div className="proj-cs-title-block">
        <h2 id={`case-title-${project.id}`} className="t-display-md proj-cs-title">
          {project.title}
        </h2>
        <div className="proj-cs-tags">
          {project.location && (
            <span className="proj-cs-loc-tag">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1.5a3.5 3.5 0 0 0-3.5 3.5c0 2.5 3.5 5.5 3.5 5.5s3.5-3 3.5-5.5a3.5 3.5 0 0 0-3.5-3.5z" stroke="currentColor" strokeWidth="1" />
                <circle cx="6" cy="5" r="1.2" fill="currentColor" />
              </svg>
              {project.location}
            </span>
          )}
          {project.type && <span className="proj-cs-type-tag">{project.type}</span>}
        </div>
      </div>

      {/* Editorial Content Grid (Alternating Left/Right) */}
      <div className="proj-cs-grid">
        {/* ── VISUAL / MEDIA PRESENTATION ── */}
        <div className="proj-cs-media-col">
          {/* Media Switcher Tab (if Before & After exists) */}
          {hasImage && project.hasBeforeAfter && project.beforeImage && project.afterImage && (
            <div className="proj-cs-media-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === "beforeAfter"}
                className={`proj-cs-tab ${viewMode === "beforeAfter" ? "proj-cs-tab--active" : ""}`}
                onClick={() => setViewMode("beforeAfter")}
              >
                CONSTRUCTION &amp; COMPLETED COMPARISON
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === "media"}
                className={`proj-cs-tab ${viewMode === "media" ? "proj-cs-tab--active" : ""}`}
                onClick={() => setViewMode("media")}
              >
                PRIMARY ARCHITECTURAL VIEW
              </button>
            </div>
          )}

          {/* Large Architectural Frame */}
          <div className="proj-cs-frame">
            <ProjectTechnicalOverlay projectNumber={project.number} category={project.category} />

            {hasImage && !imgError ? (
              viewMode === "beforeAfter" && project.beforeImage && project.afterImage ? (
                <div className="proj-cs-ba-wrap">
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
                  alt={`${project.title} architectural view`}
                  loading="lazy"
                  className="proj-cs-img"
                  onError={() => setImgError(true)}
                />
              )
            ) : (
              <div className="proj-cs-drafting-canvas" aria-hidden="true">
                <svg className="proj-cs-drafting-svg" viewBox="0 0 480 330" fill="none">
                  {/* Grid Lines */}
                  <defs>
                    <pattern id={`cs-grid-${project.id}`} width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(168,117,36,0.08)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#cs-grid-${project.id})`} />

                  {/* Structural Framing Outline */}
                  <rect x="35" y="35" width="410" height="260" stroke="rgba(168,117,36,0.3)" strokeWidth="1" strokeDasharray="6 4" fill="rgba(168,117,36,0.02)" />
                  <rect x="55" y="55" width="370" height="220" stroke="rgba(24,25,28,0.08)" strokeWidth="0.8" fill="none" />

                  {/* Axis Crosshairs */}
                  <line x1="240" y1="20" x2="240" y2="310" stroke="rgba(168,117,36,0.2)" strokeWidth="0.8" strokeDasharray="4 4" />
                  <line x1="20" y1="165" x2="460" y2="165" stroke="rgba(168,117,36,0.2)" strokeWidth="0.8" strokeDasharray="4 4" />

                  {/* Structural Center Watermark & Metadata */}
                  <circle cx="240" cy="165" r="45" stroke="rgba(168,117,36,0.25)" strokeWidth="1" />
                  <circle cx="240" cy="165" r="38" stroke="rgba(168,117,36,0.15)" strokeWidth="0.5" strokeDasharray="3 3" />
                  
                  <text x="240" y="160" fill="var(--color-gold, #A87524)" fontSize="11" fontFamily="DM Mono, monospace" fontWeight="700" textAnchor="middle" letterSpacing="0.1em">
                    {project.number}
                  </text>
                  <text x="240" y="176" fill="var(--color-text-secondary, #5A6270)" fontSize="7.5" fontFamily="DM Mono, monospace" textAnchor="middle" letterSpacing="0.08em">
                    {project.category.toUpperCase()} // ARCHIVE
                  </text>

                  {/* Bottom Sheet Spec Marker */}
                  <text x="425" y="265" fill="var(--color-gold, #A87524)" fontSize="7" fontFamily="DM Mono, monospace" textAnchor="end">
                    STRUCTURAL RECORD
                  </text>
                </svg>
              </div>
            )}
          </div>

          {/* Editorial Thumbnail Gallery (if multiple images exist) */}
          {allImages.length > 1 && (
            <div className="proj-cs-gallery">
              <span className="proj-cs-gallery-heading">DOCUMENTATION VIEWS &amp; DRAWINGS:</span>
              <div className="proj-cs-thumbs">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`proj-cs-thumb-btn ${activeImage === img && viewMode === "media" ? "proj-cs-thumb-btn--active" : ""}`}
                    onClick={() => {
                      setActiveImage(img);
                      setViewMode("media");
                      setImgError(false);
                    }}
                    aria-label={`View image ${i + 1} for ${project.title}`}
                  >
                    <img
                      src={img}
                      alt=""
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <span className="proj-cs-thumb-idx">{i + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── ENGINEERING SPECIFICATIONS & INFORMATION ── */}
        <div className="proj-cs-info-col">
          <div className="proj-cs-specs-card">
            <div className="proj-cs-card-header">
              <span className="proj-cs-sheet-title">STRUCTURAL CASE SPECIFICATION</span>
              <span className="proj-cs-sheet-badge">IS 456 / IS 800</span>
            </div>

            {/* Description */}
            {project.description && (
              <p className="proj-cs-description t-body">
                {project.description}
              </p>
            )}

            {/* Specifications Parameters List */}
            <dl className="proj-cs-spec-list">
              {project.client && (
                <div className="proj-cs-spec-row">
                  <dt className="proj-cs-dt">CLIENT</dt>
                  <dd className="proj-cs-dd">{project.client}</dd>
                </div>
              )}

              {project.type && (
                <div className="proj-cs-spec-row">
                  <dt className="proj-cs-dt">SCOPE / PROJECT</dt>
                  <dd className="proj-cs-dd">{project.type}</dd>
                </div>
              )}

              {project.floors && (
                <div className="proj-cs-spec-row">
                  <dt className="proj-cs-dt">FLOORS / LEVELS</dt>
                  <dd className="proj-cs-dd">{project.floors}</dd>
                </div>
              )}

              {project.builtUpArea && (
                <div className="proj-cs-spec-row">
                  <dt className="proj-cs-dt">BUILT-UP AREA</dt>
                  <dd className="proj-cs-dd">{project.builtUpArea}</dd>
                </div>
              )}

              {project.location && (
                <div className="proj-cs-spec-row">
                  <dt className="proj-cs-dt">LOCATION</dt>
                  <dd className="proj-cs-dd">{project.location}</dd>
                </div>
              )}

              <div className="proj-cs-spec-row">
                <dt className="proj-cs-dt">CLASSIFICATION</dt>
                <dd className="proj-cs-dd">{project.category}</dd>
              </div>
            </dl>

            {/* Facilities Section */}
            {project.facilities && project.facilities.length > 0 && (
              <div className="proj-cs-facilities-block">
                <div className="proj-cs-block-title">FACILITIES &amp; SPACES PROVIDED</div>
                <ul className="proj-cs-fac-list" role="list">
                  {project.facilities.map((fac, idx) => (
                    <li key={idx} className="proj-cs-fac-item" role="listitem">
                      <span className="proj-cs-fac-bullet" aria-hidden="true" />
                      <span>{fac}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technical Highlights Section */}
            {project.technicalHighlights && project.technicalHighlights.length > 0 && (
              <div className="proj-cs-tech-block">
                <div className="proj-cs-block-title">TECHNICAL HIGHLIGHTS &amp; SPANS</div>
                <div className="proj-cs-tech-chips">
                  {project.technicalHighlights.map((tech, idx) => (
                    <span key={idx} className="proj-cs-tech-chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </article>
  );
}
