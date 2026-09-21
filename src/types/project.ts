export interface Project {
  id: string;
  number: string;
  title: string;
  location: string;
  client?: string;
  category: string;
  type: string;
  floors?: string;
  builtUpArea?: string;
  description?: string;
  facilities?: string[];
  technicalHighlights?: string[];
  heroImage: string;
  gallery?: string[];
  constructionImages?: string[];
  completedImages?: string[];
  featured: boolean;
  hasBeforeAfter?: boolean;
  beforeImage?: string;
  afterImage?: string;
  accentColor?: string;
}
