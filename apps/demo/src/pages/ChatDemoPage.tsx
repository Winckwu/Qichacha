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

// 分析用户输入，识别可能的模式特征
const analyzeUserPattern = (userInput: string, _conversationHistory: Message[]): {
  detectedPattern: UserPattern;
  confidence: number;
  reasoning: string;
} => {
  const input = userInput.toLowerCase();
  const scores: Record<UserPattern, number> = {
    A: 0, B: 0, C: 0, D: 0, E: 0, F: 0
  };

  // 分析输入长度和复杂度
  const inputLength = userInput.length;
  const hasQuestions = input.includes('为什么') || input.includes('如何') || input.includes('什么');
  const isVague = inputLength < 10;
  const isDetailed = inputLength > 50;

  // 模式A特征：详细、有思考的提问
  if (isDetailed && hasQuestions) scores.A += 3;
  if (input.includes('分析') || input.includes('深入') || input.includes('详细')) scores.A += 2;

  // 模式B特征：平衡的请求
  if (input.includes('参考') || input.includes('建议')) scores.B += 2;
  if (inputLength > 20 && inputLength < 60) scores.B += 2;

  // 模式C特征：直接要答案
  if (input.includes('直接') || input.includes('快速') || input.includes('帮我')) scores.C += 3;
  if (input.includes('答案') || input.includes('结果')) scores.C += 2;

  // 模式D特征：探索性尝试
  if (input.includes('试试') || input.includes('尝试') || input.includes('测试')) scores.D += 3;
  if (input.includes('可以') || input.includes('能不能')) scores.D += 2;

  // 模式E特征：基础问题
  if (input.includes('是什么') || input.includes('怎么用')) scores.E += 3;
  if (isVague && hasQuestions) scores.E += 2;

  // 模式F特征：低效沟通
  if (isVague && !hasQuestions) scores.F += 3;
  if (input.length < 5) scores.F += 3;

  // 找出得分最高的模式
  let maxScore = 0;
  let detectedPattern: UserPattern = 'B';

  Object.entries(scores).forEach(([pattern, score]) => {
    if (score > maxScore) {
      maxScore = score;
      detectedPattern = pattern as UserPattern;
    }
  });

  // 如果所有得分都很低，默认为B（平衡型）
  if (maxScore < 2) {
    detectedPattern = 'B';
    maxScore = 2;
  }

  const confidence = Math.min(0.95, 0.5 + maxScore * 0.1);

  const reasoningMap: Record<UserPattern, string> = {
    A: '用户展现出深思熟虑的特征，提问详细且有深度，显示出较强的思考能力。',
    B: '用户表现出平衡的学习态度，既寻求帮助也保持独立思考。',
    C: '用户倾向于直接获取答案，较少进行独立分析和验证。',
    D: '用户展现出探索精神，愿意尝试和实验，具有良好的学习主动性。',
    E: '用户在该领域可能存在知识盲区，需要从基础开始引导学习。',
    F: '用户的表达较为简短或模糊，可能需要引导以提高沟通效率。'
  };

  return {
    detectedPattern,
    confidence,
    reasoning: reasoningMap[detectedPattern]
  };
};

// 生成置信度详情
const generateConfidenceDetails = (
  pattern: UserPattern,
  confidence: number
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

  return {
    score: confidence,
    level,
    factors: baseFactors,
    explanation: `基于模式${pattern}的特征分析，系统以${Math.round(confidence * 100)}%的置信度生成此响应。`,
  };
};

export default function ChatDemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '您好！我是AI助手。请随意提问，我会根据您的交互模式提供个性化的回复，并实时分析您的学习行为模式。',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [detectedPattern, setDetectedPattern] = useState<UserPattern>('B');
  const [patternConfidence, setPatternConfidence] = useState(0.5);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
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

    // 分析用户模式
    const analysis = analyzeUserPattern(inputValue, messages);
    setDetectedPattern(analysis.detectedPattern);
    setPatternConfidence(analysis.confidence);

    // 模拟AI思考时间
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // 生成AI响应
    const aiResponse = generateAIResponse(inputValue, analysis.detectedPattern, messages);
    const confidenceDetails = generateConfidenceDetails(
      analysis.detectedPattern,
      analysis.confidence
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
          <CardDescription>基于您的对话内容实时分析行为模式</CardDescription>
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
          </div>
        </CardContent>
      </Card>

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
