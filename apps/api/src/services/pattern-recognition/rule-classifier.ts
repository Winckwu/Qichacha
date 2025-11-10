import type { Pattern, BehavioralFeatures, ClassificationResult } from '../../types';

/**
 * Rule-Based Pattern Classifier
 * Classifies users into patterns A-F based on behavioral features
 */
export class RuleBasedClassifier {
  /**
   * Classify user pattern based on behavioral features
   */
  classify(features: BehavioralFeatures): ClassificationResult {
    const scores = this.computeScores(features);
    const bestPattern = this.selectBestPattern(scores);
    const confidence = this.calculateConfidence(scores, bestPattern);
    const reasoning = this.explainClassification(features, bestPattern);

    return {
      pattern: bestPattern,
      confidence,
      scores,
      reasoning,
    };
  }

  /**
   * Compute scores for all patterns
   */
  private computeScores(features: BehavioralFeatures): Record<Pattern, number> {
    return {
      A: this.scorePatternA(features),
      B: this.scorePatternB(features),
      C: this.scorePatternC(features),
      D: this.scorePatternD(features),
      E: this.scorePatternE(features),
      F: this.scorePatternF(features),
    };
  }

  /**
   * Pattern A: Strategic Thinker
   * High metacognition, systematic verification, task decomposition
   */
  private scorePatternA(f: BehavioralFeatures): number {
    let score = 0;

    if (f.taskDecompositionObserved) score += 3;
    if (f.verificationRate > 0.7) score += 2;
    if (f.timeBeforeAI > 5) score += 2;
    if (f.explicitGoalStatement) score += 1;
    if (f.criticalQuestioning > 2) score += 1;
    if (f.strategyDiscussion) score += 1;

    return Math.min(10, score);
  }

  /**
   * Pattern B: Iterative Learner
   * Trial and error, frequent revisions, adaptive strategy
   */
  private scorePatternB(f: BehavioralFeatures): number {
    let score = 0;

    if (f.iterationPropensity > 0.6) score += 3;
    if (f.revisionFrequency > 3) score += 2;
    if (f.strategyAdjustments > 2) score += 2;
    if (f.verificationRate > 0.4 && f.verificationRate < 0.7) score += 2;
    if (f.metacognitiveAwarenessScore > 0.4) score += 1;

    return Math.min(10, score);
  }

  /**
   * Pattern C: Calibrated Delegator
   * Appropriate trust calibration, context-aware AI use
   */
  private scorePatternC(f: BehavioralFeatures): number {
    let score = 0;

    if (f.trustCalibrationMentions > 1) score += 3;
    if (f.capabilityAwareness) score += 2;
    if (f.independenceRatio > 0.3 && f.independenceRatio < 0.7) score += 2;
    if (f.taskStakes === 'high' && f.verificationRate > 0.6) score += 2;
    if (f.domainFamiliarity > 0.5) score += 1;

    return Math.min(10, score);
  }

  /**
   * Pattern D: Efficient User
   * Balanced AI use, good metacognition
   */
  private scorePatternD(f: BehavioralFeatures): number {
    let score = 0;

    if (f.independenceRatio > 0.4 && f.independenceRatio < 0.6) score += 3;
    if (f.verificationRate > 0.3 && f.verificationRate < 0.6) score += 2;
    if (f.metacognitiveAwarenessScore > 0.3 && f.metacognitiveAwarenessScore < 0.7) score += 2;
    if (f.timeBeforeAI > 2 && f.timeBeforeAI < 8) score += 2;
    if (!f.taskDecompositionObserved && f.taskComplexity < 0.7) score += 1;

    return Math.min(10, score);
  }

  /**
   * Pattern E: Over-Reliant
   * High AI dependence, limited verification
   */
  private scorePatternE(f: BehavioralFeatures): number {
    let score = 0;

    if (f.independenceRatio < 0.3) score += 3;
    if (f.verificationRate < 0.3) score += 2;
    if (f.timeBeforeAI < 1) score += 2;
    if (f.criticalQuestioning < 1) score += 2;
    if (!f.strategyDiscussion) score += 1;

    return Math.min(10, score);
  }

