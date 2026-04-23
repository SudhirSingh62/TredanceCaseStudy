import { useWorkflowStore } from '../../store/useWorkflowStore';
import { validateWorkflow } from '../validation/graphValidator';
import { api } from '../../services/api';
import { AutomatedNodeData, SimulationStep } from '../../types/workflow';

export const simulateWorkflow = async () => {
  const store = useWorkflowStore.getState();
  const { nodes, edges, setSimulationStatus, addSimulationStep, setValidationResult, clearSimulation } = store;

  clearSimulation();
  setSimulationStatus('running');

  // 1. Validation
  const validation = validateWorkflow(nodes, edges);
  setValidationResult(validation);

  if (!validation.valid) {
    setSimulationStatus('error');
    return;
  }

  // 2. Build Adjacency List for BFS traversal
  const adjacencyList = new Map<string, string[]>();
  nodes.forEach(n => adjacencyList.set(n.id, []));
  edges.forEach(e => {
    adjacencyList.get(e.source)!.push(e.target);
  });

  // Find Start Node
  const startNode = nodes.find(n => n.type === 'start')!;

  // 3. Traversal Queue (BFS for parallel branch execution simulation)
  const queue: string[] = [startNode.id];
  const processed = new Set<string>();

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (processed.has(currentId)) continue;
    processed.add(currentId);

    const node = nodes.find(n => n.id === currentId)!;

    // Log pending state
    const pendingStep: SimulationStep = {
      nodeId: node.id,
      nodeLabel: node.data.label,
      nodeType: node.type,
      status: 'running',
      message: `Executing ${node.type}...`,
      timestamp: Date.now()
    };
    addSimulationStep(pendingStep);

    // Simulate Execution time based on node type
    await new Promise(res => setTimeout(res, 800));

    let isSuccess = true;
    let message = 'Completed successfully.';

    if (node.type === 'automated') {
      const data = node.data as AutomatedNodeData;
      if (!data.actionId) {
        isSuccess = false;
        message = 'Failed: No automated action configured.';
      } else {
        const result = await api.simulateAction(data.actionId, data.dynamicParams);
        isSuccess = result.success;
        message = result.message;
      }
    } else if (node.type === 'approval') {
       message = 'Approval pending... (Simulated Auto-Approve)';
    }

    // Log completion state
    const completionStep: SimulationStep = {
      nodeId: node.id,
      nodeLabel: node.data.label,
      nodeType: node.type,
      status: isSuccess ? 'success' : 'failed',
      message,
      timestamp: Date.now()
    };
    
    // We update the last step instead of adding a new one (in a real app we'd update, here we just push the result)
    addSimulationStep(completionStep);

    if (!isSuccess) {
      setSimulationStatus('error');
      return; // Halt execution on failure
    }

    // Enqueue neighbors
    const neighbors = adjacencyList.get(currentId) || [];
    for (const n of neighbors) {
      queue.push(n);
    }
  }

  setSimulationStatus('completed');
};
