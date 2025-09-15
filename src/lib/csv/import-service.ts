/**
 * Import Service Module
 * 
 * Main orchestration layer for CSV import processing.
 * This service coordinates all other modules to provide a complete
 * import workflow from initiation to completion.
 */

import { logger } from '../logger';
import { withTransaction } from '../database';
import { MasterDataTracker } from '../data/extraction';
import { CaseReturnRow, createDateFromParts } from '../validation/schemas';
import { casesProcessedTotal, importBatchesTotal } from '../metrics';
import type {
  ImportService,
  ImportJobData,
  ImportInitiationResult,
  ImportStatus,
  ImportHistoryItem,
  ProcessOptions,
  ImportError,
  Transaction
} from './interfaces';

// Import all the service modules
import { csvParser } from './parser';
import { validator } from './validator';
import { errorHandler } from './error-handler';
import { batchService } from './batch-service';
import { caseService } from './case-service';
import { jobService } from './job-service';

/**
 * Implementation of the Import Service interface
 * Orchestrates the complete CSV import workflow
 */
export class ImportServiceImpl implements ImportService {
  
  /**
   * Initiate import process
   * Creates batch, validates file, and queues job for processing
   */
  async initiateImport(
    filePath: string, 
    filename: string, 
    fileSize: number, 
    userId?: string
  ): Promise<ImportInitiationResult> {
    try {
      logger.import.info('Calculating file checksum', { filePath });
      
      // Calculate file checksum using parser module
      const checksum = await csvParser.calculateFileChecksum(filePath);
      logger.import.debug('Checksum calculated', { checksum: checksum.substring(0, 20) + '...' });

      // Check for duplicate imports using batch service
      logger.import.info('Checking for duplicate import', { checksum: checksum.substring(0, 20) + '...' });
      const existingImport = await batchService.checkForDuplicateImport(checksum);

      if (existingImport) {
        logger.import.warn('Duplicate import found', { existingImportId: existingImport.id });
        return {
          success: false,
          batchId: '',
          error: `File has already been imported previously. Batch ID: ${existingImport.id}`
        };
      }
      logger.import.info('No duplicate import found, proceeding with batch creation');

      // Ensure valid userId using batch service
      let effectiveUserId = userId;
      if (!effectiveUserId) {
        logger.import.info('No userId provided, getting system user...');
        effectiveUserId = await batchService.getOrCreateSystemUser();
        logger.database.debug('System user used for batch creation', effectiveUserId);
      }
    
      logger.import.info('Creating import batch', {
        filename,
        fileSize,
        checksum: checksum.substring(0, 20) + '...',
        userId: effectiveUserId
      });

      // Create import batch using batch service
      const importBatch = await batchService.createBatch({
        filename,
        fileSize,
        fileChecksum: checksum,
        userId: effectiveUserId,
      });

      // Record import batch creation metric
      importBatchesTotal.labels('created').inc();

      logger.import.info('Import batch created in database', {
        id: importBatch.id,
        status: importBatch.status,
        createdAt: importBatch.importDate
      });

      // Verify the batch was actually created
      const verifyBatch = await batchService.getBatch(importBatch.id);
      logger.import.info('Batch verification', verifyBatch ? 'Found in database' : 'NOT FOUND in database');
      
      logger.info('general', 'Import batch created successfully:', {
        id: importBatch.id,
        status: importBatch.status,
        createdAt: importBatch.importDate
      });

      // Add job to queue for background processing using JobService
      await jobService.addImportJob({
        filePath,
        filename,
        fileSize,
        checksum,
        userId: effectiveUserId,
        batchId: importBatch.id,
      });

      logger.import.info('Returning success with batchId', importBatch.id);
      return { 
        success: true, 
        batchId: importBatch.id 
      };
    } catch (error) {
      logger.import.error('Failed to initiate import', error);
      
      // Preserve the original error message, especially for duplicate imports
      const originalMessage = error instanceof Error ? error.message : String(error);
      if (originalMessage.includes('already been imported')) {
        // Re-throw the duplicate import error with the original message
        throw error;
      }
      
      // For other errors, wrap with generic message but include original details
      return {
        success: false,
        batchId: '',
        error: `Failed to initiate import process: ${originalMessage}`
      };
    }
  }

  /**
   * Process import job
   * Main orchestration method that coordinates all modules to process CSV data
   */
  async processImport(jobData: ImportJobData, options?: ProcessOptions): Promise<void> {
    // Fix: Default to actual processing (not dry-run) unless explicitly requested
    // Only use dry-run mode if explicitly set to true, or if in test environment
    const dryRun = options?.dryRun ?? (process.env.NODE_ENV === 'test');

    logger.import.info('Background job started', {
      batchId: jobData.batchId,
      filePath: jobData.filePath,
      filename: jobData.filename,
      timestamp: new Date().toISOString()
    });

    // Diagnostic logging
    try {
      logger.info('general', '🔧 Diagnostic: process.env.DATABASE_URL =', process.env.DATABASE_URL || '<not set>');
    } catch (e) {
      logger.info('general', '🔧 Diagnostic: failed to read DATABASE_URL', e);
    }

    const { filePath, batchId } = jobData;
    const errors: ImportError[] = [];
    const masterDataTracker = new MasterDataTracker();

    let totalRecords = 0;
    let successfulRecords = 0;
    let duplicatesSkipped = 0;

    try {
      // If running in dry-run mode, avoid touching the database
      if (dryRun) {
        logger.import.warn('Running in dry-run mode: no database or cache writes will be performed.');
        const parseResult = await csvParser.parseFileWithFiltering(filePath);
        const csvData = parseResult.validRows;
        totalRecords = parseResult.totalRowsParsed;
        const emptyRowsSkipped = parseResult.emptyRowStats.totalEmptyRows;

        // Basic validation pass over all rows (no DB writes)
        // Note: Only validating actual data rows - empty rows already filtered out
        for (let i = 0; i < csvData.length; i++) {
          const row = csvData[i];
          const validationResult = validator.validateRow(row, i + 1);
          
          if (validationResult.isValid) {
            successfulRecords++;
          } else {
            // These are validation failures on actual data rows (empty rows already filtered out)
            errors.push(...validationResult.errors.map(err => ({
              rowNumber: i + 1,
              errorType: 'validation_error',
              errorMessage: err.message,
              field: err.field,
              suggestion: err.suggestion,
              rawValue: err.rawValue,
              rawData: row,
            })));
          }
        }

        // Log empty row details at DEBUG level for dry-run debugging
        if (emptyRowsSkipped > 0) {
          logger.import.debug(`Dry-run: Skipped ${emptyRowsSkipped} empty rows during CSV processing`, {
            filePath,
            emptyRowNumbers: parseResult.emptyRowStats.emptyRowNumbers.slice(0, 10) // First 10 for debugging
          });
        }

        logger.import.info('Dry-run completed: validation failures only include actual data rows', {
          filePath,
          totalRecords,
          actualDataRows: csvData.length,
          emptyRowsSkipped,
          successfulRecords,
          failedRecords: errors.length,
          sampleErrors: errors.slice(0, 5)
        });

        // Do not update DB or cache in dry-run mode; just return
        return;
      }

      // Verify the batch exists before processing (non-dry-run)
      const batch = await batchService.getBatch(batchId);

      if (!batch) {
        throw new Error(`Import batch ${batchId} not found in database`);
      }

      logger.import.info('Batch found for processing', {
        id: batch.id,
        status: batch.status,
        filename: batch.filename
      });

      // Update status to processing
      await batchService.updateBatchStatus(batchId, 'PROCESSING');

      // Update cache with processing status using JobService
      await jobService.setProcessingStatus(batchId);

      // Read and parse CSV file using parser module with empty row filtering
      const parseResult = await csvParser.parseFileWithFiltering(filePath);
      const csvData = parseResult.validRows;
      totalRecords = parseResult.totalRowsParsed;
      const emptyRowsSkipped = parseResult.emptyRowStats.totalEmptyRows;
      const criticalFieldsMissingRowsSkipped = parseResult.emptyRowStats.criticalFieldsMissingRows;
      const actualDataRows = csvData.length;

      logger.import.info('CSV parsing completed with empty row filtering', {
        batchId,
        totalRowsParsed: totalRecords,
        actualDataRows,
        emptyRowsSkipped,
        criticalFieldsMissingRowsSkipped,
        emptyRowNumbers: parseResult.emptyRowStats.emptyRowNumbers.slice(0, 10), // First 10 for debugging
        criticalFieldsMissingRowNumbers: parseResult.emptyRowStats.criticalFieldsMissingRowNumbers.slice(0, 10) // First 10 for debugging
      });

      // Log empty row details at DEBUG level for debugging (first 10 row numbers only)
      if (emptyRowsSkipped > 0) {
        logger.import.debug(`Skipped ${emptyRowsSkipped} empty rows during CSV processing`, {
          batchId,
          filename: jobData.filename,
          emptyRowNumbers: parseResult.emptyRowStats.emptyRowNumbers.slice(0, 10) // First 10 for debugging
        });
      }

      // Update progress using JobService - use actual data rows for progress tracking
      await jobService.setFileReadProgress(batchId, actualDataRows);

      // Process each row in batches
      const batchSize = options?.batchSize ?? 100;

      // Early validation check - test first few rows to catch common issues
      // Note: Only validating actual data rows - empty rows already filtered out
      const sampleSize = Math.min(5, csvData.length);
      let earlyValidationErrors = 0;

      for (let i = 0; i < sampleSize; i++) {
        const validationResult = validator.validateRow(csvData[i], i + 1);
        
        if (!validationResult.isValid) {
          earlyValidationErrors++;
          
          // Log early validation failure at DEBUG level
          logger.import.debug(`Early validation failed for data row ${i + 1}`, {
            batchId,
            rowNumber: i + 1,
            errorCount: validationResult.errors.length,
            firstError: validationResult.errors[0]?.message
          });
          
          // If too many early validation errors, fail fast
          if (earlyValidationErrors >= 3) {
            const firstError = validationResult.errors[0];
            throw new Error(`Early validation failed: ${earlyValidationErrors} errors in first ${sampleSize} data rows. Common error: ${firstError?.message || 'Unknown validation error'}`);
          }
        }
      }

      // Process data in batches
      for (let i = 0; i < csvData.length; i += batchSize) {
        const batch = csvData.slice(i, i + batchSize);

        try {
          const batchResult = await this.processBatch(batch, i, batchId, masterDataTracker);
          successfulRecords += batchResult.successfulRecords;
          errors.push(...batchResult.errors);
          duplicatesSkipped += batchResult.duplicatesSkipped;

        } catch (error) {
          logger.error('general', `Batch processing failed:`, error);
        }

        // Update progress using JobService - use actual data rows for progress tracking
        await jobService.setBatchProgress(batchId, i + batchSize, actualDataRows);
      }

      // Update final status - calculate failure percentage based on actual data rows, not total rows
      const failedPercentage = actualDataRows > 0 ? (errors.length / actualDataRows) * 100 : 0;
      
      // Determine failure reason based on the type of failures
      let failureReason = '';
      let failureCategory = '';
      
      if (duplicatesSkipped > 0 && successfulRecords === 0) {
        // Complete failure due to duplicates only
        failureReason = `Import failed: All ${duplicatesSkipped} records were duplicates of existing data. No new records were imported.`;
        failureCategory = 'DUPLICATES_ONLY';
      } else if (duplicatesSkipped > 0 && successfulRecords > 0) {
        // Partial failure with some duplicates
        failureReason = `Import partially failed: ${duplicatesSkipped} duplicate records were skipped, ${successfulRecords} new records were imported.`;
        failureCategory = 'DUPLICATES_WITH_SUCCESS';
      } else if (successfulRecords === 0 && actualDataRows > 0) {
        // Complete failure due to validation/other errors
        failureReason = `Import failed: No records were successfully imported due to validation or processing errors.`;
        failureCategory = 'VALIDATION_ERRORS';
      } else if (failedPercentage >= 95) {
        // Near-complete failure
        failureReason = `Import failed: ${Math.round(failedPercentage)}% of records failed to import.`;
        failureCategory = 'HIGH_FAILURE_RATE';
      }
      
      // Only mark as COMPLETED if at least some records were imported successfully
      let finalStatus: 'COMPLETED' | 'FAILED' = 'COMPLETED';
      if (successfulRecords === 0 && actualDataRows > 0) {
        finalStatus = 'FAILED'; // Complete failure - no records imported
      } else if (failedPercentage >= 95) {
        finalStatus = 'FAILED'; // If 95% or more records failed, consider the import failed
      } else if (errors.length === actualDataRows) {
        finalStatus = 'FAILED'; // All data records failed
      }

      // Record import batch completion metric
      importBatchesTotal.labels(finalStatus.toLowerCase()).inc();
      
      const finalBatchData = {
        totalRecords,
        successfulRecords,
        failedRecords: errors.length,
        emptyRowsSkipped,
        duplicatesSkipped,
        errorLogs: JSON.parse(JSON.stringify(errors.map(err => ({
          rowNumber: err.rowNumber,
          errorType: err.errorType,
          errorMessage: err.errorMessage
        })))),
        status: finalStatus,
        completedAt: new Date(),
        failureReason,
        failureCategory
      };

      logger.import.info('Updating final batch status', {
        batchId,
        updateData: {
          ...finalBatchData,
          actualDataRows,
          completedAt: finalBatchData.completedAt.toISOString(),
          errorLogsCount: finalBatchData.errorLogs.length,
          sampleErrors: finalBatchData.errorLogs.slice(0, 3)
        }
      });
      
      // Update batch with final statistics using batch service
      logger.import.info('About to update batch with stats', {
        batchId,
        updateData: {
          status: finalStatus,
          totalRecords,
          successfulRecords,
          failedRecords: errors.length,
          emptyRowsSkipped: emptyRowsSkipped + criticalFieldsMissingRowsSkipped, // Combine for DB storage
          errorLogsLength: finalBatchData.errorLogs.length
        }
      });
      
      try {
        await batchService.updateBatchWithStats(batchId, {
          status: finalStatus,
          totalRecords,
          successfulRecords,
          failedRecords: errors.length,
          errorLogs: finalBatchData.errorLogs,
          emptyRowsSkipped: emptyRowsSkipped + criticalFieldsMissingRowsSkipped // Combine for DB storage
          // Note: duplicatesSkipped is not persisted on DB model in this release
        });
        
        logger.import.info('Successfully updated batch with stats', { batchId });
        
        // Immediately verify the update worked
        const verifyBatch = await batchService.getBatch(batchId);
        logger.import.info('Batch verification after stats update', {
          batchId,
          dbStats: {
            totalRecords: verifyBatch?.totalRecords,
            successfulRecords: verifyBatch?.successfulRecords,
            failedRecords: verifyBatch?.failedRecords,
            emptyRowsSkipped: verifyBatch?.emptyRowsSkipped,
            status: verifyBatch?.status
          }
        });
        
      } catch (updateError) {
        logger.import.error('Failed to update batch with stats', { batchId, updateError });
        throw updateError;
      }
      
      // Update the batch with final statistics
      const updatedBatch = await batchService.getBatch(batchId);
      
      logger.import.info('FINAL BATCH STATUS COMMITTED - validation failures only include actual data rows', {
        id: updatedBatch?.id,
        status: updatedBatch?.status,
        totalRecords: finalBatchData.totalRecords,
        actualDataRows,
        emptyRowsSkipped: finalBatchData.emptyRowsSkipped,
        criticalFieldsMissingRowsSkipped,
        successfulRecords: finalBatchData.successfulRecords,
        failedRecords: finalBatchData.failedRecords,
        completedAt: finalBatchData.completedAt
      });

      // Summary completion log with empty row statistics - separate empty rows from validation failures
      logger.import.info(`CSV processing completed: ${successfulRecords} data rows processed successfully, ${errors.length} validation failures, ${emptyRowsSkipped} empty rows skipped, ${criticalFieldsMissingRowsSkipped} rows with missing critical fields skipped`, {
        batchId,
        filename: jobData.filename,
        totalRows: totalRecords,
        actualDataRows,
        emptyRowsSkipped,
        criticalFieldsMissingRowsSkipped,
        successfulRecords,
        failedRecords: errors.length,
        finalStatus
      });

      // Update cache with final status using JobService
      await jobService.setCompletionStatus(
        batchId,
        finalStatus,
        successfulRecords,
        errors.length,
        {
          ...masterDataTracker.getStats(),
          totalRowsParsed: totalRecords,
          actualDataRows,
          emptyRowsSkipped,
          criticalFieldsMissingRowsSkipped,
          duplicatesSkipped,
          failureReason,
          failureCategory
        }
      );

      // Verification: ensure persisted records match the reported successfulRecords
      await this.verifyImportResults(batchId, successfulRecords, errors.length);

    } catch (error) {
      await this.handleImportFailure(error, batchId, totalRecords, successfulRecords, errors);
    }
  }

