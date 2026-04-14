import { z } from 'zod';

export const planeNameSchema = z.enum(['omnilinx', 'socialinx', 'capitalinx']);

export const executeIntentRequestSchema = z.object({
  plane: planeNameSchema,
  action: z.string().min(1).max(64),
  payload: z.record(z.unknown()).default({}),
  requestId: z.string().uuid(),
  identityId: z.string().min(3).max(128),
  timestamp: z.string().datetime()
});

export const executeIntentResponseSchema = z.object({
  requestId: z.string().uuid(),
  plane: planeNameSchema,
  status: z.enum(['ok', 'error']),
  data: z.record(z.unknown()).optional(),
  error: z.string().optional(),
  auditHash: z.string()
});

export type PlaneName = z.infer<typeof planeNameSchema>;
export type ExecuteIntentRequest = z.infer<typeof executeIntentRequestSchema>;
export type ExecuteIntentResponse = z.infer<typeof executeIntentResponseSchema>;

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.string(),
  timestamp: z.string().datetime()
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
