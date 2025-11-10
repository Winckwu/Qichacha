import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { generateCalibrationData } from '@/data/mockData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function CalibrationPage() {
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
        <h1 className="text-3xl font-bold">置信度校准</h1>
        <p className="mt-2 text-muted-foreground">
          Expected Calibration Error (ECE) 分析与校准曲线
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
                <div className="text-sm text-muted-foreground">Expected Calibration Error</div>
                <div className="text-4xl font-bold text-primary">
                  {(calibration.ece * 100).toFixed(2)}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  基于 {calibration.totalSamples.toLocaleString()} 个样本
                </div>
              </div>
            </div>
            <Badge variant={calibration.ece < 0.05 ? 'success' : calibration.ece < 0.1 ? 'warning' : 'destructive'} className="text-lg px-4 py-2">
              {calibration.ece < 0.05 ? '优秀' : calibration.ece < 0.1 ? '良好' : '需要改进'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calibration Curve */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>校准曲线</CardTitle>
            <CardDescription>置信度与实际准确率的对比</CardDescription>
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
                  name="预测置信度"
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="实际准确率"
                  dot={{ fill: '#10b981', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="confidence"
                  stroke="#6b7280"
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  name="理想线"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gap Analysis */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>校准差距</CardTitle>
            <CardDescription>各区间的置信度偏差</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" angle={-45} textAnchor="end" height={80} fontSize={11} />
                <YAxis />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Bar dataKey="gap" name="差距" radius={[8, 8, 0, 0]}>
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
          <CardTitle>详细分布</CardTitle>
          <CardDescription>各置信度区间的统计数据</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left font-semibold">置信度区间</th>
                  <th className="py-3 px-4 text-center font-semibold">样本数</th>
                  <th className="py-3 px-4 text-center font-semibold">预测置信度</th>
                  <th className="py-3 px-4 text-center font-semibold">实际准确率</th>
                  <th className="py-3 px-4 text-center font-semibold">差距</th>
                  <th className="py-3 px-4 text-center font-semibold">状态</th>
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
                          {gap < 0.03 ? '优秀' : gap < 0.05 ? '良好' : '偏差大'}
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
            <CardTitle>什么是ECE?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Expected Calibration Error (ECE)</strong> 是衡量模型置信度校准程度的指标。
            </p>
            <p>
              完美校准意味着：当模型说有80%置信度时，它应该在80%的情况下是正确的。
            </p>
            <p className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded">
              ECE越低越好。ECE &lt; 5%被认为是优秀的校准。
            </p>
            <div className="bg-muted p-3 rounded font-mono text-xs">
              ECE = Σ |confidence - accuracy| × weight
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>系统性能</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-semibold">校准状态: 优秀</div>
                <div className="text-sm text-muted-foreground">ECE低于5%阈值</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-semibold">持续改进</div>
                <div className="text-sm text-muted-foreground">自动校准每1000个样本</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <div className="font-semibold">大规模验证</div>
                <div className="text-sm text-muted-foreground">{calibration.totalSamples.toLocaleString()}个评估样本</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
