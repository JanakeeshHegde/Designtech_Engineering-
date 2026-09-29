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
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <ul role="list">
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
          <div className="mobile-menu-footer">
            <p className="mobile-menu-contact">designtecheng.team@gmail.com</p>
            <p className="mobile-menu-contact">
              <a href="tel:+919035761979">9035761979</a> &nbsp;/&nbsp;
              <a href="tel:+919880593211">9880593211</a>
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
