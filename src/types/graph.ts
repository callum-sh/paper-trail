export interface Node {
  id: string;
  name: string;
  symbolSize?: number;
  category?: number;
  value?: number;
  x?: number;
  y?: number;
  z?: number;
  authors?: string[];
  institutions?: string[];
}

export interface Link {
  source: string;
  target: string;
  value?: number;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
  categories?: { name: string }[];
  displayName: string;  // Added for human-readable graph names
}

export interface GraphCollection {
  [key: string]: GraphData;
} 