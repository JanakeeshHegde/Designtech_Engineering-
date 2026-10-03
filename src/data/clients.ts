/* ============================================================
   CLIENT DATA — DESIGNTECH ENGINEERING CLIENT ECOSYSTEM
   ============================================================
 */

import type { ClientItem } from "../types/client";

export type { ClientItem };

export const CLIENTS: ClientItem[] = [
  {
    id: "KSCA",
    name: "Karnataka State Cricket Association",
    logo: "/Clients/client 1.jpeg",
    project: "Sports Gallery & Convention Centre",
  },
  {
    id: "BGS WORLD SCHOOL",
    name: "BGS World School",
    logo: "/Clients/client 2.png",
    project: "Educational Institution",
  },
  {
    id: "CMR GROUP OF INSTITUTIONS",
    name: "CMR Group of Institutions",
    logo: "/Clients/client 3.jpeg",
    project: "PU College & Sports Arena",
  },
  {
    id: "MALABAR GOLD & DIAMONDS",
    name: "Malabar Gold & Diamonds",
    logo: "/Clients/client 4.png",
    project: "Commercial Showroom",
  },
  {
    id: "TGI GRAND FORTUNA",
    name: "TGI Grand Fortuna",
    logo: "/Clients/client 5.png",
    project: "Hospitality Landmark",
  },
  {
    id: "HOTEL COUNTRY INN",
    name: "Hotel Country Inn",
    logo: "/Clients/client 6.png",
    project: "Luxury Hotel (B2+G+5)",
  },
  {
    id: "SERVICE BEFORE SELF",
    name: "Service Before Self School",
    logo: "/Clients/client 7.jpeg",
    project: "Educational Campus",
  },
  {
    id: "SMPL",
    name: "Shree Mahabaleshwara Promoters",
    logo: "/Clients/client 8.jpeg",
    project: "Residential & Infrastructure",
  },
  {
    id: "PALLIKOODAM",
    name: "Pallikoodam",
    logo: "/Clients/client 9.jpeg",
    project: "Institutional Campus",
  },
  {
    id: "CADABAMS DIAGNOSTICS",
    name: "Cadabam's Diagnostics",
    logo: "/Clients/client 10.png",
    project: "Healthcare Facility",
  },
  {
    id: "ST JOSEPHS INSTITUTION",
    name: "St. Joseph's Institution",
    logo: "/Clients/client 11.jpeg",
    project: "Multi Activity Centre (22m Span)",
  },
  {
    id: "SOUTHERN TRAVELS",
    name: "Southern Travels",
    logo: "/Clients/client 12.jpeg",
    project: "Corporate & Hospitality Facility",
  },
  {
    id: "LM WIND POWER",
    name: "LM Wind Power (GE Renewable Energy)",
    logo: "/Clients/client 13.png",
    project: "Renewable Energy & Industrial Facilities",
  },
  {
    id: "VELSON RUBBER PRODUCTS",
    name: "Velson Rubber Products",
    logo: "/Clients/client 14.png",
    project: "Industrial Manufacturing Facility",
  },
  {
    id: "KALYANI POLYMERS",
    name: "Kalyani Polymers (P) Ltd",
    logo: "/Clients/client 15.jpg",
    project: "Pre-Engineered Factory Building",
  },
  {
    id: "OLIVE BY EMBASSY",
    name: "Olive by Embassy",
    logo: "/Clients/client 16.png",
    project: "Co-Living & Hospitality Infrastructure",
  },
];

/** Fallback rendered inline when a logo file has not yet been added by the user. */
export const CLIENT_LOGO_FALLBACK_ENABLED = true;
