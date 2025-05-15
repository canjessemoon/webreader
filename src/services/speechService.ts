import type { VoiceSettings } from '../types';

class SpeechService {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private currentText: string = '';
  private highlightCallback: ((index: number) => void) | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];
  
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
    
    // Handle async voice loading
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }

  private loadVoices(): void {
    this.availableVoices = this.synthesis.getVoices();
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.availableVoices;
  }

  public getVoicesByLanguage(language: string): SpeechSynthesisVoice[] {
    return this.availableVoices.filter(voice => voice.lang.startsWith(language));
  }

  public getAvailableLanguages(): { code: string, name: string }[] {
    const languageMap = new Map<string, string>();
    
    this.availableVoices.forEach(voice => {
      const langCode = voice.lang.split('-')[0];
      const langName = new Intl.DisplayNames([navigator.language], { type: 'language' }).of(langCode);
      languageMap.set(langCode, langName || langCode);
    });
    
    return Array.from(languageMap.entries()).map(([code, name]) => ({ code, name }));
  }

  public speak(text: string, settings: VoiceSettings, highlightCallback?: (index: number) => void): void {
    this.stop();
    this.currentText = text;
    this.highlightCallback = highlightCallback || null;
    
    this.utterance = new SpeechSynthesisUtterance(text);
    
    if (settings.voice) {
      this.utterance.voice = settings.voice;
    } else if (settings.language) {
      // Try to find a voice for the selected language
      const voices = this.getVoicesByLanguage(settings.language);
      if (voices.length > 0) {
        this.utterance.voice = voices[0];
      }
    }
    
    this.utterance.rate = settings.rate;
    this.utterance.pitch = settings.pitch;
    this.utterance.volume = settings.volume;
    
    // Handle highlighting text as it's spoken
    if (this.highlightCallback) {
      this.utterance.onboundary = (event) => {
        if (event.name === 'word' && this.highlightCallback) {
          this.highlightCallback(event.charIndex);
        }
      };
    }
    
    this.synthesis.speak(this.utterance);
  }
  
  public pause(): void {
    this.synthesis.pause();
  }
  
  public resume(): void {
    this.synthesis.resume();
  }
  
  public stop(): void {
    this.synthesis.cancel();
    this.utterance = null;
  }
  
  public isSpeaking(): boolean {
    return this.synthesis.speaking;
  }
  
  public isPaused(): boolean {
    return this.synthesis.paused;
  }
    public getCurrentPosition(): number {
    // This is an estimation as the Web Speech API doesn't provide a reliable way to get the current position
    if (this.utterance && this.highlightCallback) {
      // Since elapsedTime isn't available in SpeechSynthesisUtterance, we'll use a rough estimate
      const estimatedCharsPerSecond = this.currentText.length / (this.utterance.rate * 5); // Rough estimate
      // Use an approximate value since we can't directly access elapsed time
      return Math.min(Math.floor(estimatedCharsPerSecond), this.currentText.length);
    }
    return 0;
  }
}

export default new SpeechService();
