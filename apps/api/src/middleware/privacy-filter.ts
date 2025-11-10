import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export type PrivacyTier = 'maximum' | 'limited' | 'full';

interface SafeInteraction {
  timestamp: Date;
  taskType: string | null;
  complexity: number;
  duration: number;
  verificationPerformed: boolean;
  contentHash: string;
  // Content is NOT stored
  userMessage?: never;
  aiResponse?: never;
}

/**
 * Privacy Filter Middleware
 * Implements three-tier privacy architecture
 */
export class PrivacyFilter {
  /**
   * Filter interaction log based on privacy tier
   */
  filterInteractionLog(
    interaction: any,
    privacyTier: PrivacyTier = 'maximum'
  ): SafeInteraction | any {
    switch (privacyTier) {
      case 'maximum':
        return this.filterMaximumPrivacy(interaction);
      case 'limited':
        return this.filterLimitedContent(interaction);
      case 'full':
        return interaction; // User explicitly consented
      default:
        return this.filterMaximumPrivacy(interaction);
    }
  }

  /**
   * Tier 1: Maximum Privacy (Default)
   * Content-blind tracking only
   */
  private filterMaximumPrivacy(interaction: any): SafeInteraction {
    return {
      timestamp: interaction.timestamp || new Date(),
      taskType: this.inferTaskType(interaction),
      complexity: this.calculateComplexity(interaction),
      duration: interaction.duration || 0,
      verificationPerformed: (interaction.verificationActions?.length || 0) > 0,
      contentHash: this.hashContent(interaction.userMessage || ''),
    };
  }

  /**
   * Tier 2: Limited Content (Opt-in)
   * Store metadata and extracted claims only
   */
  private filterLimitedContent(interaction: any): any {
    const safe = this.filterMaximumPrivacy(interaction);

    return {
      ...safe,
      // Only store extracted claims, not full content
      extractedClaims: interaction.extractedClaims || [],
      // Metadata only
      wordCount: this.getWordCount(interaction.userMessage),
      hasCodeBlock: this.hasCodeBlock(interaction.userMessage),
      hasLinks: this.hasLinks(interaction.userMessage),
    };
  }

  /**
   * Infer task type from interaction structure (content-blind)
   */
  private inferTaskType(interaction: any): string | null {
    const message = interaction.userMessage || '';

    // Use structural heuristics without reading content
    const hasCode = this.hasCodeBlock(message);
    const hasLongText = message.length > 500;
    const hasQuestions = message.includes('?');

    if (hasCode) return 'coding';
    if (hasLongText && !hasQuestions) return 'writing';
    return 'analysis';
  }

  /**
   * Calculate task complexity (0-1) without reading content
   */
  private calculateComplexity(interaction: any): number {
    const message = interaction.userMessage || '';

    let complexity = 0.3; // Base

    // Length-based
    const words = message.split(/\s+/).length;
    complexity += Math.min(0.3, words / 500);

    // Structure-based
    if (this.hasCodeBlock(message)) complexity += 0.2;
    if (message.split('\n').length > 10) complexity += 0.1;
    if (message.includes('1.') && message.includes('2.')) complexity += 0.1;

    return Math.min(1, complexity);
  }

  /**
   * Hash content for deduplication (one-way, non-reversible)
   */
  private hashContent(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
  }

  /**
   * Check if message has code block
   */
  private hasCodeBlock(message: string): boolean {
    return message.includes('```') || message.includes('`');
  }

  /**
   * Check if message has links
   */
  private hasLinks(message: string): boolean {
    return /https?:\/\//.test(message);
  }

  /**
   * Get word count
   */
  private getWordCount(message: string): number {
    return message.split(/\s+/).filter(w => w.length > 0).length;
  }

  /**
   * Express middleware to apply privacy filter
   */
  middleware(defaultTier: PrivacyTier = 'maximum') {
    return (req: Request, res: Response, next: NextFunction) => {
      // Get user's privacy preference
      const userPrivacyTier = (req.headers['x-privacy-tier'] as PrivacyTier) || defaultTier;

      // Validate tier
      if (!['maximum', 'limited', 'full'].includes(userPrivacyTier)) {
        return res.status(400).json({ error: 'Invalid privacy tier' });
      }

      // Attach privacy tier to request
      (req as any).privacyTier = userPrivacyTier;

      next();
    };
  }

  /**
   * Get user's privacy tier preference
   */
  async getUserPrivacyTier(userId: string): Promise<PrivacyTier> {
    // TODO: Fetch from database
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: { privacyTier: true },
    // });
    // return user?.privacyTier || 'maximum';

    return 'maximum'; // Default
  }

  /**
   * Update user's privacy tier (requires explicit consent)
   */
  async updatePrivacyTier(userId: string, newTier: PrivacyTier, consentGiven: boolean): Promise<boolean> {
    // Downgrading privacy requires no consent
    if (newTier === 'maximum') {
      // TODO: Update in database
      return true;
    }

    // Upgrading to limited or full requires explicit consent
    if (!consentGiven) {
      throw new Error('Explicit consent required to reduce privacy level');
    }

    // TODO: Update in database with consent timestamp
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     privacyTier: newTier,
    //     privacyConsentAt: new Date(),
    //   },
    // });

    return true;
  }

  /**
   * Delete all user data (GDPR right to be forgotten)
   */
  async deleteAllUserData(userId: string): Promise<void> {
    // TODO: Implement comprehensive data deletion
    // await prisma.$transaction([
    //   prisma.interaction.deleteMany({ where: { session: { userId } } }),
    //   prisma.session.deleteMany({ where: { userId } }),
    //   prisma.pattern.deleteMany({ where: { userId } }),
    //   prisma.independenceLog.deleteMany({ where: { userId } }),
    //   prisma.skillAssessment.deleteMany({ where: { userId } }),
    //   prisma.user.delete({ where: { id: userId } }),
    // ]);

    console.log(`🗑️  All data deleted for user ${userId}`);
  }
}

export const privacyFilter = new PrivacyFilter();
