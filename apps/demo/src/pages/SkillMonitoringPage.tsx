import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Progress from '@/components/ui/Progress';
import { generateSkillMetrics, generateIndependenceTimeline, ALL_PATTERNS, PATTERN_INFO, type UserPattern } from '@/data/mockData';
import { cn, getTrendIcon, getTrendColor } from '@/lib/utils';
import { Target, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function SkillMonitoringPage() {
  const { t } = useTranslation();
  const [selectedPattern, setSelectedPattern] = useState<UserPattern>('A');
  const skills = generateSkillMetrics(selectedPattern);
  const timeline = generateIndependenceTimeline(selectedPattern);

  const chartData = timeline.slice(-14).map(log => ({
    date: format(log.timestamp, 'MM/dd'),
    independence: (log.ratio * 100).toFixed(1),
  }));

  const currentRatio = timeline[timeline.length - 1].ratio;
  const previousRatio = timeline[timeline.length - 8].ratio;
  const trend = currentRatio > previousRatio ? 'improving' : currentRatio < previousRatio ? 'declining' : 'stable';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('skills.title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('skills.description')}</p>
      </div>

      {/* Pattern Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {ALL_PATTERNS.map(pattern => (
          <button
            key={pattern}
            onClick={() => setSelectedPattern(pattern)}
            className={cn(
              'flex-shrink-0 rounded-lg border-2 px-4 py-2 transition-all',
              selectedPattern === pattern
                ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                : 'border-gray-200 bg-white hover:border-primary/50'
            )}
          >
            <span className="font-bold">{t('skills.pattern')} {pattern}</span>
            <span className="ml-2 text-sm opacity-80">{PATTERN_INFO[pattern].name}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Independence Trend */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {t('skills.independenceTrend')}
              </CardTitle>
              <CardDescription>{t('skills.independenceDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Line
                    type="monotone"
                    dataKey="independence"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Skill Breakdown */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>{t('skills.skillBreakdown')}</CardTitle>
              <CardDescription>{t('skills.skillBreakdownDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skills.map(s => ({ name: s.skill, level: s.level * 100 }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value: number) => `${value.toFixed(0)}%`} />
                  <Bar dataKey="level" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Skill Details */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>{t('skills.skillDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map(skill => {
                const TrendIcon = skill.trend === 'improving' ? TrendingUp :
                                 skill.trend === 'declining' ? TrendingDown : Minus;

                return (
                  <div key={skill.skill} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{skill.skill}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={
                            skill.trend === 'improving' ? 'success' :
                            skill.trend === 'declining' ? 'destructive' : 'secondary'
                          } className="text-xs">
                            <TrendIcon className="mr-1 h-3 w-3" />
                            {skill.trend === 'improving' ? t('skills.improving') :
                             skill.trend === 'declining' ? t('skills.declining') : t('skills.stable')}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{Math.round(skill.level * 100)}%</div>
                        <div className="text-xs text-muted-foreground">
                          {t('skills.average')}: {Math.round(skill.historicalAvg * 100)}%
                        </div>
                      </div>
                    </div>
                    <Progress
                      value={skill.level * 100}
                      className="h-2.5"
                      indicatorClassName={cn(
                        skill.level >= 0.7 && 'bg-green-600',
                        skill.level >= 0.5 && skill.level < 0.7 && 'bg-yellow-600',
                        skill.level < 0.5 && 'bg-red-600'
                      )}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Status */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>{t('skills.currentStatus')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-primary mb-2">
                  {Math.round(currentRatio * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">{t('skills.independenceRatio')}</div>
                <div className={cn('mt-2 flex items-center justify-center gap-1 text-sm font-medium', getTrendColor(trend))}>
                  {getTrendIcon(trend)}
                  <span>{trend === 'improving' ? t('skills.upTrend') : trend === 'declining' ? t('skills.downTrend') : t('skills.stableTrend')}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">7 {t('skills.daysAgo')}</span>
                  <span className="font-bold">{Math.round(previousRatio * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('skills.change')}</span>
                  <span className={cn('font-bold', getTrendColor(trend))}>
                    {((currentRatio - previousRatio) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>{t('skills.alertSystem')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {skills.some(s => s.trend === 'declining' && s.level < 0.5) && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-red-900">{t('skills.skillDegradation')}</div>
                      <p className="text-sm text-red-800 mt-1">
                        {t('skills.skillDegradationDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {currentRatio < 0.4 && (
                <div className="rounded-lg bg-orange-50 border border-orange-200 p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-orange-900">{t('skills.overDependence')}</div>
                      <p className="text-sm text-orange-800 mt-1">
                        {t('skills.overDependenceDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {skills.every(s => s.trend !== 'declining') && currentRatio >= 0.6 && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-green-900">{t('skills.goodStatus')}</div>
                      <p className="text-sm text-green-800 mt-1">
                        {t('skills.goodStatusDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>{t('skills.improvements')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {currentRatio >= 0.7 && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>{t('skills.improve1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>{t('skills.improve2')}</span>
                    </li>
                  </>
                )}
                {currentRatio >= 0.4 && currentRatio < 0.7 && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600">!</span>
                      <span>{t('skills.improve3')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600">!</span>
                      <span>{t('skills.improve4')}</span>
                    </li>
                  </>
                )}
                {currentRatio < 0.4 && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">⚠</span>
                      <span>{t('skills.improve5')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">⚠</span>
                      <span>{t('skills.improve6')}</span>
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
