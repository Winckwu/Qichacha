import { prisma } from '../../lib/prisma';

interface CalibrationSample {
  id: string;
  claim: string;
  predictedConfidence: number;
  actualCorrectness: number; // 0-1, from human annotation
  createdAt: Date;
}

interface CalibrationBin {
  binIndex: number;
  minConfidence: number;
  maxConfidence: number;
  samples: CalibrationSample[];
  averagePredicted: number;
  averageActual: number;
  count: number;
}

/**
 * Calibration Manager
 * Implements Expected Calibration Error (ECE) and post-processing calibration
 */
export class CalibrationManager {
  private readonly numBins = 10;
  private calibrationModel: Map<number, number> | null = null;

  /**
   * Collect calibration sample from human annotation
   */
  async collectSample(
    claim: string,
    predictedConfidence: number,
    actualCorrectness: number,
    userId: string
  ): Promise<void> {
    await prisma.$executeRaw`
      INSERT INTO calibration_samples (claim, predicted_confidence, actual_correctness, annotator_id)
      VALUES (${claim}, ${predictedConfidence}, ${actualCorrectness}, ${userId})
    `;
  }

  /**
   * Calculate Expected Calibration Error (ECE)
   */
  async calculateECE(): Promise<{
    ece: number;
    bins: CalibrationBin[];
    totalSamples: number;
  }> {
    // Fetch all calibration samples
    const samples = await this.getAllSamples();

    if (samples.length === 0) {
      return { ece: 0, bins: [], totalSamples: 0 };
    }

    // Create bins
    const bins = this.createBins(samples);

    // Calculate ECE
    let ece = 0;
    const totalSamples = samples.length;

    for (const bin of bins) {
      if (bin.count === 0) continue;

      const accuracy = bin.averageActual;
      const confidence = bin.averagePredicted;
      const binWeight = bin.count / totalSamples;

      ece += Math.abs(confidence - accuracy) * binWeight;
    }

    return { ece, bins, totalSamples };
  }

  /**
   * Create calibration bins
   */
  private createBins(samples: CalibrationSample[]): CalibrationBin[] {
    const bins: CalibrationBin[] = [];

    for (let i = 0; i < this.numBins; i++) {
      const minConfidence = i / this.numBins;
      const maxConfidence = (i + 1) / this.numBins;

      const binSamples = samples.filter(
        s => s.predictedConfidence >= minConfidence && s.predictedConfidence < maxConfidence
      );

      const averagePredicted =
        binSamples.length > 0
          ? binSamples.reduce((sum, s) => sum + s.predictedConfidence, 0) / binSamples.length
          : minConfidence + 0.05;

      const averageActual =
        binSamples.length > 0
          ? binSamples.reduce((sum, s) => sum + s.actualCorrectness, 0) / binSamples.length
          : 0;

      bins.push({
        binIndex: i,
        minConfidence,
        maxConfidence,
        samples: binSamples,
        averagePredicted,
        averageActual,
        count: binSamples.length,
      });
    }

    return bins;
  }

  /**
   * Train calibration model using Isotonic Regression (simplified Platt Scaling)
   */
  async trainCalibrationModel(): Promise<void> {
    const samples = await this.getAllSamples();

    if (samples.length < 100) {
      console.warn('Insufficient samples for calibration training. Need at least 100.');
      return;
    }

    // Group by bins and create mapping
    const bins = this.createBins(samples);
    const calibrationMap = new Map<number, number>();

    for (const bin of bins) {
      if (bin.count > 0) {
        // Map predicted confidence to actual accuracy
        calibrationMap.set(bin.averagePredicted, bin.averageActual);
      }
    }

    this.calibrationModel = calibrationMap;

    // Save model to database for persistence
    await this.saveCalibrationModel(calibrationMap);

    console.log(`✅ Calibration model trained with ${samples.length} samples`);
  }

  /**
   * Apply calibration to raw confidence score
   */
  calibrateScore(rawScore: number): number {
    if (!this.calibrationModel || this.calibrationModel.size === 0) {
      // No calibration model, return raw score
      return rawScore;
    }

    // Find nearest bin
    let nearestKey = 0;
    let minDistance = Infinity;

    for (const [key] of this.calibrationModel.entries()) {
      const distance = Math.abs(key - rawScore);
      if (distance < minDistance) {
        minDistance = distance;
        nearestKey = key;
      }
    }

    const calibratedScore = this.calibrationModel.get(nearestKey) || rawScore;

    // Ensure calibrated score is in valid range
    return Math.max(0, Math.min(1, calibratedScore));
  }

  /**
   * Get all calibration samples from database
   */
  private async getAllSamples(): Promise<CalibrationSample[]> {
    // This is a placeholder - you'll need to create the CalibrationSample table in Prisma
    // For now, return empty array
    return [];

    // TODO: Implement with actual Prisma query
    // const samples = await prisma.calibrationSample.findMany({
    //   orderBy: { createdAt: 'desc' },
    // });
    // return samples;
  }

  /**
   * Save calibration model to database
   */
  private async saveCalibrationModel(model: Map<number, number>): Promise<void> {
    const modelData = Array.from(model.entries()).map(([predicted, actual]) => ({
      predicted,
      actual,
    }));

    // TODO: Implement with Prisma
    // await prisma.calibrationModel.upsert({
    //   where: { id: 'current' },
    //   update: { modelData: JSON.stringify(modelData), updatedAt: new Date() },
    //   create: { id: 'current', modelData: JSON.stringify(modelData) },
    // });
  }

  /**
   * Load calibration model from database
   */
  async loadCalibrationModel(): Promise<void> {
    // TODO: Implement with Prisma
    // const model = await prisma.calibrationModel.findUnique({
    //   where: { id: 'current' },
    // });
    //
    // if (model) {
    //   const modelData = JSON.parse(model.modelData);
    //   this.calibrationModel = new Map(modelData.map((d: any) => [d.predicted, d.actual]));
    // }
  }

  /**
   * Get calibration statistics
   */
  async getCalibrationStats(): Promise<{
    ece: number;
    totalSamples: number;
    lastUpdated: Date | null;
    isCalibrated: boolean;
  }> {
    const { ece, totalSamples } = await this.calculateECE();

    return {
      ece,
      totalSamples,
      lastUpdated: new Date(), // TODO: Get from database
      isCalibrated: this.calibrationModel !== null && this.calibrationModel.size > 0,
    };
  }

  /**
   * Check if model needs recalibration
   */
  shouldRecalibrate(totalSamples: number, lastTrainedSamples: number): boolean {
    // Retrain every 1000 new samples
    return totalSamples - lastTrainedSamples >= 1000;
  }
}

export const calibrationManager = new CalibrationManager();
