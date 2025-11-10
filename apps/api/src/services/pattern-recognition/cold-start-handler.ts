import { prisma } from '../../lib/prisma';
import { featureExtractor } from './feature-extractor';
import { ruleClassifier } from './rule-classifier';
import type { Pattern } from '../../types';

interface UserSurvey {
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  aiUsageFrequency: 'rarely' | 'sometimes' | 'often' | 'always';
  verificationHabit: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
  learningGoal: 'efficiency' | 'learning' | 'both';
}

/**
 * Cold Start Handler
 * Handles pattern classification for new users without interaction history
 */
export class ColdStartHandler {
  /**
   * Get initial pattern for new user
   */
  async getInitialPattern(userId: string): Promise<Pattern | 'EXPLORATORY'> {
    // Strategy 1: Check if user completed survey
    const survey = await this.getUserSurvey(userId);
    if (survey) {
      return this.patternFromSurvey(survey);
    }

    // Strategy 2: Return exploratory mode (mixed interface)
    return 'EXPLORATORY';
  }

  /**
   * Get user survey if exists
   */
  private async getUserSurvey(userId: string): Promise<UserSurvey | null> {
    // TODO: Implement with Prisma when survey table is created
    // const survey = await prisma.userSurvey.findUnique({
    //   where: { userId },
    // });
    // return survey;

    return null;
  }

  /**
   * Infer pattern from survey responses
   */
  private patternFromSurvey(survey: UserSurvey): Pattern {
    let score = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
    };

    // Experience level
    if (survey.experienceLevel === 'advanced') {
      score.A += 2;
      score.C += 1;
    } else if (survey.experienceLevel === 'intermediate') {
      score.B += 1;
      score.D += 2;
    } else {
      score.E += 1;
      score.F += 1;
    }

    // AI usage frequency
    if (survey.aiUsageFrequency === 'rarely') {
      score.A += 2;
    } else if (survey.aiUsageFrequency === 'sometimes') {
      score.C += 2;
      score.D += 1;
    } else if (survey.aiUsageFrequency === 'often') {
      score.D += 1;
      score.E += 1;
    } else {
      score.E += 2;
      score.F += 1;
    }

    // Verification habit
    if (survey.verificationHabit === 'always' || survey.verificationHabit === 'often') {
      score.A += 3;
      score.C += 2;
    } else if (survey.verificationHabit === 'sometimes') {
      score.B += 1;
      score.D += 2;
    } else if (survey.verificationHabit === 'rarely') {
      score.E += 2;
    } else {
      score.F += 3;
    }

    // Learning goal
    if (survey.learningGoal === 'learning') {
      score.A += 1;
      score.B += 2;
    } else if (survey.learningGoal === 'efficiency') {
      score.C += 1;
      score.D += 2;
    } else {
      score.C += 1;
    }

    // Find highest score
    let maxScore = 0;
    let bestPattern: Pattern = 'D'; // Default to efficient user

    for (const [pattern, patternScore] of Object.entries(score) as [Pattern, number][]) {
      if (patternScore > maxScore) {
        maxScore = patternScore;
        bestPattern = pattern;
      }
    }

    return bestPattern;
  }

  /**
   * Update pattern after N interactions
   */
  async updateAfterInteractions(userId: string): Promise<void> {
    const interactionCount = await this.getInteractionCount(userId);

    // First classification after 5 interactions
    if (interactionCount === 5) {
      await this.performInitialClassification(userId);
      console.log(`✅ Initial pattern classification for user ${userId}`);
    }

    // Reclassify every 10 interactions
    if (interactionCount > 5 && interactionCount % 10 === 0) {
      await this.reclassifyUser(userId);
      console.log(`🔄 Pattern reclassification for user ${userId} (${interactionCount} interactions)`);
    }
  }

  /**
   * Get total interaction count for user
   */
  private async getInteractionCount(userId: string): Promise<number> {
    const count = await prisma.interaction.count({
      where: {
        session: {
          userId,
        },
      },
    });

    return count;
  }

  /**
   * Perform initial classification
   */
  private async performInitialClassification(userId: string): Promise<void> {
    // Get recent interactions
    const interactions = await prisma.interaction.findMany({
      where: {
        session: {
          userId,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 5,
    });

    if (interactions.length === 0) return;

    // Extract features from the most recent interaction
    const latestInteraction = interactions[0];
    const features = featureExtractor.extractFromInteraction(latestInteraction, interactions);

    // Classify
    const classification = ruleClassifier.classify(features);

    // Save pattern
    await prisma.pattern.create({
      data: {
        userId,
        pattern: classification.pattern,
        confidence: classification.confidence,
        scores: classification.scores as any,
        reasoning: classification.reasoning as any,
      },
    });
  }

  /**
   * Reclassify user based on updated history
   */
  private async reclassifyUser(userId: string): Promise<void> {
    // Get recent interactions (last 20)
    const interactions = await prisma.interaction.findMany({
      where: {
        session: {
          userId,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 20,
    });

    if (interactions.length === 0) return;

    // Extract features
    const latestInteraction = interactions[0];
    const features = featureExtractor.extractFromInteraction(latestInteraction, interactions);

    // Classify
    const classification = ruleClassifier.classify(features);

    // Get current pattern
    const currentPattern = await prisma.pattern.findFirst({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });

    // Only update if pattern changed or confidence significantly different
    if (
      !currentPattern ||
      currentPattern.pattern !== classification.pattern ||
      Math.abs(currentPattern.confidence - classification.confidence) > 0.15
    ) {
      await prisma.pattern.create({
        data: {
          userId,
          pattern: classification.pattern,
          confidence: classification.confidence,
          scores: classification.scores as any,
          reasoning: classification.reasoning as any,
        },
      });
    }
  }

  /**
   * Check if user is in exploratory mode
   */
  async isExploratoryMode(userId: string): Promise<boolean> {
    const count = await this.getInteractionCount(userId);
    return count < 5;
  }

  /**
   * Get pattern with cold start handling
   */
  async getPatternWithColdStart(userId: string): Promise<Pattern | 'EXPLORATORY'> {
    const count = await this.getInteractionCount(userId);

    // New user - exploratory mode
    if (count < 5) {
      return 'EXPLORATORY';
    }

    // Get latest pattern
    const pattern = await prisma.pattern.findFirst({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });

    if (pattern) {
      return pattern.pattern as Pattern;
    }

    // Fallback to initial pattern
    return this.getInitialPattern(userId);
  }
}

export const coldStartHandler = new ColdStartHandler();
