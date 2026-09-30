import { useState } from "react";
import type { Project } from "../../data/projects";
import ProjectTechnicalOverlay from "./ProjectTechnicalOverlay";
import "./ProjectBlueprintGrid.css";

interface Props {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export default function ProjectBlueprintGrid({ projects, onSelectProject }: Props) {
  return (
    <div className="proj-bp-grid" role="list">
      {projects.map((project) => (
        <BlueprintCard key={project.id} project={project} onSelect={() => onSelectProject(project)} />
      ))}
    </div>
  );
}

function BlueprintCard({ project, onSelect }: { project: Project; onSelect: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className="proj-bp-card"
      onClick={onSelect}
      role="listitem"
      tabIndex={0}
      aria-label={`${project.title}, ${project.category} ${project.number}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      {/* Blueprint Header Strip */}
      <div className="proj-bp-top">
        <span className="proj-bp-cat">{project.category}</span>
        <span className="proj-bp-num">{project.number}</span>
      </div>

      {/* Visual Frame */}
      <div className="proj-bp-media">
        <ProjectTechnicalOverlay projectNumber={project.number} />
        {imgError ? (
          <div className="proj-bp-fallback img-fallback">
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <rect x="4" y="8" width="40" height="32" stroke="#A87524" strokeWidth="1" strokeOpacity="0.4" fill="none" />
              <line x1="4" y1="8" x2="44" y2="40" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.3" />
              <line x1="44" y1="8" x2="4" y2="40" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.3" />
            </svg>
            <span className="proj-bp-fallback-label">PROJECT #{project.number}</span>
          </div>
        ) : (
          <img
            src={project.heroImage}
            alt={project.title}
            loading="lazy"
            className="proj-bp-img"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Content */}
      <div className="proj-bp-content">
        <h3 className="proj-bp-title">{project.title}</h3>
        {project.type && <div className="proj-bp-type">{project.type}</div>}

        <div className="proj-bp-meta-row">
          {project.location && (
            <div className="proj-bp-meta-item">
              <span className="proj-bp-meta-k">LOC</span>
              <span className="proj-bp-meta-v">{project.location}</span>
            </div>
          )}
          {project.builtUpArea && (
            <div className="proj-bp-meta-item">
              <span className="proj-bp-meta-k">AREA</span>
              <span className="proj-bp-meta-v">{project.builtUpArea}</span>
            </div>
          )}
          {project.floors && (
            <div className="proj-bp-meta-item">
              <span className="proj-bp-meta-k">LEVELS</span>
              <span className="proj-bp-meta-v">{project.floors}</span>
            </div>
          )}
        </div>

        <button type="button" className="proj-bp-cta">
          <span>INSPECT SPEC</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>
    </article>
  );
}
