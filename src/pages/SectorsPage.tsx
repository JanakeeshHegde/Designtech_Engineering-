import { useEffect } from "react";
import { Link } from "react-router-dom";
import Sectors from "../components/sections/sectors/Sectors";
import "./SectorsPage.css";

export default function SectorsPage() {
  useEffect(() => {
    document.title = "Designtech Engineering | Sectors & Fields of Operation";
  }, []);

  return (
    <main id="main-content">
      {/* Page intro strip */}
      <div className="sectors-page-intro">
        <div className="container sectors-page-intro-inner">
          <div className="section-number">FIELDS OF OPERATION</div>
          <div className="sectors-page-breadcrumb">
            <Link to="/" className="sectors-page-breadcrumb-link">HOME</Link>
            <span className="sectors-page-breadcrumb-sep" aria-hidden="true">/</span>
            <span>SECTORS</span>
          </div>
        </div>
      </div>

      {/* Existing Sectors component — completely unchanged */}
      <div
        id="residential-commercial"
        data-sector="residential"
      >
        <Sectors />
      </div>

      {/* Bottom CTA */}
      <div className="sectors-page-cta">
        <div className="container sectors-page-cta-inner">
          <div className="section-divider" style={{ marginBottom: "2rem" }} />
          <p className="t-body" style={{ marginBottom: "1.5rem", maxWidth: "480px" }}>
            Working across all these sectors with the same commitment to engineering excellence.
          </p>
          <div className="sectors-page-cta-row">
            <Link to="/about#engineering-journey" className="btn btn-outline">
              VIEW PROJECTS
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/contact" className="btn btn-primary">
              DISCUSS YOUR PROJECT
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
