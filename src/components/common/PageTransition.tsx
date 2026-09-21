import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import "./PageTransition.css";

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps each page with a lightweight GSAP fade/slide transition.
 * Uses the same GSAP already installed — no new animation library.
 */
export default function PageTransition({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Entrance animation
    gsap.fromTo(
      el,
      { opacity: 0, y: 18 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.4, 
        ease: "power2.out", 
        clearProps: "all",
        onComplete: () => {
          import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
            ScrollTrigger.refresh();
          });
        }
      }
    );
  }, [pathname]);

  return (
    <div ref={ref} className="page-transition">
      {children}
    </div>
  );
}
