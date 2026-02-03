export interface MoodAnalysisRequest {
  text?: string;
  moodOption?: string;
}

export interface MoodAnalysisResponse {
  detected: boolean;
  mood?: string;
  moodId?: number;
  displayName?: string;
  emoji?: string;
  message?: string;
}