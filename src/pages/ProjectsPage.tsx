import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { allProjects, PROJECT_CATEGORIES } from "../data/projects";
import ProjectsHero from "../components/projects/ProjectsHero";
import ProjectCinematicChapter from "../components/projects/ProjectCinematicChapter";
import ProjectChapterProgress from "../components/projects/ProjectChapterProgress";
import "./ProjectsPage.css";

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeProjectId, setActiveProjectId] = useState<string>(allProjects[0]?.id || "");
  const containerRef = useRef<HTMLElement>(null);

  // Set page title for SEO
  useEffect(() => {
    document.title = "Cinematic Projects Journey & Structural Portfolio | Designtech Engineering";
  }, []);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: allProjects.length };
    PROJECT_CATEGORIES.forEach((cat) => {
      if (cat !== "ALL") {
        counts[cat] = allProjects.filter(
          (p) => p.category.toLowerCase() === cat.toLowerCase()
        ).length;
      }
    });
    return counts;
  }, []);

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "ALL") return allProjects;
    return allProjects.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [selectedCategory]);

  // Set default active project when filtered list changes
  useEffect(() => {
    if (filteredProjects.length > 0) {
      setActiveProjectId(filteredProjects[0].id);
    }
  }, [filteredProjects]);

  // IntersectionObserver scroll-spy to update the active project chapter
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("project-", "");
            setActiveProjectId(id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -40% 0px",
        threshold: 0.15,
      }
    );

    filteredProjects.forEach((p) => {
      const el = document.getElementById(`project-${p.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredProjects]);

  // Smooth scroll jump to project chapter
  const handleScrollToProject = (id: string) => {
    setActiveProjectId(id);
    const el = document.getElementById(`project-${id}`);
    if (el) {
      const yOffset = -80; // offset for navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <main id="main-content" className="projects-page" ref={containerRef}>
      {/* 01 — Cinematic Hero Header */}
      <ProjectsHero
        totalProjects={allProjects.length}
        totalCategories={PROJECT_CATEGORIES.length - 1}
      />

      {/* 02 — Category Filter Bar */}
      <section className="proj-filter-bar-section" aria-label="Project classifications filter">
        <div className="container proj-filter-container">
          <div className="proj-filter-label-group">
            <span className="proj-filter-tag">SECTOR FILTER</span>
            <span className="proj-filter-sub">SELECT CLASSIFICATION</span>
          </div>

          <div className="proj-filter-pills" role="tablist">
            {PROJECT_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`proj-filter-pill ${isActive ? "proj-filter-pill--active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span className="proj-filter-pill-text">{cat}</span>
                  <span className="proj-filter-pill-count">
                    {categoryCounts[cat] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 03 — Chapter Progress Navigator (Desktop vertical track + Mobile bar) */}
      <ProjectChapterProgress
        projects={filteredProjects}
        activeProjectId={activeProjectId}
        onSelectProject={handleScrollToProject}
      />

      {/* 04 — Cinematic Project Chapters Sequence */}
      <div className="proj-chapters-stream" role="feed" aria-busy="false">
        {filteredProjects.map((project, idx) => (
          <ProjectCinematicChapter
            key={project.id}
            project={project}
            index={idx}
          />
        ))}

        {filteredProjects.length === 0 && (
          <div className="proj-empty-card container">
            <p className="t-body">
              No engineering projects found for classification &ldquo;{selectedCategory}&rdquo;.
            </p>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setSelectedCategory("ALL")}
            >
              SHOW ALL 16 PROJECTS
            </button>
          </div>
        )}
      </div>

      {/* 05 — Architectural Consultation Action Banner */}
      <section className="proj-bottom-cta-section">
        <div className="container">
          <div className="proj-bottom-cta-card">
            <div className="proj-bottom-cta-text">
              <div className="section-number">STRUCTURAL CONSULTATION</div>
              <h2 className="t-display-md proj-bottom-cta-title">
                HAVE A CIVIL OR STRUCTURAL PROJECT IN MIND?
              </h2>
              <div className="section-divider" />
              <p className="t-body proj-bottom-cta-desc">
                Engage Designtech Engineering for concept-to-execution structural analysis, peer reviews, foundation design, and PEB engineering.
              </p>
            </div>

            <div className="proj-bottom-cta-buttons">
              <Link to="/contact" className="btn btn-primary proj-bcta-btn">
                <span>START A PROJECT</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link to="/about" className="btn btn-outline proj-bcta-btn">
                <span>OUR EXPERTISE</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
