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
        rootMargin: "-15% 0px -60% 0px",
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

  // GSAP animation per card for smooth progressive loading
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".proj-case-study");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.3, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          }
        );
      });
    }, containerRef);

    // Refresh scroll triggers after layout stabilizes
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [selectedCategory]);

  return (
    <main id="main-content" className="projects-page" ref={containerRef}>
      {/* Page intro strip */}
      <div className="projects-page-intro">
        <div className="container projects-page-intro-inner">
          <div className="section-number">PROJECT PORTFOLIO</div>
          <div className="projects-page-breadcrumb">
            <Link to="/" className="projects-page-breadcrumb-link">HOME</Link>
            <span className="projects-page-breadcrumb-sep" aria-hidden="true">/</span>
            <span>PROJECTS</span>
          </div>
        </div>
      </div>

      {/* 01 — Hero Header */}
      <ProjectsHero />

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

      {/* 04 — Bottom Architectural Project CTA Card */}
      <div className="projects-page-cta">
        <div className="container">
          <div className="proj-bottom-cta-card">
            <div className="proj-bottom-cta-text">
              <span className="t-label">STRUCTURAL ENGINEERING CONSULTANCY</span>
              <h3 className="t-display-sm proj-bottom-cta-title">
                Have a project you would like to engineer with us?
              </h3>
              <p className="t-body proj-bottom-cta-desc">
                From concept feasibility to structural design, drawing production, and site supervision, our team delivers safe, economical, and enduring engineering solutions.
              </p>
            </div>
            <div className="proj-bottom-cta-buttons">
              <Link to="/contact" className="btn btn-primary">
                <span>START A PROJECT</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/sectors" className="btn btn-outline">
                <span>EXPLORE SECTORS</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
