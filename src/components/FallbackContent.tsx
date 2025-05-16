import React from 'react';
import { ContentExtractionErrorType } from '../services/errorHandling';

interface FallbackContentProps {
  errorType?: ContentExtractionErrorType;
  url?: string;
  onRetry?: () => void;
  onTryDifferentProxy?: () => void;
}

const FallbackContent: React.FC<FallbackContentProps> = ({
  errorType = ContentExtractionErrorType.UNKNOWN_ERROR,
  url = '',
  onRetry,
  onTryDifferentProxy
}) => {
  // Get specific error message based on error type
  const getErrorMessage = () => {
    switch (errorType) {
      case ContentExtractionErrorType.NETWORK_ERROR:
        return 'Unable to connect to the website. The site might be down or your internet connection may be experiencing issues.';
      
      case ContentExtractionErrorType.PROXY_ERROR:
        return 'The content access service (CORS proxy) is currently unavailable. You can try a different proxy service.';
      
      case ContentExtractionErrorType.PARSING_ERROR:
        return 'Unable to process the website content. This site may have an unsupported format or complex structure.';
      
      case ContentExtractionErrorType.TIMEOUT_ERROR:
        return 'The request timed out. The website might be slow or experiencing high traffic.';
      
      case ContentExtractionErrorType.EMPTY_CONTENT:
        return 'No readable content was found on this page. The site may have restricted content extraction or uses a format we cannot process.';
      
      case ContentExtractionErrorType.CORS_ERROR:
        return 'Access to the content was blocked by CORS policies. This is often due to website security restrictions.';
      
      default:
        return 'An unexpected error occurred while extracting content. Please try again or try a different website.';
    }
  };
  
  // Get recommendations based on error type
  const getRecommendations = () => {
    const recommendations = [
      'Try loading the page again by clicking "Retry"',
      'Try a different proxy service by clicking "Try Different Proxy"',
      'Copy the text manually from the website and paste it into a text file'
    ];
    
    if (errorType === ContentExtractionErrorType.EMPTY_CONTENT) {
      recommendations.push('Try a more specific page URL rather than the homepage');
      recommendations.push('Check if the content requires JavaScript to load (we cannot extract dynamic content)');
    }
    
    if (errorType === ContentExtractionErrorType.CORS_ERROR) {
      recommendations.push('This website may specifically block content extraction tools');
    }
    
    return recommendations;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <svg 
          className="mx-auto h-12 w-12 text-yellow-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <h2 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Content Extraction Failed</h2>
      </div>
      
      <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-4">
        <p>{getErrorMessage()}</p>
        
        {url && (
          <p>
            <strong className="font-medium">URL attempted:</strong>{' '}
            <span className="break-all">{url}</span>
          </p>
        )}
        
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mt-4 mb-2">Recommendations:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {getRecommendations().map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry
          </button>
        )}
        
        {onTryDifferentProxy && (
          <button
            type="button"
            onClick={onTryDifferentProxy}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-blue-300 dark:hover:bg-gray-600"
          >
            <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Try Different Proxy
          </button>
        )}
      </div>
      
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>
          Some websites actively prevent content extraction or require JavaScript to render content.
          In these cases, you may need to manually copy the text from the original website.
        </p>
      </div>
    </div>
  );
};

export default FallbackContent;