  /**
   * Get import status
   */
  async getImportStatus(batchId: string): Promise<ImportStatus> {
    logger.info('general', `🔍 Looking for batch ID: ${batchId}`);
    
    // Use batch service to get import status
    return await batchService.getImportStatus(batchId);
  }

  /**
   * Get import history
   */
  async getImportHistory(limit?: number): Promise<ImportHistoryItem[]> {
    // Use batch service to get import history
    return await batchService.getImportHistory(limit ?? 20);
  }

  /**
   * Process a batch of CSV rows (moved from main CSV processor)
   * Private method that handles database transactions for a batch of rows
   */
  private async processBatch(
    batch: any[],
    startIndex: number,
    batchId: string,
    masterDataTracker: MasterDataTracker
  ): Promise<{ successfulRecords: number; errors: ImportError[]; duplicatesSkipped: number }> {

    const errors: ImportError[] = [];
    let successfulRecords = 0;
    let duplicatesSkipped = 0;

    logger.info('general', '🔄 STARTING BATCH TRANSACTION:', {
      batchSize: batch.length,
      startIndex,
      endIndex: startIndex + batch.length - 1,
      batchId
    });

    // Process batch in a transaction
    await withTransaction(async (tx) => {
      logger.info('general', '📦 TRANSACTION STARTED - Processing batch rows...');
      
      for (let i = 0; i < batch.length; i++) {
        const rowIndex = startIndex + i;
        const row = batch[i];

        logger.info('general', `\n--- ROW ${rowIndex + 1} PROCESSING ---`);
        logger.info('general', 'Raw CSV data:', {
          caseid_type: row.caseid_type,
          caseid_no: row.caseid_no,
          case_type: row.case_type,
          court: row.court,
          judge_1: row.judge_1,
          comingfor: row.comingfor,
          outcome: row.outcome,
          date: `${row.date_dd}/${row.date_mon}/${row.date_yyyy}`,
          filed: `${row.filed_dd}/${row.filed_mon}/${row.filed_yyyy}`
        });

        try {
          // Log the raw row before validation
          logger.import.debug('Validating row data', {
            rowNumber: rowIndex + 1,
            rawRow: row,
            keyCount: Object.keys(row).length,
            sampleKeys: Object.keys(row).slice(0, 10),
            requiredFields: {
              court: row.court,
              caseid_type: row.caseid_type,
              caseid_no: row.caseid_no,
              case_type: row.case_type,
              judge_1: row.judge_1,
              date_dd: row.date_dd,
              date_mon: row.date_mon,
              date_yyyy: row.date_yyyy,
              filed_dd: row.filed_dd,
              filed_mon: row.filed_mon,
              filed_yyyy: row.filed_yyyy
            }
          });

          // Validate row data using validator module
          const validationResult = validator.validateRow(row, rowIndex + 1);
          
          if (!validationResult.isValid) {
            // Handle validation errors using centralized error handler
            // Note: These are validation failures on actual data rows (empty rows already filtered out)
            const validationErrors = validationResult.errors.map(err => ({
              rowNumber: rowIndex + 1,
              errorType: 'validation_error',
              errorMessage: err.message,
              field: err.field,
              suggestion: err.suggestion,
              rawValue: err.rawValue,
              rawData: row,
            }));
            errors.push(...validationErrors);
            
            // Log validation failure at DEBUG level for debugging
            logger.import.debug(`Validation failed for data row ${rowIndex + 1}`, {
              batchId,
              rowNumber: rowIndex + 1,
              errorCount: validationResult.errors.length,
              firstError: validationResult.errors[0]?.message,
              field: validationResult.errors[0]?.field
            });
            
            continue;
          }

          // Type guard to ensure validatedData exists
          if (!validationResult.validatedData) {
            logger.import.error(`Validation passed but no validated data for row ${rowIndex + 1}`, {
              batchId,
              rowNumber: rowIndex + 1
            });
            errors.push({
              rowNumber: rowIndex + 1,
              errorType: 'system_error',
              errorMessage: 'Validation passed but no validated data returned',
              rawData: row
            });
            continue;
          }

          const validatedRow = validationResult.validatedData;
          logger.import.info('Row validation passed', {
            validatedFields: {
              court: validatedRow.court,
              caseid_type: validatedRow.caseid_type,
              caseid_no: validatedRow.caseid_no,
              case_type: validatedRow.case_type,
              judge_1: validatedRow.judge_1,
              date_dd: validatedRow.date_dd,
              date_mon: validatedRow.date_mon,
              date_yyyy: validatedRow.date_yyyy
            }
          });

          // Check for duplicate activity BEFORE creating/updating case
          // This prevents creating case records when the activity is a duplicate
          const isDuplicateActivity = await this.checkForDuplicateActivity(validatedRow, tx);
          
          if (isDuplicateActivity) {
            duplicatesSkipped++;
            logger.info('general', `⚠️ ROW ${rowIndex + 1} SKIPPED (duplicate activity detected)`);
            continue; // Skip this row entirely - don't create/update case or activity
          }

          // Create or update case using case service (only if activity is not duplicate)
          try {
            const caseResult = await caseService.createOrUpdateCase(validatedRow, tx, masterDataTracker);

            // Create case activity using case service (should always succeed since we checked for duplicates)
            const created = await caseService.createCaseActivity(validatedRow, caseResult.caseId, batchId, tx, masterDataTracker);

            if (created) {
              successfulRecords++;
              // Record successful case processing metric
              casesProcessedTotal.labels('success', validatedRow.court || 'unknown').inc();
              logger.info('general', `✅ ROW ${rowIndex + 1} PROCESSED SUCCESSFULLY`);
            } else {
              // This should not happen since we checked for duplicates above
              duplicatesSkipped++;
              // Record failed case processing metric
              casesProcessedTotal.labels('failed', validatedRow.court || 'unknown').inc();
              logger.warn('general', `⚠️ ROW ${rowIndex + 1} ACTIVITY CREATION FAILED (unexpected duplicate)`);
            }
          } catch (dbError) {
            // Handle database errors using centralized error handler
            const context = {
              operation: 'createCase',
              rowNumber: rowIndex + 1,
              data: row
            };
            const databaseError = errorHandler.handleDatabaseError(dbError, context);
            errors.push(databaseError);
          }
        } catch (validationError) {
          const errorMessage = validationError instanceof Error ? validationError.message : 'Unknown validation error';

          // Handle validation errors using centralized error handler
          // Note: These are validation failures on actual data rows (empty rows already filtered out)
          const validationErrors = errorHandler.handleValidationError(validationError, row, rowIndex + 1);
          errors.push(...validationErrors);

          // Log validation exception at DEBUG level for debugging
          logger.import.debug(`Validation exception for data row ${rowIndex + 1}`, {
            batchId,
            rowNumber: rowIndex + 1,
            errorMessage,
            errorType: validationError instanceof Error ? validationError.constructor.name : typeof validationError
          });

          // If we're getting too many consecutive errors, something is systematically wrong
          const recentErrors = errors.filter(e => e.rowNumber > rowIndex - 10).length;
          if (recentErrors >= 8) {
            throw new Error(`Too many consecutive validation errors around row ${rowIndex + 1}. Last error: ${errorMessage}`);
          }

          // Continue processing other rows
          continue;
        }
      }

      logger.upload.info('COMMITTING TRANSACTION', {
        batchSize: batch.length,
        successfulRecords,
        failedRecords: errors.length,
        batchId
      });
    });

    logger.import.info('BATCH TRANSACTION COMMITTED SUCCESSFULLY', {
      batchSize: batch.length,
      successfulRecords,
      failedRecords: errors.length,
      startIndex,
      endIndex: startIndex + batch.length - 1
    });

    return { successfulRecords, errors, duplicatesSkipped };
  }

