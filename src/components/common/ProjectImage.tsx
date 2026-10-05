import React, { useState } from "react";
import type { Project } from "../../types/project";
import { getProjectMainImage, getStandardMainPath } from "../../utils/projectImages";

interface ProjectImageProps {
  project?: Project;
  src?: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
  fallback?: React.ReactNode;
}

export default function ProjectImage({
  project,
  src,
  alt,
  className = "",
  loading = "lazy",
  fallback,
}: ProjectImageProps) {
  const [hasError, setHasError] = useState(false);

  // Determine image source: passed explicitly, or project main image, or standard folder path
  const imageSrc =
    src ||
    (project ? getProjectMainImage(project) : "") ||
    (project?.id ? getStandardMainPath(project.id) : "");

  const altText = alt || (project ? `${project.title} structural elevation` : "Project view");

  if (!imageSrc || hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default neutral engineering CAD drafting visual
    return (
      <div className={`proj-cs-drafting-canvas ${className}`} aria-hidden="true">
        <svg className="proj-cs-drafting-svg" viewBox="0 0 480 330" fill="none">
          <defs>
            <pattern
              id={`proj-grid-${project?.id || "fallback"}`}
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(168,117,36,0.08)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#proj-grid-${project?.id || "fallback"})`} />

          {/* Structural Framing Outline */}
          <rect
            x="35"
            y="35"
            width="410"
            height="260"
            stroke="rgba(168,117,36,0.3)"
            strokeWidth="1"
            strokeDasharray="6 4"
            fill="rgba(168,117,36,0.02)"
          />
          <rect x="55" y="55" width="370" height="220" stroke="rgba(24,25,28,0.08)" strokeWidth="0.8" fill="none" />

          {/* Axis Crosshairs */}
          <line x1="240" y1="20" x2="240" y2="310" stroke="rgba(168,117,36,0.2)" strokeWidth="0.8" strokeDasharray="4 4" />
          <line x1="20" y1="165" x2="460" y2="165" stroke="rgba(168,117,36,0.2)" strokeWidth="0.8" strokeDasharray="4 4" />

          {/* Structural Center Watermark & Metadata */}
          <circle cx="240" cy="165" r="45" stroke="rgba(168,117,36,0.25)" strokeWidth="1" />
          <circle cx="240" cy="165" r="38" stroke="rgba(168,117,36,0.15)" strokeWidth="0.5" strokeDasharray="3 3" />

          <text
            x="240"
            y="160"
            fill="var(--color-gold, #A87524)"
            fontSize="11"
            fontFamily="Plus Jakarta Sans, sans-serif"
            fontWeight="700"
            textAnchor="middle"
            letterSpacing="0.1em"
          >
            {project?.number || "000"}
          </text>
          <text
            x="240"
            y="176"
            fill="var(--color-text-secondary, #5A6270)"
            fontSize="7.5"
            fontFamily="Plus Jakarta Sans, sans-serif"
            textAnchor="middle"
            letterSpacing="0.08em"
          >
            {(project?.category || "ARCHIVE").toUpperCase()} // STRUCTURAL RECORD
          </text>

          {/* Bottom Sheet Spec Marker */}
          <text x="425" y="265" fill="var(--color-gold, #A87524)" fontSize="7" fontFamily="Plus Jakarta Sans, sans-serif" textAnchor="end">
            STRUCTURAL RECORD
          </text>
        </svg>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={altText}
      loading={loading}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
