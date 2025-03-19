import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import "echarts/extension/bmap/bmap";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { graphs, type GraphType } from '@/data/graphs';
import type { GraphData } from '@/types/graph';

// Sample data structure
interface Node {
  id: string;
  name: string;
  symbolSize?: number;
  category?: number;
  value?: number;
  x?: number;
  y?: number;
  z?: number;
  authors?: string[];
  institutions?: string[];
}

interface Link {
  source: string;
  target: string;
  value?: number;
}

interface Graph3DProps {
  data?: GraphData;
  type: GraphType;
}

interface NodeInfoProps {
  node: Node | null;
  onClose: () => void;
}

// Node information card component
const NodeInfoCard: React.FC<NodeInfoProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="absolute right-4 top-4 z-20 w-64 sm:w-80 transition-all duration-300 animate-fade-in">
      <Card className="bg-background/90 backdrop-blur-sm border-primary/20 shadow-lg">
        <CardHeader className="pb-2 relative">
          <button 
            onClick={onClose} 
            className="absolute right-2 top-2 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <CardTitle className="text-base text-primary">{node.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {node.authors && node.authors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Authors</h4>
              <div className="text-sm space-y-1">
                {node.authors.map((author, index) => (
                  <div key={index} className="text-foreground">{author}</div>
                ))}
              </div>
            </div>
          )}
          
          {node.institutions && node.institutions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Institutions</h4>
              <div className="text-sm space-y-1">
                {node.institutions.map((institution, index) => (
                  <div key={index} className="text-foreground">{institution}</div>
                ))}
              </div>
            </div>
          )}
          
          {(!node.authors || node.authors.length === 0) && 
           (!node.institutions || node.institutions.length === 0) && (
            <div className="text-sm text-muted-foreground">
              No additional information available for this node.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Graph3D: React.FC<Graph3DProps> = ({ data, type }) => {
  const [graphData, setGraphData] = useState<GraphData | undefined>(undefined);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const chartRef = React.useRef<ReactECharts>(null);

  useEffect(() => {
    // If external data is provided, use it, otherwise use data from our graphs
    if (data) {
      setGraphData(data);
    } else if (graphs[type]) {
      setGraphData(graphs[type]);
      toast({
        title: "Graph Loaded",
        description: `${graphs[type].displayName} loaded successfully.`,
        duration: 3000,
      });
    } else {
      console.error("Unknown graph type:", type);
      toast({
        title: "Error Loading Graph",
        description: `Unknown graph type: ${type}`,
        variant: "destructive",
        duration: 3000,
      });
    }
    
    // Reset selected node when graph type changes
    setSelectedNode(null);
  }, [data, type]);

  const handleChartEvents = {
    'click': (params: any) => {
      if (params.dataType === 'node') {
        const nodeData = graphData?.nodes.find(node => node.id === params.data.id) || null;
        setSelectedNode(nodeData);
      }
    }
  };

  const handleCloseNodeInfo = () => {
    setSelectedNode(null);
  };

  const getOption = (): EChartsOption => {
    if (!graphData) return {};

    const categoryColors = [
      '#9b87f5', // Primary Purple
      '#7E69AB', // Secondary Purple
      '#6E59A5', // Tertiary Purple
      '#D6BCFA', // Light Purple
      '#33C3F0', // Sky Blue
      '#F97316', // Bright Orange
      '#0EA5E9', // Ocean Blue
    ];

    return {
      title: {
        text: graphData.displayName,
        subtext: 'Paper Trail',
        left: 'center',
        textStyle: {
          color: '#fff'
        },
        subtextStyle: {
          color: '#aaa'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            return params.data.name;
          }
          return '';
        }
      },
      animationDuration: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          name: type,
          type: 'graph',
          layout: 'force',
          force: {
            repulsion: 300,
            edgeLength: 120,
            gravity: 0.1,
            friction: 0.6
          },
          roam: true,
          draggable: true,
          label: {
            show: true,
            position: 'right',
            formatter: '{b}',
            color: '#fff'
          },
          data: graphData.nodes.map(node => ({
            id: node.id,
            name: node.name,
            value: node.value,
            symbolSize: node.symbolSize || 10,
            category: node.category !== undefined ? node.category : 0,
            x: node.x,
            y: node.y,
            z: node.z
          })),
          links: graphData.links.map(link => ({
            source: link.source,
            target: link.target,
            value: link.value
          })),
          categories: graphData.categories?.map((cat, index) => ({
            name: cat.name,
            itemStyle: {
              color: categoryColors[index % categoryColors.length]
            }
          })) || [],
          lineStyle: {
            color: '#8E9196',
            opacity: 0.8,
            width: 2,
            curveness: 0.2
          },
          itemStyle: {
            borderColor: '#222',
            borderWidth: 1
          },
          emphasis: {
            lineStyle: {
              width: 3
            },
            focus: 'adjacency',
            itemStyle: {
              borderWidth: 2
            }
          }
        }
      ],
      backgroundColor: 'rgba(0, 0, 0, 0)'
    };
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {graphData ? (
        <>
          <ReactECharts 
            ref={chartRef}
            option={getOption()} 
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
            className="echarts-for-react"
            onEvents={handleChartEvents}
          />
          <NodeInfoCard node={selectedNode} onClose={handleCloseNodeInfo} />
        </>
      ) : (
        <div className="text-center">
          <p className="text-muted-foreground">Loading graph...</p>
        </div>
      )}
    </div>
  );
};

export default Graph3D;
