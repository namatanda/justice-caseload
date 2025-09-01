"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { DatabaseErrorAlert } from '@/components/ui/database-error-alert';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface FileUploadProps {
  onImportStart: (batchId: string) => void;
  onValidationComplete: (results: any) => void;
}

export function FileUpload({ onImportStart, onValidationComplete }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<{
    message: string;
    details?: string;
    code?: string;
    timestamp: string;
  } | null>(null);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [validationStartTime, setValidationStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timer effect for validation
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isValidating && validationStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - validationStartTime);
      }, 100); // Update every 100ms for smooth display
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isValidating, validationStartTime]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setValidationResults(null);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setValidationResults(null);
    }
  };

  const validateFile = async () => {
    if (!selectedFile) return;

    console.log('🔍 DEBUG: Starting file validation for:', selectedFile.name);
    setIsValidating(true);
    setValidationStartTime(Date.now());
    setElapsedTime(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      console.log('🔍 DEBUG: Sending validation request...');
      const response = await fetch('/api/validate/csv', {
        method: 'POST',
        body: formData,
      });

      console.log('🔍 DEBUG: Validation response status:', response.status);
      const result = await response.json();
      console.log('🔍 DEBUG: Validation result:', result);

      if (!result.success) {
        // Create a more user-friendly error message
        const errorMessages = result.errors?.map((err: any) =>
          `${err.message}${err.suggestion ? ` (${err.suggestion})` : ''}`
        ).join('\n') || result.error || 'Validation failed';

        console.log('🔍 DEBUG: Validation failed with errors:', errorMessages);
        setError({
          message: errorMessages,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      console.log('🔍 DEBUG: Validation successful, setting results');
      setValidationResults(result);
      onValidationComplete(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to validate file';
      console.error('❌ DEBUG: Validation error:', err);
      setError({
        message: errorMessage,
        details: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
      });
    } finally {
      console.log('🔍 DEBUG: Validation process completed');
      setIsValidating(false);
      setValidationStartTime(null);
      setElapsedTime(0);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/import/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Upload failed');
        return;
      }

      setUploadProgress(100);
      onImportStart(result.batchId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError({
        message: errorMessage,
        details: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatElapsedTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const ms = Math.floor((milliseconds % 1000) / 100);
    return `${seconds}.${ms}s`;
  };

  return (
    <div className="space-y-6">
      {/* File Selection Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Drop your CSV file here</h3>
            <p className="text-muted-foreground mb-4">
              or click to browse files (max 10MB)
            </p>
            <Button variant="outline">
              Choose File
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Selected File Info */}
      {selectedFile && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Badge variant="secondary">CSV</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {validationResults && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              {validationResults.valid ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">
                {validationResults.valid ? 'Validation Passed' : 'Validation Failed'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Rows:</span>
                <span className="ml-2 font-medium">{validationResults.recordCount}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Valid Rows:</span>
                <span className="ml-2 font-medium text-green-600">
                  {validationResults.previewData?.length || 0}
                </span>
              </div>
            </div>

            {validationResults.errors?.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-red-600 mb-2">Errors found:</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {validationResults.errors.slice(0, 5).map((error: any, index: number) => (
                    <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      Row {error.rowNumber}: {error.error}
                    </div>
                  ))}
                  {validationResults.errors.length > 5 && (
                    <p className="text-xs text-muted-foreground">
                      ... and {validationResults.errors.length - 5} more errors
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Validation Progress */}
      {isValidating && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="font-medium">Validating file...</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>⏱️</span>
                <span>{formatElapsedTime(elapsedTime)}</span>
              </div>
            </div>
            <Progress value={50} className="w-full" />
            <div className="mt-2 text-xs text-muted-foreground text-center">
              Analyzing file structure and content...
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="font-medium">Uploading file...</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </CardContent>
        </Card>
      )}

      {/* Database Error Alert */}
      {error && (
        <DatabaseErrorAlert
          error={error}
          onRetry={() => {
            // Retry the last failed operation
            if (selectedFile && !validationResults) {
              validateFile();
            } else if (validationResults?.valid) {
              uploadFile();
            }
          }}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {selectedFile && !validationResults && (
          <Button
            onClick={validateFile}
            disabled={isValidating}
            variant="outline"
          >
            {isValidating ? 'Validating...' : 'Validate File'}
          </Button>
        )}

        {validationResults?.valid && (
          <Button
            onClick={uploadFile}
            disabled={isUploading}
            className="flex-1"
          >
            {isUploading ? 'Uploading...' : 'Start Import'}
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => {
            setSelectedFile(null);
            setValidationResults(null);
            setError(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}