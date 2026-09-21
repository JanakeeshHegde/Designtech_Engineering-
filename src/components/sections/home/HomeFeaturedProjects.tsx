import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuredProjects } from "../../../data/projects";
import "./HomeFeaturedProjects.css";

gsap.registerPlugin(ScrollTrigger);

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className="hfp-img-fallback img-fallback" aria-label={alt}>
        <svg width="40" height="40" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect x="4" y="8" width="40" height="32" stroke="#A87524" strokeWidth="1" strokeOpacity="0.4" fill="none" />
          <line x1="4" y1="8" x2="44" y2="40" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.3" />
          <line x1="44" y1="8" x2="4" y2="40" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.3" />
        </svg>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setError(true)} />;
}

// 4 Selected projects as requested in the sitemap
const SELECTED_PROJECTS = [
  ...featuredProjects.slice(0, 2), // Hotel Country Inn & St. Joseph's
  featuredProjects.find((p) => p.id === "cmr-pu-college") || {
    id: "cmr-pu-college",
    number: "003",
    title: "CMR - PU College",
    location: "Bangalore",
    category: "Institutional",
    type: "Educational Institution",
    floors: "B + G + 4",
    builtUpArea: "60,000 sq.ft",
    description: "An educational institution with an 18-metre clear span basement basketball court, modern classrooms, and central court.",
    heroImage: "/projects/cmr-pu-college/hero.jpg",
    featured: true,
  },
  {
    id: "commercial-industrial",
    number: "004",
    title: "Commercial & Industrial Projects",
    location: "Bangalore & Peenya",
    category: "Industrial & Commercial",
    type: "PEB / Heavy Structural & Gantry",
    floors: "Expansive Column-Free",
    builtUpArea: "100,000+ sq.ft",
    description: "Heavy structural engineering for manufacturing facilities, automated warehousing, PEB systems, and commercial complexes including Taurus JCB and Sagittarius Metals.",
    heroImage: "/projects/taurus-jcb/hero.jpg",
    featured: true,
  },
];

export default function HomeFeaturedProjects() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hfp-header", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: ".hfp-header", start: "top 88%", once: true },
      });

      SELECTED_PROJECTS.forEach((p) => {
        gsap.fromTo(`.hfp-project-${p.id}`, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.85, ease: "power2.out",
          scrollTrigger: { trigger: `.hfp-project-${p.id}`, start: "top 88%", once: true },
        });
      });
    }, ref);

    const timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={ref} id="featured-journey" className="hfp section" aria-labelledby="hfp-heading">
      <div className="container">
        <div className="hfp-header section-header">
          <div className="section-number">FEATURED ENGINEERING JOURNEY</div>
          <h2 id="hfp-heading" className="t-display-md">
            FROM DRAWINGS<br />TO REAL STRUCTURES.
          </h2>
          <div className="section-divider" />
          <p className="t-body" style={{ maxWidth: "480px" }}>
            A selection from our portfolio. Each project tells the story of
            structural precision, problem-solving, and commitment to delivery.
          </p>
        </div>
      </div>

      {/* Project previews */}
      <div className="hfp-projects">
        {SELECTED_PROJECTS.map((project, index) => {
          const isEven = index % 2 === 0;
          return (
            <article
              key={project.id}
              className={`hfp-project hfp-project-${project.id} ${isEven ? "hfp-project--even" : "hfp-project--odd"}`}
              aria-labelledby={`hfp-title-${project.id}`}
            >
              <div className="container">
                <div className="hfp-project-inner">
                  {/* Content */}
                  <div className="hfp-project-content">
                    <div className="hfp-project-meta">
                      <div className="project-ref">{project.category}</div>
                      <div className="hfp-project-number">{project.number}</div>
                    </div>

                    <h3 id={`hfp-title-${project.id}`} className="hfp-project-title t-display-md">
                      {project.title}
                    </h3>

                    <dl className="hfp-project-specs">
                      {project.location && (
                        <div className="hfp-spec-item">
                          <dt>Location</dt>
                          <dd>{project.location}</dd>
                        </div>
                      )}
                      {project.type && (
                        <div className="hfp-spec-item">
                          <dt>Type</dt>
                          <dd>{project.type}</dd>
                        </div>
                      )}
                      {project.floors && (
                        <div className="hfp-spec-item">
                          <dt>Levels</dt>
                          <dd>{project.floors}</dd>
                        </div>
                      )}
                    </dl>

                    {project.description && (
                      <p className="hfp-project-desc t-body">{project.description}</p>
                    )}
                  </div>

                  {/* Image */}
                  <div className="hfp-project-image">
                    <ProjectImage src={project.heroImage} alt={project.title} />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Journey CTA */}
      <div className="container">
        <div className="hfp-cta-row">
          <div className="hfp-cta-line" aria-hidden="true" />
          <Link to="/about#engineering-journey" className="btn btn-primary hfp-cta">
            EXPLORE ENGINEERING JOURNEY
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
