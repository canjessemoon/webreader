import React, { useState, useEffect } from 'react';
import speechService from '../services/speechService';

interface VoiceSettingsProps {
  language: string;
  onLanguageChange: (language: string) => void;
  onVoiceChange: (voice: SpeechSynthesisVoice) => void;
  currentVoice: SpeechSynthesisVoice | null;
}

const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  language,
  onLanguageChange,
  onVoiceChange,
  currentVoice,
}) => {
  const [languages, setLanguages] = useState<{ code: string; name: string }[]>([]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    // Load available languages
    const availableLanguages = speechService.getAvailableLanguages();
    setLanguages(availableLanguages);
    
    // If we don't have a language selected yet, use the browser's language
    if (!language && availableLanguages.length > 0) {
      const browserLang = navigator.language.split('-')[0];
      const foundLang = availableLanguages.find(l => l.code === browserLang);
      if (foundLang) {
        onLanguageChange(foundLang.code);
      } else {
        onLanguageChange(availableLanguages[0].code);
      }
    }
  }, [language, onLanguageChange]);

  useEffect(() => {
    // When language changes, update available voices
    if (language) {
      const availableVoices = speechService.getVoicesByLanguage(language);
      setVoices(availableVoices);
      
      // If we have voices and no current voice is selected, select the first one
      if (availableVoices.length > 0 && !currentVoice) {
        onVoiceChange(availableVoices[0]);
      }
    }
  }, [language, currentVoice, onVoiceChange]);  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Voice Settings</h3>
      
      {/* Language selector */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="language-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Language
          </label>
          {languages.length > 0 && (
            <span className="text-xs text-blue-600 dark:text-blue-400">
              {languages.length} available
            </span>
          )}
        </div>
        <select
          id="language-select"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          {languages.length === 0 ? (
            <option value="">Loading languages...</option>
          ) : (
            languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))
          )}
        </select>
      </div>
      
      {/* Voice selector with better styling */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="voice-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Voice
          </label>
          {voices.length > 0 && (
            <span className="text-xs text-blue-600 dark:text-blue-400">
              {voices.length} voices for {languages.find(l => l.code === language)?.name}
            </span>
          )}
        </div>
        <select
          id="voice-select"
          value={currentVoice?.name || ''}
          onChange={(e) => {
            const selectedVoice = voices.find(v => v.name === e.target.value);
            if (selectedVoice) {
              onVoiceChange(selectedVoice);
            }
          }}
          className="block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          disabled={voices.length === 0}
        >
          {voices.length === 0 && (
            <option value="">No voices available</option>
          )}
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} {voice.default ? '(Default)' : ''}
            </option>
          ))}
        </select>
        
        {/* Note about Google voices availability */}
        {voices.some(v => v.name.includes('Google')) && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
            Google voices may not work on all websites due to browser security restrictions.
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceSettings;
