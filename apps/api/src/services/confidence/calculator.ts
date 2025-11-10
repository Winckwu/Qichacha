import type { ConfidenceResult, ConfidenceFactors, ConfidenceLevel } from '../../types';

/**
 * Confidence Calculator Service
 * Computes multi-factor confidence scores for AI responses
 */
class ConfidenceCalculator {
  /**
   * Compute confidence score based on multiple factors
   */
  async computeConfidence(
    claim: string,
    context: string,
    aiResponse: string,
    rawModelConfidence?: number
  ): Promise<ConfidenceResult> {
    const factors = await this.computeFactors(claim, context, aiResponse, rawModelConfidence);
    const score = this.calculateWeightedScore(factors);
    const level = this.determineLevel(score);
    const explanation = this.generateExplanation(factors, level);

    return {
      score,
      level,
      factors,
      explanation,
    };
  }

  /**
   * Compute individual confidence factors
   */
  private async computeFactors(
    claim: string,
    context: string,
    aiResponse: string,
    rawModelConfidence?: number
  ): Promise<ConfidenceFactors> {
    // Model uncertainty: Use logprobs if available, otherwise estimate
    const modelUncertainty = rawModelConfidence || this.estimateModelUncertainty(aiResponse);

    // Knowledge base match: Check for hedging language and uncertainty markers
    const knowledgeBaseMatch = this.assessKnowledgeBaseMatch(aiResponse);

    // Recency penalty: Detect temporal context
    const recencyPenalty = this.calculateRecencyPenalty(claim, aiResponse);

    // Domain reliability: Assess domain-specific factors
    const domainReliability = this.assessDomainReliability(claim);

    // Source consensus: Check for consensus indicators
    const sourceConsensus = this.assessSourceConsensus(aiResponse);

    return {
      modelUncertainty,
      knowledgeBaseMatch,
      recencyPenalty,
      domainReliability,
      sourceConsensus,
    };
  }

  /**
   * Estimate model uncertainty based on response characteristics
   */
  private estimateModelUncertainty(response: string): number {
    const uncertaintyMarkers = [
      /\bmight\b/gi,
      /\bcould\b/gi,
      /\bpossibly\b/gi,
      /\bperhaps\b/gi,
      /\bmaybe\b/gi,
      /\bunclear\b/gi,
      /\bnot sure\b/gi,
      /\buncertain\b/gi,
    ];

    let uncertaintyCount = 0;
    uncertaintyMarkers.forEach(marker => {
      const matches = response.match(marker);
      if (matches) uncertaintyCount += matches.length;
    });

    // Normalize: more markers = lower confidence
    const normalized = Math.max(0, 1 - uncertaintyCount * 0.1);
    return normalized;
  }

  /**
   * Assess knowledge base match
   */
  private assessKnowledgeBaseMatch(response: string): number {
    // Check for specific, detailed answers vs vague responses
    const specificityIndicators = [
      /\b\d{4}\b/, // Years
      /\b\d+%\b/, // Percentages
      /\baccording to\b/gi,
      /\bresearch shows\b/gi,
      /\bstudies indicate\b/gi,
    ];

    let specificityScore = 0.5; // Base score

    specificityIndicators.forEach(indicator => {
      if (indicator.test(response)) {
        specificityScore += 0.1;
      }
    });

    return Math.min(1, specificityScore);
  }

  /**
   * Calculate recency penalty
   */
  private calculateRecencyPenalty(claim: string, response: string): number {
    // Check if the query/response mentions recent dates
    const currentYear = new Date().getFullYear();
    const recentYearPattern = new RegExp(`\\b(${currentYear}|${currentYear - 1}|${currentYear - 2})\\b`);

    if (recentYearPattern.test(claim) || recentYearPattern.test(response)) {
      // Penalize for recent information (model might be outdated)
      return 0.6;
    }

    // No recency concerns
    return 1.0;
  }

