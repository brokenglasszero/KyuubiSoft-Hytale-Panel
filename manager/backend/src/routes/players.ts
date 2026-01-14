import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as playersService from '../services/players.js';
import * as dockerService from '../services/docker.js';

const router = Router();

// GET /api/players
router.get('/', authMiddleware, async (_req: Request, res: Response) => {
  const players = await playersService.getOnlinePlayers();

  res.json({
    players,
    count: players.length,
  });
});

// GET /api/players/count
router.get('/count', authMiddleware, async (_req: Request, res: Response) => {
  const count = await playersService.getPlayerCount();
  res.json({ count });
});

// POST /api/players/:name/kick
router.post('/:name/kick', authMiddleware, async (req: Request, res: Response) => {
  const playerName = req.params.name;

  // Send kick command to server
  const result = await dockerService.execCommand(`/kick ${playerName}`);

  if (result.success) {
    playersService.removePlayer(playerName);
    res.json({
      success: true,
      message: `Player ${playerName} kicked`,
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Failed to kick player',
    });
  }
});

// POST /api/players/:name/ban
router.post('/:name/ban', authMiddleware, async (req: Request, res: Response) => {
  const playerName = req.params.name;

  const result = await dockerService.execCommand(`/ban ${playerName}`);

  if (result.success) {
    playersService.removePlayer(playerName);
    res.json({
      success: true,
      message: `Player ${playerName} banned`,
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Failed to ban player',
    });
  }
});

// DELETE /api/players/:name/ban
router.delete('/:name/ban', authMiddleware, async (req: Request, res: Response) => {
  const playerName = req.params.name;

  const result = await dockerService.execCommand(`/unban ${playerName}`);

  if (result.success) {
    res.json({
      success: true,
      message: `Player ${playerName} unbanned`,
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Failed to unban player',
    });
  }
});

// POST /api/players/:name/whitelist
router.post('/:name/whitelist', authMiddleware, async (req: Request, res: Response) => {
  const playerName = req.params.name;

  const result = await dockerService.execCommand(`/whitelist add ${playerName}`);

  if (result.success) {
    res.json({
      success: true,
      message: `Player ${playerName} added to whitelist`,
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Failed to add to whitelist',
    });
  }
});

// DELETE /api/players/:name/whitelist
router.delete('/:name/whitelist', authMiddleware, async (req: Request, res: Response) => {
  const playerName = req.params.name;

  const result = await dockerService.execCommand(`/whitelist remove ${playerName}`);

  if (result.success) {
    res.json({
      success: true,
      message: `Player ${playerName} removed from whitelist`,
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Failed to remove from whitelist',
    });
  }
});

// POST /api/players/:name/op
router.post('/:name/op', authMiddleware, async (req: Request, res: Response) => {
  const playerName = req.params.name;

  const result = await dockerService.execCommand(`/op add ${playerName}`);

  if (result.success) {
    res.json({
      success: true,
      message: `Player ${playerName} is now an operator`,
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Failed to op player',
    });
  }
});

// DELETE /api/players/:name/op
router.delete('/:name/op', authMiddleware, async (req: Request, res: Response) => {
  const playerName = req.params.name;

  const result = await dockerService.execCommand(`/op remove ${playerName}`);

  if (result.success) {
    res.json({
      success: true,
      message: `Player ${playerName} is no longer an operator`,
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Failed to deop player',
    });
  }
});

// POST /api/players/:name/message
router.post('/:name/message', authMiddleware, async (req: Request, res: Response) => {
  const playerName = req.params.name;
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Message is required',
    });
    return;
  }

  const result = await dockerService.execCommand(`/msg ${playerName} ${message}`);

  if (result.success) {
    res.json({
      success: true,
      message: `Message sent to ${playerName}`,
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Failed to send message',
    });
  }
});

