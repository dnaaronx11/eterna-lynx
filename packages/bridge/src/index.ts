import type { ExecuteIntentRequest } from '@eternalynx/shared-types';

export interface PlaneHandler {
  readonly plane: string;
  handle(action: string, payload: Record<string, unknown>): Promise<Record<string, unknown>>;
}

export interface BridgeContract {
  execute(request: ExecuteIntentRequest): Promise<Record<string, unknown>>;
}

export class EternaBridge implements BridgeContract {
  private handlers = new Map<string, PlaneHandler>();

  register(handler: PlaneHandler): void {
    if (this.handlers.has(handler.plane)) {
      throw new Error(`Plane already registered: ${handler.plane}`);
    }
    this.handlers.set(handler.plane, handler);
  }

  async execute(request: ExecuteIntentRequest): Promise<Record<string, unknown>> {
    const handler = this.handlers.get(request.plane);
    if (!handler) {
      throw new Error(`Plane not available via bridge: ${request.plane}`);
    }

    return handler.handle(request.action, request.payload);
  }
}
