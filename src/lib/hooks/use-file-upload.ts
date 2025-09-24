import { useState, useRef } from 'react';

interface UseFileUploadProps {
  onImportStart: (batchId: string) => void;
  onValidationComplete: (results: any, file?: File) => void;
}

interface FileUploadError {
  message: string;
  details?: string;
  code?: string;
  existingBatchId?: string;
  timestamp: string;
}

/**
 * Custom hook to handle file upload logic
 * 
 * This hook extracts the complex state management and business logic
 * from the FileUpload component, making the component simpler and
 * the logic more reusable.
 */
export function useFileUpload({ 
  onImportStart, 
  onValidationComplete 
}: UseFileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<FileUploadError | null>(null);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [validationStartTime, setValidationStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    setIsValidating(true);
    setValidationStartTime(Date.now());
    setElapsedTime(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/validate/csv', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        // Create a more user-friendly error message
        const errorMessages = result.errors?.map((err: any) =>
          `${err.message}${err.suggestion ? ` (${err.suggestion})` : ''}`
        ).join('\n') || result.error || 'Validation failed';

        setError({
          message: errorMessages,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      setValidationResults(result);
      onValidationComplete(result, selectedFile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to validate file';
      setError({
        message: errorMessage,
        details: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsValidating(false);
      setValidationStartTime(null);
      setElapsedTime(0);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

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
        // Add warning about limited processing
        formData.append('processingMode', 'sync');
      }

      setUploadProgress(25);

      const response = await fetch('/api/import/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(50);

      const result = await response.json();

      if (!result.success) {
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

      setUploadProgress(100);

      // Call the import start callback to switch to progress tracking
      onImportStart(result.batchId);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
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
      return false;
    }
  };

  return {
    // State values
    selectedFile,
    isUploading,
    isValidating,
    uploadProgress,
    error,
    validationResults,
    validationStartTime,
    elapsedTime,
    fileInputRef,
    
    // State setters
    setSelectedFile,
    setValidationResults,
    setError,
    setIsValidating,
    setValidationStartTime,
    setElapsedTime,
    setIsUploading,
    setUploadProgress,
    
    // Functions
    handleFileSelect,
    handleDragOver,
    handleDrop,
    validateFile,
    uploadFile,
    formatFileSize,
    formatElapsedTime,
    isLargeFile,
    checkRedisStatus,
 };
}