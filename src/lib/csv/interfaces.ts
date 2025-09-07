/**
 * Interface definitions for all CSV processing modules
 * These interfaces define the contracts between different modules
 */

import { CourtType } from '@prisma/client';
import type {
  CsvRow,
  ValidationResult,
  BatchValidationResult,
  CaseData,
  ActivityData,
  ImportJobData,
  ImportInitiationResult,
  ImportStatus,
  ImportHistoryItem,
  BatchCreationData,
  ImportBatch,
  CaseCreationResult,
  ProgressUpdate,
  ProcessOptions,
  ErrorContext,
  ErrorCategory,
  ImportError,
  Transaction,
  Job,
  Case,
  BatchStatus,
  ParseResult,
  EmptyRowStats
} from './types';

// Re-export types for use in interface implementations
export type {
  CsvRow,
  ValidationResult,
  BatchValidationResult,
  CaseData,
  ActivityData,
  ImportJobData,
  ImportInitiationResult,
  ImportStatus,
  ImportHistoryItem,
  BatchCreationData,
  ImportBatch,
  CaseCreationResult,
  ProgressUpdate,
  ProcessOptions,
  ErrorContext,
  ErrorCategory,
  ImportError,
  Transaction,
  Job,
  Case,
  BatchStatus,
  ParseResult,
  EmptyRowStats
};

// ============================================================================
// Parser Module Interface
// ============================================================================

export interface CsvParser {
  /**
   * Parse a CSV file and return structured data
   */
  parseFile(filePath: string): Promise<CsvRow[]>;
  
  /**
   * Parse a CSV file with empty row filtering and return detailed results
   */
  parseFileWithFiltering(filePath: string, config?: import('./utils/empty-row-detector').EmptyRowConfig): Promise<ParseResult>;
  
  /**
   * Parse a single CSV line handling quotes and escaping
   */
  parseCSVLine(line: string): string[];
  
  /**
   * Calculate file checksum for duplicate detection
   */
  calculateFileChecksum(filePath: string): Promise<string>;
}

// ============================================================================
// Validation Module Interface
// ============================================================================

export interface CsvValidator {
  /**
   * Validate a single row against business rules
   */
  validateRow(row: CsvRow, rowNumber: number): ValidationResult;
  
  /**
   * Validate an entire batch with early failure detection
   */
  validateBatch(rows: CsvRow[]): BatchValidationResult;
  
  /**
   * Parse Zod validation errors into user-friendly messages
   */
  parseZodError(zodError: string, row: any): ImportError[];
  
  /**
   * Parse Zod issues into field errors
   */
  parseZodIssues(issues: any[], row: any): ImportError[];
  
  /**
   * Get field-specific validation suggestions
   */
  getFieldValidationSuggestion(field: string, message: string, rawValue: any): string;
}

// ============================================================================
// Data Transformation Module Interface
// ============================================================================

export interface DataTransformer {
  /**
   * Transform validated CSV row to case data
   */
  transformToCase(row: any): CaseData;
  
  /**
   * Transform validated CSV row to activity data
   */
  transformToActivity(row: any, caseId: string): ActivityData;
  
  /**
   * Derive court type from case ID prefix
   */
  deriveCourtTypeFromCaseId(caseidType: string): CourtType;
}

// ============================================================================
// Error Handler Module Interface
// ============================================================================

export interface ErrorHandler {
  /**
   * Handle validation errors and format them consistently
   */
  handleValidationError(error: any, row: any, rowNumber: number): ImportError[];
  
  /**
   * Handle database errors with context
   */
  handleDatabaseError(error: any, context: ErrorContext): ImportError;
  
  /**
   * Format errors into user-friendly messages
   */
  formatUserFriendlyError(error: Error): string;
  
  /**
   * Categorize errors by type
   */
  categorizeError(error: Error): ErrorCategory;
}

// ============================================================================
// Batch Service Module Interface
// ============================================================================

export interface BatchService {
  /**
   * Create a new import batch
   */
  createBatch(batchData: BatchCreationData): Promise<ImportBatch>;
  
  /**
   * Update batch status
   */
  updateBatchStatus(batchId: string, status: BatchStatus): Promise<void>;
  
  /**
   * Update batch with statistics including empty row counts
   */
  updateBatchWithStats(
    batchId: string, 
    stats: {
      status: BatchStatus;
      totalRecords: number;
      successfulRecords: number;
      failedRecords: number;
      errorLogs?: any[];
      emptyRowsSkipped?: number;
    }
  ): Promise<void>;
  
  /**
   * Update batch with empty row statistics
   */
  updateBatchWithEmptyRowStats(batchId: string, emptyRowsSkipped: number): Promise<void>;
  
  /**
   * Get batch by ID
   */
  getBatch(batchId: string): Promise<ImportBatch | null>;
  
  /**
   * Get batch history with limit
   */
  getBatchHistory(limit: number): Promise<ImportBatch[]>;
  
  /**
   * Get or create system user for imports
   */
  getOrCreateSystemUser(): Promise<string>;
}

// ============================================================================
// Case Service Module Interface
// ============================================================================

export interface CaseService {
  /**
   * Create or update a case from CSV row data
   */
  createOrUpdateCase(row: any, tx: Transaction, masterDataTracker?: any): Promise<CaseCreationResult>;
  
  /**
   * Create case activity from CSV row data
   */
  createCaseActivity(row: any, caseId: string, importBatchId: string, tx: Transaction, masterDataTracker?: any): Promise<void>;
  
  /**
   * Find existing case by case number
   */
  findExistingCase(caseNumber: string, courtName: string, tx: Transaction): Promise<Case | null>;
}

// ============================================================================
// Job Service Module Interface
// ============================================================================

export interface JobService {
  /**
   * Add import job to queue
   */
  addImportJob(jobData: ImportJobData): Promise<Job>;
  
  /**
   * Process a job
   */
  processJob(job: Job): Promise<void>;
  
  /**
   * Update job progress
   */
  updateJobProgress(batchId: string, progress: ProgressUpdate): Promise<void>;
}

// ============================================================================
// Import Service Module Interface (Main Orchestrator)
// ============================================================================

export interface ImportService {
  /**
   * Initiate import process
   */
  initiateImport(filePath: string, filename: string, fileSize: number, userId?: string): Promise<ImportInitiationResult>;
  
  /**
   * Process import job
   */
  processImport(jobData: ImportJobData, options?: ProcessOptions): Promise<void>;
  
  /**
   * Get import status
   */
  getImportStatus(batchId: string): Promise<ImportStatus>;
  
  /**
   * Get import history
   */
  getImportHistory(limit?: number): Promise<ImportHistoryItem[]>;
}