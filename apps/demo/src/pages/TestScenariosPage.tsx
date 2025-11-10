import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { TEST_SCENARIOS, PATTERN_INFO, generateConversation, generatePatternData, generateConfidenceScore } from '@/data/mockData';
import { FlaskConical, Play, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TestScenariosPage() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const navigate = useNavigate();

  const runScenario = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setRunning(true);

    // Simulate scenario execution
    setTimeout(() => {
      setRunning(false);

      // Navigate to relevant page based on scenario
      const scenario = TEST_SCENARIOS.find(s => s.id === scenarioId);
      if (scenario) {
        if (scenarioId.includes('calibration')) {
          navigate('/calibration');
        } else if (scenarioId.includes('privacy')) {
          navigate('/privacy');
        } else {
          navigate('/chat');
        }
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FlaskConical className="h-8 w-8 text-primary" />
          测试场景
        </h1>
        <p className="mt-2 text-muted-foreground">
          预设的交互场景，展示MCA系统的各种能力
        </p>
      </div>

      {/* Running Indicator */}
      {running && (
        <Card className="border-2 border-primary bg-primary/5 animate-pulse">
          <CardContent className="py-6">
            <div className="flex items-center justify-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="font-semibold text-primary">场景执行中...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scenarios Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TEST_SCENARIOS.map((scenario) => {
          const patternInfo = PATTERN_INFO[scenario.pattern];
          const isSelected = selectedScenario === scenario.id;

          return (
            <Card
              key={scenario.id}
              className={cn(
                'border-2 transition-all group hover:shadow-xl',
                isSelected && 'ring-2 ring-primary shadow-2xl'
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-lg text-white font-bold text-xl',
                    `bg-${patternInfo.color}-600`
                  )}>
                    {scenario.pattern}
                  </div>
                  <Badge variant="outline">
                    场景 {scenario.id.split('-')[1]}
                  </Badge>
                </div>

                <CardTitle className="mt-4 group-hover:text-primary transition-colors">
                  {scenario.name}
                </CardTitle>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Highlights */}
                <div className="flex flex-wrap gap-2">
                  {scenario.highlights.map((highlight, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      <Sparkles className="mr-1 h-3 w-3" />
                      {highlight}
                    </Badge>
                  ))}
                </div>

                {/* Pattern Info */}
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-xs text-muted-foreground">用户模式</div>
                  <div className="font-semibold">{patternInfo.name}</div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => runScenario(scenario.id)}
                  disabled={running}
                  className="w-full"
                  variant={isSelected ? 'default' : 'outline'}
                >
                  {running && isSelected ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      执行中...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      运行场景
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Explanation */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>场景说明</CardTitle>
          <CardDescription>每个测试场景的详细信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {TEST_SCENARIOS.map((scenario) => {
            const patternInfo = PATTERN_INFO[scenario.pattern];
            const messages = generateConversation(scenario.pattern).slice(0, 2);
            const patternData = generatePatternData(scenario.pattern);

            return (
              <div key={scenario.id} className="rounded-lg border p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{scenario.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{scenario.description}</p>
                  </div>
                  <Badge className={`bg-${patternInfo.color}-600 text-white`}>
                    模式 {scenario.pattern}
                  </Badge>
                </div>

                {/* Sample Interaction */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="text-sm font-semibold text-muted-foreground">示例交互:</div>
                  {messages.map((msg, idx) => (
                    <div key={idx} className={cn(
                      'text-sm p-3 rounded-lg',
                      msg.role === 'user' ? 'bg-primary/10 ml-8' : 'bg-white mr-8'
                    )}>
                      <div className="font-medium mb-1">
                        {msg.role === 'user' ? '用户' : 'AI'}:
                      </div>
                      {msg.content}
                    </div>
                  ))}
                </div>

                {/* Expected Results */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
                    <div className="text-xs text-blue-600 font-semibold mb-1">模式识别</div>
                    <div className="text-sm font-bold text-blue-900">
                      {patternInfo.name} ({Math.round(patternData.confidence * 100)}%)
                    </div>
                  </div>

                  <div className="rounded-lg bg-green-50 p-3 border border-green-200">
                    <div className="text-xs text-green-600 font-semibold mb-1">置信度</div>
                    <div className="text-sm font-bold text-green-900">
                      {messages[1]?.confidence
                        ? `${Math.round(messages[1].confidence.score * 100)}%`
                        : 'N/A'}
                    </div>
                  </div>

                  <div className="rounded-lg bg-purple-50 p-3 border border-purple-200">
                    <div className="text-xs text-purple-600 font-semibold mb-1">特征点</div>
                    <div className="text-sm font-bold text-purple-900">
                      {scenario.highlights.length} 项
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2">
                  {scenario.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-2 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle>快速导航</CardTitle>
          <CardDescription>运行场景后，您可以访问这些页面查看详细结果</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: '对话演示', path: '/chat' },
              { label: '模式识别', path: '/patterns' },
              { label: '置信度评分', path: '/confidence' },
              { label: '技能监控', path: '/skills' },
            ].map((link) => (
              <Button
                key={link.path}
                variant="outline"
                onClick={() => navigate(link.path)}
                className="w-full"
              >
                {link.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
