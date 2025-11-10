// Shared types for MCA API

export type Pattern = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type ConfidenceLevel = 'high' | 'moderate' | 'low' | 'critical';

export interface ConfidenceFactors {
  modelUncertainty: number; // 0-1
  knowledgeBaseMatch: number; // 0-1
  recencyPenalty: number; // 0-1
  domainReliability: number; // 0-1
  sourceConsensus: number; // 0-1
}

export interface ConfidenceResult {
  score: number; // 0-1
  level: ConfidenceLevel;
  factors: ConfidenceFactors;
  explanation: string;
}

export interface AIResponse {
  content: string;
  rawConfidence?: number;
  model: string;
}

export interface BehavioralFeatures {
  taskDecompositionObserved: boolean;
  explicitGoalStatement: boolean;
  strategyDiscussion: boolean;
  timeBeforeAI: number;
  verificationRate: number;
  outputReadingTime: number;
  revisionFrequency: number;
  criticalQuestioning: number;
  trustCalibrationMentions: number;
  capabilityAwareness: boolean;
  strategyAdjustments: number;
  toolSwitching: number;
  taskComplexity: number;
  taskStakes: 'low' | 'medium' | 'high';
  domainFamiliarity: number;
  independenceRatio: number;
  iterationPropensity: number;
  metacognitiveAwarenessScore: number;
}

export interface ClassificationResult {
  pattern: Pattern;
  confidence: number;
  scores: Record<Pattern, number>;
  reasoning: string[];
}
