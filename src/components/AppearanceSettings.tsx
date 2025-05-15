import React from 'react';
import type { Theme } from '../types';

interface AppearanceSettingsProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ theme, onThemeChange }) => {
  // Font size options
  const fontSizes = [
    { value: 'text-sm', label: 'Small' },
    { value: 'text-base', label: 'Medium' },
    { value: 'text-lg', label: 'Large' },
    { value: 'text-xl', label: 'Extra Large' },
  ];  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Appearance Settings</h3>
      
      {/* Font Size */}
      <div>
        <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          Font Size
        </label>
        <div className="flex flex-wrap gap-3">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => onThemeChange({ ...theme, fontSize: size.value })}
              className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                theme.fontSize === size.value
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* A short helpful note */}
      <p className="mt-5 text-xs text-gray-500 dark:text-gray-400 italic">
        These settings help customize your reading experience. You can also toggle dark mode from the button in the top-right corner.
      </p>
    </div>
  );
};

export default AppearanceSettings;
