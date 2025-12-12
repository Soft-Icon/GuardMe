export interface GuardMEResponse {
  safe: boolean;
  risk_score: number;
  primary_category: "Harassment" | "Sexual" | "Misinformation" | "Age-Inappropriate" | "None";
  reasoning: string;
  action: "BLOCK" | "WARN" | "ALLOW";
}

export interface HistoryItem extends GuardMEResponse {
  id: string;
  timestamp: Date;
  excerpt: string;
}

export enum SafetyStatus {
  Safe = 'Safe',
  Warning = 'Warning',
  Unsafe = 'Unsafe'
}