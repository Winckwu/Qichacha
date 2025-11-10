import { Router } from 'express';

const router = Router();

// TODO: Implement pattern recognition routes

router.get('/current/:userId', (req, res) => {
  // Placeholder
  res.json({ pattern: 'A', confidence: 0.85 });
});

export default router;
