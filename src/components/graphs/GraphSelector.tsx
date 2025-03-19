
import React from "react";
import { cn } from "@/lib/utils";

interface GraphSelectorProps {
  selectedGraph: string;
  onSelectGraph: (graphType: string) => void;
}

const graphs = [
  { id: "network-topology", name: "Network Topology" },
  { id: "dependency-tree", name: "Dependency Tree" },
  { id: "process-flow", name: "Process Flow" },
  { id: "organization-chart", name: "Organization Chart" }
];

const GraphSelector: React.FC<GraphSelectorProps> = ({ selectedGraph, onSelectGraph }) => {
  return (
    <div className="py-2">
      <ul className="space-y-2">
        {graphs.map((graph) => (
          <li
            key={graph.id}
            className={cn(
              "p-3 rounded cursor-pointer transition-colors flex items-center",
              selectedGraph === graph.id
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-muted"
            )}
            onClick={() => onSelectGraph(graph.id)}
          >
            {graph.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GraphSelector;
