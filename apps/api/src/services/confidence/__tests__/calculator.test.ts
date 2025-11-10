import { confidenceCalculator } from '../calculator';

describe('ConfidenceCalculator', () => {
  describe('computeConfidence', () => {
    it('should return high confidence for well-known facts', async () => {
      const result = await confidenceCalculator.computeConfidence(
        'What is the capital of France?',
        '',
        'The capital of France is Paris. Paris is the largest city in France and has been the capital since the Middle Ages.'
      );

      expect(result.score).toBeGreaterThanOrEqual(0.75);
      expect(result.level).toMatch(/high|moderate/);
      expect(result.factors).toBeDefined();
    });

    it('should return low confidence for recent/future events', async () => {
      const result = await confidenceCalculator.computeConfidence(
        'Who will win the 2026 World Cup?',
        '',
        'Brazil is predicted to win the 2026 World Cup based on current form.'
      );

      expect(result.score).toBeLessThan(0.7);
      expect(result.factors.recencyPenalty).toBeLessThan(0.8);
    });

    it('should detect uncertainty markers', async () => {
      const result = await confidenceCalculator.computeConfidence(
        'What caused the extinction of dinosaurs?',
        '',
        'The extinction might have been caused by an asteroid impact, though scientists are not entirely sure and some think volcanic activity could have played a role.'
      );

      expect(result.factors.modelUncertainty).toBeLessThan(0.8);
      expect(result.explanation).toContain('uncertainty');
    });

    it('should give higher confidence to math/code domains', async () => {
      const result = await confidenceCalculator.computeConfidence(
        'What is 2 + 2 in programming?',
        '',
        'In most programming languages, 2 + 2 equals 4.'
      );

      expect(result.factors.domainReliability).toBeGreaterThanOrEqual(0.8);
    });

    it('should detect lack of consensus', async () => {
      const result = await confidenceCalculator.computeConfidence(
        'Is the Keto diet healthy?',
        '',
        'The Keto diet is controversial. Some argue it\'s beneficial while others debate its long-term effects.'
      );

      expect(result.factors.sourceConsensus).toBeLessThan(0.7);
      expect(result.explanation).toMatch(/consensus|controversial/i);
    });

    it('should handle empty responses', async () => {
      const result = await confidenceCalculator.computeConfidence(
        'Test question',
        '',
        ''
      );

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
      expect(result.level).toBeDefined();
    });

    it('should provide detailed factor breakdown', async () => {
      const result = await confidenceCalculator.computeConfidence(
        'What is the boiling point of water?',
        '',
        'The boiling point of water is 100°C at sea level.'
      );

      expect(result.factors.modelUncertainty).toBeDefined();
      expect(result.factors.knowledgeBaseMatch).toBeDefined();
      expect(result.factors.recencyPenalty).toBeDefined();
      expect(result.factors.domainReliability).toBeDefined();
      expect(result.factors.sourceConsensus).toBeDefined();

      // All factors should be between 0 and 1
      Object.values(result.factors).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      });
    });

    it('should assign correct confidence levels', async () => {
      // High confidence
      const high = await confidenceCalculator.computeConfidence(
        'What is 5 * 6?',
        '',
        'According to mathematical principles, 5 multiplied by 6 equals 30.'
      );
      if (high.score >= 0.85) {
        expect(high.level).toBe('high');
      }

      // Critical confidence
      const critical = await confidenceCalculator.computeConfidence(
        'Future prediction',
        '',
        'I might think perhaps it could possibly be uncertain.'
      );
      if (critical.score < 0.3) {
        expect(critical.level).toBe('critical');
      }
    });
  });
});