  /**
   * Assess domain reliability
   */
  private assessDomainReliability(claim: string): number {
    // High reliability domains
    const highReliabilityDomains = [
      /\bmathematics\b/gi,
      /\bphysics\b/gi,
      /\bprogramming\b/gi,
      /\bcode\b/gi,
      /\balgorithm\b/gi,
    ];

    // Medium reliability domains
    const mediumReliabilityDomains = [
      /\bhistory\b/gi,
      /\bscience\b/gi,
      /\bliterature\b/gi,
    ];

    // Low reliability domains (subjective)
    const lowReliabilityDomains = [
      /\bopinion\b/gi,
      /\bpredict\b/gi,
      /\bfuture\b/gi,
      /\btrend\b/gi,
    ];

    for (const pattern of highReliabilityDomains) {
      if (pattern.test(claim)) return 0.9;
    }

    for (const pattern of mediumReliabilityDomains) {
      if (pattern.test(claim)) return 0.7;
    }

    for (const pattern of lowReliabilityDomains) {
      if (pattern.test(claim)) return 0.5;
    }

    return 0.7; // Default
  }

  /**
   * Assess source consensus
   */
  private assessSourceConsensus(response: string): number {
    const consensusIndicators = [
      /\bwidely accepted\b/gi,
      /\bwell-known\b/gi,
      /\bestablished fact\b/gi,
      /\bconsensus\b/gi,
    ];

    const disagreementIndicators = [
      /\bcontroversial\b/gi,
      /\bdebated\b/gi,
      /\bsome argue\b/gi,
      /\bdisagreement\b/gi,
    ];

    let score = 0.7; // Base

    consensusIndicators.forEach(indicator => {
      if (indicator.test(response)) score += 0.1;
    });

    disagreementIndicators.forEach(indicator => {
      if (indicator.test(response)) score -= 0.15;
    });

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Calculate weighted confidence score
   * Weights: 0.2*model + 0.3*knowledge + 0.2*recency + 0.1*domain + 0.2*consensus
   */
  private calculateWeightedScore(factors: ConfidenceFactors): number {
    const weights = {
      modelUncertainty: 0.2,
      knowledgeBaseMatch: 0.3,
      recencyPenalty: 0.2,
      domainReliability: 0.1,
      sourceConsensus: 0.2,
    };

    const score =
      factors.modelUncertainty * weights.modelUncertainty +
      factors.knowledgeBaseMatch * weights.knowledgeBaseMatch +
      factors.recencyPenalty * weights.recencyPenalty +
      factors.domainReliability * weights.domainReliability +
      factors.sourceConsensus * weights.sourceConsensus;

    return Math.round(score * 100) / 100; // Round to 2 decimals
  }

  /**
   * Determine confidence level from score
   */
  private determineLevel(score: number): ConfidenceLevel {
    if (score >= 0.85) return 'high';
    if (score >= 0.5) return 'moderate';
    if (score >= 0.3) return 'low';
    return 'critical';
  }

  /**
   * Generate human-readable explanation
   */
  private generateExplanation(factors: ConfidenceFactors, level: ConfidenceLevel): string {
    const explanations: string[] = [];

    if (level === 'high') {
      explanations.push('High confidence in this response.');
    } else if (level === 'moderate') {
      explanations.push('Moderate confidence. Consider verifying key claims.');
    } else if (level === 'low') {
      explanations.push('Low confidence. Verification strongly recommended.');
    } else {
      explanations.push('Critical confidence level. Independent verification required.');
    }

    // Add factor-specific explanations
    if (factors.modelUncertainty < 0.6) {
      explanations.push('Response contains uncertainty markers.');
    }

    if (factors.recencyPenalty < 0.8) {
      explanations.push('Recent information may be outdated.');
    }

    if (factors.domainReliability < 0.6) {
      explanations.push('Topic involves subjective elements.');
    }

    if (factors.sourceConsensus < 0.6) {
      explanations.push('Topic may lack consensus.');
    }

    return explanations.join(' ');
  }
}

export const confidenceCalculator = new ConfidenceCalculator();
