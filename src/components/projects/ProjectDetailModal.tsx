import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Project } from "../../data/projects";
import { getProjectAllImages } from "../../utils/projectImages";
import BeforeAfter from "../common/BeforeAfter";
import StructuralInspector3D from "../3d/StructuralInspector3D";
import ProjectTechnicalOverlay from "./ProjectTechnicalOverlay";
import "./ProjectDetailModal.css";

interface Props {
  project: Project;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex?: number;
  totalCount?: number;
}

export default function ProjectDetailModal({
  project,
  onClose,
  onNext,
  onPrev,
  currentIndex,
  totalCount,
}: Props) {
  // Collect all available media items for this project (explicit + auto-discovered)
  const allImages = getProjectAllImages(project);

  const [activeImage, setActiveImage] = useState<string>(allImages[0] || "");
  const [activeTab, setActiveTab] = useState<"media" | "beforeAfter" | "3d">(
    project.hasBeforeAfter ? "beforeAfter" : "media"
  );
  const [imgError, setImgError] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const availableImages = allImages.filter((image) => !failedImages.has(image));

  // Sync active image when project changes
  useEffect(() => {
    setActiveImage(allImages[0] || "");
    setActiveTab(project.hasBeforeAfter ? "beforeAfter" : "media");
    setImgError(false);
    setFailedImages(new Set());
  }, [project, allImages.length]);

  // Keyboard accessibility: ESC to close, Arrow keys to navigate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && onNext) {
        onNext();
      } else if (e.key === "ArrowLeft" && onPrev) {
        onPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Prevent background scroll while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      className="pdm-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdm-title"
    >
      <div
        className="pdm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top CAD Bar */}
        <div className="pdm-header-bar">
          <div className="pdm-dwg-meta">
            <span className="pdm-dwg-status">● DRAWING ARCHIVE ACTIVE</span>
            <span className="pdm-dwg-ref">{project.category.toUpperCase()} // PROJECT {project.number}</span>
            {currentIndex !== undefined && totalCount !== undefined && (
              <span className="pdm-dwg-index">RECORD {currentIndex + 1} OF {totalCount}</span>
            )}
          </div>

          <div className="pdm-nav-controls">
            {onPrev && (
              <button
                type="button"
                className="pdm-nav-btn"
                onClick={onPrev}
                aria-label="Previous project"
                title="Previous Project (Left Arrow)"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>PREV</span>
              </button>
            )}

            {onNext && (
              <button
                type="button"
                className="pdm-nav-btn"
                onClick={onNext}
                aria-label="Next project"
                title="Next Project (Right Arrow)"
              >
                <span>NEXT</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            <button
              type="button"
              className="pdm-close-btn"
              onClick={onClose}
              aria-label="Close project specifications"
            >
              <span>ESC</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Main Content Body */}
        <div className="pdm-body">
          {/* Top Title Block */}
          <div className="pdm-title-block">
            <div className="pdm-category-row">
              <span className="pdm-category-badge">{project.category}</span>
              <span className="pdm-number-badge">PROJECT #{project.number}</span>
              {project.type && <span className="pdm-type-badge">{project.type}</span>}
            </div>

            <h2 id="pdm-title" className="t-display-md pdm-title">
              {project.title}
            </h2>

            {project.location && (
              <div className="pdm-location">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2a4.5 4.5 0 0 0-4.5 4.5c0 3.2 4.5 7.5 4.5 7.5s4.5-4.3 4.5-7.5A4.5 4.5 0 0 0 8 2z" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="8" cy="6.5" r="1.5" fill="currentColor" />
                </svg>
                <span>{project.location}</span>
              </div>
            )}
          </div>

          <div className="pdm-layout-grid">
            {/* ── LEFT COLUMN: VISUAL / MEDIA / 3D ── */}
            <div className="pdm-media-column">
              {/* Media View Mode Switcher */}
              <div className="pdm-media-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "media"}
                  className={`pdm-tab-btn ${activeTab === "media" ? "pdm-tab-btn--active" : ""}`}
                  onClick={() => setActiveTab("media")}
                >
                  ARCHITECTURAL MEDIA ({allImages.length})
                </button>

                {project.hasBeforeAfter && project.beforeImage && project.afterImage && (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "beforeAfter"}
                    className={`pdm-tab-btn pdm-tab-btn--highlight ${activeTab === "beforeAfter" ? "pdm-tab-btn--active" : ""}`}
                    onClick={() => setActiveTab("beforeAfter")}
                  >
                    BEFORE &amp; AFTER SLIDER
                  </button>
                )}

                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "3d"}
                  className={`pdm-tab-btn ${activeTab === "3d" ? "pdm-tab-btn--active" : ""}`}
                  onClick={() => setActiveTab("3d")}
                >
                  3D STRUCTURAL FRAME
                </button>
              </div>

              {/* Viewport Area */}
              <div className="pdm-viewport">
                {activeTab === "media" && (
                  <div className="pdm-image-stage">
                    <ProjectTechnicalOverlay projectNumber={project.number} category={project.category} />
                    {imgError ? (
                      <div className="pdm-img-fallback img-fallback">
                        <svg width="56" height="56" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                          <rect x="4" y="8" width="40" height="32" stroke="#A87524" strokeWidth="1" strokeOpacity="0.4" fill="none" />
                          <line x1="4" y1="8" x2="44" y2="40" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.3" />
                          <line x1="44" y1="8" x2="4" y2="40" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.3" />
                        </svg>
                        <span className="t-label" style={{ marginTop: "0.5rem" }}>DRAWING / PHOTO ARCHIVED</span>
                      </div>
                    ) : (
                      <img
                        src={activeImage}
                        alt={`${project.title} detailed visual`}
                        className="pdm-main-img"
                        onError={() => setImgError(true)}
                      />
                    )}
                  </div>
                )}

                {activeTab === "beforeAfter" && project.beforeImage && project.afterImage && (
                  <div className="pdm-before-after-wrap">
                    <BeforeAfter
                      beforeSrc={project.beforeImage}
                      afterSrc={project.afterImage}
                      beforeLabel="CONSTRUCTION STAGE"
                      afterLabel="COMPLETED STRUCTURE"
                    />
                  </div>
                )}

                {activeTab === "3d" && (
                  <div className="pdm-3d-wrap">
                    <div className="pdm-3d-hint">
                      <span>● INTERACTIVE 3D STRUCTURAL INSPECTOR — DRAG TO ROTATE</span>
                    </div>
                    <StructuralInspector3D activeLayer="complete" className="pdm-3d-canvas" />
                  </div>
                )}
              </div>

              {/* Multi-Image Thumbnail Gallery */}
              {availableImages.length > 1 && (
                <div className="pdm-gallery-strip">
                  <span className="pdm-gallery-label">PROJECT DRAWINGS &amp; PHOTOGRAPHS:</span>
                  <div className="pdm-thumbnails">
                    {availableImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`pdm-thumb-btn ${activeImage === img && activeTab === "media" ? "pdm-thumb-btn--active" : ""}`}
                        onClick={() => {
                          setActiveImage(img);
                          setActiveTab("media");
                          setImgError(false);
                        }}
                      >
                        <img
                          src={img}
                          alt={`${project.title} view ${i + 1}`}
                          onError={() => {
                            setFailedImages((previous) => new Set(previous).add(img));
                          }}
                        />
                        <span className="pdm-thumb-num">{i + 1}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN: ENGINEERING SPECIFICATIONS ── */}
            <div className="pdm-specs-column">
              <div className="pdm-specs-sheet">
                <div className="pdm-sheet-header">
                  <span className="pdm-sheet-title">STRUCTURAL SPECIFICATION SHEET</span>
                </div>

                {/* Description */}
                {project.description && (
                  <div className="pdm-desc-block">
                    <p className="pdm-desc-text t-body">{project.description}</p>
                  </div>
                )}

                {/* Detailed Parameters DL Table */}
                <dl className="pdm-params-table">
                  {project.client && (
                    <div className="pdm-param-row">
                      <dt className="pdm-param-k">CLIENT</dt>
                      <dd className="pdm-param-v">{project.client}</dd>
                    </div>
                  )}

                  {project.type && (
                    <div className="pdm-param-row">
                      <dt className="pdm-param-k">SCOPE / PROJECT</dt>
                      <dd className="pdm-param-v">{project.type}</dd>
                    </div>
                  )}

                  {project.floors && (
                    <div className="pdm-param-row">
                      <dt className="pdm-param-k">FLOORS / LEVELS</dt>
                      <dd className="pdm-param-v">{project.floors}</dd>
                    </div>
                  )}

                  {project.builtUpArea && (
                    <div className="pdm-param-row">
                      <dt className="pdm-param-k">BUILT-UP AREA</dt>
                      <dd className="pdm-param-v">{project.builtUpArea}</dd>
                    </div>
                  )}

                  {project.location && (
                    <div className="pdm-param-row">
                      <dt className="pdm-param-k">LOCATION</dt>
                      <dd className="pdm-param-v">{project.location}</dd>
                    </div>
                  )}

                  <div className="pdm-param-row">
                    <dt className="pdm-param-k">SECTOR CLASSIFICATION</dt>
                    <dd className="pdm-param-v">{project.category}</dd>
                  </div>
                </dl>

                {/* Facilities List */}
                {project.facilities && project.facilities.length > 0 && (
                  <div className="pdm-section-block">
                    <div className="pdm-sec-title">FACILITIES &amp; PROVISIONS</div>
                    <ul className="pdm-facilities-list" role="list">
                      {project.facilities.map((fac, idx) => (
                        <li key={idx} className="pdm-facility-item" role="listitem">
                          <span className="pdm-fac-dot" aria-hidden="true" />
                          <span>{fac}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technical Highlights */}
                {project.technicalHighlights && project.technicalHighlights.length > 0 && (
                  <div className="pdm-section-block">
                    <div className="pdm-sec-title">TECHNICAL HIGHLIGHTS</div>
                    <div className="pdm-tech-chips">
                      {project.technicalHighlights.map((tech, idx) => (
                        <span key={idx} className="pdm-tech-chip">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action / Consultation Button */}
                <div className="pdm-cta-block">
                  <Link
                    to="/contact"
                    className="btn btn-primary pdm-inquire-btn"
                    onClick={onClose}
                  >
                    <span>INQUIRE ABOUT THIS PROJECT SCOPE</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
