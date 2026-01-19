import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const app: Express = express();
const PORT = process.env.PORT || 80;

// ============ MIDDLEWARE ============
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Request logging
app.use((req: Request, res: Response, next:  NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req. path}`);
  next();
});

// ============ AUTH MIDDLEWARE ============
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized:  Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'secret');
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};

// ============ GUARDIAN AI VETO MIDDLEWARE ============
const guardianVeto = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  const requestPath = req.path;
  
  // Example: Block unauthorized access to vault
  if (requestPath.includes('/vault') && user?.role !== 'OWNER') {
    console.warn(`[VETO] Privilege escalation attempt by ${user?.id}`);
    return res.status(403).json({
      error: 'FATAL VETO:  Unauthorized Plane Access',
      reason: 'Insufficient permissions for Financial Plane',
    });
  }

  // Example: Rate limiting for data extraction
  const requestCount = parseInt(req.get('x-request-count') || '0');
  if (requestCount > 100) {
    console.warn(`[VETO] High volume extraction detected from ${user?.id}`);
    return res.status(429).json({
      error: 'FATAL VETO: Rate limit exceeded',
      reason: 'Anomalous traffic pattern detected',
    });
  }

  next();
};

// ============ ROUTES ============
app.get('/health', (req: Request, res:  Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Service discovery
app.get('/services', (req: Request, res:  Response) => {
  res.json({
    gateway: 'http://lynxverse-gateway:80',
    security: 'http://security-validator:3001',
    finance: 'http://finance-ledger:3002',
    social: 'http://social-feed:3003',
    market:  'http://market-aggregator:3004',
    ai:  'http://quantum-nexus:8081',
  });
});

// Protected routes - proxy to backend services
app.post('/api/v1/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Call security-validator service
    const response = await fetch('http://security-validator:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Authentication service error' });
  }
});

app.get('/api/v1/profile/: userId', authMiddleware, guardianVeto, async (req:  Request, res: Response) => {
  try {
    const { userId } = req.params;

    const response = await fetch(`http://social-feed:3003/profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${req.get('authorization')}`,
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Social service error' });
  }
});

app.post('/api/v1/wallet/transfer', authMiddleware, guardianVeto, async (req: Request, res: Response) => {
  try {
    const { recipientId, amount, token } = req.body;
    const userId = (req as any).user.id;

    // Publish to Kafka for async processing
    console.log(`[FINANCE] Transfer queued:  ${userId} -> ${recipientId} (${amount} ${token})`);

    res.status(202).json({
      message: 'Transaction queued',
      transactionId: `TXN-${Date.now()}`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Transaction error' });
  }
});

app.listen(PORT, () => {
  console.log(`🦁 EternaLynX Gateway running on port ${PORT}`);
  console.log(`📍 Health:  http://localhost:${PORT}/health`);
  console.log(`🔗 Services: http://localhost:${PORT}/services`);
});
