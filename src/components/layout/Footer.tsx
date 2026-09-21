import { Link } from "react-router-dom";
import { FOOTER_NAV_ITEMS } from "../../data/navigation";
import { OFFICE_INFO } from "../../data/company";
import "./Footer.css";

/* ─── Minimal architectural line icons ─────────────────────── */

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="footer-icon">
    <path
      d="M3 2h3.5l1.5 3.5-1.75 1.25a10 10 0 0 0 4.5 4.5L12 9.5 15.5 11V14.5A1.5 1.5 0 0 1 14 16C7.373 16 2 10.627 2 4A1.5 1.5 0 0 1 3.5 2.5"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="footer-icon">
    <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 5.5l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const LocationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="footer-icon">
    <path
      d="M9 2a5 5 0 0 1 5 5c0 3.5-5 9-5 9S4 10.5 4 7a5 5 0 0 1 5-5z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
    <circle cx="9" cy="7" r="1.75" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="footer-arrow">
    <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      {/* Subtle architectural grid overlay */}
      <div className="footer-grid-overlay" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="footer-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#D9D5CC" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>

      <div className="container">
        <div className="footer-inner">

          {/* ── Column 1: Brand ── */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo-link" aria-label="Designtech Engineering — homepage">
              <img src="/Logo.png" alt="Designtech Engineering" className="footer-logo-img" />
            </Link>
            <p className="footer-tagline">
              Civil &amp; Structural Engineering Consultancy dedicated to permanence, precision, and architectural integrity.
            </p>
          </div>

          {/* ── Column 2: Explore ── */}
          <div className="footer-col">
            <span className="footer-heading">EXPLORE</span>
            <nav aria-label="Footer navigation">
              <ul className="footer-nav-list" role="list">
                {FOOTER_NAV_ITEMS.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="footer-nav-link">
                      {item.label}
                      <span className="footer-nav-underline" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ── Column 3: Sectors ── */}
          <div className="footer-col">
            <span className="footer-heading">SPECIALIZATIONS</span>
            <ul className="footer-spec-list" role="list">
              {[
                "Residential & Commercial",
                "Water & Sewage Plants",
                "Industrial Structures",
                "Solar & Renewable Energy",
              ].map((s) => (
                <li key={s} className="footer-spec-item">
                  <span className="footer-spec-dot" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Contact ── */}
          <div className="footer-col">
            <span className="footer-heading">CONTACT</span>
            <div className="footer-contact-block">
              <div className="footer-contact-row">
                <LocationIcon />
                <address className="footer-address">
                  {OFFICE_INFO.addressLine1}<br />
                  {OFFICE_INFO.addressLine2}<br />
                  {OFFICE_INFO.addressLine3}<br />
                  {OFFICE_INFO.addressLine4}<br />
                  {OFFICE_INFO.addressLine5}
                </address>
              </div>

              <div className="footer-contact-row">
                <PhoneIcon />
                <div className="footer-phones">
                  <a href={`tel:+91${OFFICE_INFO.phone1}`} className="footer-link">{OFFICE_INFO.phone1}</a>
                  <a href={`tel:+91${OFFICE_INFO.phone2}`} className="footer-link">{OFFICE_INFO.phone2}</a>
                </div>
              </div>

              <div className="footer-contact-row">
                <EmailIcon />
                <a href={`mailto:${OFFICE_INFO.email}`} className="footer-link footer-email">
                  {OFFICE_INFO.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {currentYear} Designtech Engineering. All Rights Reserved.
          </p>
          <Link to="/contact" className="footer-cta-link">
            <span>Start a Project</span>
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </footer>
  );
}
