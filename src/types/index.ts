export interface ApiResponse {
  success: boolean;
  data?: string;
  error?: string;
}

export interface ImageUploadData {
  file: File;
  preview: string;
}

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
}