import type { Pattern } from '../types';

/**
 * Metrics Collector
 * Tracks key system metrics for monitoring and analytics
 */
export class MetricsCollector {
  private metrics: Map<string, any[]> = new Map();

  /**
   * Record confidence score prediction vs actual
   */
  async recordConfidenceScore(predicted: number, actual: number, userId: string): Promise<void> {
    const metric = {
      type: 'confidence',
      predicted,
      actual,
      error: Math.abs(predicted - actual),
      userId,
      timestamp: new Date(),
    };

    this.addMetric('confidence_scores', metric);

    // TODO: Send to analytics platform (PostHog, Mixpanel, etc.)
    // await this.sendToAnalytics('confidence_score', metric);

    console.log(`📊 Confidence Score: Predicted=${predicted.toFixed(2)}, Actual=${actual.toFixed(2)}, Error=${metric.error.toFixed(2)}`);
  }

  /**
   * Record pattern classification
   */
  async recordPatternClassification(
    pattern: Pattern,
    confidence: number,
    userId: string
  ): Promise<void> {
    const metric = {
      type: 'pattern',
      pattern,
      confidence,
      userId,
      timestamp: new Date(),
    };

    this.addMetric('pattern_classifications', metric);

    console.log(`📊 Pattern Classification: ${pattern} (confidence: ${(confidence * 100).toFixed(0)}%)`);
  }

  /**
   * Record API latency
   */
  async recordAPILatency(endpoint: string, latencyMs: number): Promise<void> {
    const metric = {
      type: 'latency',
      endpoint,
      latencyMs,
      timestamp: new Date(),
    };

    this.addMetric('api_latencies', metric);

    // Log slow requests
    if (latencyMs > 2000) {
      console.warn(`⚠️  Slow API request: ${endpoint} took ${latencyMs}ms`);
    }
  }

  /**
   * Record verification tool usage
   */
  async recordVerificationUsage(tool: string, userId: string): Promise<void> {
    const metric = {
      type: 'verification',
      tool,
      userId,
      timestamp: new Date(),
    };

    this.addMetric('verification_usage', metric);

    console.log(`📊 Verification Tool Used: ${tool}`);
  }

  /**
   * Record independence ratio
   */
  async recordIndependenceRatio(userId: string, ratio: number): Promise<void> {
    const metric = {
      type: 'independence',
      userId,
      ratio,
      timestamp: new Date(),
    };

    this.addMetric('independence_ratios', metric);

    console.log(`📊 Independence Ratio: ${(ratio * 100).toFixed(0)}% for user ${userId}`);
  }

  /**
   * Get metrics summary
   */
  getMetricsSummary(metricType: string): {
    count: number;
    latest?: any;
    averages?: any;
  } {
    const metrics = this.metrics.get(metricType) || [];

    if (metrics.length === 0) {
      return { count: 0 };
    }

    const latest = metrics[metrics.length - 1];

    // Calculate averages for numeric metrics
    let averages: any = {};

    if (metricType === 'confidence_scores') {
      const errors = metrics.map((m: any) => m.error);
      averages.meanAbsoluteError = errors.reduce((a, b) => a + b, 0) / errors.length;
    }

    if (metricType === 'api_latencies') {
      const latencies = metrics.map((m: any) => m.latencyMs);
      latencies.sort((a, b) => a - b);

      averages.p50 = latencies[Math.floor(latencies.length * 0.5)];
      averages.p95 = latencies[Math.floor(latencies.length * 0.95)];
      averages.p99 = latencies[Math.floor(latencies.length * 0.99)];
    }

    return {
      count: metrics.length,
      latest,
      averages,
    };
  }

  /**
   * Add metric to in-memory store
   */
  private addMetric(type: string, metric: any): void {
    if (!this.metrics.has(type)) {
      this.metrics.set(type, []);
    }

    const metrics = this.metrics.get(type)!;
    metrics.push(metric);

    // Keep only last 1000 entries per type to avoid memory issues
    if (metrics.length > 1000) {
      metrics.shift();
    }
  }

  /**
   * Send to external analytics platform
   */
  private async sendToAnalytics(eventName: string, properties: any): Promise<void> {
    // TODO: Implement integration with PostHog, Mixpanel, or similar
    // Example with PostHog:
    // if (process.env.POSTHOG_KEY) {
    //   await fetch('https://app.posthog.com/capture/', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       api_key: process.env.POSTHOG_KEY,
    //       event: eventName,
    //       properties,
    //     }),
    //   });
    // }
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Record<string, any> {
    const summary: Record<string, any> = {};

    for (const [type] of this.metrics.entries()) {
      summary[type] = this.getMetricsSummary(type);
    }

    return summary;
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
    console.log('🗑️  All metrics cleared');
  }
}

export const metricsCollector = new MetricsCollector();
