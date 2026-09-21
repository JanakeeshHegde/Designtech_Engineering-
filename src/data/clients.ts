/* ============================================================
   CLIENT DATA — DESIGNTECH ENGINEERING CLIENT ECOSYSTEM
   ============================================================
   How to add a new client:
     1. Drop the client logo into:   /public/Clients/
        (e.g.  /public/Clients/client 13.png)
     2. Add a new object to the array below:
          { id: "client-id", name: "Client Name", logo: "/Clients/client-file.png" }

   The ecosystem visualization automatically:
     · recalculates radial positions
     · splits clients across 1 / 2 orbital rings when >8 clients
     · draws animated SVG connections to the center hub
   ============================================================ */

import type { ClientItem } from "../types/client";

export type { ClientItem };

export const CLIENTS: ClientItem[] = [
  {
    id: "shree-raghupathi-bhat",
    name: "Shree Raghupathi Bhat",
    logo: "/Clients/client 1.jpeg",
    project: "Residential & Hospitality",
  },
  {
    id: "country-inn-udupi",
    name: "Country Inn, Udupi",
    logo: "/Clients/client 2.png",
    project: "Hotel Country Inn",
  },
  {
    id: "st-joseph-group",
    name: "St. Joseph's Group",
    logo: "/Clients/client 3.jpeg",
    project: "Multi Activity Centre",
  },
  {
    id: "cmr-group",
    name: "CMR Group",
    logo: "/Clients/client 4.png",
    project: "CMR PU College",
  },
  {
    id: "ksca",
    name: "KSCA",
    logo: "/Clients/client 5.png",
    project: "Alur Facilities",
  },
  {
    id: "sagittarius-metals",
    name: "Sagittarius Metals",
    logo: "/Clients/client 6.png",
    project: "Factory, Peenya",
  },
  {
    id: "taurus-jcb",
    name: "Taurus JCB",
    logo: "/Clients/client 7.jpeg",
    project: "Industrial Structure",
  },
  {
    id: "client-8",
    name: "Client 08",
    logo: "/Clients/client 8.jpeg",
  },
  {
    id: "client-9",
    name: "Client 09",
    logo: "/Clients/client 9.jpeg",
  },
  {
    id: "client-10",
    name: "Client 10",
    logo: "/Clients/client 10.png",
  },
  {
    id: "client-11",
    name: "Client 11",
    logo: "/Clients/client 11.jpeg",
  },
  {
    id: "client-12",
    name: "Client 12",
    logo: "/Clients/client 12.jpeg",
  },
];

/** Fallback rendered inline when a logo file has not yet been added by the user. */
export const CLIENT_LOGO_FALLBACK_ENABLED = true;
