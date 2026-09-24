import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { StructuralLayer } from "../../3d/StructuralInspector3D";
import BIM3DViewer from "../../engineering3d/BIM3DViewer";
import CAD2DViewer from "../../engineering3d/CAD2DViewer";
import "./StructuralInspector.css";

gsap.registerPlugin(ScrollTrigger);

type Layer = StructuralLayer;

const LAYERS: { id: Layer; label: string; desc: string }[] = [
  { id: "foundation", label: "FOUNDATION", desc: "Raft / pile foundations transferring loads to bearing strata." },
  { id: "columns", label: "COLUMNS", desc: "Vertical load-bearing elements — RC or steel, as required." },
  { id: "beams", label: "BEAMS", desc: "Horizontal spanning members connecting columns at each level." },
  { id: "slabs", label: "SLABS", desc: "Floor and roof slabs spanning between beams — flat or ribbed." },
  { id: "roof", label: "ROOF", desc: "Roof structure — RCC, steel truss, or composite system." },
  { id: "complete", label: "COMPLETE", desc: "Fully assembled structural frame — ready for construction." },
];

export default function StructuralInspector() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeLayer, setActiveLayer] = useState<Layer>("foundation");
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");

  const activateLayer = (layer: Layer) => {
    setActiveLayer(layer);
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

          {/* Canvas Viewport (3D Interactive Model / 2D CAD Schematic) */}
          <div className="si-canvas" aria-label="Structural model visualization">
            {/* View Mode Toggle */}
            <div className="si-toggle-bar">
              <button
                className={`si-toggle-btn ${viewMode === "3d" ? "si-toggle-btn--active" : ""}`}
                onClick={() => setViewMode("3d")}
                aria-label="3D Model View"
              >
                3D BIM MODEL
              </button>
              <button
                className={`si-toggle-btn ${viewMode === "2d" ? "si-toggle-btn--active" : ""}`}
                onClick={() => setViewMode("2d")}
                aria-label="2D CAD Schematic View"
              >
                2D CAD SCHEMATIC
              </button>
            </div>

            <div className="si-viewport-container">
              {viewMode === "3d" ? (
                <BIM3DViewer activeLayer={activeLayer} className="si-3d-box" />
              ) : (
                <CAD2DViewer activeLayer={activeLayer} className="si-3d-box" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
