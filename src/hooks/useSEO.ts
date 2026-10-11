import { useEffect } from "react";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface UseSEOOptions {
  title: string;
  description: string;
  path?: string;
  breadcrumbs?: BreadcrumbItem[];
  structuredData?: Record<string, any>;
}

const DOMAIN = "https://designtechengineering.in";
const DEFAULT_IMAGE = `${DOMAIN}/og-image.png`;

function setMetaTag(selector: string, attribute: string, value: string) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    const [attrName, attrVal] = selector
      .replace(/^meta\[/, "")
      .replace(/\]$/, "")
      .split("=");
    const cleanAttr = attrName.trim();
    const cleanVal = attrVal.trim().replace(/^["']|["']$/g, "");
    element.setAttribute(cleanAttr, cleanVal);
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

function setCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

function setJsonLdScript(id: string, data: Record<string, any> | null) {
  const existing = document.getElementById(id);
  if (!data) {
    if (existing) existing.remove();
    return;
  }
  let script = existing as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function useSEO({
  title,
  description,
  path = "",
  breadcrumbs,
  structuredData,
}: UseSEOOptions) {
  useEffect(() => {
    const fullUrl = `${DOMAIN}${path ? (path.startsWith("/") ? path : `/${path}`) : ""}`;

    // 1. Title
    document.title = title;

    // 2. Meta description
    setMetaTag('meta[name="description"]', "content", description);

    // 3. Canonical URL
    setCanonical(fullUrl);

    // 4. Open Graph Tags
    setMetaTag('meta[property="og:title"]', "content", title);
    setMetaTag('meta[property="og:description"]', "content", description);
    setMetaTag('meta[property="og:url"]', "content", fullUrl);
    setMetaTag('meta[property="og:type"]', "content", "website");
    setMetaTag('meta[property="og:image"]', "content", DEFAULT_IMAGE);
    setMetaTag('meta[property="og:image:secure_url"]', "content", DEFAULT_IMAGE);
    setMetaTag('meta[property="og:image:type"]', "content", "image/png");
    setMetaTag('meta[property="og:image:width"]', "content", "1200");
    setMetaTag('meta[property="og:image:height"]', "content", "630");
    setMetaTag('meta[property="og:image:alt"]', "content", "DesignTech Engineering — Civil and Structural Consultants");

    // 5. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', "content", "summary_large_image");
    setMetaTag('meta[name="twitter:title"]', "content", title);
    setMetaTag('meta[name="twitter:description"]', "content", description);
    setMetaTag('meta[name="twitter:url"]', "content", fullUrl);
    setMetaTag('meta[name="twitter:image"]', "content", DEFAULT_IMAGE);
    setMetaTag('meta[name="twitter:image:alt"]', "content", "DesignTech Engineering — Civil and Structural Consultants");

    // 6. BreadcrumbList Structured Data
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbList = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${DOMAIN}/`,
          },
          ...breadcrumbs.map((b, i) => ({
            "@type": "ListItem",
            "position": i + 2,
            "name": b.name,
            "item": `${DOMAIN}${b.path.startsWith("/") ? b.path : `/${b.path}`}`,
          })),
        ],
      };
      setJsonLdScript("seo-breadcrumbs-schema", breadcrumbList);
    } else {
      setJsonLdScript("seo-breadcrumbs-schema", null);
    }

    // 7. Page Specific Structured Data
    if (structuredData) {
      setJsonLdScript("seo-page-schema", structuredData);
    } else {
      setJsonLdScript("seo-page-schema", null);
    }
  }, [title, description, path, breadcrumbs, structuredData]);
}
