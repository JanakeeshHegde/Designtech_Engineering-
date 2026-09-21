import { useState } from "react";
import type { Project } from "../../../types/project";
import BeforeAfter from "../../common/BeforeAfter";
import "./ProjectChapter.css";

interface Props {
  project: Project;
  index: number;
}

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="pc-img-fallback img-fallback" aria-label={alt}>
        <div className="pc-img-fallback-inner">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <rect x="4" y="8" width="40" height="32" stroke="#A87524" strokeWidth="1" strokeOpacity="0.4" fill="none" />
            <line x1="4" y1="8" x2="44" y2="40" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.3" />
            <line x1="44" y1="8" x2="4" y2="40" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.3" />
          </svg>
          <span className="t-label" style={{ marginTop: "0.5rem" }}>IMAGE PENDING</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}

export default function ProjectChapter({ project, index }: Props) {
  const isEven = index % 2 === 0;

  return (
    <article
      id={`project-${project.id}`}
      className={`project-chapter ${isEven ? "pc--even" : "pc--odd"}`}
      aria-labelledby={`pc-title-${project.id}`}
    >
      <div
        className="pc-bg-accent"
        style={{ background: project.accentColor ? `${project.accentColor}08` : "transparent" }}
        aria-hidden="true"
      />

      <div className="container">
        <div className="pc-inner">
          {/* Text content */}
          <div className="pc-content">
            <div className="pc-meta-row">
              <div className="project-ref">{project.category}</div>
              <div className="pc-project-number">{project.number}</div>
            </div>

            <h3
              id={`pc-title-${project.id}`}
              className="pc-title t-display-md"
            >
              {project.title}
            </h3>

            <dl className="pc-specs">
              {project.location && (
                <div className="pc-spec-item">
                  <dt>Location</dt>
                  <dd>{project.location}</dd>
                </div>
              )}
              {project.type && (
                <div className="pc-spec-item">
                  <dt>Type</dt>
                  <dd>{project.type}</dd>
                </div>
              )}
              {project.floors && (
                <div className="pc-spec-item">
                  <dt>Levels</dt>
                  <dd>{project.floors}</dd>
                </div>
              )}
              {project.builtUpArea && (
                <div className="pc-spec-item">
                  <dt>Built-up Area</dt>
                  <dd>{project.builtUpArea}</dd>
                </div>
              )}
              {project.client && (
                <div className="pc-spec-item">
                  <dt>Client</dt>
                  <dd>{project.client}</dd>
                </div>
              )}
            </dl>

            {project.description && (
              <p className="pc-desc t-body">{project.description}</p>
            )}

            {project.facilities && project.facilities.length > 0 && (
              <div className="pc-facilities">
                <div className="t-label" style={{ marginBottom: "0.5rem" }}>FACILITIES</div>
                <ul className="pc-facilities-list" role="list">
                  {project.facilities.map((f) => (
                    <li key={f} className="pc-facility-item" role="listitem">{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {project.technicalHighlights && project.technicalHighlights.length > 0 && (
              <div className="pc-tech">
                <div className="t-label" style={{ marginBottom: "0.5rem" }}>TECHNICAL</div>
                <div className="pc-tech-tags">
                  {project.technicalHighlights.map((t) => (
                    <span key={t} className="pc-tech-tag">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Image content */}
          <div className="pc-images">
            {project.hasBeforeAfter && project.beforeImage && project.afterImage ? (
              <div className="pc-before-after">
                <BeforeAfter
                  beforeSrc={project.beforeImage}
                  afterSrc={project.afterImage}
                />
              </div>
            ) : (
              <div className="pc-hero-img">
                <ProjectImage src={project.heroImage} alt={project.title} />
              </div>
            )}

            {project.gallery && project.gallery.length > 0 && (
              <div className="pc-gallery">
                {project.gallery.slice(0, 3).map((img, i) => (
                  <div key={i} className="pc-thumb">
                    <ProjectImage src={img} alt={`${project.title} – view ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pc-separator" aria-hidden="true">
        <div className="pc-sep-line" />
        <div className="pc-sep-label t-label">{project.number}</div>
      </div>
    </article>
  );
}
