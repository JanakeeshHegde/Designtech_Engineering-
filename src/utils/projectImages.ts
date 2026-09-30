/// <reference types="vite/client" />

import type { Project } from "../types/project";

/**
 * Standard folder-based image system for Designtech Engineering:
 * 
 * public/projects/<project-slug>/
 *   ├── main/
 *   │   └── main.webp (or main.jpg, main.png, or first uploaded main image)
 *   └── gallery/
 *       ├── 01.webp (or .jpg, .png)
 *       ├── 02.webp
 *       └── ...
 */

// Automatically discover all project images in public/projects/ via Vite's glob import
const rawProjectImages = import.meta.glob<string>(
  "/public/projects/**/*.{jpg,jpeg,png,webp,avif,JPG,PNG,JPEG,WEBP,svg,SVG}",
  { eager: true, query: "?url", import: "default" }
);

// Map of projectId -> { main: string[]; gallery: string[]; all: string[] }
const projectImageMap: Record<string, { main: string[]; gallery: string[]; all: string[] }> = {};
const projectImageUrlMap = new Map<string, string>();

for (const path in rawProjectImages) {
  // Path format: "/public/projects/<projectId>/<folder>/<fileName>"
  const match = path.match(/^\/public\/projects\/([^/]+)\/(main|hero|gallery)\/(.+)$/i);
  if (match) {
    const [, projectId, folder] = match;
    const webUrl = path.replace(/^\/public/, "");
    
    if (!projectImageMap[projectId]) {
      projectImageMap[projectId] = { main: [], gallery: [], all: [] };
    }

    const folderLower = folder.toLowerCase();
    if (folderLower === "main" || folderLower === "hero") {
      projectImageMap[projectId].main.push(webUrl);
    } else if (folderLower === "gallery") {
      projectImageMap[projectId].gallery.push(webUrl);
    }
    projectImageMap[projectId].all.push(webUrl);
    projectImageUrlMap.set(webUrl.toLowerCase(), webUrl);
  }
}

function resolveProjectImage(image: string): string {
  const trimmed = image.trim();
  if (!trimmed.startsWith("/projects/")) return trimmed;
  return projectImageUrlMap.get(trimmed.toLowerCase()) || "";
}

/**
 * Get primary / main image for a project.
 * 
 * Priority:
 * 1. Explicit project.mainImage or project.heroImage if specified
 * 2. First valid image inside public/projects/<projectId>/main/
 * 3. Empty string if no main image exists (preserves clean neutral empty CAD state)
 */
export function getProjectMainImage(project: Project): string {
  const explicit = project.mainImage || project.heroImage;
  if (explicit && explicit.trim().length > 0) {
    const resolved = resolveProjectImage(explicit);
    if (resolved) return resolved;
  }
  const discoveredMain = projectImageMap[project.id]?.main;
  if (discoveredMain && discoveredMain.length > 0) {
    return discoveredMain[0];
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
  const discovered = projectImageMap[project.id]?.gallery || [];
  return [...new Set([...explicit, ...discovered])];
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
