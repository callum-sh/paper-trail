import type { GraphData } from '@/types/graph';
import attention from '../../data/attention.json';
import bert from '../../data/bert.json';
import resnet from '../../data/resnet.json';
import transformer from '../../data/transformer.json';
import yolo from '../../data/yolo.json';
import citations from '../../data/citations.json';

export type GraphType = 'citation-network';

export const graphs: Record<GraphType, GraphData> = {
  'citation-network': {
    displayName: 'Citation Network',
    description: 'A network of academic papers and their citations',
    nodes: [attention, bert, resnet, transformer, yolo],
    links: citations.links,
    categories: citations.categories
  }
}; 