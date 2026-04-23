import { WorkflowNode, WorkflowEdge, ValidationResult } from '../../types/workflow';

/**
 * Validates a workflow graph to ensure it's a valid Directed Acyclic Graph (DAG)
 * with a single starting point and no logical errors.
 */
export const validateWorkflow = (nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationResult => {
  const errors: string[] = [];

  // 1. Check for Single Start Node
  const startNodes = nodes.filter(n => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push('Workflow must have exactly one Start Node.');
  } else if (startNodes.length > 1) {
    errors.push('Workflow cannot have more than one Start Node.');
  }

  // 2. Cycle Detection (DFS)
  const adjacencyList = new Map<string, string[]>();
  nodes.forEach(n => adjacencyList.set(n.id, []));
  edges.forEach(e => {
    if (adjacencyList.has(e.source)) {
      adjacencyList.get(e.source)!.push(e.target);
    }
  });

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    if (recursionStack.has(nodeId)) return true; // Cycle detected
    if (visited.has(nodeId)) return false; // Already checked this branch cleanly

    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (hasCycle(neighbor)) return true;
    }

    recursionStack.delete(nodeId);
    return false;
  };

  let cycleFound = false;
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (hasCycle(node.id)) {
        cycleFound = true;
        break;
      }
    }
  }

  if (cycleFound) {
    errors.push('Workflow contains cycles. Directed Acyclic Graph (DAG) requirement violated.');
  }

  // 3. Invalid connections (e.g., incoming to a Start node, outgoing from an End node)
  edges.forEach(edge => {
    const targetNode = nodes.find(n => n.id === edge.target);
    const sourceNode = nodes.find(n => n.id === edge.source);

    if (targetNode?.type === 'start') {
      errors.push(`Invalid connection: Cannot route back into a Start Node (${sourceNode?.data.label} -> Start).`);
    }
    if (sourceNode?.type === 'end') {
      errors.push(`Invalid connection: End Nodes cannot have outgoing connections (End -> ${targetNode?.data.label}).`);
    }
  });

  // 4. Orphan Nodes Warning (nodes with no incoming edges, except start)
  const hasIncomingEdge = new Set(edges.map(e => e.target));
  nodes.forEach(node => {
    if (node.type !== 'start' && !hasIncomingEdge.has(node.id)) {
      // Not strictly an error that prevents execution, but good for structural integrity
      // You could push to warnings, but for this case study, we'll enforce connectivity.
      errors.push(`Node "${node.data.label}" is unreachable (no incoming connections).`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};
