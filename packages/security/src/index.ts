import { randomUUID, createHash } from 'crypto';
import { z } from 'zod';

const envSchema = z.object({
  API_PORT: z.coerce.number().int().positive().default(3001),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  AUDIT_LOG_PATH: z.string().min(1).default('./logs/audit.log'),
  CORS_ORIGIN: z.string().default('http://localhost:5173')
});

export type AppEnv = z.infer<typeof envSchema>;

export const loadEnv = (raw: Record<string, unknown>): AppEnv => envSchema.parse(raw);

export const newRequestId = (): string => randomUUID();

export const digestPayload = (payload: unknown): string =>
  createHash('sha256').update(JSON.stringify(payload)).digest('hex');
