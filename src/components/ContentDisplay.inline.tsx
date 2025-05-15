import React, { useRef, useEffect } from 'react';
import { ReadingStatus } from '../types';

// This is an alternative implementation of ContentDisplay with 100% inline styles
// to avoid any potential CSS conflicts

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
  }, [activeParagraphIndex]);

  return (
    <div 
      id="content-container"
      style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        marginBottom: '1.5rem',
        overflowY: 'auto',
        height: 'calc(100vh - 400px)',
        maxWidth: '800px',
        width: '100%',
        boxSizing: 'border-box',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '48px 32px',
        display: 'block'
      }}
      className="content-container"
    >
      {status === ReadingStatus.Loading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}>
          <div style={{
            animation: 'spin 1s linear infinite',
            height: '3rem',
            width: '3rem',
            borderRadius: '50%',
            borderWidth: '4px',
            borderStyle: 'solid',
            borderColor: '#e5e7eb',
            borderTopColor: '#3b82f6'
          }}></div>
          <span style={{
            marginLeft: '1rem',
            color: '#4b5563',
            fontSize: '1.125rem'
          }}>Loading content...</span>
        </div>
      )}
      
      {status === ReadingStatus.Error && (
        <div style={{
          textAlign: 'center',
          color: '#dc2626',
          paddingTop: '3rem',
          paddingBottom: '3rem'
        }}>
          <p style={{
            fontSize: '1.5rem',
            marginBottom: '0.75rem',
            fontWeight: '600'
          }}>Failed to extract content</p>
          <p style={{
            color: '#4b5563',
            maxWidth: '32rem',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Please check the URL and try again. The website might be blocking content extraction or require authentication.
          </p>
        </div>
      )}
      
      {isReady && content === '' && (
        <div style={{
          textAlign: 'center',
          color: '#6b7280',
          paddingTop: '3rem',
          paddingBottom: '3rem'
        }}>
          <p style={{fontSize: '1.125rem'}}>No content found on this page.</p>
        </div>
      )}
      
      {isReady && content !== '' && (
        <div 
          ref={contentRef}
          style={{
            color: '#1f2937',
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
              style={{
                lineHeight: '1.8',
                transition: 'all 300ms',
                fontSize: fontSize,
                maxWidth: '65ch',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: '1.5em',
                padding: '0',
                width: '100%',
                boxSizing: 'border-box',
                ...(paragraph.isActive ? {
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderLeft: '4px solid #3b82f6',
                  paddingLeft: '1rem',
                  marginLeft: '-1.25rem'
                } : {})
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
