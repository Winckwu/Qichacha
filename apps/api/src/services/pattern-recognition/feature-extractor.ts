import type { BehavioralFeatures } from '../../types';
import { Interaction } from '@prisma/client';

/**
 * Feature Extractor Service
 * Extracts behavioral features from user interactions
 */
export class FeatureExtractor {
  /**
   * Extract features from a single interaction and user history
   */
  extractFromInteraction(
    interaction: Interaction,
    userHistory: Interaction[]
  ): BehavioralFeatures {
    return {
      // Planning indicators
      taskDecompositionObserved: this.detectTaskDecomposition(interaction.userMessage),
      explicitGoalStatement: this.detectExplicitGoal(interaction.userMessage),
      strategyDiscussion: this.detectStrategyDiscussion(interaction.userMessage),
      timeBeforeAI: this.calculateTimeBeforeAI(interaction, userHistory),

      // Monitoring indicators
      verificationRate: this.calculateVerificationRate(userHistory, 30),
      outputReadingTime: this.estimateReadingTime(interaction.aiResponse),
      revisionFrequency: this.countRevisions(userHistory, 7),

      // Evaluation indicators
      criticalQuestioning: this.countCriticalQuestions(interaction.userMessage),
      trustCalibrationMentions: this.countTrustMentions(interaction.userMessage),
      capabilityAwareness: this.detectCapabilityAwareness(interaction.userMessage),

      // Regulation indicators
      strategyAdjustments: this.countStrategyAdjustments(userHistory, 5),
      toolSwitching: this.countToolSwitching(userHistory, 5),

      // Task context
      taskComplexity: this.inferTaskComplexity(interaction.userMessage),
      taskStakes: this.inferTaskStakes(interaction.userMessage),
      domainFamiliarity: this.inferDomainFamiliarity(interaction.userMessage, userHistory),

      // Longitudinal indicators
      independenceRatio: this.calculateIndependenceRatio(userHistory, 30),
      iterationPropensity: this.calculateIterationPropensity(userHistory, 10),
      metacognitiveAwarenessScore: this.calculateMetacognitiveScore(userHistory, 10),
    };
  }

  /**
   * Detect task decomposition in message
   */
  detectTaskDecomposition(message: string): boolean {
    const decompositionPatterns = [
      /\bfirst\b.*\bthen\b/i,
      /\bstep\s+\d+/i,
      /\bpart\s+[A-Za-z0-9]+/i,
      /\b(1\.|2\.|3\.)/,
      /\bbegin by\b.*\bnext\b/i,
      /\binitially\b.*\bsubsequently\b/i,
    ];

    return decompositionPatterns.some(pattern => pattern.test(message));
  }

  /**
   * Detect explicit goal statements
   */
  detectExplicitGoal(message: string): boolean {
    const goalPatterns = [
      /\b(my goal is|i want to|i need to|i'm trying to)\b/i,
      /\b(the objective is|the aim is)\b/i,
      /\b(i'm working on|i'm attempting to)\b/i,
    ];

    return goalPatterns.some(pattern => pattern.test(message));
  }

  /**
   * Detect strategy discussion
   */
  detectStrategyDiscussion(message: string): boolean {
    const strategyPatterns = [
      /\b(my approach|my strategy|my plan)\b/i,
      /\b(i'm thinking of|i'm considering)\b/i,
      /\b(should i|would it be better to)\b/i,
      /\b(alternative|another way|different approach)\b/i,
    ];

    return strategyPatterns.some(pattern => pattern.test(message));
  }

  /**
   * Calculate time before AI (minutes)
   */
  calculateTimeBeforeAI(interaction: Interaction, history: Interaction[]): number {
    if (history.length === 0) return 0;

    const sessionStart = history[0].timestamp;
    const currentTime = interaction.timestamp;
    const diffMs = currentTime.getTime() - sessionStart.getTime();
    return diffMs / (1000 * 60); // Convert to minutes
  }

  /**
   * Calculate verification rate (0-1)
   */
  calculateVerificationRate(history: Interaction[], windowDays: number): number {
    if (history.length === 0) return 0;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - windowDays);

    const recentInteractions = history.filter(i => i.timestamp >= cutoffDate);
    if (recentInteractions.length === 0) return 0;

    // Check for verification behaviors in messages
    const verificationPatterns = [
      /\b(verify|check|confirm|validate)\b/i,
      /\b(is this correct|is that right|are you sure)\b/i,
      /\b(can you double-check|let me verify)\b/i,
    ];

    const verificationsCount = recentInteractions.filter(interaction =>
      verificationPatterns.some(pattern => pattern.test(interaction.userMessage))
    ).length;

    return verificationsCount / recentInteractions.length;
  }

  /**
   * Estimate reading time (seconds per 100 words)
   */
  estimateReadingTime(aiResponse: string): number {
    const words = aiResponse.split(/\s+/).length;
    const avgReadingSpeed = 200; // words per minute
    const timeSeconds = (words / avgReadingSpeed) * 60;
    return (timeSeconds / words) * 100; // seconds per 100 words
  }

