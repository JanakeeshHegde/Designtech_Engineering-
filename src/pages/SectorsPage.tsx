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

      <Sectors />

      {/* Bottom Architectural Project CTA Card */}
      <div className="sectors-page-cta">
        <div className="container">
          <div className="sectors-cta-card">
            <div className="sectors-cta-text">
              <span className="t-label">CROSS-SECTOR ENGINEERING CONSULTANCY</span>
              <h3 className="t-display-sm sectors-cta-title">
                Ready to engineer your next structural development?
              </h3>
              <p className="t-body sectors-cta-desc">
                Working across all these sectors with the same commitment to engineering excellence,
                structural safety, and on-time delivery.
              </p>
            </div>
            <div className="sectors-cta-buttons">
              <Link to="/contact" className="btn btn-primary">
                <span>DISCUSS YOUR PROJECT</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/projects" className="btn btn-outline">
                <span>VIEW PROJECTS</span>
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
