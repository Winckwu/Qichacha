import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

type PrivacyTier = 1 | 2 | 3;

export default function PrivacyDemoPage() {
  const { t } = useTranslation();
  const [selectedTier, setSelectedTier] = useState<PrivacyTier>(2);

  const tiers = [
    {
      tier: 1 as PrivacyTier,
      name: t('privacy.tierNames.tier1'),
      icon: Lock,
      color: 'red',
      description: t('privacy.tierDescriptions.tier1'),
      features: [
        { label: t('privacy.featureLabels.messageContent'), status: 'hidden', detail: t('privacy.featureDetails.tier1.messageContent') },
        { label: t('privacy.featureLabels.taskType'), status: 'tracked', detail: t('privacy.featureDetails.tier1.taskType') },
        { label: t('privacy.featureLabels.interactionTime'), status: 'tracked', detail: t('privacy.featureDetails.tier1.interactionTime') },
        { label: t('privacy.featureLabels.complexityScore'), status: 'tracked', detail: t('privacy.featureDetails.tier1.complexityScore') },
        { label: t('privacy.featureLabels.aiResponse'), status: 'hidden', detail: t('privacy.featureDetails.tier1.aiResponse') },
        { label: t('privacy.featureLabels.patternAnalysis'), status: 'limited', detail: t('privacy.featureDetails.tier1.patternAnalysis') }
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
      name: t('privacy.tierNames.tier2'),
      icon: Shield,
      color: 'yellow',
      description: t('privacy.tierDescriptions.tier2'),
      features: [
        { label: t('privacy.featureLabels.messageContent'), status: 'partial', detail: t('privacy.featureDetails.tier2.messageContent') },
        { label: t('privacy.featureLabels.taskType'), status: 'tracked', detail: t('privacy.featureDetails.tier2.taskType') },
        { label: t('privacy.featureLabels.interactionTime'), status: 'tracked', detail: t('privacy.featureDetails.tier2.interactionTime') },
        { label: t('privacy.featureLabels.complexityScore'), status: 'tracked', detail: t('privacy.featureDetails.tier2.complexityScore') },
        { label: t('privacy.featureLabels.aiResponse'), status: 'partial', detail: t('privacy.featureDetails.tier2.aiResponse') },
        { label: t('privacy.featureLabels.patternAnalysis'), status: 'tracked', detail: t('privacy.featureDetails.tier2.patternAnalysis') }
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
      name: t('privacy.tierNames.tier3'),
      icon: Eye,
      color: 'green',
      description: t('privacy.tierDescriptions.tier3'),
      features: [
        { label: t('privacy.featureLabels.messageContent'), status: 'tracked', detail: t('privacy.featureDetails.tier3.messageContent') },
        { label: t('privacy.featureLabels.taskType'), status: 'tracked', detail: t('privacy.featureDetails.tier3.taskType') },
        { label: t('privacy.featureLabels.interactionTime'), status: 'tracked', detail: t('privacy.featureDetails.tier3.interactionTime') },
        { label: t('privacy.featureLabels.complexityScore'), status: 'tracked', detail: t('privacy.featureDetails.tier3.complexityScore') },
        { label: t('privacy.featureLabels.aiResponse'), status: 'tracked', detail: t('privacy.featureDetails.tier3.aiResponse') },
        { label: t('privacy.featureLabels.patternAnalysis'), status: 'tracked', detail: t('privacy.featureDetails.tier3.patternAnalysis') }
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
        <h1 className="text-3xl font-bold">{t('privacy.title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('privacy.description')}
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
                    {t('privacy.tier')} {tier.tier}
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
                  <CardTitle>{t('privacy.tier')} {selectedTier}: {selectedTierData.name}</CardTitle>
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
                        {feature.status === 'tracked' ? t('privacy.statusLabels.complete') :
                         feature.status === 'partial' ? t('privacy.statusLabels.partial') :
                         feature.status === 'hidden' ? t('privacy.statusLabels.hidden') : t('privacy.statusLabels.limited')}
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
              <CardTitle>{t('privacy.dataExample')}</CardTitle>
              <CardDescription>{t('privacy.dataExampleDesc')}</CardDescription>
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
              <CardTitle>{t('privacy.privacyVsFunction')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{t('privacy.privacyProtection')}</span>
                  <span className="text-sm font-bold">
                    {selectedTier === 1 ? t('privacy.highest') : selectedTier === 2 ? t('privacy.medium') : t('privacy.standard')}
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
                  <span className="text-sm font-medium">{t('privacy.analysisCapability')}</span>
                  <span className="text-sm font-bold">
                    {selectedTier === 1 ? t('privacy.basic') : selectedTier === 2 ? t('privacy.moderate') : t('privacy.complete')}
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
                  <span className="text-sm font-medium">{t('privacy.personalizationLevel')}</span>
                  <span className="text-sm font-bold">
                    {selectedTier === 1 ? t('privacy.limited') : selectedTier === 2 ? t('privacy.good') : t('privacy.optimal')}
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
              <CardTitle>{t('privacy.useCases')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {selectedTier === 1 && (
                  <>
                    <p>{t('privacy.useCases.tier1.item1')}</p>
                    <p>{t('privacy.useCases.tier1.item2')}</p>
                    <p>{t('privacy.useCases.tier1.item3')}</p>
                    <p className="text-yellow-600">{t('privacy.useCases.tier1.item4')}</p>
                  </>
                )}
                {selectedTier === 2 && (
                  <>
                    <p>{t('privacy.useCases.tier2.item1')}</p>
                    <p>{t('privacy.useCases.tier2.item2')}</p>
                    <p>{t('privacy.useCases.tier2.item3')}</p>
                    <p className="text-green-600">{t('privacy.useCases.tier2.item4')}</p>
                  </>
                )}
                {selectedTier === 3 && (
                  <>
                    <p>{t('privacy.useCases.tier3.item1')}</p>
                    <p>{t('privacy.useCases.tier3.item2')}</p>
                    <p>{t('privacy.useCases.tier3.item3')}</p>
                    <p className="text-blue-600">{t('privacy.useCases.tier3.item4')}</p>
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
                {t('privacy.security')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-blue-800">
              <p>{t('privacy.securityItem1')}</p>
              <p>{t('privacy.securityItem2')}</p>
              <p>{t('privacy.securityItem3')}</p>
              <p>{t('privacy.securityItem4')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
