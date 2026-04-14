import React from 'react';
import { createRoot } from 'react-dom/client';
import { z } from 'zod';

const responseSchema = z.object({
  status: z.enum(['ok', 'error']),
  data: z.record(z.unknown()).optional(),
  error: z.string().optional(),
  auditHash: z.string()
});

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

function App() {
  const [result, setResult] = React.useState('No request yet.');
  const [loading, setLoading] = React.useState(false);

  const execute = async () => {
    setLoading(true);
    try {
      const requestBody = {
        requestId: crypto.randomUUID(),
        identityId: 'console-web-local-user',
        plane: 'omnilinx',
        action: 'echo',
        payload: { source: 'console-web', message: 'phase1-foundation' },
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE}/api/v1/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const raw = await response.json();
      const parsed = responseSchema.parse(raw);
      setResult(JSON.stringify(parsed, null, 2));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'unknown'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ fontFamily: 'Inter, sans-serif', margin: '2rem', maxWidth: '960px' }}>
      <h1>EternaLynX Console Web</h1>
      <p>Phase 1 local-first foundation: console-web → api-gateway → kernel → bridge → omnilinx.</p>
      <button onClick={execute} disabled={loading} style={{ padding: '0.6rem 1rem', cursor: 'pointer' }}>
        {loading ? 'Executing...' : 'Execute OmniLinx Echo'}
      </button>
      <pre
        style={{
          marginTop: '1rem',
          background: '#0b1020',
          color: '#d4f5ff',
          padding: '1rem',
          borderRadius: '8px',
          whiteSpace: 'pre-wrap'
        }}
      >
        {result}
      </pre>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
