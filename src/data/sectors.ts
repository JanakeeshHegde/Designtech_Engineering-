import type { SectorItem, FieldPreviewItem } from "../types/sector";

export const SECTORS: SectorItem[] = [
  {
    num: "01",
    title: "RESIDENTIAL & COMMERCIAL BUILDINGS",
    subtitle: "HIGH-RISE TOWERS, TECH PARKS & MIXED-USE HUBS",
    desc: "From iconic high-rise residential towers and luxury villa enclaves to multi-acre commercial IT parks and hotels. We engineer sophisticated deep basement retention systems, high-efficiency RCC post-tensioned floor plates, and seismically resilient superstructures tailored to architectural aesthetics.",
    tags: ["High-Rise Towers", "Post-Tensioned Slabs", "Deep Basements", "Seismic Engineering", "Mixed-Use Enclaves"],
    visual: "building",
  },
  {
    num: "02",
    title: "WATER & SEWAGE TREATMENT PLANTS",
    subtitle: "ENVIRONMENTAL INFRASTRUCTURE & HYDRAULIC RETAINING",
    desc: "Robust hydraulic civil and structural engineering for water treatment plants (WTP), sewage treatment facilities (STP), clarifiers, aeration basins, and underground reservoirs. Designed to meet stringent crack-width limits, hydrostatic pressures, and aggressive chemical corrosion environments.",
    tags: ["Liquid Retaining Structures", "IS 3370 Compliance", "WTP & STP Facilities", "Hydrodynamic Resistance", "Pumping Stations"],
    visual: "water",
  },
  {
    num: "03",
    title: "INDUSTRIAL STRUCTURES & INSTITUTIONS",
    subtitle: "HEAVY MANUFACTURING, LARGE-SPAN WAREHOUSES & CAMPUSES",
    desc: "Heavy-duty civil and structural engineering for manufacturing plants, automated logistics hubs, university campuses, and civic facilities. We deliver expansive column-free structural steel spans, heavy gantry crane girder designs, dynamic equipment foundations, and rapid-erection PEB systems.",
    tags: ["Pre-Engineered Buildings (PEB)", "Heavy Machine Foundations", "Long-Span Steel Trusses", "Institutional Campuses", "Industrial Flooring"],
    visual: "industrial",
  },
  {
    num: "04",
    title: "SOLAR & RENEWABLE ENERGY",
    subtitle: "UTILITY-SCALE FARMS & ROOFTOP MOUNTING STRUCTURES",
    desc: "Specialized structural engineering for solar photovoltaic mounting systems (MMS), rooftop solar arrays, wind-load resistant tracker frames, and substation infrastructure. Engineered with high-strength lightweight cold-formed steel for rapid site assembly and maximum lifecycle yield.",
    tags: ["Solar MMS Design", "Wind Dynamic Analysis", "Rooftop Load Audits", "Utility-Scale Arrays", "Cold-Formed Steel"],
    visual: "solar",
  },
];

export const FIELDS_PREVIEW: FieldPreviewItem[] = [
  {
    num: "01",
    title: "Residential & Commercial",
    category: "HIGH-RISE & MIXED-USE",
    desc: "Iconic residential towers, commercial IT parks, and luxury enclaves with high-efficiency RCC post-tensioned systems.",
    tag: "High-Rise // PT Slabs",
    sectorId: "residential-commercial",
  },
  {
    num: "02",
    title: "Water & Sewage Plants",
    category: "ENVIRONMENTAL INFRASTRUCTURE",
    desc: "Robust hydraulic engineering for WTP, STP, aeration basins, and underground reservoirs under IS 3370 standards.",
    tag: "IS 3370 Liquid Retaining",
    sectorId: "residential-commercial",
  },
  {
    num: "03",
    title: "Industrial & Institutions",
    category: "PEB & LARGE-SPAN HUBS",
    desc: "Expansive column-free structural steel, dynamic machine foundations, gantry girders, and civic university campuses.",
    tag: "PEB & Heavy Gantry",
    sectorId: "residential-commercial",
  },
  {
    num: "04",
    title: "Solar & Renewable Energy",
    category: "UTILITY & ROOFTOP ARRAYS",
    desc: "High-strength lightweight cold-formed steel MMS frames, wind-load audits, and rooftop mounting structures.",
    tag: "Wind Resilient MMS",
    sectorId: "residential-commercial",
  },
];
