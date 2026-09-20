import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const NAV_ITEMS = [
  { num: "01", label: "HOME", path: "/" },
  { num: "02", label: "ABOUT", path: "/about" },
  { num: "03", label: "SECTORS", path: "/sectors" },
  { num: "04", label: "CONTACT", path: "/contact" },
];

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
                  <span className="mobile-menu-num">{item.num}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
