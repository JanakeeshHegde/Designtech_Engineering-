import { useState } from "react";
import StructuralInspector3D, { StructuralLayer } from "../3d/StructuralInspector3D";
import type { Project } from "../../data/projects";
import "./Project3DSection.css";

interface Props {
  projects?: Project[];
  onSelectProject?: (project: Project) => void;
}

const LAYERS: { id: StructuralLayer; label: string; desc: string }[] = [
  { id: "complete", label: "COMPLETE SYSTEM", desc: "Integrated RCC / Steel structural frame assembly" },
  { id: "foundation", label: "01. FOUNDATION", desc: "Raft & Isolated Footings designed for soil bearing capacity" },
  { id: "columns", label: "02. RCC COLUMNS", desc: "Vertical load-bearing column grid with ductile detailing" },
  { id: "beams", label: "03. STRUCTURAL BEAMS", desc: "Long-span primary & secondary framing" },
  { id: "slabs", label: "04. FLOOR SLABS", desc: "Two-way reinforced concrete floor diaphragms" },
  { id: "roof", label: "05. ROOF / TRUSS", desc: "Clear-span steel truss & Kalzip industrial/institutional roofing" },
];

export default function Project3DSection({ }: Props) {
  const [activeLayer, setActiveLayer] = useState<StructuralLayer>("complete");

  return (
    <div className="proj-3d-section">
      <div className="proj-3d-header">
        <div className="section-number">STRUCTURAL BIM &amp; CAD VISUALIZATION</div>
        <h2 className="t-heading" style={{ fontSize: "1.75rem", margin: "0.25rem 0 0.5rem" }}>
          INTERACTIVE 3D STRUCTURAL LOAD PATH INSPECTOR
        </h2>
        <p className="t-body" style={{ color: "var(--color-text-secondary)", maxWidth: "680px" }}>
          Explore the structural anatomy applied across our engineering projects. Drag to rotate the 3D model and isolate structural layers from foundation to long-span roof systems.
        </p>
      </div>

      <div className="proj-3d-grid">
        {/* Layer Controls */}
        <div className="proj-3d-controls">
          <div className="proj-3d-ctl-title">SELECT STRUCTURAL LAYER</div>
          <div className="proj-3d-layers-list" role="tablist">
            {LAYERS.map((layer) => (
              <button
                key={layer.id}
                role="tab"
                aria-selected={activeLayer === layer.id}
                className={`proj-3d-layer-btn ${activeLayer === layer.id ? "proj-3d-layer-btn--active" : ""}`}
                onClick={() => setActiveLayer(layer.id)}
              >
                <span className="proj-3d-layer-name">{layer.label}</span>
                <span className="proj-3d-layer-desc">{layer.desc}</span>
              </button>
            ))}
          </div>

          <div className="proj-3d-help">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>Click &amp; drag on the 3D viewport to inspect structural axes.</span>
          </div>
        </div>

        {/* 3D Viewport Frame */}
        <div className="proj-3d-viewport-wrap">
          <div className="proj-3d-viewport-bar">
            <span className="proj-3d-viewport-status">● REAL-TIME WEBGL RENDERING</span>
            <span className="proj-3d-viewport-coord">ACTIVE LAYER: {activeLayer.toUpperCase()}</span>
          </div>
          <div className="proj-3d-canvas-container">
            <StructuralInspector3D activeLayer={activeLayer} className="proj-3d-canvas" />
          </div>
        </div>
      </div>
    </div>
  );
}
