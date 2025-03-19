import React from "react";
import { cn } from "@/lib/utils";
import { graphs } from "@/data/graphs";
import type { Paper } from "@/types/graph";

interface GraphSelectorProps {
  selectedGraph: string;
  onSelectGraph: (graphType: string) => void;
}

const GraphSelector: React.FC<GraphSelectorProps> = ({ selectedGraph, onSelectGraph }) => {
  const papers = graphs['citation-network'].nodes;

  return (
    <div className="py-2">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Available Papers</h3>
        <ul className="space-y-2">
          {papers.map((paper: Paper) => (
            <li
              key={paper.id}
              className={cn(
                "p-3 rounded cursor-pointer transition-colors flex items-center justify-between",
                selectedGraph === paper.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
              onClick={() => onSelectGraph(paper.id)}
            >
              <div>
                <div className="font-medium">{paper.name}</div>
                <div className="text-sm text-muted-foreground">
                  {paper.authors[0]} et al. ({paper.year})
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {paper.citations.toLocaleString()} citations
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GraphSelector;
