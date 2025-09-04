import { createReadStream } from 'fs';
import { createHash } from 'crypto';
import csv from 'csv-parser';
import { CourtType } from '@prisma/client';
import {
  CaseReturnRowSchema,
  CaseReturnRow,
  createDateFromParts
} from '../validation/schemas';
import {
  extractAndNormalizeCourt,
  extractAndNormalizeJudge,
  extractAndNormalizeCaseType,
  extractJudgesFromRow,
  createCaseNumber,
  determineCustodyStatus,
  MasterDataTracker
} from '../data/extraction';
import { prisma, withTransaction, ImportJobData } from '../database';
import { importQueue, cacheManager } from '../database/redis';

/**
 * Derives CourtType from caseid_type prefix according to CSV data structure requirements.
 * Rules from requirements.md:
 * - Check for 3-letter SCC first to avoid conflict with SC (Supreme Court)
 * - Then check 2-letter prefixes for other court types
 * - Default to TC (Tribunal Court) for unmatched prefixes
 */
export function deriveCourtTypeFromCaseId(caseidType: string): CourtType {
  if (!caseidType || typeof caseidType !== 'string') {
    return CourtType.TC; // Default fallback
  }

  const prefix = caseidType.toUpperCase().trim();

  // Check for 3-letter SCC first to avoid SC conflict
  if (prefix.startsWith('SCC')) {
    return CourtType.SCC;
  }

  // Check 2-letter prefixes
  const twoLetterPrefix = prefix.substring(0, 2);

  switch (twoLetterPrefix) {
    case 'SC':
      return CourtType.SC;
    case 'EL':
      // Check if it's ELC or ELRC
      return prefix.startsWith('ELC') ? CourtType.ELC : CourtType.ELRC;
    case 'KC':
      return CourtType.KC;
    case 'CO':
      return CourtType.COA;
    case 'MC':
      return CourtType.MC;
    case 'HC':
      return CourtType.HC;
    default:
      return CourtType.TC; // Default for unmatched prefixes
  }
}

// Import result interfaces
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

export interface ImportError {
  rowNumber: number;
  errorType: string;
  errorMessage: string;
  rawData?: any;
}

// Main import initiation function
export async function initiateDailyImport(
  filePath: string,
  filename: string,
  fileSize: number,
  userId: string
): Promise<{ success: boolean; batchId: string }> {
  try {
    // Calculate file checksum
    const checksum = await calculateFileChecksum(filePath);

    // Check for duplicate imports, but exclude failed or empty imports
    const existingImport = await prisma.dailyImportBatch.findFirst({
      where: {
        fileChecksum: checksum,
        status: { in: ['COMPLETED', 'PROCESSING'] },
        // Only consider as duplicate if it had some successful records
        successfulRecords: { gt: 0 }
      }
    });

    if (existingImport) {
      throw new Error(`File has already been imported successfully. Batch ID: ${existingImport.id}`);
    }

    // Create import batch record
    console.log('Creating import batch with data:', {
      filename,
      fileSize,
      checksum,
      userId
    });
    
    const importBatch = await prisma.dailyImportBatch.create({
      data: {
        importDate: new Date(),
        filename,
        fileSize,
        fileChecksum: checksum,
        totalRecords: 0,
        successfulRecords: 0,
        failedRecords: 0,
        errorLogs: [],
        status: 'PENDING',
        createdBy: userId,
      },
    });

    console.log('✅ Import batch created in database:', {
      id: importBatch.id,
      status: importBatch.status,
      createdAt: importBatch.createdAt
    });

    // Verify the batch was actually created
    const verifyBatch = await prisma.dailyImportBatch.findUnique({
      where: { id: importBatch.id }
    });
    console.log('🔍 Batch verification:', verifyBatch ? 'Found in database' : 'NOT FOUND in database');
    
    console.log('Import batch created successfully:', {
      id: importBatch.id,
      status: importBatch.status,
      createdAt: importBatch.createdAt
    });

    // Add job to queue for background processing
    console.log('📤 Adding job to queue:', {
      jobType: 'process-csv-import',
      batchId: importBatch.id,
      filePath,
      filename
    });

    const job = await importQueue.add('process-csv-import', {
      filePath,
      filename,
      fileSize,
      checksum,
      userId,
      batchId: importBatch.id,
    } as ImportJobData);

    console.log('✅ Job added to queue:', {
      jobId: job.id,
      batchId: importBatch.id
    });

    return { success: true, batchId: importBatch.id };
  } catch (error) {
    console.error('Failed to initiate import:', error);
    throw new Error('Failed to initiate import process');
  }
}

