import { Router } from 'express';
import { independenceTracker } from '../services/skill-monitoring/independence-tracker';

const router = Router();

// GET /api/users/:userId/pattern - Get current user pattern
router.get('/:userId/pattern', (req, res) => {
  // TODO: Implement with real pattern recognition
  res.json({ pattern: 'A' });
});

// GET /api/users/:userId/independence-metrics - Get independence metrics
router.get('/:userId/independence-metrics', async (req, res) => {
  try {
    const metrics = await independenceTracker.getMetrics(req.params.userId);
    res.json(metrics);
  } catch (error: any) {
    console.error('Error fetching independence metrics:', error);
    res.status(500).json({
      error: 'Failed to fetch metrics',
      message: error.message,
    });
  }
});

export default router;
