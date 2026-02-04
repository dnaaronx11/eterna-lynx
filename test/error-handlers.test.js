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

test('returns provided x-request-id header', async (t) => {
  const server = await startServer();
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/hub`, {
    headers: { 'x-request-id': 'custom-id-123' },
  });

  const body = await response.json();
  assert.strictEqual(body.requestId, 'custom-id-123');
});

test('handles thrown errors with 500 response', async (t) => {
  const server = await startServer({
    extendApp: (app) => {
      app.get('/boom', () => {
        throw new Error('bang');
      });
    },
  });
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/boom`);

  assert.strictEqual(response.status, 500);
  const body = await response.json();
  assert.deepStrictEqual(body, { error: 'Internal server error' });
});
