import React, { useRef, useEffect } from 'react';
import { ReadingStatus } from '../types';
import FallbackContent from './FallbackContent';
import { ContentExtractionErrorType } from '../services/errorHandling';

interface ContentDisplayProps {
  content: string;
  status: ReadingStatus;
  currentPosition: number;
  fontSize: string;
  errorType?: ContentExtractionErrorType;
  url?: string;
  onRetry?: () => void;
  onTryDifferentProxy?: () => void;
}

/**
 * Content Display component with multiple wrapper layers to ensure proper padding
 * This component displays the extracted content with different states
 */
const ContentDisplay: React.FC<ContentDisplayProps> = ({
  content,
  status,
  currentPosition,
  fontSize,
  errorType,
  url,
  onRetry,
  onTryDifferentProxy
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isReady = status !== ReadingStatus.Idle && status !== ReadingStatus.Loading && status !== ReadingStatus.Error;
  
  // Split content into paragraphs for better highlighting
  const paragraphs = content.split('\n\n').filter(para => para.trim() !== '');
  
  // Find which paragraph contains the current position
  let charCount = 0;
  let activeParagraphIndex = -1;
  
  const processedParagraphs = paragraphs.map((paragraph, index) => {
    const start = charCount;
    charCount += paragraph.length + 2; // +2 for the '\n\n'
    const end = charCount;
    
    if (currentPosition >= start && currentPosition < end && activeParagraphIndex === -1) {
      activeParagraphIndex = index;
    }
    
    return {
      text: paragraph,
      start,
      end,
      isActive: false
    };
  });
  
  // Mark the active paragraph
  if (activeParagraphIndex !== -1) {
    processedParagraphs[activeParagraphIndex].isActive = true;
  }
  
  // Scroll to the active paragraph when it changes
  useEffect(() => {
    if (contentRef.current && activeParagraphIndex !== -1) {
      const activeParagraphElement = contentRef.current.children[activeParagraphIndex];
      if (activeParagraphElement) {
        activeParagraphElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [activeParagraphIndex]);
  
  // CSS styles for consistent readability
  const contentParagraphStyles: React.CSSProperties = {
    maxWidth: "65ch",
    margin: "0 auto",
    lineHeight: "1.8",
    padding: "0",
    width: "100%",
    boxSizing: "border-box",
    fontSize
  };
  
  // Outer wrapper styles - ensures consistent padding
  const outerWrapperStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '48px 32px',
    boxSizing: 'border-box',
    display: 'block'
  };
  
  // Container styles - applies to all state variations
  const containerStyles: React.CSSProperties = {
    padding: '48px 32px',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    display: 'block',
    backgroundColor: 'white'
  };
  
  // Content wrapper styles - consistent margin/padding for state containers
  const contentWrapperStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '700px',
    margin: '0 auto',
    padding: '0',
    display: 'block'
  };
  
  return (
    <div className="content-outer-wrapper" style={outerWrapperStyles}>      <div 
        id="content-wrapper"
        className="bg-white dark:bg-gray-900 rounded-lg shadow-md mb-6 overflow-y-auto custom-scrollbar h-[calc(100vh-450px)] md:h-[calc(100vh-350px)] mx-auto content-container" 
        style={containerStyles}
      >
        {status === ReadingStatus.Loading && (
          <div className="flex items-center justify-center h-full text-container" style={contentWrapperStyles}>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400"></div>
            <span className="ml-4 text-gray-600 dark:text-gray-300 text-lg">Loading content...</span>
          </div>
        )}
          {status === ReadingStatus.Error && (
          <div className="text-container" style={contentWrapperStyles}>
            <FallbackContent 
              errorType={errorType || ContentExtractionErrorType.UNKNOWN_ERROR}
              url={url}
              onRetry={onRetry}
              onTryDifferentProxy={onTryDifferentProxy}
            />
          </div>
        )}
        
        {isReady && content === '' && (
          <div className="text-container" style={contentWrapperStyles}>
            <FallbackContent 
              errorType={ContentExtractionErrorType.EMPTY_CONTENT}
              url={url}
              onRetry={onRetry}
              onTryDifferentProxy={onTryDifferentProxy}
            />
          </div>
        )}
        
        {isReady && content !== '' && (
          <div 
            ref={contentRef} 
            className="text-gray-800 dark:text-gray-100 space-y-5 mx-auto text-container"
            style={contentWrapperStyles}
          >
            {processedParagraphs.map((paragraph, index) => (
              <p 
                key={index} 
                className={`leading-relaxed transition-all duration-300 content-text ${paragraph.isActive ? 'highlight-text' : ''}`}
                style={{
                  ...contentParagraphStyles,
                  marginBottom: '1.5em'
                }}
              >
                {paragraph.text}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDisplay;