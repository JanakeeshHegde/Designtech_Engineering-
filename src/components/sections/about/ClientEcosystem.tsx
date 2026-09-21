import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CLIENTS, type ClientItem, CLIENT_LOGO_FALLBACK_ENABLED } from "../../../data/clients";
import "./ClientEcosystem.css";

gsap.registerPlugin(ScrollTrigger);

const CENTER_LOGO_SRC = "/Logo.png";

export type LayoutMode = "desktop" | "tablet" | "mobile";

function getLayoutMode(): LayoutMode {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w <= 768) return "mobile";
  if (w <= 1024) return "tablet";
  return "desktop";
}

/* ─────────────────────────────────────────────────────────────
   LAYOUT CONFIGURATIONS
   Single source of truth for each screen size tier.
───────────────────────────────────────────────────────────── */

interface LayoutConfig {
  mode: LayoutMode;
  viewBoxW: number;
  viewBoxH: number;
  hubX: number;
  hubY: number;
  hubR: number;
  hubTitleY: number;
  hubSubtitleY: number;
  hubTitleSize: number;
  hubSubtitleSize: number;
  cardW: number;
  cardH: number;
  nameTopOffset: number;
  projectOffset: number;
  nameFontSize: number;
  projectFontSize: number;
  innerRing?: number;
  outerRing?: number;
}

const DESKTOP_CFG: LayoutConfig = {
  mode: "desktop",
  viewBoxW: 1200,
  viewBoxH: 1200,
  hubX: 600,
  hubY: 600,
  hubR: 120,
  hubTitleY: 150,
  hubSubtitleY: 170,
  hubTitleSize: 13,
  hubSubtitleSize: 10,
  cardW: 112,
  cardH: 72,
  nameTopOffset: 48,
  projectOffset: 20,
  nameFontSize: 11.5,
  projectFontSize: 9.5,
  innerRing: 300,
  outerRing: 470,
};

const TABLET_CFG: LayoutConfig = {
  mode: "tablet",
  viewBoxW: 960,
  viewBoxH: 960,
  hubX: 480,
  hubY: 480,
  hubR: 96,
  hubTitleY: 122,
  hubSubtitleY: 138,
  hubTitleSize: 11.5,
  hubSubtitleSize: 9,
  cardW: 98,
  cardH: 62,
  nameTopOffset: 42,
  projectOffset: 18,
  nameFontSize: 10.5,
  projectFontSize: 8.5,
  innerRing: 235,
  outerRing: 370,
};

const MOBILE_CFG: LayoutConfig = {
  mode: "mobile",
  viewBoxW: 390,
  viewBoxH: 1170,
  hubX: 195,
  hubY: 82,
  hubR: 62,
  hubTitleY: 84,
  hubSubtitleY: 98,
  hubTitleSize: 10,
  hubSubtitleSize: 7.5,
  cardW: 110,
  cardH: 66,
  nameTopOffset: 42,
  projectOffset: 18,
  nameFontSize: 10.5,
  projectFontSize: 8.5,
};

export interface PlacedClient extends ClientItem {
  x: number;
  y: number;
  ring?: 1 | 2;
  angle?: number;
  radius?: number;
  col?: number;
  row?: number;
}

export interface ConnectionLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
  isStatic?: boolean;
}

export interface JunctionDot {
  x: number;
  y: number;
  r: number;
}

interface ComputedLayout {
  config: LayoutConfig;
  clients: PlacedClient[];
  lines: ConnectionLine[];
  junctions: JunctionDot[];
}

/* ─────────────────────────────────────────────────────────────
   RADIAL PLACEMENT (Desktop & Tablet)
───────────────────────────────────────────────────────────── */