  /**
   * Pattern F: Uncritical Acceptor
   * Blind trust, minimal verification, skill degradation risk
   */
  private scorePatternF(f: BehavioralFeatures): number {
    let score = 0;

    if (f.verificationRate < 0.1) score += 3;
    if (f.timeBeforeAI < 0.5) score += 2;
    if (f.outputReadingTime < 2) score += 2;
    if (f.independenceRatio < 0.2) score += 2;
    if (f.criticalQuestioning === 0) score += 1;

    return Math.min(10, score);
  }

  /**
   * Select best pattern based on scores
   */
  private selectBestPattern(scores: Record<Pattern, number>): Pattern {
    let bestPattern: Pattern = 'D'; // Default
    let bestScore = 0;

    for (const [pattern, score] of Object.entries(scores) as [Pattern, number][]) {
      if (score > bestScore) {
        bestScore = score;
        bestPattern = pattern;
      }
    }

    return bestPattern;
  }

  /**
   * Calculate confidence in classification
   */
  private calculateConfidence(scores: Record<Pattern, number>, bestPattern: Pattern): number {
    const bestScore = scores[bestPattern];
    const secondBestScore = Math.max(
      ...Object.entries(scores)
        .filter(([p]) => p !== bestPattern)
        .map(([, s]) => s)
    );

    // Confidence based on score and margin
    const baseConfidence = bestScore / 10;
    const margin = (bestScore - secondBestScore) / 10;

    return Math.min(1, baseConfidence * 0.7 + margin * 0.3);
  }

  /**
   * Generate human-readable explanation
   */
  private explainClassification(features: BehavioralFeatures, pattern: Pattern): string[] {
    const reasoning: string[] = [];

    switch (pattern) {
      case 'A':
        reasoning.push(`Pattern A detected: Strategic Thinker`);
        if (features.taskDecompositionObserved) {
          reasoning.push('✓ Task decomposition observed');
        }
        if (features.verificationRate > 0.7) {
          reasoning.push(`✓ High verification rate (${Math.round(features.verificationRate * 100)}%)`);
        }
        if (features.timeBeforeAI > 5) {
          reasoning.push(`✓ Spent ${Math.round(features.timeBeforeAI)} minutes planning`);
        }
        break;

      case 'B':
        reasoning.push(`Pattern B detected: Iterative Learner`);
        if (features.iterationPropensity > 0.6) {
          reasoning.push('✓ High iteration propensity');
        }
        if (features.revisionFrequency > 3) {
          reasoning.push(`✓ Frequent revisions (${features.revisionFrequency} times)`);
        }
        if (features.strategyAdjustments > 2) {
          reasoning.push('✓ Multiple strategy adjustments');
        }
        break;

      case 'C':
        reasoning.push(`Pattern C detected: Calibrated Delegator`);
        if (features.capabilityAwareness) {
          reasoning.push('✓ Shows AI capability awareness');
        }
        if (features.trustCalibrationMentions > 1) {
          reasoning.push('✓ Discusses trust and reliability');
        }
        if (features.independenceRatio > 0.3 && features.independenceRatio < 0.7) {
          reasoning.push(`✓ Balanced independence (${Math.round(features.independenceRatio * 100)}%)`);
        }
        break;

      case 'D':
        reasoning.push(`Pattern D detected: Efficient User`);
        reasoning.push('✓ Balanced AI usage');
        reasoning.push('✓ Appropriate verification practices');
        reasoning.push('✓ Good metacognitive awareness');
        break;

      case 'E':
        reasoning.push(`Pattern E detected: Over-Reliant`);
        if (features.independenceRatio < 0.3) {
          reasoning.push(`⚠ Low independence ratio (${Math.round(features.independenceRatio * 100)}%)`);
        }
        if (features.verificationRate < 0.3) {
          reasoning.push('⚠ Limited verification');
        }
        if (features.timeBeforeAI < 1) {
          reasoning.push('⚠ Minimal planning time');
        }
        break;

      case 'F':
        reasoning.push(`Pattern F detected: Uncritical Acceptor`);
        if (features.verificationRate < 0.1) {
          reasoning.push('🚨 Very low verification rate');
        }
        if (features.timeBeforeAI < 0.5) {
          reasoning.push('🚨 Immediate AI reliance');
        }
        if (features.independenceRatio < 0.2) {
          reasoning.push('🚨 Critical independence deficit');
        }
        reasoning.push('⚠ Skill degradation risk detected');
        break;
    }

    return reasoning;
  }
}

export const ruleClassifier = new RuleBasedClassifier();
