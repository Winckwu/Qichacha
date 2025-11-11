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
      { user: '我需要分析用户留存率数据。首先，让我明确三个目标：1)识别流失关键时间点 2)找出高留存用户特征 3)提出可测试的改进方案。', ai: '很好的战略思维！您的目标清晰且可量化。建议先从漏斗分析开始，分析Day1、Day7、Day30留存率。同时需要设定验证标准：样本量>1000，置信度95%。', confidence: 0.92 },
      { user: '对，让我先看看数据分布。你能解释为什么要用Cohort分析而不是简单平均值？', ai: 'Cohort分析能消除时间偏差。如果11月新增用户质量突然提升，简单平均会混淆这个信号。Cohort把每批用户独立追踪，能看到真实趋势。', confidence: 0.88 },
      { user: '有道理。让我验证一下你说的这个公式：留存率 = 活跃用户数 / 新增用户数。', ai: '关键问题！"活跃"定义直接影响结论。建议分层验证：1)登录留存 2)核心功能使用留存 3)付费转化留存。不同场景用不同指标。', confidence: 0.95 }
    ],
    B: [
      { user: '帮我优化这段Python代码，处理10万条数据要30秒，太慢了', ai: '看到瓶颈了：循环里反复访问DataFrame。快速方案：用向量化操作替换for循环，把iterrows()改成apply()。预计提升10-20倍，降到2-3秒。', confidence: 0.85 },
      { user: '还不够好，我需要处理百万级数据。能用多进程吗？', ai: '可以！第二版：1)用groupby+agg替代循环（快5倍）2)加multiprocessing.Pool处理分块（快4倍CPU核数）。百万数据预计5-8秒。', confidence: 0.88 },
      { user: '看起来不错，让我先测试向量化版本，再决定要不要上多进程', ai: '明智的选择！测试流程：1)用1万条验证正确性 2)用10万条测速度 3)profile找新瓶颈。测完反馈结果，我帮你针对性优化。', confidence: 0.90 }
    ],
    C: [
      { user: '我在学习React的useEffect，想深入理解为什么需要依赖数组？不传会怎样？', ai: '很好的学习型问题！依赖数组控制"何时重新执行副作用"。1)不传：每次渲染都执行 2)空数组[]：只在mount时执行一次 3)传[count]：count变化时执行。本质是React用Object.is()浅比较依赖项。', confidence: 0.82 },
      { user: '如果用useCallback+useEffect会怎样？和直接在effect里定义函数有什么区别？', ai: '很好的探索！对比三种：A)effect内定义函数（简单）B)useCallback+依赖（避免重跑）C)useRef存函数（最新值）。优缺点：A适合简单场景，B适合多处使用，C适合需要最新值但不想触发重渲染。', confidence: 0.85 },
      { user: '我想实际试试这三种方案，你能帮我设计对比实验吗？比如做个计数器？', ai: '完美的学习方式！实验设计：1)场景：父组件传callback给子组件 2)变量：count state 3)对比指标：re-render次数、callback引用变化。用React DevTools Profiler测量。关键：memo+useCallback是配套的。', confidence: 0.88 }
    ],
    D: [
      { user: '你说React 18的并发渲染能提升性能，这个结论的数据依据是什么？', ai: '数据来源：1)React官方benchmark显示长列表FPS从30到58 2)Vercel的A/B测试Core Web Vitals改善23%。需要注意：性能提升因场景而异，CPU密集型任务收益大，IO等待型收益小。', confidence: 0.90 },
      { user: '官方数据可能有偏，有第三方独立验证吗？测试的设备配置是什么？', ai: '第三方验证：1)LogRocket监控报告：30万用户LCP改善平均18%，但最差10%用户反而恶化（低端设备）2)Chrome团队分析：低端安卓<4GB RAM效果不显著。测试环境：官方用M1，第三方用中位数配置骁龙778G。', confidence: 0.92 },
      { user: '好的，我去查这几个来源。让我先用WebPageTest跑一下对比测试。', ai: '专业！WebPageTest配置：1)测试地点选目标用户地区 2)设备选P50机型 3)网络用3G Fast模拟弱网 4)至少跑9次取中位数。记得控制变量：除React版本外，代码、资源都要一致。', confidence: 0.94 }
    ],
    E: [
      { user: '我要写一个用户注册接口，需要验证邮箱和密码，快速帮我完成', ai: '直接方案：用正则验证邮箱格式，密码要求至少8位含字母数字，用bcrypt加密存储。核心代码：email正则匹配、密码强度检查、hashpw加密、数据库insert。5分钟搞定。', confidence: 0.75 },
      { user: '好的，直接用这个，看起来够用了', ai: '部署提醒：1)pip install bcrypt 2)生产环境加rate limiting防暴力破解 3)邮箱字段加唯一索引防重复。这三个是最常见的坑，快速加上避免后续麻烦。', confidence: 0.78 }
    ],
    F: [
      { user: '这个SQL查询帮我写一下', ai: '⚠️ 在我帮你写之前，请先回答：1)查询目标是什么？2)涉及哪些表？3)你尝试过写吗？这些信息能帮你理解查询逻辑而不是盲目复制。', confidence: 0.65 },
      { user: '呃...我想查用户表里的数据，具体的我也不太清楚，你直接给我写吧', ai: '我理解你很着急，但直接给SQL反而会害了你。让我们换个方式：先告诉我你要解决的实际业务问题（比如"找出最近注册但还没购买的用户"），然后我教你怎么把业务问题拆解成查询步骤。这样下次你自己就能搞定。', confidence: 0.60 },
      { user: '好吧...我试试。我要找最近7天注册的用户', ai: '很好的开始！✅ 现在分解：数据来源是users表，时间范围是最近7天。请思考：1)用户表叫什么名字？2)注册时间字段叫什么？3)"最近7天"从今天算还是从特定日期算？回答后我会教你写WHERE条件。', confidence: 0.58 }
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
    A: { A: 8.5, B: 6.0, C: 4.0, D: 6.5, E: 2.0, F: 1.5 },
    B: { A: 6.0, B: 8.0, C: 5.0, D: 5.5, E: 4.5, F: 2.0 },
    C: { A: 3.0, B: 5.0, C: 9.0, D: 4.5, E: 2.5, F: 1.5 },
    D: { A: 6.5, B: 5.5, C: 4.0, D: 8.5, E: 3.0, F: 2.0 },
    E: { A: 2.0, B: 4.5, C: 3.0, D: 3.5, E: 9.0, F: 5.0 },
    F: { A: 1.5, B: 2.5, C: 2.0, D: 2.0, E: 5.5, F: 9.5 }
  };

  const scores = baseScores[pattern];
  const maxScore = Math.max(...Object.values(scores));
  const confidence = maxScore / 10;

  const reasoningMap: Record<UserPattern, string> = {
    A: '展现出系统性分解和战略思考的特征，主动进行任务规划和验证，具有强大的元认知能力。',
    B: '优先效率和快速迭代，通过多轮优化达到目标，在速度和质量之间保持平衡。',
    C: '表现出学习探索的倾向，通过反复尝试和对比来建立深度理解，重视过程学习。',
    D: '展现出谨慎的验证意识，在接受AI输出前进行详细检查，防范错误的意识强。',
    E: '采用务实的任务完成策略，快速接受AI建议以提高效率，适合常规低风险场景。',
    F: '元认知参与度较低，缺乏任务分解和验证习惯，存在过度依赖和技能退化风险。'
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
      '问题分析': { level: 0.65, trend: 'improving' },
      '独立思考': { level: 0.60, trend: 'improving' },
      '信息验证': { level: 0.55, trend: 'stable' },
      '任务规划': { level: 0.58, trend: 'improving' }
    },
    D: {
      '问题分析': { level: 0.82, trend: 'stable' },
      '独立思考': { level: 0.78, trend: 'stable' },
      '信息验证': { level: 0.90, trend: 'improving' },
      '任务规划': { level: 0.75, trend: 'stable' }
    },
    E: {
      '问题分析': { level: 0.50, trend: 'stable' },
      '独立思考': { level: 0.45, trend: 'declining' },
      '信息验证': { level: 0.35, trend: 'declining' },
      '任务规划': { level: 0.40, trend: 'stable' }
    },
    F: {
      '问题分析': { level: 0.30, trend: 'declining' },
      '独立思考': { level: 0.25, trend: 'declining' },
      '信息验证': { level: 0.15, trend: 'declining' },
      '任务规划': { level: 0.20, trend: 'declining' }
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
    A: 0.80, B: 0.68, C: 0.58, D: 0.75, E: 0.42, F: 0.18
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
    name: '战略分解者场景',
    pattern: 'A' as UserPattern,
    description: '展示高元认知能力用户的系统性交互',
    highlights: ['任务分解', '主动验证', '高独立性']
  },
  {
    id: 'scenario-2',
    name: '效率迭代者场景',
    pattern: 'B' as UserPattern,
    description: '展示快速迭代优化的用户模式',
    highlights: ['快速迭代', '效率优先', '灵活调整']
  },
  {
    id: 'scenario-3',
    name: '学习探索者场景',
    pattern: 'C' as UserPattern,
    description: '展示深度学习和多方案对比的用户',
    highlights: ['深度理解', '多方案对比', '探索学习']
  },
  {
    id: 'scenario-4',
    name: '务实完成者场景',
    pattern: 'E' as UserPattern,
    description: '展示快速任务完成的效率优先用户',
    highlights: ['快速完成', '效率优先', '低验证']
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
