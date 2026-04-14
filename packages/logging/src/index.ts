import { createHash } from 'crypto';
import { mkdirSync, appendFileSync } from 'fs';
import { dirname } from 'path';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogRecord {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export interface AuditEvent {
  requestId: string;
  identityId: string;
  plane: string;
  action: string;
  outcome: 'ok' | 'error';
  payloadDigest: string;
}

export class JsonLogger {
  constructor(private readonly minLevel: LogLevel = 'info') {}

  private levelRank(level: LogLevel): number {
    return ['debug', 'info', 'warn', 'error'].indexOf(level);
  }

  log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    if (this.levelRank(level) < this.levelRank(this.minLevel)) {
      return;
    }

    const record: LogRecord = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context
    };

    process.stdout.write(`${JSON.stringify(record)}\n`);
  }
}

export class AuditLogger {
  private previousHash = 'GENESIS';

  constructor(private readonly logPath: string) {
    mkdirSync(dirname(logPath), { recursive: true });
  }

  record(event: AuditEvent): string {
    const body = {
      ...event,
      timestamp: new Date().toISOString(),
      prev: this.previousHash
    };
    const currentHash = createHash('sha256').update(JSON.stringify(body)).digest('hex');
    const line = JSON.stringify({ ...body, hash: currentHash });
    appendFileSync(this.logPath, `${line}\n`, { encoding: 'utf-8' });
    this.previousHash = currentHash;
    return currentHash;
  }
}
