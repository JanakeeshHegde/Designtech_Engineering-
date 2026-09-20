import { useState } from "react";
import "./BeforeAfter.css";

interface Props {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfter({ beforeSrc, afterSrc, beforeLabel = "CONSTRUCTION", afterLabel = "COMPLETED" }: Props) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [beforeError, setBeforeError] = useState(false);
  const [afterError, setAfterError] = useState(false);

  const updatePosition = (clientX: number, rect: DOMRect) => {
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  };

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updatePosition(e.clientX, e.currentTarget.getBoundingClientRect());
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    updatePosition(touch.clientX, e.currentTarget.getBoundingClientRect());
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    updatePosition(e.clientX, e.currentTarget.getBoundingClientRect());
  };

  const FallbackImage = ({ label }: { label: string }) => (
    <div className="ba-fallback img-fallback">
      <span className="t-label">{label}</span>
      <span className="t-label" style={{ opacity: 0.4, marginTop: "0.5rem" }}>IMAGE PENDING</span>
    </div>
  );

  return (
    <div
      className="ba-container"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      onClick={handleClick}
      role="img"
      aria-label={`Before and after comparison: ${beforeLabel} vs ${afterLabel}`}
    >
      {/* After image (full width) */}
      <div className="ba-after">
        {afterError ? (
          <FallbackImage label={afterLabel} />
        ) : (
          <img src={afterSrc} alt={afterLabel} draggable={false} onError={() => setAfterError(true)} />
        )}
        <div className="ba-label ba-label--after">{afterLabel}</div>
      </div>

      {/* Before image (clipped) */}
      <div
        className="ba-before"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {beforeError ? (
          <FallbackImage label={beforeLabel} />
        ) : (
          <img src={beforeSrc} alt={beforeLabel} draggable={false} onError={() => setBeforeError(true)} />
        )}
        <div className="ba-label ba-label--before">{beforeLabel}</div>
      </div>

      {/* Divider */}
      <div
        className="ba-divider"
        style={{ left: `${position}%` }}
        aria-hidden="true"
      >
        <div className="ba-handle">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 10l-4 0M14 10l4 0M6 10l4-4M6 10l4 4M14 10l-4-4M14 10l-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
