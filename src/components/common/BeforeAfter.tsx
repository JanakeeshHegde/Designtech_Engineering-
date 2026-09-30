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
  const [beforeError, setBeforeError] = useState(false);
  const [afterError, setAfterError] = useState(false);

  return (
    <div className="ba-comparison">
      {/* After image (full width) */}
      <div className="ba-container" role="group" aria-label={`Before and after comparison: ${beforeLabel} vs ${afterLabel}`}>
        <div className="ba-after">
          {!afterError && (
          <img src={afterSrc} alt={afterLabel} draggable={false} onError={() => setAfterError(true)} />
          )}
        </div>

        {/* Before image (clipped) */}
        <div
          className="ba-before"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {!beforeError && (
          <img src={beforeSrc} alt={beforeLabel} draggable={false} onError={() => setBeforeError(true)} />
          )}
        </div>
      </div>

      <div className="ba-captions" aria-hidden="true">
        <span>{beforeLabel}</span>
        <span>{afterLabel}</span>
      </div>
      <input
        className="ba-range"
        type="range"
        min="0"
        max="100"
        value={position}
        aria-label={`Compare ${beforeLabel} and ${afterLabel}`}
        onChange={(event) => setPosition(Number(event.target.value))}
      />
    </div>
  );
}
