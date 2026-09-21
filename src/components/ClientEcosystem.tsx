import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CLIENTS, type ClientItem, CLIENT_LOGO_FALLBACK_ENABLED } from "../data/clients";
import "./ClientEcosystem.css";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────
   CONSTANTS / GEOMETRY — single source of truth.
   Node geometry is shared across all layout modes so that
   logo size / spacing remains consistent regardless of
   desktop vs mobile rendering.
───────────────────────────────────────────────────────────── */

const CENTER_LOGO_SRC = "/Logo.png";

/* Client node bounding box (measured from the node's anchor,
   which is the CENTER of the logo card). Used for rendering
   AND layout math — guaranteed consistent everywhere. */
const NODE = {
  logoCardW: 112,
  logoCardH: 72,
  logoCardPadX: 8, // lateral padding for hover scale / safety
  nameTopOffset: 48, // y from anchor to name baseline
  nameLineH: 16,
  projectOffset: 20, // below name
  projectLineH: 18,
};

const NODE_HALF_W = NODE.logoCardW / 2 + NODE.logoCardPadX; // 64
const NODE_HALF_H = NODE.logoCardH / 2; // 36
const NODE_BOTTOM_NO_PROJECT = NODE.nameTopOffset + NODE.nameLineH + 4; // 68
const NODE_BOTTOM_WITH_PROJECT =
  NODE.nameTopOffset + NODE.nameLineH + NODE.projectOffset + NODE.projectLineH; // 106
const NODE_TOP = -NODE_HALF_H; // -36

const NODE_ROW_GAP = 40; // vertical gap between rows (bottom of one → top of next)
const NODE_COL_GAP = 64; // horizontal gap between columns in hybrid

/* ================== RADIAL LAYOUT (desktop / tablet) ================== */

const RADIAL_VIEWBOX = 1200;
const RCX = RADIAL_VIEWBOX / 2;
const RCY = RADIAL_VIEWBOX / 2;

// Center hub
const HUB_RADIUS = 120;
const HUB_LABEL_CLEARANCE_BELOW = 78;
const HUB_BOTTOM_RADIAL = HUB_RADIUS + HUB_LABEL_CLEARANCE_BELOW;

// Ring geometry
const MIN_CLEARANCE_AFTER_HUB = 60;
const RADIAL_RING_GAP = 170;

const RING_INNER_RADIUS =
  HUB_BOTTOM_RADIAL + MIN_CLEARANCE_AFTER_HUB + -NODE_TOP; // ~ 294
const RING_OUTER_RADIUS = RING_INNER_RADIUS + RADIAL_RING_GAP; // ~ 464
const SINGLE_RING_RADIUS = RING_INNER_RADIUS + 60;

const RING_GROWTH_STEP = 30;

interface RadialPlacement {
  mode: "radial";
  viewBoxW: number;
  viewBoxH: number;
  hubX: number;
  hubY: number;
  clients: Array<
    ClientItem & { x: number; y: number; ring: 1 | 2; angle: number; radius: number }
  >;
}

function minSafeAngleStep(ringRadius: number, anyHasProject: boolean): number {
  const extUp = -NODE_TOP;
  const extDown = anyHasProject ? NODE_BOTTOM_WITH_PROJECT : NODE_BOTTOM_NO_PROJECT;
  const diagonal = Math.sqrt((NODE_HALF_W * 2) ** 2 + (extUp + extDown) ** 2);
  return (diagonal / ringRadius) * 1.6;
}

