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

// Automatically discover all project images in public/projects/ via Vite's glob import
const rawProjectImages = import.meta.glob<string>(
  "/public/projects/**/*.{jpg,jpeg,png,webp,avif,JPG,PNG,JPEG,WEBP,svg,SVG,mp4,MP4,webm,WEBM,mov,MOV}",
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
  if (!image) return "";
  const trimmed = image.trim();
  if (!trimmed) return "";
  if (!trimmed.startsWith("/projects/")) return trimmed;
  // Return resolved URL or the direct valid public path
  return projectImageUrlMap.get(trimmed.toLowerCase()) || trimmed;
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
  // Check discovered main image
  const discoveredMain = projectImageMap[project.id]?.main;
  if (discoveredMain && discoveredMain.length > 0) {
    return discoveredMain[0];
  }

  // Check explicit mainImage
  const explicit = project.mainImage || project.heroImage;
  if (explicit && explicit.trim().length > 0) {
    const resolved = resolveProjectImage(explicit);
    if (resolved) return resolved;
  }

  // Fallback to first gallery image if main folder is not present
  const discoveredGallery = projectImageMap[project.id]?.gallery;
  if (discoveredGallery && discoveredGallery.length > 0) {
    return discoveredGallery[0];
  }

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
  const discovered = projectImageMap[project.id]?.gallery || [];
  
  // Exclude primary main image from gallery list to prevent duplication
  const primaryImg = getProjectMainImage(project);
  const allGallery = [...new Set([...explicit, ...discovered])];
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
