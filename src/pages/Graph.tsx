
import React from "react";

const Graph = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-sidebar-background text-sidebar-foreground p-4">
          <h2 className="text-xl font-semibold mb-4">Node Graphs</h2>
          <ul className="space-y-2">
            <li className="p-2 rounded hover:bg-sidebar-accent cursor-pointer">Network Topology</li>
            <li className="p-2 rounded hover:bg-sidebar-accent cursor-pointer">Dependency Tree</li>
            <li className="p-2 rounded hover:bg-sidebar-accent cursor-pointer">Process Flow</li>
            <li className="p-2 rounded hover:bg-sidebar-accent cursor-pointer">Organization Chart</li>
          </ul>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg h-full shadow-sm flex items-center justify-center">
            <div className="text-center p-8">
              <h1 className="text-2xl font-bold mb-4">Node Graph Visualization</h1>
              <p className="text-muted-foreground mb-6">Select a graph from the sidebar to visualize it here.</p>
              <div className="p-12 border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground">Graph visualization will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Graph;
