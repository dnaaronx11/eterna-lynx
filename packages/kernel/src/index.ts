import type { BridgeContract, PlaneHandler } from '@eternalynx/bridge';
import { EternaBridge } from '@eternalynx/bridge';
import type { ExecuteIntentRequest } from '@eternalynx/shared-types';

export class Kernel {
  private readonly bridge: BridgeContract;

  constructor(planeHandlers: PlaneHandler[]) {
    const bridge = new EternaBridge();
    planeHandlers.forEach((handler) => bridge.register(handler));
    this.bridge = bridge;
  }

  async execute(request: ExecuteIntentRequest): Promise<Record<string, unknown>> {
    return this.bridge.execute(request);
  }
}
