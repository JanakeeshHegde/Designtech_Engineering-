import { Link } from "react-router-dom";
import "./ProjectsHero.css";

interface Props {
  totalProjects?: number;
  totalCategories?: number;
}

export default function ProjectsHero({}: Props = {}) {
  return (
    <section className="proj-hero" aria-labelledby="proj-hero-heading">
      {/* Blueprint Drafting Coordinate Lines */}
      <div className="proj-hero-drafting-lines" aria-hidden="true">
        <div className="proj-hero-grid-pattern" />
        <div className="proj-hero-cad-crosshair proj-hero-cad-crosshair--tl">+</div>
        <div className="proj-hero-cad-crosshair proj-hero-cad-crosshair--tr">+</div>
        <div className="proj-hero-cad-crosshair proj-hero-cad-crosshair--bl">+</div>
        <div className="proj-hero-cad-crosshair proj-hero-cad-crosshair--br">+</div>
        <div className="proj-hero-coord proj-hero-coord--top">LAT 12.9716° N / LON 77.5946° E — BANGALORE HQ</div>
        <div className="proj-hero-coord proj-hero-coord--bottom">CAD SPEC: ISO-128 / IS 456:2000 / IS 800:2007</div>
      </div>

      <div className="container proj-hero-inner">
        {/* Breadcrumb Navigation */}
        <div className="proj-hero-breadcrumb">
          <Link to="/" className="proj-hero-breadcrumb-link">HOME</Link>
          <span className="proj-hero-breadcrumb-sep" aria-hidden="true">/</span>
          <span className="proj-hero-breadcrumb-curr">PROJECTS</span>
        </div>

        <div className="proj-hero-header section-header">
          <div className="section-number">PROJECT PORTFOLIO</div>
          <h1 id="proj-hero-heading" className="t-display-lg proj-hero-title">
            ENGINEERING <span className="proj-hero-title-highlight">PROJECTS</span>
          </h1>
          <div className="section-divider" />
          <p className="t-body proj-hero-description">
            Explore our completed engineering work across residential, commercial, institutional, industrial, and solar sectors. Browse project details, technical scope, and delivery highlights.
          </p>
        </div>
      </div>
    </section>
  );
}
