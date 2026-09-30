import { useState } from "react";
import type { Project } from "../../data/projects";
import { getProjectMainImage, getProjectAllImages } from "../../utils/projectImages";
import ProjectTechnicalOverlay from "./ProjectTechnicalOverlay";
import "./ProjectIndexItem.css";

interface Props {
  project: Project;
  index?: number;
  onSelectProject: (project: Project) => void;
}

export default function ProjectIndexItem({ project, onSelectProject }: Props) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mainImg = getProjectMainImage(project);
  const totalImages = getProjectAllImages(project).length;

  return (
    <article
      id={`project-spec-${project.id}`}
      className={`proj-item ${isHovered ? "proj-item--hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectProject(project)}
      tabIndex={0}
      role="button"
      aria-label={`Inspect ${project.title}, ${project.category} project ${project.number}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelectProject(project);
        }
      }}
    >
      {/* Background Architectural Accent */}
      <div
        className="proj-item-bg-accent"
        style={{ background: project.accentColor ? `${project.accentColor}06` : "transparent" }}
        aria-hidden="true"
      />

      <div className="proj-item-grid">
        {/* ── LEFT COLUMN: Number & Category ── */}
        <div className="proj-item-left">
          <div className="proj-item-category-tag">
            <span className="proj-item-cat-bullet" style={{ backgroundColor: project.accentColor || "var(--color-gold)" }} />
            <span>{project.category}</span>
          </div>

          <div className="proj-item-number" aria-hidden="true">
            {project.number}
          </div>

          <div className="proj-item-dwg-meta">
            <span className="proj-item-dwg-label">ARCHIVE REF</span>
            <span className="proj-item-dwg-val">{project.number}</span>
          </div>

          {project.location && (
            <div className="proj-item-location-badge">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1.5a3.5 3.5 0 0 0-3.5 3.5c0 2.5 3.5 5.5 3.5 5.5s3.5-3 3.5-5.5a3.5 3.5 0 0 0-3.5-3.5z" stroke="currentColor" strokeWidth="1" />
                <circle cx="6" cy="5" r="1.2" fill="currentColor" />
              </svg>
              <span>{project.location}</span>
            </div>
          )}
        </div>

        {/* ── CENTER COLUMN: Technical Visual Framing ── */}
        <div className="proj-item-center">
          <div className="proj-item-frame">
            <ProjectTechnicalOverlay projectNumber={project.number} category={project.category} />

            {/* Media Image / Fallback */}
            {!mainImg || imgError ? (
              <div className="proj-item-fallback img-fallback">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                  <rect x="4" y="8" width="40" height="32" stroke="#A87524" strokeWidth="1" strokeOpacity="0.4" fill="none" />
                  <line x1="4" y1="8" x2="44" y2="40" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.3" />
                  <line x1="44" y1="8" x2="4" y2="40" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.3" />
                  <circle cx="24" cy="24" r="6" stroke="#A87524" strokeWidth="0.8" strokeOpacity="0.4" />
                </svg>
                <span className="proj-item-fallback-txt">STRUCTURAL BLUEPRINT ARCHIVE</span>
              </div>
            ) : (
              <img
                src={mainImg}
                alt={project.title}
                loading="lazy"
                className="proj-item-img"
                onError={() => setImgError(true)}
              />
            )}

            {/* Badges on Visual */}
            <div className="proj-item-visual-badges" aria-hidden="true">
              {totalImages > 1 && (
                <span className="proj-badge proj-badge--media">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <rect x="1" y="2" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1" />
                    <circle cx="4" cy="4.5" r="1" fill="currentColor" />
                    <path d="M1 9l3-3 3 3 4-4" stroke="currentColor" strokeWidth="1" />
                  </svg>
                  {totalImages} VIEWS
                </span>
              )}

              {project.hasBeforeAfter && (
                <span className="proj-badge proj-badge--compare">
                  BEFORE &amp; AFTER
                </span>
              )}
            </div>

            {/* Hover Inspect CTA Overlay */}
            <div className="proj-item-inspect-overlay">
              <span className="proj-item-inspect-btn">
                <span>INSPECT SPECIFICATION</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Project Data & Key Parameters ── */}
        <div className="proj-item-right">
          <div className="proj-item-header">
            <h2 className="t-heading proj-item-title">
              {project.title}
            </h2>
            {project.type && (
              <div className="proj-item-type-tag">
                {project.type}
              </div>
            )}
          </div>

          {/* Description Excerpt if present */}
          {project.description && (
            <p className="proj-item-desc t-body">
              {project.description}
            </p>
          )}

          {/* Engineering Specifications Grid */}
          <dl className="proj-item-specs-grid">
            {project.client && (
              <div className="proj-spec-cell">
                <dt className="proj-spec-dt">CLIENT</dt>
                <dd className="proj-spec-dd">{project.client}</dd>
              </div>
            )}

            {project.floors && (
              <div className="proj-spec-cell">
                <dt className="proj-spec-dt">FLOORS / LEVELS</dt>
                <dd className="proj-spec-dd">{project.floors}</dd>
              </div>
            )}

            {project.builtUpArea && (
              <div className="proj-spec-cell">
                <dt className="proj-spec-dt">BUILT-UP AREA</dt>
                <dd className="proj-spec-dd">{project.builtUpArea}</dd>
              </div>
            )}

            {project.location && (
              <div className="proj-spec-cell">
                <dt className="proj-spec-dt">LOCATION</dt>
                <dd className="proj-spec-dd">{project.location}</dd>
              </div>
            )}
          </dl>

          {/* Facilities / Technical Highlights Chips */}
          {((project.facilities && project.facilities.length > 0) || (project.technicalHighlights && project.technicalHighlights.length > 0)) && (
            <div className="proj-item-facilities-wrap">
              <span className="proj-fac-label">KEY FEATURES:</span>
              <div className="proj-item-pills">
                {project.technicalHighlights?.map((t) => (
                  <span key={t} className="proj-pill proj-pill--tech">{t}</span>
                ))}
                {project.facilities?.slice(0, 3).map((f) => (
                  <span key={f} className="proj-pill">{f}</span>
                ))}
                {project.facilities && project.facilities.length > 3 && (
                  <span className="proj-pill proj-pill--more">+{project.facilities.length - 3} more</span>
                )}
              </div>
            </div>
          )}

          {/* Bottom Action Row */}
          <div className="proj-item-action-row">
            <button
              type="button"
              className="btn btn-outline proj-item-open-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelectProject(project);
              }}
            >
              <span>INSPECT FULL SPECIFICATION</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Structural Datum Axis Line */}
      <div className="proj-item-datum-line" aria-hidden="true">
        <span className="proj-datum-mark proj-datum-mark--start">⌖ GRID-AXIS {project.number}</span>
        <span className="proj-datum-bar" />
        <span className="proj-datum-mark proj-datum-mark--end">STRUCTURAL RECORD ⌖</span>
      </div>
    </article>
  );
}
