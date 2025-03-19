import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface CitationDepthSliderProps {
  value: number;
  onChange: (value: number) => void;
  maxDepth: number;
}

export const CitationDepthSlider: React.FC<CitationDepthSliderProps> = ({
  value,
  onChange,
  maxDepth
}) => {
  return (
    <div className="absolute top-4 left-4 z-10 w-64 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-md">
      <div className="space-y-2">
        <Label htmlFor="citation-depth">Citation Depth: {value}</Label>
        <Slider
          id="citation-depth"
          min={1}
          max={maxDepth}
          step={1}
          value={[value]}
          onValueChange={([newValue]) => onChange(newValue)}
          className="w-full"
        />
      </div>
    </div>
  );
}; 