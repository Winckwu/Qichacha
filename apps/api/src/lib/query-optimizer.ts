import { prisma } from './prisma';

/**
 * Query Optimization Utilities
 * Pre-computed views and optimized queries
 */

/**
 * Get user pattern with caching
 */
export async function getUserPatternOptimized(userId: string) {
  // Use select to only fetch needed fields
  const pattern = await prisma.pattern.findFirst({
    where: { userId },
    orderBy: { timestamp: 'desc' },
    select: {
      id: true,
      pattern: true,
      confidence: true,
      timestamp: true,
    },
  });

  return pattern;
}

/**
 * Get recent interactions with minimal data
 */
export async function getRecentInteractionsOptimized(userId: string, limit: number = 20) {
  const interactions = await prisma.interaction.findMany({
    where: {
      session: {
        userId,
      },
    },
    orderBy: {
      timestamp: 'desc',
    },
    take: limit,
    select: {
      id: true,
      userMessage: true,
      taskType: true,
      taskComplexity: true,
      usedAI: true,
      timestamp: true,
      // Exclude large fields like aiResponse
    },
  });

  return interactions;
}

/**
 * Batch fetch user data
 */
export async function getUserDataBatch(userId: string) {
  // Use Promise.all for parallel queries
  const [user, sessions, recentPatterns, independenceLogs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    }),
    prisma.session.findMany({
      where: { userId },
      orderBy: { startTime: 'desc' },
      take: 10,
      select: {
        id: true,
        startTime: true,
        currentPattern: true,
      },
    }),
    prisma.pattern.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 10,
      select: {
        pattern: true,
        confidence: true,
        timestamp: true,
      },
    }),
    prisma.independenceLog.count({
      where: {
        userId,
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  return {
    user,
    sessions,
    recentPatterns,
    independenceLogCount: independenceLogs,
  };
}

/**
 * Aggregated metrics query
 */
export async function getAggregatedMetrics(userId: string, days: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // Use aggregation for better performance
  const metrics = await prisma.interaction.groupBy({
    by: ['taskType'],
    where: {
      session: {
        userId,
      },
      timestamp: {
        gte: cutoffDate,
      },
    },
    _count: {
      _all: true,
    },
    _avg: {
      taskComplexity: true,
      confidence: true,
    },
  });

  return metrics;
}

/**
 * Cursor-based pagination for large datasets
 */
export async function getInteractionsPaginated(
  userId: string,
  cursor?: string,
  limit: number = 50
) {
  const interactions = await prisma.interaction.findMany({
    where: {
      session: {
        userId,
      },
    },
    take: limit + 1, // Fetch one extra to check if there's more
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      timestamp: 'desc',
    },
    select: {
      id: true,
      userMessage: true,
      taskType: true,
      timestamp: true,
      confidence: true,
    },
  });

  let nextCursor: string | undefined;

  if (interactions.length > limit) {
    const nextItem = interactions.pop();
    nextCursor = nextItem?.id;
  }

  return {
    items: interactions,
    nextCursor,
  };
}

/**
 * Materialized view equivalent - pre-computed daily stats
 */
export async function getDailyStats(userId: string, startDate: Date, endDate: Date) {
  // This would ideally be a materialized view in the database
  // For now, we do efficient aggregation

  const stats = await prisma.$queryRaw`
    SELECT
      DATE(timestamp) as date,
      COUNT(*) as total_interactions,
      COUNT(CASE WHEN "usedAI" = false THEN 1 END) as independent_count,
      AVG(confidence) as avg_confidence,
      AVG("taskComplexity") as avg_complexity
    FROM "Interaction" i
    JOIN "Session" s ON i."sessionId" = s.id
    WHERE s."userId" = ${userId}
      AND i.timestamp >= ${startDate}
      AND i.timestamp <= ${endDate}
    GROUP BY DATE(timestamp)
    ORDER BY DATE(timestamp) DESC
  `;

  return stats;
}
