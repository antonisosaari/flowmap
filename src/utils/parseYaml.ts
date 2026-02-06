import yaml from 'js-yaml';
import type { FlowMap, FlowNode, NodeType, RawYamlData, RawYamlNode } from '../types';

const nodeTypeKeys: NodeType[] = ['screen', 'action', 'navigation', 'state', 'result'];

function parseNode(rawNode: RawYamlNode): FlowNode | null {
  for (const key of nodeTypeKeys) {
    if (rawNode[key]) {
      const node: FlowNode = {
        type: key,
        label: rawNode[key] as string,
        description: rawNode.description,
      };
      
      if (rawNode.children && Array.isArray(rawNode.children)) {
        node.children = rawNode.children
          .map(parseNode)
          .filter((n): n is FlowNode => n !== null);
      }
      
      return node;
    }
  }
  return null;
}

export function parseFlowYaml(yamlString: string): FlowMap | null {
  try {
    const data = yaml.load(yamlString) as RawYamlData;
    
    if (!data || !data.flows || !Array.isArray(data.flows)) {
      return null;
    }
    
    const flows = data.flows
      .map(parseNode)
      .filter((n): n is FlowNode => n !== null);
    
    return {
      name: data.name || 'Untitled',
      description: data.description,
      flows,
    };
  } catch (error) {
    console.error('YAML parse error:', error);
    return null;
  }
}
