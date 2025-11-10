import { prisma } from '../../lib/prisma';

interface IndependenceMetrics {
  currentRatio: number;
  trend: 'improving' | 'stable' | 'declining';
  trendChange: number;
  skillBreakdown: {
    writing: number;
    coding: number;
    analysis: number;
  };
  alertLevel: 'none' | 'gentle' | 'strong' | 'critical';
}

/**
 * Independence Tracker Service
 * Monitors user independence and skill degradation risks
 */
export class IndependenceTracker {
  /**
   * Get independence metrics for a user
   */
  async getMetrics(userId: string): Promise<IndependenceMetrics> {
    // Calculate current ratio (last 30 days)
    const ratio = await this.calculateRatio(userId, 30);

    // Analyze trend
    const trend = await this.analyzeTrend(userId);

    // Get skill breakdown
    const breakdown = await this.skillBreakdown(userId, 30);

    // Determine alert level
    const alertLevel = this.determineAlertLevel(ratio, trend.level);

    return {
      currentRatio: ratio,
      trend: trend.level,
      trendChange: trend.change,
      skillBreakdown: breakdown,
      alertLevel,
    };
  }

  /**
   * Calculate independence ratio for a time window
   */
  private async calculateRatio(userId: string, days: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Get all interactions in the time window
    const interactions = await prisma.interaction.count({
      where: {
        session: {
          userId,
        },
        timestamp: {
          gte: cutoffDate,
        },
      },
    });

    if (interactions === 0) return 1; // No data = assume independent

    // Get independent work (usedAI = false)
    const independent = await prisma.interaction.count({
      where: {
        session: {
          userId,
        },
        timestamp: {
          gte: cutoffDate,
        },
        usedAI: false,
      },
    });

    return independent / interactions;
  }

  /**
   * Analyze trend over time
   */
  private async analyzeTrend(userId: string): Promise<{
    level: 'improving' | 'stable' | 'declining';
    change: number;
  }> {
    // Current period (last 30 days)
    const current = await this.getRatio(userId, 30, 0);

    // Baseline period (60-90 days ago)
    const baseline = await this.getRatio(userId, 30, 60);

    const change = current - baseline;

    let level: 'improving' | 'stable' | 'declining';
    if (change > 0.1) {
      level = 'improving';
    } else if (change < -0.1) {
      level = 'declining';
    } else {
      level = 'stable';
    }

    return { level, change };
  }

  /**
   * Get ratio for a specific time window with offset
   */
  private async getRatio(userId: string, windowDays: number, offsetDays: number = 0): Promise<number> {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - offsetDays);

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - windowDays);

    const total = await prisma.interaction.count({
      where: {
        session: {
          userId,
        },
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    if (total === 0) return 0.5; // Default if no data

    const independent = await prisma.interaction.count({
      where: {
        session: {
          userId,
        },
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
        usedAI: false,
      },
    });

    return independent / total;
  }

  /**
   * Get skill breakdown by task type
   */
  private async skillBreakdown(userId: string, days: number): Promise<{
    writing: number;
    coding: number;
    analysis: number;
  }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const calculateSkillRatio = async (taskType: string): Promise<number> => {
      const total = await prisma.interaction.count({
        where: {
          session: {
            userId,
          },
          timestamp: {
            gte: cutoffDate,
          },
          taskType,
        },
      });

      if (total === 0) return 0.5; // Default

      const independent = await prisma.interaction.count({
        where: {
          session: {
            userId,
          },
          timestamp: {
            gte: cutoffDate,
          },
          taskType,
          usedAI: false,
        },
      });

      return independent / total;
    };

    return {
      writing: await calculateSkillRatio('writing'),
      coding: await calculateSkillRatio('coding'),
      analysis: await calculateSkillRatio('analysis'),
    };
  }

  /**
   * Determine alert level based on metrics
   */
  private determineAlertLevel(
    ratio: number,
    trend: 'improving' | 'stable' | 'declining'
  ): 'none' | 'gentle' | 'strong' | 'critical' {
    if (ratio < 0.2) {
      return 'critical';
    }

    if (ratio < 0.3 && trend === 'declining') {
      return 'strong';
    }

    if (trend === 'declining') {
      return 'gentle';
    }

    return 'none';
  }

  /**
   * Log independence event
   */
  async logIndependenceEvent(
    userId: string,
    taskType: string,
    usedAI: boolean,
    duration: number
  ): Promise<void> {
    await prisma.independenceLog.create({
      data: {
        userId,
        date: new Date(),
        taskType,
        usedAI,
        duration,
      },
    });
  }
}

export const independenceTracker = new IndependenceTracker();
