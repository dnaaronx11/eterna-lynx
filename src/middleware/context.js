const crypto = require('node:crypto');

function buildWeb3Context(config = {}, env = process.env) {
  const rpcUrl = config.rpcUrl || env.ETERNA_RPC_URL || null;
  const projectId = config.projectId || env.ETERNA_PROJECT_ID || null;

  return {
    rpcUrl,
    projectId,
    status: rpcUrl ? 'configured' : 'disconnected',
  };
}

function createContext(config = {}) {
  return (req, res, next) => {
    req.context = {
      requestId: req.headers['x-request-id'] || crypto.randomUUID(),
      web2: {
        ip: req.ip,
        userAgent: req.headers['user-agent'] || null,
      },
      web3: buildWeb3Context(config),
    };

    next();
  };
}

module.exports = createContext;
module.exports.buildWeb3Context = buildWeb3Context;
