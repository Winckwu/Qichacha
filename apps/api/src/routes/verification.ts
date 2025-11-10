import { Router } from 'express';

const router = Router();

// POST /api/verification/multi-model - Compare multiple models
router.post('/multi-model', (req, res) => {
  // TODO: Implement multi-model comparison
  res.status(501).json({ error: 'Not implemented yet' });
});

// POST /api/verification/fact-check - Check facts
router.post('/fact-check', (req, res) => {
  // TODO: Implement fact checking
  res.status(501).json({ error: 'Not implemented yet' });
});

export default router;
