import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { allProjects, PROJECT_CATEGORIES } from "../data/projects";
import ProjectsHero from "../components/projects/ProjectsHero";
import ProjectStickyIndex from "../components/projects/ProjectStickyIndex";
import ProjectEditorialCaseStudy from "../components/projects/ProjectEditorialCaseStudy";
import "./ProjectsPage.css";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeProjectId, setActiveProjectId] = useState<string>(allProjects[0]?.id || "");
  const containerRef = useRef<HTMLElement>(null);

  // Set page title for SEO
  useEffect(() => {
    document.title = "Projects Archive & Structural Portfolio | Designtech Engineering";
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

  // Scroll-spy with IntersectionObserver to highlight active project in sticky index
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("project-", "");
            setActiveProjectId(id);

            // Auto-scroll the horizontal rail item into view smoothly
            const railBtn = document.getElementById(`idx-btn-${id}`);
            if (railBtn) {
              railBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.1,
      }
    );

    filteredProjects.forEach((p) => {
      const el = document.getElementById(`project-${p.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredProjects]);

  // Smooth scroll jump to project from sticky index
  const handleScrollToProject = (id: string) => {
    setActiveProjectId(id);
    const el = document.getElementById(`project-${id}`);
    if (el) {
      const yOffset = -140; // accommodate sticky nav + sticky index bar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // GSAP animation for initial load and category filtering
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".proj-case-study",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".proj-editorial-container",
            start: "top 85%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [selectedCategory]);

  return (
    <main id="main-content" className="projects-page" ref={containerRef}>
      {/* 01 — Hero Header */}
      <ProjectsHero
        totalProjects={allProjects.length}
        totalCategories={PROJECT_CATEGORIES.length - 1}
      />

      {/* 02 — Sticky Category & Project Index Bar */}
      <ProjectStickyIndex
        projects={filteredProjects}
        activeProjectId={activeProjectId}
        onSelectProject={handleScrollToProject}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={PROJECT_CATEGORIES}
        categoryCounts={categoryCounts}
      />

      {/* 03 — Editorial Engineering Case Studies Collection */}
      <section className="proj-editorial-section container" aria-label="Civil and structural engineering project portfolio">
        <div className="proj-editorial-meta-bar">
          <div className="proj-meta-tag-group">
            <span className="section-number">ENGINEERING ARCHIVE</span>
            <span className="proj-meta-active-count">
              DISPLAYING {filteredProjects.length} OF {allProjects.length} DOCUMENTED STRUCTURES
            </span>
          </div>

          <span className="proj-meta-instruction">
            SCROLL TO EXPLORE OR JUMP VIA STICKY PROJECT INDEX
          </span>
        </div>

        <div className="proj-editorial-container" role="list">
          {filteredProjects.map((project, idx) => (
            <ProjectEditorialCaseStudy
              key={project.id}
              project={project}
              index={idx}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="proj-empty-card">
            <p className="t-body">No engineering projects found for classification &ldquo;{selectedCategory}&rdquo;.</p>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setSelectedCategory("ALL")}
            >
              SHOW ALL 16 PROJECTS
            </button>
          </div>
        )}
      </section>

      {/* 04 — Engineering Consultation Bottom Action Card */}
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
