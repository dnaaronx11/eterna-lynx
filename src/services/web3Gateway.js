/**
 * Normalizes the web3 context into a transport-agnostic shape for responses.
 * @param {{rpcUrl?: string|null, projectId?: string|null, status?: string}} [web3Context]
 * @returns {{status: string, rpcUrl: string|null, projectId: string|null, mode: string, reachable: boolean}}
 */
function describeConnection(web3Context = {}) {
  const hasRpc = Boolean(web3Context.rpcUrl);

  return {
    status: web3Context.status || (hasRpc ? 'configured' : 'disconnected'),
    rpcUrl: web3Context.rpcUrl || null,
    projectId: web3Context.projectId || null,
    mode: hasRpc ? 'web3' : 'web2-fallback',
    reachable: hasRpc,
  };
}

module.exports = {
  describeConnection,
};
