import { AlertCircle, CheckCircle2, GitCompare, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PatternAInterfaceProps {
  message: string;
  aiResponse?: string;
  onVerify?: () => void;
}

/**
 * Pattern A: Strategic Thinker Interface
 * Features: Task decomposition, process tracking, prominent verification tools
 */
export default function PatternAInterface({ message, aiResponse, onVerify }: PatternAInterfaceProps) {
  const { t } = useTranslation();
  const hasComplexTask = message.length > 100;

  return (
    <div className="space-y-4">
      {/* Task Decomposition Wizard */}
      {hasComplexTask && (
        <Alert variant="info">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('patterns.a.taskDecomposition.title')}</AlertTitle>
          <AlertDescription>
            {t('patterns.a.taskDecomposition.description')}
          </AlertDescription>
          <Button size="sm" className="mt-2" variant="outline">
            {t('patterns.a.taskDecomposition.action')}
          </Button>
        </Alert>
      )}

      {/* Verification Panel */}
      {aiResponse && (
        <Card className="border-primary/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {t('patterns.a.verification.title')}
            </CardTitle>
            <CardDescription>
              {t('patterns.a.verification.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={onVerify}
              variant="outline"
              className="w-full justify-start"
            >
              <GitCompare className="h-4 w-4 mr-2" />
              {t('patterns.a.verification.compareModels')}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {t('patterns.a.verification.checkFacts')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Process Tracker */}
      {aiResponse && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{t('patterns.a.tracking.title')}</CardTitle>
            <CardDescription className="text-xs">
              {t('patterns.a.tracking.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {t('patterns.a.tracking.placeholder')}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
