/**
 * Mock Data Generator for MCA System Demo
 * Generates realistic demo data for all features
 */

export type UserPattern = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: ConfidenceScore;
}

export interface ConfidenceScore {
  score: number;
  level: 'high' | 'moderate' | 'low' | 'critical';
  factors: {
    modelConfidence: number;
    crossValidation: number;
    factualConsistency: number;
    domainCoverage: number;
    responseCoherence: number;
  };
  explanation: string;
}

export interface PatternData {
  pattern: UserPattern;
  confidence: number;
  scores: Record<string, number>;
  reasoning: string;
  timestamp: Date;
}

export interface SkillMetric {
  skill: string;
  level: number;
  trend: 'improving' | 'stable' | 'declining';
  recentScore: number;
  historicalAvg: number;
}

export interface IndependenceLog {
  timestamp: Date;
  ratio: number;
  sessionCount: number;
  skillBreakdown: SkillMetric[];
}

export interface CalibrationData {
  ece: number;
  bins: Array<{
    range: string;
    confidence: number;
    accuracy: number;
    count: number;
  }>;
  totalSamples: number;
}

// Pattern descriptions (Based on MCA Framework - Chapter 5)
export const PATTERN_INFO: Record<UserPattern, {
  name: string;
  description: string;
  characteristics: string[];
  color: string;
}> = {
  A: {
    name: '战略分解者',
    description: '系统性任务分解与主动控制，展现强大元认知能力',
    characteristics: [
      '主动进行任务分解',
      '持续监控与验证',
      '战略性思考和规划',
      '保持高独立性比率'
    ],
    color: 'blue'
  },
  B: {
    name: '效率迭代者',
    description: '优先速度和实用性，通过快速迭代优化结果',
    characteristics: [
      '快速获取初始输出',
      '基于评估进行迭代',
      '平衡效率与质量',
      '适度验证关键内容'
    ],
    color: 'green'
  },
  C: {
    name: '学习探索者',
    description: '将AI作为学习工具，通过探索建立深度理解',
    characteristics: [
      '主动测试AI边界',
      '寻求深度解释',
      '探索多种方法',
      '重视过程学习'
    ],
    color: 'orange'
  },
  D: {
    name: '验证谨慎者',
    description: '保持健康怀疑态度，广泛验证AI输出',
    characteristics: [
      '详细验证所有输出',
      '交叉检查信息源',
      '在接受前完善',
      '防范错误的意识强'
    ],
    color: 'purple'
  },
  E: {
    name: '务实完成者',
    description: '优先任务完成，最小化验证投入',
    characteristics: [
      '快速接受AI建议',
      '很少进行验证',
      '关注结果而非过程',
      '适合常规低风险任务'
    ],
    color: 'amber'
  },
  F: {
    name: '无批判依赖者',
    description: '完全信任AI输出，缺乏元认知参与，技能退化风险高',
    characteristics: [
      '无任务分解习惯',
      '从不验证AI输出',
      '被动接受所有建议',
      '存在严重技能退化风险'
    ],
    color: 'red'
  }
};

// Generate confidence scores
export function generateConfidenceScore(baseScore?: number): ConfidenceScore {
  const score = baseScore ?? Math.random() * 0.4 + 0.6; // 0.6-1.0

  const factors = {
    modelConfidence: score + (Math.random() - 0.5) * 0.1,
    crossValidation: score + (Math.random() - 0.5) * 0.15,
    factualConsistency: score + (Math.random() - 0.5) * 0.12,
    domainCoverage: score + (Math.random() - 0.5) * 0.08,
    responseCoherence: score + (Math.random() - 0.5) * 0.1,
  };

  // Clamp values
  Object.keys(factors).forEach(key => {
    factors[key as keyof typeof factors] = Math.max(0, Math.min(1, factors[key as keyof typeof factors]));
  });

  let level: 'high' | 'moderate' | 'low' | 'critical';
  if (score >= 0.85) level = 'high';
  else if (score >= 0.7) level = 'moderate';
  else if (score >= 0.5) level = 'low';
  else level = 'critical';

  const explanations = {
    high: '所有因素评分优秀，响应高度可信',
    moderate: '大多数因素良好，建议进行验证',
    low: '多个因素评分较低，需要谨慎对待',
    critical: '置信度严重不足，强烈建议人工验证'
  };

  return {
    score,
    level,
    factors,
    explanation: explanations[level]
  };
}

