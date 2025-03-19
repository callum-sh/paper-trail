import React, { useState } from "react";
import { Search } from "lucide-react";
import Graph3D from "@/components/graphs/Graph3D";
import GraphSelector from "@/components/graphs/GraphSelector";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { GraphUploader } from "@/components/graphs/GraphUploader";
import { type GraphType } from "@/data/graphs";
import type { GraphData, Paper } from "@/types/graph";

const Graph = () => {
  const [selectedGraph, setSelectedGraph] = useState<GraphType>("citation-network");
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [customGraph, setCustomGraph] = useState<GraphData | null>(null);

  const handleSelectGraph = (paperId: string) => {
    setSelectedPaper(paperId);
    setIsDialogOpen(false);
  };

  const handleGraphUpload = (data: GraphData) => {
    setCustomGraph(data);
    setSelectedGraph("citation-network");
    setSelectedPaper(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Full page graph content */}
      <div className="absolute inset-0 h-screen w-full">
        <Graph3D 
          type={selectedGraph} 
          data={customGraph || undefined}
          selectedPaperId={selectedPaper}
        />
      </div>
      
      {/* Floating buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <GraphUploader onUpload={handleGraphUpload} />
        <ThemeToggle />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsDialogOpen(true)}
          className="rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Select Paper</span>
        </Button>
      </div>

      {/* Paper Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Paper</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Select a paper to view its citation network. The network will show papers that cite or are cited by the selected paper.
            </p>
          </div>
          <GraphSelector 
            selectedGraph={selectedPaper || ""} 
            onSelectGraph={handleSelectGraph} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Graph;
