import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import { PATTERN_INFO, ALL_PATTERNS, generatePatternData, type UserPattern } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Users, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function PatternDemoPage() {
  const [selectedPattern, setSelectedPattern] = useState<UserPattern>('A');
  const patternData = generatePatternData(selectedPattern);
  const patternInfo = PATTERN_INFO[selectedPattern];

  const riskLevels: Record<UserPattern, { level: string; color: string; icon: any }> = {
    A: { level: '低风险', color: 'text-green-600', icon: CheckCircle2 },
    B: { level: '低风险', color: 'text-green-600', icon: CheckCircle2 },
    C: { level: '高风险', color: 'text-red-600', icon: AlertTriangle },
    D: { level: '中等风险', color: 'text-yellow-600', icon: TrendingUp },
    E: { level: '极高风险', color: 'text-red-600', icon: AlertTriangle },
    F: { level: '中等风险', color: 'text-yellow-600', icon: TrendingUp },
  };

  const risk = riskLevels[selectedPattern];
  const RiskIcon = risk.icon;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">模式识别</h1>
        <p className="mt-2 text-muted-foreground">
          深入了解6种用户行为模式及其特征分析
        </p>
      </div>

      {/* Pattern Overview Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ALL_PATTERNS.map((pattern) => {
          const info = PATTERN_INFO[pattern];
          const isSelected = pattern === selectedPattern;
          const colorClasses: Record<string, string> = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            orange: 'from-orange-500 to-orange-600',
            purple: 'from-purple-500 to-purple-600',
            red: 'from-red-500 to-red-600',
            gray: 'from-gray-500 to-gray-600',
          };

          return (
            <button
              key={pattern}
              onClick={() => setSelectedPattern(pattern)}
              className={cn(
                'group relative overflow-hidden rounded-xl p-6 text-left transition-all',
                isSelected
                  ? 'scale-105 shadow-2xl ring-2 ring-primary'
                  : 'shadow-md hover:scale-102 hover:shadow-lg'
              )}
            >
              <div className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-90',
                colorClasses[info.color]
              )} />

              <div className="relative z-10 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                    <span className="text-2xl font-bold">{ pattern}</span>
                  </div>
                  {isSelected && (
                    <Users className="h-6 w-6 animate-pulse" />
                  )}
                </div>

                <h3 className="mt-4 text-xl font-bold">{info.name}</h3>
                <p className="mt-2 text-sm text-white/90">{info.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {info.characteristics.slice(0, 2).map((char, idx) => (
                    <Badge key={idx} className="bg-white/20 text-white border-white/30 text-xs">
                      {char}
                    </Badge>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Analysis */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Pattern Details */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                模式 {selectedPattern}: {patternInfo.name}
              </CardTitle>
              <CardDescription>{patternInfo.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Risk Level */}
              <div className="flex items-center justify-between rounded-lg border-2 p-4">
                <div className="flex items-center gap-3">
                  <RiskIcon className={cn('h-8 w-8', risk.color)} />
                  <div>
                    <div className="text-sm text-muted-foreground">风险等级</div>
                    <div className={cn('text-xl font-bold', risk.color)}>{risk.level}</div>
                  </div>
                </div>
                <Badge variant={
                  risk.level === '低风险' ? 'success' :
                  risk.level === '中等风险' ? 'warning' : 'destructive'
                }>
                  {risk.level}
                </Badge>
              </div>

              {/* Characteristics */}
              <div>
                <h4 className="mb-3 font-semibold">行为特征</h4>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {patternInfo.characteristics.map((char, idx) => (
                    <li key={idx} className="flex items-start gap-2 rounded-lg bg-muted p-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{char}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Classification Scores */}
              <div>
                <h4 className="mb-3 font-semibold">分类评分明细</h4>
                <div className="space-y-3">
                  {Object.entries(patternData.scores)
                    .sort(([, a], [, b]) => b - a)
                    .map(([pattern, score]) => {
                      const info = PATTERN_INFO[pattern as UserPattern];
                      return (
                        <div key={pattern} className="rounded-lg border p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">模式 {pattern}</span>
                              <span className="text-sm text-muted-foreground">{info.name}</span>
                            </div>
                            <span className="text-sm font-mono font-bold">
                              {score.toFixed(1)}/10
                            </span>
                          </div>
                          <Progress
                            value={(score / 10) * 100}
                            className="h-2.5"
                            indicatorClassName={cn(
                              pattern === selectedPattern ? 'bg-primary' : 'bg-muted-foreground/40'
                            )}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Reasoning */}
              <div className="rounded-lg bg-blue-50 p-4 border-l-4 border-blue-600">
                <h4 className="mb-2 font-semibold text-blue-900">分析推理</h4>
                <p className="text-sm leading-relaxed text-blue-800">
                  {patternData.reasoning}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Confidence */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>分类置信度</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">
                  {Math.round(patternData.confidence * 100)}%
                </div>
                <Progress value={patternData.confidence * 100} className="mt-4 h-3" />
                <p className="mt-3 text-sm text-muted-foreground">
                  基于多维行为特征分析
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>干预建议</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedPattern === 'A' && (
                  <>
                    <p className="text-sm">✅ 保持当前学习方式</p>
                    <p className="text-sm">✅ 可以承担更复杂任务</p>
                    <p className="text-sm">✅ 适合作为其他用户的榜样</p>
                  </>
                )}
                {selectedPattern === 'B' && (
                  <>
                    <p className="text-sm">✅ 鼓励继续保持平衡</p>
                    <p className="text-sm">📊 监控学习进度</p>
                    <p className="text-sm">💡 提供进阶挑战</p>
                  </>
                )}
                {selectedPattern === 'C' && (
                  <>
                    <p className="text-sm text-orange-600">⚠️ 需要减少AI依赖</p>
                    <p className="text-sm text-orange-600">⚠️ 增加独立验证</p>
                    <p className="text-sm text-orange-600">⚠️ 建立自主思考习惯</p>
                  </>
                )}
                {selectedPattern === 'D' && (
                  <>
                    <p className="text-sm">💡 引导系统化思考</p>
                    <p className="text-sm">📋 提供任务分解指导</p>
                    <p className="text-sm">🔍 强化验证环节</p>
                  </>
                )}
                {selectedPattern === 'E' && (
                  <>
                    <p className="text-sm text-red-600">🚨 需要紧急干预</p>
                    <p className="text-sm text-red-600">🚨 分步引导学习</p>
                    <p className="text-sm text-red-600">🚨 建立基础能力</p>
                  </>
                )}
                {selectedPattern === 'F' && (
                  <>
                    <p className="text-sm">💬 鼓励AI协作</p>
                    <p className="text-sm">📈 展示协作价值</p>
                    <p className="text-sm">⚖️ 平衡独立与协作</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>模式统计</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">识别准确率</span>
                <span className="font-bold">87.5%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">平均置信度</span>
                <span className="font-bold">82.3%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">分析样本数</span>
                <span className="font-bold">1,247</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
