import "./ProjectTechnicalOverlay.css";

interface Props {
  projectNumber?: string;
  category?: string;
  className?: string;
}

export default function ProjectTechnicalOverlay({ projectNumber, category, className = "" }: Props) {
  return (
    <div className={`tech-overlay ${className}`} aria-hidden="true">
      {/* CAD Corner Crosshairs */}
      <div className="tech-corner tech-corner--tl">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M0 8h8M8 0v8" stroke="currentColor" strokeWidth="1" />
          <circle cx="8" cy="8" r="1.5" fill="currentColor" />
        </svg>
      </div>
      <div className="tech-corner tech-corner--tr">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M24 8h-8M16 0v8" stroke="currentColor" strokeWidth="1" />
          <circle cx="16" cy="8" r="1.5" fill="currentColor" />
        </svg>
      </div>
      <div className="tech-corner tech-corner--bl">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M0 16h8M8 24v-8" stroke="currentColor" strokeWidth="1" />
          <circle cx="8" cy="16" r="1.5" fill="currentColor" />
        </svg>
      </div>
      <div className="tech-corner tech-corner--br">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M24 16h-8M16 24v-8" stroke="currentColor" strokeWidth="1" />
          <circle cx="16" cy="16" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Datum Coordinate Stamp */}
      {projectNumber && (
        <div className="tech-stamp">
          <span className="tech-stamp-code">DWG-REF: DT-{projectNumber}</span>
          {category && <span className="tech-stamp-cat">[{category.toUpperCase()}]</span>}
        </div>
      )}

      {/* Subtle Dimension Line Indicator */}
      <div className="tech-axis tech-axis--x">
        <span className="tech-axis-tick">|</span>
        <span className="tech-axis-line"></span>
        <span className="tech-axis-label">STRUCTURAL AXIS X-X</span>
        <span className="tech-axis-line"></span>
        <span className="tech-axis-tick">|</span>
      </div>
    </div>
  );
}
