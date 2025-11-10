// Core types for MCA System

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

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  confidence?: ConfidenceResult;
  timestamp: Date;
}

export interface Session {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  pattern?: Pattern;
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

export interface IndependenceMetrics {
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

export interface ModelComparison {
  models: {
    name: 'ChatGPT' | 'Claude' | 'Gemini';
    response: string;
    confidence: number;
    latency: number;
  }[];
  consensus: {
    level: number;
    agreementPattern: string;
    differences: string[];
  };
  recommendation: string;
}

export interface FactClaim {
  text: string;
  type: 'date' | 'number' | 'entity' | 'event';
  startIndex: number;
  endIndex: number;
}

export interface VerificationResult {
  claim: FactClaim;
  status: 'verified' | 'uncertain' | 'contradicted' | 'not_found';
  sources: {
    name: string;
    url: string;
    confidence: number;
  }[];
  explanation: string;
}
