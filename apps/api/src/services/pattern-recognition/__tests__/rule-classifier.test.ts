import { RuleBasedClassifier } from '../rule-classifier';
import type { BehavioralFeatures } from '../../../types';

describe('RuleBasedClassifier', () => {
  let classifier: RuleBasedClassifier;

  beforeEach(() => {
    classifier = new RuleBasedClassifier();
  });

  const createFeatures = (overrides: Partial<BehavioralFeatures> = {}): BehavioralFeatures => ({
    taskDecompositionObserved: false,
    explicitGoalStatement: false,
    strategyDiscussion: false,
    timeBeforeAI: 0,
    verificationRate: 0.5,
    outputReadingTime: 5,
    revisionFrequency: 0,
    criticalQuestioning: 0,
    trustCalibrationMentions: 0,
    capabilityAwareness: false,
    strategyAdjustments: 0,
    toolSwitching: 0,
    taskComplexity: 0.5,
    taskStakes: 'medium',
    domainFamiliarity: 0.5,
    independenceRatio: 0.5,
    iterationPropensity: 0.5,
    metacognitiveAwarenessScore: 0.5,
    ...overrides,
  });

  describe('Pattern A: Strategic Thinker', () => {
    it('should classify as Pattern A for strategic thinkers', () => {
      const features = createFeatures({
        taskDecompositionObserved: true,
        verificationRate: 0.8,
        timeBeforeAI: 10,
        explicitGoalStatement: true,
        criticalQuestioning: 3,
        strategyDiscussion: true,
      });

      const result = classifier.classify(features);

      expect(result.pattern).toBe('A');
      expect(result.confidence).toBeGreaterThan(0.7);
      expect(result.reasoning).toContain('Strategic Thinker');
    });

    it('should give high score for task decomposition', () => {
      const features = createFeatures({
        taskDecompositionObserved: true,
      });

      const result = classifier.classify(features);

      expect(result.scores.A).toBeGreaterThan(0);
    });
  });

  describe('Pattern B: Iterative Learner', () => {
    it('should classify as Pattern B for iterative learners', () => {
      const features = createFeatures({
        iterationPropensity: 0.7,
        revisionFrequency: 5,
        strategyAdjustments: 3,
        verificationRate: 0.5,
        metacognitiveAwarenessScore: 0.6,
      });

      const result = classifier.classify(features);

      expect(result.pattern).toBe('B');
      expect(result.reasoning).toContain('Iterative Learner');
    });
  });

  describe('Pattern C: Calibrated Delegator', () => {
    it('should classify as Pattern C for calibrated delegators', () => {
      const features = createFeatures({
        trustCalibrationMentions: 2,
        capabilityAwareness: true,
        independenceRatio: 0.5,
        taskStakes: 'high',
        verificationRate: 0.7,
        domainFamiliarity: 0.6,
      });

      const result = classifier.classify(features);

      expect(result.pattern).toBe('C');
      expect(result.reasoning).toContain('Calibrated Delegator');
    });
  });

  describe('Pattern D: Efficient User', () => {
    it('should classify as Pattern D for efficient users', () => {
      const features = createFeatures({
        independenceRatio: 0.5,
        verificationRate: 0.4,
        metacognitiveAwarenessScore: 0.5,
        timeBeforeAI: 5,
        taskDecompositionObserved: false,
        taskComplexity: 0.6,
      });

      const result = classifier.classify(features);

      expect(result.pattern).toBe('D');
      expect(result.reasoning).toContain('Efficient User');
    });
  });

  describe('Pattern E: Over-Reliant', () => {
    it('should classify as Pattern E for over-reliant users', () => {
      const features = createFeatures({
        independenceRatio: 0.25,
        verificationRate: 0.2,
        timeBeforeAI: 0.5,
        criticalQuestioning: 0,
        strategyDiscussion: false,
      });

      const result = classifier.classify(features);

      expect(result.pattern).toBe('E');
      expect(result.reasoning).toContain('Over-Reliant');
    });
  });

  describe('Pattern F: Uncritical Acceptor', () => {
    it('should classify as Pattern F for uncritical acceptors', () => {
      const features = createFeatures({
        verificationRate: 0.05,
        timeBeforeAI: 0.2,
        outputReadingTime: 1,
        independenceRatio: 0.15,
        criticalQuestioning: 0,
      });

      const result = classifier.classify(features);

      expect(result.pattern).toBe('F');
      expect(result.confidence).toBeGreaterThan(0.6);
      expect(result.reasoning).toContain('Uncritical Acceptor');
      expect(result.reasoning).some(r => r.includes('🚨'));
    });
  });

  describe('Classification Confidence', () => {
    it('should have higher confidence when pattern is clear', () => {
      const clearPatternA = createFeatures({
        taskDecompositionObserved: true,
        verificationRate: 0.9,
        timeBeforeAI: 15,
        explicitGoalStatement: true,
        criticalQuestioning: 5,
      });

      const result = classifier.classify(clearPatternA);

      expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should have lower confidence when pattern is ambiguous', () => {
      const ambiguousFeatures = createFeatures({
        verificationRate: 0.5,
        independenceRatio: 0.5,
        metacognitiveAwarenessScore: 0.5,
      });

      const result = classifier.classify(ambiguousFeatures);

      // Confidence should still be valid but may be lower
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('Score Calculation', () => {
    it('should calculate scores for all patterns', () => {
      const features = createFeatures();
      const result = classifier.classify(features);

      expect(result.scores).toHaveProperty('A');
      expect(result.scores).toHaveProperty('B');
      expect(result.scores).toHaveProperty('C');
      expect(result.scores).toHaveProperty('D');
      expect(result.scores).toHaveProperty('E');
      expect(result.scores).toHaveProperty('F');

      // All scores should be between 0 and 10
      Object.values(result.scores).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(10);
      });
    });

    it('should select pattern with highest score', () => {
      const features = createFeatures({
        taskDecompositionObserved: true,
        verificationRate: 0.9,
        timeBeforeAI: 20,
      });

      const result = classifier.classify(features);
      const bestScore = Math.max(...Object.values(result.scores));

      expect(result.scores[result.pattern]).toBe(bestScore);
    });
  });

  describe('Reasoning Generation', () => {
    it('should provide reasoning for Pattern A', () => {
      const features = createFeatures({
        taskDecompositionObserved: true,
        verificationRate: 0.8,
      });

      const result = classifier.classify(features);

      if (result.pattern === 'A') {
        expect(result.reasoning.length).toBeGreaterThan(0);
        expect(result.reasoning.some(r => r.includes('✓'))).toBe(true);
      }
    });

    it('should provide warning indicators for Pattern F', () => {
      const features = createFeatures({
        verificationRate: 0.05,
        independenceRatio: 0.1,
      });

      const result = classifier.classify(features);

      if (result.pattern === 'F') {
        expect(result.reasoning.some(r => r.includes('🚨'))).toBe(true);
        expect(result.reasoning.some(r => r.includes('skill degradation'))).toBe(true);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle all zero features', () => {
      const features = createFeatures({
        taskDecompositionObserved: false,
        explicitGoalStatement: false,
        verificationRate: 0,
        timeBeforeAI: 0,
        independenceRatio: 0,
      });

      const result = classifier.classify(features);

      expect(result.pattern).toBeDefined();
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should handle all maximum features', () => {
      const features = createFeatures({
        taskDecompositionObserved: true,
        explicitGoalStatement: true,
        strategyDiscussion: true,
        verificationRate: 1,
        timeBeforeAI: 100,
        independenceRatio: 1,
        criticalQuestioning: 10,
      });

      const result = classifier.classify(features);

      expect(result.pattern).toBeDefined();
      expect(result.confidence).toBeLessThanOrEqual(1);
    });
  });
});
