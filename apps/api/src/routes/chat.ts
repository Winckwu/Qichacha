import { Router } from 'express';
import { chatController } from '../controllers/chatController';

const router = Router();

// POST /api/chat - Send a message
router.post('/', chatController.sendMessage);

export default router;
