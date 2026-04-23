import React, { useState } from 'react';
import { Canvas } from './components/canvas/Canvas';
import { Sidebar } from './components/layout/Sidebar';
import { ConfigPanel } from './components/panels/ConfigPanel';
import { SandboxPanel } from './components/panels/SandboxPanel';

function App() {
  const [activeTab, setActiveTab] = useState<'config' | 'sandbox'>('config');

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Canvas Area */}
      <main style={{ flex: 1, position: 'relative', backgroundColor: '#f8fafc' }}>
        <Canvas />
      </main>

      {/* Right Panel */}
      <aside style={{
        width: '320px',
        borderLeft: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
          <button 
            onClick={() => setActiveTab('config')}
            style={{ 
              flex: 1, 
              padding: '15px', 
              border: 'none', 
              background: 'none',
              borderBottom: activeTab === 'config' ? '2px solid #3b82f6' : '2px solid transparent',
              color: activeTab === 'config' ? '#3b82f6' : '#64748b',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Configuration
          </button>
          <button 
            onClick={() => setActiveTab('sandbox')}
            style={{ 
              flex: 1, 
              padding: '15px', 
              border: 'none', 
              background: 'none',
              borderBottom: activeTab === 'sandbox' ? '2px solid #3b82f6' : '2px solid transparent',
              color: activeTab === 'sandbox' ? '#3b82f6' : '#64748b',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Simulation
          </button>
        </div>

        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {activeTab === 'config' ? <ConfigPanel /> : <SandboxPanel />}
        </div>
      </aside>

    </div>
  );
}

export default App;
