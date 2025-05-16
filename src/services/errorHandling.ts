// Error handling utility for WebReader content extraction
// This provides enhanced error handling, logging, and diagnostics

/**
 * Error type constants
 */
export const NETWORK_ERROR = 'NETWORK_ERROR';
export const PROXY_ERROR = 'PROXY_ERROR';
export const PARSING_ERROR = 'PARSING_ERROR';
export const TIMEOUT_ERROR = 'TIMEOUT_ERROR';
export const EMPTY_CONTENT = 'EMPTY_CONTENT';
export const CORS_ERROR = 'CORS_ERROR';
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR';

/**
 * Type for content extraction errors
 */
export type ContentExtractionErrorType = string;

/**
 * Extended error class for content extraction errors
 */
export class ContentExtractionError extends Error {
  type: ContentExtractionErrorType;
  url: string;
  proxy?: string;
  statusCode?: number;
  responseData?: string;
  
  constructor(
    message: string, 
    type: ContentExtractionErrorType, 
    url: string,
    details?: {
      proxy?: string;
      statusCode?: number;
      responseData?: string;
    }
  ) {
    super(message);
    this.name = 'ContentExtractionError';
    this.type = type;
    this.url = url;
    
    if (details) {
      this.proxy = details.proxy;
      this.statusCode = details.statusCode;
      this.responseData = details.responseData;
    }
  }
  
  /**
   * Returns a user-friendly error message
   */
  getUserMessage(): string {
    switch (this.type) {
      case NETWORK_ERROR:
        return 'Unable to connect to the website. Please check your internet connection or try again later.';
      
      case PROXY_ERROR:
        return 'The content access service is currently unavailable. Please try again later.';
      
      case PARSING_ERROR:
        return 'Unable to process the website content. The site may have an unsupported format.';
      
      case TIMEOUT_ERROR:
        return 'The request timed out. The website might be slow or unavailable.';
      
      case EMPTY_CONTENT:
        return 'No readable content found on this page. The site may have restricted content extraction.';
      
      case CORS_ERROR:
        return 'Access to the content was blocked. Please try a different website.';
      
      default:
        return 'An unexpected error occurred while extracting content. Please try again later.';
    }
  }
}

/**
 * Create error helpers
 */
export function createNetworkError(url: string, message = 'Network error', details?: any): ContentExtractionError {
  return new ContentExtractionError(message, NETWORK_ERROR, url, details);
}

export function createProxyError(url: string, message = 'Proxy service error', details?: any): ContentExtractionError {
  return new ContentExtractionError(message, PROXY_ERROR, url, details);
}

export function createParsingError(url: string, message = 'Failed to parse content'): ContentExtractionError {
  return new ContentExtractionError(message, PARSING_ERROR, url);
}

export function createTimeoutError(url: string): ContentExtractionError {
  return new ContentExtractionError('Request timed out', TIMEOUT_ERROR, url);
}

export function createEmptyContentError(url: string): ContentExtractionError {
  return new ContentExtractionError('No content found', EMPTY_CONTENT, url);
}

export function createCorsError(url: string, statusCode?: number): ContentExtractionError {
  return new ContentExtractionError('Access blocked', CORS_ERROR, url, { statusCode });
}

export function createUnknownError(url: string, message = 'Unknown error'): ContentExtractionError {
  return new ContentExtractionError(message, UNKNOWN_ERROR, url);
}
