import { useState, useRef, useEffect } from 'react';
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
import { ChevronDown, ChevronUp, Send, Sparkles, Loader2, Brain } from 'lucide-react';

// AI响应生成器 - 根据用户输入和模式生成回复
const generateAIResponse = (userInput: string, pattern: UserPattern, _conversationHistory: Message[]): string => {
  const input = userInput.toLowerCase();

  // 模式A: 深思熟虑型 - 详细、准确的回复
  if (pattern === 'A') {
    if (input.includes('什么') || input.includes('如何') || input.includes('为什么')) {
      return `根据您的问题"${userInput}"，让我为您详细分析：这个问题涉及多个层面的考量。首先，我们需要理解其基本概念；其次，要考虑实际应用场景；最后，还需要权衡不同方案的利弊。基于现有知识，我建议您从基础原理入手，逐步深入理解。`;
    }
    return `感谢您的输入。我注意到您提到了"${userInput}"，这是一个值得深入探讨的话题。让我从多个角度为您分析：从理论基础来看，这涉及到核心概念的理解；从实践角度来说，需要结合具体场景；综合考虑，我建议采取循序渐进的方式。`;
  }

  // 模式B: 平衡型 - 适度依赖AI
  if (pattern === 'B') {
    if (input.includes('帮我') || input.includes('能否')) {
      return `好的，关于"${userInput}"，我可以为您提供一些参考建议。不过建议您也可以自己尝试思考一下，结合我的建议和您自己的理解，会得到更好的效果。`;
    }
    return `理解您的问题。针对"${userInput}"，这里有一些要点供您参考。建议您在使用这些信息时，结合自己的实际情况进行调整和验证。`;
  }

  // 模式C: 过度依赖型 - 简单直接的回复
  if (pattern === 'C') {
    if (input.includes('帮我') || input.includes('给我')) {
      return `好的，针对"${userInput}"，答案是这样的。您可以直接使用这个方案，应该可以解决您的问题。`;
    }
    return `收到您的请求。关于"${userInput}"，我建议您采用这个方法。按照步骤执行就可以了。`;
  }

  // 模式D: 探索尝试型 - 鼓励性回复
  if (pattern === 'D') {
    if (input.includes('试试') || input.includes('测试')) {
      return `很高兴看到您愿意探索！关于"${userInput}"，这是一个很好的尝试方向。我建议您可以先从简单的场景开始，然后逐步增加复杂度。在尝试过程中，记得及时验证结果哦。`;
    }
    return `您的想法很有创意！针对"${userInput}"，我可以提供一些思路供您参考。建议您在实践中不断调整，找到最适合的方案。如果遇到问题，随时可以再来讨论。`;
  }

  // 模式E: 知识盲区型 - 基础引导型回复
  if (pattern === 'E') {
    return `我理解您想了解"${userInput}"。让我先从最基础的概念开始解释：这个概念的核心是...。建议您先掌握这个基础知识，然后我们再进行下一步的学习。您可以先试着理解这个部分，有任何疑问都可以继续问我。`;
  }

  // 模式F: 低效交互型 - 引导性回复
  if (pattern === 'F') {
    if (input.length < 5) {
      return `我注意到您的输入"${userInput}"比较简短。为了更好地帮助您，能否提供更多细节呢？比如具体的场景、您的目标、或者遇到的具体问题？这样我就能给您更有针对性的建议。`;
    }
    return `感谢您提供更多信息。基于"${userInput}"，我建议您可以尝试以下方法。同时，如果能够更系统地描述您的需求，我可以提供更精准的帮助。`;
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

  // 定义模式原型（理想特征向量）
  const prototypes: Record<UserPattern, BehavioralFeatures> = {
    A: { // 战略思考者：高分解、高验证、中等迭代、高战略性、低时间压力
      decompositionScore: 0.8,
      verificationIntensity: 0.9,
      iterationCount: 2,
      strategicQuestionRatio: 0.9,
      timePressureIndicator: 0.2
    },
    B: { // 快速学习者：中等分解、中等验证、高迭代、混合问题、中等时间压力
      decompositionScore: 0.5,
      verificationIntensity: 0.6,
      iterationCount: 3,
      strategicQuestionRatio: 0.6,
      timePressureIndicator: 0.5
    },
    C: { // 过度依赖：低分解、低验证、低迭代、低战略性、高时间压力
      decompositionScore: 0.2,
      verificationIntensity: 0.2,
      iterationCount: 0,
      strategicQuestionRatio: 0.3,
      timePressureIndicator: 0.8
    },
    D: { // 探索尝试：中等分解、中等验证、非常高迭代、探索性问题
      decompositionScore: 0.6,
      verificationIntensity: 0.5,
      iterationCount: 4,
      strategicQuestionRatio: 0.7,
      timePressureIndicator: 0.3
    },
    E: { // 知识盲区：低分解、低验证、低迭代、基础问题
      decompositionScore: 0.3,
      verificationIntensity: 0.3,
      iterationCount: 1,
      strategicQuestionRatio: 0.4,
      timePressureIndicator: 0.6
    },
    F: { // 低效沟通：极低分解、极低验证、无迭代、指令式
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
    A: '用户展现出深思熟虑的特征，提问详细且有深度，显示出较强的思考能力和系统性规划。',
    B: '用户表现出平衡的学习态度，既寻求帮助也保持独立思考，迭代改进意识强。',
    C: '用户倾向于直接获取答案，较少进行独立分析和验证，可能过度依赖AI辅助。',
    D: '用户展现出探索精神，愿意尝试和实验，通过多次迭代寻找最佳方案。',
    E: '用户在该领域可能存在知识盲区，提问较为基础，需要从基本概念开始引导。',
    F: '用户的表达较为简短或模糊，元认知参与度低，可能需要结构化引导提高交互效率。'
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '您好！我是基于MCA框架的AI助手。我会实时分析您的元认知行为模式，提供个性化支持。请随意提问，我将识别您的Planning（规划）、Monitoring（监控）、Evaluation（评估）和Regulation（调节）能力。',
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        <h1 className="text-3xl font-bold">智能对话演示</h1>
        <p className="mt-2 text-muted-foreground">
          与AI进行真实对话，系统将实时分析您的行为模式并提供个性化响应
        </p>
      </div>

      {/* Real-time Pattern Detection */}
      <Card className="border-2 border-primary/50 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary animate-pulse" />
              <CardTitle>实时模式识别</CardTitle>
            </div>
            <Badge className={cn(
              'text-white px-3 py-1',
              `bg-${patternInfo.color}-600`
            )}>
              模式 {detectedPattern}
            </Badge>
          </div>
          <CardDescription>基于MCA框架的五维行为特征分析</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">当前识别模式</div>
                <div className="text-lg font-bold mt-1">
                  {patternInfo.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-muted-foreground">识别置信度</div>
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

      {/* Adaptive Scaffolding Support */}
      {showScaffolding && scaffoldingSuggestion.shouldDisplay && (
        <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-orange-900">自适应脚手架支持</CardTitle>
              </div>
              <button
                onClick={() => setShowScaffolding(false)}
                className="text-xs text-orange-700 hover:text-orange-900 underline"
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat Messages */}
        <div className="lg:col-span-2">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>实时对话</CardTitle>
                  <CardDescription>
                    输入您的问题，AI将根据您的模式提供个性化响应
                  </CardDescription>
                </div>
                {isTyping && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>AI正在思考...</span>
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
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="输入您的问题... (按Enter发送)"
                    disabled={isTyping}
                    className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isTyping || !inputValue.trim()}
                    className="px-6"
                  >
                    {isTyping ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>💡 提示：尝试不同的提问方式，AI会识别您的交互模式</span>
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

          {/* Quick Tips */}
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-blue-900">使用提示</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-blue-800">
              <p>💬 <strong>尝试不同提问：</strong></p>
              <ul className="ml-4 space-y-1 text-xs">
                <li>• "帮我解决这个问题" (可能识别为模式C)</li>
                <li>• "为什么会这样？详细分析一下" (可能识别为模式A)</li>
                <li>• "我想试试这个方法" (可能识别为模式D)</li>
                <li>• "这是什么？" (可能识别为模式E)</li>
              </ul>
              <p className="mt-3 text-xs text-blue-600">
                系统会根据您的输入长度、提问方式、用词习惯等多个维度实时分析您的行为模式。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
