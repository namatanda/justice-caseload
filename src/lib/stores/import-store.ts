/**
 * Import Store
 * 
 * Zustand store for managing CSV import state and operations
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ImportFile {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface ImportValidation {
  isValid: boolean;
  errors: Array<{
    row: number;
    column: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
  warnings: Array<{
    row: number;
    column: string;
    message: string;
  }>;
  summary: {
    totalRows: number;
    validRows: number;
    errorRows: number;
    warningRows: number;
  };
}

export interface ImportBatch {
  id: string;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  startTime: Date;
  endTime?: Date;
  errors?: Array<{
    row: number;
    message: string;
    data?: any;
  }>;
}

interface ImportState {
  // File upload state
  selectedFile: ImportFile | null;
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;

  // Validation state
  validation: ImportValidation | null;
  isValidating: boolean;
  validationError: string | null;

  // Import batch state
  activeBatch: ImportBatch | null;
  batches: ImportBatch[];
  isImporting: boolean;
  importError: string | null;

  // UI state
  currentStep: 'upload' | 'validate' | 'import' | 'complete';
  showPreview: boolean;
}

interface ImportActions {
  // File operations
  setSelectedFile: (file: ImportFile | null) => void;
  setUploading: (uploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setUploadError: (error: string | null) => void;

  // Validation operations
  setValidation: (validation: ImportValidation | null) => void;
  setValidating: (validating: boolean) => void;
  setValidationError: (error: string | null) => void;

  // Import batch operations
  setActiveBatch: (batch: ImportBatch | null) => void;
  updateBatch: (batchId: string, updates: Partial<ImportBatch>) => void;
  addBatch: (batch: ImportBatch) => void;
  setImporting: (importing: boolean) => void;
  setImportError: (error: string | null) => void;

  // UI operations
  setCurrentStep: (step: ImportState['currentStep']) => void;
  setShowPreview: (show: boolean) => void;
  reset: () => void;
  clearErrors: () => void;
}

type ImportStore = ImportState & ImportActions;

const initialState: ImportState = {
  selectedFile: null,
  isUploading: false,
  uploadProgress: 0,
  uploadError: null,
  validation: null,
  isValidating: false,
  validationError: null,
  activeBatch: null,
  batches: [],
  isImporting: false,
  importError: null,
  currentStep: 'upload',
  showPreview: false,
};

export const useImportStore = create<ImportStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // File operations
      setSelectedFile: (selectedFile) =>
        set({ selectedFile }, false, 'import/setSelectedFile'),

      setUploading: (isUploading) =>
        set({ isUploading }, false, 'import/setUploading'),

      setUploadProgress: (uploadProgress) =>
        set({ uploadProgress }, false, 'import/setUploadProgress'),

      setUploadError: (uploadError) =>
        set({ uploadError }, false, 'import/setUploadError'),

      // Validation operations
      setValidation: (validation) =>
        set({ validation }, false, 'import/setValidation'),

      setValidating: (isValidating) =>
        set({ isValidating }, false, 'import/setValidating'),

      setValidationError: (validationError) =>
        set({ validationError }, false, 'import/setValidationError'),

      // Import batch operations
      setActiveBatch: (activeBatch) =>
        set({ activeBatch }, false, 'import/setActiveBatch'),

      updateBatch: (batchId, updates) =>
        set(
          (state) => ({
            batches: state.batches.map((batch) =>
              batch.id === batchId ? { ...batch, ...updates } : batch
            ),
            activeBatch:
              state.activeBatch?.id === batchId
                ? { ...state.activeBatch, ...updates }
                : state.activeBatch,
          }),
          false,
          'import/updateBatch'
        ),

      addBatch: (batch) =>
        set(
          (state) => ({
            batches: [batch, ...state.batches],
          }),
          false,
          'import/addBatch'
        ),

      setImporting: (isImporting) =>
        set({ isImporting }, false, 'import/setImporting'),

      setImportError: (importError) =>
        set({ importError }, false, 'import/setImportError'),

      // UI operations
      setCurrentStep: (currentStep) =>
        set({ currentStep }, false, 'import/setCurrentStep'),

      setShowPreview: (showPreview) =>
        set({ showPreview }, false, 'import/setShowPreview'),

      reset: () =>
        set(initialState, false, 'import/reset'),

      clearErrors: () =>
        set(
          {
            uploadError: null,
            validationError: null,
            importError: null,
          },
          false,
          'import/clearErrors'
        ),
    }),
    { name: 'ImportStore' }
  )
);

// Selectors for better performance
export const useSelectedFile = () => useImportStore((state) => state.selectedFile);
export const useUploadState = () =>
  useImportStore((state) => ({
    isUploading: state.isUploading,
    progress: state.uploadProgress,
    error: state.uploadError,
  }));

export const useValidationState = () =>
  useImportStore((state) => ({
    validation: state.validation,
    isValidating: state.isValidating,
    error: state.validationError,
  }));

export const useImportBatchState = () =>
  useImportStore((state) => ({
    activeBatch: state.activeBatch,
    batches: state.batches,
    isImporting: state.isImporting,
    error: state.importError,
  }));

export const useImportUIState = () =>
  useImportStore((state) => ({
    currentStep: state.currentStep,
    showPreview: state.showPreview,
  }));

// Computed selectors
export const useCanProceedToValidation = () =>
  useImportStore(
    (state) => state.selectedFile !== null && !state.isUploading && !state.uploadError
  );

export const useCanProceedToImport = () =>
  useImportStore(
    (state) =>
      state.validation !== null &&
      state.validation.isValid &&
      !state.isValidating &&
      !state.validationError
  );

export const useHasErrors = () =>
  useImportStore(
    (state) => !!(state.uploadError || state.validationError || state.importError)
  );