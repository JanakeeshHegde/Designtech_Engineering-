import { useState } from "react";
import type { Project } from "../../data/projects";
import { getProjectMainImage } from "../../utils/projectImages";
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
  const mainImage = getProjectMainImage(project);

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
      {mainImage && !imgError && <div className="proj-bp-media">
          <img
            src={mainImage}
            alt={project.title}
            loading="lazy"
            className="proj-bp-img"
            onError={() => setImgError(true)}
          />
        </div>}

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