function placeRadial(clients: ClientItem[]): RadialPlacement {
  const total = clients.length;
  const anyHasProject = clients.some((c) => !!c.project);
  const useTwoRings = total > 8;

  let innerCount = useTwoRings ? Math.ceil(total / 2) : total;
  let outerCount = useTwoRings ? total - innerCount : 0;

  let rInner = RING_INNER_RADIUS;
  let rOuter = RING_OUTER_RADIUS;
  let rSingle = SINGLE_RING_RADIUS;

  const ensureSpacing = (radius: number, count: number): number => {
    if (count <= 1) return radius;
    let r = radius;
    for (let guard = 0; guard < 10; guard++) {
      const minStep = minSafeAngleStep(r, anyHasProject);
      const actualStep = (Math.PI * 2) / count;
      if (actualStep >= minStep) break;
      r += RING_GROWTH_STEP;
    }
    return r;
  };

  rInner = ensureSpacing(rInner, innerCount);
  rOuter = ensureSpacing(rOuter, outerCount);
  rSingle = ensureSpacing(rSingle, innerCount);
  if (useTwoRings && rOuter <= rInner) rOuter = rInner + RADIAL_RING_GAP;

  const placed: RadialPlacement["clients"] = [];
  const placeRing = (
    count: number,
    radius: number,
    ring: 1 | 2,
    startOffset: number
  ) => {
    if (count === 0) return;
    const step = (Math.PI * 2) / count;
    let a = -Math.PI / 2 + startOffset;
    for (let i = 0; i < count; i++) {
      const c = clients[placed.length];
      if (!c) break;
      placed.push({
        ...c,
        x: RCX + radius * Math.cos(a),
        y: RCY + radius * Math.sin(a),
        ring,
        angle: a,
        radius,
      });
      a += step;
    }
  };

  if (!useTwoRings) {
    placeRing(innerCount, rSingle, 1, 0);
  } else {
    placeRing(innerCount, rInner, 1, 0);
    placeRing(outerCount, rOuter, 2, Math.PI / outerCount);
  }

  return {
    mode: "radial",
    viewBoxW: RADIAL_VIEWBOX,
    viewBoxH: RADIAL_VIEWBOX,
    hubX: RCX,
    hubY: RCY,
    clients: placed,
  };
}

/* ================== HYBRID LAYOUT (mobile) ==================
   Hub at top-center. Clients in a 2-column grid below, with
   each client connected by a gold line from the hub.
   Hub labels stay directly below hub logo.
================================================================= */

interface HybridPlacement {
  mode: "hybrid";
  viewBoxW: number;
  viewBoxH: number;
  hubX: number;
  hubY: number;
  clients: Array<ClientItem & { x: number; y: number; ring: 1 | 2; angle: number; radius: number }>;
}

const HYBRID_HUB_RADIUS = 92;

function placeHybrid(clients: ClientItem[], hasProject: boolean): HybridPlacement {
  // Fixed viewBox width fits 2 client nodes + column gap + margins.
  const cellHalfW = NODE_HALF_W + NODE_COL_GAP / 2;
  const viewBoxW = cellHalfW * 4 + 80; // margins L/R
  const hubX = viewBoxW / 2;
  const hubY = HYBRID_HUB_RADIUS + 60;
  const hubBottom = hubY + HYBRID_HUB_RADIUS + 60; // hub labels

  const colX = [
    hubX - (NODE_HALF_W + NODE_COL_GAP / 2),
    hubX + (NODE_HALF_W + NODE_COL_GAP / 2),
  ];

  // Clients are placed row-by-row alternating cols
  const rowHeightFromAnchor =
    -NODE_TOP + (hasProject ? NODE_BOTTOM_WITH_PROJECT : NODE_BOTTOM_NO_PROJECT) +
    NODE_ROW_GAP;

  const placed: HybridPlacement["clients"] = [];
  clients.forEach((c, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const anchorY = hubBottom + NODE_ROW_GAP + row * rowHeightFromAnchor + -NODE_TOP;
    const angle = col === 0 ? Math.PI : 0;
    const radius = Math.hypot(colX[col] - hubX, anchorY - hubY);
    placed.push({
      ...c,
      x: colX[col],
      y: anchorY,
      ring: 1,
      angle,
      radius,
    });
  });

  const lastY =
    placed.length > 0
      ? placed[placed.length - 1].y +
        (hasProject ? NODE_BOTTOM_WITH_PROJECT : NODE_BOTTOM_NO_PROJECT)
      : hubBottom;

  const viewBoxH = Math.max(lastY + 80, 900);

  return {
    mode: "hybrid",
    viewBoxW,
    viewBoxH,
    hubX,
    hubY,
    clients: placed,
  };
}

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */

type Placement = RadialPlacement | HybridPlacement;

