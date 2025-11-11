import { TrendingDown, TrendingUp, Minus, AlertCircle, Target, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useIndependenceMetrics } from '@/hooks/useIndependenceMetrics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function SkillMonitoringDashboard() {
  const { t } = useTranslation();
  const { data: metrics, isLoading } = useIndependenceMetrics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-muted-foreground">{t('dashboard.loading')}</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center text-muted-foreground">{t('dashboard.noData')}</div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getAlertVariant = (level: string) => {
    switch (level) {
      case 'critical':
        return 'destructive';
      case 'strong':
      case 'gentle':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Mock data for charts
  const skillBreakdownData = [
    { skill: t('dashboard.skillBreakdown.skills.writing'), value: metrics.skillBreakdown.writing * 100 },
    { skill: t('dashboard.skillBreakdown.skills.coding'), value: metrics.skillBreakdown.coding * 100 },
    { skill: t('dashboard.skillBreakdown.skills.analysis'), value: metrics.skillBreakdown.analysis * 100 },
  ];

  const trendData = [
    { date: t('dashboard.trendChart.week', { number: 1 }), value: 35 },
    { date: t('dashboard.trendChart.week', { number: 2 }), value: 38 },
    { date: t('dashboard.trendChart.week', { number: 3 }), value: 42 },
    { date: t('dashboard.trendChart.week', { number: 4 }), value: metrics.currentRatio * 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('dashboard.description')}
        </p>
      </div>

      {/* Alert Card */}
      {metrics.alertLevel !== 'none' && (
        <Alert variant={getAlertVariant(metrics.alertLevel)}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {metrics.alertLevel === 'critical' && t('dashboard.alerts.critical.title')}
            {metrics.alertLevel === 'strong' && t('dashboard.alerts.strong.title')}
            {metrics.alertLevel === 'gentle' && t('dashboard.alerts.gentle.title')}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {metrics.alertLevel === 'critical' && t('dashboard.alerts.critical.description')}
            {metrics.alertLevel === 'strong' && t('dashboard.alerts.strong.description', { ratio: Math.round(metrics.currentRatio * 100) })}
            {metrics.alertLevel === 'gentle' && t('dashboard.alerts.gentle.description')}
          </AlertDescription>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline">
              {t('dashboard.alerts.actions.schedulePractice')}
            </Button>
            <Button size="sm" variant="outline">
              {t('dashboard.alerts.actions.viewTips')}
            </Button>
          </div>
        </Alert>
      )}

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Independence Tracker Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t('dashboard.independence.title')}</span>
              {getTrendIcon(metrics.trend)}
            </CardTitle>
            <CardDescription>{t('dashboard.independence.period')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-4xl font-bold">{Math.round(metrics.currentRatio * 100)}%</span>
                <span className="text-sm text-muted-foreground">
                  {metrics.trendChange > 0 ? '+' : ''}{Math.round(metrics.trendChange * 100)}%
                </span>
              </div>
              <Progress
                value={metrics.currentRatio * 100}
                className="h-3"
              />
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('dashboard.independence.target')}</span>
                <span className="font-medium">40%+</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">{t('dashboard.independence.trend')}</span>
                <span className={`font-medium ${
                  metrics.trend === 'improving' ? 'text-green-600' :
                  metrics.trend === 'declining' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {t(`dashboard.independence.trends.${metrics.trend}`)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Breakdown Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboard.skillBreakdown.title')}</CardTitle>
            <CardDescription>{t('dashboard.skillBreakdown.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={skillBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 flex items-center justify-center">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded" />
                  <span>{t('dashboard.skillBreakdown.independencePercent')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-px bg-red-500" />
                  <span>{t('dashboard.skillBreakdown.targetLabel')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.trendChart.title')}</CardTitle>
          <CardDescription>{t('dashboard.trendChart.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI-Free Time Scheduler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('dashboard.scheduler.title')}
          </CardTitle>
          <CardDescription>
            {t('dashboard.scheduler.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {t('dashboard.scheduler.intro')}
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Target className="h-4 w-4 mr-2" />
              {t('dashboard.scheduler.daily')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Target className="h-4 w-4 mr-2" />
              {t('dashboard.scheduler.weekly')}
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Target className="h-4 w-4 mr-2" />
              {t('dashboard.scheduler.custom')}
            </Button>
          </div>
          <div className="pt-3 border-t text-xs text-muted-foreground">
            <p><strong>{t('dashboard.scheduler.emergencyOverride')}</strong> {t('dashboard.scheduler.emergencyDescription')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
