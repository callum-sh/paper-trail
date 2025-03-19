export interface Paper {
  id: string;
  name: string;
  authors: string[];
  year: number;
  citations: number;
  institutions: string[];
  categories: string[];
  abstract?: string;
  url?: string;
  x?: number;
  y?: number;
  z?: number;
}

export interface Citation {
  source: string;  // citing paper
  target: string;  // cited paper
  year: number;
}

export interface GraphData {
  displayName: string;
  description: string;
  nodes: Paper[];
  links: Citation[];
  categories: {
    name: string;
    itemStyle?: {
      color?: string;
    };
  }[];
} 