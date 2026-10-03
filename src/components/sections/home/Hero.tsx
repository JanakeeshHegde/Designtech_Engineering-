import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import "./Hero.css";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set video playback to slow cinematic speed
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.55;
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.play().catch(() => {});
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Main Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Subtle zoom and contrast reveal of background video
      tl.fromTo(
        ".hero-video",
        { scale: 1.15, filter: "brightness(0.5) contrast(1.1)" },
        { scale: 1, filter: "brightness(1) contrast(1)", duration: 2.8, ease: "power2.out" },
        0
      );

      // 2. Architectural Grid Lines subtle draw-in
      tl.fromTo(
        ".hero-grid-line",
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 0.4, duration: 1.5, stagger: 0.15, ease: "power3.inOut" },
        0.2
      );

      // 3. Corner Crosshair markers pop in
      tl.fromTo(
        ".hero-crosshair",
        { scale: 0, opacity: 0, rotation: -45 },
        { scale: 1, opacity: 0.7, rotation: 0, duration: 0.8, stagger: 0.1, ease: "back.out(2)" },
        0.4
      );

      // 4. Status badge slide down & fade in
      tl.fromTo(
        ".hero-badge",
        { y: -30, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.5)" },
        0.3
      );

      // 5. Headline masked reveal (smooth architectural text elevation)
      tl.fromTo(
        ".hero-line",
        { y: "115%", rotateX: 20, opacity: 0 },
        { y: "0%", rotateX: 0, opacity: 1, stagger: 0.15, duration: 1.2, ease: "power4.out" },
        0.45
      );

      // 6. Gold stroke shimmer & glowing aura trigger
      tl.fromTo(
        ".hero-line--stroke",
        { filter: "drop-shadow(0 0 0px rgba(183, 135, 54, 0))" },
        { filter: "drop-shadow(0 0 32px rgba(183, 135, 54, 0.55))", duration: 1.4, ease: "power2.out" },
        0.9
      );

      // 7. Subheading fade and smooth upwards drift
      tl.fromTo(
        ".hero-sub",
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: "power3.out" },
        0.85
      );

      // 8. CTA Buttons reveal with spring stagger
      tl.fromTo(
        ".hero-cta-row .btn",
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.14, duration: 0.9, ease: "back.out(1.3)" },
        1.05
      );
    }, heroRef);

    // Multi-layer interactive mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 24;
      const y = (e.clientY / innerHeight - 0.5) * 20;

      if (contentRef.current) {
        gsap.to(contentRef.current, {
          x: x * 0.5,
          y: y * 0.4,
          rotateX: -y * 0.14,
          rotateY: x * 0.14,
          duration: 1.2,
          ease: "power2.out",
        });
      }

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: x * 2.2,
          y: y * 2.2,
          duration: 2.0,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="hero"
      aria-labelledby="hero-headline"
    >
      {/* ── LAYER 0: Architectural Hero Video (Slow Cinematic 0.55x) ── */}
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

      {/* ── LAYER 1: Cinematic Ambient Depth Overlay & Grid ── */}
      <div className="hero-gradient-overlay" aria-hidden="true" />
      <div ref={glowRef} className="hero-ambient-glow" aria-hidden="true" />

      {/* Architectural subtle ambient accent grid */}
      <div className="hero-grid-overlay" aria-hidden="true">
        <div className="hero-grid-line hero-grid-line--h" />
        <div className="hero-crosshair hero-crosshair--tl">+</div>
        <div className="hero-crosshair hero-crosshair--tr">+</div>
        <div className="hero-crosshair hero-crosshair--bl">+</div>
        <div className="hero-crosshair hero-crosshair--br">+</div>
      </div>

      {/* ── LAYER 2: Hero Content & Typography ── */}
      <div className="hero-content-wrap container">
        <div ref={contentRef} className="hero-left-inner">
          {/* Top Sleek Pill Badge */}
          <div className="hero-badge">
            <span className="hero-badge-pulse" aria-hidden="true">
              <span className="hero-badge-dot" />
              <span className="hero-badge-ring" />
            </span>
            <span className="hero-badge-text">CIVIL &amp; STRUCTURAL ENGINEERING CONSULTANCY</span>
          </div>

          <h1 id="hero-headline" className="hero-headline" aria-label="Engineering that endures.">
            <span className="hero-line-wrap">
              <span className="hero-line">ENGINEERING</span>
            </span>
            <span className="hero-line-wrap">
              <span className="hero-line">THAT</span>
            </span>
            <span className="hero-line-wrap">
              <span className="hero-line hero-line--stroke">ENDURES.</span>
            </span>
          </h1>

          <p className="hero-sub">
            Structural solutions built for permanence —<br />
            designed with precision, delivered on time.
          </p>

          <div className="hero-cta-row">
            <Link
              to="/projects"
              className="btn btn-primary hero-cta-primary"
              aria-label="Explore our engineering work"
            >
              <span className="hero-btn-shine" aria-hidden="true" />
              <span>Explore Our Work</span>
              <svg className="hero-btn-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              to="/about"
              className="btn btn-dark-outline hero-cta-secondary"
              aria-label="Learn about Designtech Engineering"
            >
              <span>Our Story</span>
              <svg className="hero-btn-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
