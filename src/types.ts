export type NodeType = 'screen' | 'action' | 'navigation' | 'state' | 'result';

export interface FlowNode {
  type: NodeType;
  label: string;
  description?: string;
  children?: FlowNode[];
}

export interface FlowMap {
  name: string;
  description?: string;
  flows: FlowNode[];
}

export interface RawYamlNode {
  screen?: string;
  action?: string;
  navigation?: string;
  state?: string;
  result?: string;
  description?: string;
  children?: RawYamlNode[];
}

export interface RawYamlData {
  name: string;
  description?: string;
  flows: RawYamlNode[];
}
