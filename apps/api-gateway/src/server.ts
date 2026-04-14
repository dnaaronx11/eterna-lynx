import { buildApp } from './app.js';

const { app, env } = buildApp();

const run = async (): Promise<void> => {
  try {
    await app.listen({ port: env.API_PORT, host: '0.0.0.0' });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void run();
