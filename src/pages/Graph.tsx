
import React, { useState } from "react";
import Graph3D from "@/components/graphs/Graph3D";
import GraphSelector from "@/components/graphs/GraphSelector";

const Graph = () => {
  const [selectedGraph, setSelectedGraph] = useState<string>("network-topology");

  const handleSelectGraph = (graphType: string) => {
    setSelectedGraph(graphType);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-sidebar-background text-sidebar-foreground p-4">
          <h2 className="text-xl font-semibold mb-4">Node Graphs</h2>
          <GraphSelector 
            selectedGraph={selectedGraph} 
            onSelectGraph={handleSelectGraph} 
          />
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg h-full shadow-sm">
            <Graph3D type={selectedGraph} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Graph;
