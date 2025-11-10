import { AlertTriangle, Brain, Target } from 'lucide-react';
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
  return (
    <div className="space-y-4">
      {/* Strong Warning */}
      <Alert variant="warning" className="border-2">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="text-lg">Skill Development Alert</AlertTitle>
        <AlertDescription className="text-base">
          Our system has detected a pattern of immediate AI reliance without verification.
          This may impact your learning and skill development over time.
        </AlertDescription>
      </Alert>

      {/* Try Solo Card */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Try It Yourself First
          </CardTitle>
          <CardDescription>
            Building skills requires active practice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Before using AI, please take a moment to:
          </p>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>Think about what you already know</li>
            <li>Outline your initial approach</li>
            <li>Try solving it independently for 5 minutes</li>
          </ul>
          <Button onClick={onTrySolo} className="w-full" size="lg">
            <Target className="h-4 w-4 mr-2" />
            I'll Try Solo First
          </Button>
        </CardContent>
      </Card>

      {/* Reflection Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reflection Questions</CardTitle>
          <CardDescription>
            Consider these before proceeding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">1. What have you tried so far?</p>
              <p className="text-muted-foreground text-xs mt-1">Think about your initial attempts</p>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">2. What specific part do you need help with?</p>
              <p className="text-muted-foreground text-xs mt-1">Be precise about where you're stuck</p>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">3. How will you verify the AI's answer?</p>
              <p className="text-muted-foreground text-xs mt-1">Plan your verification strategy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
