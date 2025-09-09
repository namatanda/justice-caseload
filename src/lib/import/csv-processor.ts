import { logger } from '../logger';
import { csvParser, validator, importService, batchService, jobService } from '../csv';
import { getQueueStats } from '../database';
import { batchInsert } from './db-operations';
import type { CaseReturnRow } from '../validation/schemas';

// Legacy alias for backward compatibility
export const processCsvImport = processImport;

// Main orchestrator for CSV import process (~100 lines total)
export async function processImport(filePath: string, filename: string = 'unknown.csv', userId?: string): Promise<{ success: boolean; batchId: string; error?: string }> {
  try {
    logger.info('import', `Starting CSV import process for ${filename}`);
    
    // Step 1: Calculate checksum for duplicate detection
    const checksum = await csvParser.calculateFileChecksum(filePath);
    logger.info('import', `File checksum calculated: ${checksum.substring(0, 16)}...`);
    
    // Step 2: Get or create system user
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      effectiveUserId = await batchService.getOrCreateSystemUser();
    }
    
    // Step 3: Initiate import and queue processing
    try {
      const result = await importService.initiateImport(filePath, filename, 0, effectiveUserId); // fileSize will be calculated internally
      if (!result.success) {
        logger.error('import', `Import initiation failed: ${result.error}`);
        return { success: false, batchId: '', error: result.error };
      }
      
      const batchId = result.batchId;
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
    // For direct processing, we'll use the import service's processImport method
    // which handles parsing, validation, and database operations in one go
    const jobData = {
      filePath,
      filename: 'direct-process.csv',
      fileSize: 0, // Will be calculated internally
      checksum: '', // Will be calculated internally
      userId: undefined,
      batchId
    };

    await importService.processImport(jobData, { dryRun: false });
    
  } catch (error) {
    logger.error('import', `Direct processing failed: ${error}`);
    throw error;
  }
}

// Legacy function wrappers for backward compatibility
export async function initiateDailyImportLegacy(filePath: string, filename?: string, fileSize?: number, userId?: string): Promise<{ success: boolean; batchId: string }> {
  try {
    const result = await importService.initiateImport(filePath, filename || 'unknown.csv', fileSize || 0, userId);
    if (!result.success) {
      return { success: false, batchId: '' };
    }
    return { success: true, batchId: result.batchId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown import error';
    logger.error('import', `Legacy import initiation failed: ${errorMessage}`);
    return { success: false, batchId: '' };
  }
}

// Re-export all functions from modules for backward compatibility
export * from './db-operations';
export * from './utils';

// Main export for backward compatibility with existing API routes
export default {
  processImport,
  initiateDailyImport: initiateDailyImportLegacy,
  getImportStatus: importService.getImportStatus,
  getImportHistory: importService.getImportHistory,
  getQueueStats,
};