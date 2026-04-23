import type { Node, Edge } from '@xyflow/react';

// ─── Node Type Discriminator ────────────────────────────────────────────────
export type WorkflowNodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

// ─── Node Data Interfaces ───────────────────────────────────────────────────
export interface BaseNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
}

export interface StartNodeData extends BaseNodeData {
  type: 'start';
}

export interface TaskNodeData extends BaseNodeData {
  type: 'task';
  assignee: string;
  dueDate: string;
  customFields: { key: string; value: string }[];
}

export interface ApprovalNodeData extends BaseNodeData {
  type: 'approval';
  approverRole: string;
  approvalThreshold: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  type: 'automated';
  actionId: string;
  dynamicParams: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  type: 'end';
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

// ─── React Flow Typed Aliases ───────────────────────────────────────────────
export type WorkflowNode = Node<WorkflowNodeData, WorkflowNodeType>;
export type WorkflowEdge = Edge;

// ─── Workflow Definition (serialized) ───────────────────────────────────────
export interface WorkflowDefinition {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
  };
}

// ─── Simulation Types ───────────────────────────────────────────────────────
export type SimulationStepStatus = 'pending' | 'running' | 'success' | 'failed' | 'skipped';

export interface SimulationStep {
  nodeId: string;
  nodeLabel: string;
  nodeType: WorkflowNodeType;
  status: SimulationStepStatus;
  message: string;
  timestamp: number;
}

export type SimulationStatus = 'idle' | 'running' | 'completed' | 'error';

// ─── Mock API Types ─────────────────────────────────────────────────────────
export interface AutomationAction {
  id: string;
  name: string;
  description: string;
  params: { key: string; label: string; type: 'string' | 'number' | 'boolean' }[];
}

// ─── Validation Types ───────────────────────────────────────────────────────
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ─── Form Schema Types ─────────────────────────────────────────────────────
export type FormFieldType = 'text' | 'textarea' | 'date' | 'number' | 'select' | 'dynamic-params' | 'custom-fields';

export interface FormFieldSchema {
  key: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
}
