import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as dockerService from '../services/docker.js';

const router = Router();

// GET /api/server/status
router.get('/status', authMiddleware, async (_req: Request, res: Response) => {
  const status = await dockerService.getStatus();
  res.json(status);
});

// GET /api/server/stats
router.get('/stats', authMiddleware, async (_req: Request, res: Response) => {
  const stats = await dockerService.getStats();
  res.json(stats);
});

// POST /api/server/start
router.post('/start', authMiddleware, async (_req: Request, res: Response) => {
  const result = await dockerService.startContainer();
  if (!result.success) {
    res.status(500).json(result);
    return;
  }
  res.json(result);
});

// POST /api/server/stop
router.post('/stop', authMiddleware, async (_req: Request, res: Response) => {
  const result = await dockerService.stopContainer();
  if (!result.success) {
    res.status(500).json(result);
    return;
  }
  res.json(result);
});

// POST /api/server/restart
router.post('/restart', authMiddleware, async (_req: Request, res: Response) => {
  const result = await dockerService.restartContainer();
  if (!result.success) {
    res.status(500).json(result);
    return;
  }
  res.json(result);
});

export default router;
