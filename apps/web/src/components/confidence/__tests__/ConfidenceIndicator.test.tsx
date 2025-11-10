import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ConfidenceIndicator from '../ConfidenceIndicator';
import type { ConfidenceResult } from '@/types';

describe('ConfidenceIndicator', () => {
  const createConfidence = (score: number, level: 'high' | 'moderate' | 'low' | 'critical'): ConfidenceResult => ({
    score,
    level,
    factors: {
      modelUncertainty: 0.8,
      knowledgeBaseMatch: 0.9,
      recencyPenalty: 1.0,
      domainReliability: 0.85,
      sourceConsensus: 0.88,
    },
    explanation: 'Test explanation for confidence score.',
  });

  describe('Rendering', () => {
    it('should render confidence percentage', () => {
      const confidence = createConfidence(0.92, 'high');
      render(<ConfidenceIndicator confidence={confidence} />);

      expect(screen.getByText(/92%/)).toBeInTheDocument();
    });

    it('should render confidence label', () => {
      const confidence = createConfidence(0.85, 'high');
      render(<ConfidenceIndicator confidence={confidence} />);

      expect(screen.getByText(/Confidence:/)).toBeInTheDocument();
    });

    it('should render explanation text', () => {
      const confidence = createConfidence(0.75, 'moderate');
      render(<ConfidenceIndicator confidence={confidence} />);

      expect(screen.getByText(/Test explanation/)).toBeInTheDocument();
    });
  });

  describe('Color Coding', () => {
    it('should display green for high confidence', () => {
      const confidence = createConfidence(0.92, 'high');
      const { container } = render(<ConfidenceIndicator confidence={confidence} />);

      const progressBar = container.querySelector('.bg-green-500');
      expect(progressBar).toBeInTheDocument();
    });

    it('should display yellow for moderate confidence', () => {
      const confidence = createConfidence(0.65, 'moderate');
      const { container } = render(<ConfidenceIndicator confidence={confidence} />);

      const progressBar = container.querySelector('.bg-yellow-500');
      expect(progressBar).toBeInTheDocument();
    });

    it('should display orange for low confidence', () => {
      const confidence = createConfidence(0.4, 'low');
      const { container } = render(<ConfidenceIndicator confidence={confidence} />);

      const progressBar = container.querySelector('.bg-orange-500');
      expect(progressBar).toBeInTheDocument();
    });

    it('should display red for critical confidence', () => {
      const confidence = createConfidence(0.2, 'critical');
      const { container } = render(<ConfidenceIndicator confidence={confidence} />);

      const progressBar = container.querySelector('.bg-red-500');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Detailed Breakdown', () => {
    it('should show details when clicking info button', () => {
      const confidence = createConfidence(0.85, 'high');
      render(<ConfidenceIndicator confidence={confidence} />);

      const infoButton = screen.getByRole('button', { name: /show confidence details/i });
      fireEvent.click(infoButton);

      expect(screen.getByText(/Confidence Breakdown/)).toBeInTheDocument();
    });

    it('should display all factor bars in breakdown', () => {
      const confidence = createConfidence(0.85, 'high');
      render(<ConfidenceIndicator confidence={confidence} />);

      const infoButton = screen.getByRole('button', { name: /show confidence details/i });
      fireEvent.click(infoButton);

      expect(screen.getByText(/Model Certainty/)).toBeInTheDocument();
      expect(screen.getByText(/Knowledge Match/)).toBeInTheDocument();
      expect(screen.getByText(/Information Recency/)).toBeInTheDocument();
      expect(screen.getByText(/Domain Reliability/)).toBeInTheDocument();
      expect(screen.getByText(/Source Consensus/)).toBeInTheDocument();
    });

    it('should toggle details visibility', () => {
      const confidence = createConfidence(0.85, 'high');
      render(<ConfidenceIndicator confidence={confidence} />);

      const infoButton = screen.getByRole('button', { name: /show confidence details/i });

      // Click to show
      fireEvent.click(infoButton);
      expect(screen.getByText(/Confidence Breakdown/)).toBeInTheDocument();

      // Click to hide
      fireEvent.click(infoButton);
      expect(screen.queryByText(/Confidence Breakdown/)).not.toBeInTheDocument();
    });
  });

  describe('Factor Calculations', () => {
    it('should display factor percentages correctly', () => {
      const confidence: ConfidenceResult = {
        score: 0.85,
        level: 'high',
        factors: {
          modelUncertainty: 0.95,
          knowledgeBaseMatch: 0.90,
          recencyPenalty: 1.0,
          domainReliability: 0.85,
          sourceConsensus: 0.75,
        },
        explanation: 'Test',
      };

      render(<ConfidenceIndicator confidence={confidence} />);

      const infoButton = screen.getByRole('button', { name: /show confidence details/i });
      fireEvent.click(infoButton);

      expect(screen.getByText(/95%/)).toBeInTheDocument(); // modelUncertainty
      expect(screen.getByText(/90%/)).toBeInTheDocument(); // knowledgeBaseMatch
      expect(screen.getByText(/100%/)).toBeInTheDocument(); // recencyPenalty
      expect(screen.getByText(/85%/)).toBeInTheDocument(); // domainReliability
      expect(screen.getByText(/75%/)).toBeInTheDocument(); // sourceConsensus
    });
  });

  describe('Progress Bar Width', () => {
    it('should set progress bar width based on score', () => {
      const confidence = createConfidence(0.75, 'moderate');
      const { container } = render(<ConfidenceIndicator confidence={confidence} />);

      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar).toHaveStyle({ width: '75%' });
    });

    it('should handle 0% confidence', () => {
      const confidence = createConfidence(0, 'critical');
      const { container } = render(<ConfidenceIndicator confidence={confidence} />);

      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar).toHaveStyle({ width: '0%' });
    });

    it('should handle 100% confidence', () => {
      const confidence = createConfidence(1.0, 'high');
      const { container } = render(<ConfidenceIndicator confidence={confidence} />);

      const progressBar = container.querySelector('[style*="width"]');
      expect(progressBar).toHaveStyle({ width: '100%' });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button', () => {
      const confidence = createConfidence(0.85, 'high');
      render(<ConfidenceIndicator confidence={confidence} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very low confidence', () => {
      const confidence = createConfidence(0.05, 'critical');
      render(<ConfidenceIndicator confidence={confidence} />);

      expect(screen.getByText(/5%/)).toBeInTheDocument();
    });

    it('should handle maximum confidence', () => {
      const confidence = createConfidence(1.0, 'high');
      render(<ConfidenceIndicator confidence={confidence} />);

      expect(screen.getByText(/100%/)).toBeInTheDocument();
    });
  });
});