  /**
   * Verify import results match database state
   * Private method to ensure data integrity after import
   */
  private async verifyImportResults(
    batchId: string, 
    computedSuccessful: number, 
    failedRecords: number
  ): Promise<void> {
    try {
      const { prisma } = await import('../database');
      const persistedActivities = await prisma.caseActivity.count({
        where: { importBatchId: batchId },
      });

      logger.import.info('Verification check', {
        batchId,
        computedSuccessful,
        persistedActivities,
        match: persistedActivities === computedSuccessful
      });

      if (persistedActivities !== computedSuccessful) {
        const mismatchMessage = `Verification mismatch: computed successfulRecords=${computedSuccessful} but persisted caseActivity rows=${persistedActivities}`;
        logger.error('general', mismatchMessage, { 
          batchId, 
          computed: computedSuccessful, 
          persisted: persistedActivities 
        });

        // Update batch status to failed - but preserve the statistics
        await batchService.updateBatchStatus(batchId, 'FAILED');

        // Update cache status as failed using JobService
        await jobService.setVerificationFailureStatus(
          batchId,
          computedSuccessful,
          persistedActivities,
          failedRecords
        );
      } else {
        logger.info('general', 'Import verification succeeded: persisted records match computed counts', { 
          batchId, 
          persistedActivities 
        });
      }
    } catch (verificationError) {
      logger.error('general', 'Failed to run import verification:', verificationError);
      await jobService.setFailureStatus(
        batchId,
        'Import verification failed due to system error',
        { error: verificationError instanceof Error ? verificationError.message : String(verificationError) }
      );
    }
  }

  /**
   * Check if an activity would be a duplicate before processing the row
   * This prevents creating case records when the activity already exists
   */
  private async checkForDuplicateActivity(row: CaseReturnRow, tx: Transaction): Promise<boolean> {
    try {
      // Validate required fields for activity duplicate check
      if (!row.date_dd || !row.date_mon || !row.date_yyyy) {
        logger.import.debug('Cannot check for duplicate activity: missing date fields');
        return false; // Not a duplicate if we can't check
      }
      if (!row.judge_1) {
        logger.import.debug('Cannot check for duplicate activity: missing judge_1');
        return false; // Not a duplicate if we can't check
      }

      // Create activity date for comparison
      let activityDate: Date;
      try {
        activityDate = createDateFromParts(row.date_dd, row.date_mon, row.date_yyyy);
      } catch (error) {
        logger.import.debug('Cannot check for duplicate activity: invalid date', { error });
        return false; // Not a duplicate if date is invalid
      }

      // Extract judge for comparison
      const { extractAndNormalizeJudge } = await import('../data/extraction');
      const primaryJudge = await extractAndNormalizeJudge(row.judge_1, tx);

      // Create case number for lookup
      const { createCaseNumber } = await import('../data/extraction');
      const caseNumber = createCaseNumber(row.caseid_type, row.caseid_no);

      // Find existing case
      const existingCase = await tx.case.findFirst({
        where: {
          caseNumber,
          courtName: row.court
        },
      });

      if (!existingCase) {
        logger.import.debug('No existing case found for duplicate check', { caseNumber, courtName: row.court });
        return false; // Not a duplicate if case doesn't exist
      }

      // Check for existing identical activity
      const existingActivity = await tx.caseActivity.findFirst({
        where: {
          caseId: existingCase.id,
          activityDate: activityDate,
          activityType: row.comingfor || 'Unknown',
          primaryJudgeId: primaryJudge.judgeId,
        },
      });

      if (existingActivity) {
        logger.database.info('Duplicate activity detected - skipping row processing', {
          caseId: existingCase.id,
          caseNumber,
          activityDate: activityDate.toISOString(),
          activityType: row.comingfor || 'Unknown',
          primaryJudgeId: primaryJudge.judgeId,
          existingActivityId: existingActivity.id,
        });
        return true; // This is a duplicate
      }

      return false; // Not a duplicate
    } catch (error) {
      logger.import.warn('Error checking for duplicate activity, proceeding with processing', { error });
      return false; // On error, assume not duplicate to avoid blocking valid imports
    }
  }

