import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import Button from '@/components/ui/Button';
import { generateConfidenceScore, type ConfidenceScore } from '@/data/mockData';
import { cn, getConfidenceColor } from '@/lib/utils';
import { Activity, RefreshCw, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ConfidenceDemoPage() {
  const { t } = useTranslation();
  const [confidence, setConfidence] = useState<ConfidenceScore>(() => generateConfidenceScore(0.87));

  const regenerate = (baseScore?: number) => {
    setConfidence(generateConfidenceScore(baseScore));
  };

  const factorData = Object.entries(confidence.factors).map(([key, value]) => ({
    name: t(`confidence.factors.${key}`),
    value: value * 100,
    color: value >= 0.8 ? '#10b981' : value >= 0.6 ? '#f59e0b' : '#ef4444'
  }));

  const presets = [
    { label: t('confidence.presets.high'), score: 0.92, level: 'high' },
    { label: t('confidence.presets.moderate'), score: 0.75, level: 'moderate' },
    { label: t('confidence.presets.low'), score: 0.58, level: 'low' },
    { label: t('confidence.presets.critical'), score: 0.35, level: 'critical' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('confidence.title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('confidence.description')}
        </p>
      </div>

      {/* Preset Buttons */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>{t('confidence.presetsTitle')}</CardTitle>
          <CardDescription>{t('confidence.presetsDescription')}</CardDescription>
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
              {t('confidence.randomGenerate')}
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
                    {t('confidence.overallConfidence')}
                  </CardTitle>
                  <CardDescription>{t('confidence.overallDescription')}</CardDescription>
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
              <CardTitle>{t('confidence.factorBreakdown')}</CardTitle>
              <CardDescription>{t('confidence.factorDescription')}</CardDescription>
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
              <CardTitle>{t('confidence.detailedFactors')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(confidence.factors).map(([key, value]) => {
                const info = {
                  modelConfidence: {
                    name: t('confidence.factors.modelConfidence'),
                    desc: t('confidence.factorDesc.modelConfidence'),
                    weight: '20%'
                  },
                  crossValidation: {
                    name: t('confidence.factors.crossValidation'),
                    desc: t('confidence.factorDesc.crossValidation'),
                    weight: '30%'
                  },
                  factualConsistency: {
                    name: t('confidence.factors.factualConsistency'),
                    desc: t('confidence.factorDesc.factualConsistency'),
                    weight: '20%'
                  },
                  domainCoverage: {
                    name: t('confidence.factors.domainCoverage'),
                    desc: t('confidence.factorDesc.domainCoverage'),
                    weight: '10%'
                  },
                  responseCoherence: {
                    name: t('confidence.factors.responseCoherence'),
                    desc: t('confidence.factorDesc.responseCoherence'),
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
                        {t('confidence.weight')}: {info.weight}
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
              <CardTitle>{t('confidence.levelGuide')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-3 w-3 rounded-full bg-green-600" />
                  <span className="font-semibold text-green-900">HIGH (≥85%)</span>
                </div>
                <p className="text-sm text-green-800">
                  {t('confidence.levels.highDesc')}
                </p>
              </div>

              <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-3 w-3 rounded-full bg-yellow-600" />
                  <span className="font-semibold text-yellow-900">MODERATE (70-85%)</span>
                </div>
                <p className="text-sm text-yellow-800">
                  {t('confidence.levels.moderateDesc')}
                </p>
              </div>

              <div className="rounded-lg bg-orange-50 border border-orange-200 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-3 w-3 rounded-full bg-orange-600" />
                  <span className="font-semibold text-orange-900">LOW (50-70%)</span>
                </div>
                <p className="text-sm text-orange-800">
                  {t('confidence.levels.lowDesc')}
                </p>
              </div>

              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-3 w-3 rounded-full bg-red-600" />
                  <span className="font-semibold text-red-900">CRITICAL (&lt;50%)</span>
                </div>
                <p className="text-sm text-red-800">
                  {t('confidence.levels.criticalDesc')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Calculation Method */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>{t('confidence.calculationMethod')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>{t('confidence.calculationFormula')}</p>
                <div className="rounded bg-muted p-3 font-mono text-xs">
                  score = <br />
                  &nbsp;&nbsp;modelConf × 0.2 +<br />
                  &nbsp;&nbsp;crossVal × 0.3 +<br />
                  &nbsp;&nbsp;factual × 0.2 +<br />
                  &nbsp;&nbsp;domain × 0.1 +<br />
                  &nbsp;&nbsp;coherence × 0.2
                </div>
                <p className="text-muted-foreground">
                  {t('confidence.weightAdjustable')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>{t('confidence.systemStats')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('confidence.avgConfidence')}</span>
                <span className="font-bold">78.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('confidence.highConfidenceRate')}</span>
                <span className="font-bold">62.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('confidence.sampleCount')}</span>
                <span className="font-bold">3,428</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
