import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import {
  generateConversation,
  generatePatternData,
  PATTERN_INFO,
  ALL_PATTERNS,
  type UserPattern,
  type Message,
} from '@/data/mockData';
import { cn, formatDate, getConfidenceColor, getPatternColor } from '@/lib/utils';
import { ChevronDown, ChevronUp, Send, Sparkles } from 'lucide-react';

export default function ChatDemoPage() {
  const [selectedPattern, setSelectedPattern] = useState<UserPattern>('A');
  const [messages, setMessages] = useState<Message[]>(() => generateConversation('A'));
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  const handlePatternChange = (pattern: UserPattern) => {
    setSelectedPattern(pattern);
    setMessages(generateConversation(pattern));
    setExpandedMessage(null);
  };

  const patternData = generatePatternData(selectedPattern);
  const patternInfo = PATTERN_INFO[selectedPattern];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">对话演示</h1>
        <p className="mt-2 text-muted-foreground">
          体验不同用户模式的真实对话场景和置信度评分
        </p>
      </div>

      {/* Pattern Selector */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>选择用户模式</CardTitle>
          <CardDescription>切换不同的用户行为模式查看对话差异</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {ALL_PATTERNS.map((pattern) => {
              const info = PATTERN_INFO[pattern];
              const isSelected = pattern === selectedPattern;
              const colorMap: Record<string, string> = {
                blue: 'border-blue-500 bg-blue-50',
                green: 'border-green-500 bg-green-50',
                orange: 'border-orange-500 bg-orange-50',
                purple: 'border-purple-500 bg-purple-50',
                red: 'border-red-500 bg-red-50',
                gray: 'border-gray-500 bg-gray-50',
              };

              return (
                <button
                  key={pattern}
                  onClick={() => handlePatternChange(pattern)}
                  className={cn(
                    'rounded-lg border-2 p-4 text-left transition-all',
                    isSelected
                      ? `${colorMap[info.color]} shadow-lg scale-105`
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">模式 {pattern}</span>
                    {isSelected && (
                      <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    )}
                  </div>
                  <div className="mt-2 text-sm font-medium">{info.name}</div>
                </button>
              );
            })}
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
                  <CardTitle>对话记录</CardTitle>
                  <CardDescription>
                    {patternInfo.name} - {patternInfo.description}
                  </CardDescription>
                </div>
                <Badge className={cn(
                  'text-white',
                  `bg-${patternInfo.color}-600`
                )}>
                  模式 {selectedPattern}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
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
                        'max-w-[80%] rounded-lg p-4',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>

                      <div className="mt-2 text-xs opacity-70">
                        {formatDate(message.timestamp)}
                      </div>

                      {/* Confidence Score for AI messages */}
                      {message.role === 'assistant' && message.confidence && (
                        <div className="mt-3 rounded-md bg-background/50 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium">置信度评分</span>
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
              </div>

              {/* Mock Input */}
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="输入消息... (演示模式，不可输入)"
                  disabled
                  className="flex-1 rounded-md border bg-muted px-4 py-2 text-sm opacity-50"
                />
                <Button disabled>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pattern Info Sidebar */}
        <div className="space-y-6">
          {/* Pattern Details */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>模式特征</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">当前模式</div>
                <div className="mt-1 text-2xl font-bold">
                  模式 {selectedPattern}: {patternInfo.name}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">置信度</div>
                <div className="mt-1 text-xl font-bold text-primary">
                  {Math.round(patternData.confidence * 100)}%
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">主要特征</div>
                <ul className="space-y-2">
                  {patternInfo.characteristics.map((char, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">•</span>
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
              <CardTitle>分类评分</CardTitle>
              <CardDescription>各模式匹配度</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(patternData.scores).map(([pattern, score]) => (
                <div key={pattern}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">模式 {pattern}</span>
                    <span className="text-sm font-mono">{score.toFixed(1)}/10</span>
                  </div>
                  <Progress
                    value={(score / 10) * 100}
                    className="h-2"
                    indicatorClassName={cn(
                      pattern === selectedPattern && 'bg-primary',
                      pattern !== selectedPattern && 'bg-muted-foreground/30'
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Reasoning */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>分析推理</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {patternData.reasoning}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
