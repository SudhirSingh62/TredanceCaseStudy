import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

const nodeStyles = {
  base: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
    minWidth: '150px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  },
  header: {
    fontWeight: 'bold',
    marginBottom: '4px',
    fontSize: '14px',
  },
  start: { borderColor: '#22c55e', borderLeftWidth: '5px' },
  end: { borderColor: '#ef4444', borderLeftWidth: '5px' },
  task: { borderColor: '#3b82f6', borderLeftWidth: '5px' },
  approval: { borderColor: '#f59e0b', borderLeftWidth: '5px' },
  automated: { borderColor: '#8b5cf6', borderLeftWidth: '5px' },
};

const NodeContainer = ({ children, styleType, selected }: { children: React.ReactNode, styleType: keyof typeof nodeStyles, selected: boolean }) => (
  <div style={{
    ...nodeStyles.base,
    ...nodeStyles[styleType],
    boxShadow: selected ? '0 0 0 2px #3b82f6' : nodeStyles.base.boxShadow
  }}>
    {children}
  </div>
);

export const StartNode = memo(({ data, selected }: NodeProps) => (
  <NodeContainer styleType="start" selected={!!selected}>
    <div style={nodeStyles.header}>🟢 {data.label as string}</div>
    <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
  </NodeContainer>
));

export const EndNode = memo(({ data, selected }: NodeProps) => (
  <NodeContainer styleType="end" selected={!!selected}>
    <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
    <div style={nodeStyles.header}>🛑 {data.label as string}</div>
  </NodeContainer>
));

export const TaskNode = memo(({ data, selected }: NodeProps) => (
  <NodeContainer styleType="task" selected={!!selected}>
    <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
    <div style={nodeStyles.header}>📝 {data.label as string}</div>
    <div style={{ color: '#64748b' }}>{(data.assignee as string) || 'Unassigned'}</div>
    <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
  </NodeContainer>
));

export const ApprovalNode = memo(({ data, selected }: NodeProps) => (
  <NodeContainer styleType="approval" selected={!!selected}>
    <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
    <div style={nodeStyles.header}>✅ {data.label as string}</div>
    <div style={{ color: '#64748b' }}>Role: {(data.approverRole as string) || 'None'}</div>
    <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
  </NodeContainer>
));

export const AutomatedNode = memo(({ data, selected }: NodeProps) => (
  <NodeContainer styleType="automated" selected={!!selected}>
    <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
    <div style={nodeStyles.header}>⚡ {data.label as string}</div>
    <div style={{ color: '#64748b' }}>Action: {(data.actionId as string) || 'Not set'}</div>
    <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
  </NodeContainer>
));

export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode
};
