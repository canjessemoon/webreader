import React from 'react';
import { FiPlay, FiPause, FiSquare, FiSkipForward, FiVolume2 } from 'react-icons/fi';
import { ReadingStatus } from '../types';

interface TTSControlsProps {
  status: ReadingStatus;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSkip: () => void;
  settings: {
    volume: number;
    rate: number; 
    pitch: number;
  };
  onSettingsChange: (setting: 'volume' | 'rate' | 'pitch', value: number) => void;
}

// Basic slider control for volume, rate and pitch
const BasicSlider: React.FC<{
  label: string | React.ReactNode;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  valueLabel?: string;
  leftLabel?: string;
  rightLabel?: string;
}> = ({ label, min, max, step, value, onChange, valueLabel, leftLabel, rightLabel }) => {
  return (
    <div className="mb-6">
      {/* Label row */}
      <div className="flex justify-between mb-2">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </div>
        {valueLabel && (
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {valueLabel}
          </span>
        )}
      </div>
      
      {/* Visible fixed slider */}
      <div 
        className="slider-container" 
        style={{ 
          height: '40px', 
          position: 'relative',
          marginBottom: '8px'
        }}
      >
        {/* Track */}
        <div 
          className="slider-track" 
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '100%',
            height: '8px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px'
          }}
        ></div>
        
        {/* Fill */}
        <div 
          className="slider-fill" 
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: 0,
            width: `${((value - min) / (max - min)) * 100}%`,
            height: '8px',
            backgroundColor: '#3b82f6',
            borderRadius: '4px 0 0 4px'
          }}
        ></div>
        
        {/* Knob */}
        <div 
          className="slider-knob" 
          style={{
            position: 'absolute',
            top: '50%',
            left: `${((value - min) / (max - min)) * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: '24px',
            height: '24px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            border: '3px solid white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div 
            style={{
              width: '2px',
              height: '12px',
              backgroundColor: 'white',
              margin: '0 auto'
            }}
          ></div>
        </div>
        
        {/* Invisible functional slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.001, /* Almost invisible but still interactive */
            margin: 0,
            cursor: 'pointer'
          }}
        />
      </div>
      
      {/* Optional labels */}
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between">
          {leftLabel && <span className="text-xs text-gray-500">{leftLabel}</span>}
          {rightLabel && <span className="text-xs text-gray-500">{rightLabel}</span>}
        </div>
      )}
    </div>
  );
};

const TTSControls: React.FC<TTSControlsProps> = ({
  status,
  onPlay,
  onPause,
  onStop,
  onSkip,
  settings,
  onSettingsChange,
}) => {
  const isPlaying = status === ReadingStatus.Reading;
  const isPaused = status === ReadingStatus.Paused;
  const isReady = status === ReadingStatus.Ready || status === ReadingStatus.Paused || status === ReadingStatus.Reading;
  
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Reading Controls</h2>
      
      {/* Main controls in a nice row */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={!isReady}
          className={`p-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            isReady
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <FiPause size={28} /> : <FiPlay size={28} />}
        </button>
        
        <button
          onClick={onStop}
          disabled={!(isPlaying || isPaused)}
          className={`p-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            isPlaying || isPaused
              ? 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-1'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Stop"
        >
          <FiSquare size={28} />
        </button>
        
        <button
          onClick={onSkip}
          disabled={!isPlaying}
          className={`p-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            isPlaying
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Skip paragraph"
        >
          <FiSkipForward size={28} />
        </button>
      </div>
      
      {/* Sliders with basic implementation */}
      <div className="space-y-6 max-w-lg mx-auto">
        <BasicSlider
          min={0}
          max={1}
          step={0.1}
          value={settings.volume}
          onChange={(value) => onSettingsChange('volume', value)}
          label={<div className="flex items-center"><FiVolume2 size={18} className="mr-2" />Volume</div>}
          valueLabel={`${Math.round(settings.volume * 10)}/10`}
        />
        
        <BasicSlider
          min={0.5}
          max={2}
          step={0.1}
          value={settings.rate}
          onChange={(value) => onSettingsChange('rate', value)}
          label="Reading Speed"
          valueLabel={`${settings.rate.toFixed(1)}x`}
          leftLabel="Slower"
          rightLabel="Faster"
        />
        
        <BasicSlider
          min={0.5}
          max={2}
          step={0.1}
          value={settings.pitch}
          onChange={(value) => onSettingsChange('pitch', value)}
          label="Voice Pitch"
          valueLabel={`${settings.pitch.toFixed(1)}`}
          leftLabel="Lower"
          rightLabel="Higher"
        />
      </div>
    </div>
  );
};

export default TTSControls;
