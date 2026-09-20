import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./StructuralInspector.css";

gsap.registerPlugin(ScrollTrigger);

type Layer = "foundation" | "columns" | "beams" | "slabs" | "roof" | "complete";

const LAYERS: { id: Layer; label: string; desc: string }[] = [
  { id: "foundation", label: "FOUNDATION", desc: "Raft / pile foundations transferring loads to bearing strata." },
  { id: "columns", label: "COLUMNS", desc: "Vertical load-bearing elements — RC or steel, as required." },
  { id: "beams", label: "BEAMS", desc: "Horizontal spanning members connecting columns at each level." },
  { id: "slabs", label: "SLABS", desc: "Floor and roof slabs spanning between beams — flat or ribbed." },
  { id: "roof", label: "ROOF", desc: "Roof structure — RCC, steel truss, or composite system." },
  { id: "complete", label: "COMPLETE", desc: "Fully assembled structural frame — ready for construction." },
];

const LAYER_ORDER: Layer[] = ["foundation", "columns", "beams", "slabs", "roof", "complete"];

export default function StructuralInspector() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeLayer, setActiveLayer] = useState<Layer>("foundation");
  const svgRef = useRef<SVGSVGElement>(null);

  const activateLayer = (layer: Layer) => {
    setActiveLayer(layer);
    const idx = LAYER_ORDER.indexOf(layer);

    // Animate each layer
    LAYER_ORDER.forEach((l, i) => {
      const el = document.getElementById(`si-layer-${l}`);
      if (!el) return;

      const isVisible = layer === "complete" || i <= idx;
      const isActive = l === layer;

      gsap.to(el, {
        opacity: isVisible ? (isActive ? 1 : 0.5) : 0.05,
        y: isVisible ? 0 : 20,
        duration: 0.5,
        ease: "power2.out",
        delay: i * 0.05,
      });
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".si-header", { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: ".si-header", start: "top 80%" },
      });

      gsap.fromTo(".si-btn", { opacity: 0, x: -20 }, {
        opacity: 1, x: 0, stagger: 0.07, duration: 0.5,
        scrollTrigger: { trigger: ".si-controls", start: "top 75%" },
      });

      gsap.fromTo(".si-canvas", { opacity: 0, scale: 0.97 }, {
        opacity: 1, scale: 1, duration: 0.8,
        scrollTrigger: { trigger: ".si-canvas", start: "top 70%" },
      });

      // Initialize foundation visible
      setTimeout(() => activateLayer("foundation"), 500);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="structural-inspector" ref={sectionRef} className="si section" aria-labelledby="si-heading">
      <div className="container">
        <div className="si-header section-header">
          <div className="section-number">INSPECT</div>
          <h2 id="si-heading" className="t-display-md">INSPECT THE STRUCTURE</h2>
          <div className="section-divider" />
          <p className="t-body" style={{ maxWidth: "460px" }}>
            Explore the structural assembly layer by layer. Select any component to understand its role in the complete system.
          </p>
        </div>

        <div className="si-layout">
          {/* Controls */}
          <div className="si-controls" role="group" aria-label="Structural layer controls">
            {LAYERS.map((layer) => (
              <button
                key={layer.id}
                className={`si-btn ${activeLayer === layer.id ? "si-btn--active" : ""}`}
                onClick={() => activateLayer(layer.id)}
                aria-pressed={activeLayer === layer.id}
              >
                <span className="si-btn-dot" aria-hidden="true" />
                <span className="si-btn-label">{layer.label}</span>
              </button>
            ))}

            <div className="si-info-panel" aria-live="polite">
              <div className="si-detail-label">COMPONENT DETAIL</div>
              <div className="si-info-title">
                {LAYERS.find((l) => l.id === activeLayer)?.label}
              </div>
              <div className="si-info-desc t-body">
                {LAYERS.find((l) => l.id === activeLayer)?.desc}
              </div>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="si-canvas" aria-label="Structural model visualization">

            <svg ref={svgRef} viewBox="0 0 480 480" fill="none" className="si-svg">
              {/* Ground */}
              <line x1="40" y1="430" x2="440" y2="430" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4,4" />
              <text x="10" y="435" fill="#A87524" fontSize="8" fontFamily="DM Mono,monospace" opacity="0.3">GL</text>

              {/* Foundation */}
              <g id="si-layer-foundation" opacity="0.05">
                <rect x="80" y="390" width="320" height="40" stroke="#A87524" strokeWidth="1.5" fill="rgba(168, 117, 36,0.08)" />
                <rect x="100" y="405" width="60" height="25" stroke="#A87524" strokeWidth="1" fill="rgba(168, 117, 36,0.05)" strokeDasharray="2,2" />
                <rect x="210" y="405" width="60" height="25" stroke="#A87524" strokeWidth="1" fill="rgba(168, 117, 36,0.05)" strokeDasharray="2,2" />
                <rect x="320" y="405" width="60" height="25" stroke="#A87524" strokeWidth="1" fill="rgba(168, 117, 36,0.05)" strokeDasharray="2,2" />
                <text x="90" y="387" fill="#A87524" fontSize="8" fontFamily="DM Mono,monospace" opacity="0.6">FOUNDATION / RAFT</text>
              </g>

              {/* Columns */}
              <g id="si-layer-columns" opacity="0.05">
                {[120, 240, 360].map((x, i) => (
                  <g key={i}>
                    <rect x={x - 6} y="100" width="12" height="290" stroke="#A87524" strokeWidth="1" fill="rgba(168, 117, 36,0.12)" />
                    <text x={x - 12} y="95" fill="#A87524" fontSize="7" fontFamily="DM Mono,monospace" opacity="0.5">C{i+1}</text>
                  </g>
                ))}
              </g>

              {/* Beams */}
              <g id="si-layer-beams" opacity="0.05">
                {[390, 300, 210, 130].map((y, i) => (
                  <g key={i}>
                    <rect x="110" y={y} width="260" height="10" stroke="#A87524" strokeWidth="1" fill="rgba(168, 117, 36,0.1)" />
                    <text x="46" y={y + 8} fill="#A87524" fontSize="7" fontFamily="DM Mono,monospace" opacity="0.4">L{i + 1}</text>
                  </g>
                ))}
              </g>

              {/* Slabs */}
              <g id="si-layer-slabs" opacity="0.05">
                {[310, 220, 140].map((y, i) => (
                  <rect key={i} x="110" y={y} width="260" height="80" stroke="#A87524" strokeWidth="0.5" fill="rgba(168, 117, 36,0.04)" strokeDasharray="3,3" />
                ))}
              </g>

              {/* Roof */}
              <g id="si-layer-roof" opacity="0.05">
                <path d="M 100 130 L 240 70 L 380 130" stroke="#A87524" strokeWidth="2" fill="rgba(168, 117, 36,0.08)" />
                <line x1="240" y1="70" x2="240" y2="130" stroke="#A87524" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3,3" />
                <text x="200" y="65" fill="#A87524" fontSize="7" fontFamily="DM Mono,monospace" opacity="0.6">ROOF TRUSS</text>
              </g>

              {/* Complete highlight box */}
              <g id="si-layer-complete" opacity="0.05">
                <rect x="90" y="65" width="300" height="365" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.3" fill="none" strokeDasharray="6,6" />
                <text x="360" y="85" fill="#A87524" fontSize="7" fontFamily="DM Mono,monospace" opacity="0.5">COMPLETE</text>
              </g>

              {/* Static dimension lines */}
              <line x1="440" y1="100" x2="440" y2="430" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="2,4" />
              <line x1="435" y1="100" x2="445" y2="100" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.2" />
              <line x1="435" y1="430" x2="445" y2="430" stroke="#A87524" strokeWidth="0.5" strokeOpacity="0.2" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
