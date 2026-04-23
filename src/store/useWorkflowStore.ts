import { create } from 'zustand';
import { 
  Connection, 
  Edge, 
  EdgeChange, 
  Node, 
  NodeChange, 
  addEdge, 
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect,
  applyNodeChanges, 
  applyEdgeChanges 
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { WorkflowNode, WorkflowEdge, WorkflowNodeType, SimulationStep, SimulationStatus, ValidationResult } from '../types/workflow';

interface WorkflowState {
  // Graph State
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onNodesChange: OnNodesChange<WorkflowNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  // Actions
  addNode: (type: WorkflowNodeType, position: { x: number, y: number }) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  
  // UI State
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  // Simulation State
  simulationStatus: SimulationStatus;
  simulationSteps: SimulationStep[];
  validationResult: ValidationResult | null;
  
  // Simulation Actions
  setSimulationStatus: (status: SimulationStatus) => void;
  addSimulationStep: (step: SimulationStep) => void;
  clearSimulation: () => void;
  setValidationResult: (result: ValidationResult | null) => void;
}

const initialNodes: WorkflowNode[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 250, y: 100 },
    data: { label: 'Start Workflow', type: 'start' },
  },
];

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  // Graph State
  nodes: initialNodes,
  edges: [],
  
  onNodesChange: (changes: NodeChange<WorkflowNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  
  onEdgesChange: (changes: EdgeChange<WorkflowEdge>[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  // Actions
  addNode: (type: WorkflowNodeType, position: { x: number, y: number }) => {
    const newNode: WorkflowNode = {
      id: `${type}-${uuidv4().substring(0, 8)}`,
      type,
      position,
      data: { 
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Node`, 
        type 
      } as any, // Cast due to dynamic nature, full defaults can be expanded
    };
    
    // Add default values based on type
    if (type === 'task') {
      newNode.data = { ...newNode.data, assignee: '', dueDate: '', customFields: [] };
    } else if (type === 'approval') {
      newNode.data = { ...newNode.data, approverRole: '', approvalThreshold: 1 };
    } else if (type === 'automated') {
      newNode.data = { ...newNode.data, actionId: '', dynamicParams: {} };
    }

    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeData: (nodeId: string, newData: any) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      }),
    });
  },

  // UI State
  selectedNodeId: null,
  setSelectedNodeId: (id: string | null) => set({ selectedNodeId: id }),

  // Simulation State
  simulationStatus: 'idle',
  simulationSteps: [],
  validationResult: null,

  // Simulation Actions
  setSimulationStatus: (status) => set({ simulationStatus: status }),
  addSimulationStep: (step) => set({ simulationSteps: [...get().simulationSteps, step] }),
  clearSimulation: () => set({ simulationStatus: 'idle', simulationSteps: [], validationResult: null }),
  setValidationResult: (result) => set({ validationResult: result }),
}));
