import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Kernel } from '@eternalynx/kernel';
import { OmniLinxPlane } from '@eternalynx/omnilinx';
import { LocalIdentity } from '@eternalynx/identity';
import { AuditLogger, JsonLogger } from '@eternalynx/logging';
import { digestPayload, loadEnv, newRequestId } from '@eternalynx/security';
import {
  executeIntentRequestSchema,
  executeIntentResponseSchema,
  healthResponseSchema,
  type ExecuteIntentResponse
} from '@eternalynx/shared-types';

export const buildApp = () => {
  const env = loadEnv(process.env);
  const logger = new JsonLogger(env.LOG_LEVEL);
  const audit = new AuditLogger(env.AUDIT_LOG_PATH);
  const identity = new LocalIdentity('./.local/identity.json');
  const kernel = new Kernel([new OmniLinxPlane()]);

  const app = Fastify({ logger: false });

  void app.register(cors, { origin: env.CORS_ORIGIN, methods: ['GET', 'POST'] });

  app.get('/health', async () => {
    const response = {
      status: 'ok' as const,
      service: 'api-gateway',
      timestamp: new Date().toISOString()
    };

    return healthResponseSchema.parse(response);
  });

  app.post('/api/v1/execute', async (request, reply) => {
    try {
      const parsed = executeIntentRequestSchema.parse(request.body);
      const signedIdentity = identity.signPayload(parsed.payload);
      const data = await kernel.execute(parsed);

      const auditHash = audit.record({
        requestId: parsed.requestId,
        identityId: parsed.identityId,
        plane: parsed.plane,
        action: parsed.action,
        outcome: 'ok',
        payloadDigest: digestPayload(parsed.payload)
      });

      const response: ExecuteIntentResponse = {
        requestId: parsed.requestId,
        plane: parsed.plane,
        status: 'ok',
        data: {
          ...data,
          signature: signedIdentity,
          signerIdentity: identity.getIdentityId()
        },
        auditHash
      };

      logger.log('info', 'intent executed', {
        requestId: parsed.requestId,
        plane: parsed.plane,
        action: parsed.action
      });

      return executeIntentResponseSchema.parse(response);
    } catch (error) {
      const requestId = newRequestId();
      const auditHash = audit.record({
        requestId,
        identityId: 'unknown',
        plane: 'omnilinx',
        action: 'invalid',
        outcome: 'error',
        payloadDigest: digestPayload({})
      });
      logger.log('error', 'intent execution failed', {
        requestId,
        error: error instanceof Error ? error.message : 'unknown-error'
      });

      return reply.status(400).send(
        executeIntentResponseSchema.parse({
          requestId,
          plane: 'omnilinx',
          status: 'error',
          error: error instanceof Error ? error.message : 'unknown-error',
          auditHash
        })
      );
    }
  });

  return { app, env };
};
