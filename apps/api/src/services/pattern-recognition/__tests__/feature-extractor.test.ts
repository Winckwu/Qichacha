import { FeatureExtractor } from '../feature-extractor';
import { Interaction } from '@prisma/client';

describe('FeatureExtractor', () => {
  let extractor: FeatureExtractor;
  let mockInteraction: Interaction;

  beforeEach(() => {
    extractor = new FeatureExtractor();

    mockInteraction = {
      id: 'test-interaction-1',
      sessionId: 'test-session-1',
      userMessage: 'This is a test message',
      aiResponse: 'This is a test response',
      confidence: 0.85,
      confidenceFactors: null,
      taskType: 'analysis',
      taskComplexity: 0.5,
      taskStakes: 'medium',
      usedAI: true,
      timestamp: new Date(),
    };
  });

  describe('detectTaskDecomposition', () => {
    it('should detect task decomposition with step indicators', () => {
      const message = 'First, we need to analyze the data. Then, step 2 is to visualize it.';
      expect(extractor.detectTaskDecomposition(message)).toBe(true);
    });

    it('should detect task decomposition with numbered lists', () => {
      const message = '1. Load the data\n2. Process it\n3. Save results';
      expect(extractor.detectTaskDecomposition(message)).toBe(true);
    });

    it('should detect task decomposition with part indicators', () => {
      const message = 'Part A involves setting up. Part B involves testing.';
      expect(extractor.detectTaskDecomposition(message)).toBe(true);
    });

    it('should not detect decomposition in simple messages', () => {
      const message = 'What is the weather like today?';
      expect(extractor.detectTaskDecomposition(message)).toBe(false);
    });
  });

  describe('detectExplicitGoal', () => {
    it('should detect explicit goal statements', () => {
      expect(extractor.detectExplicitGoal('My goal is to learn Python')).toBe(true);
      expect(extractor.detectExplicitGoal('I want to build a website')).toBe(true);
      expect(extractor.detectExplicitGoal('I need to fix this bug')).toBe(true);
      expect(extractor.detectExplicitGoal("I'm trying to understand React")).toBe(true);
    });

    it('should not detect goals in simple queries', () => {
      expect(extractor.detectExplicitGoal('What is React?')).toBe(false);
      expect(extractor.detectExplicitGoal('How does this work?')).toBe(false);
    });
  });

  describe('detectStrategyDiscussion', () => {
    it('should detect strategy discussion', () => {
      expect(extractor.detectStrategyDiscussion('My approach would be to...')).toBe(true);
      expect(extractor.detectStrategyDiscussion('I\'m thinking of using Redux')).toBe(true);
      expect(extractor.detectStrategyDiscussion('Should I use async/await?')).toBe(true);
    });

    it('should not detect strategy in simple questions', () => {
      expect(extractor.detectStrategyDiscussion('What is this?')).toBe(false);
    });
  });

  describe('countCriticalQuestions', () => {
    it('should count critical questioning indicators', () => {
      const message = 'Why does this happen? How do you know? What is the evidence?';
      expect(extractor.countCriticalQuestions(message)).toBeGreaterThan(0);
    });

    it('should return 0 for statements without questions', () => {
      const message = 'This is correct and I agree with it.';
      expect(extractor.countCriticalQuestions(message)).toBe(0);
    });
  });

  describe('inferTaskComplexity', () => {
    it('should give higher complexity for longer messages', () => {
      const shortMessage = 'Help me';
      const longMessage = 'a'.repeat(500) + ' and also consider ' + 'b'.repeat(500);

      const shortComplexity = extractor.inferTaskComplexity(shortMessage);
      const longComplexity = extractor.inferTaskComplexity(longMessage);

      expect(longComplexity).toBeGreaterThan(shortComplexity);
    });

    it('should give higher complexity for technical content', () => {
      const simpleMessage = 'What is a variable?';
      const technicalMessage = 'Explain the algorithm implementation and database architecture';

      const simpleComplexity = extractor.inferTaskComplexity(simpleMessage);
      const technicalComplexity = extractor.inferTaskComplexity(technicalMessage);

      expect(technicalComplexity).toBeGreaterThan(simpleComplexity);
    });

    it('should give higher complexity for decomposed tasks', () => {
      const simpleMessage = 'Help me with this';
      const decomposedMessage = 'First do step 1, then step 2, then step 3';

      const simpleComplexity = extractor.inferTaskComplexity(simpleMessage);
      const decomposedComplexity = extractor.inferTaskComplexity(decomposedMessage);

      expect(decomposedComplexity).toBeGreaterThan(simpleComplexity);
    });

    it('should cap complexity at 1.0', () => {
      const veryComplexMessage = 'a'.repeat(10000) + ' algorithm implementation database';
      const complexity = extractor.inferTaskComplexity(veryComplexMessage);

      expect(complexity).toBeLessThanOrEqual(1.0);
    });
  });

  describe('inferTaskStakes', () => {
    it('should detect high stakes tasks', () => {
      expect(extractor.inferTaskStakes('This is a production bug')).toBe('high');
      expect(extractor.inferTaskStakes('Critical deadline tomorrow')).toBe('high');
      expect(extractor.inferTaskStakes('Important client presentation')).toBe('high');
    });

    it('should detect low stakes tasks', () => {
      expect(extractor.inferTaskStakes('Just practicing and learning')).toBe('low');
      expect(extractor.inferTaskStakes('I\'m curious about this')).toBe('low');
      expect(extractor.inferTaskStakes('Experimenting with React')).toBe('low');
    });

    it('should default to medium stakes', () => {
      expect(extractor.inferTaskStakes('Help me understand this')).toBe('medium');
      expect(extractor.inferTaskStakes('How does this work?')).toBe('medium');
    });
  });

  describe('extractFromInteraction', () => {
    it('should extract all features from interaction', () => {
      const history: Interaction[] = [mockInteraction];

      const features = extractor.extractFromInteraction(mockInteraction, history);

      expect(features).toHaveProperty('taskDecompositionObserved');
      expect(features).toHaveProperty('explicitGoalStatement');
      expect(features).toHaveProperty('strategyDiscussion');
      expect(features).toHaveProperty('timeBeforeAI');
      expect(features).toHaveProperty('verificationRate');
      expect(features).toHaveProperty('taskComplexity');
      expect(features).toHaveProperty('taskStakes');
      expect(features).toHaveProperty('independenceRatio');

      // All numeric features should be between 0 and 1
      expect(features.verificationRate).toBeGreaterThanOrEqual(0);
      expect(features.verificationRate).toBeLessThanOrEqual(1);
      expect(features.taskComplexity).toBeGreaterThanOrEqual(0);
      expect(features.taskComplexity).toBeLessThanOrEqual(1);
      expect(features.independenceRatio).toBeGreaterThanOrEqual(0);
      expect(features.independenceRatio).toBeLessThanOrEqual(1);
    });

    it('should handle interactions with task decomposition', () => {
      mockInteraction.userMessage = 'First, do step 1. Then, do step 2.';

      const features = extractor.extractFromInteraction(mockInteraction, []);

      expect(features.taskDecompositionObserved).toBe(true);
    });

    it('should handle interactions with explicit goals', () => {
      mockInteraction.userMessage = 'My goal is to learn TypeScript';

      const features = extractor.extractFromInteraction(mockInteraction, []);

      expect(features.explicitGoalStatement).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty messages', () => {
      mockInteraction.userMessage = '';

      const features = extractor.extractFromInteraction(mockInteraction, []);

      expect(features.taskComplexity).toBeDefined();
      expect(features.taskStakes).toBeDefined();
    });

    it('should handle very long messages', () => {
      mockInteraction.userMessage = 'a'.repeat(100000);

      const features = extractor.extractFromInteraction(mockInteraction, []);

      expect(features.taskComplexity).toBeLessThanOrEqual(1.0);
    });

    it('should handle special characters', () => {
      mockInteraction.userMessage = '!@#$%^&*()_+{}:"<>?[];,./`~';

      const features = extractor.extractFromInteraction(mockInteraction, []);

      expect(features).toBeDefined();
    });
  });
});
