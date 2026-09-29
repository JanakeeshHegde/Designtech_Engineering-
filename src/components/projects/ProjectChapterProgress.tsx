import { useEffect, useState } from "react";
import type { Project } from "../../data/projects";
import "./ProjectChapterProgress.css";

interface Props {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
}

export default function ProjectChapterProgress({
  projects,
  activeProjectId,
  onSelectProject,
}: Props) {
  const activeIndex = Math.max(
    0,
    projects.findIndex((p) => p.id === activeProjectId)
  );
  const activeProject = projects[activeIndex] || projects[0];

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (projects.length === 0) return null;

  return (
    <>
      {/* ── DESKTOP VERTICAL CHAPTER NAVIGATOR ── */}
      <nav
        className={`proj-chapter-rail ${isScrolled ? "proj-chapter-rail--visible" : ""}`}
        aria-label="Cinematic project chapter navigation"
      >
        <div className="proj-chapter-rail-header">
          <span className="proj-chapter-rail-title">CHAPTERS</span>
          <span className="proj-chapter-rail-count">
            {String(activeIndex + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}
          </span>
        </div>

        <div className="proj-chapter-track">
          <div
            className="proj-chapter-progress-fill"
            style={{
              height: `${((activeIndex + 1) / projects.length) * 100}%`,
            }}
          />

          <ul className="proj-chapter-nodes" role="list">
            {projects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              return (
                <li key={proj.id} className="proj-chapter-node-item">
                  <button
                    type="button"
                    className={`proj-chapter-node-btn ${isActive ? "proj-chapter-node-btn--active" : ""}`}
                    onClick={() => onSelectProject(proj.id)}
                    aria-label={`Jump to project ${proj.number}: ${proj.title}`}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <span className="proj-chapter-node-dot" />
                    <span className="proj-chapter-node-num">{proj.number}</span>
                    <span className="proj-chapter-node-tooltip">
                      <span className="proj-chapter-tt-num">DT-{proj.number}</span>
                      <span className="proj-chapter-tt-title">{proj.title}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* ── MOBILE COMPACT CHAPTER STICKY BAR ── */}
      <div className="proj-mobile-chapter-bar" aria-live="polite">
        <div className="proj-mobile-chapter-inner">
          <div className="proj-mobile-chapter-left">
            <span className="proj-mobile-chapter-tag">CHAPTER {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
            <span className="proj-mobile-chapter-name">{activeProject?.title}</span>
          </div>
          <div className="proj-mobile-chapter-controls">
            <button
              type="button"
              className="proj-mobile-nav-arrow"
              disabled={activeIndex === 0}
              onClick={() => onSelectProject(projects[activeIndex - 1]?.id)}
              aria-label="Previous project chapter"
            >
              ←
            </button>
            <button
              type="button"
              className="proj-mobile-nav-arrow"
              disabled={activeIndex === projects.length - 1}
              onClick={() => onSelectProject(projects[activeIndex + 1]?.id)}
              aria-label="Next project chapter"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