function computeRadialLayout(clients: ClientItem[], cfg: LayoutConfig): ComputedLayout {
  const total = clients.length;
  const useTwoRings = total > 8;
  const innerCount = useTwoRings ? Math.ceil(total / 2) : total;
  const outerCount = useTwoRings ? total - innerCount : 0;

  const rInner = cfg.innerRing || 300;
  const rOuter = cfg.outerRing || 470;

  const placed: PlacedClient[] = [];

  const placeRing = (count: number, radius: number, ring: 1 | 2, startOffset: number) => {
    if (count === 0) return;
    const step = (Math.PI * 2) / count;
    let a = -Math.PI / 2 + startOffset;
    for (let i = 0; i < count; i++) {
      const c = clients[placed.length];
      if (!c) break;
      placed.push({
        ...c,
        x: cfg.hubX + radius * Math.cos(a),
        y: cfg.hubY + radius * Math.sin(a),
        ring,
        angle: a,
        radius,
      });
      a += step;
    }
  };

  if (!useTwoRings) {
    placeRing(innerCount, rInner, 1, 0);
  } else {
    placeRing(innerCount, rInner, 1, 0);
    placeRing(outerCount, rOuter, 2, Math.PI / outerCount);
  }

  // Connection lines from hub perimeter to client card perimeter
  const lines: ConnectionLine[] = placed.map((c) => {
    const dx = c.x - cfg.hubX;
    const dy = c.y - cfg.hubY;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;

    const x1 = cfg.hubX + ux * (cfg.hubR + 6);
    const y1 = cfg.hubY + uy * (cfg.hubR + 6);

    const halfW = cfg.cardW / 2;
    const halfH = cfg.cardH / 2;
    const tx = Math.abs(ux) < 1e-6 ? Infinity : halfW / Math.abs(ux);
    const ty = Math.abs(uy) < 1e-6 ? Infinity : halfH / Math.abs(uy);
    const rectDist = Math.min(tx, ty);

    const x2 = c.x - ux * (rectDist + 2);
    const y2 = c.y - uy * (rectDist + 2);
    const lineLen = Math.hypot(x2 - x1, y2 - y1);

    return { id: c.id, x1, y1, x2, y2, length: lineLen, isStatic: false };
  });

  return {
    config: cfg,
    clients: placed,
    lines,
    junctions: [],
  };
}

/* ─────────────────────────────────────────────────────────────
   MOBILE HYBRID / VERTICAL TREE PLACEMENT
   Designtech Engineering Hub at top -> Vertical Stem ->
   Horizontal Bus Bar -> Clean Vertical Drops into 2 Columns.
   Guaranteed: ZERO lines crossing logos or client names.
───────────────────────────────────────────────────────────── */

function computeMobileLayout(clients: ClientItem[], cfg: LayoutConfig): ComputedLayout {
  const colX = [105, 285];
  const stemY1 = cfg.hubY + cfg.hubSubtitleY + 14; // below subtitle text
  const busY = stemY1 + 26; // horizontal bus line Y (222)

  // Rows start below bus line
  const rowStartAnchorY = busY + 28 + cfg.cardH / 2; // 278
  const rowStepY = 154; // row-to-row spacing

  const placed: PlacedClient[] = [];

  clients.forEach((c, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const anchorY = rowStartAnchorY + row * rowStepY;

    placed.push({
      ...c,
      x: colX[col],
      y: anchorY,
      col,
      row,
    });
  });

  const lines: ConnectionLine[] = [];
  const junctions: JunctionDot[] = [
    { x: cfg.hubX, y: busY, r: 3 },
    { x: colX[0], y: busY, r: 2.5 },
    { x: colX[1], y: busY, r: 2.5 },
  ];

  // 1. Central vertical stem from hub to bus
  lines.push({
    id: "mobile-stem",
    x1: cfg.hubX,
    y1: stemY1,
    x2: cfg.hubX,
    y2: busY,
    length: busY - stemY1,
    isStatic: true,
  });

  // 2. Horizontal bus bar distributing to both columns
  lines.push({
    id: "mobile-bus",
    x1: colX[0],
    y1: busY,
    x2: colX[1],
    y2: busY,
    length: colX[1] - colX[0],
    isStatic: true,
  });

  // 3. Vertical drops and interconnects per column
  // For row 0: vertical drop from bus into top of client logo card
  // For row r > 0: vertical interconnect from below row (r-1)'s text into top of row r's card
  placed.forEach((c) => {
    const colIndex = c.col || 0;
    const rowIndex = c.row || 0;
    const colCenter = colX[colIndex];
    const cardTopY = c.y - cfg.cardH / 2 - 2;

    if (rowIndex === 0) {
      // Drop from bus bar into top of row 0 card
      const dropStartY = busY;
      const dropLen = cardTopY - dropStartY;
      lines.push({
        id: c.id,
        x1: colCenter,
        y1: dropStartY,
        x2: colCenter,
        y2: cardTopY,
        length: dropLen,
        isStatic: false,
      });
    } else {
      // Interconnect from previous row in the same column
      const prevClient = placed.find((p) => p.col === colIndex && p.row === rowIndex - 1);
      const prevBottomOffset = prevClient?.project
        ? cfg.nameTopOffset + cfg.projectOffset + 14
        : cfg.nameTopOffset + 14;
      const startY = (prevClient?.y || c.y - rowStepY) + prevBottomOffset + 4;
      const linkLen = cardTopY - startY;

      lines.push({
        id: c.id,
        x1: colCenter,
        y1: startY,
        x2: colCenter,
        y2: cardTopY,
        length: Math.max(linkLen, 10),
        isStatic: false,
      });
    }
  });

  return {
    config: cfg,
    clients: placed,
    lines,
    junctions,
  };
}

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */

