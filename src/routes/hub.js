const express = require('express');
const { describeConnection } = require('../services/web3Gateway');

function createHubRouter(config = {}) {
  const router = express.Router();
  const hubName = config.hubName || 'EternaNet Lynx Planar Main Hub';

  router.get('/', (req, res) => {
    const context = req.context || {};

    res.json({
      hub: hubName,
      requestId: context.requestId,
      web2: context.web2,
      web3: describeConnection(context.web3 || {}),
    });
  });

  router.get('/web3/status', (req, res) => {
    const context = req.context || {};

    res.json({
      requestId: context.requestId,
      web3: describeConnection(context.web3 || {}),
    });
  });

  return router;
}

module.exports = createHubRouter;
