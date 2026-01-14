import { Router, Request, Response } from 'express';
import { verifyCredentials, createAccessToken, createRefreshToken, verifyToken } from '../services/auth.js';
import { authMiddleware } from '../middleware/auth.js';
import type { AuthenticatedRequest, LoginRequest } from '../types/index.js';

const router = Router();

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body as LoginRequest;

  if (!username || !password) {
    res.status(400).json({ detail: 'Username and password required' });
    return;
  }

  if (!verifyCredentials(username, password)) {
    res.status(401).json({ detail: 'Invalid credentials' });
    return;
  }

  const accessToken = createAccessToken(username);
  const refreshToken = createRefreshToken(username);

  res.json({
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: 'bearer',
  });
});

// POST /api/auth/refresh
router.post('/refresh', (req: Request, res: Response) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    res.status(400).json({ detail: 'Refresh token required' });
    return;
  }

  const username = verifyToken(refresh_token, 'refresh');

  if (!username) {
    res.status(401).json({ detail: 'Invalid or expired refresh token' });
    return;
  }

  const accessToken = createAccessToken(username);
  const newRefreshToken = createRefreshToken(username);

  res.json({
    access_token: accessToken,
    refresh_token: newRefreshToken,
    token_type: 'bearer',
  });
});

// POST /api/auth/logout
router.post('/logout', authMiddleware, (_req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({ username: req.user });
});

export default router;