export default function ClientEcosystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => getLayoutMode());

  // Listen to viewport resize and transition layout mode responsively
  useEffect(() => {
    if (typeof window === "undefined") return;
    let rId: number;
    const handleResize = () => {
      cancelAnimationFrame(rId);
      rId = requestAnimationFrame(() => {
        const nextMode = getLayoutMode();
        setLayoutMode((prev) => (prev !== nextMode ? nextMode : prev));
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(rId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const layout: ComputedLayout = useMemo(() => {
    if (layoutMode === "mobile") {
      return computeMobileLayout(CLIENTS, MOBILE_CFG);
    }
    if (layoutMode === "tablet") {
      return computeRadialLayout(CLIENTS, TABLET_CFG);
    }
    return computeRadialLayout(CLIENTS, DESKTOP_CFG);
  }, [layoutMode]);

  const cfg = layout.config;
  const placed = layout.clients;
  const connData = layout.lines;
  const junctions = layout.junctions;
  const viewBox = `0 0 ${cfg.viewBoxW} ${cfg.viewBoxH}`;
  const aspectRatio = `${cfg.viewBoxW} / ${cfg.viewBoxH}`;

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  /* ───── GSAP ENTRANCE + ORBITAL / PULSE ANIMATION ───── */

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(
        ".ce-header",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ce-header", start: "top 88%", once: true },
        }
      );

      const svgEl = svgRef.current;

      // Concentric rings appear
      gsap.fromTo(
        ".ce-ring",
        { opacity: 0, scale: 0.92, transformOrigin: `${cfg.hubX}px ${cfg.hubY}px` },
        {
          opacity: 1,
          scale: 1,
          duration: 1.0,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ce-viz", start: "top 90%", once: true },
        }
      );

      // Central hub node
      gsap.fromTo(
        ".ce-hub",
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ce-viz", start: "top 90%", once: true },
        }
      );

      // Connection lines stroke-dashoffset draw-on animation
      const lines = gsap.utils.toArray<SVGLineElement>(".ce-conn-line");
      lines.forEach((line, i) => {
        const len = parseFloat(line.dataset.length || "1");
        line.setAttribute("stroke-dasharray", String(len));
        line.setAttribute("stroke-dashoffset", String(len));
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 1.1,
          delay: 0.2 + i * 0.05,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ce-viz", start: "top 90%", once: true },
        });
      });

      // Traveling highlight pulses along connection lines
      if (!reducedMotion && svgEl) {
        const pulses = gsap.utils.toArray<SVGCircleElement>(".ce-conn-pulse");
        pulses.forEach((pulse, i) => {
          const cx1 = parseFloat(pulse.dataset.x1 || "0");
          const cy1 = parseFloat(pulse.dataset.y1 || "0");
          const cx2 = parseFloat(pulse.dataset.x2 || "0");
          const cy2 = parseFloat(pulse.dataset.y2 || "0");
          gsap.to(pulse, {
            motionPath: {
              path: [
                { x: cx1, y: cy1 },
                { x: cx2, y: cy2 },
              ],
              autoRotate: false,
              align: "self",
            },
            duration: 2.8 + (i % 4) * 0.35,
            repeat: -1,
            repeatDelay: 3.2 + (i % 3) * 0.5,
            ease: "power1.inOut",
            delay: 1.2 + i * 0.12,
          });
        });
      }

      // Client nodes entrance staggered
      gsap.fromTo(
        ".ce-client-node",
        { opacity: 0, y: 14, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ce-viz", start: "top 85%", once: true },
        }
      );

      // Subtle orbital micro-movement on desktop & tablet
      if (!reducedMotion && svgEl && cfg.mode !== "mobile") {
        const nodes = gsap.utils.toArray<SVGGElement>(".ce-client-node");
        nodes.forEach((node, i) => {
          const amp = i % 2 === 0 ? 1.5 : 2.0;
          gsap.to(node, {
            x: Math.cos(i * 0.7) * amp,
            y: Math.sin(i * 1.0) * amp,
            duration: 7 + (i % 5),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 2.0 + i * 0.12,
          });
        });

        gsap.to(".ce-hub-glow-ring", {
          opacity: 0.55,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: `${cfg.hubX}px ${cfg.hubY}px`,
        });
      }

      const refresh = setTimeout(() => ScrollTrigger.refresh(), 350);
      return () => clearTimeout(refresh);
    }, section);

    return () => ctx.revert();
  }, [reducedMotion, layout]);

  const isActive = (id: string) => activeId === id;
  const dimOthers = activeId !== null;

  return (
    <section
      id="clients"
      ref={sectionRef}
      className={`client-eco section client-eco--${cfg.mode}`}
      style={{ ["--ce-viz-aspect" as any]: aspectRatio }}
      aria-labelledby="ce-heading"
    >
      <div className="ce-grid-bg" aria-hidden="true" />

      <div className="container">
        <div className="ce-header section-header">
          <div className="section-number">CLIENTS</div>
          <h2 id="ce-heading" className="t-display-md">
            CLIENT ECOSYSTEM
          </h2>
          <div className="section-divider" />
          <p className="t-body" style={{ maxWidth: "520px" }}>
            A network of institutions, developers, and organizations that trust Designtech
            Engineering for their structural challenges.
          </p>
        </div>

        <div
          className="ce-viz"
          role="img"
          aria-label="Designtech Engineering client network with clients connected to Designtech Engineering."
        >
          <div className="ce-viz-inner">
            <svg
              ref={svgRef}
              className="ce-network-svg"
              viewBox={viewBox}
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="ce-hub-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="70%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="100%" stopColor="#EFEBE3" stopOpacity="0.25" />
                </radialGradient>
                <filter id="ce-node-shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#202124" floodOpacity="0.08" />
                </filter>
                <filter id="ce-hub-shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="6" stdDeviation="9" floodColor="#202124" floodOpacity="0.12" />
                </filter>
              </defs>

              {/* ───── CONCENTRIC RINGS ───── */}
              <g className="ce-rings">
                <circle
                  className="ce-ring ce-ring-1 ce-hub-glow-ring"
                  cx={cfg.hubX}
                  cy={cfg.hubY}
                  r={cfg.hubR + (cfg.mode === "mobile" ? 10 : 18)}
                  fill="none"
                  stroke="#A87524"
                  strokeWidth="1"
                  strokeOpacity="0.55"
                />
                {cfg.mode !== "mobile" ? (
                  <>
                    <circle
                      className="ce-ring ce-ring-2"
                      cx={cfg.hubX}
                      cy={cfg.hubY}
                      r={cfg.innerRing || 300}
                      fill="none"
                      stroke="#A87524"
                      strokeWidth="0.8"
                      strokeOpacity="0.28"
                      strokeDasharray="6 12"
                    />
                    <circle
                      className="ce-ring ce-ring-3"
                      cx={cfg.hubX}
                      cy={cfg.hubY}
                      r={cfg.outerRing || 470}
                      fill="none"
                      stroke="#A87524"
                      strokeWidth="0.6"
                      strokeOpacity="0.20"
                      strokeDasharray="1.2 10"
                    />
                  </>
                ) : (
                  <circle
                    className="ce-ring ce-ring-2"
                    cx={cfg.hubX}
                    cy={cfg.hubY}
                    r={cfg.hubR + 24}
                    fill="none"
                    stroke="#A87524"
                    strokeWidth="0.6"
                    strokeOpacity="0.22"
                    strokeDasharray="2 8"
                  />
                )}
              </g>

              {/* ───── CONNECTION LINES + PULSES ───── */}
              <g className="ce-connections">
                {connData.map((d) => {
                  const active = isActive(d.id);
                  const isDimmed = dimOthers && !d.isStatic && !active;
                  return (
                    <line
                      key={`line-${d.id}`}
                      className={`ce-conn-line ${active ? "is-active" : ""} ${
                        isDimmed ? "is-dim" : ""
                      } ${d.isStatic ? "is-bus-line" : ""}`}
                      x1={d.x1}
                      y1={d.y1}
                      x2={d.x2}
                      y2={d.y2}
                      stroke="#A87524"
                      strokeWidth={d.isStatic ? "1.2" : "1"}
                      strokeOpacity={d.isStatic ? "0.45" : "0.35"}
                      data-length={d.length}
                    />
                  );
                })}

                {/* Mobile Bus Junction Dots */}
                {junctions.map((j, idx) => (
                  <circle
                    key={`junction-${idx}`}
                    className="ce-junction-dot"
                    cx={j.x}
                    cy={j.y}
                    r={j.r}
                    fill="#A87524"
                    fillOpacity="0.8"
                  />
                ))}

                {/* Traveling Energy Pulses */}
                {connData.map((d) => {
                  const active = isActive(d.id);
                  const isDimmed = dimOthers && !d.isStatic && !active;
                  return (
                    <circle
                      key={`pulse-${d.id}`}
                      className={`ce-conn-pulse ${active ? "is-active" : ""} ${
                        isDimmed ? "is-dim" : ""
                      }`}
                      r={cfg.mode === "mobile" ? "1.8" : "2.2"}
                      fill="#A87524"
                      fillOpacity="0.85"
                      data-length={d.length}
                      data-x1={d.x1}
                      data-y1={d.y1}
                      data-x2={d.x2}
                      data-y2={d.y2}
                    />
                  );
                })}
              </g>

              {/* ───── HUB NODE (DESIGNTECH ENGINEERING) ───── */}
              <g key="hub-wrap" transform={`translate(${cfg.hubX},${cfg.hubY})`}>
                <g className="ce-hub">
                  <circle r={cfg.hubR + 8} fill="none" stroke="#A87524" strokeOpacity="0.25" strokeWidth="0.6" />
                  <circle r={cfg.hubR} fill="url(#ce-hub-glow)" />
                  <circle r={cfg.hubR} fill="none" stroke="#A87524" strokeWidth="1.3" strokeOpacity="0.92" />
                  <circle r={cfg.hubR - (cfg.mode === "mobile" ? 10 : 16)} fill="none" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.5" />
                  <g stroke="#A87524" strokeOpacity="0.55" strokeWidth="1.2">
                    <line x1="0" y1={-cfg.hubR - 10} x2="0" y2={-cfg.hubR - 2} />
                    <line x1="0" y1={cfg.hubR + 2} x2="0" y2={cfg.hubR + 10} />
                    <line x1={-cfg.hubR - 10} y1="0" x2={-cfg.hubR - 2} y2="0" />
                    <line x1={cfg.hubR + 2} y1="0" x2={cfg.hubR + 10} y2="0" />
                  </g>

                  {/* Center Logo */}
                  <foreignObject
                    x={-(cfg.hubR - (cfg.mode === "mobile" ? 12 : 18))}
                    y={-(cfg.hubR - (cfg.mode === "mobile" ? 12 : 18))}
                    width={(cfg.hubR - (cfg.mode === "mobile" ? 12 : 18)) * 2}
                    height={(cfg.hubR - (cfg.mode === "mobile" ? 12 : 18)) * 2}
                    filter="url(#ce-hub-shadow)"
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={CENTER_LOGO_SRC}
                        alt="Designtech Engineering logo"
                        style={{
                          maxWidth: "90%",
                          maxHeight: "90%",
                          objectFit: "contain",
                          display: "block",
                        }}
                        draggable={false}
                      />
                    </div>
                  </foreignObject>

                  {/* Hub Titles */}
                  <text
                    y={cfg.hubTitleY}
                    textAnchor="middle"
                    fontSize={cfg.hubTitleSize}
                    fontFamily="DM Mono, monospace"
                    fontWeight="600"
                    letterSpacing={cfg.mode === "mobile" ? "2.2" : "3.2"}
                    fill="#A87524"
                  >
                    DESIGNTECH ENGINEERING
                  </text>
                  <text
                    y={cfg.hubSubtitleY}
                    textAnchor="middle"
                    fontSize={cfg.hubSubtitleSize}
                    fontFamily="Manrope, sans-serif"
                    fontWeight="500"
                    letterSpacing={cfg.mode === "mobile" ? "1.2" : "1.6"}
                    fill="#687078"
                  >
                    CIVIL &amp; STRUCTURAL CONSULTANTS
                  </text>
                </g>
              </g>

              {/* ───── CLIENT NODES ───── */}
              {placed.map((c) => {
                const active = isActive(c.id);
                const dim = dimOthers && !active;
                return (
                  <g key={`wrap-${c.id}`} transform={`translate(${c.x},${c.y})`}>
                    <g
                      key={c.id}
                      className={`ce-client-node ${active ? "is-active" : ""} ${dim ? "is-dim" : ""}`}
                      onMouseEnter={() => setActiveId(c.id)}
                      onMouseLeave={() => setActiveId((cur) => (cur === c.id ? null : cur))}
                      onFocus={() => setActiveId(c.id)}
                      onBlur={() => setActiveId((cur) => (cur === c.id ? null : cur))}
                      tabIndex={0}
                      role="listitem"
                      aria-label={`${c.name}. Client of Designtech Engineering.`}
                    >
                      <circle
                        r={Math.max(cfg.cardW, cfg.cardH) / 2 + 12}
                        fill="none"
                        stroke="#A87524"
                        strokeWidth="0.3"
                        strokeOpacity="0.18"
                        strokeDasharray="2 7"
                      />
                      <foreignObject
                        x={-cfg.cardW / 2}
                        y={-cfg.cardH / 2}
                        width={cfg.cardW}
                        height={cfg.cardH}
                        filter="url(#ce-node-shadow)"
                      >
                        <div className="ce-client-logo-wrap">
                          <div className="ce-client-logo-card">
                            <img
                              className="ce-client-logo-img"
                              src={c.logo}
                              alt={`${c.name} logo`}
                              loading="lazy"
                              decoding="async"
                              draggable={false}
                              onError={(e) => {
                                if (!CLIENT_LOGO_FALLBACK_ENABLED) return;
                                const target = e.currentTarget as HTMLImageElement;
                                target.style.display = "none";
                                const parent = target.closest(".ce-client-logo-wrap");
                                if (parent) parent.classList.add("is-fallback");
                              }}
                            />
                            <div className="ce-client-logo-fallback" aria-hidden="true">
                              <svg width="32" height="32" viewBox="0 0 32 32">
                                <rect x="1" y="1" width="30" height="30" rx="2" fill="#F4F1EA" stroke="#A87524" strokeOpacity="0.35" />
                                <path
                                  d="M6 22 L10 14 L14 18 L18 10 L22 16 L26 12"
                                  fill="none"
                                  stroke="#A87524"
                                  strokeOpacity="0.85"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </foreignObject>

                      <g>
                        <text
                          textAnchor="middle"
                          y={cfg.nameTopOffset}
                          fontSize={cfg.nameFontSize}
                          fontFamily="Manrope, sans-serif"
                          fontWeight="600"
                          letterSpacing="0.04em"
                          fill="#202124"
                          className="ce-client-name"
                        >
                          {c.name.toUpperCase()}
                        </text>
                        {c.project ? (
                          <text
                            textAnchor="middle"
                            y={cfg.nameTopOffset + cfg.projectOffset}
                            fontSize={cfg.projectFontSize}
                            fontFamily="DM Mono, monospace"
                            fontWeight="500"
                            letterSpacing="0.10em"
                            fill="#A87524"
                            className="ce-client-project"
                          >
                            {c.project.toUpperCase()}
                          </text>
                        ) : null}
                      </g>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
