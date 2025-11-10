import { Request, Response } from 'express';
import { openAIService } from '../services/ai-integration/openai';
import { confidenceCalculator } from '../services/confidence/calculator';
import { prisma } from '../lib/prisma';

export const chatController = {
  sendMessage: async (req: Request, res: Response) => {
    try {
      const { message, sessionId } = req.body;

      if (!message || !sessionId) {
        return res.status(400).json({ error: 'Message and sessionId are required' });
      }

      // TODO: Verify session exists or create it
      // For now, we'll proceed without strict validation

      // Call OpenAI API
      const aiResponse = await openAIService.chat(message);

      // Calculate confidence
      const confidence = await confidenceCalculator.computeConfidence(
        message,
        '',
        aiResponse.content
      );

      // TODO: Save interaction to database
      // await prisma.interaction.create({...})

      res.json({
        response: aiResponse.content,
        confidence,
      });
    } catch (error: any) {
      console.error('Chat error:', error);

      if (error.status === 429) {
        return res.status(429).json({
          error: 'Rate limit exceeded. Please try again in a moment.'
        });
      }

      res.status(500).json({
        error: 'Failed to process message',
        message: error.message
      });
    }
  },
};