  /**
   * Handle import failure
   * Private method to handle and log import failures consistently
   */
  private async handleImportFailure(
    error: unknown,
    batchId: string,
    totalRecords: number,
    successfulRecords: number,
    errors: ImportError[]
  ): Promise<void> {
    const errorMessage = error instanceof Error ? error.message : 'Unknown system error';
    logger.import.error('Critical import processing failure', {
      batchId,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      errorMessage,
      totalRecords
    });
    logger.error('general', 'Successful Records:', successfulRecords);
    logger.error('general', 'Failed Records (validation failures on actual data):', errors.length);
    
    if (error instanceof Error && error.stack) {
      logger.error('general', 'Stack Trace:');
      logger.import.error('Error stack trace', { stack: error.stack });
    }

    // Use centralized error handler for user-friendly messages and categorization
    const userFriendlyMessage = errorHandler.formatUserFriendlyError(error as Error);
    const errorType = errorHandler.categorizeError(error as Error);

    // Mark import as failed with detailed error info
    logger.import.info('Marking batch as failed', {
      batchId,
      failureReason: errorMessage,
      systemError: errorType,
      userMessage: userFriendlyMessage
    });
    
    try {
      await batchService.updateBatchStatus(batchId, 'FAILED');
      logger.import.info('FAILED BATCH STATUS COMMITTED', { batchId });
    } catch (updateError) {
      logger.error('general', 'Failed to update batch status to FAILED:', updateError);
    }

    await jobService.setFailureStatus(batchId, userFriendlyMessage, {
      totalAttempted: totalRecords,
      successful: successfulRecords,
      failed: errors.length,
      errorType,
      sampleErrors: errors.slice(0, 3).map(e => `Row ${e.rowNumber}: ${e.errorMessage}`)
    });
  }
}

// Export singleton instance
export const importService = new ImportServiceImpl();
export default importService;