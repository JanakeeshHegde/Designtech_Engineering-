import { useState, useCallback, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useLenis } from "./hooks";
import { useHashScroll } from "./hooks/useHashScroll";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SectorsPage from "./pages/SectorsPage";
import ContactPage from "./pages/ContactPage";

/**
 * Inner app — must be inside BrowserRouter to use router hooks.
 */
function AppInner() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  // Lenis smooth scroll + GSAP ticker
  useLenis();

  // Hash-based anchor scroll on every navigation (e.g. /about#expertise)
  useHashScroll();

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  // Prevent scroll during initial loading
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [loading]);

  // Scroll to top on route change when there's no hash
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <>
      {/* Subtle blueprint grid overlay */}
      <div className="blueprint-grid" aria-hidden="true" />

      {/* Loading screen — cinematic intro */}
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Main app shell */}
      <div
        className={`app ${loading ? "app--loading" : "app--loaded"}`}
        style={{ opacity: loading ? 0 : 1, transition: "opacity 0.5s" }}
      >
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
