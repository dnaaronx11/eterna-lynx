const http = require('node:http');
const createApp = require('./app');

const PORT = process.env.PORT || 3000;
const RPC_URL = process.env.ETERNA_RPC_URL || null;
const PROJECT_ID = process.env.ETERNA_PROJECT_ID || null;

const app = createApp({ rpcUrl: RPC_URL, projectId: PROJECT_ID });
const server = http.createServer(app);

server.listen(PORT, () => {
console.log(`EternaNet hub listening on port ${PORT}`);
});
