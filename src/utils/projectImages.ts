/// <reference types="vite/client" />

import type { Project } from "../types/project";

/**
 * Standard folder-based image system for Designtech Engineering:
 * 
 * public/projects/<project-slug>/
 *   ├── main/
 *   │   └── main.jpg (or main.png, main.webp, etc.)
 *   └── gallery/
 *       ├── 01.jpg
 *       └── ...
 */

function resolveProjectImage(image: string): string {
  if (!image) return "";
  const trimmed = image.trim();
  return trimmed;
}

/**
 * Get primary / main image for a project.
 * 
 * Priority:
 * 1. First image inside public/projects/<projectId>/main/
 * 2. Explicit project.mainImage or project.heroImage if specified
 * 3. First valid gallery image if main is absent
 * 4. Empty string if no image exists (clean neutral empty state)
 */
export function getProjectMainImage(project: Project): string {
  // Check explicit mainImage or heroImage
  const explicit = project.mainImage || project.heroImage;
  if (explicit && explicit.trim().length > 0) {
    const resolved = resolveProjectImage(explicit);
    if (resolved) return resolved;
  }

  // Fallback to first gallery image if main is absent
  if (project.gallery && project.gallery.length > 0 && project.gallery[0]) {
    const resolvedGallery = resolveProjectImage(project.gallery[0]);
    if (resolvedGallery) return resolvedGallery;
  }

  return "";
}

/**
 * Alias for backward compatibility.
 */
export const getProjectHeroImage = getProjectMainImage;

/**
 * Get all gallery (secondary) images for a project.
 */
export function getProjectGalleryImages(project: Project): string[] {
  const explicit = (project.gallery || [])
    .map(resolveProjectImage)
    .filter(Boolean);
  
  // Exclude primary main image from gallery list to prevent duplication
  const primaryImg = getProjectMainImage(project);
  const allGallery = [...new Set(explicit)];
  return allGallery.filter((img) => img !== primaryImg);
}

/**
 * Resolves all available images for a project in strict priority:
 * 1. main/ first image (Primary)
 * 2. gallery/* images (Secondary)
 */
export function getProjectAllImages(project: Project): string[] {
  const mainImage = getProjectMainImage(project);
  const galleryImages = getProjectGalleryImages(project);

  const images: string[] = [];
  if (mainImage && mainImage.trim().length > 0) {
    images.push(mainImage);
  }

  galleryImages.forEach((img) => {
    if (img && img.trim().length > 0 && !images.includes(img)) {
      images.push(img);
    }
  });

  // Additional construction/completed images if present
  const extras = [
    ...(project.constructionImages || []),
    ...(project.completedImages || []),
  ];
  extras.forEach((img) => {
    const resolved = img ? resolveProjectImage(img) : "";
    if (resolved && !images.includes(resolved)) {
      images.push(resolved);
    }
  });

  return images;
}

export function getStandardMainPath(projectId: string, ext: string = 'webp'): string {
  return `/projects/${projectId}/main/main.${ext}`;
}

export function getStandardHeroPath(projectId: string, ext: string = 'webp'): string {
  return getStandardMainPath(projectId, ext);
}

export function getStandardGalleryPath(projectId: string, index: number, ext: string = 'webp'): string {
  const pad = String(index).padStart(2, '0');
  return `/projects/${projectId}/gallery/${pad}.${ext}`;
}
