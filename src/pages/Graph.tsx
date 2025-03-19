
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
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Full page graph content */}
      <div className="absolute inset-0">
        <Graph3D type={selectedGraph} />
      </div>
      
      {/* Floating search button */}
      <div className="absolute top-4 right-4 z-10">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsDialogOpen(true)}
          className="rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Select Graph</span>
        </Button>
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
    </div>
  );
};

export default Graph;
