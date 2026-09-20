import { useEffect, useRef, useState } from "react";
import "./CustomCursor.css";

type CursorState = "default" | "view" | "inspect" | "explore" | "open";

let _setState: ((s: CursorState) => void) | null = null;
export const setCursorState = (s: CursorState) => _setState?.(s);


export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const curr = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  _setState = setState;

  useEffect(() => {
    // Only on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.classList.add("custom-cursor-active");

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const leave = () => setVisible(false);

    const animate = () => {
      curr.current.x += (pos.current.x - curr.current.x) * 0.12;
      curr.current.y += (pos.current.y - curr.current.y) * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${curr.current.x}px, ${curr.current.y}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      cancelAnimationFrame(rafRef.current);
      document.body.classList.remove("custom-cursor-active");
    };
  }, []);

  const labels: Record<CursorState, string> = {
    default: "",
    view: "VIEW",
    inspect: "INSPECT",
    explore: "EXPLORE",
    open: "OPEN",
  };

  return (
    <>
      <div
        ref={cursorRef}
        className={`cursor-ring ${state !== "default" ? "cursor-ring--active" : ""} ${!visible ? "cursor-ring--hidden" : ""}`}
        aria-hidden="true"
      >
        <div className="cursor-crosshair">
          <span className="cursor-arm cursor-arm--t" />
          <span className="cursor-arm cursor-arm--r" />
          <span className="cursor-arm cursor-arm--b" />
          <span className="cursor-arm cursor-arm--l" />
          <span className="cursor-center" />
        </div>
        {state !== "default" && (
          <span className="cursor-label">{labels[state]}</span>
        )}
      </div>
      <div ref={dotRef} className={`cursor-dot ${!visible ? "cursor-dot--hidden" : ""}`} aria-hidden="true" />
    </>
  );
}
