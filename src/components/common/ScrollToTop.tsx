import { useState, useEffect } from "react";
import "./ScrollToTop.css";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calculate scroll progress percentage (0 to 1)
      if (docHeight > 0) {
        const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);
        setScrollProgress(progress);
      }

      // Show button after scrolling down 300px
      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // SVG Circular Progress calculation
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <div className="floating-actions" aria-label="Floating quick actions">
      {/* ── 1. Back To Top / Up Arrow Button ── */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`scroll-to-top-btn ${isVisible ? "scroll-to-top-btn--visible" : ""}`}
        aria-label="Scroll back to top of page"
        title="Scroll to top"
      >
        <svg className="stt-progress-ring" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
          {/* Background track */}
          <circle
            className="stt-ring-bg"
            cx="24"
            cy="24"
            r={radius}
            strokeWidth="2"
            fill="none"
          />
          {/* Active progress indicator */}
          <circle
            className="stt-ring-fill"
            cx="24"
            cy="24"
            r={radius}
            strokeWidth="2.5"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Up Arrow Icon */}
        <span className="stt-icon-wrap" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 13V3M3 8l5-5 5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* ── 2. WhatsApp Floating Action Button (Directly Below) ── */}
      <a
        href="https://wa.me/919035761979"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-floating-btn"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp (+91 9035761979)"
      >
        <svg
          className="whatsapp-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z"
            fill="currentColor"
          />
        </svg>
      </a>
    </div>
  );
}
