export interface ClientItem {
  id: string;
  name: string;
  logo: string;
  /** Optional — only set if it already exists in the project content. */
  project?: string;
}
