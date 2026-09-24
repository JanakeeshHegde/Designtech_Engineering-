import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useLenis } from "./hooks";
import { useHashScroll } from "./hooks/useHashScroll";
import Navbar from "./components/layout/Navbar";
import PageTransition from "./components/common/PageTransition";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SectorsPage from "./pages/SectorsPage";
import ContactPage from "./pages/ContactPage";

/**
 * Inner app — must be inside BrowserRouter to use router hooks.
 */
function AppInner() {
  const { pathname } = useLocation();
  const progressRef = useRef<HTMLDivElement>(null);

  // Lenis smooth scroll + GSAP ticker
  useLenis();

  // Hash-based anchor scroll on every navigation (e.g. /about#expertise)
  useHashScroll();

  // Scroll to top on route change when there's no hash
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  // Gold scroll progress bar
  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;

    const update = () => {
      const scrollTop    = window.scrollY;
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
      const pct          = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = `scaleX(${pct})`;
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);

  return (
    <>
      {/* Gold engineering scroll progress bar */}
      <div ref={progressRef} className="scroll-progress-bar" aria-hidden="true" />

      {/* Subtle blueprint grid overlay */}
      <div className="blueprint-grid" aria-hidden="true" />

      {/* Main app shell */}
      <div className="app app--loaded">
        {/* Navigation — always visible, router-aware */}
        <Navbar />

        {/* Page routes with GSAP transition wrapper */}
        <PageTransition>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/sectors" element={<SectorsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Catch-all → home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </PageTransition>

        {/* Footer — always visible */}
        <Footer />
      </div>
    </>
  );
}

/**
 * Root — provides BrowserRouter context.
 */
export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
