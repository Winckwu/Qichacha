import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import {
  generatePatternData,
  PATTERN_INFO,
  type UserPattern,
  type Message,
} from '@/data/mockData';
import { cn, formatDate, getConfidenceColor } from '@/lib/utils';
import { ChevronDown, ChevronUp, Send, Sparkles, Loader2, Brain, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

// AI响应生成器 - 根据用户输入和模式生成回复 (Based on MCA Framework)
const generateAIResponse = (userInput: string, pattern: UserPattern, _conversationHistory: Message[]): string => {
  const input = userInput.toLowerCase();

  // 模式A: 战略分解者 - 详细、结构化的分析回复
  if (pattern === 'A') {
    if (input.includes('什么') || input.includes('如何') || input.includes('为什么')) {
      return `关于"${userInput}"，让我进行系统性分析：

**核心概念**：这个问题涉及几个关键维度...

**方法论**：建议采用以下分析框架：
1. 首先明确问题边界和目标
2. 识别关键影响因素
3. 评估各因素的相互关系
4. 制定验证标准

**潜在风险**：需要注意的假设和限制条件包括...

建议您在采用这个分析时，根据具体情况调整框架。`;
    }
    return `针对"${userInput}"，这确实是个值得深入探讨的话题。从多个层面分析：理论基础、实践应用、权衡取舍。建议采用结构化方法逐步推进，保持对关键假设的验证。`;
  }

  // 模式B: 效率迭代者 - 快速回复但提示验证
  if (pattern === 'B') {
    if (input.includes('帮我') || input.includes('能否')) {
      return `好的，关于"${userInput}"，这里是快速方案：[具体建议]。建议您快速测试一下，如果不符合预期我们可以立即调整。记得验证关键步骤。`;
    }
    return `针对"${userInput}"，直接给您可行方案：[解决方案]。这个方案在类似场景中效果不错。如有问题请随时反馈，我们快速迭代优化。`;
  }

  // 模式C: 学习探索者 - 深度解释和多方案对比
  if (pattern === 'C') {
    if (input.includes('为什么') || input.includes('原理') || input.includes('如何')) {
      return `很好的学习型问题！关于"${userInput}"，让我详细解释：

**方法A**：传统方法是...（优点：...，缺点：...）
**方法B**：另一种思路是...（优点：...，缺点：...）
**方法C**：近期流行的做法是...（优点：...，缺点：...）

**对比分析**：这三种方法的适用场景各不相同...

**深入学习**：如果想进一步理解，建议探索以下方面...

您想先尝试哪种方法？我可以提供更详细的指导。`;
    }
    return `针对"${userInput}"，让我提供几种不同的思路供您探索：[多个方案]。每种方法背后的原理是...。建议您实验对比，看哪种更符合您的需求。过程中有任何发现欢迎讨论！`;
  }

  // 模式D: 验证谨慎者 - 附带可验证信息和参考依据
  if (pattern === 'D') {
    return `关于"${userInput}"，这是我的分析：[具体内容]

**信息来源**：此结论基于...
**验证建议**：您可以通过以下方式交叉验证：
  • 检查点1：...
  • 检查点2：...

**潜在误差**：需要注意的是，这个分析的可靠性受...因素影响

**替代方案**：如果这个方案不合适，可以考虑...

建议您在采纳前验证关键假设是否符合您的实际情况。`;
  }

  // 模式E: 务实完成者 - 直接、简洁的答案
  if (pattern === 'E') {
    if (input.includes('帮我') || input.includes('快速')) {
      return `针对"${userInput}"，直接答案：[具体方案]。按这个步骤执行即可：1)... 2)... 3)...。应该能快速解决您的问题。`;
    }
    return `关于"${userInput}"，最直接的做法是：[答案]。这是标准解决方案，直接应用就可以。如果遇到问题再联系我。`;
  }

  // 模式F: 无批判依赖者 - 强制引导性回复，避免直接给答案
  if (pattern === 'F') {
    if (input.length < 10) {
      return `⚠️ 我注意到您的输入"${userInput}"比较简短。在我提供建议前，请先思考并回答：

1. 这个问题的目标是什么？
2. 您已经尝试过什么方法？
3. 您期望的结果是什么样的？

提供这些信息后，我能给您更有针对性的帮助，同时也帮助您更好地理解问题本质。`;
    }
    return `关于"${userInput}"，在给出答案前，我想先引导您思考：

**分析问题**：这个任务可以分解为哪几个步骤？
**评估方案**：有哪些可能的解决路径？

请先尝试回答这两个问题，然后我会基于您的思考提供更深入的建议。这样能帮助您建立独立分析能力，而不只是获得一个答案。`;
  }

  return `收到您的消息："${userInput}"。让我为您分析一下这个问题。`;
};

// 多维度行为特征分析 - 基于MCA框架的五维特征
interface BehavioralFeatures {
  decompositionScore: number;      // 任务分解能力 (0-1)
  verificationIntensity: number;    // 验证强度 (0-1)
  iterationCount: number;           // 迭代次数
  strategicQuestionRatio: number;   // 战略性问题占比 (0-1)
  timePressureIndicator: number;    // 时间压力指标 (0-1, 0=从容 1=急迫)
}

// 元认知子过程评分
interface MetacognitiveScores {
  planning: number;       // 规划质量 (0-10)
  monitoring: number;     // 监控强度 (0-10)
  evaluation: number;     // 评估彻底性 (0-10)
  regulation: number;     // 调节有效性 (0-10)
}

// 提取行为特征
const extractBehavioralFeatures = (
  userInput: string,
  conversationHistory: Message[]
): BehavioralFeatures => {
  const input = userInput.toLowerCase();
  const inputLength = userInput.length;

  // 1. 分解得分：是否有分步思考的迹象
  let decompositionScore = 0;
  if (input.includes('首先') || input.includes('然后') || input.includes('最后')) decompositionScore += 0.3;
  if (input.includes('步骤') || input.includes('阶段') || input.includes('分别')) decompositionScore += 0.3;
  if (input.match(/第[一二三四五]|1\.|2\.|3\./)) decompositionScore += 0.4;

  // 2. 验证强度：是否表现出验证意图
  let verificationIntensity = 0;
  if (input.includes('验证') || input.includes('确认') || input.includes('检查')) verificationIntensity += 0.4;
  if (input.includes('正确') || input.includes('准确') || input.includes('可靠')) verificationIntensity += 0.3;
  if (input.includes('来源') || input.includes('依据') || input.includes('证据')) verificationIntensity += 0.3;

  // 3. 迭代计数：看历史消息中的改进请求
  const recentMessages = conversationHistory.slice(-5);
  const iterationCount = recentMessages.filter(m =>
    m.role === 'user' && (
      m.content.includes('修改') ||
      m.content.includes('改进') ||
      m.content.includes('再') ||
      m.content.includes('另外')
    )
  ).length;

  // 4. 战略性问题比率
  const hasStrategicKeywords =
    input.includes('为什么') || input.includes('如何') ||
    input.includes('应该') || input.includes('是否') ||
    input.includes('建议') || input.includes('方案') ||
    input.includes('策略') || input.includes('方法');

  const hasTacticalKeywords =
    input.includes('帮我') || input.includes('给我') ||
    input.includes('直接') || input.includes('快速');

  let strategicQuestionRatio = 0.5; // 默认中等
  if (hasStrategicKeywords && !hasTacticalKeywords) strategicQuestionRatio = 0.8;
  else if (!hasStrategicKeywords && hasTacticalKeywords) strategicQuestionRatio = 0.2;
  else if (hasStrategicKeywords && hasTacticalKeywords) strategicQuestionRatio = 0.5;

  // 5. 时间压力：基于输入长度和紧急性关键词
  let timePressureIndicator = 0.3; // 默认低压力
  if (input.includes('快') || input.includes('急') || input.includes('马上') || input.includes('立即')) {
    timePressureIndicator = 0.9;
  } else if (inputLength < 20) {
    timePressureIndicator = 0.6; // 简短输入可能意味着想快速得到答案
  } else if (inputLength > 100) {
    timePressureIndicator = 0.2; // 详细输入表明有时间思考
  }

  return {
    decompositionScore: Math.min(1, decompositionScore),
    verificationIntensity: Math.min(1, verificationIntensity),
    iterationCount,
    strategicQuestionRatio,
    timePressureIndicator
  };
};

// 计算元认知子过程得分
const calculateMetacognitiveScores = (
  features: BehavioralFeatures,
  userInput: string
): MetacognitiveScores => {
  const input = userInput.toLowerCase();

  // Planning: 基于分解和战略思考
  const planning = Math.round(
    (features.decompositionScore * 5 +
     features.strategicQuestionRatio * 5) * 10
  ) / 10;

  // Monitoring: 基于问题类型和迭代
  const hasMonitoringKeywords =
    input.includes('进度') || input.includes('状态') ||
    input.includes('检查') || input.includes('目前');
  const monitoring = Math.round(
    (features.iterationCount * 2 +
     (hasMonitoringKeywords ? 5 : 2)) * 10
  ) / 10;

  // Evaluation: 基于验证强度
  const evaluation = Math.round(features.verificationIntensity * 10 * 10) / 10;

  // Regulation: 基于迭代和调整意愿
  const hasRegulationKeywords =
    input.includes('调整') || input.includes('改进') ||
    input.includes('优化') || input.includes('换个');
  const regulation = Math.round(
    (features.iterationCount * 1.5 +
     (hasRegulationKeywords ? 5 : 3)) * 10
  ) / 10;

  return {
    planning: Math.min(10, planning),
    monitoring: Math.min(10, monitoring),
    evaluation: Math.min(10, evaluation),
    regulation: Math.min(10, regulation)
  };
};

// 基于特征向量进行模式分类
const analyzeUserPattern = (userInput: string, conversationHistory: Message[]): {
  detectedPattern: UserPattern;
  confidence: number;
  reasoning: string;
  features: BehavioralFeatures;
  metacognitiveScores: MetacognitiveScores;
} => {
  // 提取行为特征
  const features = extractBehavioralFeatures(userInput, conversationHistory);
  const metacognitiveScores = calculateMetacognitiveScores(features, userInput);

  // 定义模式原型（理想特征向量）- Based on MCA Framework Chapter 5
  const prototypes: Record<UserPattern, BehavioralFeatures> = {
    A: { // Pattern A: Strategic Decomposition & Control
      // 战略分解者：高分解、高验证、中高迭代、高战略性、低时间压力
      decompositionScore: 0.8,
      verificationIntensity: 0.9,
      iterationCount: 2,
      strategicQuestionRatio: 0.9,
      timePressureIndicator: 0.2
    },
    B: { // Pattern B: Efficiency-Focused Iteration
      // 效率迭代者：中等分解、中等验证、高迭代、混合问题、中等时间压力
      decompositionScore: 0.5,
      verificationIntensity: 0.6,
      iterationCount: 3,
      strategicQuestionRatio: 0.6,
      timePressureIndicator: 0.5
    },
    C: { // Pattern C: Learning-Oriented Exploration
      // 学习探索者：低中分解、低中验证、非常高迭代、探索性问题
      decompositionScore: 0.4,
      verificationIntensity: 0.4,
      iterationCount: 5,
      strategicQuestionRatio: 0.7,
      timePressureIndicator: 0.3
    },
    D: { // Pattern D: Verification-Driven Caution
      // 验证谨慎者：中等分解、非常高验证、低迭代（完善后提交）、谨慎问题
      decompositionScore: 0.5,
      verificationIntensity: 0.9,
      iterationCount: 1,
      strategicQuestionRatio: 0.6,
      timePressureIndicator: 0.4
    },
    E: { // Pattern E: Task Completion Pragmatism
      // 务实完成者：低分解、低验证、低迭代（快速接受）、战术性问题、时间压力
      decompositionScore: 0.2,
      verificationIntensity: 0.2,
      iterationCount: 0,
      strategicQuestionRatio: 0.3,
      timePressureIndicator: 0.8
    },
    F: { // Pattern F: Uncritical Reliance
      // 无批判依赖者：极低分解、极低验证、无迭代、指令式、高时间压力
      decompositionScore: 0.1,
      verificationIntensity: 0.1,
      iterationCount: 0,
      strategicQuestionRatio: 0.2,
      timePressureIndicator: 0.9
    }
  };

  // 计算与各原型的欧氏距离
  const distances: Record<UserPattern, number> = {} as Record<UserPattern, number>;
  const patterns: UserPattern[] = ['A', 'B', 'C', 'D', 'E', 'F'];

  patterns.forEach(pattern => {
    const prototype = prototypes[pattern];
    const distance = Math.sqrt(
      Math.pow(features.decompositionScore - prototype.decompositionScore, 2) +
      Math.pow(features.verificationIntensity - prototype.verificationIntensity, 2) +
      Math.pow((features.iterationCount / 5) - (prototype.iterationCount / 5), 2) + // 归一化
      Math.pow(features.strategicQuestionRatio - prototype.strategicQuestionRatio, 2) +
      Math.pow(features.timePressureIndicator - prototype.timePressureIndicator, 2)
    );
    distances[pattern] = distance;
  });

  // 找到最近的原型
  let detectedPattern: UserPattern = 'B';
  let minDistance = Infinity;

  patterns.forEach(pattern => {
    if (distances[pattern] < minDistance) {
      minDistance = distances[pattern];
      detectedPattern = pattern;
    }
  });

  // 计算置信度（距离越小，置信度越高）
  // 距离范围约为 0-3，映射到置信度 0.95-0.5
  const confidence = Math.max(0.5, Math.min(0.95, 1 - (minDistance / 3) * 0.45));

  const reasoningMap: Record<UserPattern, string> = {
    A: '展现出系统性分解和战略思考的特征，主动进行任务规划和验证，具有强大的元认知能力。',
    B: '优先效率和快速迭代，通过多轮优化达到目标，在速度和质量之间保持平衡。',
    C: '表现出学习探索的倾向，通过反复尝试和对比来建立深度理解，重视过程学习。',
    D: '展现出谨慎的验证意识，在接受AI输出前进行详细检查，防范错误的意识强。',
    E: '采用务实的任务完成策略，快速接受AI建议以提高效率，适合常规低风险场景。',
    F: '元认知参与度较低，缺乏任务分解和验证习惯，存在过度依赖和技能退化风险。'
  };

  return {
    detectedPattern,
    confidence,
    reasoning: reasoningMap[detectedPattern],
    features,
    metacognitiveScores
  };
};

// 任务复杂度分析
interface TaskComplexity {
  level: 'low' | 'medium' | 'high';
  score: number;
  factors: {
    scope: number;          // 范围广度 (0-1)
    analyticalDepth: number; // 分析深度 (0-1)
    dependencies: number;    // 依赖复杂度 (0-1)
  };
  reasoning: string;
}

const analyzeTaskComplexity = (userInput: string): TaskComplexity => {
  const input = userInput.toLowerCase();
  const inputLength = userInput.length;

  // 1. 范围广度分析
  let scope = 0.3; // 默认
  if (input.includes('多个') || input.includes('所有') || input.includes('全面')) scope = 0.8;
  else if (input.includes('比较') || input.includes('对比') || input.includes('分析')) scope = 0.6;
  else if (inputLength > 150) scope = 0.7;

  // 2. 分析深度
  let analyticalDepth = 0.3;
  if (input.includes('深入') || input.includes('详细') || input.includes('为什么')) analyticalDepth = 0.8;
  else if (input.includes('分析') || input.includes('评估') || input.includes('研究')) analyticalDepth = 0.6;
  else if (input.includes('如何') || input.includes('怎样')) analyticalDepth = 0.5;

  // 3. 依赖复杂度
  let dependencies = 0.2;
  const hasSequentialKeywords = input.includes('首先') || input.includes('然后') || input.includes('最后');
  const hasMultipleSteps = input.match(/步骤|阶段|环节/g);
  if (hasSequentialKeywords && hasMultipleSteps) dependencies = 0.7;
  else if (hasSequentialKeywords || hasMultipleSteps) dependencies = 0.5;

  // 计算总体复杂度
  const score = (scope * 0.4 + analyticalDepth * 0.4 + dependencies * 0.2);

  let level: 'low' | 'medium' | 'high';
  let reasoning: string;

  if (score >= 0.6) {
    level = 'high';
    reasoning = '该任务涉及多个维度或需要深入分析，建议进行结构化分解';
  } else if (score >= 0.4) {
    level = 'medium';
    reasoning = '该任务有一定复杂度，可以考虑分步处理';
  } else {
    level = 'low';
    reasoning = '这是一个相对简单直接的任务';
  }

  return {
    level,
    score,
    factors: { scope, analyticalDepth, dependencies },
    reasoning
  };
};

// 脚手架建议 - 基于任务复杂度和用户模式
interface ScaffoldingSuggestion {
  level: 'full' | 'moderate' | 'minimal' | 'none';
  template?: string;
  tips: string[];
  shouldDisplay: boolean;
}

const generateScaffoldingSuggestion = (
  taskComplexity: TaskComplexity,
  userPattern: UserPattern,
  decompositionScore: number
): ScaffoldingSuggestion => {
  // 根据模式和任务复杂度决定支持级别
  let level: 'full' | 'moderate' | 'minimal' | 'none' = 'none';
  const tips: string[] = [];
  let shouldDisplay = false;

  // Pattern F/E/C: 需要更多支持
  if (['F', 'E', 'C'].includes(userPattern) && taskComplexity.level !== 'low') {
    level = 'full';
    shouldDisplay = true;
  }
  // Pattern D/B: 中等支持
  else if (['D', 'B'].includes(userPattern) && taskComplexity.level === 'high') {
    level = 'moderate';
    shouldDisplay = true;
  }
  // Pattern A: 最小支持，仅在非常复杂时
  else if (userPattern === 'A' && taskComplexity.level === 'high' && decompositionScore < 0.5) {
    level = 'minimal';
    shouldDisplay = true;
  }

  // 生成具体建议
  if (level === 'full') {
    tips.push('💡 建议将任务分解为以下步骤：');
    if (taskComplexity.factors.scope > 0.6) {
      tips.push('1️⃣ 明确任务边界和范围');
    }
    if (taskComplexity.factors.analyticalDepth > 0.6) {
      tips.push('2️⃣ 确定分析框架或方法论');
    }
    tips.push('3️⃣ 将大任务拆分为可管理的子任务');
    tips.push('4️⃣ 逐步完成各子任务');
    tips.push('5️⃣ 综合结果并验证完整性');
  } else if (level === 'moderate') {
    tips.push('💡 建议考虑以下关键点：');
    tips.push('• 先明确核心目标');
    tips.push('• 识别主要步骤');
    tips.push('• 在各阶段进行验证');
  } else if (level === 'minimal') {
    tips.push('💡 提示：这是一个复杂任务，考虑分步处理？');
  }

  return {
    level,
    template: level !== 'none' ? generateDecompositionTemplate(taskComplexity) : undefined,
    tips,
    shouldDisplay
  };
};

// 生成分解模板
const generateDecompositionTemplate = (complexity: TaskComplexity): string => {
  if (complexity.level === 'high') {
    return `
【任务分解建议】

🎯 阶段1: 明确与规划
  • 清晰定义任务目标
  • 识别成功标准
  • 评估所需资源

📋 阶段2: 结构化分解
  • 将任务拆分为独立子任务
  • 确定子任务间的依赖关系
  • 排列执行顺序

⚡ 阶段3: 执行与监控
  • 按顺序完成各子任务
  • 定期检查进度
  • 及时调整策略

✅ 阶段4: 整合与验证
  • 综合各部分结果
  • 验证整体质量
  • 确认满足初始目标
    `.trim();
  } else if (complexity.level === 'medium') {
    return `
【简化分解建议】

1. 明确目标和范围
2. 识别2-3个主要步骤
3. 逐步完成并验证
4. 整合最终结果
    `.trim();
  }
  return '';
};

// 技能监控系统 (MCA Section 5.4.4)
interface SkillTrend {
  skill: string;
  baseline: number;       // 基线能力 (0-100)
  current: number;        // 当前能力 (0-100)
  trend: 'improving' | 'stable' | 'declining';
  changePercent: number;  // 变化百分比
  sessionsTracked: number;
}

interface SkillMonitoringState {
  trends: SkillTrend[];
  degradationAlert: boolean;
  recommendedPractice: string[];
}

// 模拟技能趋势数据（在真实系统中应该从数据库读取）
const generateSkillTrends = (
  metacognitiveScores: MetacognitiveScores,
  pattern: UserPattern
): SkillMonitoringState => {
  // 根据元认知得分和模式生成趋势
  const planningBaseline = 70;
  const monitoringBaseline = 65;
  const evaluationBaseline = 75;
  const regulationBaseline = 68;

  const trends: SkillTrend[] = [
    {
      skill: 'Task Decomposition',
      baseline: planningBaseline,
      current: metacognitiveScores.planning * 10,
      trend: metacognitiveScores.planning * 10 >= planningBaseline ? 'improving' :
             metacognitiveScores.planning * 10 >= planningBaseline - 5 ? 'stable' : 'declining',
      changePercent: ((metacognitiveScores.planning * 10 - planningBaseline) / planningBaseline) * 100,
      sessionsTracked: 12
    },
    {
      skill: 'Progress Monitoring',
      baseline: monitoringBaseline,
      current: metacognitiveScores.monitoring * 10,
      trend: metacognitiveScores.monitoring * 10 >= monitoringBaseline ? 'improving' :
             metacognitiveScores.monitoring * 10 >= monitoringBaseline - 5 ? 'stable' : 'declining',
      changePercent: ((metacognitiveScores.monitoring * 10 - monitoringBaseline) / monitoringBaseline) * 100,
      sessionsTracked: 12
    },
    {
      skill: 'Output Verification',
      baseline: evaluationBaseline,
      current: metacognitiveScores.evaluation * 10,
      trend: metacognitiveScores.evaluation * 10 >= evaluationBaseline ? 'improving' :
             metacognitiveScores.evaluation * 10 >= evaluationBaseline - 5 ? 'stable' : 'declining',
      changePercent: ((metacognitiveScores.evaluation * 10 - evaluationBaseline) / evaluationBaseline) * 100,
      sessionsTracked: 12
    },
    {
      skill: 'Strategy Adjustment',
      baseline: regulationBaseline,
      current: metacognitiveScores.regulation * 10,
      trend: metacognitiveScores.regulation * 10 >= regulationBaseline ? 'improving' :
             metacognitiveScores.regulation * 10 >= regulationBaseline - 5 ? 'stable' : 'declining',
      changePercent: ((metacognitiveScores.regulation * 10 - regulationBaseline) / regulationBaseline) * 100,
      sessionsTracked: 12
    }
  ];

  // 检测技能退化
  const decliningSkills = trends.filter(t => t.trend === 'declining');
  const degradationAlert = decliningSkills.length > 0 || pattern === 'C' || pattern === 'F';

  // 生成练习建议
  const recommendedPractice: string[] = [];
  if (degradationAlert) {
    decliningSkills.forEach(skill => {
      recommendedPractice.push(
        `练习${skill.skill}：完成3个独立任务以恢复能力（当前比基线低${Math.abs(skill.changePercent).toFixed(1)}%）`
      );
    });

    if (pattern === 'C' || pattern === 'F') {
      recommendedPractice.push('⚠️ 建议减少AI依赖：尝试每5个任务中至少1个完全独立完成');
    }
  }

  return {
    trends,
    degradationAlert,
    recommendedPractice
  };
};

// 生成置信度详情 - 增强版，包含推理透明度
const generateConfidenceDetails = (
  pattern: UserPattern,
  confidence: number,
  userInput: string
): Message['confidence'] => {
  const baseFactors = {
    modelConfidence: confidence * 0.9 + Math.random() * 0.1,
    crossValidation: confidence * 0.85 + Math.random() * 0.15,
    factualConsistency: confidence * 0.95 + Math.random() * 0.05,
    domainCoverage: confidence * 0.88 + Math.random() * 0.12,
    responseCoherence: confidence * 0.92 + Math.random() * 0.08,
  };

  let level: 'high' | 'moderate' | 'low' | 'critical';
  if (confidence >= 0.8) level = 'high';
  else if (confidence >= 0.6) level = 'moderate';
  else if (confidence >= 0.4) level = 'low';
  else level = 'critical';

  // 基于输入内容生成更详细的解释
  const inputLength = userInput.length;
  const isComplex = inputLength > 100 || userInput.includes('分析') || userInput.includes('对比');
  const hasVerificationIntent = userInput.includes('验证') || userInput.includes('确认');

  let detailedExplanation = `基于识别的模式${pattern}（${PATTERN_INFO[pattern].name}），`;

  if (level === 'high') {
    detailedExplanation += `我以高置信度（${Math.round(confidence * 100)}%）生成此响应。`;
    detailedExplanation += isComplex
      ? ' 虽然问题较复杂，但我的训练数据充分覆盖相关领域。'
      : ' 这是一个我经过充分训练的标准问题类型。';
  } else if (level === 'moderate') {
    detailedExplanation += `我以中等置信度（${Math.round(confidence * 100)}%）生成此响应。`;
    detailedExplanation += ' 建议您进行独立验证，特别是关键信息点。';
    if (hasVerificationIntent) {
      detailedExplanation += ' 我注意到您有验证意识，这很好！';
    }
  } else {
    detailedExplanation += `我的置信度较低（${Math.round(confidence * 100)}%）。`;
    detailedExplanation += ' 强烈建议交叉验证此响应，或咨询领域专家。';
  }

  return {
    score: confidence,
    level,
    factors: baseFactors,
    explanation: detailedExplanation,
  };
};

export default function ChatDemoPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: t('chat.welcomeMessage'),
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [detectedPattern, setDetectedPattern] = useState<UserPattern>('B');
  const [patternConfidence, setPatternConfidence] = useState(0.5);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [currentFeatures, setCurrentFeatures] = useState<BehavioralFeatures>({
    decompositionScore: 0.5,
    verificationIntensity: 0.5,
    iterationCount: 0,
    strategicQuestionRatio: 0.5,
    timePressureIndicator: 0.5
  });
  const [metacognitiveScores, setMetacognitiveScores] = useState<MetacognitiveScores>({
    planning: 5,
    monitoring: 5,
    evaluation: 5,
    regulation: 5
  });
  const [scaffoldingSuggestion, setScaffoldingSuggestion] = useState<ScaffoldingSuggestion>({
    level: 'none',
    tips: [],
    shouldDisplay: false
  });
  const [showScaffolding, setShowScaffolding] = useState(false);
  const [skillMonitoring, setSkillMonitoring] = useState<SkillMonitoringState | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Keyboard accessibility: ESC to close scaffolding
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showScaffolding) {
        setShowScaffolding(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showScaffolding]);

  // 模拟打字效果
  const typeMessage = async (text: string, messageId: string) => {
    const words = text.split('');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      currentText += words[i];
      setMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, content: currentText }
          : msg
      ));

      // 随机延迟，模拟真实打字
      await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30));
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 分析用户模式和元认知特征
    const analysis = analyzeUserPattern(inputValue, messages);
    setDetectedPattern(analysis.detectedPattern);
    setPatternConfidence(analysis.confidence);
    setCurrentFeatures(analysis.features);
    setMetacognitiveScores(analysis.metacognitiveScores);

    // 分析任务复杂度并生成脚手架建议
    const complexity = analyzeTaskComplexity(inputValue);
    const scaffolding = generateScaffoldingSuggestion(
      complexity,
      analysis.detectedPattern,
      analysis.features.decompositionScore
    );
    setScaffoldingSuggestion(scaffolding);
    setShowScaffolding(scaffolding.shouldDisplay);

    // 生成技能监控趋势
    const skillTrends = generateSkillTrends(
      analysis.metacognitiveScores,
      analysis.detectedPattern
    );
    setSkillMonitoring(skillTrends);

    // 模拟AI思考时间
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // 生成AI响应
    const aiResponse = generateAIResponse(inputValue, analysis.detectedPattern, messages);
    const confidenceDetails = generateConfidenceDetails(
      analysis.detectedPattern,
      analysis.confidence,
      inputValue
    );

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      confidence: confidenceDetails,
    };

    setMessages(prev => [...prev, assistantMessage]);

    // 打字效果
    await typeMessage(aiResponse, assistantMessage.id);
    setIsTyping(false);

    // 聚焦输入框
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const patternData = generatePatternData(detectedPattern);
  const patternInfo = PATTERN_INFO[detectedPattern];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t('chat.title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('chat.description')}
        </p>
      </div>

      {/* Real-time Pattern Detection */}
      <Card className="border-2 border-primary/50 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary animate-pulse" />
              <CardTitle>{t('chat.patternDetection.title')}</CardTitle>
            </div>
            <Badge className={cn(
              'text-white px-3 py-1',
              detectedPattern === 'A' && 'bg-blue-600',
              detectedPattern === 'B' && 'bg-green-600',
              detectedPattern === 'C' && 'bg-yellow-600',
              detectedPattern === 'D' && 'bg-purple-600',
              detectedPattern === 'E' && 'bg-orange-600',
              detectedPattern === 'F' && 'bg-red-600'
            )}>
              {t('chat.patternDetection.pattern')} {detectedPattern}
            </Badge>
          </div>
          <CardDescription>{t('chat.patternDetection.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">{t('chat.currentPattern')}</div>
                <div className="text-lg font-bold mt-1">
                  {patternInfo.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-muted-foreground">{t('chat.recognitionConfidence')}</div>
                <div className="text-2xl font-bold text-primary mt-1">
                  {Math.round(patternConfidence * 100)}%
                </div>
              </div>
            </div>
            <Progress
              value={patternConfidence * 100}
              className="h-2"
              indicatorClassName="bg-gradient-to-r from-blue-600 to-purple-600"
            />
            <p className="text-sm text-muted-foreground">
              {patternData.reasoning}
            </p>

            {/* 行为特征维度 */}
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm font-semibold mb-3 text-gray-700">行为特征维度 (MCA Framework)</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">任务分解</span>
                    <span className="font-mono font-medium">{Math.round(currentFeatures.decompositionScore * 100)}%</span>
                  </div>
                  <Progress value={currentFeatures.decompositionScore * 100} className="h-1.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">验证强度</span>
                    <span className="font-mono font-medium">{Math.round(currentFeatures.verificationIntensity * 100)}%</span>
                  </div>
                  <Progress value={currentFeatures.verificationIntensity * 100} className="h-1.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">战略性思考</span>
                    <span className="font-mono font-medium">{Math.round(currentFeatures.strategicQuestionRatio * 100)}%</span>
                  </div>
                  <Progress value={currentFeatures.strategicQuestionRatio * 100} className="h-1.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">迭代次数</span>
                    <span className="font-mono font-medium">{currentFeatures.iterationCount} 次</span>
                  </div>
                  <Progress value={Math.min(100, currentFeatures.iterationCount * 20)} className="h-1.5" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metacognitive Dashboard */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-900">元认知子过程仪表板</CardTitle>
          </div>
          <CardDescription>实时监控您的Planning、Monitoring、Evaluation和Regulation能力</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Planning */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">📋 Planning (规划)</span>
                  <span className="text-xs text-muted-foreground">任务分解 & 战略思考</span>
                </div>
                <span className="text-lg font-bold text-green-700">{metacognitiveScores.planning.toFixed(1)}/10</span>
              </div>
              <Progress
                value={metacognitiveScores.planning * 10}
                className="h-2.5"
                indicatorClassName={cn(
                  metacognitiveScores.planning >= 7 ? 'bg-green-600' :
                  metacognitiveScores.planning >= 4 ? 'bg-yellow-600' :
                  'bg-orange-600'
                )}
              />
            </div>

            {/* Monitoring */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">👁️ Monitoring (监控)</span>
                  <span className="text-xs text-muted-foreground">进度追踪 & 难度识别</span>
                </div>
                <span className="text-lg font-bold text-blue-700">{metacognitiveScores.monitoring.toFixed(1)}/10</span>
              </div>
              <Progress
                value={metacognitiveScores.monitoring * 10}
                className="h-2.5"
                indicatorClassName={cn(
                  metacognitiveScores.monitoring >= 7 ? 'bg-blue-600' :
                  metacognitiveScores.monitoring >= 4 ? 'bg-yellow-600' :
                  'bg-orange-600'
                )}
              />
            </div>

            {/* Evaluation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">✓ Evaluation (评估)</span>
                  <span className="text-xs text-muted-foreground">输出验证 & 质量检查</span>
                </div>
                <span className="text-lg font-bold text-purple-700">{metacognitiveScores.evaluation.toFixed(1)}/10</span>
              </div>
              <Progress
                value={metacognitiveScores.evaluation * 10}
                className="h-2.5"
                indicatorClassName={cn(
                  metacognitiveScores.evaluation >= 7 ? 'bg-purple-600' :
                  metacognitiveScores.evaluation >= 4 ? 'bg-yellow-600' :
                  'bg-orange-600'
                )}
              />
            </div>

            {/* Regulation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">🔄 Regulation (调节)</span>
                  <span className="text-xs text-muted-foreground">策略调整 & 错误恢复</span>
                </div>
                <span className="text-lg font-bold text-indigo-700">{metacognitiveScores.regulation.toFixed(1)}/10</span>
              </div>
              <Progress
                value={metacognitiveScores.regulation * 10}
                className="h-2.5"
                indicatorClassName={cn(
                  metacognitiveScores.regulation >= 7 ? 'bg-indigo-600' :
                  metacognitiveScores.regulation >= 4 ? 'bg-yellow-600' :
                  'bg-orange-600'
                )}
              />
            </div>

            {/* 综合建议 */}
            <div className="mt-4 pt-4 border-t rounded-lg bg-white/50 p-3">
              <div className="text-xs font-semibold mb-2 text-green-800">💡 元认知发展建议</div>
              <div className="text-xs text-green-700 space-y-1">
                {metacognitiveScores.planning < 5 && (
                  <p>• 尝试在提问前明确目标和成功标准，提升规划能力</p>
                )}
                {metacognitiveScores.monitoring < 5 && (
                  <p>• 定期检查进度，识别遇到的困难，加强监控意识</p>
                )}
                {metacognitiveScores.evaluation < 5 && (
                  <p>• 增加对AI输出的验证，交叉检查关键信息</p>
                )}
                {metacognitiveScores.regulation < 5 && (
                  <p>• 当方法不奏效时，尝试调整策略或寻找替代方案</p>
                )}
                {metacognitiveScores.planning >= 7 && metacognitiveScores.monitoring >= 7 &&
                 metacognitiveScores.evaluation >= 7 && metacognitiveScores.regulation >= 7 && (
                  <p className="text-green-600 font-medium">✨ 优秀！您展现出全面的元认知能力</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adaptive Scaffolding Support - Pattern A gets minimal visibility */}
      {showScaffolding && scaffoldingSuggestion.shouldDisplay && !(detectedPattern === 'A' && scaffoldingSuggestion.level === 'minimal') && (
        <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-orange-900">自适应脚手架支持</CardTitle>
              </div>
              <button
                onClick={() => setShowScaffolding(false)}
                className="text-xs text-orange-700 hover:text-orange-900 underline focus:outline-none focus:ring-2 focus:ring-orange-500 rounded px-2 py-1"
                aria-label="关闭脚手架建议"
              >
                关闭
              </button>
            </div>
            <CardDescription>
              根据您的模式（{PATTERN_INFO[detectedPattern].name}）和任务复杂度提供个性化指导
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 支持级别指示 */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/60 border border-orange-200">
                <div>
                  <div className="text-sm font-medium text-orange-900">支持强度</div>
                  <div className="text-xs text-orange-700 mt-1">
                    {scaffoldingSuggestion.level === 'full' && '完整支持 - 详细分步指导'}
                    {scaffoldingSuggestion.level === 'moderate' && '中等支持 - 关键要点提示'}
                    {scaffoldingSuggestion.level === 'minimal' && '最小支持 - 简要提醒'}
                  </div>
                </div>
                <Badge className={cn(
                  'text-white',
                  scaffoldingSuggestion.level === 'full' && 'bg-orange-600',
                  scaffoldingSuggestion.level === 'moderate' && 'bg-amber-600',
                  scaffoldingSuggestion.level === 'minimal' && 'bg-yellow-600'
                )}>
                  {scaffoldingSuggestion.level.toUpperCase()}
                </Badge>
              </div>

              {/* 建议内容 */}
              <div className="space-y-2">
                {scaffoldingSuggestion.tips.map((tip, index) => (
                  <div
                    key={index}
                    className="text-sm text-orange-900 leading-relaxed p-2 rounded bg-white/40"
                  >
                    {tip}
                  </div>
                ))}
              </div>

              {/* 详细模板（仅在full/moderate时显示） */}
              {scaffoldingSuggestion.template && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-orange-900 hover:text-orange-700">
                    📖 查看详细分解模板
                  </summary>
                  <pre className="mt-3 text-xs text-orange-800 bg-white/60 p-4 rounded-lg border border-orange-200 whitespace-pre-wrap">
                    {scaffoldingSuggestion.template}
                  </pre>
                </details>
              )}

              {/* 说明文字 */}
              <div className="mt-4 pt-4 border-t border-orange-200">
                <p className="text-xs text-orange-700">
                  💡 <strong>为什么看到这个？</strong> 基于您当前的元认知模式，系统判断您可能需要
                  结构化支持来更好地完成这个任务。这个建议会随着您能力的提升而逐渐减少（渐进式淡出）。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skill Monitoring System - Only show after 3+ user messages */}
      {skillMonitoring && messages.filter(m => m.role === 'user').length >= 3 && (
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-purple-900">技能监控与趋势追踪</CardTitle>
              </div>
              {skillMonitoring.degradationAlert && (
                <Badge className="bg-red-600 text-white animate-pulse">
                  ⚠️ 退化警告
                </Badge>
              )}
            </div>
            <CardDescription>
              长期能力趋势分析 · 基于{skillMonitoring.trends[0]?.sessionsTracked || 0}个会话的数据
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Skill Trends Grid */}
              <div className="grid gap-3">
                {skillMonitoring.trends.map((trend, index) => {
                  const TrendIcon = trend.trend === 'improving' ? TrendingUp :
                                   trend.trend === 'declining' ? TrendingDown :
                                   AlertTriangle;
                  const trendColor = trend.trend === 'improving' ? 'text-green-600' :
                                    trend.trend === 'declining' ? 'text-red-600' :
                                    'text-yellow-600';
                  const bgColor = trend.trend === 'improving' ? 'bg-green-50 border-green-200' :
                                 trend.trend === 'declining' ? 'bg-red-50 border-red-200' :
                                 'bg-yellow-50 border-yellow-200';

                  return (
                    <div key={index} className={cn('rounded-lg border-2 p-4', bgColor)}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendIcon className={cn('h-4 w-4', trendColor)} />
                            <span className="font-medium text-sm">{trend.skill}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>基线: {trend.baseline}</span>
                            <span>当前: {trend.current.toFixed(1)}</span>
                            <span className={cn('font-bold', trendColor)}>
                              {trend.changePercent >= 0 ? '+' : ''}{trend.changePercent.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <Badge className={cn(
                          'ml-2',
                          trend.trend === 'improving' && 'bg-green-600 text-white',
                          trend.trend === 'stable' && 'bg-yellow-600 text-white',
                          trend.trend === 'declining' && 'bg-red-600 text-white'
                        )}>
                          {trend.trend === 'improving' && '提升中'}
                          {trend.trend === 'stable' && '稳定'}
                          {trend.trend === 'declining' && '下降'}
                        </Badge>
                      </div>

                      {/* Visual comparison bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-12">基线</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gray-400 h-2 rounded-full"
                              style={{ width: `${trend.baseline}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-12">当前</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={cn(
                                'h-2 rounded-full',
                                trend.trend === 'improving' && 'bg-green-600',
                                trend.trend === 'stable' && 'bg-yellow-600',
                                trend.trend === 'declining' && 'bg-red-600'
                              )}
                              style={{ width: `${trend.current}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Degradation Alert & Practice Recommendations */}
              {skillMonitoring.degradationAlert && skillMonitoring.recommendedPractice.length > 0 && (
                <div className="mt-4 p-4 rounded-lg bg-red-50 border-2 border-red-200">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-red-900 mb-1">技能退化检测</div>
                      <div className="text-xs text-red-700">
                        系统检测到您的某些技能相比基线有所下降，建议进行针对性练习：
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 ml-7">
                    {skillMonitoring.recommendedPractice.map((practice, idx) => (
                      <div key={idx} className="text-xs text-red-800 bg-white/60 rounded p-2 border border-red-200">
                        {practice}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary Statistics */}
              <div className="mt-4 pt-4 border-t border-purple-200">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-xl font-bold text-green-600">
                      {skillMonitoring.trends.filter(t => t.trend === 'improving').length}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">提升中</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-xl font-bold text-yellow-600">
                      {skillMonitoring.trends.filter(t => t.trend === 'stable').length}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">保持稳定</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-xl font-bold text-red-600">
                      {skillMonitoring.trends.filter(t => t.trend === 'declining').length}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">需要改进</div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-4 p-3 rounded-lg bg-purple-100/50 border border-purple-200">
                <p className="text-xs text-purple-800">
                  💡 <strong>技能监控说明：</strong> 系统通过持续追踪您的元认知表现，识别能力趋势。
                  当检测到某项技能相比基线下降超过5%或出现高风险模式（C/F）时，会触发退化警告。
                  建议定期进行独立练习以保持和提升能力。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat Messages */}
        <div className="lg:col-span-2">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('chat.realTimeDialogue')}</CardTitle>
                  <CardDescription>
                    {t('chat.realTimeDescription')}
                  </CardDescription>
                </div>
                {isTyping && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t('chat.aiThinking')}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-lg p-4 shadow-sm',
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                          : 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'
                      )}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <div className={cn(
                          'flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold',
                          message.role === 'user'
                            ? 'bg-white/20 text-white'
                            : 'bg-primary/10 text-primary'
                        )}>
                          {message.role === 'user' ? '你' : 'AI'}
                        </div>
                        <p className="text-sm leading-relaxed flex-1">{message.content}</p>
                      </div>

                      <div className={cn(
                        'text-xs ml-8',
                        message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                      )}>
                        {formatDate(message.timestamp)}
                      </div>

                      {/* Pattern-specific Learning Prompts */}
                      {message.role === 'assistant' && detectedPattern === 'C' && (
                        <div className="mt-3 ml-8 p-2 rounded-md bg-yellow-50 border border-yellow-200">
                          <p className="text-xs text-yellow-800">
                            <strong>💡 验证提示：</strong>在接受这个答案前，试着思考：这个答案合理吗？有哪些地方需要进一步验证？
                          </p>
                        </div>
                      )}

                      {/* Confidence Score for AI messages */}
                      {message.role === 'assistant' && message.confidence && (
                        <div className="mt-3 ml-8 rounded-md bg-white border p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-700">置信度评分</span>
                            <button
                              onClick={() =>
                                setExpandedMessage(
                                  expandedMessage === message.id ? null : message.id
                                )
                              }
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              {expandedMessage === message.id ? (
                                <>
                                  收起 <ChevronUp className="h-3 w-3" />
                                </>
                              ) : (
                                <>
                                  详情 <ChevronDown className="h-3 w-3" />
                                </>
                              )}
                            </button>
                          </div>

                          <Progress
                            value={message.confidence.score * 100}
                            className="h-2"
                            indicatorClassName={cn(
                              message.confidence.level === 'high' && 'bg-green-600',
                              message.confidence.level === 'moderate' && 'bg-yellow-600',
                              message.confidence.level === 'low' && 'bg-orange-600',
                              message.confidence.level === 'critical' && 'bg-red-600'
                            )}
                          />

                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs font-bold">
                              {Math.round(message.confidence.score * 100)}%
                            </span>
                            <Badge
                              variant="outline"
                              className={cn('text-xs', getConfidenceColor(message.confidence.level))}
                            >
                              {message.confidence.level.toUpperCase()}
                            </Badge>
                          </div>

                          {/* Expanded Details */}
                          {expandedMessage === message.id && (
                            <div className="mt-3 space-y-2 border-t pt-3">
                              <p className="text-xs text-muted-foreground">
                                {message.confidence.explanation}
                              </p>

                              <div className="space-y-1.5">
                                {Object.entries(message.confidence.factors).map(([key, value]) => {
                                  const labels: Record<string, string> = {
                                    modelConfidence: '模型置信度',
                                    crossValidation: '交叉验证',
                                    factualConsistency: '事实一致性',
                                    domainCoverage: '领域覆盖度',
                                    responseCoherence: '响应连贯性',
                                  };

                                  return (
                                    <div key={key} className="flex items-center gap-2">
                                      <span className="text-xs text-muted-foreground w-24">
                                        {labels[key]}
                                      </span>
                                      <Progress
                                        value={value * 100}
                                        className="h-1.5 flex-1"
                                        indicatorClassName="bg-blue-600"
                                      />
                                      <span className="text-xs font-mono w-10 text-right">
                                        {(value * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Interactive Input */}
              <div className="border-t pt-4">
                {/* Pattern-specific Interface Adjustments */}
                {detectedPattern === 'F' && inputValue.length > 0 && inputValue.length < 10 && (
                  <div className="mb-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-orange-800">
                        <strong>保护性提醒：</strong>您的输入较为简短。为了获得更好的帮助，建议详细描述您的问题、目标和背景信息。
                      </div>
                    </div>
                  </div>
                )}

                {detectedPattern === 'C' && messages.length > 2 && (
                  <div className="mb-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-800">
                        <strong>独立思考提示：</strong>在查看AI回答前，不妨先花30秒思考自己会如何回答这个问题。这有助于提升您的独立分析能力。
                      </div>
                    </div>
                  </div>
                )}

                {/* Pattern A: No intrusive prompts - respecting advanced users' autonomy */}

                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      detectedPattern === 'F' ? "请详细描述您的问题，包括背景和目标..." :
                      detectedPattern === 'C' ? "输入问题前先思考30秒..." :
                      detectedPattern === 'A' ? "输入您的问题..." :
                      "输入您的问题... (按Enter发送)"
                    }
                    disabled={isTyping}
                    className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    aria-label={t('chat.messageInput')}
                    aria-describedby="input-hint"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isTyping || !inputValue.trim() || (detectedPattern === 'F' && inputValue.length < 5)}
                    className="px-6"
                    title={detectedPattern === 'F' && inputValue.length < 5 ? "请输入至少5个字符" : ""}
                    aria-label={isTyping ? t('chat.aiReplying') : t('chat.sendMessage')}
                  >
                    {isTyping ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div id="input-hint" className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  {detectedPattern === 'A' ? (
                    <span>⚡ 高级用户模式：快速响应，最小干预</span>
                  ) : detectedPattern === 'F' ? (
                    <span>🛡️ 保护模式：系统将引导您提供更详细的信息</span>
                  ) : detectedPattern === 'C' ? (
                    <span>🎓 学习支持模式：鼓励独立思考后再查看答案</span>
                  ) : (
                    <span>💡 提示：尝试不同的提问方式，AI会识别您的交互模式</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pattern Info Sidebar */}
        <div className="space-y-6">
          {/* Pattern Details */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                当前模式特征
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-4 border border-primary/20">
                <div className="text-sm font-medium text-muted-foreground">识别模式</div>
                <div className="mt-1 text-xl font-bold">
                  模式 {detectedPattern}: {patternInfo.name}
                </div>
                <div className="mt-2">
                  <Progress
                    value={patternConfidence * 100}
                    className="h-2"
                    indicatorClassName="bg-primary"
                  />
                  <div className="mt-1 text-sm text-muted-foreground">
                    置信度: {Math.round(patternConfidence * 100)}%
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">行为特征</div>
                <ul className="space-y-2">
                  {patternInfo.characteristics.slice(0, 4).map((char, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm rounded-md bg-muted/50 p-2">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Pattern Scores */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>模式匹配度分析</CardTitle>
              <CardDescription>基于对话内容的实时评分</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(patternData.scores)
                .sort(([, a], [, b]) => b - a)
                .map(([pattern, score]) => {
                  const info = PATTERN_INFO[pattern as UserPattern];
                  return (
                    <div key={pattern} className={cn(
                      'rounded-lg border p-2.5',
                      pattern === detectedPattern && 'bg-primary/5 border-primary'
                    )}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">模式 {pattern}</span>
                          {pattern === detectedPattern && (
                            <Badge variant="default" className="text-xs">当前</Badge>
                          )}
                        </div>
                        <span className="text-sm font-mono font-bold">{score.toFixed(1)}/10</span>
                      </div>
                      <Progress
                        value={(score / 10) * 100}
                        className="h-1.5"
                        indicatorClassName={cn(
                          pattern === detectedPattern ? 'bg-primary' : 'bg-muted-foreground/30'
                        )}
                      />
                      <div className="mt-1 text-xs text-muted-foreground">{info.name}</div>
                    </div>
                  );
                })}
            </CardContent>
          </Card>

          {/* Pattern-Specific Tips */}
          <Card className={cn(
            "border-2",
            detectedPattern === 'A' && "border-green-200 bg-green-50/50",
            detectedPattern === 'C' && "border-yellow-200 bg-yellow-50/50",
            detectedPattern === 'F' && "border-orange-200 bg-orange-50/50",
            !['A', 'C', 'F'].includes(detectedPattern) && "border-blue-200 bg-blue-50/50"
          )}>
            <CardHeader>
              <CardTitle className={cn(
                detectedPattern === 'A' && "text-green-900",
                detectedPattern === 'C' && "text-yellow-900",
                detectedPattern === 'F' && "text-orange-900",
                !['A', 'C', 'F'].includes(detectedPattern) && "text-blue-900"
              )}>
                {detectedPattern === 'A' ? '高级用户提示' :
                 detectedPattern === 'C' ? '学习成长建议' :
                 detectedPattern === 'F' ? '有效沟通建议' :
                 '使用提示'}
              </CardTitle>
            </CardHeader>
            <CardContent className={cn(
              "space-y-2 text-sm",
              detectedPattern === 'A' && "text-green-800",
              detectedPattern === 'C' && "text-yellow-800",
              detectedPattern === 'F' && "text-orange-800",
              !['A', 'C', 'F'].includes(detectedPattern) && "text-blue-800"
            )}>
              {detectedPattern === 'A' && (
                <>
                  <p>⚡ <strong>您是高级用户：</strong></p>
                  <ul className="ml-4 space-y-1 text-xs">
                    <li>• 系统已精简辅助提示，专注高效交互</li>
                    <li>• 您可以直接提出复杂、深度的问题</li>
                    <li>• 置信度详情默认展开供您分析</li>
                    <li>• 脚手架支持已最小化，仅在必要时显示</li>
                  </ul>
                </>
              )}
              {detectedPattern === 'C' && (
                <>
                  <p>🎓 <strong>提升独立能力的建议：</strong></p>
                  <ul className="ml-4 space-y-1 text-xs">
                    <li>• 在查看AI答案前，先尝试自己分析30秒</li>
                    <li>• 收到答案后，问自己：这合理吗？如何验证？</li>
                    <li>• 尝试将复杂问题分解为几个小步骤</li>
                    <li>• 定期做一些完全独立的练习任务</li>
                  </ul>
                </>
              )}
              {detectedPattern === 'F' && (
                <>
                  <p>💬 <strong>提高沟通效率的建议：</strong></p>
                  <ul className="ml-4 space-y-1 text-xs">
                    <li>• 提供更多背景信息和具体细节</li>
                    <li>• 明确说明您的目标和期望结果</li>
                    <li>• 尝试用完整句子描述问题，而非关键词</li>
                    <li>• 系统会在输入过短时提醒您补充信息</li>
                  </ul>
                </>
              )}
              {!['A', 'C', 'F'].includes(detectedPattern) && (
                <>
                  <p>💬 <strong>尝试不同提问：</strong></p>
                  <ul className="ml-4 space-y-1 text-xs">
                    <li>• "帮我解决这个问题" (可能识别为模式C)</li>
                    <li>• "为什么会这样？详细分析一下" (可能识别为模式A)</li>
                    <li>• "我想试试这个方法" (可能识别为模式D)</li>
                    <li>• "这是什么？" (可能识别为模式E)</li>
                  </ul>
                  <p className="mt-3 text-xs">
                    系统会根据您的输入长度、提问方式、用词习惯等多个维度实时分析您的行为模式。
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
