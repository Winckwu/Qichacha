import request from 'supertest';
import express from 'express';
import chatRoutes from '../../routes/chat';
import { prisma } from '../../lib/prisma';

// Mock Prisma
jest.mock('../../lib/prisma', () => ({
  prisma: {
    interaction: {
      create: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    session: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

// Mock OpenAI service
jest.mock('../../services/ai-integration/openai', () => ({
  openAIService: {
    chat: jest.fn().mockResolvedValue({
      content: 'This is a test response from AI.',
      rawConfidence: 0.85,
      model: 'gpt-4-turbo-preview',
    }),
  },
}));

describe('Chat Flow Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/chat', chatRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/chat', () => {
    it('should complete full interaction with confidence scoring', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'What is the capital of France?',
          sessionId: 'test-session-123',
        })
        .expect(200);

      // Verify response structure
      expect(response.body).toHaveProperty('response');
      expect(response.body).toHaveProperty('confidence');

      // Verify confidence structure
      expect(response.body.confidence).toHaveProperty('score');
      expect(response.body.confidence).toHaveProperty('level');
      expect(response.body.confidence).toHaveProperty('factors');
      expect(response.body.confidence).toHaveProperty('explanation');

      // Verify confidence score is valid
      expect(response.body.confidence.score).toBeGreaterThanOrEqual(0);
      expect(response.body.confidence.score).toBeLessThanOrEqual(1);

      // Verify confidence level is one of the expected values
      expect(['high', 'moderate', 'low', 'critical']).toContain(
        response.body.confidence.level
      );
    });

    it('should handle missing message parameter', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          sessionId: 'test-session-123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('required');
    });

    it('should handle missing sessionId parameter', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Test message',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('required');
    });

    it('should handle empty message', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: '',
          sessionId: 'test-session-123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle very long messages', async () => {
      const longMessage = 'a'.repeat(10000);

      const response = await request(app)
        .post('/api/chat')
        .send({
          message: longMessage,
          sessionId: 'test-session-123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('response');
      expect(response.body).toHaveProperty('confidence');
    });

    it('should maintain session context', async () => {
      const sessionId = 'test-session-456';

      // First message
      await request(app)
        .post('/api/chat')
        .send({
          message: 'Hello, I need help with coding.',
          sessionId,
        })
        .expect(200);

      // Second message in same session
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Can you help me with Python?',
          sessionId,
        })
        .expect(200);

      expect(response.body).toHaveProperty('response');
    });
  });

  describe('Error Handling', () => {
    it('should handle OpenAI API errors gracefully', async () => {
      // Mock OpenAI to throw error
      const { openAIService } = require('../../services/ai-integration/openai');
      openAIService.chat.mockRejectedValueOnce(new Error('API Error'));

      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Test message',
          sessionId: 'test-session-789',
        })
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Failed to process message');
    });

    it('should handle rate limit errors', async () => {
      const { openAIService } = require('../../services/ai-integration/openai');
      const rateLimitError = new Error('Rate limit exceeded');
      (rateLimitError as any).status = 429;

      openAIService.chat.mockRejectedValueOnce(rateLimitError);

      const response = await request(app)
        .post('/api/chat')
        .send({
          message: 'Test message',
          sessionId: 'test-session-rate-limit',
        })
        .expect(429);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Rate limit');
    });
  });

  describe('Performance', () => {
    it('should respond within 2 seconds', async () => {
      const startTime = Date.now();

      await request(app)
        .post('/api/chat')
        .send({
          message: 'Quick test message',
          sessionId: 'test-session-perf',
        })
        .expect(200);

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(2000);
    });

    it('should handle concurrent requests', async () => {
      const requests = Array.from({ length: 5 }, (_, i) =>
        request(app)
          .post('/api/chat')
          .send({
            message: `Concurrent message ${i}`,
            sessionId: `test-session-concurrent-${i}`,
          })
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('response');
        expect(response.body).toHaveProperty('confidence');
      });
    });
  });
});
