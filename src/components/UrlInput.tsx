import React, { useState } from 'react';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple URL validation
    if (!url) return;
    
    // Add protocol prefix if missing
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    onSubmit(formattedUrl);
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto p-4">
      <div className="flex w-full">
        <input
          type="text"
          placeholder="Enter a website URL (e.g. example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow p-3 border border-gray-300 dark:border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          disabled={isLoading}
          aria-label="Website URL"
          autoFocus
        />        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 bg-gradient-to-b from-blue-500 to-blue-700 text-white rounded-r-lg hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg font-medium ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          aria-label="Extract content"
          style={{ minWidth: '170px', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
        >
          {isLoading ? (
            <div className="w-6 h-6 mx-auto border-3 border-gray-300 border-t-white rounded-full animate-spin"></div>
          ) : (
            "Please Read This Site"
          )}
        </button>
      </div>
    </form>
  );
};

export default UrlInput;
