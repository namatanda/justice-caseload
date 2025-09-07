import { logger } from '../logger';
import { parseCSV, type CaseReturnRow } from './csv-parser';
import { validateRows } from './validation';
import { initiateDailyImport, getQueueStats } from './queue-handler';
import { getOrCreateSystemUser, getImportStatus, getImportHistory, calculateFileChecksum, type ImportResult, type ImportError } from './utils';
import { batchInsert } from './db-operations';

// Legacy alias for backward compatibility
export const processCsvImport = processImport;

// Main orchestrator for CSV import process (~100 lines total)
export async function processImport(filePath: string, filename: string = 'unknown.csv', userId?: string): Promise<{ success: boolean; batchId: string; error?: string }> {
  try {
    logger.info('import', `Starting CSV import process for ${filename}`);
    
    // Step 1: Calculate checksum for duplicate detection
    const checksum = await calculateFileChecksum(filePath);
    logger.info('import', `File checksum calculated: ${checksum.substring(0, 16)}...`);
    
    // Step 2: Get or create system user
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      effectiveUserId = await getOrCreateSystemUser();
    }
    
    // Step 3: Initiate import and queue processing
    try {
      const batchId = await initiateDailyImport(filePath);
      logger.info('import', `Import batch initiated with ID: ${batchId}`);
      
      // Step 4: For immediate processing (non-queue mode), validate and process small files directly
      if (process.env.NODE_ENV === 'test' || filename.includes('test')) {
        logger.info('import', 'Running direct processing mode (test environment)');
        await directProcess(filePath, batchId);
      } else {
        logger.info('import', 'Processing queued via background worker');
      }
      
      return { success: true, batchId };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown import error';
      logger.error('import', `Import initiation failed: ${errorMessage}`);
      return { success: false, batchId: '', error: errorMessage };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown import error';
    logger.error('import', `Import process failed: ${errorMessage}`);
    return { success: false, batchId: '', error: errorMessage };
  }
}

// Direct processing for small files or testing (replaces old monolithic logic)
async function directProcess(filePath: string, batchId: string): Promise<void> {
  try {
    // Step 1: Parse CSV
    const rows = await parseCSV(filePath);
    logger.info('import', `Parsed ${rows.length} rows from ${filePath}`);
    
    if (rows.length === 0) {
      logger.warn('import', 'No rows found in CSV file');
      return;
    }
    
    // Step 2: Validate rows
    const { validRows, invalidRows } = validateRows(rows);
    logger.info('import', `Validation complete: ${validRows.length} valid, ${invalidRows.length} invalid rows`);
    
    if (invalidRows.length > 0) {
      logger.warn('import', `Skipping ${invalidRows.length} invalid rows`);
    }
    
    // Step 3: Batch process valid rows
    if (validRows.length > 0) {
      const result = await batchInsert(validRows, batchId);
      logger.info('import', `Batch processing complete: ${result.success} successful, ${result.failed} failed`);
    }
    
  } catch (error) {
    logger.error('import', `Direct processing failed: ${error}`);
    throw error;
  }
}

// Legacy function wrappers for backward compatibility
export async function initiateDailyImportLegacy(filePath: string, filename?: string, fileSize?: number, userId?: string): Promise<{ success: boolean; batchId: string }> {
  try {
    const batchId = await initiateDailyImport(filePath);
    return { success: true, batchId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown import error';
    logger.error('import', `Legacy import initiation failed: ${errorMessage}`);
    return { success: false, batchId: '', error: errorMessage };
  }
}

// Re-export all functions from modules for backward compatibility
export * from './csv-parser';
export * from './validation';
export * from './db-operations';
export * from './queue-handler';
export * from './utils';

// Main export for backward compatibility with existing API routes
export default {
  processImport,
  initiateDailyImport: initiateDailyImportLegacy,
  getImportStatus,
  getImportHistory,
  getQueueStats,
};