export default function ClientEcosystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 768px)").matches
      : false
  );

  /* Match-media for mobile layout switch. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = (ev: MediaQueryListEvent) => setIsMobile(ev.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    setIsMobile(mq.matches);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  const anyHasProject = useMemo(() => CLIENTS.some((c) => !!c.project), []);

  const placement: Placement = useMemo(
    () => (isMobile ? placeHybrid(CLIENTS, anyHasProject) : placeRadial(CLIENTS)),
    [isMobile, anyHasProject]
  );
  const placed = placement.clients;
  const viewBox = `${0} 0 ${placement.viewBoxW} ${placement.viewBoxH}`;
  const HUB_X = placement.hubX;
  const HUB_Y = placement.hubY;
  const HUB_R = placement.mode === "hybrid" ? HYBRID_HUB_RADIUS : HUB_RADIUS;
  const aspectRatio = `${placement.viewBoxW} / ${placement.viewBoxH}`;

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  /* ───── GSAP ENTRANCE + ORBITAL ───── */

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // --- Header ---
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

      // --- Concentric rings appear ---
      gsap.fromTo(
        ".ce-ring",
        { opacity: 0, scale: 0.92, transformOrigin: `${HUB_X}px ${HUB_Y}px` },
        {
          opacity: 1,
          scale: 1,
          duration: 1.0,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ce-viz", start: "top 90%", once: true },
        }
      );

      // --- Central hub node ---
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

      // --- Connection lines: stroke-dashoffset draw-on animation ---
      const lines = gsap.utils.toArray<SVGLineElement>(".ce-conn-line");
      lines.forEach((line, i) => {
        const len = parseFloat(line.dataset.length || "1");
        line.setAttribute("stroke-dasharray", String(len));
        line.setAttribute("stroke-dashoffset", String(len));
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 1.2,
          delay: 0.25 + i * 0.07,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ce-viz", start: "top 90%", once: true },
        });
      });

      // --- Traveling highlight pulse along lines ---
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
            duration: 3.4 + (i % 4) * 0.35,
            repeat: -1,
            repeatDelay: 4.2 + (i % 4) * 0.5,
            ease: "power1.inOut",
            delay: 1.8 + i * 0.2,
          });
        });
      }

      // --- Client nodes enter one-by-one (staggered) ---
      gsap.fromTo(
        ".ce-client-node",
        { opacity: 0, y: 14, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ce-viz", start: "top 85%", once: true },
        }
      );

      // --- Very subtle continuous orbital micro-movement (< 2.5 px) ---
      if (!reducedMotion && svgEl) {
        const nodes = gsap.utils.toArray<SVGGElement>(".ce-client-node");
        nodes.forEach((node, i) => {
          const amp = i % 2 === 0 ? 1.6 : 2.2;
          gsap.to(node, {
            x: Math.cos(i * 0.7) * amp,
            y: Math.sin(i * 1.0) * amp,
            duration: 7 + (i % 5),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 2.2 + i * 0.14,
          });
        });

        gsap.to(".ce-hub-glow-ring", {
          opacity: 0.55,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: `${HUB_X}px ${HUB_Y}px`,
        });
      }

      const refresh = setTimeout(() => ScrollTrigger.refresh(), 400);
      return () => clearTimeout(refresh);
    }, section);

    return () => ctx.revert();
    // Intentionally depend on placement identity so when layout switches
    // between radial / hybrid the animation contexts re-initialize cleanly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, placement]);

  /* ───── CONNECTION LINE DATA — endpoints at EDGES, not centers ───── */

  const connData = useMemo(
    () =>
      placed.map((c) => {
        const dx = c.x - HUB_X;
        const dy = c.y - HUB_Y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const ux = dx / len;
        const uy = dy / len;

        const hubStartR = HUB_R + 6;
        const x1 = HUB_X + ux * hubStartR;
        const y1 = HUB_Y + uy * hubStartR;

        const cardHalfW = NODE.logoCardW / 2;
        const cardHalfH = NODE.logoCardH / 2;
        const tx = Math.abs(ux) < 1e-6 ? Infinity : cardHalfW / Math.abs(ux);
        const ty = Math.abs(uy) < 1e-6 ? Infinity : cardHalfH / Math.abs(uy);
        const rectEdgeDist = Math.min(tx, ty);
        const x2 = c.x - ux * (rectEdgeDist + 2);
        const y2 = c.y - uy * (rectEdgeDist + 2);

        const lineLen = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

        return { id: c.id, x1, y1, x2, y2, length: lineLen };
      }),
    [placed, HUB_X, HUB_Y, HUB_R]
  );

  const isActive = (id: string) => activeId === id;
  const dimOthers = activeId !== null;

  /* ───── RENDER ───── */

  return (
    <section
      id="clients"
      ref={sectionRef}
      className={`client-eco section ${placement.mode === "hybrid" ? "client-eco--hybrid" : "client-eco--radial"}`}
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
          aria-label="Designtech Engineering client network. Designtech Engineering at the center with clients connected around it."
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
                  cx={HUB_X}
                  cy={HUB_Y}
                  r={HUB_R + 18}
                  fill="none"
                  stroke="#A87524"
                  strokeWidth="1"
                  strokeOpacity="0.55"
                />
                {placement.mode === "radial" ? (
                  <>
                    <circle
                      className="ce-ring ce-ring-2"
                      cx={RCX}
                      cy={RCY}
                      r={RING_INNER_RADIUS}
                      fill="none"
                      stroke="#A87524"
                      strokeWidth="0.8"
                      strokeOpacity="0.28"
                      strokeDasharray="6 12"
                    />
                    <circle
                      className="ce-ring ce-ring-3"
                      cx={RCX}
                      cy={RCY}
                      r={RING_OUTER_RADIUS}
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
                    cx={HUB_X}
                    cy={HUB_Y}
                    r={HUB_R + 42}
                    fill="none"
                    stroke="#A87524"
                    strokeWidth="0.6"
                    strokeOpacity="0.22"
                    strokeDasharray="2 10"
                  />
                )}
              </g>

              {/* ───── CONNECTION LINES + PULSES ───── */}
              <g className="ce-connections">
                {connData.map((d) => (
                  <line
                    key={`line-${d.id}`}
                    className={`ce-conn-line ${isActive(d.id) ? "is-active" : ""} ${
                      dimOthers && !isActive(d.id) ? "is-dim" : ""
                    }`}
                    x1={d.x1}
                    y1={d.y1}
                    x2={d.x2}
                    y2={d.y2}
                    stroke="#A87524"
                    strokeWidth="1"
                    strokeOpacity="0.35"
                    data-length={d.length}
                  />
                ))}
                {connData.map((d) => (
                  <circle
                    key={`pulse-${d.id}`}
                    className={`ce-conn-pulse ${isActive(d.id) ? "is-active" : ""} ${
                      dimOthers && !isActive(d.id) ? "is-dim" : ""
                    }`}
                    r="2.2"
                    fill="#A87524"
                    fillOpacity="0.85"
                    data-length={d.length}
                    data-x1={d.x1}
                    data-y1={d.y1}
                    data-x2={d.x2}
                    data-y2={d.y2}
                  />
                ))}
              </g>

              {/* ───── HUB NODE ───── */}
              <g key="hub-wrap" transform={`translate(${HUB_X},${HUB_Y})`}>
                <g className="ce-hub">
                  <circle r={HUB_R + 10} fill="none" stroke="#A87524" strokeOpacity="0.25" strokeWidth="0.6" />
                  <circle r={HUB_R} fill="url(#ce-hub-glow)" />
                  <circle r={HUB_R} fill="none" stroke="#A87524" strokeWidth="1.3" strokeOpacity="0.92" />
                  <circle r={HUB_R - 16} fill="none" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.5" />
                  <g stroke="#A87524" strokeOpacity="0.55" strokeWidth="1.2">
                    <line x1="0" y1={-HUB_R - 12} x2="0" y2={-HUB_R - 2} />
                    <line x1="0" y1={HUB_R + 2} x2="0" y2={HUB_R + 12} />
                    <line x1={-HUB_R - 12} y1="0" x2={-HUB_R - 2} y2="0" />
                    <line x1={HUB_R + 2} y1="0" x2={HUB_R + 12} y2="0" />
                  </g>

                  <foreignObject
                    x={-(HUB_R - 18)}
                    y={-(HUB_R - 18)}
                    width={(HUB_R - 18) * 2}
                    height={(HUB_R - 18) * 2}
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

                  <text
                    y={HUB_R + 30}
                    textAnchor="middle"
                    fontSize="13"
                    fontFamily="DM Mono, monospace"
                    fontWeight="600"
                    letterSpacing="3.2"
                    fill="#A87524"
                  >
                    DESIGNTECH ENGINEERING
                  </text>
                  <text
                    y={HUB_R + 50}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="Manrope, sans-serif"
                    fontWeight="500"
                    letterSpacing="1.6"
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
                        r={Math.max(NODE.logoCardW, NODE.logoCardH) / 2 + 16}
                        fill="none"
                        stroke="#A87524"
                        strokeWidth="0.3"
                        strokeOpacity="0.18"
                        strokeDasharray="2 7"
                      />
                      <foreignObject
                        x={-NODE.logoCardW / 2}
                        y={-NODE.logoCardH / 2}
                        width={NODE.logoCardW}
                        height={NODE.logoCardH}
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
                              <svg width="36" height="36" viewBox="0 0 32 32">
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
                          y={NODE.nameTopOffset}
                          fontSize="11.5"
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
                            y={NODE.nameTopOffset + NODE.projectOffset}
                            fontSize="9.5"
                            fontFamily="DM Mono, monospace"
                            fontWeight="500"
                            letterSpacing="0.12em"
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
