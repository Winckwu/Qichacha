import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { generateCalibrationData } from '@/data/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function CalibrationPage() {
  const { t } = useTranslation();
  const calibration = generateCalibrationData();

  const chartData = calibration.bins.map(bin => ({
    range: bin.range,
    confidence: (bin.confidence * 100).toFixed(1),
    accuracy: (bin.accuracy * 100).toFixed(1),
    gap: Math.abs((bin.confidence - bin.accuracy) * 100).toFixed(1),
    count: bin.count
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('calibration.title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('calibration.description')}
        </p>
      </div>

      {/* ECE Score */}
      <Card className="border-2 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <BarChart3 className="h-8 w-8" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">{t('calibration.eceTitle')}</div>
                <div className="text-4xl font-bold text-primary">
                  {(calibration.ece * 100).toFixed(2)}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {t('calibration.basedOnSamples', { count: calibration.totalSamples.toLocaleString() })}
                </div>
              </div>
            </div>
            <Badge variant={calibration.ece < 0.05 ? 'success' : calibration.ece < 0.1 ? 'warning' : 'destructive'} className="text-lg px-4 py-2">
              {calibration.ece < 0.05 ? t('calibration.excellent') : calibration.ece < 0.1 ? t('calibration.good') : t('calibration.needsImprovement')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calibration Curve */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>{t('calibration.calibrationCurve')}</CardTitle>
            <CardDescription>{t('calibration.calibrationDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" angle={-45} textAnchor="end" height={80} fontSize={11} />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="confidence"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name={t('calibration.predictedConfidence')}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#10b981"
                  strokeWidth={2}
                  name={t('calibration.actualAccuracy')}
                  dot={{ fill: '#10b981', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="confidence"
                  stroke="#6b7280"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  name={t('calibration.idealLine')}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gap Analysis */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>{t('calibration.gapAnalysis')}</CardTitle>
            <CardDescription>{t('calibration.gapDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" angle={-45} textAnchor="end" height={80} fontSize={11} />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Bar dataKey="gap" name={t('calibration.gap')} radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={parseFloat(entry.gap) < 3 ? '#10b981' : parseFloat(entry.gap) < 5 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Bins */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>{t('calibration.detailedDistribution')}</CardTitle>
          <CardDescription>{t('calibration.distributionDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-semibold">{t('calibration.confidenceRange')}</th>
                  <th className="py-3 px-4 text-center font-semibold">{t('calibration.sampleCount')}</th>
                  <th className="py-3 px-4 text-center font-semibold">{t('calibration.predicted')}</th>
                  <th className="py-3 px-4 text-center font-semibold">{t('calibration.actual')}</th>
                  <th className="py-3 px-4 text-center font-semibold">{t('calibration.gap')}</th>
                  <th className="py-3 px-4 text-center font-semibold">{t('calibration.status')}</th>
                </tr>
              </thead>
              <tbody>
                {calibration.bins.map((bin, index) => {
                  const gap = Math.abs(bin.confidence - bin.accuracy);
                  return (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono">{bin.range}</td>
                      <td className="py-3 px-4 text-center">{bin.count}</td>
                      <td className="py-3 px-4 text-center font-medium">
                        {(bin.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-center font-medium">
                        {(bin.accuracy * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-center font-medium">
                        {(gap * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={gap < 0.03 ? 'success' : gap < 0.05 ? 'warning' : 'destructive'} className="text-xs">
                          {gap < 0.03 ? t('calibration.excellent') : gap < 0.05 ? t('calibration.good') : t('calibration.largeDev')}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Explanation */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>{t('calibration.whatIsECE')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              {t('calibration.eceExplanation1')}
            </p>
            <p>
              {t('calibration.eceExplanation2')}
            </p>
            <p className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded">
              {t('calibration.eceExplanation3')}
            </p>
            <div className="bg-muted p-3 rounded font-mono text-xs">
              {t('calibration.eceFormula')}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>{t('calibration.systemPerformance')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-semibold">{t('calibration.calibrationStatus')}: {t('calibration.calibrationStatusGood')}</div>
                <div className="text-sm text-muted-foreground">{t('calibration.calibrationStatusDesc')}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-semibold">{t('calibration.continuousImprovement')}</div>
                <div className="text-sm text-muted-foreground">{t('calibration.continuousDesc')}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <div className="font-semibold">{t('calibration.largeScaleValidation')}</div>
                <div className="text-sm text-muted-foreground">{t('calibration.validationSamples', { count: calibration.totalSamples.toLocaleString() })}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
