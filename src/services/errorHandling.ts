// Error handling utility for WebReader content extraction
// This provides enhanced error handling, logging, and diagnostics

/**
 * Standardized error types for content extraction
 */
export enum ContentExtractionErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  PROXY_ERROR = 'PROXY_ERROR',
  PARSING_ERROR = 'PARSING_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  EMPTY_CONTENT = 'EMPTY_CONTENT',
  CORS_ERROR = 'CORS_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Extended error class with additional context for content extraction errors
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
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ContentExtractionError);
    }
  }
  
  /**
   * Returns a user-friendly error message
   */
  getUserMessage(): string {
    switch (this.type) {
      case ContentExtractionErrorType.NETWORK_ERROR:
        return 'Unable to connect to the website. Please check your internet connection or try again later.';
      
      case ContentExtractionErrorType.PROXY_ERROR:
        return 'The content access service is currently unavailable. Please try again later.';
      
      case ContentExtractionErrorType.PARSING_ERROR:
        return 'Unable to process the website content. The site may have an unsupported format.';
      
      case ContentExtractionErrorType.TIMEOUT_ERROR:
        return 'The request timed out. The website might be slow or unavailable.';
      
      case ContentExtractionErrorType.EMPTY_CONTENT:
        return 'No readable content found on this page. The site may have restricted content extraction.';
      
      case ContentExtractionErrorType.CORS_ERROR:
        return 'Access to the content was blocked. Please try a different website.';
      
      default:
        return 'An unexpected error occurred while extracting content. Please try again later.';
    }
  }
  
  /**
   * Returns diagnostic information for debugging
   */
  getDiagnostics(): Record<string, unknown> {
    return {
      type: this.type,
      url: this.url,
      proxy: this.proxy,
      statusCode: this.statusCode,
      message: this.message,
      stack: this.stack
    };
  }
  
  /**
   * Logs error details to console with formatted output
   */
  logError(): void {
    console.error(
      `[ContentExtractionError] ${this.type}: ${this.message}\n`,
      `URL: ${this.url}\n`,
      `Proxy: ${this.proxy || 'None'}\n`,
      `Status: ${this.statusCode || 'N/A'}\n`,
      this.stack
    );
  }
}

/**
 * Helper function to identify and create appropriate error types
 */
export function createContentError(
  error: unknown, 
  url: string,
  proxy?: string
): ContentExtractionError {
  // Handle axios errors
  if (error && typeof error === 'object' && 'isAxiosError' in error && error.isAxiosError) {
    const axiosError = error as any;
    
    // Network error (no response)
    if (!axiosError.response) {
      return new ContentExtractionError(
        axiosError.message || 'Network error',
        ContentExtractionErrorType.NETWORK_ERROR,
        url,
        { proxy }
      );
    }
    
    // Response with error status code
    const statusCode = axiosError.response.status;
    
    // Handle different HTTP error codes
    if (statusCode === 403 || statusCode === 401) {
      return new ContentExtractionError(
        `Access denied (${statusCode})`,
        ContentExtractionErrorType.CORS_ERROR,
        url,
        { 
          proxy,
          statusCode,
          responseData: axiosError.response.data
        }
      );
    }
    
    if (statusCode === 404) {
      return new ContentExtractionError(
        'Page not found (404)',
        ContentExtractionErrorType.NETWORK_ERROR,
        url,
        { 
          proxy,
          statusCode 
        }
      );
    }
    
    if (statusCode === 429) {
      return new ContentExtractionError(
        'Too many requests (429)',
        ContentExtractionErrorType.PROXY_ERROR,
        url,
        { 
          proxy,
          statusCode 
        }
      );
    }
    
    // Generic HTTP error
    return new ContentExtractionError(
      `HTTP error: ${statusCode}`,
      ContentExtractionErrorType.NETWORK_ERROR,
      url,
      { 
        proxy,
        statusCode,
        responseData: axiosError.response.data 
      }
    );
  }
  
  // Handle timeout errors
  if (error && typeof error === 'object' && 'code' in error && error.code === 'ECONNABORTED') {
    return new ContentExtractionError(
      'Request timed out',
      ContentExtractionErrorType.TIMEOUT_ERROR,
      url,
      { proxy }
    );
  }
  
  // Handle generic errors
  let message = 'Unknown error';
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }
  
  return new ContentExtractionError(
    message,
    ContentExtractionErrorType.UNKNOWN_ERROR,
    url,
    { proxy }
  );
}
