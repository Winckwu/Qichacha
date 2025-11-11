import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  MessageSquare,
  Users,
  Activity,
  Target,
  BarChart3,
  Shield,
  FlaskConical,
  ArrowRight,
  Zap,
  CheckCircle2,
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: '对话演示',
    description: '体验6种用户模式的真实对话场景',
    href: '/chat',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    highlights: ['实时置信度', '模式识别', '交互式对话']
  },
  {
    icon: Users,
    title: '模式识别',
    description: '深入了解6种用户行为模式分类',
    href: '/patterns',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    highlights: ['A-F模式', '特征分析', '动态评分']
  },
  {
    icon: Activity,
    title: '置信度评分',
    description: '多因素置信度计算和可视化',
    href: '/confidence',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    highlights: ['5大因素', '实时评估', '详细解释']
  },
  {
    icon: Target,
    title: '技能监控',
    description: '追踪用户技能和独立性变化',
    href: '/skills',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    highlights: ['趋势分析', '预警机制', '能力建设']
  },
  {
    icon: BarChart3,
    title: '置信度校准',
    description: '查看ECE校准和准确性分析',
    href: '/calibration',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    highlights: ['ECE计算', '校准曲线', '性能指标']
  },
  {
    icon: Shield,
    title: '隐私保护',
    description: '体验三层隐私架构的差异',
    href: '/privacy',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    highlights: ['3层架构', '数据脱敏', '可控分析']
  },
];

const stats = [
  { label: '支持模式', value: '6种', subtext: 'A-F用户分类' },
  { label: '置信度因素', value: '5个', subtext: '多维度评估' },
  { label: '隐私层级', value: '3层', subtext: '灵活可控' },
  { label: '测试场景', value: '6+', subtext: '全面覆盖' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-2xl lg:p-12">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Badge className="bg-white/20 text-white border-white/30">
              v1.0.0 演示版
            </Badge>
            <Badge className="bg-green-500/90 text-white border-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              无需数据库
            </Badge>
          </div>

          <h1 className="text-4xl font-bold lg:text-5xl">
            元认知协作智能体系统
          </h1>
          <p className="mt-4 text-lg text-blue-100 lg:text-xl">
            交互式功能原型 - 探索AI辅助学习的所有核心功能
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/scenarios">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <FlaskConical className="mr-2 h-5 w-5" />
                测试场景
              </Button>
            </Link>
            <Link to="/chat">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 bg-white/5">
                开始对话
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </section>

      {/* Stats Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="mt-1 text-sm font-medium">{stat.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{stat.subtext}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Features Grid */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">功能模块</h2>
            <p className="text-muted-foreground">点击探索各个功能的交互式原型</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.title} to={feature.href}>
                <Card className="group h-full border-2 transition-all hover:border-primary hover:shadow-xl">
                  <CardHeader>
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor}`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {feature.highlights.map((highlight) => (
                        <Badge key={highlight} variant="outline" className="text-xs">
                          <Zap className="mr-1 h-3 w-3" />
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium text-primary">
                      立即体验
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features Highlight */}
      <section className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8">
        <h2 className="mb-6 text-2xl font-bold">系统特色</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">纯前端演示</h3>
              <p className="text-sm text-muted-foreground">无需后端服务器，所有数据模拟生成</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">交互式原型</h3>
              <p className="text-sm text-muted-foreground">丰富的动画和交互，真实体验感</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">完整功能展示</h3>
              <p className="text-sm text-muted-foreground">覆盖6种模式、置信度、隐私等核心功能</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">测试场景</h3>
              <p className="text-sm text-muted-foreground">6+预设场景，演示系统各种能力</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">可视化图表</h3>
              <p className="text-sm text-muted-foreground">使用Recharts展示数据趋势</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">响应式设计</h3>
              <p className="text-sm text-muted-foreground">支持桌面端和移动端访问</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section>
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>快速开始</CardTitle>
            <CardDescription>探索MCA系统的推荐路径</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium">选择测试场景</p>
                  <p className="text-sm text-muted-foreground">从"测试场景"页面选择一个预设场景开始体验</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium">体验对话交互</p>
                  <p className="text-sm text-muted-foreground">在"对话演示"中查看不同用户模式的交互方式</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium">探索深度功能</p>
                  <p className="text-sm text-muted-foreground">逐一探索模式识别、置信度评分、技能监控等功能</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
