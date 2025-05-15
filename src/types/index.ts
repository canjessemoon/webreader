export interface VoiceSettings {
  language: string;
  voice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
  volume: number;
}

export interface Theme {
  isDarkMode: boolean;
  fontSize: string;
  backgroundColor: string;
}

// Using const assertion instead of enum due to compiler settings
export const ReadingStatus = {
  Idle: 'idle',
  Loading: 'loading',
  Ready: 'ready',
  Reading: 'reading',
  Paused: 'paused',
  Error: 'error'
} as const;

export type ReadingStatus = typeof ReadingStatus[keyof typeof ReadingStatus];
