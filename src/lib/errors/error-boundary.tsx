/**
 * React Error Boundaries for graceful error handling
 */

'use client';

import React from 'react';
import { handleAsyncError } from './api-errors';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  errorInfo?: React.ErrorInfo;
}

// Default error fallback component
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError 
}) => (
  <div className="min-h-[400px] flex items-center justify-center p-6">
    <div className="text-center max-w-md">
      <div className="text-destructive mb-4">
        <AlertTriangle className="h-12 w-12 mx-auto" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Something went wrong
      </h2>
      <p className="text-muted-foreground mb-4">
        An unexpected error occurred. Please try again.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <details className="text-left mb-4 p-3 bg-muted rounded border">
          <summary className="cursor-pointer font-medium">Error Details</summary>
          <pre className="mt-2 text-sm text-destructive overflow-auto">
            {error.message}
            {error.stack && '\n\n' + error.stack}
          </pre>
        </details>
      )}
      <Button onClick={resetError}>
        Try Again
      </Button>
    </div>
  </div>
);

// Main Error Boundary component
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error using our error handling system
    handleAsyncError(error, errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    this.setState({ errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
          errorInfo={this.state.errorInfo}
        />
      );
    }

    return this.props.children;
  }
}

// Hook for async error handling in functional components
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: any) => {
    handleAsyncError(error, errorInfo);
  }, []);
}

// Async error boundary wrapper for promises
export function withAsyncErrorBoundary<T extends any[], R>(
  asyncFn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      handleAsyncError(error instanceof Error ? error : new Error(String(error)));
      throw error; // Re-throw to maintain promise rejection
    }
  };
}

// Query error boundary specifically for React Query
interface QueryErrorBoundaryProps extends ErrorBoundaryProps {
  children: React.ReactNode;
}

export const QueryErrorBoundary: React.FC<QueryErrorBoundaryProps> = ({ 
  children, 
  ...props 
}) => {
  const onError = React.useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    // Additional logging for query errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      handleAsyncError(error, { ...errorInfo, type: 'network' });
    } else {
      handleAsyncError(error, errorInfo);
    }
    
    props.onError?.(error, errorInfo);
  }, [props]);

  return (
    <ErrorBoundary {...props} onError={onError}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;