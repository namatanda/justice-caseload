/**
 * Core types and interfaces for the CSV processing modules
 */

import { CourtType, PrismaClient, Prisma } from '@prisma/client';

// Temporary type definition - will use actual CaseReturnRow from validation schemas in implementation
export interface CaseReturnRow {
  [key: string]: any;
}

// ============================================================================
// Core Data Types
// ============================================================================

export interface CsvRow {
  [key: string]: string | undefined;
}

export interface EmptyRowStats {
  totalEmptyRows: number;
  emptyRowNumbers: number[];
}

export interface ParseResult {
  validRows: CsvRow[];
  emptyRowStats: EmptyRowStats;
  totalRowsParsed: number;
}

export interface FieldError {
  field: string;
  message: string;
  suggestion: string;
  rawValue: any;
}

export interface ImportError {
  rowNumber: number;
  errorType: string;
  errorMessage: string;
  field?: string;
  suggestion?: string;
  rawValue?: any;
  rawData?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FieldError[];
  validatedData?: CaseReturnRow;
}

export interface BatchValidationResult {
  totalRows: number;
  validRows: CaseReturnRow[];
  errors: ImportError[];
}

export interface CaseData {
  caseNumber: string;
  caseTypeId: string;
  filedDate: Date;
  originalCourtId?: string;
  originalCaseNumber?: string;
  originalYear?: number;
  maleApplicant: number;
  femaleApplicant: number;
  organizationApplicant: number;
  maleDefendant: number;
  femaleDefendant: number;
  organizationDefendant: number;
  caseidType?: string;
  caseidNo?: string;
  status: 'ACTIVE' | 'RESOLVED' | 'PENDING' | 'TRANSFERRED' | 'DELETED';
  hasLegalRepresentation: boolean;
}

export interface ActivityData {
  caseId: string;
  activityDate: Date;
  activityType: string;
  outcome: string;
  reasonForAdjournment?: string;
  nextHearingDate?: Date;
  primaryJudgeId: string;
  hasLegalRepresentation: boolean;
  applicantWitnesses: number;
  defendantWitnesses: number;
  custodyStatus: 'IN_CUSTODY' | 'ON_BAIL' | 'NOT_APPLICABLE';
  details?: string;
  importBatchId: string;
  judge1?: string;
  judge2?: string;
  judge3?: string;
  judge4?: string;
  judge5?: string;
  judge6?: string;
  judge7?: string;
}

export interface ImportJobData {
  filePath: string;
  filename: string;
  fileSize: number;
  checksum: string;
  userId?: string;
  batchId: string;
}

export interface ImportInitiationResult {
  success: boolean;
  batchId: string;
  error?: string;
}

export interface ImportStatus {
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  message: string;
  stats?: any;
  errorDetails?: any;
}

export interface ImportHistoryItem {
  id: string;
  importDate: Date;
  filename: string;
  status: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
}

export interface BatchCreationData {
  filename: string;
  fileSize: number;
  fileChecksum: string;
  userId: string;
}

export interface CaseCreationResult {
  caseId: string;
  isNewCase: boolean;
}

export interface ProgressUpdate {
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  message: string;
  stats?: any;
}

export interface ProcessOptions {
  dryRun?: boolean;
  batchSize?: number;
}

export interface ErrorContext {
  operation: string;
  rowNumber?: number;
  data?: any;
}

export type ErrorCategory = 'validation' | 'database' | 'system' | 'business';

export type BatchStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

// ============================================================================
// Transaction Types (for database operations)
// ============================================================================

export type Transaction = Prisma.TransactionClient;

export interface Job {
  id: string | number;
  data: ImportJobData;
  [key: string]: any;
}

// ============================================================================
// Database Entity Types
// ============================================================================

export interface ImportBatch {
  id: string;
  importDate: Date;
  filename: string;
  fileSize: number;
  fileChecksum: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  status: BatchStatus;
  errorLogs: any[];
  completedAt?: Date | null;
  createdBy: string;
  emptyRowsSkipped?: number | null;
}

export interface Case {
  id: string;
  caseNumber: string;
  caseTypeId: string;
  filedDate: Date;
  [key: string]: any;
}