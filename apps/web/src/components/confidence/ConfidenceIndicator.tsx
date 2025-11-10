import { useState } from 'react';
import { Info } from 'lucide-react';
import type { ConfidenceResult } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ConfidenceIndicatorProps {
  confidence: ConfidenceResult;
  className?: string;
}

export default function ConfidenceIndicator({ confidence, className }: ConfidenceIndicatorProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getColorClass = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-green-500';
      case 'moderate':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-orange-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTextColorClass = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-green-700 dark:text-green-400';
      case 'moderate':
        return 'text-yellow-700 dark:text-yellow-400';
      case 'low':
        return 'text-orange-700 dark:text-orange-400';
      case 'critical':
        return 'text-red-700 dark:text-red-400';
      default:
        return 'text-gray-700';
    }
  };

  const percentage = Math.round(confidence.score * 100);

  return (
    <div className={cn('space-y-2', className)}>
      {/* Compact display */}
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className={cn('text-sm font-semibold', getTextColorClass(confidence.level))}>
              Confidence: {percentage}%
            </span>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Show confidence details"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn('h-full transition-all duration-300', getColorClass(confidence.level))}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-xs text-muted-foreground">{confidence.explanation}</p>

      {/* Detailed breakdown */}
      {showDetails && (
        <Card className="mt-3 border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Confidence Breakdown</CardTitle>
            <CardDescription className="text-xs">
              How we calculated this confidence score
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <FactorBar
              label="Model Certainty"
              value={confidence.factors.modelUncertainty}
              weight={20}
            />
            <FactorBar
              label="Knowledge Match"
              value={confidence.factors.knowledgeBaseMatch}
              weight={30}
            />
            <FactorBar
              label="Information Recency"
              value={confidence.factors.recencyPenalty}
              weight={20}
            />
            <FactorBar
              label="Domain Reliability"
              value={confidence.factors.domainReliability}
              weight={10}
            />
            <FactorBar
              label="Source Consensus"
              value={confidence.factors.sourceConsensus}
              weight={20}
            />

            <div className="pt-2 mt-2 border-t text-xs text-muted-foreground">
              <p>
                <strong>Final Score:</strong> Weighted average of all factors
              </p>
              <p className="mt-1">Formula: 20% Model + 30% Knowledge + 20% Recency + 10% Domain + 20% Consensus</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface FactorBarProps {
  label: string;
  value: number;
  weight: number;
}

function FactorBar({ label, value, weight }: FactorBarProps) {
  const percentage = Math.round(value * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          {percentage}% (weight: {weight}%)
        </span>
      </div>
      <Progress value={value * 100} className="h-1.5" />
    </div>
  );
}
