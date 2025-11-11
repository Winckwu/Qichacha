import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
    titleKey: 'dashboard.featuresSection.chat.title',
    descriptionKey: 'dashboard.featuresSection.chat.description',
    href: '/chat',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    highlightKeys: [
      'dashboard.featuresSection.chat.highlight1',
      'dashboard.featuresSection.chat.highlight2',
      'dashboard.featuresSection.chat.highlight3'
    ]
  },
  {
    icon: Users,
    titleKey: 'dashboard.featuresSection.patterns.title',
    descriptionKey: 'dashboard.featuresSection.patterns.description',
    href: '/patterns',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    highlightKeys: [
      'dashboard.featuresSection.patterns.highlight1',
      'dashboard.featuresSection.patterns.highlight2',
      'dashboard.featuresSection.patterns.highlight3'
    ]
  },
  {
    icon: Activity,
    titleKey: 'dashboard.featuresSection.confidence.title',
    descriptionKey: 'dashboard.featuresSection.confidence.description',
    href: '/confidence',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    highlightKeys: [
      'dashboard.featuresSection.confidence.highlight1',
      'dashboard.featuresSection.confidence.highlight2',
      'dashboard.featuresSection.confidence.highlight3'
    ]
  },
  {
    icon: Target,
    titleKey: 'dashboard.featuresSection.skills.title',
    descriptionKey: 'dashboard.featuresSection.skills.description',
    href: '/skills',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    highlightKeys: [
      'dashboard.featuresSection.skills.highlight1',
      'dashboard.featuresSection.skills.highlight2',
      'dashboard.featuresSection.skills.highlight3'
    ]
  },
  {
    icon: BarChart3,
    titleKey: 'dashboard.featuresSection.calibration.title',
    descriptionKey: 'dashboard.featuresSection.calibration.description',
    href: '/calibration',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    highlightKeys: [
      'dashboard.featuresSection.calibration.highlight1',
      'dashboard.featuresSection.calibration.highlight2',
      'dashboard.featuresSection.calibration.highlight3'
    ]
  },
  {
    icon: Shield,
    titleKey: 'dashboard.featuresSection.privacy.title',
    descriptionKey: 'dashboard.featuresSection.privacy.description',
    href: '/privacy',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    highlightKeys: [
      'dashboard.featuresSection.privacy.highlight1',
      'dashboard.featuresSection.privacy.highlight2',
      'dashboard.featuresSection.privacy.highlight3'
    ]
  },
];

export default function DashboardPage() {
  const { t } = useTranslation();

  const stats = [
    {
      label: t('dashboard.stats.patterns.label'),
      value: t('dashboard.stats.patterns.value'),
      subtext: t('dashboard.stats.patterns.subtext')
    },
    {
      label: t('dashboard.stats.confidenceFactors.label'),
      value: t('dashboard.stats.confidenceFactors.value'),
      subtext: t('dashboard.stats.confidenceFactors.subtext')
    },
    {
      label: t('dashboard.stats.privacyLevels.label'),
      value: t('dashboard.stats.privacyLevels.value'),
      subtext: t('dashboard.stats.privacyLevels.subtext')
    },
    {
      label: t('dashboard.stats.scenarios.label'),
      value: t('dashboard.stats.scenarios.value'),
      subtext: t('dashboard.stats.scenarios.subtext')
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-2xl lg:p-12">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Badge className="bg-white/20 text-white border-white/30">
              {t('dashboard.hero.version')}
            </Badge>
            <Badge className="bg-green-500/90 text-white border-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              {t('dashboard.hero.noDatabase')}
            </Badge>
          </div>

          <h1 className="text-4xl font-bold lg:text-5xl">
            {t('dashboard.hero.title')}
          </h1>
          <p className="mt-4 text-lg text-blue-100 lg:text-xl">
            {t('dashboard.hero.subtitle')}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/scenarios">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <FlaskConical className="mr-2 h-5 w-5" />
                {t('dashboard.hero.testScenarios')}
              </Button>
            </Link>
            <Link to="/chat">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 bg-white/5">
                {t('dashboard.hero.startChat')}
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
            <h2 className="text-2xl font-bold">{t('dashboard.featuresSection.title')}</h2>
            <p className="text-muted-foreground">{t('dashboard.featuresSection.subtitle')}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.titleKey} to={feature.href}>
                <Card className="group h-full border-2 transition-all hover:border-primary hover:shadow-xl">
                  <CardHeader>
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor}`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {t(feature.titleKey)}
                    </CardTitle>
                    <CardDescription>{t(feature.descriptionKey)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {feature.highlightKeys.map((highlightKey) => (
                        <Badge key={highlightKey} variant="outline" className="text-xs">
                          <Zap className="mr-1 h-3 w-3" />
                          {t(highlightKey)}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium text-primary">
                      {t('dashboard.featuresSection.tryNow')}
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
        <h2 className="mb-6 text-2xl font-bold">{t('dashboard.systemFeatures.title')}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{t('dashboard.systemFeatures.frontend.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('dashboard.systemFeatures.frontend.description')}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{t('dashboard.systemFeatures.interactive.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('dashboard.systemFeatures.interactive.description')}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{t('dashboard.systemFeatures.complete.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('dashboard.systemFeatures.complete.description')}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{t('dashboard.systemFeatures.scenarios.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('dashboard.systemFeatures.scenarios.description')}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{t('dashboard.systemFeatures.charts.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('dashboard.systemFeatures.charts.description')}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{t('dashboard.systemFeatures.responsive.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('dashboard.systemFeatures.responsive.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section>
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>{t('dashboard.quickStart.title')}</CardTitle>
            <CardDescription>{t('dashboard.quickStart.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t('dashboard.quickStart.step1.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('dashboard.quickStart.step1.description')}</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t('dashboard.quickStart.step2.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('dashboard.quickStart.step2.description')}</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t('dashboard.quickStart.step3.title')}</p>
                  <p className="text-sm text-muted-foreground">{t('dashboard.quickStart.step3.description')}</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
