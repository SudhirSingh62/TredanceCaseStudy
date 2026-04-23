import React, { useEffect, useState } from 'react';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { AutomationAction } from '../../types/workflow';
import { api } from '../../services/api';

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '15px',
  borderRadius: '4px',
  border: '1px solid #cbd5e1',
  boxSizing: 'border-box' as const,
  fontSize: '14px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#475569'
};

export const ConfigPanel = () => {
  const { nodes, selectedNodeId, updateNodeData } = useWorkflowStore();
  const [automations, setAutomations] = useState<AutomationAction[]>([]);

  useEffect(() => {
    api.getAutomations().then(setAutomations);
  }, []);

  if (!selectedNodeId) {
    return (
      <div style={{ padding: '20px', color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>
        Select a node to configure its properties.
      </div>
    );
  }

  const node = nodes.find(n => n.id === selectedNodeId);
  if (!node) return null;

  const handleChange = (field: string, value: any) => {
    updateNodeData(selectedNodeId, { [field]: value });
  };

  const renderDynamicFields = () => {
    switch (node.type) {
      case 'start':
      case 'end':
        return <p style={{ fontSize: '12px', color: '#64748b' }}>No specific configuration required.</p>;

      case 'task':
        return (
          <>
            <label style={labelStyle}>Assignee Email</label>
            <input 
              style={inputStyle} 
              type="email" 
              value={(node.data.assignee as string) || ''} 
              onChange={e => handleChange('assignee', e.target.value)} 
              placeholder="e.g. manager@company.com" 
            />
            
            <label style={labelStyle}>Due Date</label>
            <input 
              style={inputStyle} 
              type="date" 
              value={(node.data.dueDate as string) || ''} 
              onChange={e => handleChange('dueDate', e.target.value)} 
            />
          </>
        );

      case 'approval':
        return (
          <>
            <label style={labelStyle}>Approver Role</label>
            <select 
              style={inputStyle} 
              value={(node.data.approverRole as string) || ''} 
              onChange={e => handleChange('approverRole', e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="Direct Manager">Direct Manager</option>
              <option value="HR Admin">HR Admin</option>
              <option value="Finance">Finance</option>
            </select>
          </>
        );

      case 'automated':
        const currentAction = automations.find(a => a.id === node.data.actionId);
        
        return (
          <>
            <label style={labelStyle}>Action Type</label>
            <select 
              style={inputStyle} 
              value={(node.data.actionId as string) || ''} 
              onChange={e => handleChange('actionId', e.target.value)}
            >
              <option value="">Select Action</option>
              {automations.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>

            {currentAction && (
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f1f5f9', borderRadius: '4px' }}>
                <p style={{ fontSize: '12px', marginBottom: '10px', color: '#475569' }}>{currentAction.description}</p>
                
                {currentAction.params.map(param => (
                  <div key={param.key}>
                    <label style={labelStyle}>{param.label}</label>
                    <input 
                      style={inputStyle}
                      type={param.type === 'string' ? 'text' : 'number'}
                      value={((node.data.dynamicParams as any)?.[param.key]) || ''}
                      onChange={e => {
                        const newParams = { ...(node.data.dynamicParams as any), [param.key]: e.target.value };
                        handleChange('dynamicParams', newParams);
                      }}
                      placeholder={`Enter ${param.label.toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label style={labelStyle}>Node Label</label>
        <input 
          style={inputStyle} 
          value={node.data.label as string} 
          onChange={e => handleChange('label', e.target.value)} 
        />
      </div>
      
      <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '10px 0' }} />
      
      {renderDynamicFields()}
    </div>
  );
};