// Background job processor
export async function processCsvImport(jobData: ImportJobData): Promise<void> {
  console.log('🚀 BACKGROUND JOB STARTED:', {
    batchId: jobData.batchId,
    filePath: jobData.filePath,
    filename: jobData.filename,
    timestamp: new Date().toISOString()
  });

  const { filePath, batchId } = jobData;
  const errors: ImportError[] = [];
  const masterDataTracker = new MasterDataTracker();

  let totalRecords = 0;
  let successfulRecords = 0;

  try {
    // Verify the batch exists before processing
    const batch = await prisma.dailyImportBatch.findUnique({
      where: { id: batchId }
    });
    
    if (!batch) {
      throw new Error(`Import batch ${batchId} not found in database`);
    }
    
    console.log('✅ Batch found for processing:', {
      id: batch.id,
      status: batch.status,
      filename: batch.filename
    });
    // Update status to processing
    await prisma.dailyImportBatch.update({
      where: { id: batchId },
      data: { status: 'PROCESSING' },
    });

    // Update cache with processing status
    await cacheManager.setImportStatus(batchId, {
      status: 'PROCESSING',
      progress: 5,
      message: 'Reading CSV file...'
    });

    // Read and parse CSV file
    const csvData: any[] = await readCsvFile(filePath);
    totalRecords = csvData.length;

    // Update progress
    await cacheManager.setImportStatus(batchId, {
      status: 'PROCESSING',
      progress: 10,
      message: `Processing ${totalRecords} records...`
    });

    // Process each row in batches
    const batchSize = 100;
    const totalBatches = Math.ceil(csvData.length / batchSize);

    // Early validation check - test first few rows to catch common issues
    const sampleSize = Math.min(5, csvData.length);
    let earlyValidationErrors = 0;

    for (let i = 0; i < sampleSize; i++) {
      try {
        const testRow = csvData[i];

        // Test schema validation
        CaseReturnRowSchema.parse(testRow);

      } catch (error) {
        earlyValidationErrors++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';

        // If too many early validation errors, fail fast
        if (earlyValidationErrors >= 3) {
          throw new Error(`Early validation failed: ${earlyValidationErrors} errors in first ${sampleSize} rows. Common error: ${errorMessage}`);
        }
      }
    }

    for (let i = 0; i < csvData.length; i += batchSize) {
      const batch = csvData.slice(i, i + batchSize);

      try {
        const batchResult = await processBatch(batch, i, batchId, masterDataTracker);
        successfulRecords += batchResult.successfulRecords;
        errors.push(...batchResult.errors);

      } catch (error) {
        console.error(`Batch processing failed:`, error);
      }

      // Update progress
      const progress = Math.floor(((i + batchSize) / totalRecords) * 80) + 10;
      await cacheManager.setImportStatus(batchId, {
        status: 'PROCESSING',
        progress,
        message: `Processed ${Math.min(i + batchSize, totalRecords)} of ${totalRecords} records...`
      });
    }

    // Update final status
    const failedPercentage = (errors.length / totalRecords) * 100;
    
    // Only mark as COMPLETED if at least some records were imported successfully
    let finalStatus: 'COMPLETED' | 'FAILED' = 'COMPLETED';
    if (successfulRecords === 0 && totalRecords > 0) {
      finalStatus = 'FAILED'; // Complete failure - no records imported
    } else if (failedPercentage >= 95) {
      finalStatus = 'FAILED'; // If 95% or more records failed, consider the import failed
    } else if (errors.length === totalRecords) {
      finalStatus = 'FAILED'; // All records failed
    }
    
    const finalBatchData = {
      totalRecords,
      successfulRecords,
      failedRecords: errors.length,
      errorLogs: JSON.parse(JSON.stringify(errors.map(err => ({
        rowNumber: err.rowNumber,
        errorType: err.errorType,
        errorMessage: err.errorMessage
      })))),
      status: finalStatus,
      completedAt: new Date(),
    };

    console.log('📝 UPDATING FINAL BATCH STATUS:', {
      batchId,
      updateData: {
        ...finalBatchData,
        completedAt: finalBatchData.completedAt.toISOString(),
        errorLogsCount: finalBatchData.errorLogs.length,
        sampleErrors: finalBatchData.errorLogs.slice(0, 3)
      }
    });
    
    const updatedBatch = await prisma.dailyImportBatch.update({
      where: { id: batchId },
      data: finalBatchData,
    });
    
    console.log('✅ FINAL BATCH STATUS COMMITTED:', {
      id: updatedBatch.id,
      status: updatedBatch.status,
      totalRecords: updatedBatch.totalRecords,
      successfulRecords: updatedBatch.successfulRecords,
      failedRecords: updatedBatch.failedRecords,
      completedAt: updatedBatch.completedAt
    });

    // Update cache with final status
    await cacheManager.setImportStatus(batchId, {
      status: finalStatus,
      progress: 100,
      message: `Import completed. ${successfulRecords} successful, ${errors.length} failed.`,
      stats: masterDataTracker.getStats()
    });

    // Invalidate dashboard cache since data has changed
    await cacheManager.invalidateDashboardCache();

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown system error';
    console.error('='.repeat(80));
    console.error('IMPORT PROCESSING FAILED');
    console.error('='.repeat(80));
    console.error('Batch ID:', batchId);
    console.error('Error Type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error Message:', errorMessage);
    console.error('Total Records Attempted:', totalRecords);
    console.error('Successful Records:', successfulRecords);
    console.error('Failed Records:', errors.length);
    
    if (error instanceof Error && error.stack) {
      console.error('Stack Trace:');
      console.error(error.stack);
    }
    console.error('='.repeat(80));

    // Determine error type for better user feedback
    let userFriendlyMessage = 'Import failed due to system error';
    let errorType = 'system_error';

    if (errorMessage.includes('Early validation failed')) {
      userFriendlyMessage = 'Import failed: Multiple validation errors detected in the first few rows. Please check your CSV data format.';
      errorType = 'early_validation_failure';
    } else if (errorMessage.includes('Too many consecutive')) {
      userFriendlyMessage = 'Import failed: Too many consecutive validation errors detected. Please review your CSV data quality.';
      errorType = 'consecutive_validation_failures';
    } else if (errorMessage.includes('Invalid date')) {
      userFriendlyMessage = 'Import failed: Date format validation errors. Please check date fields in your CSV.';
      errorType = 'date_validation_error';
    } else if (errorMessage.includes('Missing required fields')) {
      userFriendlyMessage = 'Import failed: Required fields are missing. Please check your CSV headers and data.';
      errorType = 'missing_fields_error';
    }

    const failedBatchData = {
      status: 'FAILED' as const,
      totalRecords,
      successfulRecords,
      failedRecords: errors.length,
      errorLogs: [
        {
          rowNumber: 0,
          errorType,
          errorMessage: userFriendlyMessage,
        },
        // Map the first 10 errors to a safe format
        ...errors.slice(0, 10).map(err => ({
          rowNumber: err.rowNumber,
          errorType: err.errorType,
          errorMessage: err.errorMessage
        }))
      ],
      completedAt: new Date(),
    };

    // Mark import as failed with detailed error info
    console.log('📝 MARKING BATCH AS FAILED:', {
      batchId,
      failureReason: errorMessage,
      updateData: {
        ...failedBatchData,
        completedAt: failedBatchData.completedAt.toISOString(),
        errorLogsCount: failedBatchData.errorLogs.length,
        systemError: errorType,
        userMessage: userFriendlyMessage
      }
    });
    
    try {
      const failedBatch = await prisma.dailyImportBatch.update({
        where: { id: batchId },
        data: failedBatchData,
      });
    
      console.log('✅ FAILED BATCH STATUS COMMITTED:', {
        id: failedBatch.id,
        status: failedBatch.status,
        totalRecords: failedBatch.totalRecords,
        successfulRecords: failedBatch.successfulRecords,
        failedRecords: failedBatch.failedRecords,
        completedAt: failedBatch.completedAt
      });
  } catch (updateError) {
    console.error('Failed to update batch status to FAILED:', updateError);
  }

    await cacheManager.setImportStatus(batchId, {
      status: 'FAILED',
      progress: 0,
      message: userFriendlyMessage,
      errorDetails: {
        totalAttempted: totalRecords,
        successful: successfulRecords,
        failed: errors.length,
        errorType,
        sampleErrors: errors.slice(0, 3).map(e => `Row ${e.rowNumber}: ${e.errorMessage}`)
      }
    });
  }
}

