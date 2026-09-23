import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const app: Express = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// ============ MODELS ============
interface User {
  id: string;
  email:  string;
  did: string;
  biometricHash?:  string;
  trustScore:  number;
  createdAt: Date;
}

// ============ ROUTES ============
app.get('/health', (req: Request, res:  Response) => {
  res.json({ status: 'healthy', service: 'security-validator' });
});

/**
 * POST /auth/login
 * Authenticate user via email/password OR DID + biometric
 */
app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password, did, biometricToken } = req.body;

    let user: User | null = null;

    // Traditional login
    if (email && password) {
      user = await prisma.user. findUnique({ where: { email } });
      
      if (!user || !await verifyPassword(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }
    // DID + Biometric (Self-Sovereign Identity)
    else if (did && biometricToken) {
      user = await prisma. user.findUnique({ where: { did } });
      
      if (!user || !await verifyBiometric(biometricToken, user. biometricHash)) {
        return res.status(401).json({ error: 'Biometric verification failed' });
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'USER' },
      process.env. JWT_SECRET_KEY || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user:  {
        id: user.id,
        email: user.email,
        did: user.did,
        trustScore: user.trustScore,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication service error' });
  }
});

/**
 * POST /vault/encrypt-and-hide
 * VaultLynX:  Encrypt and hide keys using steganography
 */
app. post('/vault/encrypt-and-hide', async (req: Request, res: Response) => {
  try {
    const { hostImagePath, keyData } = req.body;

    // Placeholder:  Real implementation uses steganographic encryption
    const stegoKey = await encryptAndHideKey(keyData, hostImagePath);

    res.json({
      message: 'Key successfully embedded in steganographic image',
      stegoImagePath: stegoKey,
      hiddenKeyId: `KEY-${Date.now()}`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Steganography error' });
  }
});

/**
 * POST /vault/retrieve-and-decrypt
 * VaultLynX: Retrieve and decrypt keys using biometric verification
 */
app. post('/vault/retrieve-and-decrypt', async (req: Request, res: Response) => {
  try {
    const { embeddedImagePath, biometricToken } = req.body;

    // Verify biometric
    const isValid = await verifyBiometricToken(biometricToken);
    if (!isValid) {
      return res.status(401).json({ error: 'Biometric verification failed' });
    }

    // Placeholder: Real implementation retrieves from steganographic image
    const decryptedKey = await retrieveAndDecryptKey(embeddedImagePath);

    res.json({
      message: 'Key successfully decrypted',
      key: decryptedKey,
      retrievedAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Key retrieval error' });
  }
});

/**
 * GET /profile/:userId
 * Retrieve user profile
 */
app.get('/profile/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        did: true,
        trustScore: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Profile retrieval error' });
  }
});

// ============ HELPER FUNCTIONS ============
async function verifyPassword(password:  string, hash: string): Promise<boolean> {
  // Placeholder: Use bcrypt in production
  return password === hash;
}

async function verifyBiometric(token:  string, storedHash?:  string): Promise<boolean> {
  // Placeholder: Real implementation validates retinal scan token
  return !!token && !!storedHash;
}

async function verifyBiometricToken(token: string): Promise<boolean> {
  // Placeholder:  Verify biometric token validity
  return !!token;
}

async function encryptAndHideKey(keyData: string, hostImage: string): Promise<string> {
  // Placeholder:  Steganographic encryption
  return `stego_key_${Date.now()}. jpg`;
}

async function retrieveAndDecryptKey(imagePath: string): Promise<string> {
  // Placeholder:  Steganographic decryption
  return 'decrypted_key_placeholder';
}

app.listen(PORT, () => {
  console.log(`🔐 SecuriLynX (Security Validator) running on port ${PORT}`);
});

export default app;
