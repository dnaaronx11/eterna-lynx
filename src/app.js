const express = require('express');
const createContext = require('./middleware/context');
const hubRouter = require('./routes/hub');

function createApp(config = {}) {
  const app = express();

  app.use(express.json());
  app.use(createContext(config));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });

  app.use('/hub', hubRouter(config));

  // Allow test routes to be injected before 404 handler (test environment only)
  if (config.testRoutes && (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === undefined)) {
    config.testRoutes(app);
  }

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error('Unhandled error in request:', err);
    // Simple error guard to avoid leaking details to callers
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = createApp;