// Generate conversation messages
export function generateConversation(pattern: UserPattern): Message[] {
  const conversations: Record<UserPattern, Array<{ user: string; ai: string; confidence?: number }>> = {
    A: [
      { user: '我需要分析这个数据集。首先，让我们定义目标。', ai: '很好的方法！让我们先明确分析目标...', confidence: 0.92 },
      { user: '你能解释一下这个算法的原理吗？', ai: '这个算法基于...', confidence: 0.88 },
      { user: '让我验证一下你说的这个公式。', ai: '当然，这里是详细推导...', confidence: 0.95 }
    ],
    B: [
      { user: '这个概念我不太理解，能举个例子吗？', ai: '举个例子...', confidence: 0.85 },
      { user: '我试着自己实现了一下，你帮我看看对吗？', ai: '让我检查你的实现...', confidence: 0.90 }
    ],
    C: [
      { user: '帮我写这段代码', ai: '这是代码实现...', confidence: 0.75 },
      { user: '这个怎么做？', ai: '你可以这样做...', confidence: 0.70 },
      { user: '全部帮我完成吧', ai: '我建议你尝试...', confidence: 0.65 }
    ],
    D: [
      { user: '我想试试这个功能', ai: '可以这样尝试...', confidence: 0.82 },
      { user: '那如果这样呢？', ai: '那样的话...', confidence: 0.78 }
    ],
    E: [
      { user: '这太难了，我不知道怎么办', ai: '让我们分解一下问题...', confidence: 0.68 },
      { user: '完全不懂，你帮我做吧', ai: '我理解困难，但让我们一步步来...', confidence: 0.60 }
    ],
    F: [
      { user: '我自己研究了文档', ai: '很好！有什么问题吗？', confidence: 0.88 },
      { user: '只是确认一下我的理解对不对', ai: '你的理解是正确的...', confidence: 0.92 }
    ]
  };

  const conv = conversations[pattern] || conversations.A;
  const messages: Message[] = [];

  conv.forEach((item, index) => {
    messages.push({
      id: `msg-${index * 2}`,
      role: 'user',
      content: item.user,
      timestamp: new Date(Date.now() - (conv.length - index) * 120000)
    });

    messages.push({
      id: `msg-${index * 2 + 1}`,
      role: 'assistant',
      content: item.ai,
      timestamp: new Date(Date.now() - (conv.length - index) * 120000 + 5000),
      confidence: generateConfidenceScore(item.confidence)
    });
  });

  return messages;
}

// Generate pattern classification
export function generatePatternData(pattern: UserPattern): PatternData {
  const baseScores: Record<UserPattern, Record<string, number>> = {
    A: { A: 8.5, B: 6.0, C: 2.0, D: 5.0, E: 1.5, F: 4.0 },
    B: { A: 6.0, B: 8.0, C: 4.0, D: 5.5, E: 3.0, F: 3.5 },
    C: { A: 2.5, B: 4.0, C: 9.0, D: 3.0, E: 6.5, F: 1.0 },
    D: { A: 5.0, B: 5.5, C: 3.5, D: 8.5, E: 4.0, F: 2.5 },
    E: { A: 1.5, B: 3.0, C: 7.0, D: 4.0, E: 9.0, F: 1.0 },
    F: { A: 5.5, B: 4.5, C: 1.0, D: 2.0, E: 0.5, F: 9.5 }
  };

  const scores = baseScores[pattern];
  const maxScore = Math.max(...Object.values(scores));
  const confidence = maxScore / 10;

  const reasoningMap: Record<UserPattern, string> = {
    A: '用户展现出优秀的任务分解能力(高)、频繁的验证行为(高)和良好的独立性比率(0.75)，符合战略思考者特征。',
    B: '用户保持适度的AI使用频率、良好的学习进度和平衡的独立性，展现快速学习者特征。',
    C: '用户表现出高频率的AI依赖(低独立性0.35)、很少验证行为，存在技能退化风险。',
    D: '用户展现高交互频率和多样化任务尝试，但缺乏系统性规划和充分验证。',
    E: '用户在复杂任务中高度依赖AI、缺乏任务分解能力、验证率极低，需要干预引导。',
    F: '用户很少使用AI辅助、保持极高独立性，可能错失协作效率提升机会。'
  };

  return {
    pattern,
    confidence,
    scores,
    reasoning: reasoningMap[pattern],
    timestamp: new Date()
  };
}

// Generate skill metrics
export function generateSkillMetrics(pattern: UserPattern): SkillMetric[] {
  const skillLevels: Record<UserPattern, Record<string, { level: number; trend: 'improving' | 'stable' | 'declining' }>> = {
    A: {
      '问题分析': { level: 0.9, trend: 'improving' },
      '独立思考': { level: 0.85, trend: 'stable' },
      '信息验证': { level: 0.92, trend: 'improving' },
      '任务规划': { level: 0.88, trend: 'stable' }
    },
    B: {
      '问题分析': { level: 0.75, trend: 'improving' },
      '独立思考': { level: 0.70, trend: 'improving' },
      '信息验证': { level: 0.72, trend: 'stable' },
      '任务规划': { level: 0.68, trend: 'improving' }
    },
    C: {
      '问题分析': { level: 0.45, trend: 'declining' },
      '独立思考': { level: 0.35, trend: 'declining' },
      '信息验证': { level: 0.25, trend: 'declining' },
      '任务规划': { level: 0.40, trend: 'stable' }
    },
    D: {
      '问题分析': { level: 0.60, trend: 'stable' },
      '独立思考': { level: 0.65, trend: 'stable' },
      '信息验证': { level: 0.50, trend: 'declining' },
      '任务规划': { level: 0.45, trend: 'stable' }
    },
    E: {
      '问题分析': { level: 0.30, trend: 'declining' },
      '独立思考': { level: 0.25, trend: 'declining' },
      '信息验证': { level: 0.15, trend: 'declining' },
      '任务规划': { level: 0.20, trend: 'declining' }
    },
    F: {
      '问题分析': { level: 0.80, trend: 'stable' },
      '独立思考': { level: 0.95, trend: 'stable' },
      '信息验证': { level: 0.70, trend: 'stable' },
      '任务规划': { level: 0.75, trend: 'stable' }
    }
  };

  const skills = skillLevels[pattern];

  return Object.entries(skills).map(([skill, data]) => ({
    skill,
    level: data.level,
    trend: data.trend,
    recentScore: data.level + (Math.random() - 0.5) * 0.1,
    historicalAvg: data.level - (data.trend === 'improving' ? 0.1 : data.trend === 'declining' ? -0.1 : 0)
  }));
}

