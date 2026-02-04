const crypto = require('node:crypto');

/**
 * Builds the web3 context attached to each request.
 * @param {Object} [config] optional configuration override.
 * @param {string} [config.rpcUrl] RPC endpoint to mark the hub as web3-enabled.
 * @param {string} [config.projectId] Project identifier passed through responses.
 * @param {NodeJS.ProcessEnv} [env] environment provider (defaults to process.env).
 * @returns {{rpcUrl: string|null, projectId: string|null, status: string}}
 */
function buildWeb3Context(config = {}, env = process.env) {
  const rpcUrl = config.rpcUrl || env.ETERNA_RPC_URL || null;
  const projectId = config.projectId || env.ETERNA_PROJECT_ID || null;

  return {
    rpcUrl,
    projectId,
    status: rpcUrl ? 'configured' : 'disconnected',
  };
}

/**
 * Middleware factory that enriches requests with EternaNet context.
 * Generates an RFC4122 v4 requestId when none is supplied via the x-request-id header.
 * @param {Object} [config] optional web3 configuration overrides.
 * @returns {import('express').RequestHandler} Express middleware
 */
function createContext(config = {}) {
  return (req, res, next) => {
    const ip = typeof req.ip === 'string' && req.ip.trim() ? req.ip : 'unknown';

    req.context = {
      requestId: req.headers['x-request-id'] || crypto.randomUUID(),
      web2: {
        ip,
        userAgent: req.headers['user-agent'] || null,
      },
      web3: buildWeb3Context(config),
    };

    next();
  };
}

module.exports = createContext;
module.exports.buildWeb3Context = buildWeb3Context;
