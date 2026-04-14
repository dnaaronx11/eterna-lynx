import { createHash, generateKeyPairSync, sign } from 'crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';

interface IdentityRecord {
  identityId: string;
  publicKeyPem: string;
  privateKeyPem: string;
}

export class LocalIdentity {
  private readonly record: IdentityRecord;

  constructor(private readonly storagePath: string) {
    mkdirSync(dirname(storagePath), { recursive: true });
    this.record = this.loadOrCreate();
  }

  private loadOrCreate(): IdentityRecord {
    if (existsSync(this.storagePath)) {
      return JSON.parse(readFileSync(this.storagePath, 'utf-8')) as IdentityRecord;
    }

    const { publicKey, privateKey } = generateKeyPairSync('ed25519');
    const publicKeyPem = publicKey.export({ type: 'spki', format: 'pem' }).toString();
    const privateKeyPem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
    const identityId = `local-${createHash('sha256').update(publicKeyPem).digest('hex').slice(0, 16)}`;

    const record: IdentityRecord = { identityId, publicKeyPem, privateKeyPem };
    writeFileSync(this.storagePath, JSON.stringify(record, null, 2), 'utf-8');
    return record;
  }

  getIdentityId(): string {
    return this.record.identityId;
  }

  signPayload(payload: Record<string, unknown>): string {
    const normalized = JSON.stringify(payload);
    const signature = sign(null, Buffer.from(normalized), this.record.privateKeyPem);
    return signature.toString('base64');
  }
}
