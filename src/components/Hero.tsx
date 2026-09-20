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
   COORDINATE MARKERS DATA
───────────────────────────────────────────────────────────── */
const COORD_MARKERS = [
  { id: "X01", x: "8%",  y: "22%", active: false },
  { id: "Y01", x: "8%",  y: "62%", active: false },
  { id: "X02", x: "28%", y: "12%", active: true  },
  { id: "Y02", x: "28%", y: "82%", active: false },
  { id: "A",   x: "52%", y: "18%", active: false },
  { id: "B",   x: "72%", y: "14%", active: true  },
  { id: "C",   x: "88%", y: "26%", active: false },
  { id: "D",   x: "91%", y: "68%", active: false },
];



/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────── */
export default function Hero({ onEnter }: Props) {
  const sectionRef        = useRef<HTMLElement>(null);
  const bgImgRef          = useRef<HTMLDivElement>(null);
  const overlayLayersRef  = useRef<HTMLDivElement>(null);
  const scanLineRef       = useRef<HTMLDivElement>(null);
  const lightSweepRef     = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const progressLineRef   = useRef<HTMLDivElement>(null);
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

      /* ── OVERLAY LAYERS FADE IN ── */
      const overlayLayers = overlayLayersRef.current;
      if (overlayLayers) {
        gsap.fromTo(overlayLayers,
          { opacity: 0 },
          { opacity: 1, duration: 1.6, delay: 0.5, ease: "power2.out" }
        );
      }

      /* ── BLUEPRINT SCAN LINE ── */
      const scanLine = scanLineRef.current;
      if (scanLine && !reduced) {
        // Initial entrance
        gsap.set(scanLine, { left: "0%", opacity: 0 });
        gsap.to(scanLine, { opacity: 1, duration: 0.4, delay: 0.35 });
        // Continuous scan across the blueprint area (left 48%)
        gsap.to(scanLine, {
          left: "48%",
          duration: 9,
          delay: 0.35,
          ease: "none",
          repeat: -1,
          onRepeat: () => {
            gsap.set(scanLine, { left: "0%" });
          },
        });
      }

      /* ── LIGHT SWEEP ── */
      const lightSweep = lightSweepRef.current;
      if (lightSweep && !reduced) {
        gsap.set(lightSweep, { left: "55%" });
        gsap.to(lightSweep, {
          left: "110%",
          duration: 9,
          delay: 2.5,
          ease: "power1.inOut",
          repeat: -1,
          repeatDelay: 7,
          onRepeat: () => gsap.set(lightSweep, { left: "55%" }),
        });
      }

      /* ── CONSTRUCTION PROGRESS LINE ── */
      const progressLine = progressLineRef.current;
      if (progressLine && !reduced) {
        gsap.fromTo(progressLine,
          { width: "0%" },
          { width: "100%", duration: 3.5, delay: 1.0, ease: "power2.inOut" }
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

      /* ── HUD & COORD MARKERS STAGGER IN ── */
      gsap.fromTo(".hero-hud-item",
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, stagger: 0.12, duration: 0.6, delay: reduced ? 0.2 : 2.4, ease: "power2.out" }
      );
      gsap.fromTo(".hero-coord-marker",
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, stagger: 0.08, duration: 0.5, delay: reduced ? 0.2 : 2.6, ease: "back.out(1.4)" }
      );

      /* ── SVG BLUEPRINT LINES DRAW-ON ── */
      const bpLines = gsap.utils.toArray<SVGElement>(".bp-line");
      bpLines.forEach((line, i) => {
        const len = (line as SVGPathElement).getTotalLength?.() ?? 200;
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
        gsap.to(line, {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 1.4,
          delay: (reduced ? 0.1 : 0.3) + i * 0.12,
          ease: "power2.inOut",
        });
      });

      /* ── SCROLL TRANSITION ── */
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "60% top",
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          const overlayEl = overlayLayersRef.current;
          if (overlayEl) overlayEl.style.opacity = String(Math.max(0, 1 - p * 1.8));
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

      {/* ── LAYER 0: Background Image ── */}
      <div className="hero-bg-wrap" aria-hidden="true">
        <div ref={bgImgRef} className="hero-bg-img" />
      </div>

      {/* ── LAYER 1: Cinematic Dark Gradient Overlay ── */}
      <div className="hero-gradient-overlay" aria-hidden="true" />

      {/* ── LAYER 1b: Vignette ── */}
      <div className="hero-vignette" aria-hidden="true" />

      {/* ── LAYER 1c: Sunset Enhancement ── */}
      <div className="hero-sunset-overlay" aria-hidden="true" />

      {/* ── LAYER 2: Blueprint + Technical Overlays ── */}
      <div ref={overlayLayersRef} className="hero-overlay-layers" aria-hidden="true">

        {/* Blueprint SVG engineering lines */}
        <svg
          className="hero-bp-svg"
          viewBox="0 0 800 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Horizontal measurement baseline */}
          <line className="bp-line" x1="20" y1="460" x2="380" y2="460"
            stroke="#737373" strokeWidth="0.6" strokeOpacity="0.5" />
          {/* Tick marks on measurement line */}
          <line className="bp-line" x1="20"  y1="455" x2="20"  y2="465" stroke="#737373" strokeWidth="0.6" strokeOpacity="0.5"/>
          <line className="bp-line" x1="95"  y1="457" x2="95"  y2="463" stroke="#737373" strokeWidth="0.5" strokeOpacity="0.4"/>
          <line className="bp-line" x1="190" y1="455" x2="190" y2="465" stroke="#A87524" strokeWidth="0.8" strokeOpacity="0.6"/>
          <line className="bp-line" x1="285" y1="457" x2="285" y2="463" stroke="#737373" strokeWidth="0.5" strokeOpacity="0.4"/>
          <line className="bp-line" x1="380" y1="455" x2="380" y2="465" stroke="#737373" strokeWidth="0.6" strokeOpacity="0.5"/>
          {/* Vertical reference lines */}
          <line className="bp-line" x1="60"  y1="30"  x2="60"  y2="430" stroke="#353535" strokeWidth="0.5" strokeOpacity="0.45"/>
          <line className="bp-line" x1="190" y1="20"  x2="190" y2="460" stroke="#A87524" strokeWidth="0.7" strokeOpacity="0.35"/>
          <line className="bp-line" x1="310" y1="50"  x2="310" y2="440" stroke="#353535" strokeWidth="0.5" strokeOpacity="0.4"/>
          {/* Horizontal grid levels */}
          <line className="bp-line" x1="15" y1="100" x2="375" y2="100" stroke="#353535" strokeWidth="0.4" strokeOpacity="0.4"/>
          <line className="bp-line" x1="15" y1="200" x2="375" y2="200" stroke="#737373" strokeWidth="0.5" strokeOpacity="0.35"/>
          <line className="bp-line" x1="15" y1="300" x2="375" y2="300" stroke="#353535" strokeWidth="0.4" strokeOpacity="0.4"/>
          <line className="bp-line" x1="15" y1="380" x2="375" y2="380" stroke="#737373" strokeWidth="0.4" strokeOpacity="0.3"/>
          {/* Structural analysis rectangle — blueprint zone */}
          <path className="bp-line" d="M 180 60 L 310 60 L 310 160 L 180 160 Z"
            stroke="#A87524" strokeWidth="0.8" strokeOpacity="0.3" fill="none"/>
          {/* Diagonal — structural cross-analysis */}
          <line className="bp-line" x1="180" y1="60"  x2="310" y2="160" stroke="#737373" strokeWidth="0.4" strokeOpacity="0.25"/>
          <line className="bp-line" x1="310" y1="60"  x2="180" y2="160" stroke="#737373" strokeWidth="0.4" strokeOpacity="0.25"/>
          {/* Arc — radius / curve indicator */}
          <path className="bp-line" d="M 60 300 Q 130 240 190 300" stroke="#A87524" strokeWidth="0.7" strokeOpacity="0.3" fill="none"/>
          {/* Right side — building facade structural edges */}
          <line className="bp-line" x1="520" y1="40"  x2="520" y2="430" stroke="#A87524" strokeWidth="1"   strokeOpacity="0.15"/>
          <line className="bp-line" x1="710" y1="40"  x2="710" y2="420" stroke="#D0A04A" strokeWidth="0.8" strokeOpacity="0.12"/>
          {/* Floor slab horizontal lines */}
          <line className="bp-line" x1="520" y1="140" x2="710" y2="140" stroke="#D0A04A" strokeWidth="0.6" strokeOpacity="0.12"/>
          <line className="bp-line" x1="520" y1="250" x2="710" y2="250" stroke="#D0A04A" strokeWidth="0.6" strokeOpacity="0.12"/>
          <line className="bp-line" x1="520" y1="350" x2="710" y2="350" stroke="#D0A04A" strokeWidth="0.6" strokeOpacity="0.10"/>
        </svg>

        {/* Blueprint Scan Line */}
        <div ref={scanLineRef} className="hero-scan-line" aria-hidden="true" />

        {/* Construction Progress Track */}
        <div className="hero-progress-track" aria-hidden="true">
          <div ref={progressLineRef} className="hero-progress-line" />
          <div className="hero-progress-label">STRUCTURAL PROGRESS</div>
          <div className="hero-progress-ticks">
            {["0%","25%","50%","75%","100%"].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        {/* Light Sweep */}
        <div ref={lightSweepRef} className="hero-light-sweep" aria-hidden="true" />

       

        {/* Coordinate Markers */}
        {COORD_MARKERS.map((m) => (
          <div
            key={m.id}
            className={`hero-coord-marker ${m.active ? "hero-coord-marker--active" : ""}`}
            style={{ left: m.x, top: m.y }}
            aria-hidden="true"
          >
            <div className="coord-crosshair" />
            <span className="coord-id">{m.id}</span>
          </div>
        ))}

      </div>

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
        <div className="scroll-hint-line" />
        <span className="scroll-hint-text">SCROLL TO EXPLORE</span>
      </div>

    </section>
  );
}
