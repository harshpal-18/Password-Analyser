
export enum PasswordStrength {
  WEAK = 'WEAK',
  MEDIUM = 'MEDIUM',
  STRONG = 'STRONG',
  VERY_STRONG = 'VERY_STRONG',
}

export interface SecurityScore {
  score: number; // 0-100
  label: PasswordStrength;
  entropy: number;
  crackingTime: string;
  feedback: string[];
  isCommon: boolean; // Flag for prominent UI warnings
}

export interface AIAnalysis {
  riskAssessment: string;
  bruteForceExplanation: string;
  customSuggestions: string[];
}
