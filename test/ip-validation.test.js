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

test('IP address validation handles valid IP', async (t) => {
  const server = await startServer();
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/hub`);
  
  assert.strictEqual(response.status, 200);
  const body = await response.json();
  
  // req.ip should be '127.0.0.1' or '::1' for localhost
  assert.ok(body.web2);
  assert.ok(typeof body.web2.ip === 'string');
  assert.ok(body.web2.ip.length > 0);
  assert.notStrictEqual(body.web2.ip, 'unknown');
});

test('IP address validation provides fallback for undefined IP', async (t) => {
  // Test the middleware directly by mocking a request with undefined IP
  const createContext = require('../src/middleware/context');
  const middleware = createContext();
  
  const mockReq = {
    ip: undefined,
    headers: {},
  };
  const mockRes = {};
  const mockNext = () => {};
  
  middleware(mockReq, mockRes, mockNext);
  
  // Should fallback to 'unknown' when IP is undefined
  assert.strictEqual(mockReq.context.web2.ip, 'unknown');
});

test('IP address validation provides fallback for empty string IP', async (t) => {
  // Test the middleware directly by mocking a request with whitespace IP
  const createContext = require('../src/middleware/context');
  const middleware = createContext();
  
  const mockReq = {
    ip: '   ',  // whitespace-only string
    headers: {},
  };
  const mockRes = {};
  const mockNext = () => {};
  
  middleware(mockReq, mockRes, mockNext);
  
  // Should fallback to 'unknown' when IP is empty/whitespace
  assert.strictEqual(mockReq.context.web2.ip, 'unknown');
});

test('IP address validation provides fallback for non-string IP', async (t) => {
  // Test the middleware directly by mocking a request with non-string IP
  const createContext = require('../src/middleware/context');
  const middleware = createContext();
  
  const mockReq = {
    ip: 12345,  // non-string value
    headers: {},
  };
  const mockRes = {};
  const mockNext = () => {};
  
  middleware(mockReq, mockRes, mockNext);
  
  // Should fallback to 'unknown' when IP is not a string
  assert.strictEqual(mockReq.context.web2.ip, 'unknown');
});
