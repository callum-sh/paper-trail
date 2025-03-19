
import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import "echarts/extension/bmap/bmap";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

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

interface GraphData {
  nodes: Node[];
  links: Link[];
  categories?: { name: string }[];
}

interface Graph3DProps {
  data?: GraphData;
  type: string;
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

// Default datasets for different graph types
const DEFAULT_DATA: Record<string, GraphData> = {
  "network-topology": {
    nodes: [
      { 
        id: "0", 
        name: "Server A", 
        symbolSize: 20, 
        category: 0, 
        value: 28,
        authors: ["John Smith", "Jane Doe"],
        institutions: ["Cloud Services Inc."]
      },
      { 
        id: "1", 
        name: "Server B", 
        symbolSize: 16, 
        category: 0, 
        value: 22,
        authors: ["Robert Johnson"],
        institutions: ["Network Solutions"]
      },
      { 
        id: "2", 
        name: "Router 1", 
        symbolSize: 18, 
        category: 1, 
        value: 16,
        authors: ["Maria Garcia"],
        institutions: ["Cisco Systems"]
      },
      { 
        id: "3", 
        name: "Router 2", 
        symbolSize: 18, 
        category: 1, 
        value: 16,
        authors: ["David Chen"],
        institutions: ["Networking Corp"]
      },
      { 
        id: "4", 
        name: "Client 1", 
        symbolSize: 12, 
        category: 2, 
        value: 10,
        authors: ["Sarah Wilson"],
        institutions: ["End User Group"]
      },
      { 
        id: "5", 
        name: "Client 2", 
        symbolSize: 12, 
        category: 2, 
        value: 10,
        authors: ["Michael Brown"],
        institutions: ["User Department"]
      },
      { 
        id: "6", 
        name: "Client 3", 
        symbolSize: 12, 
        category: 2, 
        value: 10,
        authors: ["Lisa Wang"],
        institutions: ["Client Division"]
      },
      { 
        id: "7", 
        name: "Client 4", 
        symbolSize: 12, 
        category: 2, 
        value: 10,
        authors: ["James Lee"],
        institutions: ["End User Department"]
      }
    ],
    links: [
      { source: "0", target: "2", value: 1 },
      { source: "1", target: "3", value: 1 },
      { source: "2", target: "3", value: 2 },
      { source: "2", target: "4", value: 1 },
      { source: "2", target: "5", value: 1 },
      { source: "3", target: "6", value: 1 },
      { source: "3", target: "7", value: 1 }
    ],
    categories: [
      { name: "Servers" },
      { name: "Routers" },
      { name: "Clients" }
    ]
  },
  "dependency-tree": {
    nodes: [
      { id: "0", name: "Main App", symbolSize: 24, category: 0, value: 30 },
      { id: "1", name: "UI Module", symbolSize: 18, category: 1, value: 25 },
      { id: "2", name: "API Client", symbolSize: 18, category: 1, value: 25 },
      { id: "3", name: "Auth Service", symbolSize: 16, category: 1, value: 20 },
      { id: "4", name: "Button Comp", symbolSize: 12, category: 2, value: 15 },
      { id: "5", name: "Form Comp", symbolSize: 12, category: 2, value: 15 },
      { id: "6", name: "REST Client", symbolSize: 12, category: 2, value: 15 },
      { id: "7", name: "JWT Helper", symbolSize: 12, category: 2, value: 15 }
    ],
    links: [
      { source: "0", target: "1", value: 2 },
      { source: "0", target: "2", value: 2 },
      { source: "0", target: "3", value: 2 },
      { source: "1", target: "4", value: 1 },
      { source: "1", target: "5", value: 1 },
      { source: "2", target: "6", value: 1 },
      { source: "3", target: "7", value: 1 }
    ],
    categories: [
      { name: "Core" },
      { name: "Modules" },
      { name: "Components" }
    ]
  },
  "process-flow": {
    nodes: [
      { id: "0", name: "Start", symbolSize: 20, category: 0, value: 20 },
      { id: "1", name: "User Input", symbolSize: 16, category: 1, value: 15 },
      { id: "2", name: "Validation", symbolSize: 16, category: 1, value: 15 },
      { id: "3", name: "Processing", symbolSize: 16, category: 1, value: 15 },
      { id: "4", name: "Database", symbolSize: 16, category: 2, value: 15 },
      { id: "5", name: "Error Handling", symbolSize: 16, category: 3, value: 15 },
      { id: "6", name: "Output", symbolSize: 16, category: 4, value: 15 },
      { id: "7", name: "End", symbolSize: 20, category: 0, value: 20 }
    ],
    links: [
      { source: "0", target: "1", value: 1 },
      { source: "1", target: "2", value: 1 },
      { source: "2", target: "5", value: 1 },
      { source: "2", target: "3", value: 1 },
      { source: "3", target: "4", value: 1 },
      { source: "4", target: "6", value: 1 },
      { source: "5", target: "1", value: 1 },
      { source: "6", target: "7", value: 1 }
    ],
    categories: [
      { name: "Terminal" },
      { name: "Input/Process" },
      { name: "Storage" },
      { name: "Error" },
      { name: "Output" }
    ]
  },
  "organization-chart": {
    nodes: [
      { id: "0", name: "CEO", symbolSize: 24, category: 0, value: 30 },
      { id: "1", name: "CTO", symbolSize: 20, category: 1, value: 25 },
      { id: "2", name: "CFO", symbolSize: 20, category: 1, value: 25 },
      { id: "3", name: "COO", symbolSize: 20, category: 1, value: 25 },
      { id: "4", name: "Dev Lead", symbolSize: 16, category: 2, value: 20 },
      { id: "5", name: "QA Lead", symbolSize: 16, category: 2, value: 20 },
      { id: "6", name: "Finance Manager", symbolSize: 16, category: 2, value: 20 },
      { id: "7", name: "Operations Manager", symbolSize: 16, category: 2, value: 20 },
      { id: "8", name: "Developer 1", symbolSize: 12, category: 3, value: 15 },
      { id: "9", name: "Developer 2", symbolSize: 12, category: 3, value: 15 }
    ],
    links: [
      { source: "0", target: "1", value: 2 },
      { source: "0", target: "2", value: 2 },
      { source: "0", target: "3", value: 2 },
      { source: "1", target: "4", value: 1 },
      { source: "1", target: "5", value: 1 },
      { source: "2", target: "6", value: 1 },
      { source: "3", target: "7", value: 1 },
      { source: "4", target: "8", value: 1 },
      { source: "4", target: "9", value: 1 }
    ],
    categories: [
      { name: "Executive" },
      { name: "C-Level" },
      { name: "Management" },
      { name: "Staff" }
    ]
  }
};

const Graph3D: React.FC<Graph3DProps> = ({ data, type }) => {
  const [graphData, setGraphData] = useState<GraphData | undefined>(undefined);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const chartRef = React.useRef<ReactECharts>(null);

  useEffect(() => {
    // If external data is provided, use it, otherwise use default
    if (data) {
      setGraphData(data);
    } else if (DEFAULT_DATA[type]) {
      setGraphData(DEFAULT_DATA[type]);
      toast({
        title: "Graph Loaded",
        description: `${type.replace('-', ' ')} graph loaded successfully.`,
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
        text: type.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        subtext: '3D Force-Directed Graph',
        left: 'center',
        textStyle: {
          color: '#fff'
        },
        subtextStyle: {
          color: '#aaa'
        }
      },
      tooltip: {},
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
            formatter: '{b}'
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
