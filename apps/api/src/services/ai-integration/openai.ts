import OpenAI from 'openai';
import type { AIResponse } from '../../types';

/**
 * OpenAI Integration Service
 */
class OpenAIService {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.warn('⚠️  OPENAI_API_KEY not set. OpenAI features will be disabled.');
    }

    this.client = new OpenAI({
      apiKey: apiKey || 'dummy-key',
    });
  }

  /**
   * Send a chat message to GPT-4
   */
  async chat(message: string, systemPrompt?: string): Promise<AIResponse> {
    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

      if (systemPrompt) {
        messages.push({
          role: 'system',
          content: systemPrompt,
        });
      }

      messages.push({
        role: 'user',
        content: message,
      });

      const completion = await this.client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
        // Enable logprobs to get confidence scores
        logprobs: true,
        top_logprobs: 5,
      });

      const choice = completion.choices[0];
      const content = choice.message.content || '';

      // Extract confidence from logprobs if available
      let rawConfidence: number | undefined;
      if (choice.logprobs && choice.logprobs.content) {
        rawConfidence = this.extractConfidenceFromLogprobs(choice.logprobs.content);
      }

      return {
        content,
        rawConfidence,
        model: 'gpt-4-turbo-preview',
      };
    } catch (error: any) {
      console.error('OpenAI API error:', error);

      // Re-throw with better error messages
      if (error.status === 429) {
        throw { status: 429, message: 'Rate limit exceeded' };
      } else if (error.status === 401) {
        throw { status: 401, message: 'Invalid API key' };
      }

      throw error;
    }
  }

  /**
   * Extract confidence score from logprobs
   * Higher average probability = higher confidence
   */
  private extractConfidenceFromLogprobs(logprobs: any[]): number {
    if (!logprobs || logprobs.length === 0) return 0.7; // Default

    // Calculate average probability across tokens
    let totalProb = 0;
    let count = 0;

    for (const tokenData of logprobs) {
      if (tokenData.logprob !== null) {
        // Convert log probability to probability
        const prob = Math.exp(tokenData.logprob);
        totalProb += prob;
        count++;
      }
    }

    if (count === 0) return 0.7;

    const avgConfidence = totalProb / count;
    return Math.min(1, Math.max(0, avgConfidence));
  }

  /**
   * Check if OpenAI is configured
   */
  isConfigured(): boolean {
    return !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'dummy-key';
  }
}

export const openAIService = new OpenAIService();
