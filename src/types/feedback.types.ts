export interface FeedbackCategory {
  name: string;
  score: number;
  feedback: string;
}

export interface FillerWord {
  word: string;
  count: number;
}

export interface ImprovementPoint {
  title: string;
  description: string;
  example?: string;
}

export interface SessionFeedback {
  overallScore: number;
  grade: string;
  summary: string;
  strengths: string[];
  improvements: ImprovementPoint[];
  fillerWords: FillerWord[];
  categories: FeedbackCategory[];
  cappedAt?: number | null;
}
