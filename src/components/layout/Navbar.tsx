import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../data/navigation";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    // Reset scroll state on page change
    setScrolled(false);
  }, [pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    // Set initial state
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`} role="banner">
      <nav className="navbar-inner container" aria-label="Main navigation">
        {/* Logo — links to home */}
        <Link to="/" className="navbar-logo" aria-label="Designtech Engineering — go to homepage">
          <img src="/Logo.png" alt="Designtech Engineering" className="navbar-logo-img" />
        </Link>

        {/* Desktop nav — 4 items only */}
        <ul className="navbar-links" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "navbar-link--active" : ""}`
                }
                aria-current={pathname === item.path ? "page" : undefined}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <Link to="/contact" className="navbar-cta" aria-label="Start a project with Designtech Engineering">
          Start a Project
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M1 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>

        {/* Mobile hamburger */}
        <div className="navbar-actions">
          <button
            className={`hamburger ${menuOpen ? "hamburger--open" : ""}`}
            onClick={() => setMenuOpen((p) => !p)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          data-lenis-prevent="true"
        >
          <div className="mobile-menu-body">
            <ul role="list" className="mobile-menu-nav">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `mobile-menu-link ${isActive ? "mobile-menu-link--active" : ""}`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mobile-menu-action">
              <Link
                to="/contact"
                className="mobile-menu-cta"
                onClick={() => setMenuOpen(false)}
                aria-label="Start a project with Designtech Engineering"
              >
                <span>Start a Project</span>
                <svg width="14" height="14" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          <div className="mobile-menu-footer">
            <div className="mobile-menu-contact-group">
              <span className="mobile-menu-label">Direct Inquiry</span>
              <a
                href="mailto:designtecheng.team@gmail.com"
                className="mobile-contact-item"
                aria-label="Email Designtech Engineering"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <span>designtecheng.team@gmail.com</span>
              </a>
              <a
                href="tel:+919035761979"
                className="mobile-contact-item"
                aria-label="Call Designtech Engineering"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>+91 9035761979</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
