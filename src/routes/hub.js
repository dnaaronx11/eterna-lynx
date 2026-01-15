const express = require('express');
const { describeConnection } = require('../services/web3Gateway');

function createHubRouter() {
  const router = express.Router();

  router.get('/', (req, res) => {
    const context = req.context || {};

    res.json({
      hub: 'EternaNet Lynx Planar Main Hub',
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
