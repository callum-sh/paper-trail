
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
    <ul className="space-y-2">
      {graphs.map((graph) => (
        <li
          key={graph.id}
          className={cn(
            "p-2 rounded cursor-pointer transition-colors",
            selectedGraph === graph.id
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
          )}
          onClick={() => onSelectGraph(graph.id)}
        >
          {graph.name}
        </li>
      ))}
    </ul>
  );
};

export default GraphSelector;