// Generate independence timeline
export function generateIndependenceTimeline(pattern: UserPattern): IndependenceLog[] {
  const baseRatios: Record<UserPattern, number> = {
    A: 0.75, B: 0.65, C: 0.35, D: 0.55, E: 0.25, F: 0.90
  };

  const logs: IndependenceLog[] = [];
  const baseRatio = baseRatios[pattern];

  for (let i = 30; i >= 0; i--) {
    const variance = (Math.random() - 0.5) * 0.15;
    const ratio = Math.max(0, Math.min(1, baseRatio + variance));

    logs.push({
      timestamp: new Date(Date.now() - i * 86400000), // i days ago
      ratio,
      sessionCount: Math.floor(Math.random() * 5) + 1,
      skillBreakdown: generateSkillMetrics(pattern)
    });
  }

  return logs;
}

// Generate calibration data
export function generateCalibrationData(): CalibrationData {
  const bins = [
    { range: '0.0-0.1', confidence: 0.05, accuracy: 0.08, count: 12 },
    { range: '0.1-0.2', confidence: 0.15, accuracy: 0.18, count: 23 },
    { range: '0.2-0.3', confidence: 0.25, accuracy: 0.27, count: 45 },
    { range: '0.3-0.4', confidence: 0.35, accuracy: 0.33, count: 67 },
    { range: '0.4-0.5', confidence: 0.45, accuracy: 0.48, count: 89 },
    { range: '0.5-0.6', confidence: 0.55, accuracy: 0.56, count: 134 },
    { range: '0.6-0.7', confidence: 0.65, accuracy: 0.67, count: 178 },
    { range: '0.7-0.8', confidence: 0.75, accuracy: 0.76, count: 234 },
    { range: '0.8-0.9', confidence: 0.85, accuracy: 0.87, count: 312 },
    { range: '0.9-1.0', confidence: 0.95, accuracy: 0.94, count: 267 }
  ];

  const totalSamples = bins.reduce((sum, bin) => sum + bin.count, 0);
  const ece = bins.reduce((sum, bin) => {
    const weight = bin.count / totalSamples;
    return sum + Math.abs(bin.confidence - bin.accuracy) * weight;
  }, 0);

  return { ece, bins, totalSamples };
}

// Test scenarios
export const TEST_SCENARIOS = [
  {
    id: 'scenario-1',
    name: '战略思考者场景',
    pattern: 'A' as UserPattern,
    description: '展示高元认知能力用户的典型交互',
    highlights: ['任务分解', '主动验证', '高独立性']
  },
  {
    id: 'scenario-2',
    name: '快速学习者场景',
    pattern: 'B' as UserPattern,
    description: '展示平衡学习与AI辅助的用户',
    highlights: ['适度依赖', '快速进步', '灵活调整']
  },
  {
    id: 'scenario-3',
    name: '过度依赖警示',
    pattern: 'C' as UserPattern,
    description: '演示技能退化风险和干预机制',
    highlights: ['依赖检测', '警告提示', '引导干预']
  },
  {
    id: 'scenario-4',
    name: '困境挣扎者救援',
    pattern: 'E' as UserPattern,
    description: '展示对困难用户的支持系统',
    highlights: ['问题识别', '分解引导', '能力建设']
  },
  {
    id: 'scenario-5',
    name: '置信度校准演示',
    pattern: 'A' as UserPattern,
    description: '展示ECE校准和置信度评分机制',
    highlights: ['多因素评分', '校准曲线', '准确性分析']
  },
  {
    id: 'scenario-6',
    name: '隐私保护层级',
    pattern: 'B' as UserPattern,
    description: '演示三层隐私架构的差异',
    highlights: ['内容隐藏', '部分存储', '完整分析']
  }
];

// Export all patterns for iteration
export const ALL_PATTERNS: UserPattern[] = ['A', 'B', 'C', 'D', 'E', 'F'];