  /**
   * Count revisions in recent history
   */
  countRevisions(history: Interaction[], windowDays: number): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - windowDays);

    const recentInteractions = history.filter(i => i.timestamp >= cutoffDate);

    const revisionPatterns = [
      /\b(actually|wait|correction|i meant)\b/i,
      /\b(let me rephrase|let me clarify)\b/i,
      /\b(edit|modify|change that)\b/i,
    ];

    return recentInteractions.filter(interaction =>
      revisionPatterns.some(pattern => pattern.test(interaction.userMessage))
    ).length;
  }

  /**
   * Count critical questions
   */
  countCriticalQuestions(message: string): number {
    const criticalPatterns = [
      /\bwhy\b/gi,
      /\bhow do you know\b/gi,
      /\bwhat's the evidence\b/gi,
      /\bcan you explain\b/gi,
      /\bwhat makes you say\b/gi,
    ];

    let count = 0;
    criticalPatterns.forEach(pattern => {
      const matches = message.match(pattern);
      if (matches) count += matches.length;
    });

    return count;
  }

  /**
   * Count trust calibration mentions
   */
  countTrustMentions(message: string): number {
    const trustPatterns = [
      /\b(trust|reliable|accurate|confident)\b/gi,
      /\b(believe|faith|credible)\b/gi,
    ];

    let count = 0;
    trustPatterns.forEach(pattern => {
      const matches = message.match(pattern);
      if (matches) count += matches.length;
    });

    return count;
  }

  /**
   * Detect capability awareness
   */
  detectCapabilityAwareness(message: string): boolean {
    const awarenessPatterns = [
      /\b(can you|are you able to|do you have the ability)\b/i,
      /\b(within your capabilities|your limitations)\b/i,
      /\b(you might not know|you may not be able)\b/i,
    ];

    return awarenessPatterns.some(pattern => pattern.test(message));
  }

  /**
   * Count strategy adjustments
   */
  countStrategyAdjustments(history: Interaction[], windowCount: number): number {
    const recentHistory = history.slice(-windowCount);

    const adjustmentPatterns = [
      /\b(instead|alternatively|different approach)\b/i,
      /\b(let me try|i'll try another way)\b/i,
      /\b(that didn't work|let's change)\b/i,
    ];

    return recentHistory.filter(interaction =>
      adjustmentPatterns.some(pattern => pattern.test(interaction.userMessage))
    ).length;
  }

  /**
   * Count tool switching
   */
  countToolSwitching(history: Interaction[], windowCount: number): number {
    // For now, return 0 as we don't track multiple tools yet
    // TODO: Implement when multi-tool support is added
    return 0;
  }

  /**
   * Infer task complexity (0-1)
   */
  inferTaskComplexity(message: string): number {
    let complexity = 0.3; // Base complexity

    // Longer messages = more complex
    const words = message.split(/\s+/).length;
    complexity += Math.min(0.3, words / 500);

    // Technical terms = more complex
    const technicalPatterns = [
      /\b(algorithm|implementation|architecture|database)\b/i,
      /\b(optimize|refactor|integrate|deploy)\b/i,
    ];

    if (technicalPatterns.some(p => p.test(message))) {
      complexity += 0.2;
    }

    // Multiple steps = more complex
    if (this.detectTaskDecomposition(message)) {
      complexity += 0.2;
    }

    return Math.min(1, complexity);
  }

  /**
   * Infer task stakes
   */
  inferTaskStakes(message: string): 'low' | 'medium' | 'high' {
    const highStakesPatterns = [
      /\b(production|critical|important|urgent)\b/i,
      /\b(deadline|client|customer)\b/i,
      /\b(essential|crucial|vital)\b/i,
    ];

    const lowStakesPatterns = [
      /\b(practice|learning|exploring|experimenting)\b/i,
      /\b(curious|wondering|just asking)\b/i,
    ];

    if (highStakesPatterns.some(p => p.test(message))) return 'high';
    if (lowStakesPatterns.some(p => p.test(message))) return 'low';
    return 'medium';
  }

  /**
   * Infer domain familiarity (0-1)
   */
  inferDomainFamiliarity(message: string, history: Interaction[]): number {
    // Check if user uses domain-specific terminology
    const technicalTermCount = (message.match(/\b[A-Z][a-z]+(?:[A-Z][a-z]+)+\b/g) || []).length;
    let familiarity = Math.min(0.5, technicalTermCount * 0.1);

    // Check history for similar topics
    // Simplified: just add 0.3 if there's history
    if (history.length > 5) {
      familiarity += 0.3;
    }

    return Math.min(1, familiarity);
  }

  /**
   * Calculate independence ratio (0-1)
   */
  calculateIndependenceRatio(history: Interaction[], windowDays: number): number {
    if (history.length === 0) return 1;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - windowDays);

    const recentInteractions = history.filter(i => i.timestamp >= cutoffDate);
    if (recentInteractions.length === 0) return 1;

    const independentCount = recentInteractions.filter(i => !i.usedAI).length;
    return independentCount / recentInteractions.length;
  }

  /**
   * Calculate iteration propensity (0-1)
   */
  calculateIterationPropensity(history: Interaction[], windowCount: number): number {
    const recentHistory = history.slice(-windowCount);
    if (recentHistory.length === 0) return 0;

    // Look for iterative patterns
    const iterationPatterns = [
      /\b(improve|enhance|refine|iterate)\b/i,
      /\b(version|update|revision)\b/i,
      /\b(better|optimize)\b/i,
    ];

    const iterationCount = recentHistory.filter(interaction =>
      iterationPatterns.some(pattern => pattern.test(interaction.userMessage))
    ).length;

    return iterationCount / recentHistory.length;
  }

  /**
   * Calculate metacognitive awareness score (0-1)
   */
  calculateMetacognitiveScore(history: Interaction[], windowCount: number): number {
    const recentHistory = history.slice(-windowCount);
    if (recentHistory.length === 0) return 0;

    let score = 0;

    // Count metacognitive indicators
    recentHistory.forEach(interaction => {
      if (this.detectStrategyDiscussion(interaction.userMessage)) score += 0.2;
      if (this.detectCapabilityAwareness(interaction.userMessage)) score += 0.2;
      if (this.countCriticalQuestions(interaction.userMessage) > 0) score += 0.1;
    });

    return Math.min(1, score / recentHistory.length);
  }
}

export const featureExtractor = new FeatureExtractor();
