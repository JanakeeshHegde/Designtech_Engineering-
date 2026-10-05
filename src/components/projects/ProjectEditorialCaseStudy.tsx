import { useState, useEffect } from "react";
import type { Project } from "../../data/projects";
import { getProjectAllImages } from "../../utils/projectImages";
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
  const [activeImage, setActiveImage] = useState<string>(allImages[0] || "");
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const availableImages = allImages.filter((image) => !failedImages.has(image));
  const hasValidImage = availableImages.length > 0 && Boolean(activeImage);

  const [viewMode, setViewMode] = useState<"media" | "beforeAfter">(
    project.hasBeforeAfter && project.beforeImage && project.afterImage ? "beforeAfter" : "media"
  );

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const currentIndex = availableImages.indexOf(activeImage);

  const handlePrevImage = () => {
    if (availableImages.length <= 1) return;
    const nextIdx = (currentIndex - 1 + availableImages.length) % availableImages.length;
    setActiveImage(availableImages[nextIdx]);
  };

  const handleNextImage = () => {
    if (availableImages.length <= 1) return;
    const nextIdx = (currentIndex + 1) % availableImages.length;
    setActiveImage(availableImages[nextIdx]);
  };

  useEffect(() => {
    setActiveImage(allImages[0] || "");
    setFailedImages(new Set());
  }, [project.id, allImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };
    if (lightboxOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, currentIndex, availableImages.length]);

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

  const isVideoUrl = (url: string) => /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);

  return (
    <article
      id={`project-${project.id}`}
      className={`proj-case-study ${isEven ? "proj-case-study--even" : "proj-case-study--odd"}`}
      aria-labelledby={`case-title-${project.id}`}
    >
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
                <path d="M6 1.5a3.5 3.5 0 0 0-3.5 3.5c0 2.5 3.5 5.5 3.5 5.5s3.5-3 3.5-5.5a3.5 3.5 0 0 0-3.5-3.5z" stroke="currentColor" strokeWidth="1.2" />
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
          {hasValidImage && project.hasBeforeAfter && project.beforeImage && project.afterImage && (
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

          {/* Large Architectural Frame with Full Image Presentation */}
          <div
            className={`proj-cs-frame ${viewMode === "beforeAfter" ? "proj-cs-ba-frame" : ""}`}
            onClick={() => {
              if (hasValidImage && viewMode === "media" && !isVideoUrl(activeImage)) setLightboxOpen(true);
            }}
            title={hasValidImage && viewMode === "media" && !isVideoUrl(activeImage) ? "Click to view full image in high resolution" : ""}
          >
            {hasValidImage ? (
              viewMode === "beforeAfter" && project.beforeImage && project.afterImage ? (
                <div className="proj-cs-ba-wrap">
                  <BeforeAfter
                    beforeSrc={project.beforeImage}
                    afterSrc={project.afterImage}
                    beforeLabel="CONSTRUCTION STAGE"
                    afterLabel="COMPLETED STRUCTURE"
                  />
                </div>
              ) : isVideoUrl(activeImage) ? (
                <div className="proj-cs-video-wrap">
                  <video
                    key={activeImage}
                    src={activeImage}
                    className="proj-cs-video-player"
                    controls
                    playsInline
                    autoPlay
                    muted
                    loop
                  />
                </div>
              ) : (
                <>
                  <img
                    src={activeImage}
                    alt={`${project.title} architectural view`}
                    loading="lazy"
                    className="proj-cs-img"
                    onError={() => handleImageError(activeImage)}
                  />
                  <div className="proj-cs-expand-hint" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                    <span>Click to expand full image</span>
                  </div>
                </>
              )
            ) : (
              /* Clean neutral architectural empty state when image is not yet uploaded */
              <div className="proj-cs-empty-state" aria-hidden="true">
                <div className="proj-cs-empty-blueprint-grid" />
                <div className="proj-cs-empty-content">
                  <span className="proj-cs-empty-number">{project.number}</span>
                  <span className="proj-cs-empty-title">{project.title}</span>
                  <span className="proj-cs-empty-tag">ARCHITECTURAL SCHEMATIC // RECORD</span>
                </div>
              </div>
            )}
          </div>

          {/* Editorial Thumbnail Gallery (if multiple images exist) */}
          {availableImages.length > 1 && (
            <div className="proj-cs-gallery">
              <span className="proj-cs-gallery-heading">DOCUMENTATION VIEWS &amp; DRAWINGS:</span>
              <div className="proj-cs-thumbs">
                {availableImages.map((img, i) => {
                  const isVid = isVideoUrl(img);
                  return (
                    <div className="proj-cs-thumb-item" key={img}>
                      <button
                        type="button"
                        className={`proj-cs-thumb-btn ${activeImage === img && viewMode === "media" ? "proj-cs-thumb-btn--active" : ""}`}
                        onClick={() => {
                          setActiveImage(img);
                          setViewMode("media");
                        }}
                        aria-label={`View ${isVid ? "video" : "image"} ${i + 1} for ${project.title}`}
                      >
                        {isVid ? (
                          <div className="proj-cs-thumb-video-badge">
                            <video src={img} className="proj-cs-thumb-img" muted preload="metadata" />
                            <div className="proj-cs-play-icon" aria-hidden="true">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={img}
                            alt=""
                            className="proj-cs-thumb-img"
                            onError={() => handleImageError(img)}
                          />
                        )}
                      </button>
                      <span className="proj-cs-thumb-idx">{isVid ? "VIDEO" : `0${i + 1}`}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── ENGINEERING SPECIFICATIONS & INFORMATION ── */}
        <div className="proj-cs-info-col">
          <div className="proj-cs-specs-card">
            <div className="proj-cs-card-header">
              <span className="proj-cs-sheet-title">STRUCTURAL CASE SPECIFICATION</span>
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

      {/* Full Resolution Image Lightbox Modal */}
      {lightboxOpen && hasValidImage && (
        <div
          className="proj-cs-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} full view`}
          onClick={() => setLightboxOpen(false)}
        >
          <div className="proj-cs-lightbox-backdrop" />
          <div className="proj-cs-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="proj-cs-lightbox-header">
              <div className="proj-cs-lightbox-meta">
                <span className="proj-cs-lightbox-num">{project.number}</span>
                <span className="proj-cs-lightbox-title">{project.title}</span>
                {project.location && <span className="proj-cs-lightbox-loc">— {project.location}</span>}
              </div>
              <button
                type="button"
                className="proj-cs-lightbox-close"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close full image view"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="proj-cs-lightbox-img-wrap">
              {availableImages.length > 1 && (
                <button
                  type="button"
                  className="proj-cs-lightbox-nav proj-cs-lightbox-nav--prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  aria-label="Previous image"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
              )}

              {isVideoUrl(activeImage) ? (
                <video
                  key={activeImage}
                  src={activeImage}
                  className="proj-cs-lightbox-img proj-cs-lightbox-video"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  key={activeImage}
                  src={activeImage}
                  alt={`${project.title} full architectural view`}
                  className="proj-cs-lightbox-img"
                />
              )}

              {availableImages.length > 1 && (
                <button
                  type="button"
                  className="proj-cs-lightbox-nav proj-cs-lightbox-nav--next"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  aria-label="Next image"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              )}
            </div>
            {availableImages.length > 1 && (
              <div className="proj-cs-lightbox-thumbs">
                {availableImages.map((img, i) => {
                  const isVid = isVideoUrl(img);
                  return (
                    <button
                      key={img}
                      type="button"
                      className={`proj-cs-lightbox-thumb-btn ${activeImage === img ? "proj-cs-lightbox-thumb-btn--active" : ""}`}
                      onClick={() => setActiveImage(img)}
                      aria-label={`View ${isVid ? "video" : "photo"} ${i + 1}`}
                    >
                      {isVid ? (
                        <span className="proj-cs-lightbox-vid-tag">▶ VID</span>
                      ) : (
                        <img src={img} alt="" className="proj-cs-lightbox-thumb-img" />
                      )}
                      <span>0{i + 1}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
