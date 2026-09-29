import { PROJECT_CATEGORIES } from "../../data/projects";
import "./ProjectFilter.css";

export type ViewMode = "archive" | "grid" | "3d";

interface Props {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFiltered: number;
}

export default function ProjectFilter({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  viewMode,
  onViewModeChange,
  totalFiltered,
}: Props) {
  return (
    <nav className="proj-filter-bar" aria-label="Project portfolio filter and view selection">
      <div className="container proj-filter-container">
        {/* Category Pills */}
        <div className="proj-filter-categories" role="tablist" aria-label="Filter projects by category">
          {PROJECT_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isSelected}
                className={`proj-filter-tab ${isSelected ? "proj-filter-tab--active" : ""}`}
                onClick={() => onSelectCategory(cat)}
              >
                <span className="proj-filter-tab-label">{cat}</span>
                <span className="proj-filter-tab-count">[{count}]</span>
                {isSelected && <span className="proj-filter-tab-indicator" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher */}
        <div className="proj-filter-actions">
          <div className="proj-filter-count-badge">
            <span className="proj-filter-count-num">{totalFiltered}</span>
            <span className="proj-filter-count-txt">PROJECTS DISPLAYED</span>
          </div>

          <div className="proj-view-switcher" role="group" aria-label="Layout view mode">
            <button
              type="button"
              className={`proj-view-btn ${viewMode === "archive" ? "proj-view-btn--active" : ""}`}
              onClick={() => onViewModeChange("archive")}
              title="Archive Spec Layout"
              aria-label="Archive Specification Layout"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="1" y="2" width="14" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
                <rect x="1" y="6.5" width="14" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
                <rect x="1" y="11" width="14" height="3.5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span>ARCHIVE</span>
            </button>

            <button
              type="button"
              className={`proj-view-btn ${viewMode === "grid" ? "proj-view-btn--active" : ""}`}
              onClick={() => onViewModeChange("grid")}
              title="Technical Blueprint Grid"
              aria-label="Technical Blueprint Grid"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
                <rect x="9" y="1" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
                <rect x="1" y="9" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
                <rect x="9" y="9" width="6" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span>BLUEPRINT</span>
            </button>

            <button
              type="button"
              className={`proj-view-btn ${viewMode === "3d" ? "proj-view-btn--active" : ""}`}
              onClick={() => onViewModeChange("3d")}
              title="3D Structural Inspector"
              aria-label="3D Structural Inspector"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1l6 3.5v7L8 15l-6-3.5v-7L8 1z" stroke="currentColor" strokeWidth="1.2" />
                <path d="M8 1v14M2 4.5l6 3.5 6-3.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span>3D BIM</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
