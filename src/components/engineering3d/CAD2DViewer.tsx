import type { StructuralLayerId } from "./StructuralModel";
import "./CAD2DViewer.css";

interface Props {
  activeLayer: StructuralLayerId;
  className?: string;
}

export default function CAD2DViewer({ activeLayer, className = "" }: Props) {
  return (
    <div
      className={`cad-viewer-container ${className}`}
      role="region"
      aria-label="2D CAD Structural Engineering Schematic"
    >
      {/* Top CAD Status Bar */}
      <div className="cad-top-bar">
        <div className="cad-status-tag">
          <span className="cad-live-dot" />
          <span>2D CAD SCHEMATIC &bull; {activeLayer.toUpperCase()} SPECIFICATION</span>
        </div>
        <div className="cad-scale-tag">
          {activeLayer === "complete" || activeLayer === "foundation" ? "SCALE 1:100" : "SCALE 1:50"}
        </div>
      </div>

      {/* SVG Vector Drawing Canvas — Auto-fitted to full container */}
      <div className="cad-drawing-viewport">
        <svg
          viewBox="0 0 940 620"
          preserveAspectRatio="xMidYMid meet"
          className="cad-svg-sheet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Engineering Soil Hatch Patterns */}
            <pattern id="cad-hatch-sand" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="0.75" fill="#a87524" opacity="0.4" />
              <circle cx="9" cy="9" r="0.75" fill="#a87524" opacity="0.4" />
            </pattern>
            <pattern id="cad-hatch-clay" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="16" stroke="#8a4724" strokeWidth="1" opacity="0.3" />
            </pattern>
            <pattern id="cad-hatch-rock" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0 10 L 10 0 M 10 20 L 20 10" stroke="#5c5044" strokeWidth="1" opacity="0.35" />
            </pattern>
            <pattern id="cad-hatch-bedrock" width="16" height="16" patternTransform="rotate(-45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="16" stroke="#1e2229" strokeWidth="1.5" opacity="0.45" />
            </pattern>
            {/* Concrete Hatch Pattern */}
            <pattern id="cad-hatch-concrete" width="14" height="14" patternUnits="userSpaceOnUse">
              <polygon points="2,2 4,6 1,7" fill="#64748b" opacity="0.25" />
              <polygon points="9,9 12,8 10,12" fill="#64748b" opacity="0.25" />
              <circle cx="7" cy="3" r="0.5" fill="#64748b" opacity="0.25" />
            </pattern>
          </defs>

          {/* Engineering Drawing Border Frame */}
          <rect x="20" y="15" width="900" height="590" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="26" y="21" width="888" height="578" fill="none" stroke="#e2e8f0" strokeWidth="0.75" />

          {/* Drawing Corner Marks */}
          <line x1="20" y1="35" x2="35" y2="35" stroke="#94a3b8" strokeWidth="1" />
          <line x1="35" y1="20" x2="35" y2="35" stroke="#94a3b8" strokeWidth="1" />
          <line x1="920" y1="35" x2="905" y2="35" stroke="#94a3b8" strokeWidth="1" />
          <line x1="905" y1="20" x2="905" y2="35" stroke="#94a3b8" strokeWidth="1" />

          {/* ========================================================
              STAGE 1: FOUNDATION SPECIFIC 2D SCHEMATIC
             ======================================================== */}
          {activeLayer === "foundation" && (
            <g className="cad-stage-foundation">
              {/* Header Title */}
              <text x="50" y="48" fill="#a87524" fontSize="11" fontFamily="DM Mono, monospace" fontWeight="700">
                FOUNDATION DETAIL &bull; RAFT &amp; BORED PILE SUBSTRUCTURE
              </text>
              <text x="50" y="64" fill="#64748b" fontSize="8" fontFamily="DM Mono, monospace">
                SOIL STRATIGRAPHY &bull; DEEP BORED PILES &bull; RCC MAT SLAB &bull; HARD BEARING STRATA
              </text>

              {/* Datum elevation levels (Right side) */}
              <g className="cad-datums">
                {[
                  { y: 110, label: "GROUND LEVEL (GL)", val: "±0.00m" },
                  { y: 170, label: "COMPACTED SAND BED", val: "-2.20m" },
                  { y: 270, label: "STIFF SILTY CLAY", val: "-7.50m" },
                  { y: 390, label: "WEATHERED ROCK", val: "-10.50m" },
                  { y: 520, label: "HARD BEARING BEDROCK", val: "-14.00m" },
                ].map((datum, i) => (
                  <g key={i}>
                    <line x1="680" y1={datum.y} x2="890" y2={datum.y} stroke="#a87524" strokeWidth="0.75" strokeDasharray="4,2" />
                    <polygon points={`680,${datum.y} 690,${datum.y - 4} 690,${datum.y + 4}`} fill="#a87524" />
                    <text x="698" y={datum.y - 2} fill="#1a202c" fontSize="8" fontFamily="DM Mono, monospace" fontWeight="700">
                      {datum.val}
                    </text>
                    <text x="698" y={datum.y + 9} fill="#64748b" fontSize="7" fontFamily="DM Mono, monospace">
                      {datum.label}
                    </text>
                  </g>
                ))}
              </g>

              {/* Subsoil Strata Layers */}
              <rect x="50" y="110" width="620" height="60" fill="url(#cad-hatch-sand)" stroke="#cb9f5e" strokeWidth="0.8" />
              <text x="60" y="145" fill="#a87524" fontSize="8" fontFamily="DM Mono, monospace">LAYER 1: COMPACTED GRANULAR SAND (-2.20m)</text>

              <rect x="50" y="170" width="620" height="100" fill="url(#cad-hatch-sand)" stroke="#b5894b" strokeWidth="0.8" />
              <text x="60" y="225" fill="#a87524" fontSize="8" fontFamily="DM Mono, monospace">LAYER 2: MEDIUM DENSE SAND (-4.50m)</text>

              <rect x="50" y="270" width="620" height="120" fill="url(#cad-hatch-clay)" stroke="#8a4724" strokeWidth="0.8" />
              <text x="60" y="335" fill="#8a4724" fontSize="8" fontFamily="DM Mono, monospace" fontWeight="600">LAYER 3: STIFF SILTY CLAY (-7.50m)</text>

              <rect x="50" y="390" width="620" height="130" fill="url(#cad-hatch-rock)" stroke="#5c5044" strokeWidth="0.8" />
              <text x="60" y="455" fill="#5c5044" fontSize="8" fontFamily="DM Mono, monospace">LAYER 4: WEATHERED ROCK STRATUM (-10.50m)</text>

              <rect x="50" y="520" width="620" height="60" fill="url(#cad-hatch-bedrock)" stroke="#1e2229" strokeWidth="1.5" />
              <text x="60" y="555" fill="#1e2229" fontSize="9" fontFamily="DM Mono, monospace" fontWeight="700">LAYER 5: HARD BEARING STRATA (BEDROCK -14.00m)</text>

              {/* Bored Concrete Piles */}
              {[190, 360, 530].map((px, i) => (
                <g key={i}>
                  <rect x={px - 20} y="160" width="40" height="360" fill="url(#cad-hatch-concrete)" stroke="#a87524" strokeWidth="1.8" />
                  <line x1={px - 14} y1="160" x2={px - 14} y2="520" stroke="#1a202c" strokeWidth="1" strokeDasharray="4,3" />
                  <line x1={px + 14} y1="160" x2={px + 14} y2="520" stroke="#1a202c" strokeWidth="1" strokeDasharray="4,3" />
                  {/* Bedrock Socket Toe */}
                  <path d={`M ${px - 20} 520 L ${px} 535 L ${px + 20} 520 Z`} fill="#a87524" fillOpacity="0.25" stroke="#a87524" strokeWidth="1.5" />
                  <text x={px} y="350" textAnchor="middle" fill="#a87524" fontSize="7.5" fontFamily="DM Mono, monospace" fontWeight="700">
                    Ø1200mm PILE P{i + 1}
                  </text>
                  <text x={px} y="365" textAnchor="middle" fill="#1a202c" fontSize="6.5" fontFamily="DM Mono, monospace">
                    8×T25 + T10@150
                  </text>
                </g>
              ))}

              {/* Raft Foundation Slab */}
              <rect x="75" y="100" width="570" height="60" fill="url(#cad-hatch-concrete)" stroke="#a87524" strokeWidth="2.2" />
              <line x1="85" y1="110" x2="635" y2="110" stroke="#1a202c" strokeWidth="1.5" strokeDasharray="5,2" />
              <line x1="85" y1="150" x2="635" y2="150" stroke="#1a202c" strokeWidth="1.5" strokeDasharray="5,2" />
              <text x="360" y="135" textAnchor="middle" fill="#a87524" fontSize="9" fontFamily="DM Mono, monospace" fontWeight="700">
                RCC RAFT FOUNDATION SLAB (t = 1350mm) &bull; 2×T20@150 c/c (TOP &amp; BTM)
              </text>

              {/* Column Stubs */}
              {[120, 270, 450, 600].map((cx, i) => (
                <g key={i}>
                  <rect x={cx - 16} y="68" width="32" height="32" fill="url(#cad-hatch-concrete)" stroke="#a87524" strokeWidth="1.5" />
                  <text x={cx} y="88" textAnchor="middle" fill="#1a202c" fontSize="7" fontFamily="DM Mono, monospace" fontWeight="700">C{i + 1}</text>
                </g>
              ))}
            </g>
          )}

          {/* ========================================================
              STAGE 2: COLUMNS SPECIFIC 2D SCHEMATIC
             ======================================================== */}
          {activeLayer === "columns" && (
            <g className="cad-stage-columns">
              <text x="50" y="48" fill="#a87524" fontSize="11" fontFamily="DM Mono, monospace" fontWeight="700">
                COLUMN LAYOUT GRID &amp; CROSS-SECTION SCHEDULE
              </text>
              <text x="50" y="64" fill="#64748b" fontSize="8" fontFamily="DM Mono, monospace">
                REINFORCED CONCRETE COLUMNS (950×950mm) &bull; AXIAL LOAD TRANSFER TO RAFT
              </text>

              {/* Column Grid Axes */}
              {[
                { x: 120, name: "1" },
                { x: 260, name: "2" },
                { x: 420, name: "3" },
                { x: 560, name: "4" },
              ].map((grid, i) => (
                <g key={i}>
                  <line x1={grid.x} y1="75" x2={grid.x} y2="520" stroke="#a87524" strokeWidth="0.75" strokeDasharray="6,4,2,4" opacity="0.5" />
                  <circle cx={grid.x} cy="70" r="11" fill="#fff" stroke="#a87524" strokeWidth="1" />
                  <text x={grid.x} y="74" textAnchor="middle" fill="#a87524" fontSize="9" fontFamily="DM Mono, monospace" fontWeight="700">{grid.name}</text>
                </g>
              ))}

              {/* Raft foundation slab at bottom */}
              <rect x="70" y="500" width="540" height="50" fill="url(#cad-hatch-concrete)" stroke="#a87524" strokeWidth="1.8" />
              <text x="340" y="530" textAnchor="middle" fill="#a87524" fontSize="8" fontFamily="DM Mono, monospace" fontWeight="700">
                RCC RAFT FOUNDATION (-1.35m TO ±0.00m)
              </text>

              {/* Elevation Columns */}
              {[120, 260, 420, 560].map((cx, i) => (
                <g key={i}>
                  {/* Column Shaft */}
                  <rect x={cx - 18} y="95" width="36" height="405" fill="url(#cad-hatch-concrete)" stroke="#a87524" strokeWidth="2" />
                  {/* Rebar lines inside column */}
                  <line x1={cx - 12} y1="95" x2={cx - 12} y2="500" stroke="#1a202c" strokeWidth="1.2" strokeDasharray="5,2" />
                  <line x1={cx + 12} y1="95" x2={cx + 12} y2="500" stroke="#1a202c" strokeWidth="1.2" strokeDasharray="5,2" />
                  {/* Starter lap dowels in raft */}
                  <line x1={cx - 12} y1="500" x2={cx - 12} y2="535" stroke="#1a202c" strokeWidth="1.2" />
                  <line x1={cx + 12} y1="500" x2={cx + 12} y2="535" stroke="#1a202c" strokeWidth="1.2" />
                  {/* Downward Load Vector */}
                  <line x1={cx} y1="60" x2={cx} y2="88" stroke="#eab308" strokeWidth="2.5" />
                  <polygon points={`${cx},93 ${cx - 4},82 ${cx + 4},82`} fill="#eab308" />
                  <text x={cx} y="495" textAnchor="middle" fill="#1a202c" fontSize="7" fontFamily="DM Mono, monospace" fontWeight="700">
                    C{i + 1}
                  </text>
                </g>
              ))}

              {/* Floor Level lines */}
              <line x1="80" y1="210" x2="600" y2="210" stroke="#a87524" strokeWidth="1" strokeDasharray="4,2" opacity="0.6" />
              <text x="610" y="213" fill="#a87524" fontSize="7.5" fontFamily="DM Mono, monospace" fontWeight="600">LEVEL 2 (+6.60m)</text>

              <line x1="80" y1="350" x2="600" y2="350" stroke="#a87524" strokeWidth="1" strokeDasharray="4,2" opacity="0.6" />
              <text x="610" y="353" fill="#a87524" fontSize="7.5" fontFamily="DM Mono, monospace" fontWeight="600">LEVEL 1 (+3.40m)</text>

              <line x1="80" y1="500" x2="600" y2="500" stroke="#a87524" strokeWidth="1.5" />
              <text x="610" y="503" fill="#a87524" fontSize="8" fontFamily="DM Mono, monospace" fontWeight="700">FOUNDATION (±0.00m)</text>

              {/* Detailed Column Section Callout (Right side) */}
              <g transform="translate(680, 200)">
                <rect x="0" y="0" width="200" height="200" fill="#fff" stroke="#a87524" strokeWidth="1.5" />
                <rect x="25" y="25" width="150" height="150" fill="url(#cad-hatch-concrete)" stroke="#1a202c" strokeWidth="2" />
                {/* 8 Main rebars */}
                {[
                  [42, 42], [100, 42], [158, 42],
                  [42, 100], [158, 100],
                  [42, 158], [100, 158], [158, 158]
                ].map(([rx, ry], idx) => (
                  <circle key={idx} cx={rx} cy={ry} r="6" fill="#1a202c" />
                ))}
                {/* Tie link with 135 deg seismic hooks */}
                <rect x="34" y="34" width="132" height="132" fill="none" stroke="#a87524" strokeWidth="1.5" strokeDasharray="4,1" />
                <text x="100" y="-10" textAnchor="middle" fill="#a87524" fontSize="8.5" fontFamily="DM Mono, monospace" fontWeight="700">COLUMN SECTION C1-C8</text>
                <text x="100" y="190" textAnchor="middle" fill="#1a202c" fontSize="7.5" fontFamily="DM Mono, monospace">950×950mm (8×T25 + T10@150)</text>
              </g>
            </g>
          )}

          {/* ========================================================
              STAGE 3: BEAMS SPECIFIC 2D SCHEMATIC
             ======================================================== */}
          {activeLayer === "beams" && (
            <g className="cad-stage-beams">
              <text x="50" y="48" fill="#a87524" fontSize="11" fontFamily="DM Mono, monospace" fontWeight="700">
                BEAM FRAMING PLAN &amp; REINFORCEMENT PROFILE
              </text>
              <text x="50" y="64" fill="#64748b" fontSize="8" fontFamily="DM Mono, monospace">
                HORIZONTAL SPANNING MEMBERS (500×500mm) &bull; MOMENT-RESISTING FRAME
              </text>

              {/* Level 2 Beam Profile */}
              <g transform="translate(60, 110)">
                <rect x="20" y="0" width="560" height="38" fill="url(#cad-hatch-concrete)" stroke="#a87524" strokeWidth="2" />
                {/* Top rebar */}
                <line x1="30" y1="8" x2="570" y2="8" stroke="#1a202c" strokeWidth="1.5" />
                {/* Bottom rebar */}
                <line x1="30" y1="30" x2="570" y2="30" stroke="#1a202c" strokeWidth="1.5" />
                {/* Stirrup shear links */}
                {[40, 70, 100, 140, 190, 240, 290, 340, 390, 440, 480, 520, 550].map((sx, idx) => (
                  <line key={idx} x1={sx} y1="6" x2={sx} y2="32" stroke="#a87524" strokeWidth="1.2" />
                ))}
                <text x="300" y="-10" textAnchor="middle" fill="#a87524" fontSize="8.5" fontFamily="DM Mono, monospace" fontWeight="700">
                  LEVEL 2 PRIMARY FRAME BEAM PB1-PB4 (500×500mm) @ +6.60m
                </text>
              </g>

              {/* Level 1 Beam Profile */}
              <g transform="translate(60, 230)">
                <rect x="20" y="0" width="560" height="38" fill="url(#cad-hatch-concrete)" stroke="#a87524" strokeWidth="2" />
                <line x1="30" y1="8" x2="570" y2="8" stroke="#1a202c" strokeWidth="1.5" />
                <line x1="30" y1="30" x2="570" y2="30" stroke="#1a202c" strokeWidth="1.5" />
                {[40, 70, 100, 140, 190, 240, 290, 340, 390, 440, 480, 520, 550].map((sx, idx) => (
                  <line key={idx} x1={sx} y1="6" x2={sx} y2="32" stroke="#a87524" strokeWidth="1.2" />
                ))}
                <text x="300" y="-10" textAnchor="middle" fill="#a87524" fontSize="8.5" fontFamily="DM Mono, monospace" fontWeight="700">
                  LEVEL 1 PRIMARY FRAME BEAM PB5-PB8 (500×500mm) @ +3.40m
                </text>
              </g>

              {/* Supporting Column Stubs */}
              {[100, 240, 400, 540].map((cx, i) => (
                <g key={i}>
                  <rect x={cx - 14} y="90" width="28" height="360" fill="url(#cad-hatch-concrete)" stroke="#a87524" strokeWidth="1" opacity="0.35" />
                  <text x={cx} y="470" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="DM Mono, monospace">COL C{i + 1}</text>
                </g>
              ))}

              {/* Beam Cross Section Detail */}
              <g transform="translate(680, 120)">
                <rect x="0" y="0" width="200" height="200" fill="#fff" stroke="#a87524" strokeWidth="1.5" />
                <rect x="35" y="35" width="130" height="130" fill="url(#cad-hatch-concrete)" stroke="#1a202c" strokeWidth="2" />
                {/* 4 Corner bars + 2 mid */}
                <circle cx="50" cy="50" r="5" fill="#1a202c" />
                <circle cx="150" cy="50" r="5" fill="#1a202c" />
                <circle cx="50" cy="150" r="5" fill="#1a202c" />
                <circle cx="150" cy="150" r="5" fill="#1a202c" />
                {/* Stirrup link */}
                <rect x="42" y="42" width="116" height="116" fill="none" stroke="#a87524" strokeWidth="1.5" />
                <text x="100" y="190" textAnchor="middle" fill="#1a202c" fontSize="8" fontFamily="DM Mono, monospace" fontWeight="700">
                  BEAM SECTION 500×500mm
                </text>
                <text x="100" y="206" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="DM Mono, monospace">
                  4×T20 TOP &amp; BTM + T10@150
                </text>
              </g>

              {/* Moment connection notes */}
              <g transform="translate(80, 370)">
                <rect x="0" y="0" width="540" height="85" fill="rgba(168, 117, 36, 0.05)" stroke="#a87524" strokeWidth="1" strokeDasharray="3,3" />
                <text x="20" y="25" fill="#a87524" fontSize="8" fontFamily="DM Mono, monospace" fontWeight="700">MOMENT-RESISTING FRAME CONNECTIONS:</text>
                <text x="20" y="45" fill="#1a202c" fontSize="7.5" fontFamily="DM Mono, monospace">&bull; Rigid monolithic joints at beam-column junctions for lateral stability</text>
                <text x="20" y="65" fill="#1a202c" fontSize="7.5" fontFamily="DM Mono, monospace">&bull; Top tension reinforcement continuous through column core with standard 90° anchorage</text>
              </g>
            </g>
          )}

          {/* ========================================================
              STAGE 4: SLABS SPECIFIC 2D SCHEMATIC
             ======================================================== */}
          {activeLayer === "slabs" && (
            <g className="cad-stage-slabs">
              <text x="50" y="48" fill="#a87524" fontSize="11" fontFamily="DM Mono, monospace" fontWeight="700">
                FLOOR SLAB LAYOUT &amp; TWO-WAY REINFORCEMENT PLAN
              </text>
              <text x="50" y="64" fill="#64748b" fontSize="8" fontFamily="DM Mono, monospace">
                220mm REINFORCED CONCRETE TWO-WAY SLABS SPANNING BETWEEN BEAMS
              </text>

              {/* Slab Panel S1 */}
              <g transform="translate(60, 95)">
                <rect x="0" y="0" width="230" height="320" fill="rgba(168, 117, 36, 0.08)" stroke="#a87524" strokeWidth="2" />
                {/* Two-way span arrows */}
                <line x1="115" y1="40" x2="115" y2="280" stroke="#a87524" strokeWidth="1.5" />
                <polygon points="115,35 111,45 119,45" fill="#a87524" />
                <polygon points="115,285 111,275 119,275" fill="#a87524" />

                <line x1="30" y1="160" x2="200" y2="160" stroke="#a87524" strokeWidth="1.5" />
                <polygon points="25,160 35,156 35,164" fill="#a87524" />
                <polygon points="205,160 195,156 195,164" fill="#a87524" />

                <text x="115" y="145" textAnchor="middle" fill="#a87524" fontSize="10" fontFamily="DM Mono, monospace" fontWeight="700">SLAB PANEL S1</text>
                <text x="115" y="180" textAnchor="middle" fill="#1a202c" fontSize="7.5" fontFamily="DM Mono, monospace">t = 220mm RC SLAB</text>
                <text x="115" y="195" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="DM Mono, monospace">T12@150 c/c (B&amp;T)</text>
              </g>

              {/* Slab Panel S2 */}
              <g transform="translate(320, 95)">
                <rect x="0" y="0" width="230" height="320" fill="rgba(168, 117, 36, 0.08)" stroke="#a87524" strokeWidth="2" />
                <line x1="115" y1="40" x2="115" y2="280" stroke="#a87524" strokeWidth="1.5" />
                <polygon points="115,35 111,45 119,45" fill="#a87524" />
                <polygon points="115,285 111,275 119,275" fill="#a87524" />

                <line x1="30" y1="160" x2="200" y2="160" stroke="#a87524" strokeWidth="1.5" />
                <polygon points="25,160 35,156 35,164" fill="#a87524" />
                <polygon points="205,160 195,156 195,164" fill="#a87524" />

                <text x="115" y="145" textAnchor="middle" fill="#a87524" fontSize="10" fontFamily="DM Mono, monospace" fontWeight="700">SLAB PANEL S2</text>
                <text x="115" y="180" textAnchor="middle" fill="#1a202c" fontSize="7.5" fontFamily="DM Mono, monospace">t = 220mm RC SLAB</text>
                <text x="115" y="195" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="DM Mono, monospace">T12@150 c/c (B&amp;T)</text>
              </g>

              {/* Slab Panel S3 */}
              <g transform="translate(580, 95)">
                <rect x="0" y="0" width="230" height="320" fill="rgba(168, 117, 36, 0.08)" stroke="#a87524" strokeWidth="2" />
                <line x1="115" y1="40" x2="115" y2="280" stroke="#a87524" strokeWidth="1.5" />
                <polygon points="115,35 111,45 119,45" fill="#a87524" />
                <polygon points="115,285 111,275 119,275" fill="#a87524" />

                <line x1="30" y1="160" x2="200" y2="160" stroke="#a87524" strokeWidth="1.5" />
                <polygon points="25,160 35,156 35,164" fill="#a87524" />
                <polygon points="205,160 195,156 195,164" fill="#a87524" />

                <text x="115" y="145" textAnchor="middle" fill="#a87524" fontSize="10" fontFamily="DM Mono, monospace" fontWeight="700">SLAB PANEL S3</text>
                <text x="115" y="180" textAnchor="middle" fill="#1a202c" fontSize="7.5" fontFamily="DM Mono, monospace">t = 220mm RC SLAB</text>
                <text x="115" y="195" textAnchor="middle" fill="#64748b" fontSize="6.5" fontFamily="DM Mono, monospace">T12@150 c/c (B&amp;T)</text>
              </g>

              {/* Slab Section Detail (Bottom) */}
              <g transform="translate(60, 450)">
                <rect x="0" y="0" width="750" height="70" fill="#fff" stroke="#a87524" strokeWidth="1.5" />
                <rect x="20" y="20" width="710" height="30" fill="url(#cad-hatch-concrete)" stroke="#1a202c" strokeWidth="1.5" />
                {/* Top and Bottom Mesh in section */}
                <line x1="30" y1="26" x2="720" y2="26" stroke="#1a202c" strokeWidth="1.2" strokeDasharray="6,2" />
                <line x1="30" y1="44" x2="720" y2="44" stroke="#1a202c" strokeWidth="1.2" strokeDasharray="6,2" />
                <text x="375" y="12" textAnchor="middle" fill="#a87524" fontSize="8" fontFamily="DM Mono, monospace" fontWeight="700">
                  TYPICAL SLAB CROSS-SECTION DETAIL (t = 220mm &bull; 25mm NOMINAL COVER)
                </text>
              </g>
            </g>
          )}

          {/* ========================================================
              STAGE 5: ROOF SPECIFIC 2D SCHEMATIC
             ======================================================== */}
          {activeLayer === "roof" && (
            <g className="cad-stage-roof">
              <text x="50" y="48" fill="#a87524" fontSize="11" fontFamily="DM Mono, monospace" fontWeight="700">
                ROOF STRUCTURE &bull; STEEL TRUSS &amp; COMPOSITE DECK
              </text>
              <text x="50" y="64" fill="#64748b" fontSize="8" fontFamily="DM Mono, monospace">
                PRATT STEEL ROOF TRUSS (18.00m SPAN) &bull; RF +10.25m APEX LEVEL
              </text>

              {/* Main Roof Truss Elevation */}
              <g transform="translate(60, 100)">
                {/* Top Chords (Pitched Rafters) */}
                <line x1="40" y1="180" x2="380" y2="35" stroke="#a87524" strokeWidth="3.2" />
                <line x1="380" y1="35" x2="720" y2="180" stroke="#a87524" strokeWidth="3.2" />
                {/* Bottom Tie Chord */}
                <line x1="40" y1="180" x2="720" y2="180" stroke="#a87524" strokeWidth="3" />
                {/* Central King Post */}
                <line x1="380" y1="35" x2="380" y2="180" stroke="#a87524" strokeWidth="2.5" />

                {/* Diagonal & Vertical Web Members (Left) */}
                <line x1="125" y1="144" x2="125" y2="180" stroke="#a87524" strokeWidth="1.8" />
                <line x1="125" y1="144" x2="210" y2="180" stroke="#a87524" strokeWidth="1.8" />
                <line x1="210" y1="108" x2="210" y2="180" stroke="#a87524" strokeWidth="1.8" />
                <line x1="210" y1="108" x2="295" y2="180" stroke="#a87524" strokeWidth="1.8" />
                <line x1="295" y1="72" x2="295" y2="180" stroke="#a87524" strokeWidth="1.8" />
                <line x1="295" y1="72" x2="380" y2="180" stroke="#a87524" strokeWidth="1.8" />

                {/* Diagonal & Vertical Web Members (Right) */}
                <line x1="635" y1="144" x2="635" y2="180" stroke="#a87524" strokeWidth="1.8" />
                <line x1="635" y1="144" x2="550" y2="180" stroke="#a87524" strokeWidth="1.8" />
                <line x1="550" y1="108" x2="550" y2="180" stroke="#a87524" strokeWidth="1.8" />
                <line x1="550" y1="108" x2="465" y2="180" stroke="#a87524" strokeWidth="1.8" />
                <line x1="465" y1="72" x2="465" y2="180" stroke="#a87524" strokeWidth="1.8" />
                <line x1="465" y1="72" x2="380" y2="180" stroke="#a87524" strokeWidth="1.8" />

                {/* Longitudinal Purlins */}
                {[
                  { x: 125, y: 144 }, { x: 210, y: 108 }, { x: 295, y: 72 }, { x: 380, y: 35 },
                  { x: 465, y: 72 }, { x: 550, y: 108 }, { x: 635, y: 144 }
                ].map((pt, idx) => (
                  <rect key={idx} x={pt.x - 5} y={pt.y - 10} width="10" height="8" fill="#1e293b" stroke="#a87524" strokeWidth="1" />
                ))}

                {/* Standing Seam Roof Deck */}
                <path d="M 30 176 L 380 28 L 730 176" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="6,3" />

                {/* Truss Nodes (Gusset Plates) */}
                {[
                  [40, 180], [125, 144], [210, 108], [295, 72], [380, 35],
                  [465, 72], [550, 108], [635, 144], [720, 180],
                  [125, 180], [210, 180], [295, 180], [380, 180], [465, 180], [550, 180], [635, 180]
                ].map(([nx, ny], idx) => (
                  <circle key={idx} cx={nx} cy={ny} r="4.5" fill="#1a202c" stroke="#a87524" strokeWidth="1.2" />
                ))}

                <text x="380" y="20" textAnchor="middle" fill="#a87524" fontSize="9" fontFamily="DM Mono, monospace" fontWeight="700">
                  RIDGE APEX LEVEL RF +10.25m &bull; SLOPE 17.3°
                </text>

                {/* Supporting Column heads with Base Plates */}
                <rect x="25" y="180" width="30" height="80" fill="url(#cad-hatch-concrete)" stroke="#a87524" strokeWidth="1.5" />
                <rect x="20" y="176" width="40" height="6" fill="#1e293b" stroke="#a87524" strokeWidth="1" />
                <text x="40" y="235" textAnchor="middle" fill="#1a202c" fontSize="7" fontFamily="DM Mono, monospace">COL C1</text>

                <rect x="705" y="180" width="30" height="80" fill="url(#cad-hatch-concrete)" stroke="#a87524" strokeWidth="1.5" />
                <rect x="700" y="176" width="40" height="6" fill="#1e293b" stroke="#a87524" strokeWidth="1" />
                <text x="720" y="235" textAnchor="middle" fill="#1a202c" fontSize="7" fontFamily="DM Mono, monospace">COL C4</text>
              </g>

              {/* Roof Purlin & Connection Specification Table (Bottom) */}
              <g transform="translate(60, 390)">
                <rect x="40" y="0" width="680" height="120" fill="rgba(168, 117, 36, 0.05)" stroke="#a87524" strokeWidth="1" />
                <text x="60" y="25" fill="#a87524" fontSize="8.5" fontFamily="DM Mono, monospace" fontWeight="700">PRATT ROOF TRUSS STRUCTURAL SPECIFICATIONS:</text>
                <text x="60" y="50" fill="#1a202c" fontSize="7.5" fontFamily="DM Mono, monospace">&bull; Top &amp; Bottom Chords: Structural Hollow Sections (RHS 180×120×8mm &amp; RHS 160×120×6mm)</text>
                <text x="60" y="70" fill="#1a202c" fontSize="7.5" fontFamily="DM Mono, monospace">&bull; Web Members: SHS 80×80×5mm welded to 12mm Gusset Plates with E7018 Structural Fillet Welds</text>
                <text x="60" y="90" fill="#1a202c" fontSize="7.5" fontFamily="DM Mono, monospace">&bull; Purlin Spacing: 1200mm c/c with sag rods anchoring standing-seam insulated composite roof deck</text>
              </g>
            </g>
          )}

          {/* ========================================================
              STAGE 6: COMPLETE MASTER STRUCTURAL SCHEMATIC
             ======================================================== */}
          {activeLayer === "complete" && (
            <g className="cad-stage-complete">
              <text x="50" y="48" fill="#a87524" fontSize="11" fontFamily="DM Mono, monospace" fontWeight="700">
                MASTER STRUCTURAL FRAME ELEVATION &bull; COMPLETE BIM ASSEMBLY
              </text>
              <text x="50" y="64" fill="#64748b" fontSize="8" fontFamily="DM Mono, monospace">
                INTEGRATED CIVIL &amp; STRUCTURAL SYSTEM &bull; FOUNDATION TO ROOF FRAME
              </text>

              {/* Structural Grid Axes */}
              {[
                { x: 170, name: "1" },
                { x: 330, name: "2" },
                { x: 510, name: "3" },
                { x: 670, name: "4" },
              ].map((grid, i) => (
                <g key={i}>
                  <line x1={grid.x} y1="35" x2={grid.x} y2="570" stroke="#a87524" strokeWidth="0.75" strokeDasharray="6,4,2,4" opacity="0.4" />
                  <circle cx={grid.x} cy="28" r="11" fill="#fff" stroke="#a87524" strokeWidth="1" />
                  <text x={grid.x} y="32" textAnchor="middle" fill="#a87524" fontSize="9" fontFamily="DM Mono, monospace" fontWeight="700">{grid.name}</text>
                </g>
              ))}

              {/* Datum Elevation Levels (Right) */}
              <g className="cad-datum-levels" opacity="0.85">
                {[
                  { y: 50, label: "RIDGE APEX LEVEL", val: "+10.25m" },
                  { y: 90, label: "EAVES / TOP OF COLUMN", val: "+8.15m" },
                  { y: 170, label: "LEVEL 2 BEAM / SLAB", val: "+6.60m" },
                  { y: 265, label: "LEVEL 1 BEAM / SLAB", val: "+3.40m" },
                  { y: 360, label: "GROUND LEVEL (GL)", val: "±0.00m" },
                  { y: 410, label: "RAFT FOUNDATION BASE", val: "-1.35m" },
                  { y: 490, label: "STIFF SILTY CLAY", val: "-7.50m" },
                  { y: 575, label: "HARD BEARING BEDROCK", val: "-14.00m" },
                ].map((datum, i) => (
                  <g key={i}>
                    <line x1="720" y1={datum.y} x2="890" y2={datum.y} stroke="#a87524" strokeWidth="0.75" strokeDasharray="4,2" />
                    <polygon points={`720,${datum.y} 730,${datum.y - 4} 730,${datum.y + 4}`} fill="#a87524" />
                    <text x="738" y={datum.y - 2} fill="#1a202c" fontSize="7.5" fontFamily="DM Mono, monospace" fontWeight="700">
                      {datum.val}
                    </text>
                    <text x="738" y={datum.y + 7} fill="#64748b" fontSize="6.5" fontFamily="DM Mono, monospace">
                      {datum.label}
                    </text>
                  </g>
                ))}
              </g>

              {/* Subsoil Strata Layers */}
              <rect x="110" y="360" width="600" height="50" fill="url(#cad-hatch-sand)" stroke="#cb9f5e" strokeWidth="0.75" />
              <rect x="110" y="410" width="600" height="80" fill="url(#cad-hatch-clay)" stroke="#8a4724" strokeWidth="0.75" />
              <rect x="110" y="490" width="600" height="50" fill="url(#cad-hatch-rock)" stroke="#5c5044" strokeWidth="0.75" />
              <rect x="110" y="540" width="600" height="40" fill="url(#cad-hatch-bedrock)" stroke="#1e2229" strokeWidth="1.2" />

              {/* Bored Piles */}
              {[330, 510, 670].map((px, i) => (
                <g key={i}>
                  <rect x={px - 16} y="410" width="32" height="150" fill="url(#cad-hatch-concrete)" stroke="#a87524" strokeWidth="1.5" />
                  <path d={`M ${px - 16} 560 L ${px} 570 L ${px + 16} 560 Z`} fill="#a87524" fillOpacity="0.2" stroke="#a87524" strokeWidth="1.2" />
                </g>
              ))}

              {/* Raft Foundation */}
              <rect x="140" y="360" width="550" height="50" fill="url(#cad-hatch-concrete)" stroke="#a87524" strokeWidth="2" />

              {/* Columns C1 to C4 */}
              {[170, 330, 510, 670].map((cx, i) => (
                <rect key={i} x={cx - 14} y="90" width="28" height="270" fill="url(#cad-hatch-concrete)" stroke="#a87524" strokeWidth="1.5" />
              ))}

              {/* Beams */}
              <rect x="156" y="260" width="528" height="20" fill="url(#cad-hatch-concrete)" stroke="#a87524" strokeWidth="1.2" />
              <rect x="156" y="165" width="528" height="20" fill="url(#cad-hatch-concrete)" stroke="#a87524" strokeWidth="1.2" />

              {/* Floor Slabs */}
              <rect x="184" y="255" width="132" height="10" fill="#a87524" fillOpacity="0.15" stroke="#a87524" strokeWidth="0.75" />
              <rect x="344" y="255" width="152" height="10" fill="#a87524" fillOpacity="0.15" stroke="#a87524" strokeWidth="0.75" />
              <rect x="524" y="255" width="132" height="10" fill="#a87524" fillOpacity="0.15" stroke="#a87524" strokeWidth="0.75" />

              <rect x="184" y="160" width="132" height="10" fill="#a87524" fillOpacity="0.15" stroke="#a87524" strokeWidth="0.75" />
              <rect x="344" y="160" width="152" height="10" fill="#a87524" fillOpacity="0.15" stroke="#a87524" strokeWidth="0.75" />
              <rect x="524" y="160" width="132" height="10" fill="#a87524" fillOpacity="0.15" stroke="#a87524" strokeWidth="0.75" />

              {/* Complete Pratt Roof Truss Assembly */}
              <g className="cad-complete-roof">
                {/* Top Chords */}
                <line x1="156" y1="90" x2="420" y2="48" stroke="#a87524" strokeWidth="2.5" />
                <line x1="420" y1="48" x2="684" y2="90" stroke="#a87524" strokeWidth="2.5" />
                {/* Bottom Tie Chord */}
                <line x1="156" y1="90" x2="684" y2="90" stroke="#a87524" strokeWidth="2.2" />
                {/* Central King Post */}
                <line x1="420" y1="48" x2="420" y2="90" stroke="#a87524" strokeWidth="1.8" />
                {/* Web Members */}
                <line x1="244" y1="76" x2="244" y2="90" stroke="#a87524" strokeWidth="1.2" />
                <line x1="244" y1="76" x2="332" y2="90" stroke="#a87524" strokeWidth="1.2" />
                <line x1="332" y1="62" x2="332" y2="90" stroke="#a87524" strokeWidth="1.2" />
                <line x1="332" y1="62" x2="420" y2="90" stroke="#a87524" strokeWidth="1.2" />

                <line x1="596" y1="76" x2="596" y2="90" stroke="#a87524" strokeWidth="1.2" />
                <line x1="596" y1="76" x2="508" y2="90" stroke="#a87524" strokeWidth="1.2" />
                <line x1="508" y1="62" x2="508" y2="90" stroke="#a87524" strokeWidth="1.2" />
                <line x1="508" y1="62" x2="420" y2="90" stroke="#a87524" strokeWidth="1.2" />

                {/* Standing seam roof deck outline */}
                <path d="M 148 87 L 420 43 L 692 87" fill="none" stroke="#2563eb" strokeWidth="1.5" />
              </g>

              {/* Dimension string below */}
              <g className="cad-dimensions" opacity="0.65">
                <line x1="170" y1="595" x2="670" y2="595" stroke="#1a202c" strokeWidth="0.75" />
                <line x1="170" y1="590" x2="170" y2="600" stroke="#1a202c" strokeWidth="1" />
                <line x1="670" y1="590" x2="670" y2="600" stroke="#1a202c" strokeWidth="1" />
                <text x="420" y="591" textAnchor="middle" fill="#1a202c" fontSize="7.5" fontFamily="DM Mono, monospace" fontWeight="600">
                  TOTAL SPAN: 18,000mm (18.00m)
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* CAD Bottom Status Footer */}
      <div className="cad-footer-bar">
        <span className="cad-footer-text">
          ACTIVE COMPONENT: <strong className="cad-highlight">{activeLayer.toUpperCase()}</strong>
        </span>
        <span className="cad-footer-scale">ORTHOGRAPHIC ENGINEERING PROJECTION &bull; CIVIL &amp; STRUCTURAL CAD</span>
      </div>
    </div>
  );
}
