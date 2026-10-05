import type { Project } from "../../data/projects";
import "./ProjectStickyIndex.css";

interface Props {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: readonly string[];
  categoryCounts: Record<string, number>;
}

export default function ProjectStickyIndex({
  projects,
  activeProjectId,
  onSelectProject,
  selectedCategory,
  onSelectCategory,
  categories,
  categoryCounts,
}: Props) {
  return (
    <div className="proj-sticky-panel">
      {/* Category Filter Pills */}
      <div className="proj-cat-bar" role="tablist" aria-label="Filter projects by category">
        <div className="container proj-cat-container">
          <div className="proj-cat-pills">
            {categories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isSelected}
                  className={`proj-cat-tab ${isSelected ? "proj-cat-tab--active" : ""}`}
                  onClick={() => onSelectCategory(cat)}
                >
                  <span className="proj-cat-label">{cat}</span>
                  <span className="proj-cat-count">[{count}]</span>
                  {isSelected && <span className="proj-cat-indicator" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Project Index Bar (Horizontal Rail on Desktop) */}
      <div className="proj-index-strip">
        <div className="container proj-index-container">
          <div className="proj-index-label-group">
            <span className="proj-index-main-label">PROJECT INDEX</span>
            <span className="proj-index-sub-label">ARCHIVE LOG ({projects.length})</span>
          </div>

          <div className="proj-index-rail" role="navigation" aria-label="Project scroll navigation">
            {projects.map((p) => {
              const isActive = activeProjectId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  id={`idx-btn-${p.id}`}
                  className={`proj-index-item ${isActive ? "proj-index-item--active" : ""}`}
                  onClick={() => onSelectProject(p.id)}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="proj-idx-num">{p.number}</span>
                  <div className="proj-idx-text">
                    <span className="proj-idx-cat">{p.category}</span>
                    <span className="proj-idx-title">{p.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
