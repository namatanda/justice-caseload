"use client";
import logger from '@/lib/logger';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { DatabaseErrorAlert } from '@/components/ui/database-error-alert';
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface FileUploadProps {
  onImportStart: (batchId: string) => void;
  onValidationComplete: (results: any, file?: File) => void;
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
    existingBatchId?: string;
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

    logger.import.info('Starting file validation for', { filename: selectedFile.name });
    setIsValidating(true);
    setValidationStartTime(Date.now());
    setElapsedTime(0);
    setError(null);

    // Add validation timeout for large files (3 minutes)
    let validationTimeout: NodeJS.Timeout | null = null;
    
    if (isLargeFile(selectedFile)) {
      validationTimeout = setTimeout(() => {
        logger.import.warn('Validation timeout safety triggered');
        setError({
          message: 'Validation is taking longer than expected. For very large files (>10,000 rows), you may need to split the file into smaller parts.',
          timestamp: new Date().toISOString(),
        });
        setIsValidating(false);
      }, 180000); // 3 minutes timeout for UI feedback
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      logger.import.info('Sending validation request');
      const response = await fetch('/api/validate/csv', {
        method: 'POST',
        body: formData,
      });

      logger.import.info('Validation response status', { status: response.status });
      const result = await response.json();
      logger.import.info('Validation result', result);

      if (validationTimeout) {
        clearTimeout(validationTimeout);
      }

      if (!result.success) {
        // Create a more user-friendly error message
        const errorMessages = result.errors?.map((err: any) =>
          `${err.message}${err.suggestion ? ` (${err.suggestion})` : ''}`
        ).join('\n') || result.error || 'Validation failed';

        logger.import.error('Validation failed with errors', { errorMessages, count: result.errors?.length });
        setError({
          message: errorMessages,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      logger.import.info('Validation successful, setting results', { recordCount: result.recordCount });
      setValidationResults(result);
      onValidationComplete(result, selectedFile);
    } catch (err) {
      if (validationTimeout) {
        clearTimeout(validationTimeout);
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to validate file';
      logger.import.error('Validation error', err);
      setError({
        message: errorMessage,
        details: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
      });
    } finally {
      logger.import.info('Validation process completed', { duration: elapsedTime });
      setIsValidating(false);
      setValidationStartTime(null);
      setElapsedTime(0);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    logger.import.info('Starting actual database upload for file', { filename: selectedFile.name });
    setIsUploading(true);
    setError(null);
    setUploadProgress(10);

    try {
      // Check Redis connection first - for user feedback
      const redisAvailable = await checkRedisStatus();
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // If Redis isn't available, provide feedback to user
      if (!redisAvailable) {
        logger.import.warn('Redis not available, uploads will use synchronous processing');
        // Add warning about limited processing
        formData.append('processingMode', 'sync');
      }

      logger.import.info('Sending upload request to /api/import/upload');
      setUploadProgress(25);

      const response = await fetch('/api/import/upload', {
        method: 'POST',
        body: formData,
      });

      logger.import.info('Upload response status', { status: response.status });
      setUploadProgress(50);

      const result = await response.json();
      logger.import.info('Upload result', result);

      if (!result.success) {
        logger.import.error('Upload failed', { error: result.error, details: result.details });
        
        // Parse the error to determine the type and provide appropriate UI feedback
        const errorMessage = result.error || 'Upload failed';
        const errorDetails = result.details || 'Unknown upload error';
        
        // Handle duplicate import specifically
        if (errorMessage.includes('File has already been imported previously') || 
            errorMessage.includes('Duplicate import found')) {
          const batchIdMatch = errorMessage.match(/Batch ID: ([a-f0-9-]+)/);
          const existingBatchId = batchIdMatch ? batchIdMatch[1] : null;
          
          setError({
            message: 'Duplicate File Detected',
            details: errorDetails,
            code: 'DUPLICATE_IMPORT',
            existingBatchId,
            timestamp: new Date().toISOString(),
          });
          return;
        }
        
        // Handle import initiation failure
        if (errorMessage.includes('Failed to initiate import') || 
            errorDetails.includes('Import initiation failed')) {
          setError({
            message: 'Import System Error',
            details: 'The import system is currently experiencing issues. This may be due to database connectivity or background worker problems.',
            code: 'IMPORT_INITIATION_FAILED',
            timestamp: new Date().toISOString(),
          });
          return;
        }
        
        // Handle general upload errors
        setError({
          message: errorMessage,
          details: errorDetails,
          code: 'UPLOAD_ERROR',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      logger.import.info('Upload successful', { batchId: result.batchId });
      setUploadProgress(100);

      // Call the import start callback to switch to progress tracking
      onImportStart(result.batchId);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      logger.import.error('Upload error', err);
      setError({
        message: 'Network or Connection Error',
        details: errorMessage,
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

  // Check if file is potentially large
  const isLargeFile = (file: File | null): boolean => {
    if (!file) return false;
    // Consider files over 1MB potentially large
    return file.size > 1024 * 1024;
  };
  
  // Check Redis status before uploading
  const checkRedisStatus = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/workers/init');
      const result = await response.json();
      return result.redisConnected;
    } catch (error) {
      logger.import.error('Redis status check failed', error);
      return false;
    }
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
      
      {/* Large File Guidelines */}
      {selectedFile && isLargeFile(selectedFile) && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertDescription className="text-sm text-blue-800">
            <p className="font-medium mb-1">Guidelines for large files:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Validation might take longer for files with many rows (up to 2 minutes)</li>
              <li>For files with more than 10,000 rows, consider splitting into smaller batches</li>
              <li>Ensure all required columns are present and properly formatted</li>
              <li>Make sure Redis and background workers are connected for better performance</li>
            </ul>
          </AlertDescription>
        </Alert>
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
                {/* Duplicate Import Error */}
                {error.code === 'DUPLICATE_IMPORT' && (
                  <>
                    <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      File Already Imported
                    </h3>
                    
                    <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 mb-3">
                      <p className="text-orange-800 text-sm mb-2">
                        This file has already been successfully imported into the database.
                      </p>
                      {error.existingBatchId && (
                        <p className="text-xs text-orange-700">
                          Previous import batch ID: <code className="bg-orange-200 px-1 rounded">{error.existingBatchId}</code>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">
                        <strong>What you can do:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                        <li>Check the import history to view the previous import</li>
                        <li>Use a different CSV file if you have new data</li>
                        <li>Contact your administrator if you believe this is an error</li>
                      </ul>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open('/import', '_blank')}
                        className="border-orange-300 text-orange-700 hover:bg-orange-100"
                      >
                        View Import History
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setError(null);
                          setSelectedFile(null);
                          setValidationResults(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="text-orange-600 hover:bg-orange-100"
                      >
                        Choose Different File
                      </Button>
                    </div>
                  </>
                )}

                {/* Import System Error */}
                {error.code === 'IMPORT_INITIATION_FAILED' && (
                  <>
                    <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Import System Error
                    </h3>
                    
                    <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-3">
                      <p className="text-red-800 text-sm mb-2">
                        The import system is currently experiencing issues and cannot process your file.
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">
                        <strong>Possible causes:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                        <li>Database connectivity issues</li>
                        <li>Background worker services are down</li>
                        <li>System maintenance in progress</li>
                      </ul>
                      <p className="text-gray-700 mt-3">
                        <strong>What you can do:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                        <li>Wait a few minutes and try again</li>
                        <li>Contact your system administrator</li>
                        <li>Check if background services are running</li>
                      </ul>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => uploadFile()}
                        className="border-red-300 text-red-700 hover:bg-red-100"
                      >
                        Retry Import
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open('/api/system/health', '_blank')}
                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        Check System Status
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setError(null)}
                        className="text-gray-600 hover:bg-gray-100"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </>
                )}

                {/* Network/Connection Error */}
                {error.code === 'NETWORK_ERROR' && (
                  <>
                    <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Connection Error
                    </h3>
                    
                    <p className="text-red-700 mb-3">
                      Unable to connect to the server. Please check your internet connection and try again.
                    </p>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => uploadFile()}
                        className="border-red-300 text-red-700 hover:bg-red-100"
                      >
                        Retry Upload
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
                  </>
                )}

                {/* General Upload Error */}
                {(!error.code || error.code === 'UPLOAD_ERROR') && (
                  <>
                    <h3 className="font-semibold text-red-800 mb-2">
                      Upload Error
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
                  </>
                )}

                {/* Common timestamp footer */}
                <div className="mt-3 pt-2 border-t border-red-200">
                  <p className="text-xs text-red-500">
                    Error occurred at {new Date(error.timestamp).toLocaleString()}
                  </p>
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
                  logger.import.info('START IMPORT button clicked');

                  // Create confirmation message based on validation status
                  let confirmMessage = `🚀 Ready to Import ${validationResults.recordCount} rows of data?\n\nThis action will:\n• Upload CSV to database\n• Process case activities\n• Create court/judge records\n\n`;

                  if (validationResults.errors?.length > 0) {
                    confirmMessage += `⚠️ WARNING: ${validationResults.errors.length} validation error(s) found.\nSome data may not import correctly.\n\n`;
                  }

                  confirmMessage += `⚠️ This cannot be easily undone. Continue?`;

                  const confirmed = window.confirm(confirmMessage);

                  logger.import.info('User confirmation result', { confirmed });

                  if (confirmed) {
                    logger.import.info('Starting upload process');
                    await uploadFile();
                  } else {
                    logger.import.info('User cancelled upload');
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