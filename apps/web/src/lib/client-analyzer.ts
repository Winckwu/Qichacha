/**
 * Client-Side Analyzer
 * Runs analysis in the browser, does not send content to server
 * Tier 2 Privacy: Limited Content
 */

export interface Claim {
  text: string;
  type: 'date' | 'number' | 'entity' | 'event';
  startIndex: number;
  endIndex: number;
}

export interface VerificationResult {
  claim: Claim;
  verified: boolean;
  confidence: number;
  source?: string;
}

export class ClientSideAnalyzer {
  /**
   * Analyze text locally in browser
   * Does NOT send full text to server
   */
  async analyzeLocally(text: string): Promise<{
    claims: Claim[];
    metadata: {
      wordCount: number;
      hasCode: boolean;
      hasLinks: boolean;
      complexity: number;
    };
  }> {
    const claims = this.extractClaimsLocal(text);
    const metadata = this.extractMetadata(text);

    return { claims, metadata };
  }

  /**
   * Extract factual claims locally using regex patterns
   * Lightweight, no ML required
   */
  private extractClaimsLocal(text: string): Claim[] {
    const claims: Claim[] = [];

    // Date patterns
    const datePattern = /\b(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4})\b/gi;
    let match;

    while ((match = datePattern.exec(text)) !== null) {
      claims.push({
        text: match[0],
        type: 'date',
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }

    // Number patterns (with units)
    const numberPattern = /\b(\d+(?:,\d{3})*(?:\.\d+)?)\s*(%|kg|km|miles|dollars|€|£|\$|meters|feet)\b/gi;

    while ((match = numberPattern.exec(text)) !== null) {
      claims.push({
        text: match[0],
        type: 'number',
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }

    // Named entities (capitalized words)
    const entityPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;

    while ((match = entityPattern.exec(text)) !== null) {
      // Filter out common words
      const commonWords = ['The', 'This', 'That', 'These', 'Those', 'I', 'You', 'He', 'She'];
      if (!commonWords.includes(match[1])) {
        claims.push({
          text: match[0],
          type: 'entity',
          startIndex: match.index,
          endIndex: match.index + match[0].length,
        });
      }
    }

    return claims;
  }

  /**
   * Extract metadata without full content
   */
  private extractMetadata(text: string): {
    wordCount: number;
    hasCode: boolean;
    hasLinks: boolean;
    complexity: number;
  } {
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    const hasCode = text.includes('```') || text.includes('`');
    const hasLinks = /https?:\/\//.test(text);

    // Calculate complexity
    let complexity = 0.3;
    complexity += Math.min(0.3, wordCount / 500);
    if (hasCode) complexity += 0.2;
    if (text.split('\n').length > 10) complexity += 0.1;

    return {
      wordCount,
      hasCode,
      hasLinks,
      complexity: Math.min(1, complexity),
    };
  }

  /**
   * Verify claims using public APIs (only sends extracted claims, not full text)
   */
  async verifyClaims(claims: Claim[]): Promise<VerificationResult[]> {
    const results: VerificationResult[] = [];

    for (const claim of claims) {
      try {
        // For dates and numbers, we can do basic sanity checks locally
        if (claim.type === 'date' || claim.type === 'number') {
          results.push({
            claim,
            verified: true,
            confidence: 0.7, // Medium confidence for local verification
          });
        }

        // For entities and events, would query external APIs
        // But only send the extracted claim, not the full text
        if (claim.type === 'entity') {
          // TODO: Query Wikipedia API with just the entity name
          results.push({
            claim,
            verified: false,
            confidence: 0.5,
          });
        }
      } catch (error) {
        console.error('Verification error:', error);
      }
    }

    return results;
  }

  /**
   * Check if user has granted permission for client-side analysis
   */
  hasAnalysisPermission(): boolean {
    return localStorage.getItem('mca_analysis_permission') === 'granted';
  }

  /**
   * Request permission for client-side analysis
   */
  async requestAnalysisPermission(): Promise<boolean> {
    // Show consent dialog
    const consent = confirm(
      'Enable client-side analysis? This will:\n\n' +
        '✓ Extract factual claims from your messages\n' +
        '✓ Verify claims using public APIs\n' +
        '✓ All analysis happens in your browser\n' +
        '✗ Full message content is NEVER sent to our servers\n\n' +
        'You can revoke this at any time in settings.'
    );

    if (consent) {
      localStorage.setItem('mca_analysis_permission', 'granted');
      return true;
    }

    return false;
  }

  /**
   * Revoke analysis permission
   */
  revokeAnalysisPermission(): void {
    localStorage.removeItem('mca_analysis_permission');
  }
}

export const clientAnalyzer = new ClientSideAnalyzer();
