const assert = require('node:assert');
const http = require('node:http');
const test = require('node:test');
const createApp = require('../src/app');

function startServer(config = {}) {
  return new Promise((resolve) => {
    const app = createApp(config);
    const server = http.createServer(app);

    server.listen(0, () => resolve(server));
  });
}

test('hub responds with enriched web3 context when configured', async (t) => {
  const server = await startServer({
    rpcUrl: 'https://rpc.eterna.example',
    projectId: 'lynx-demo',
  });

  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/hub`);
  assert.strictEqual(response.status, 200);

  const body = await response.json();
  assert.ok(body.requestId);
  assert.strictEqual(body.web3.mode, 'web3');
  assert.strictEqual(body.web3.rpcUrl, 'https://rpc.eterna.example');
  assert.strictEqual(body.web3.projectId, 'lynx-demo');
  assert.strictEqual(body.web3.status, 'configured');
});

test('hub reports fallback web2 mode when web3 is not configured', async (t) => {
  const server = await startServer();
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/hub/web3/status`);

  assert.strictEqual(response.status, 200);
  const body = await response.json();

  assert.ok(body.requestId);
  assert.strictEqual(body.web3.mode, 'web2-fallback');
  assert.strictEqual(body.web3.rpcUrl, null);
  assert.strictEqual(body.web3.projectId, null);
  assert.strictEqual(body.web3.status, 'disconnected');
  assert.strictEqual(body.web3.reachable, false);
});

test('error handler catches errors and returns 500 response', async (t) => {
  // Create app with a test route that throws an error
  const server = await startServer({
    testRoutes: (app) => {
      app.get('/test-error', (req, res, next) => {
        next(new Error('Test error'));
      });
    }
  });
  
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/test-error`);

  assert.strictEqual(response.status, 500);
  const body = await response.json();
  assert.strictEqual(body.error, 'Internal server error');
});
