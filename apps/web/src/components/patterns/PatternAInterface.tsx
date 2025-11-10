import { AlertCircle, CheckCircle2, GitCompare, Shield } from 'lucide-react';
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
  const hasComplexTask = message.length > 100;

  return (
    <div className="space-y-4">
      {/* Task Decomposition Wizard */}
      {hasComplexTask && (
        <Alert variant="info">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Consider Breaking This Down</AlertTitle>
          <AlertDescription>
            This appears to be a complex task. Would you like help decomposing it into smaller steps?
          </AlertDescription>
          <Button size="sm" className="mt-2" variant="outline">
            Help Me Plan
          </Button>
        </Alert>
      )}

      {/* Verification Panel */}
      {aiResponse && (
        <Card className="border-primary/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Verification Tools
            </CardTitle>
            <CardDescription>
              Recommended for strategic thinkers like you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              onClick={onVerify}
              variant="outline"
              className="w-full justify-start"
            >
              <GitCompare className="h-4 w-4 mr-2" />
              Compare with Other Models
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Check Facts & Sources
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Process Tracker */}
      {aiResponse && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Track Changes</CardTitle>
            <CardDescription className="text-xs">
              See how the solution evolved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Process tracking will appear here for iterative tasks
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
