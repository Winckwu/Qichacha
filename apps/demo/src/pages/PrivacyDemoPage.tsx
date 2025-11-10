import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

type PrivacyTier = 1 | 2 | 3;

export default function PrivacyDemoPage() {
  const [selectedTier, setSelectedTier] = useState<PrivacyTier>(2);

  const tiers = [
    {
      tier: 1 as PrivacyTier,
      name: '最大隐私',
      icon: Lock,
      color: 'red',
      description: '内容盲追踪 - 不存储任何内容',
      features: [
        { label: '消息内容', status: 'hidden', detail: '仅存储内容哈希' },
        { label: '任务类型', status: 'tracked', detail: '记录任务类别' },
        { label: '交互时间', status: 'tracked', detail: '记录时间戳' },
        { label: '复杂度评分', status: 'tracked', detail: '自动计算' },
        { label: 'AI响应', status: 'hidden', detail: '不存储响应内容' },
        { label: '模式分析', status: 'limited', detail: '基于元数据' }
      ],
      dataExample: {
        timestamp: '2024-01-15 10:30:00',
        taskType: 'problem_solving',
        complexity: 7,
        duration: 180,
        contentHash: 'sha256:a3f2e8...',
        aiResponseHash: 'sha256:b7d9c1...',
        patternFeatures: { independence: 0.75, verification: true }
      }
    },
    {
      tier: 2 as PrivacyTier,
      name: '平衡模式',
      icon: Shield,
      color: 'yellow',
      description: '有限内容存储 - 关键词和摘要',
      features: [
        { label: '消息内容', status: 'partial', detail: '存储关键词和主题' },
        { label: '任务类型', status: 'tracked', detail: '详细分类' },
        { label: '交互时间', status: 'tracked', detail: '完整时间序列' },
        { label: '复杂度评分', status: 'tracked', detail: '多维度评估' },
        { label: 'AI响应', status: 'partial', detail: '存储摘要' },
        { label: '模式分析', status: 'tracked', detail: '完整特征提取' }
      ],
      dataExample: {
        timestamp: '2024-01-15 10:30:00',
        taskType: 'problem_solving',
        keywords: ['算法', '优化', '性能'],
        summary: '用户询问算法优化方案',
        complexity: 7,
        duration: 180,
        aiSummary: '提供了三种优化方案',
        patternFeatures: {
          independence: 0.75,
          verification: true,
          taskDecomposition: true,
          goalSetting: true
        }
      }
    },
    {
      tier: 3 as PrivacyTier,
      name: '完整分析',
      icon: Eye,
      color: 'green',
      description: '全量数据 - 完整内容存储和分析',
      features: [
        { label: '消息内容', status: 'tracked', detail: '完整存储' },
        { label: '任务类型', status: 'tracked', detail: '详细分类' },
        { label: '交互时间', status: 'tracked', detail: '精确到毫秒' },
        { label: '复杂度评分', status: 'tracked', detail: '多维度详细分析' },
        { label: 'AI响应', status: 'tracked', detail: '完整存储' },
        { label: '模式分析', status: 'tracked', detail: '深度分析' }
      ],
      dataExample: {
        timestamp: '2024-01-15 10:30:00',
        userMessage: '我需要优化这个排序算法的性能...',
        taskType: 'problem_solving',
        keywords: ['算法', '优化', '性能', '排序'],
        complexity: 7,
        duration: 180,
        aiResponse: '这里有三种优化方案：1. 使用快速排序...',
        confidence: { score: 0.87, factors: { /* ... */ } },
        patternFeatures: {
          independence: 0.75,
          verification: true,
          taskDecomposition: true,
          goalSetting: true,
          detailedMetrics: { /* 18 features */ }
        }
      }
    }
  ];

  const selectedTierData = tiers.find(t => t.tier === selectedTier)!;
  const Icon = selectedTierData.icon;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">隐私保护</h1>
        <p className="mt-2 text-muted-foreground">
          三层隐私架构 - 灵活控制数据收集和使用
        </p>
      </div>

      {/* Tier Selector */}
      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map(tier => {
          const TierIcon = tier.icon;
          const isSelected = tier.tier === selectedTier;
          const colorClasses = {
            red: { bg: 'from-red-500 to-red-600', border: 'border-red-500', text: 'text-red-600' },
            yellow: { bg: 'from-yellow-500 to-yellow-600', border: 'border-yellow-500', text: 'text-yellow-600' },
            green: { bg: 'from-green-500 to-green-600', border: 'border-green-500', text: 'text-green-600' }
          }[tier.color];

          return (
            <button
              key={tier.tier}
              onClick={() => setSelectedTier(tier.tier)}
              className={cn(
                'group relative overflow-hidden rounded-xl p-6 text-left transition-all',
                isSelected
                  ? `scale-105 shadow-2xl ring-4 ${colorClasses.border}`
                  : 'shadow-md hover:scale-102 hover:shadow-lg border-2'
              )}
            >
              <div className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-90',
                isSelected ? colorClasses.bg : 'from-gray-100 to-gray-200'
              )} />

              <div className={cn('relative z-10', isSelected ? 'text-white' : 'text-gray-700')}>
                <div className="flex items-center justify-between mb-3">
                  <div className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-lg',
                    isSelected ? 'bg-white/20 backdrop-blur-sm' : 'bg-white/50'
                  )}>
                    <TierIcon className="h-6 w-6" />
                  </div>
                  <Badge className={cn(isSelected ? 'bg-white/20 text-white border-white/30' : 'bg-gray-200')}>
                    层级 {tier.tier}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold">{tier.name}</h3>
                <p className={cn('mt-2 text-sm', isSelected ? 'text-white/90' : 'text-gray-600')}>
                  {tier.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed View */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Features */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Icon className={cn('h-6 w-6', tiers.find(t => t.tier === selectedTier)!.color === 'red' ? 'text-red-600' : tiers.find(t => t.tier === selectedTier)!.color === 'yellow' ? 'text-yellow-600' : 'text-green-600')} />
                <div>
                  <CardTitle>层级 {selectedTier}: {selectedTierData.name}</CardTitle>
                  <CardDescription>{selectedTierData.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedTierData.features.map((feature, idx) => {
                  const statusConfig = {
                    tracked: { icon: '✓', color: 'text-green-600', bg: 'bg-green-50' },
                    partial: { icon: '◐', color: 'text-yellow-600', bg: 'bg-yellow-50' },
                    hidden: { icon: '✗', color: 'text-red-600', bg: 'bg-red-50' },
                    limited: { icon: '~', color: 'text-orange-600', bg: 'bg-orange-50' }
                  }[feature.status];

                  return (
                    <div key={idx} className={cn('flex items-center justify-between rounded-lg border p-4', statusConfig.bg)}>
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold text-lg', statusConfig.color)}>
                          {statusConfig.icon}
                        </div>
                        <div>
                          <div className="font-semibold">{feature.label}</div>
                          <div className="text-sm text-muted-foreground">{feature.detail}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className={statusConfig.color}>
                        {feature.status === 'tracked' ? '完整' :
                         feature.status === 'partial' ? '部分' :
                         feature.status === 'hidden' ? '隐藏' : '有限'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Data Example */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>数据示例</CardTitle>
              <CardDescription>该层级下实际存储的数据格式</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-slate-900 p-4 overflow-x-auto">
                <pre className="text-sm text-green-400 font-mono">
                  {JSON.stringify(selectedTierData.dataExample, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Comparison */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>隐私 vs 功能</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">隐私保护</span>
                  <span className="text-sm font-bold">
                    {selectedTier === 1 ? '最高' : selectedTier === 2 ? '中等' : '标准'}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      selectedTier === 1 ? 'bg-red-600 w-full' :
                      selectedTier === 2 ? 'bg-yellow-600 w-2/3' :
                      'bg-green-600 w-1/3'
                    )}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">分析能力</span>
                  <span className="text-sm font-bold">
                    {selectedTier === 1 ? '基础' : selectedTier === 2 ? '中等' : '完整'}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      selectedTier === 1 ? 'bg-blue-600 w-1/3' :
                      selectedTier === 2 ? 'bg-blue-600 w-2/3' :
                      'bg-blue-600 w-full'
                    )}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">个性化程度</span>
                  <span className="text-sm font-bold">
                    {selectedTier === 1 ? '有限' : selectedTier === 2 ? '良好' : '最优'}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      selectedTier === 1 ? 'bg-purple-600 w-1/4' :
                      selectedTier === 2 ? 'bg-purple-600 w-3/4' :
                      'bg-purple-600 w-full'
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>适用场景</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {selectedTier === 1 && (
                  <>
                    <p>✓ 高度敏感的工作环境</p>
                    <p>✓ 严格的数据合规要求</p>
                    <p>✓ 优先考虑隐私保护</p>
                    <p className="text-yellow-600">! 分析功能受限</p>
                  </>
                )}
                {selectedTier === 2 && (
                  <>
                    <p>✓ 教育学习场景</p>
                    <p>✓ 一般企业环境</p>
                    <p>✓ 平衡隐私与功能</p>
                    <p className="text-green-600">✓ 推荐设置</p>
                  </>
                )}
                {selectedTier === 3 && (
                  <>
                    <p>✓ 研究和开发</p>
                    <p>✓ 需要深度分析</p>
                    <p>✓ 最佳个性化体验</p>
                    <p className="text-blue-600">ℹ 需要明确授权</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-2 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Lock className="h-5 w-5" />
                安全保障
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-blue-800">
              <p>✓ 所有数据端到端加密</p>
              <p>✓ 用户可随时切换层级</p>
              <p>✓ 支持数据导出和删除</p>
              <p>✓ 定期安全审计</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
