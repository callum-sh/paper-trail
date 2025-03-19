import networkTopology from './network-topology.json';
import dependencyTree from './dependency-tree.json';
import processFlow from './process-flow.json';
import organizationChart from './organization-chart.json';

export const graphs = {
  'network-topology': networkTopology,
  'dependency-tree': dependencyTree,
  'process-flow': processFlow,
  'organization-chart': organizationChart
} as const;

export type GraphType = keyof typeof graphs; 