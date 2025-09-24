/**
 * Dashboard Error Boundary Component
 * 
 * Handles errors specifically in dashboard components
 */

'use client';

import React from 'react';
import { ErrorBoundary } from '@/lib/errors/error-boundary';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface DashboardErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

function DashboardErrorFallback({ error, resetError }: DashboardErrorFallbackProps) {
  const isDashboardError = error.message.includes('dashboard') || 
                          error.message.includes('analytics') ||
                          error.message.includes('fetch');

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center max-w-lg">
        <div className="text-destructive mb-4">
          <AlertTriangle className="h-16 w-16 mx-auto" />
        </div>
        
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {isDashboardError ? 'Dashboard Data Error' : 'Something went wrong'}
        </h2>
        
        <p className="text-muted-foreground mb-4">
          {isDashboardError 
            ? 'Unable to load dashboard data. This might be a temporary issue with the analytics service.'
            : 'An unexpected error occurred while loading the dashboard.'
          }
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left mb-6 p-4 bg-muted rounded border">
            <summary className="cursor-pointer font-medium text-sm">Technical Details</summary>
            <pre className="mt-2 text-xs text-destructive overflow-auto whitespace-pre-wrap">
              {error.message}
              {error.stack && '\n\n' + error.stack}
            </pre>
          </details>
        )}
        
        <div className="flex gap-2 justify-center">
          <Button onClick={resetError} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            Reload Page
          </Button>
        </div>
        
        {isDashboardError && (
          <p className="text-xs text-muted-foreground mt-4">
            If this problem persists, please contact system administrators.
          </p>
        )}
      </div>
    </div>
  );
}

interface DashboardErrorBoundaryProps {
  children: React.ReactNode;
}

export function DashboardErrorBoundary({ children }: DashboardErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={DashboardErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}