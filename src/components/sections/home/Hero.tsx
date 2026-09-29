import { Link } from "react-router-dom";
import "./Hero.css";


interface Props {
  onEnter: () => void;
}

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────── */
export default function Hero({ onEnter }: Props) {
  return (
    <section
      id="hero"
      className="hero"
      aria-labelledby="hero-headline"
    >

      {/* ── LAYER 0: Background Video ── */}
      <div className="hero-bg-wrap" aria-hidden="true">
        <video
          className="hero-bg-video"
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </div>

      {/* ── LAYER 1: Cinematic Dark Gradient Overlay ── */}
      <div className="hero-gradient-overlay" aria-hidden="true" />

      {/* ── LAYER 1b: Vignette ── */}
      <div className="hero-vignette" aria-hidden="true" />

      {/* ── LAYER 1c: Sunset Enhancement ── */}
      <div className="hero-sunset-overlay" aria-hidden="true" />

      {/* ── LAYER 3: Atmospheric Particles ── */}

      {/* ── LAYER 10: Hero Content ── */}
      <div className="hero-content-wrap">
        <div className="hero-left-inner">

          <h1 id="hero-headline" className="hero-headline" aria-label="Engineering that endures.">
            <span className="hero-line">ENGINEERING</span>
            <span className="hero-line">THAT</span>
            <span className="hero-line hero-line--stroke">ENDURES.</span>
          </h1>

          <p className="hero-sub">
            Structural solutions built for permanence —<br />
            designed with precision, delivered on time.
          </p>

          <div className="hero-cta-row">
            <button
              className="btn btn-primary hero-cta-primary"
              onClick={onEnter}
              aria-label="Explore our engineering work"
            >
              Explore Our Work
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <Link
              to="/about"
              className="hero-cta-secondary"
              aria-label="Learn about Designtech Engineering"
            >
              Our Story
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div className="hero-address" aria-label="Office location">
            <span className="hero-address-dot" aria-hidden="true" />
            <span className="hero-address-text">Bengaluru, India</span>
          </div>
        </div>
      </div>

      {/* ── INITIAL REVEAL MASK ── */}

      {/* Scroll indicator */}
      <div className="hero-scroll-hint" aria-hidden="true">
        <span className="scroll-hint-text">SCROLL TO EXPLORE</span>
      </div>

    </section>
  );
}
