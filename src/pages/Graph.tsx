
import React, { useState } from "react";
import { Search } from "lucide-react";
import Graph3D from "@/components/graphs/Graph3D";
import GraphSelector from "@/components/graphs/GraphSelector";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Graph = () => {
  const [selectedGraph, setSelectedGraph] = useState<string>("network-topology");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleSelectGraph = (graphType: string) => {
    setSelectedGraph(graphType);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col">
        {/* Header with search button */}
        <div className="w-full border-b border-border bg-sidebar-background p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Node Graphs</h2>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsDialogOpen(true)}
            className="rounded-full"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Select Graph</span>
          </Button>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg h-full shadow-sm">
            <Graph3D type={selectedGraph} />
          </div>
        </div>

        {/* Graph Selection Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Graph Type</DialogTitle>
            </DialogHeader>
            <GraphSelector 
              selectedGraph={selectedGraph} 
              onSelectGraph={handleSelectGraph} 
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Graph;
