import React from 'react';
import { WorkflowNodeType } from '../../types/workflow';

const availableNodes: { type: WorkflowNodeType; label: string; icon: string; desc: string }[] = [
  { type: 'start', label: 'Start Node', icon: '🟢', desc: 'Entry point of the workflow' },
  { type: 'task', label: 'Task Node', icon: '📝', desc: 'Manual task assignment' },
  { type: 'approval', label: 'Approval Node', icon: '✅', desc: 'Requires manager approval' },
  { type: 'automated', label: 'Automated Node', icon: '⚡', desc: 'Triggers a backend action' },
  { type: 'end', label: 'End Node', icon: '🛑', desc: 'Terminates the workflow' },
];

export const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{
      width: '250px',
      borderRight: '1px solid #e2e8f0',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      backgroundColor: '#f8fafc',
      height: '100%'
    }}>
      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Components</h3>
      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Drag nodes to the canvas</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {availableNodes.map((node) => (
          <div
            key={node.type}
            onDragStart={(event) => onDragStart(event, node.type)}
            draggable
            style={{
              padding: '12px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              backgroundColor: 'white',
              cursor: 'grab',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <div style={{ fontWeight: 500, fontSize: '14px' }}>{node.icon} {node.label}</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>{node.desc}</div>
          </div>
        ))}
      </div>
    </aside>
  );
};
