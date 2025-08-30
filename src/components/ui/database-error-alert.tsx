"use client";

import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Database,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

interface DatabaseErrorAlertProps {
  error: {
    message: string;
    details?: string;
    code?: string;
    timestamp?: string;
  };
  onRetry?: () => void;
  onDismiss?: () => void;
  showDetails?: boolean;
}

export function DatabaseErrorAlert({
  error,
  onRetry,
  onDismiss,
  showDetails = true
}: DatabaseErrorAlertProps) {
  const [showExpandedDetails, setShowExpandedDetails] = useState(false);

  const isDatabaseError = error.message?.toLowerCase().includes('database') ||
                         error.message?.toLowerCase().includes('prisma') ||
                         error.code === 'P1001' ||
                         error.details?.toLowerCase().includes('connection');

  if (!isDatabaseError) {
    return null;
  }

  const getErrorType = () => {
    if (error.message?.includes('localhost:5432')) {
      return 'Connection Refused';
    }
    if (error.message?.includes('database server')) {
      return 'Server Unavailable';
    }
    if (error.code === 'P1001') {
      return 'Connection Failed';
    }
    return 'Database Error';
  };

  const getSuggestions = () => {
    const suggestions = [];

    if (error.message?.includes('localhost:5432')) {
      suggestions.push(
        'Start PostgreSQL service: pg_ctl start',
        'Check if PostgreSQL is installed and running',
        'Verify connection string in environment variables'
      );
    }

    if (error.message?.includes('database server')) {
      suggestions.push(
        'Ensure database server is running',
        'Check network connectivity',
        'Verify database credentials'
      );
    }

    return suggestions;
  };

  return (
    <Alert variant="destructive" className="border-red-200 bg-red-50">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Database className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <AlertTitle className="text-red-800 font-semibold mb-2">
              Database Connection Error
            </AlertTitle>

            <div className="flex items-center gap-2 mb-3">
              <Badge variant="destructive" className="text-xs">
                {getErrorType()}
              </Badge>
              {error.timestamp && (
                <span className="text-xs text-red-600">
                  {new Date(error.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>

            <AlertDescription className="text-red-700 mb-4">
              <div className="font-medium mb-1">Issue:</div>
              <p className="text-sm">{error.message}</p>
            </AlertDescription>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mb-4">
              {onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-100"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry Connection
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://www.postgresql.org/docs/current/server-start.html', '_blank')}
                className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-100"
              >
                <ExternalLink className="h-4 w-4" />
                PostgreSQL Docs
              </Button>
            </div>

            {/* Troubleshooting Steps */}
            {showDetails && (
              <div className="border-t border-red-200 pt-4">
                <button
                  onClick={() => setShowExpandedDetails(!showExpandedDetails)}
                  className="flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-800 mb-2"
                >
                  {showExpandedDetails ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  Troubleshooting Steps
                </button>

                {showExpandedDetails && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-red-800">Try these solutions:</div>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-red-700 ml-4">
                      {getSuggestions().map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                      <li>Check database logs for more details</li>
                      <li>Verify DATABASE_URL environment variable</li>
                    </ol>

                    {error.details && (
                      <div className="mt-3 p-3 bg-red-100 rounded text-xs font-mono text-red-800">
                        <div className="font-medium mb-1">Technical Details:</div>
                        {error.details}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-red-600 hover:text-red-800 hover:bg-red-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
}