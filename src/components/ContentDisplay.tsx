import React, { useRef, useEffect } from 'react';
import { ReadingStatus } from '../types';

interface ContentDisplayProps {
  content: string;
  status: ReadingStatus;
  currentPosition: number;
  fontSize: string;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  content,
  status,
  currentPosition,
  fontSize,
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
  }, [activeParagraphIndex]);  // CSS styles for consistent readability 
  // Using direct inline styles instead of variables for stronger application  
  const contentParagraphStyles: React.CSSProperties = {
    maxWidth: "65ch",
    margin: "0 auto",
    lineHeight: "1.8",
    padding: "0",
    width: "100%",
    boxSizing: "border-box"
  };    return (
    <div className="content-outer-wrapper" style={{
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '48px 32px',
      boxSizing: 'border-box'
    }}>  
      <div 
        id="content-wrapper"
        className="bg-white dark:bg-gray-900 rounded-lg shadow-md mb-6 overflow-y-auto custom-scrollbar h-[calc(100vh-400px)] md:h-[calc(100vh-300px)] mx-auto content-container" 
        style={{
          padding: '48px 32px',
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: '800px',
          display: 'block'
        }}
      >{status === ReadingStatus.Loading && (
        <div className="flex items-center justify-center h-full text-container" style={{
          padding: '48px 32px',
          width: '100%',
          maxWidth: '700px',
          margin: '0 auto',
          display: 'block'
        }}>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400"></div>
          <span className="ml-4 text-gray-600 dark:text-gray-300 text-lg">Loading content...</span>
        </div>
      )}
      
      {status === ReadingStatus.Error && (
        <div className="text-center text-red-600 dark:text-red-400 py-12 text-container" style={{
          padding: '48px 32px',
          width: '100%',
          maxWidth: '700px',
          margin: '0 auto',
          display: 'block'
        }}>
          <p className="text-2xl mb-3 font-semibold content-text">Failed to extract content</p>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto content-text">
            Please check the URL and try again. The website might be blocking content extraction or require authentication.
          </p>
        </div>
      )}
      
      {isReady && content === '' && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-12 text-container" style={{
          padding: '48px 32px',
          width: '100%',
          maxWidth: '700px',
          margin: '0 auto',
          display: 'block'
        }}>
          <p className="text-lg content-text">No content found on this page.</p>
        </div>
      )}{isReady && content !== '' && (
        <div 
          ref={contentRef} 
          className="text-gray-800 dark:text-gray-100 space-y-5 mx-auto text-container"
          style={{
            width: '100%',
            maxWidth: '700px',
            margin: '0 auto',
            padding: '0',
            display: 'block'
          }}
        >
          {processedParagraphs.map((paragraph, index) => (
            <p 
              key={index} 
              className={`leading-relaxed transition-all duration-300 content-text ${paragraph.isActive ? 'highlight-text' : ''}`}
              style={{
                ...contentParagraphStyles,
                fontSize: fontSize,
                marginBottom: '1.5em'
              }}
            >
              {paragraph.text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentDisplay;