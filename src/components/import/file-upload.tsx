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

    console.log('🚀 Starting actual database upload for file:', selectedFile.name);
    setIsUploading(true);
    setError(null);
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      console.log('📡 Sending upload request to /api/import/upload...');
      setUploadProgress(25);

      const response = await fetch('/api/import/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('📡 Upload response status:', response.status);
      setUploadProgress(50);

      const result = await response.json();
      console.log('📡 Upload result:', result);

      if (!result.success) {
        console.error('❌ Upload failed:', result.error);
        setError({
          message: result.error || 'Upload failed',
          details: result.details || 'Unknown upload error',
          code: 'UPLOAD_ERROR',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      console.log('✅ Upload successful, batch ID:', result.batchId);
      setUploadProgress(100);

      // Call the import start callback to switch to progress tracking
      onImportStart(result.batchId);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      console.error('❌ Upload error:', err);
      setError({
        message: errorMessage,
        details: err instanceof Error ? err.stack : undefined,
        code: 'NETWORK_ERROR',
        timestamp: new Date().toISOString(),
      });
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
        <Card className={validationResults.valid ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {validationResults.valid ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-lg font-semibold text-green-800">File is valid and ready for import</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <XCircle className="h-6 w-6 text-red-600" />
                  <span className="text-lg font-semibold text-red-800">Validation Failed</span>
                </div>
              )}
            </div>

            {validationResults.valid && (
              <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-700" />
                  <span className="font-medium text-green-800">Ready to Import</span>
                </div>
                <p className="text-sm text-green-700">
                  Your CSV file has been validated successfully. Click the "Start Import" button below to begin importing the data into the database.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="bg-white p-3 rounded border">
                <span className="text-muted-foreground block">Total Rows:</span>
                <span className="text-lg font-semibold">{validationResults.recordCount}</span>
              </div>
              <div className="bg-white p-3 rounded border">
                <span className="text-muted-foreground block">Valid Rows:</span>
                <span className="text-lg font-semibold text-green-600">
                  {validationResults.previewData?.length || 0}
                </span>
              </div>
            </div>

            {validationResults.errors?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-red-600 mb-3 font-medium">Errors found:</p>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {validationResults.errors.slice(0, 5).map((error: any, index: number) => (
                    <div key={index} className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded">
                      <strong>Row {error.rowNumber}:</strong> {error.error}
                    </div>
                  ))}
                  {validationResults.errors.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
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
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <div>
                <span className="text-lg font-semibold text-blue-800">Importing Data...</span>
                <p className="text-sm text-blue-600">Please wait while we process your CSV file</p>
              </div>
            </div>

            <div className="space-y-4">
              <Progress value={uploadProgress} className="w-full h-3" />
              <div className="flex justify-between text-sm text-blue-700">
                <span>Processing file...</span>
                <span>{uploadProgress}% complete</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Do not close this page</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                The import process is running in the background. You'll be redirected to the progress page once it starts.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-2">
                  {error.code === 'NETWORK_ERROR' ? 'Connection Error' :
                   error.code === 'VALIDATION_ERROR' ? 'Validation Error' :
                   error.code === 'UPLOAD_ERROR' ? 'Upload Error' : 'Error'}
                </h3>

                <p className="text-red-700 mb-3">{error.message}</p>

                {error.details && (
                  <details className="mb-3">
                    <summary className="text-sm text-red-600 cursor-pointer hover:text-red-800">
                      Show technical details
                    </summary>
                    <pre className="text-xs text-red-600 bg-red-100 p-2 rounded mt-2 overflow-x-auto">
                      {error.details}
                    </pre>
                  </details>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // Retry the last failed operation
                      if (selectedFile && !validationResults) {
                        validateFile();
                      } else if (validationResults?.valid) {
                        uploadFile();
                      }
                    }}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    Try Again
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setError(null)}
                    className="text-red-600 hover:bg-red-100"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        {selectedFile && !validationResults && (
          <div className="flex gap-3">
            <Button
              onClick={validateFile}
              disabled={isValidating}
              size="lg"
              className="flex-1"
            >
              {isValidating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Validating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Validate File
                </div>
              )}
            </Button>

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
        )}

        {validationResults && !isUploading && (
          <div className="space-y-3">
            {/* Show warnings if validation failed */}
            {validationResults.errors?.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Validation Issues Found</span>
                </div>
                <p className="text-sm text-yellow-700 mb-2">
                  Found {validationResults.errors.length} validation error(s). You can still proceed with the import, but some data may not be processed correctly.
                </p>
                <details className="text-sm">
                  <summary className="text-yellow-600 cursor-pointer hover:text-yellow-800">
                    View validation errors ({validationResults.errors.length})
                  </summary>
                  <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                    {validationResults.errors.slice(0, 5).map((error: any, index: number) => (
                      <div key={index} className="text-xs text-yellow-700 bg-yellow-100 p-2 rounded">
                        Row {error.rowNumber}: {error.message}
                      </div>
                    ))}
                    {validationResults.errors.length > 5 && (
                      <p className="text-xs text-yellow-600 text-center py-1">
                        ... and {validationResults.errors.length - 5} more errors
                      </p>
                    )}
                  </div>
                </details>
              </div>
            )}

            <div className="text-center">
              <Button
                onClick={async () => {
                  console.log('🔘 START IMPORT button clicked');

                  // Create confirmation message based on validation status
                  let confirmMessage = `🚀 Ready to Import ${validationResults.recordCount} rows of data?\n\nThis action will:\n• Upload CSV to database\n• Process case activities\n• Create court/judge records\n\n`;

                  if (validationResults.errors?.length > 0) {
                    confirmMessage += `⚠️ WARNING: ${validationResults.errors.length} validation error(s) found.\nSome data may not import correctly.\n\n`;
                  }

                  confirmMessage += `⚠️ This cannot be easily undone. Continue?`;

                  const confirmed = window.confirm(confirmMessage);

                  console.log('🔘 User confirmation result:', confirmed);

                  if (confirmed) {
                    console.log('🔘 Starting upload process...');
                    await uploadFile();
                  } else {
                    console.log('🔘 User cancelled upload');
                  }
                }}
                size="lg"
                disabled={isUploading}
                className={`w-full text-white font-bold py-4 px-8 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 disabled:transform-none ${
                  validationResults.errors?.length > 0
                    ? 'bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400'
                    : 'bg-green-600 hover:bg-green-700 disabled:bg-gray-400'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <Upload className="h-6 w-6" />
                  🚀 START IMPORT ({validationResults.recordCount} rows)
                  {validationResults.errors?.length > 0 ? (
                    <AlertTriangle className="h-6 w-6" />
                  ) : (
                    <CheckCircle className="h-6 w-6" />
                  )}
                </div>
              </Button>
            </div>

            <div className="flex gap-2">
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
                className="flex-1"
              >
                Choose Different File
              </Button>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="text-center">
            <Button
              disabled
              size="lg"
              className="w-full bg-blue-600 text-white font-semibold py-4 px-8 text-lg"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                IMPORTING DATA... Please wait
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}