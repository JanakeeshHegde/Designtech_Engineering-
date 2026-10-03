export interface SectorItem {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  desc: string;
  tags: string[];
  image: string;
}

export interface FieldPreviewItem {
  num: string;
  title: string;
  category: string;
  desc: string;
  tag: string;
  sectorId: string;
  image: string;
}
