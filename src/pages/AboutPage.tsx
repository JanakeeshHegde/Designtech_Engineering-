import { useEffect } from "react";
import { Link } from "react-router-dom";
import About from "../components/sections/about/About";
import EngineeringProcess from "../components/sections/about/EngineeringProcess";
import ClientEcosystem from "../components/sections/about/ClientEcosystem";
import "./AboutPage.css";

export default function AboutPage() {
  useEffect(() => {
    document.title = "About Designtech Engineering | Civil & Structural Consultancy";
  }, []);

  return (
    <main id="main-content">
      {/* Page intro strip */}
      <div className="about-page-intro" aria-hidden="true">
        <div className="container about-page-intro-inner">
          <div className="section-number">ABOUT DESIGNTECH</div>
          <div className="about-page-breadcrumb">
            <Link to="/" className="about-page-breadcrumb-link">HOME</Link>
            <span className="about-page-breadcrumb-sep" aria-hidden="true">/</span>
            <span>ABOUT</span>
          </div>
        </div>
      </div>

      {/* 01 — Company Profile */}
      <div id="about-intro">
        <About />
      </div>

      {/* 02 — Process / From Soil to Skyline */}
      <div id="engineering-process">
        <EngineeringProcess />
      </div>

      {/* 03 — Client Ecosystem */}
      <div id="clients">
        <ClientEcosystem />
      </div>

      {/* Bottom CTA strip */}
      <div className="about-page-footer-cta">
        <div className="container about-page-cta-inner">
          <div className="section-divider" />
          <div className="about-page-cta-row">
            <Link to="/sectors" className="btn btn-outline">
              <span>VIEW SECTORS</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link to="/contact" className="btn btn-primary">
              <span>START A PROJECT</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
