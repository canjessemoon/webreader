import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 shadow-md">
      <div className="flex items-center">
        <h1 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
          WebReader
        </h1>
        <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
          Beta
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <FiSun className="text-yellow-500 w-5 h-5" />
          ) : (
            <FiMoon className="text-gray-700 w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
