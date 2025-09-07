// CSV Processor - Refactored to use modular architecture
// This file now serves as a compatibility layer for existing imports

import { ImportError } from './src/lib/csv';
import type { ImportJobData } from './src/lib/database/redis';
import { batchService } from './src/lib/csv/batch-service';
import { importService } from './src/lib/csv/import-service';
import { csvParser } from './src/lib/csv/parser';

// Re-export types and functions for backward compatibility
export { deriveCourtTypeFromCaseId } from './src/lib/csv/transformer';
export type { ImportError } from './src/lib/csv/interfaces';

// Legacy interface for backward compatibility
export interface ImportResult {
  success: boolean;
  batchId: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  errors: ImportError[];
  masterDataStats?: {
    newCourts: number;
    newJudges: number;
    newCaseTypes: number;
  };
}

// Backward compatibility functions - delegate to new modular services

export async function getOrCreateSystemUser(): Promise<string> {
  return await batchService.getOrCreateSystemUser();
}

export async function initiateDailyImport(
  filePath: string,
  filename: string,
  fileSize: number,
  userId?: string
): Promise<{ success: boolean; batchId: string }> {
  const result = await importService.initiateImport(filePath, filename, fileSize, userId);
  
  if (!result.success) {
    if (result.error?.includes('already been imported')) {
      throw new Error(result.error);
    }
    throw new Error(result.error || 'Failed to initiate import process');
  }
  
  return { success: result.success, batchId: result.batchId };
}

export async function processCsvImport(jobData: ImportJobData, options?: { dryRun?: boolean }): Promise<void> {
  await importService.processImport(jobData, options);
}

export function parseCSVLine(line: string): string[] {
  return csvParser.parseCSVLine(line);
}

export async function getImportStatus(batchId: string): Promise<any> {
  return await importService.getImportStatus(batchId);
}

export async function getImportHistory(limit: number = 20): Promise<any[]> {
  return await importService.getImportHistory(limit);
}