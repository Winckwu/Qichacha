import { AlertTriangle, Brain, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PatternFInterventionProps {
  onTrySolo: () => void;
}

/**
 * Pattern F: Uncritical Acceptor - Intervention Interface
 * Strong prompts to encourage independent work and verification
 */
export default function PatternFIntervention({ onTrySolo }: PatternFInterventionProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Strong Warning */}
      <Alert variant="warning" className="border-2">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="text-lg">{t('patterns.f.alert.title')}</AlertTitle>
        <AlertDescription className="text-base">
          {t('patterns.f.alert.description')}
        </AlertDescription>
      </Alert>

      {/* Try Solo Card */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            {t('patterns.f.trySolo.title')}
          </CardTitle>
          <CardDescription>
            {t('patterns.f.trySolo.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            {t('patterns.f.trySolo.intro')}
          </p>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>{t('patterns.f.trySolo.steps.think')}</li>
            <li>{t('patterns.f.trySolo.steps.outline')}</li>
            <li>{t('patterns.f.trySolo.steps.try')}</li>
          </ul>
          <Button onClick={onTrySolo} className="w-full" size="lg">
            <Target className="h-4 w-4 mr-2" />
            {t('patterns.f.trySolo.action')}
          </Button>
        </CardContent>
      </Card>

      {/* Reflection Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('patterns.f.reflection.title')}</CardTitle>
          <CardDescription>
            {t('patterns.f.reflection.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">{t('patterns.f.reflection.questions.tried.question')}</p>
              <p className="text-muted-foreground text-xs mt-1">{t('patterns.f.reflection.questions.tried.hint')}</p>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">{t('patterns.f.reflection.questions.help.question')}</p>
              <p className="text-muted-foreground text-xs mt-1">{t('patterns.f.reflection.questions.help.hint')}</p>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">{t('patterns.f.reflection.questions.verify.question')}</p>
              <p className="text-muted-foreground text-xs mt-1">{t('patterns.f.reflection.questions.verify.hint')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
