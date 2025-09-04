"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  X,
  RefreshCw,
  Database,
  Shield
} from 'lucide-react';
import { DataVerification } from './data-verification';

interface ProgressTrackerProps {
  batchId: string;
  onComplete: () => void;
}

interface ImportStatus {
  batchId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  errors: any[];
  estimatedTimeRemaining?: number;
  startedAt: string;
  completedAt?: string;
}

export function ProgressTracker({ batchId, onComplete }: ProgressTrackerProps) {
  const [status, setStatus] = useState<ImportStatus | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    if (!batchId) return;

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/import/status/${batchId}`);
        const result = await response.json();

        if (!result.success) {
          setError(result.error || 'Failed to fetch status');
          return;
        }

        setStatus(result);
        setError(null);

        // Stop polling if completed or failed
        if (result.status === 'COMPLETED' || result.status === 'FAILED') {
          setIsPolling(false);
          // Add a small delay to ensure database transaction is committed before verification
          if (result.status === 'COMPLETED') {
            setTimeout(() => {
              setShowVerification(true);
            }, 3000); // Wait 3 seconds before starting verification
          } else {
            setShowVerification(true);
          }
        }
      } catch (err) {
        setError('Failed to fetch import status');
        console.error('Status polling error:', err);
      }
    };

    // Initial poll
    pollStatus();

    // Set up polling interval
    const interval = setInterval(pollStatus, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [batchId, onComplete]);

  const cancelImport = async () => {
    try {
      const response = await fetch(`/api/import/${batchId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Failed to cancel import');
        return;
      }

      // Refresh status
      setStatus(prev => prev ? { ...prev, status: 'FAILED' } : null);
      setIsPolling(false);
      setShowVerification(false);
    } catch (err) {
      setError('Failed to cancel import');
      console.error('Cancel error:', err);
    }
  };

  const handleVerificationComplete = (result: any) => {
    setVerificationComplete(true);
    // Call onComplete after verification is done
    setTimeout(() => {
      onComplete();
    }, 2000); // Give user time to see verification results
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'PROCESSING':
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'secondary';
      case 'PROCESSING':
        return 'default';
      case 'COMPLETED':
        return 'default'; // Will be styled with green background
      case 'FAILED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (!status) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Loading import status...</span>
      </div>
    );
  }

  // Show verification if import is complete
  if (showVerification && !verificationComplete) {
    return (
      <div className="space-y-6">
        {/* Import Summary First */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold">Import Completed Successfully</h3>
                  <p className="text-sm text-muted-foreground">
                    Batch ID: {status?.batchId}
                  </p>
                </div>
              </div>
              <Badge variant="default">
                {status?.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              ✅ Processing complete! Now verifying database insertion...
            </p>
          </CardContent>
        </Card>

        {/* Database Verification */}
        <DataVerification
          batchId={batchId}
          onVerificationComplete={handleVerificationComplete}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(status.status)}
              <div>
                <h3 className="text-lg font-semibold">
                  {showVerification ? 'Import Completed - Verifying Database' : 'Import Progress'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Batch ID: {status.batchId}
                </p>
              </div>
            </div>
            <Badge variant={getStatusColor(status.status) as any}>
              {status.status}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{status.progress}%</span>
            </div>
            <Progress value={status.progress} className="w-full" />
          </div>

          {/* Time Information */}
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <span className="text-muted-foreground">Started:</span>
              <span className="ml-2">
                {status.startedAt ? 
                  (() => {
                    try {
                      const date = new Date(status.startedAt);
                      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleTimeString();
                    } catch {
                      return 'Invalid Date';
                    }
                  })() 
                  : 'Not started'
                }
              </span>
            </div>
            {status.estimatedTimeRemaining && status.status === 'PROCESSING' && (
              <div>
                <span className="text-muted-foreground">Est. remaining:</span>
                <span className="ml-2">
                  {formatTime(status.estimatedTimeRemaining)}
                </span>
              </div>
            )}
            {status.completedAt && (
              <div>
                <span className="text-muted-foreground">Completed:</span>
                <span className="ml-2">
                  {(() => {
                    try {
                      const date = new Date(status.completedAt);
                      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleTimeString();
                    } catch {
                      return 'Invalid Date';
                    }
                  })()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4">Import Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {status.totalRecords}
              </div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {status.successfulRecords}
              </div>
              <div className="text-sm text-muted-foreground">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {status.failedRecords}
              </div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {status.processedRecords}
              </div>
              <div className="text-sm text-muted-foreground">Processed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Errors */}
      {status.errors && status.errors.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h4 className="font-semibold text-red-600">Errors Found</h4>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {status.errors.slice(0, 10).map((error: any, index: number) => (
                <Alert key={index} variant="destructive">
                  <AlertDescription className="text-sm">
                    <strong>Row {error.rowNumber}:</strong> {error.errorMessage}
                  </AlertDescription>
                </Alert>
              ))}
              {status.errors.length > 10 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  ... and {status.errors.length - 10} more errors
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      {!showVerification && (
        <div className="flex gap-3">
          {status.status === 'PROCESSING' && (
            <Button
              variant="destructive"
              onClick={cancelImport}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel Import
            </Button>
          )}

          {status.status === 'FAILED' && (
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}

          {status.status === 'COMPLETED' && !showVerification && (
            <Button
              onClick={() => setShowVerification(true)}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Verify Database Insertion
            </Button>
          )}
        </div>
      )}
    </div>
  );
}