import React from 'react';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { simulateWorkflow } from '../../core/engine/simulator';

export const SandboxPanel = () => {
  const { simulationStatus, simulationSteps, validationResult } = useWorkflowStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#22c55e';
      case 'failed': return '#ef4444';
      case 'error': return '#ef4444';
      case 'running': return '#3b82f6';
      default: return '#64748b';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ paddingBottom: '15px', borderBottom: '1px solid #e2e8f0', marginBottom: '15px' }}>
        <button 
          onClick={simulateWorkflow}
          disabled={simulationStatus === 'running'}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: simulationStatus === 'running' ? '#94a3b8' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: simulationStatus === 'running' ? 'not-allowed' : 'pointer',
            fontWeight: 600
          }}
        >
          {simulationStatus === 'running' ? 'Simulating...' : 'Run Simulation'}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {validationResult && !validationResult.valid && (
          <div style={{ padding: '10px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '4px', marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#b91c1c', fontSize: '14px' }}>Validation Failed</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#991b1b', fontSize: '12px' }}>
              {validationResult.errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        )}

        {simulationSteps.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', color: '#334155' }}>Execution Logs</h4>
            {simulationSteps.map((step, i) => (
              <div key={i} style={{ 
                padding: '10px', 
                borderLeft: `4px solid ${getStatusColor(step.status)}`,
                backgroundColor: '#f8fafc',
                borderRadius: '0 4px 4px 0',
                fontSize: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ color: '#334155' }}>{step.nodeLabel}</strong>
                  <span style={{ color: getStatusColor(step.status), fontWeight: 600, textTransform: 'uppercase', fontSize: '10px' }}>
                    {step.status}
                  </span>
                </div>
                <div style={{ color: '#64748b' }}>{step.message}</div>
              </div>
            ))}
          </div>
        )}

        {simulationStatus === 'completed' && (
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '4px', textAlign: 'center', fontWeight: 600, fontSize: '14px' }}>
            Simulation Completed Successfully!
          </div>
        )}
      </div>
    </div>
  );
};
