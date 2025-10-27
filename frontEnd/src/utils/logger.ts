// Logger utility for frontend
const logError = (error: Error | string, context?: any) => {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorDetails = {
    timestamp: new Date().toISOString(),
    message: errorMessage,
    context: context || {},
    stack: error instanceof Error ? error.stack : undefined,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', errorDetails);
  }

  // Send to CloudWatch in production
  if (process.env.NODE_ENV === 'production') {
    console.error('Production Error:', errorDetails);
  }
};

const logInfo = (message: string, data?: any) => {
  const logDetails = {
    timestamp: new Date().toISOString(),
    message,
    data,
    url: window.location.href,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Info:', logDetails);
  }

  // Send to CloudWatch in production
  if (process.env.NODE_ENV === 'production') {
    console.log('Production Info:', logDetails);
  }
};

export const logger = {
  error: logError,
  info: logInfo,
};
