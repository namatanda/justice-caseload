"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Database,
  RefreshCw,
  Shield,
  FileText,
  Users,
  Gavel,
  Clock
} from 'lucide-react';

interface DataVerificationProps {
  batchId: string;
  onVerificationComplete?: (result: VerificationResult) => void;
}

interface VerificationResult {
  success: boolean;
  verified: boolean;
  verificationTime: string;
  batchInfo: {
    batchId: string;
    expectedRecords: number;
    actualRecords: number;
    status: string;
    completedAt: string;
  };
  databaseStats: {
    casesInserted: number;
    activitiesInserted: number;
    judgeAssignmentsCreated: number;
    totalRecordsProcessed: number;
  };
  integrityChecks: {
    foreignKeysValid: boolean;
    dataConsistency: boolean;
    duplicatesFound: number;
    orphanedRecords: number;
    passed: boolean;
  };
  summary: {
    message: string;
    status: string;
  };
}

export function DataVerification({ batchId, onVerificationComplete }: DataVerificationProps) {
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const verifyData = async () => {
    try {
      setIsVerifying(true);
      setError(null);

      const response = await fetch(`/api/import/verify/${batchId}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Verification failed');
      }

      setVerificationResult(result);
      onVerificationComplete?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    verifyData();
  };

  useEffect(() => {
    if (batchId) {
      verifyData();
    }
  }, [batchId]);

  if (isVerifying) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <Database className="h-12 w-12 text-primary animate-pulse" />
              <RefreshCw className="h-6 w-6 text-primary animate-spin absolute -top-1 -right-1" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Verifying Database Insertion</h3>
              <p className="text-muted-foreground mb-4">
                Checking that all data was successfully inserted into the database...
              </p>
              <Progress value={75} className="w-full max-w-xs" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Verification failed: {error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="ml-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry ({retryCount}/3)
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!verificationResult) {
    return null;
  }

  const { verified, databaseStats, integrityChecks, summary, batchInfo } = verificationResult;

  return (
    <div className="space-y-6">
      {/* Verification Status Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {verified ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
              <div>
                <h3 className="text-xl font-semibold">
                  {verified ? 'Database Verification Successful' : 'Verification Found Issues'}
                </h3>
                <p className="text-muted-foreground">
                  {summary.message}
                </p>
              </div>
            </div>
            <Badge variant={verified ? "default" : "destructive"}>
              {summary.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>Expected: {batchInfo.expectedRecords}</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-green-600" />
              <span>Inserted: {batchInfo.actualRecords}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Completed: {new Date(batchInfo.completedAt).toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <span>Integrity: {integrityChecks.passed ? 'Passed' : 'Failed'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Insertion Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {databaseStats.casesInserted}
              </div>
              <div className="text-sm text-muted-foreground">Cases Inserted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {databaseStats.activitiesInserted}
              </div>
              <div className="text-sm text-muted-foreground">Activities Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {databaseStats.judgeAssignmentsCreated}
              </div>
              <div className="text-sm text-muted-foreground">Judge Assignments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {databaseStats.totalRecordsProcessed}
              </div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrity Checks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Integrity Checks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                {integrityChecks.foreignKeysValid ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span>Foreign Key Integrity</span>
              </div>
              <Badge variant={integrityChecks.foreignKeysValid ? "default" : "destructive"}>
                {integrityChecks.foreignKeysValid ? 'Valid' : 'Invalid'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                {integrityChecks.dataConsistency ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span>Data Consistency</span>
              </div>
              <Badge variant={integrityChecks.dataConsistency ? "default" : "destructive"}>
                {integrityChecks.dataConsistency ? 'Consistent' : 'Inconsistent'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                {integrityChecks.duplicatesFound === 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
                <span>Duplicate Records</span>
              </div>
              <Badge variant={integrityChecks.duplicatesFound === 0 ? "default" : "secondary"}>
                {integrityChecks.duplicatesFound === 0 ? 'None' : `${integrityChecks.duplicatesFound} found`}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                {integrityChecks.orphanedRecords === 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span>Orphaned Records</span>
              </div>
              <Badge variant={integrityChecks.orphanedRecords === 0 ? "default" : "destructive"}>
                {integrityChecks.orphanedRecords === 0 ? 'None' : `${integrityChecks.orphanedRecords} found`}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      {verified && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h4 className="text-lg font-semibold text-green-800">
                ✅ Data Successfully Inserted into Database
              </h4>
            </div>
            <p className="text-green-700 mb-4">
              All {batchInfo.expectedRecords} records from your CSV file have been successfully inserted into the database.
              The data is now available for querying and reporting.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                View Imported Data
              </Button>
              <Button variant="outline" size="sm">
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues Found */}
      {!verified && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              <h4 className="text-lg font-semibold text-yellow-800">
                ⚠️ Verification Found Issues
              </h4>
            </div>
            <p className="text-yellow-700 mb-4">
              Some data may not have been inserted correctly. Expected {batchInfo.expectedRecords} records,
              but found {batchInfo.actualRecords} in the database.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Verification
              </Button>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}