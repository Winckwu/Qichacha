import { TrendingDown, TrendingUp, Minus, AlertCircle, Target, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useIndependenceMetrics } from '@/hooks/useIndependenceMetrics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function SkillMonitoringDashboard() {
  const { data: metrics, isLoading } = useIndependenceMetrics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-muted-foreground">Loading metrics...</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center text-muted-foreground">No data available</div>
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
    { skill: 'Writing', value: metrics.skillBreakdown.writing * 100 },
    { skill: 'Coding', value: metrics.skillBreakdown.coding * 100 },
    { skill: 'Analysis', value: metrics.skillBreakdown.analysis * 100 },
  ];

  const trendData = [
    { date: 'Week 1', value: 35 },
    { date: 'Week 2', value: 38 },
    { date: 'Week 3', value: 42 },
    { date: 'Week 4', value: metrics.currentRatio * 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Skill Monitoring Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track your independence and skill development
        </p>
      </div>

      {/* Alert Card */}
      {metrics.alertLevel !== 'none' && (
        <Alert variant={getAlertVariant(metrics.alertLevel)}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {metrics.alertLevel === 'critical' && 'Critical: Skill Degradation Risk'}
            {metrics.alertLevel === 'strong' && 'Warning: Declining Independence'}
            {metrics.alertLevel === 'gentle' && 'Reminder: Practice Independent Work'}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {metrics.alertLevel === 'critical' && (
              <>
                Your independence ratio has fallen below 20%. Consider taking a skill assessment
                and scheduling regular AI-free practice time.
              </>
            )}
            {metrics.alertLevel === 'strong' && (
              <>
                Your independence is declining. We recommend increasing independent work to maintain
                your skills. Current ratio: {Math.round(metrics.currentRatio * 100)}%
              </>
            )}
            {metrics.alertLevel === 'gentle' && (
              <>
                Remember to practice working independently. Aim for at least 40% independent work time.
              </>
            )}
          </AlertDescription>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline">
              Schedule Practice Time
            </Button>
            <Button size="sm" variant="outline">
              View Tips
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
              <span>Independence Tracker</span>
              {getTrendIcon(metrics.trend)}
            </CardTitle>
            <CardDescription>Last 30 days</CardDescription>
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
                <span className="text-muted-foreground">Target</span>
                <span className="font-medium">40%+</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Trend</span>
                <span className={`font-medium ${
                  metrics.trend === 'improving' ? 'text-green-600' :
                  metrics.trend === 'declining' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {metrics.trend.charAt(0).toUpperCase() + metrics.trend.slice(1)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Breakdown Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Skill Breakdown</CardTitle>
            <CardDescription>Independence by task type</CardDescription>
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
                  <span>Independence %</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-px bg-red-500" />
                  <span>Target: 40%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Independence Over Time</CardTitle>
          <CardDescription>4-week trend</CardDescription>
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
            Schedule Independence Time
          </CardTitle>
          <CardDescription>
            Set aside time for AI-free practice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Regular independent practice helps maintain and develop your skills.
            Consider scheduling:
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Target className="h-4 w-4 mr-2" />
              Daily 30-minute practice
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Target className="h-4 w-4 mr-2" />
              Weekly skill challenge
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Target className="h-4 w-4 mr-2" />
              Custom schedule
            </Button>
          </div>
          <div className="pt-3 border-t text-xs text-muted-foreground">
            <p><strong>Emergency Override:</strong> If you need AI during scheduled independent time,
            you can use it but will be prompted to reflect on why.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
