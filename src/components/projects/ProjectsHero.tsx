import "./ProjectsHero.css";

export default function ProjectsHero() {
  return (
    <section className="proj-hero" aria-labelledby="proj-hero-heading">
      <div className="container">
        <div className="proj-hero-inner">
          <div className="proj-hero-main">
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
      </div>
    </section>
  );
}
