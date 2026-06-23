export type MusicStyle =
  | "Gospel"
  | "Jazz"
  | "R&B"
  | "Pop"
  | "Worship"
  | "Classical"
  | "Other";

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";
export type CreativeApproach = "Preserve" | "Develop" | "Explore";
export type ConfidenceLevel = "Low" | "Medium" | "High";

export interface AnalyzeRequest {
  idea: string;
  style: MusicStyle;
  skillLevel: SkillLevel;
  keyCenter?: string;
  goal?: string;
}

export interface AnalyzeResponse {
  musicalAnalysis: string;
  whatWorks: string;
  suggestions: string;
  creativeAlternative: string;
  practiceExercise: string;
  personalStyleReminder: string;
  creativePaths: CreativePath[];
  practicePlan: PracticeStep[];
  aiReflection: AIReflection;
}

export interface CreativePath {
  approach: CreativeApproach;
  title: string;
  progression: string;
  rationale: string;
  tradeoff: string;
}

export interface PracticeStep {
  title: string;
  instruction: string;
  repetitions: string;
  listenFor: string;
}

export interface AIReflection {
  evidence: string[];
  assumptions: string[];
  unknowns: string[];
  confidence: ConfidenceLevel;
  confidenceReason: string;
}

export interface SampleIdea extends AnalyzeRequest {
  title: string;
}
