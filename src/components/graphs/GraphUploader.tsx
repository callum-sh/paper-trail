import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface GraphUploaderProps {
  onUpload: (data: any) => void;
}

export function GraphUploader({ onUpload }: GraphUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonData = JSON.parse(content);
        
        // Validate the JSON structure
        if (!jsonData.nodes || !Array.isArray(jsonData.nodes) || 
            !jsonData.links || !Array.isArray(jsonData.links) ||
            !jsonData.displayName || typeof jsonData.displayName !== 'string') {
          throw new Error('Invalid graph data structure');
        }

        onUpload(jsonData);
        toast({
          title: "Graph Uploaded",
          description: "Your graph has been successfully uploaded.",
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Please ensure you're uploading a valid graph JSON file.",
          variant: "destructive",
          duration: 3000,
        });
      }
    };

    reader.onerror = () => {
      toast({
        title: "Upload Failed",
        description: "There was an error reading the file.",
        variant: "destructive",
        duration: 3000,
      });
    };

    reader.readAsText(file);
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".json"
        className="hidden"
      />
      <Button
        variant="outline"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        className="rounded-full bg-background/80 backdrop-blur-sm shadow-md hover:bg-background"
      >
        <Upload className="h-4 w-4" />
        <span className="sr-only">Upload Graph</span>
      </Button>
    </div>
  );
} 