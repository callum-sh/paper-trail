import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import "echarts/extension/bmap/bmap";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, ExternalLink } from "lucide-react";
import { graphs, type GraphType } from '@/data/graphs';
import type { GraphData, Paper, Citation } from '@/types/graph';
import { CitationDepthSlider } from './CitationDepthSlider';

interface Graph3DProps {
  type: GraphType;
  data?: GraphData;
  selectedPaperId?: string | null;
}

interface NodeInfoProps {
  node: Paper | null;
  onClose: () => void;
}

// Node information card component
const NodeInfoCard: React.FC<NodeInfoProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="absolute right-4 top-4 z-20 w-80 sm:w-96 transition-all duration-300 animate-fade-in">
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
        <CardContent className="space-y-3 pt-0">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Authors</h4>
            <div className="text-sm space-y-1">
              {node.authors.map((author, index) => (
                <div key={index} className="text-foreground">{author}</div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Year</h4>
              <div className="text-sm text-foreground">{node.year}</div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Citations</h4>
              <div className="text-sm text-foreground">{node.citations.toLocaleString()}</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Institutions</h4>
            <div className="text-sm space-y-1">
              {node.institutions.map((institution, index) => (
                <div key={index} className="text-foreground">{institution}</div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {node.categories.map((category, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {node.url && (
            <a 
              href={node.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View Paper <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Graph3D: React.FC<Graph3DProps> = ({ type, data, selectedPaperId }) => {
  const [graphData, setGraphData] = useState<GraphData | undefined>(undefined);
  const [selectedNode, setSelectedNode] = useState<Paper | null>(null);
  const [citationDepth, setCitationDepth] = useState(2);
  const [rootPaper, setRootPaper] = useState<Paper | null>(null);
  const chartRef = React.useRef<ReactECharts>(null);

  useEffect(() => {
    if (data) {
      setGraphData(data);
      // Set the selected paper or first paper as root
      if (selectedPaperId) {
        const selectedPaper = data.nodes.find(node => node.id === selectedPaperId);
        if (selectedPaper) {
          setRootPaper(selectedPaper);
        }
      } else if (data.nodes.length > 0) {
        setRootPaper(data.nodes[0]);
      }
    } else if (graphs[type]) {
      setGraphData(graphs[type]);
      // Set the selected paper or first paper as root
      if (selectedPaperId) {
        const selectedPaper = graphs[type].nodes.find(node => node.id === selectedPaperId);
        if (selectedPaper) {
          setRootPaper(selectedPaper);
        }
      } else if (graphs[type].nodes.length > 0) {
        setRootPaper(graphs[type].nodes[0]);
      }
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
    
    setSelectedNode(null);
  }, [data, type, selectedPaperId]);

  const handleChartEvents = {
    'click': (params: any) => {
      if (params.dataType === 'node') {
        const nodeData = graphData?.nodes.find(node => node.id === params.data.id) || null;
        setSelectedNode(nodeData);
        setRootPaper(nodeData);
      }
    }
  };

  const handleCloseNodeInfo = () => {
    setSelectedNode(null);
  };

  const getCitationNetwork = (root: Paper, depth: number): { nodes: Paper[], links: Citation[] } => {
    if (!graphData) return { nodes: [], links: [] };

    const visited = new Set<string>();
    const nodes: Paper[] = [];
    const links: Citation[] = [];
    const linkSet = new Set<string>(); // Track unique links

    const traverse = (paper: Paper, currentDepth: number) => {
      if (currentDepth > depth || visited.has(paper.id)) return;
      visited.add(paper.id);
      nodes.push(paper);

      // Find papers that cite this paper (next generation)
      const citingPapers = graphData.links
        .filter(link => link.target === paper.id)
        .map(link => graphData.nodes.find(node => node.id === link.source))
        .filter((node): node is Paper => node !== undefined);

      // Find papers that this paper cites (next generation)
      const citedPapers = graphData.links
        .filter(link => link.source === paper.id)
        .map(link => graphData.nodes.find(node => node.id === link.target))
        .filter((node): node is Paper => node !== undefined);

      // Add all connected papers and their links
      [...citingPapers, ...citedPapers].forEach(connectedPaper => {
        // Create a unique key for the link
        const linkKey = [paper.id, connectedPaper.id].sort().join('-');
        if (!linkSet.has(linkKey)) {
          linkSet.add(linkKey);
          links.push({
            source: paper.id,
            target: connectedPaper.id,
            year: graphData.links.find(l => 
              (l.source === paper.id && l.target === connectedPaper.id) ||
              (l.source === connectedPaper.id && l.target === paper.id)
            )?.year || 0
          });
        }

        // Only traverse to next generation if we haven't visited this paper
        if (!visited.has(connectedPaper.id)) {
          traverse(connectedPaper, currentDepth + 1);
        }
      });
    };

    traverse(root, 0);
    return { nodes, links };
  };

  const getOption = (): EChartsOption => {
    if (!graphData || !rootPaper) return {};

    const { nodes, links } = getCitationNetwork(rootPaper, citationDepth);
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
        text: rootPaper.name,
        subtext: `Paper Trail`,
        left: 'center',
        top: 20,
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
            return `${params.data.name}`;
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
          data: nodes.map(node => ({
            id: node.id,
            name: node.name,
            value: node.citations,
            symbolSize: Math.min(20 + (node.citations / 1000), 50),
            category: node.categories[0],
            x: node.x,
            y: node.y,
            z: node.z
          })),
          links: links.map(link => ({
            source: link.source,
            target: link.target,
            value: 1,
            lineStyle: {
              color: '#8E9196',
              opacity: 0.8,
              width: 2,
              curveness: 0.2
            }
          })),
          categories: graphData.categories.map((cat, index) => ({
            name: cat.name,
            itemStyle: {
              color: categoryColors[index % categoryColors.length]
            }
          })),
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
          <CitationDepthSlider 
            value={citationDepth} 
            onChange={setCitationDepth}
            maxDepth={5}
          />
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
