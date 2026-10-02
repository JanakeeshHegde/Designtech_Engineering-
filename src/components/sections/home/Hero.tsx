import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import "./Hero.css";

interface Props {
  onEnter: () => void;
}

export default function Hero({ onEnter }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.play().catch(() => {});
    }

    const ctx = gsap.context(() => {
      // Cinematic Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-line",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.9, ease: "power3.out" }
      )
      .fromTo(
        ".hero-sub",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.5"
      )
      .fromTo(
        ".hero-cta-row",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.4"
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="hero"
      aria-labelledby="hero-headline"
    >
      {/* ── LAYER 0: Architectural Hero Video ── */}
      <div className="hero-video-wrap" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── LAYER 1: Subtle Cinematic Depth Overlay for Text Legibility ── */}
      <div className="hero-gradient-overlay" aria-hidden="true" />

      {/* ── LAYER 2: Foreground Structural Framing Silhouette ── */}
      <div className="hero-framing-silhouette" aria-hidden="true">
        <div className="hero-frame-beam-top" />
        <div className="hero-frame-col-left" />
      </div>

      {/* ── LAYER 3: Locked Hero Content ── */}
      <div className="hero-content-wrap container">
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
              <span>Explore Our Work</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <Link
              to="/about"
              className="btn btn-dark-outline hero-cta-secondary"
              aria-label="Learn about Designtech Engineering"
            >
              <span>Our Story</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