// Process a batch of CSV rows
async function processBatch(
  batch: any[],
  startIndex: number,
  batchId: string,
  masterDataTracker: MasterDataTracker
): Promise<{ successfulRecords: number; errors: ImportError[] }> {

  const errors: ImportError[] = [];
  let successfulRecords = 0;

  console.log('🔄 STARTING BATCH TRANSACTION:', {
    batchSize: batch.length,
    startIndex,
    endIndex: startIndex + batch.length - 1,
    batchId
  });

  // Process batch in a transaction
  await withTransaction(async (tx) => {
    console.log('📦 TRANSACTION STARTED - Processing batch rows...');
    
    for (let i = 0; i < batch.length; i++) {
      const rowIndex = startIndex + i;
      const row = batch[i];

      console.log(`\n--- ROW ${rowIndex + 1} PROCESSING ---`);
      console.log('Raw CSV data:', {
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
        console.log('🔍 VALIDATING ROW DATA:', {
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

        // Validate row data
        const validatedRow = CaseReturnRowSchema.parse(row);
        console.log('✅ Row validation passed:', {
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

        // Create or update case
        try {
          const caseResult = await createOrUpdateCase(validatedRow, tx, masterDataTracker);

          // Create case activity
          await createCaseActivity(validatedRow, caseResult.caseId, batchId, tx, masterDataTracker);

          successfulRecords++;
          console.log(`✅ ROW ${rowIndex + 1} PROCESSED SUCCESSFULLY`);
        } catch (dbError) {
          // Handle database-specific errors with more detail
          let errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error';
          let errorType = 'database_error';
          
          // Enhance error messages for common database issues
          if (errorMessage.includes('Invalid `tx.case.create()`')) {
            errorType = 'case_create_error';
            errorMessage = 'Failed to create case record. Please check required fields.';
            // Log the full error for debugging
            console.error(`Row ${rowIndex + 1} - Case creation error:`, dbError);
          } else if (errorMessage.includes('Foreign key constraint')) {
            errorType = 'foreign_key_error';
            errorMessage = 'Referenced record not found. Check court or case type values.';
          }
          
          errors.push({
            rowNumber: rowIndex + 1,
            errorType,
            errorMessage,
            rawData: row,
          });
        }
      } catch (validationError) {
        const errorMessage = validationError instanceof Error ? validationError.message : 'Unknown validation error';

        // Categorize error types for better handling
        let errorType = 'validation_error';
        if (errorMessage.includes('Invalid date') || errorMessage.includes('date')) {
          errorType = 'date_validation_error';
        } else if (errorMessage.includes('Missing required fields')) {
          errorType = 'missing_fields_error';
        } else if (errorMessage.includes('Invalid')) {
          errorType = 'data_format_error';
        }

        console.log(`❌ ROW ${rowIndex + 1} VALIDATION FAILED:`, {
          errorType,
          errorMessage,
          validationDetails: validationError,
          rawDataKeys: Object.keys(row),
          rawDataSample: {
            court: row.court,
            caseid_type: row.caseid_type,
            caseid_no: row.caseid_no,
            case_type: row.case_type,
            judge_1: row.judge_1,
            date_dd: row.date_dd,
            date_mon: row.date_mon,
            date_yyyy: row.date_yyyy
          },
          fullRawData: row
        });

        errors.push({
          rowNumber: rowIndex + 1,
          errorType,
          errorMessage,
          rawData: row,
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

    console.log('💾 COMMITTING TRANSACTION:', {
      batchSize: batch.length,
      successfulRecords,
      failedRecords: errors.length,
      batchId
    });
  });

  console.log('✅ BATCH TRANSACTION COMMITTED SUCCESSFULLY:', {
    batchSize: batch.length,
    successfulRecords,
    failedRecords: errors.length,
    startIndex,
    endIndex: startIndex + batch.length - 1
  });

  return { successfulRecords, errors };
}

// Create or update case record
interface CaseCreationResult {
  caseId: string;
  isNewCase: boolean;
}

async function createOrUpdateCase(
  row: CaseReturnRow,
  tx: any,
  masterDataTracker: MasterDataTracker
): Promise<CaseCreationResult> {

  // Validate required fields are present
  if (!row.caseid_type || !row.caseid_no) {
    throw new Error('Missing required fields: caseid_type and caseid_no are required');
  }
  if (!row.filed_dd || !row.filed_mon || !row.filed_yyyy) {
    throw new Error('Missing required date fields: filed_dd, filed_mon, filed_yyyy are required');
  }
  if (!row.case_type) {
    throw new Error('Missing required field: case_type is required');
  }

  const caseNumber = createCaseNumber(row.caseid_type, row.caseid_no);
  let filedDate: Date;
  try {
    filedDate = createDateFromParts(row.filed_dd, row.filed_mon, row.filed_yyyy);
  } catch (error) {
    throw new Error(`Invalid filed date: ${row.filed_dd}/${row.filed_mon}/${row.filed_yyyy} - ${error instanceof Error ? error.message : 'Unknown date error'}`);
  }

  // Extract and normalize master data
  const caseTypeId = await extractAndNormalizeCaseType(row.case_type, tx);
  masterDataTracker.trackCaseType(false); // We'll track this properly later

  // Extract current court directly from 'court' column
  // Use court type derivation from caseid_type if available
  const derivedCourtType = row.caseid_type ? deriveCourtTypeFromCaseId(row.caseid_type) : undefined;
  const currentCourtResult = await extractAndNormalizeCourt(row.court, undefined, tx, derivedCourtType);
  if (currentCourtResult) {
    masterDataTracker.trackCourt(currentCourtResult.isNewCourt);
  }

  // Extract original court (for appeals only)
  const originalCourtResult = await extractAndNormalizeCourt(
    row.original_court,
    row.original_code,
    tx
  );
  if (originalCourtResult) {
    masterDataTracker.trackCourt(originalCourtResult.isNewCourt);
  }

  // Check if case exists
  const existingCase = await tx.case.findUnique({
    where: { caseNumber },
  });

  if (existingCase) {
    // Prepare update data for logging
    const updateData = {
      lastActivityDate: new Date(),
      totalActivities: { increment: 1 },
      caseAgeDays: Math.floor((Date.now() - filedDate.getTime()) / (1000 * 60 * 60 * 24)),
      hasLegalRepresentation: row.legalrep === 'Yes',
    };

    console.log('📝 UPDATING EXISTING CASE:', {
      existingCaseId: existingCase.id,
      caseNumber: existingCase.caseNumber,
      currentTotalActivities: existingCase.totalActivities,
      updateData: {
        ...updateData,
        lastActivityDate: updateData.lastActivityDate.toISOString(),
        totalActivities: `${existingCase.totalActivities} + 1 = ${existingCase.totalActivities + 1}`
      },
      originalData: {
        caseid_type: row.caseid_type,
        caseid_no: row.caseid_no,
        legalrep: row.legalrep
      }
    });

    // Update existing case
    const updatedCase = await tx.case.update({
      where: { id: existingCase.id },
      data: updateData,
    });

    console.log('✅ CASE UPDATED SUCCESSFULLY:', {
      id: updatedCase.id,
      caseNumber: updatedCase.caseNumber,
      newTotalActivities: updatedCase.totalActivities,
      lastActivityDate: updatedCase.lastActivityDate
    });

    return { caseId: updatedCase.id, isNewCase: false };
  } else {
  // Ensure all numeric fields have default values to prevent null errors
  const safeNumericValue = (value: any): number => {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Safely handle numeric fields
  const maleApp = safeNumericValue(row.male_applicant);
  const femaleApp = safeNumericValue(row.female_applicant);
  const orgApp = safeNumericValue(row.organization_applicant);
  const maleDef = safeNumericValue(row.male_defendant);
  const femaleDef = safeNumericValue(row.female_defendant);
  const orgDef = safeNumericValue(row.organization_defendant);
  
  // Prepare case data for logging
  const caseData = {
    caseNumber,
    caseTypeId,
    filedDate,
    originalCourtId: originalCourtResult?.courtId || null,
    originalCaseNumber: row.original_number || null,
    originalYear: row.original_year ? (typeof row.original_year === 'string' ? parseInt(row.original_year, 10) : row.original_year) : null,
    // Required parties JSON field
    parties: {
      applicants: {
        male: maleApp,
        female: femaleApp,
        organization: orgApp,
        total: maleApp + femaleApp + orgApp
      },
      defendants: {
        male: maleDef,
        female: femaleDef,
        organization: orgDef,
        total: maleDef + femaleDef + orgDef
      }
    },
    // Use individual party count fields
    maleApplicant: maleApp,
    femaleApplicant: femaleApp,
    organizationApplicant: orgApp,
    maleDefendant: maleDef,
    femaleDefendant: femaleDef,
    organizationDefendant: orgDef,
    // CSV-specific fields
    caseidType: row.caseid_type || '',
    caseidNo: row.caseid_no || '',
    status: 'ACTIVE',
    caseAgeDays: Math.floor((Date.now() - filedDate.getTime()) / (1000 * 60 * 60 * 24)),
    lastActivityDate: new Date(),
    totalActivities: 1,
    hasLegalRepresentation: row.legalrep === 'Yes',
  };

  console.log('📝 CREATING NEW CASE:', {
    caseNumber: caseData.caseNumber,
    caseTypeId: caseData.caseTypeId,
    filedDate: caseData.filedDate.toISOString(),
    parties: caseData.parties,
    originalData: {
      caseid_type: row.caseid_type,
      caseid_no: row.caseid_no,
      case_type: row.case_type,
      court: row.court,
      filed_date: `${row.filed_dd}/${row.filed_mon}/${row.filed_yyyy}`,
      legalrep: row.legalrep
    }
  });

  // Create new case
  const newCase = await tx.case.create({
    data: caseData,
  });

  console.log('✅ CASE CREATED SUCCESSFULLY:', {
    id: newCase.id,
    caseNumber: newCase.caseNumber,
    status: newCase.status,
    createdAt: newCase.createdAt
  });

    // Create judge assignments
    const judges = extractJudgesFromRow(row);

    for (let i = 0; i < judges.length; i++) {
      const judgeResult = await extractAndNormalizeJudge(judges[i], tx);
      masterDataTracker.trackJudge(judgeResult.isNewJudge);

      const assignmentData = {
        caseId: newCase.id,
        judgeId: judgeResult.judgeId,
        isPrimary: i === 0, // First judge is primary
      };

      console.log('📝 CREATING JUDGE ASSIGNMENT:', {
        caseId: assignmentData.caseId,
        judgeId: assignmentData.judgeId,
        isPrimary: assignmentData.isPrimary,
        judgeName: judges[i],
        isNewJudge: judgeResult.isNewJudge
      });

      const assignment = await tx.caseJudgeAssignment.create({
        data: assignmentData,
      });

      console.log('✅ JUDGE ASSIGNMENT CREATED:', {
        id: assignment.id,
        caseId: assignment.caseId,
        judgeId: assignment.judgeId,
        isPrimary: assignment.isPrimary
      });
    }

    return { caseId: newCase.id, isNewCase: true };
  }
}

// Create case activity record
async function createCaseActivity(
  row: CaseReturnRow,
  caseId: string,
  importBatchId: string,
  tx: any,
  masterDataTracker: MasterDataTracker
): Promise<void> {

  // Validate required fields for activity
  if (!row.date_dd || !row.date_mon || !row.date_yyyy) {
    throw new Error('Missing required date fields: date_dd, date_mon, date_yyyy are required for activity');
  }
  if (!row.judge_1) {
    throw new Error('Missing required field: judge_1 is required for activity');
  }

  let activityDate: Date;
  try {
    activityDate = createDateFromParts(row.date_dd, row.date_mon, row.date_yyyy);
  } catch (error) {
    throw new Error(`Invalid activity date: ${row.date_dd}/${row.date_mon}/${row.date_yyyy} - ${error instanceof Error ? error.message : 'Unknown date error'}`);
  }
  const primaryJudge = await extractAndNormalizeJudge(row.judge_1, tx);
  masterDataTracker.trackJudge(primaryJudge.isNewJudge);

  let nextHearingDate: Date | undefined;
  if (row.next_dd && row.next_mon && row.next_yyyy) {
    try {
      nextHearingDate = createDateFromParts(row.next_dd, row.next_mon, row.next_yyyy);
    } catch (error) {
      nextHearingDate = undefined; // Skip invalid next hearing dates
    }
  }

  // Prepare activity data for logging
  const activityData = {
    caseId,
    activityDate,
    activityType: row.comingfor,
    outcome: row.outcome,
    reasonForAdjournment: row.reason_adj,
    nextHearingDate,
    primaryJudgeId: primaryJudge.judgeId,
    hasLegalRepresentation: row.legalrep === 'Yes',
    applicantWitnesses: row.applicant_witness,
    defendantWitnesses: row.defendant_witness,
    custodyStatus: determineCustodyStatus(row.custody),
    details: row.other_details,
    importBatchId,
    // Store multiple judges from CSV
    judge1: row.judge_1,
    judge2: row.judge_2,
    judge3: row.judge_3,
    judge4: row.judge_4,
    judge5: row.judge_5,
    judge6: row.judge_6,
    judge7: row.judge_7,
    // Store CSV-specific fields
    comingFor: row.comingfor,
    legalRepString: row.legalrep,
    custodyNumeric: row.custody,
    otherDetails: row.other_details,
  };

  console.log('📝 CREATING CASE ACTIVITY:', {
    caseId: activityData.caseId,
    activityDate: activityData.activityDate.toISOString(),
    activityType: activityData.activityType,
    outcome: activityData.outcome,
    primaryJudge: primaryJudge.judgeId,
    nextHearingDate: activityData.nextHearingDate?.toISOString(),
    originalData: {
      date: `${row.date_dd}/${row.date_mon}/${row.date_yyyy}`,
      comingfor: row.comingfor,
      outcome: row.outcome,
      judge_1: row.judge_1,
      custody: row.custody,
      legalrep: row.legalrep
    }
  });

  const createdActivity = await tx.caseActivity.create({
    data: activityData,
  });

  console.log('✅ CASE ACTIVITY CREATED SUCCESSFULLY:', {
    id: createdActivity.id,
    caseId: createdActivity.caseId,
    activityDate: createdActivity.activityDate,
    activityType: createdActivity.activityType
  });
}

// Utility functions
async function readCsvFile(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    try {
      const fs = require('fs');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length === 0) {
        resolve([]);
        return;
      }

      // Parse header line using the same parser
      const headerLine = lines[0];
      const headers = parseCSVLine(headerLine);
      
      console.log('📋 CSV HEADERS PARSED:', {
        count: headers.length,
        headers: headers,
        expectedHeaders: [
          'court', 'date_dd', 'date_mon', 'date_yyyy', 'caseid_type', 'caseid_no',
          'filed_dd', 'filed_mon', 'filed_yyyy', 'original_court', 'original_code',
          'original_number', 'original_year', 'case_type', 'judge_1', 'judge_2',
          'judge_3', 'judge_4', 'judge_5', 'judge_6', 'judge_7', 'comingfor',
          'outcome', 'reason_adj', 'next_dd', 'next_mon', 'next_yyyy',
          'male_applicant', 'female_applicant', 'organization_applicant',
          'male_defendant', 'female_defendant', 'organization_defendant',
          'legalrep', 'applicant_witness', 'defendant_witness', 'custody', 'other_details'
        ]
      });

      const results: any[] = [];

      // Parse data lines
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        try {
          // Custom CSV parsing to handle the specific format
          const values = parseCSVLine(line);
          
          console.log('🔍 RAW CSV LINE PARSED:', {
            rowNumber: i,
            lineLength: line.length,
            valuesCount: values.length,
            headersCount: headers.length,
            firstFewValues: values.slice(0, 8),
            sampleValues: {
              court: values[0],
              date_dd: values[1],
              date_mon: values[2],
              date_yyyy: values[3],
              caseid_type: values[4],
              caseid_no: values[5],
              judge_1: values[14]?.substring(0, 50) + (values[14]?.length > 50 ? '...' : '')
            }
          });

          // Create object from headers and values
          const rowData: any = {};
          for (let j = 0; j < headers.length; j++) {
            const key = headers[j];
            const value = j < values.length ? values[j] : '';
            
            let cleanValue = String(value || '')
              .trim()
              .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
              .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
              .trim();

            // Handle empty values and common null representations
            if (cleanValue === '' || 
                cleanValue === 'null' || 
                cleanValue === 'NULL' || 
                cleanValue === 'undefined' || 
                cleanValue === 'N/A' || 
                cleanValue === 'n/a' ||
                cleanValue === '0' && (key === 'next_dd' || key === 'next_mon' || key === 'next_yyyy')) {
              rowData[key] = undefined;
            } else {
              rowData[key] = cleanValue;
            }
          }

          // Ensure all expected headers are present
          const expectedHeaders = [
            'court', 'date_dd', 'date_mon', 'date_yyyy', 'caseid_type', 'caseid_no',
            'filed_dd', 'filed_mon', 'filed_yyyy', 'original_court', 'original_code',
            'original_number', 'original_year', 'case_type', 'judge_1', 'judge_2',
            'judge_3', 'judge_4', 'judge_5', 'judge_6', 'judge_7', 'comingfor',
            'outcome', 'reason_adj', 'next_dd', 'next_mon', 'next_yyyy',
            'male_applicant', 'female_applicant', 'organization_applicant',
            'male_defendant', 'female_defendant', 'organization_defendant',
            'legalrep', 'applicant_witness', 'defendant_witness', 'custody', 'other_details'
          ];

          // Add any missing headers as undefined
          for (const expectedHeader of expectedHeaders) {
            if (!(expectedHeader in rowData)) {
              rowData[expectedHeader] = undefined;
            }
          }

          console.log('✅ CLEANED CSV ROW:', {
            rowNumber: i,
            cleanedKeys: Object.keys(rowData),
            sampleData: {
              court: rowData.court,
              caseid_type: rowData.caseid_type,
              caseid_no: rowData.caseid_no,
              case_type: rowData.case_type,
              judge_1: rowData.judge_1?.substring(0, 50) + (rowData.judge_1?.length > 50 ? '...' : ''),
              date_dd: rowData.date_dd,
              date_mon: rowData.date_mon,
              date_yyyy: rowData.date_yyyy
            }
          });

          results.push(rowData);
        } catch (lineError) {
          console.error(`Error parsing line ${i}:`, lineError);
          console.error('Line content:', line);
        }
      }

      console.log(`📊 CSV PARSING COMPLETE: ${results.length} rows parsed`);
      resolve(results);
    } catch (error) {
      console.error('CSV file reading error:', error);
      reject(error);
    }
  });
}

// Custom CSV line parser to handle the specific format
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Escaped quote (double quote)
        current += '"';
        i += 2;
      } else {
        // Toggle quote state - don't include the quote in the value
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator - add current field and reset
      values.push(current.trim()); // Trim whitespace from field
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  // Add the last field
  values.push(current.trim());
  
  return values;
}

async function calculateFileChecksum(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    const stream = createReadStream(filePath);

    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

// Get import status
export async function getImportStatus(batchId: string): Promise<any> {
  // Check cache first
  const cachedStatus = await cacheManager.getImportStatus(batchId);
  if (cachedStatus) {
    return cachedStatus;
  }

  // Fallback to database
  const batch = await prisma.dailyImportBatch.findUnique({
    where: { id: batchId },
    select: {
      status: true,
      totalRecords: true,
      successfulRecords: true,
      failedRecords: true,
      createdAt: true,
      completedAt: true,
      errorLogs: true,
    },
  });

  if (!batch) {
    throw new Error('Import batch not found');
  }

  return {
    status: batch.status,
    progress: batch.status === 'COMPLETED' ? 100 : 0,
    message: `Import ${batch.status.toLowerCase()}`,
    totalRecords: batch.totalRecords,
    processedRecords: batch.successfulRecords + batch.failedRecords,
    successfulRecords: batch.successfulRecords,
    failedRecords: batch.failedRecords,
    errors: batch.errorLogs || [],
    startedAt: batch.createdAt?.toISOString() || null,
    completedAt: batch.completedAt?.toISOString() || null,
  };
}

// Get import history
export async function getImportHistory(limit: number = 20): Promise<any[]> {
  const batches = await prisma.dailyImportBatch.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });

  return batches.map(batch => ({
    id: batch.id,
    filename: batch.filename,
    status: batch.status,
    totalRecords: batch.totalRecords,
    successfulRecords: batch.successfulRecords,
    failedRecords: batch.failedRecords,
    createdAt: batch.createdAt?.toISOString() || null,
    completedAt: batch.completedAt?.toISOString() || null,
    createdBy: batch.user,
  }));
}