// POST /api/players/:name/teleport
router.post('/:name/teleport', authMiddleware, async (req: Request, res: Response) => {
  const playerName = req.params.name;
  const { target, x, y, z } = req.body;

  let command: string;
  if (target) {
    // Teleport to another player
    command = `/teleport playertoplayer ${playerName} ${target}`;
  } else if (x !== undefined && y !== undefined && z !== undefined) {
    // Teleport to coordinates
    command = `/teleport tocoordinates ${playerName} ${x} ${y} ${z}`;
  } else {
    res.status(400).json({
      success: false,
      error: 'Either target player or coordinates (x, y, z) required',
    });
    return;
  }

  const result = await dockerService.execCommand(command);

  if (result.success) {
    res.json({
      success: true,
      message: target ? `Teleported ${playerName} to ${target}` : `Teleported ${playerName} to ${x}, ${y}, ${z}`,
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Failed to teleport player',
    });
  }
});

// POST /api/players/:name/kill
router.post('/:name/kill', authMiddleware, async (req: Request, res: Response) => {
  const playerName = req.params.name;

  const result = await dockerService.execCommand(`/kill ${playerName}`);

  if (result.success) {
    res.json({
      success: true,
      message: `Player ${playerName} killed`,
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Failed to kill player',
    });
  }
});

// POST /api/players/:name/respawn
router.post('/:name/respawn', authMiddleware, async (req: Request, res: Response) => {
  const playerName = req.params.name;

  const result = await dockerService.execCommand(`/player respawn ${playerName}`);

  if (result.success) {
    res.json({
      success: true,
      message: `Player ${playerName} respawned`,
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Failed to respawn player',
    });
  }
});

// POST /api/players/:name/gamemode
router.post('/:name/gamemode', authMiddleware, async (req: Request, res: Response) => {
  const playerName = req.params.name;
  const { gamemode } = req.body;

  if (!gamemode) {
    res.status(400).json({
      success: false,
      error: 'Gamemode is required',
    });
    return;
  }

  const result = await dockerService.execCommand(`/gamemode ${gamemode} ${playerName}`);

  if (result.success) {
    res.json({
      success: true,
      message: `Set ${playerName}'s gamemode to ${gamemode}`,
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Failed to change gamemode',
    });
  }
});

// POST /api/players/:name/give
router.post('/:name/give', authMiddleware, async (req: Request, res: Response) => {
  const playerName = req.params.name;
  const { item, amount } = req.body;

  if (!item) {
    res.status(400).json({
      success: false,
      error: 'Item is required',
    });
    return;
  }

  const command = amount ? `/give ${playerName} ${item} ${amount}` : `/give ${playerName} ${item}`;
  const result = await dockerService.execCommand(command);

  if (result.success) {
    res.json({
      success: true,
      message: `Gave ${amount || 1} ${item} to ${playerName}`,
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Failed to give item',
    });
  }
});

// POST /api/players/:name/heal
router.post('/:name/heal', authMiddleware, async (req: Request, res: Response) => {
  const playerName = req.params.name;

  const result = await dockerService.execCommand(`/player stats settomax ${playerName} health`);

  if (result.success) {
    res.json({
      success: true,
      message: `Player ${playerName} healed`,
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Failed to heal player',
    });
  }
});

// POST /api/players/:name/effect
router.post('/:name/effect', authMiddleware, async (req: Request, res: Response) => {
  const playerName = req.params.name;
  const { effect, action } = req.body;

  if (!effect) {
    res.status(400).json({
      success: false,
      error: 'Effect is required',
    });
    return;
  }

  const command = action === 'clear'
    ? `/player effect clear ${playerName}`
    : `/player effect apply ${playerName} ${effect}`;
  const result = await dockerService.execCommand(command);

  if (result.success) {
    res.json({
      success: true,
      message: action === 'clear' ? `Cleared effects from ${playerName}` : `Applied ${effect} to ${playerName}`,
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Failed to apply effect',
    });
  }
});

// POST /api/players/:name/inventory/clear
router.post('/:name/inventory/clear', authMiddleware, async (req: Request, res: Response) => {
  const playerName = req.params.name;

  const result = await dockerService.execCommand(`/inventory clear ${playerName}`);

  if (result.success) {
    res.json({
      success: true,
      message: `Cleared ${playerName}'s inventory`,
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Failed to clear inventory',
    });
  }
});

export default router;
