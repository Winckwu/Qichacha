import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import Button from '@/components/ui/Button';
import { generateConfidenceScore, type ConfidenceScore } from '@/data/mockData';
import { cn, getConfidenceColor } from '@/lib/utils';
import { Activity, RefreshCw, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ConfidenceDemoPage() {
  const [confidence, setConfidence] = useState<ConfidenceScore>(() => generateConfidenceScore(0.87));

  const regenerate = (baseScore?: number) => {
    setConfidence(generateConfidenceScore(baseScore));
  };

  const factorData = Object.entries(confidence.factors).map(([key, value]) => ({
    name: {
      modelConfidence: '模型置信度',
      crossValidation: '交叉验证',
      factualConsistency: '事实一致性',
      domainCoverage: '领域覆盖度',
      responseCoherence: '响应连贯性',
    }[key],
    value: value * 100,
    color: value >= 0.8 ? '#10b981' : value >= 0.6 ? '#f59e0b' : '#ef4444'
  }));

  const presets = [
    { label: '高置信度', score: 0.92, level: 'high' },
    { label: '中等置信度', score: 0.75, level: 'moderate' },
    { label: '低置信度', score: 0.58, level: 'low' },
    { label: '严重不足', score: 0.35, level: 'critical' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">置信度评分</h1>
        <p className="mt-2 text-muted-foreground">
          多因素置信度计算和可视化展示
        </p>
      </div>

      {/* Preset Buttons */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>快速预设</CardTitle>
          <CardDescription>选择预设场景查看不同置信度级别</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                onClick={() => regenerate(preset.score)}
                className={cn(
                  confidence.level === preset.level && 'ring-2 ring-primary'
                )}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {preset.label}
              </Button>
            ))}
            <Button onClick={() => regenerate()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              随机生成
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Confidence Display */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-6 w-6" />
                    总体置信度
                  </CardTitle>
                  <CardDescription>综合多个因素的加权评分</CardDescription>
                </div>
                <Badge className={getConfidenceColor(confidence.level)}>
                  {confidence.level.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-6xl font-bold text-primary mb-4">
                  {Math.round(confidence.score * 100)}%
                </div>
                <Progress
                  value={confidence.score * 100}
                  className="h-4 max-w-md mx-auto"
                  indicatorClassName={cn(
                    confidence.level === 'high' && 'bg-green-600',
                    confidence.level === 'moderate' && 'bg-yellow-600',
                    confidence.level === 'low' && 'bg-orange-600',
                    confidence.level === 'critical' && 'bg-red-600'
                  )}
                />
                <p className="mt-4 text-muted-foreground max-w-md mx-auto">
                  {confidence.explanation}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Factor Breakdown */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>因素分解</CardTitle>
              <CardDescription>各项评估因素的详细得分</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={factorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} fontSize={12} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {factorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detailed Factors */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>详细因素说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(confidence.factors).map(([key, value]) => {
                const info = {
                  modelConfidence: {
                    name: '模型置信度',
                    desc: '基于语言模型的内部概率评估',
                    weight: '20%'
                  },
                  crossValidation: {
                    name: '交叉验证',
                    desc: '多模型响应的一致性评估',
                    weight: '30%'
                  },
                  factualConsistency: {
                    name: '事实一致性',
                    desc: '与已知事实库的匹配程度',
                    weight: '20%'
                  },
                  domainCoverage: {
                    name: '领域覆盖度',
                    desc: '响应涵盖的知识领域广度',
                    weight: '10%'
                  },
                  responseCoherence: {
                    name: '响应连贯性',
                    desc: '逻辑连贯性和语义流畅度',
                    weight: '20%'
                  }
                }[key]!;

                return (
                  <div key={key} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{info.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{info.desc}</p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        权重: {info.weight}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <Progress
                        value={value * 100}
                        className="h-2.5 flex-1"
                        indicatorClassName={cn(
                          value >= 0.8 && 'bg-green-600',
                          value >= 0.6 && value < 0.8 && 'bg-yellow-600',
                          value < 0.6 && 'bg-orange-600'
                        )}
                      />
                      <span className="text-sm font-mono font-bold w-12 text-right">
                        {(value * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Level Guide */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>置信度级别</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-3 w-3 rounded-full bg-green-600" />
                  <span className="font-semibold text-green-900">HIGH (≥85%)</span>
                </div>
                <p className="text-sm text-green-800">
                  响应高度可信，可以直接使用
                </p>
              </div>

              <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-3 w-3 rounded-full bg-yellow-600" />
                  <span className="font-semibold text-yellow-900">MODERATE (70-85%)</span>
                </div>
                <p className="text-sm text-yellow-800">
                  建议进行验证确认
                </p>
              </div>

              <div className="rounded-lg bg-orange-50 border border-orange-200 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-3 w-3 rounded-full bg-orange-600" />
                  <span className="font-semibold text-orange-900">LOW (50-70%)</span>
                </div>
                <p className="text-sm text-orange-800">
                  需要谨慎对待并验证
                </p>
              </div>

              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-3 w-3 rounded-full bg-red-600" />
                  <span className="font-semibold text-red-900">CRITICAL (&lt;50%)</span>
                </div>
                <p className="text-sm text-red-800">
                  强烈建议人工验证
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Calculation Method */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>计算方法</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>总分 = Σ (因素得分 × 权重)</p>
                <div className="rounded bg-muted p-3 font-mono text-xs">
                  score = <br />
                  &nbsp;&nbsp;modelConf × 0.2 +<br />
                  &nbsp;&nbsp;crossVal × 0.3 +<br />
                  &nbsp;&nbsp;factual × 0.2 +<br />
                  &nbsp;&nbsp;domain × 0.1 +<br />
                  &nbsp;&nbsp;coherence × 0.2
                </div>
                <p className="text-muted-foreground">
                  各因素权重可根据应用场景调整
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>系统统计</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">平均置信度</span>
                <span className="font-bold">78.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">高置信响应</span>
                <span className="font-bold">62.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">评估样本数</span>
                <span className="font-bold">3,428</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
