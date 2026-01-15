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
