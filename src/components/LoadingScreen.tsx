import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./LoadingScreen.css";

interface Props {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete,
        });
      },
    });

    // Progress bar fill
    tl.to(progressRef.current, {
      width: "100%",
      duration: 2.0,
      ease: "power1.inOut",
    }, 0);

    // Grid lines draw
    tl.fromTo(".load-grid-h", { scaleX: 0 }, {
      scaleX: 1,
      duration: 1.2,
      stagger: 0.08,
      ease: "power2.out",
      transformOrigin: "left center",
    }, 0);

    tl.fromTo(".load-grid-v", { scaleY: 0 }, {
      scaleY: 1,
      duration: 1.2,
      stagger: 0.08,
      ease: "power2.out",
      transformOrigin: "top center",
    }, 0.1);

    // Logo text
    tl.fromTo(".load-company", {
      opacity: 0,
      y: 20,
      letterSpacing: "0.4em",
    }, {
      opacity: 1,
      y: 0,
      letterSpacing: "0.12em",
      duration: 0.8,
      ease: "power3.out",
    }, 0.8);

    tl.fromTo(".load-status-label", { opacity: 0 }, {
      opacity: 1,
      duration: 0.3,
    }, 0.6);

    tl.fromTo(".load-bar-container", { opacity: 0 }, {
      opacity: 1,
      duration: 0.3,
    }, 0.7);

    return () => { tl.kill(); };
  }, [onComplete]);

  // Grid lines
  const hLines = Array.from({ length: 8 });
  const vLines = Array.from({ length: 12 });

  return (
    <div ref={containerRef} className="loading-screen" aria-label="Loading Designtech Engineering">
      {/* Blueprint grid */}
      <div className="load-grid" aria-hidden="true">
        {hLines.map((_, i) => (
          <div
            key={`h-${i}`}
            className="load-grid-h"
            style={{ top: `${(i + 1) * (100 / (hLines.length + 1))}%` }}
          />
        ))}
        {vLines.map((_, i) => (
          <div
            key={`v-${i}`}
            className="load-grid-v"
            style={{ left: `${(i + 1) * (100 / (vLines.length + 1))}%` }}
          />
        ))}
      </div>

      {/* Center content */}
      <div ref={textRef} className="load-center">


        <div className="load-logo-block">
          <img
            src="/Logo.png"
            alt="Designtech Engineering"
            className="load-company load-logo-img"
          />
        </div>

        <div className="load-status-label t-label" aria-live="polite">
          CIVIL &amp; STRUCTURAL ENGINEERING CONSULTANCY
        </div>

        <div className="load-bar-container" aria-hidden="true">
          <div className="load-bar-track">
            <div ref={progressRef} className="load-bar-fill" />
          </div>
          <span className="load-pct t-label">LOADING</span>
        </div>
      </div>


    </div>
  );
}
