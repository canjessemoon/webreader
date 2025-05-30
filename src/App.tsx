import { useState, useEffect } from 'react';
import './App.css';

// Components
import Header from './components/Header';
import UrlInput from './components/UrlInput';
// Using the fixed ContentDisplay component
import ContentDisplay from './components/ContentDisplay';
import TTSControls from './components/TTSControls';
import VoiceSettings from './components/VoiceSettings';
import AppearanceSettings from './components/AppearanceSettings';
import StatusPage from './components/StatusPage';
import DeploymentHelper from './components/DeploymentHelper';

// Services
import { extractContent } from './services/contentService';
import speechService from './services/speechService';
import injectCriticalStyles from './injectStyles';
import applyPaddingToAllStates from './forceAllStatePadding';
import { monitorAndFixPadding } from './fixPaddingOnLoad';
import { NETWORK_ERROR, CORS_ERROR, TIMEOUT_ERROR, EMPTY_CONTENT, UNKNOWN_ERROR, type ContentExtractionErrorType } from './services/errorHandling';

// Types
import { ReadingStatus } from './types';
import type { VoiceSettings as VoiceSettingsType, Theme } from './types';

function App() {
  // State for content and reading status
  const [content, setContent] = useState<string>('');
  const [url, setUrl] = useState<string>(''); 
  const [status, setStatus] = useState<ReadingStatus>(ReadingStatus.Idle);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [showStatus, setShowStatus] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<ContentExtractionErrorType>(UNKNOWN_ERROR);
  
  // Voice settings state
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettingsType>({
    language: '',
    voice: null,
    rate: 1,
    pitch: 1,
    volume: 1
  });
  
  // Theme settings
  const [theme, setTheme] = useState<Theme>({
    isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    fontSize: 'text-base',
    backgroundColor: 'bg-white dark:bg-gray-900'
  });
  
  // Apply dark mode class to the document when theme changes
  useEffect(() => {
    if (theme.isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  }, [theme.isDarkMode]);
  
  // Inject critical styles for content padding
  useEffect(() => {
    // Inject our critical styles to ensure content padding
    injectCriticalStyles();
    
    // Apply padding to all container states and monitor for changes
    const cleanupObserver = applyPaddingToAllStates();
    
    // Monitor and fix padding issues at runtime
    monitorAndFixPadding();
    
    // Clean up observer when component unmounts
    return cleanupObserver;
  }, []);
  
  // Handle URL submission and content extraction
  const handleUrlSubmit = async (submittedUrl: string) => {
    setUrl(submittedUrl);
    setStatus(ReadingStatus.Loading);
    
    try {
      const extractedContent = await extractContent(submittedUrl);
      setContent(extractedContent);
      setStatus(ReadingStatus.Ready);
      
      if (!extractedContent || extractedContent.trim() === '') {
        setErrorType(EMPTY_CONTENT);
      }
    } catch (error) {
      console.error('Error extracting content:', error);
      setStatus(ReadingStatus.Error);
      
      // Determine error type based on the error
      if (error instanceof Error) {        if (error.message.includes('CORS')) {
          setErrorType(CORS_ERROR);
        } else if (error.message.includes('timeout')) {
          setErrorType(TIMEOUT_ERROR);
        } else if (error.message.includes('Network')) {
          setErrorType(NETWORK_ERROR);
        } else {
          setErrorType(UNKNOWN_ERROR);
        }
      }
    }
  };
  
  // TTS control handlers
  const handlePlay = () => {
    if (status === ReadingStatus.Paused) {
      speechService.resume();
      setStatus(ReadingStatus.Reading);
      return;
    }
    
    speechService.speak(content, voiceSettings, (index) => {
      setCurrentPosition(index);
    });
    
    setStatus(ReadingStatus.Reading);
  };
  
  const handlePause = () => {
    speechService.pause();
    setStatus(ReadingStatus.Paused);
  };
  
  const handleStop = () => {
    speechService.stop();
    setCurrentPosition(0);
    setStatus(ReadingStatus.Ready);
  };
  
  // Skip to next paragraph
  const handleSkip = () => {
    // Find the next paragraph break from current position
    const nextBreak = content.indexOf('\n\n', currentPosition);
    
    if (nextBreak !== -1) {
      const nextContent = content.substring(nextBreak + 2);
      speechService.stop();
      
      speechService.speak(nextContent, voiceSettings, (index) => {
        setCurrentPosition(nextBreak + 2 + index);
      });
      
      setStatus(ReadingStatus.Reading);
    }
  };
  
  // Settings handlers
  const handleSettingsChange = (setting: 'volume' | 'rate' | 'pitch', value: number) => {
    setVoiceSettings((prev) => ({ ...prev, [setting]: value }));
    
    // If currently reading, apply changes immediately
    if (status === ReadingStatus.Reading) {
      speechService.stop();
      
      speechService.speak(content.substring(currentPosition), {
        ...voiceSettings,
        [setting]: value
      }, (index) => {
        setCurrentPosition(currentPosition + index);
      });
    }
  };
  
  const handleLanguageChange = (language: string) => {
    setVoiceSettings(prev => ({ ...prev, language }));
  };
  
  const handleVoiceChange = (voice: SpeechSynthesisVoice) => {
    setVoiceSettings(prev => ({ ...prev, voice }));
  };
  
  const toggleDarkMode = () => {
    setTheme(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  return (
    <div className={`min-h-screen ${theme.backgroundColor}`}>
      <Header isDarkMode={theme.isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <UrlInput onSubmit={handleUrlSubmit} isLoading={status === ReadingStatus.Loading} />
        
        <div className="content-wrapper" style={{
          padding: "48px 32px", 
          boxSizing: "border-box", 
          width: "100%", 
          maxWidth: "800px",
          margin: "0 auto"
        }}>
          <ContentDisplay 
            content={content}
            status={status}
            currentPosition={currentPosition}
            fontSize={theme.fontSize}
            errorType={errorType}
            url={url}
            onRetry={() => handleUrlSubmit(url)}
            onTryDifferentProxy={() => {
              // Update the proxy service and retry
              import('./services/proxyService').then(module => {
                module.cycleProxy();
                handleUrlSubmit(url);
              });
            }}
          />
        </div>
        
        {/* Controls Panel */}
        <div className="mb-8">
          <TTSControls 
            status={status}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            onSkip={handleSkip}
            settings={{
              volume: voiceSettings.volume,
              rate: voiceSettings.rate,
              pitch: voiceSettings.pitch
            }}
            onSettingsChange={handleSettingsChange}
          />
        </div>
        
        {/* Settings Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VoiceSettings 
            language={voiceSettings.language}
            onLanguageChange={handleLanguageChange}
            onVoiceChange={handleVoiceChange}
            currentVoice={voiceSettings.voice}
          />
          
          <AppearanceSettings 
            theme={theme}
            onThemeChange={setTheme}
          />
        </div>
      </main>
      
      <footer className="max-w-6xl mx-auto text-center py-6 text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-800 mt-4">
        <p>WebReader - A Text-to-Speech Web Content Reader</p>
        <div className="flex justify-center gap-4 mt-2">
          <button 
            onClick={() => setShowStatus(!showStatus)} 
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            {showStatus ? 'Hide Status' : 'Show System Status'}
          </button>
        </div>
        {showStatus && (
          <div className="mt-4">
            <StatusPage showInProduction={false} />
          </div>
        )}
        
        <DeploymentHelper />
      </footer>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-12">
        {/* The status page will appear here when activated */}
      </div>
    </div>
  )
}

export default App
