import { describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';

describe('api-gateway smoke', () => {
  it('returns health status', async () => {
    const { app } = buildApp();
    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json().status).toBe('ok');
  });

  it('executes omnilinx echo through kernel and bridge', async () => {
    const { app } = buildApp();
    const request = {
      requestId: '5d4e5b52-c0b1-4be5-ad6d-4a7d58ce7dbe',
      identityId: 'user-local-1',
      plane: 'omnilinx',
      action: 'echo',
      payload: { hello: 'lynxverse' },
      timestamp: new Date().toISOString()
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/execute',
      payload: request
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.status).toBe('ok');
    expect(body.data.acknowledged).toBe(true);
    expect(typeof body.auditHash).toBe('string');
  });
});
