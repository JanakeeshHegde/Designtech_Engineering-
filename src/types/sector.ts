export interface SectorItem {
  num: string;
  title: string;
  subtitle: string;
  desc: string;
  tags: string[];
  visual: "building" | "water" | "industrial" | "solar";
}

export interface FieldPreviewItem {
  num: string;
  title: string;
  category: string;
  desc: string;
  tag: string;
  sectorId: string;
}
