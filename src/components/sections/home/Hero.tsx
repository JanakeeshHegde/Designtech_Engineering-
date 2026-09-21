import { useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  onEnter: () => void;
}

/* ─────────────────────────────────────────────────────────────
   PARTICLE HELPER
───────────────────────────────────────────────────────────── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  targetOpacity: number;
  life: number;
  maxLife: number;
}

function createParticle(w: number, h: number): Particle {
  const maxLife = 280 + Math.random() * 320;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.18,
    vy: -Math.random() * 0.22 - 0.06,
    size: 0.8 + Math.random() * 1.8,
    opacity: 0,
    targetOpacity: 0.06 + Math.random() * 0.1,
    life: Math.random() * maxLife,
    maxLife,
  };
}

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────── */
export default function Hero({ onEnter }: Props) {
  const sectionRef        = useRef<HTMLElement>(null);
  const bgImgRef          = useRef<HTMLVideoElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const revealMaskRef     = useRef<HTMLDivElement>(null);

  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef   = useRef<number>(0);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  /* ───── PARTICLE CANVAS ───── */
  const initParticles = useCallback(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas || prefersReducedMotion.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 14 : 28;

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width  = w;
    canvas.height = h;

    let particles: Particle[] = Array.from({ length: COUNT }, () => createParticle(w, h));
    let alive = true;

    const onResize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width  = w;
      canvas.height = h;
    };
    window.addEventListener("resize", onResize);

    const tick = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p, idx) => {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;

        const progress = p.life / p.maxLife;
        if (progress < 0.15) {
          p.opacity = (progress / 0.15) * p.targetOpacity;
        } else if (progress < 0.75) {
          p.opacity = p.targetOpacity;
        } else {
          p.opacity = ((1 - progress) / 0.25) * p.targetOpacity;
        }

        if (p.life >= p.maxLife) {
          particles[idx] = createParticle(w, h);
          particles[idx].life = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(208,160,74,${p.opacity.toFixed(3)})`;
        ctx.fill();
      });

      requestAnimationFrame(tick);
    };
    tick();

    return () => {
      alive = false;
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* ───── MOUSE PARALLAX ───── */
  const initMouseParallax = useCallback(() => {
    if (prefersReducedMotion.current) return;
    const section = sectionRef.current;
    if (!section) return;
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top)  / rect.height,
      };
    };
    section.addEventListener("mousemove", onMove);
    return () => section.removeEventListener("mousemove", onMove);
  }, []);

  /* ───── RAF LOOP — parallax + auto mobile movement ───── */
  const startParallaxLoop = useCallback(() => {
    if (prefersReducedMotion.current) return;
    const bg = bgImgRef.current;
    if (!bg) return;

    const isMobile = window.innerWidth < 768;
    let autoT = 0;
    let currentX = 0, currentY = 0;
    let running = true;

    const loop = () => {
      if (!running) return;
      if (isMobile) {
        autoT += 0.003;
        mouseRef.current = {
          x: 0.5 + Math.sin(autoT) * 0.08,
          y: 0.5 + Math.cos(autoT * 0.7) * 0.05,
        };
      }

      const dx = mouseRef.current.x - 0.5;
      const dy = mouseRef.current.y - 0.5;

      currentX += (dx * -6 - currentX) * 0.04;
      currentY += (dy * -4 - currentY) * 0.04;

      bg.style.transform = `scale(1.06) translate3d(${currentX}px,${currentY}px,0)`;

      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ───── MAIN GSAP SETUP ───── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = prefersReducedMotion.current;

    const videoEl = bgImgRef.current;
    let setPlayback: (() => void) | null = null;
    let tryPlay: (() => void) | null = null;
    let onVisibility: (() => void) | null = null;
    if (videoEl) {
      setPlayback = () => {
        try {
          videoEl.playbackRate = 0.7;
        } catch (e) {
          // no-op
        }
      };
      setPlayback();
      videoEl.addEventListener("loadedmetadata", setPlayback);
      tryPlay = () => {
        try {
          const p = videoEl.play();
          if (p && typeof p.catch === "function") {
            p.catch(() => {});
          }
        } catch (e) {
          // no-op
        }
      };
      tryPlay();
      videoEl.addEventListener("canplay", tryPlay);
      onVisibility = () => {
        if (document.visibilityState === "visible") {
          setPlayback?.();
          tryPlay?.();
        }
      };
      document.addEventListener("visibilitychange", onVisibility);
    }

    const ctx = gsap.context(() => {

      /* ── CINEMATIC IMAGE REVEAL ── */
      const revealMask = revealMaskRef.current;
      if (revealMask) {
        gsap.fromTo(revealMask,
          { opacity: 1 },
          {
            opacity: 0, duration: 1.2, delay: 0.8, ease: "power2.inOut",
            onComplete: () => { revealMask.style.pointerEvents = "none"; }
          }
        );
      }

      /* ── TEXT ENTRANCE ── */
      gsap.fromTo(".hero-eyebrow",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, delay: reduced ? 0.1 : 1.0, ease: "power2.out" }
      );
      gsap.fromTo(".hero-line",
        { y: 72, opacity: 0, skewY: 2 },
        { y: 0, opacity: 1, skewY: 0, stagger: 0.1, duration: 1.0, delay: reduced ? 0.15 : 1.2, ease: "power3.out" }
      );
      gsap.fromTo(".hero-sub",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, delay: reduced ? 0.5 : 1.7, ease: "power2.out" }
      );
      gsap.fromTo(".hero-cta-row",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, delay: reduced ? 0.7 : 1.9, ease: "power2.out" }
      );
      gsap.fromTo(".hero-address",
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: reduced ? 0.9 : 2.1, ease: "power2.out" }
      );

      /* ── HUD STAGGER IN ── */
      gsap.fromTo(".hero-hud-item",
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, stagger: 0.12, duration: 0.6, delay: reduced ? 0.2 : 2.4, ease: "power2.out" }
      );

      /* ── SCROLL TRANSITION ── */
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "60% top",
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          const bgEl = bgImgRef.current;
          if (bgEl) bgEl.style.opacity = String(Math.max(0.55, 1 - p * 0.45));
        },
      });

    }, section);

    /* ── INIT SIDE EFFECTS ── */
    const cleanupParticles = initParticles();
    const cleanupMouse     = initMouseParallax();
    const cleanupParallax  = startParallaxLoop();

    return () => {
      if (videoEl) {
        if (setPlayback) videoEl.removeEventListener("loadedmetadata", setPlayback);
        if (tryPlay) videoEl.removeEventListener("canplay", tryPlay);
      }
      if (onVisibility) document.removeEventListener("visibilitychange", onVisibility);
      ctx.revert();
      cleanupParticles?.();
      cleanupMouse?.();
      cleanupParallax?.();
    };
  }, [initParticles, initMouseParallax, startParallaxLoop]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="hero"
      aria-labelledby="hero-headline"
    >

      {/* ── LAYER 0: Background Video ── */}
      <div className="hero-bg-wrap" aria-hidden="true">
        <video
          ref={bgImgRef}
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
      <canvas
        ref={particleCanvasRef}
        className="hero-particle-canvas"
        aria-hidden="true"
      />

      {/* ── LAYER 10: Hero Content ── */}
      <div className="hero-content-wrap">
        <div className="hero-left-inner">

          <div className="hero-eyebrow t-label" aria-label="Civil & Structural Engineering Consultancy">
            Civil &amp; Structural Engineering
          </div>

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
      <div ref={revealMaskRef} className="hero-reveal-mask" aria-hidden="true" />

      {/* Scroll indicator */}
      <div className="hero-scroll-hint" aria-hidden="true">
        <span className="scroll-hint-text">SCROLL TO EXPLORE</span>
      </div>

    </section>
  );
}
