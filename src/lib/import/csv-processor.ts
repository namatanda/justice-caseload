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
    
    // Check for duplicate imports
    const existingImport = await prisma.dailyImportBatch.findFirst({
      where: {
        fileChecksum: checksum,
        status: { in: ['COMPLETED', 'PROCESSING'] }
      }
    });
    
    if (existingImport) {
      throw new Error(`File has already been imported. Batch ID: ${existingImport.id}`);
    }
    
    // Create import batch record
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

    // Add job to queue for background processing
    await importQueue.add('process-csv-import', {
      filePath,
      filename,
      fileSize,
      checksum,
      userId,
      batchId: importBatch.id,
    } as ImportJobData);

    return { success: true, batchId: importBatch.id };
  } catch (error) {
    console.error('Failed to initiate import:', error);
    throw new Error('Failed to initiate import process');
  }
}

// Background job processor
export async function processCsvImport(jobData: ImportJobData): Promise<void> {
  const { filePath, batchId } = jobData;
  const errors: ImportError[] = [];
  const masterDataTracker = new MasterDataTracker();
  
  let totalRecords = 0;
  let successfulRecords = 0;

  try {
    // Update status to processing
    await prisma.dailyImportBatch.update({
      where: { id: batchId },
      data: { status: 'PROCESSING' },
    });

    // Update cache with processing status
    await cacheManager.setImportStatus(batchId, {
      status: 'PROCESSING',
      progress: 0,
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
    const batchSize = 100; // Process 100 rows at a time
    for (let i = 0; i < csvData.length; i += batchSize) {
      const batch = csvData.slice(i, i + batchSize);
      
      try {
        const batchResult = await processBatch(batch, i, batchId, masterDataTracker);
        successfulRecords += batchResult.successfulRecords;
        errors.push(...batchResult.errors);
      } catch (error) {
        console.error(`Failed to process batch starting at row ${i}:`, error);
        // Continue with next batch
      }

      // Update progress
      const progress = Math.floor(((i + batchSize) / totalRecords) * 80) + 10; // 10-90%
      await cacheManager.setImportStatus(batchId, {
        status: 'PROCESSING',
        progress,
        message: `Processed ${Math.min(i + batchSize, totalRecords)} of ${totalRecords} records...`
      });
    }

    // Update final status
    const finalStatus = errors.length === totalRecords ? 'FAILED' : 'COMPLETED';
    await prisma.dailyImportBatch.update({
      where: { id: batchId },
      data: {
        totalRecords,
        successfulRecords,
        failedRecords: errors.length,
        errorLogs: JSON.parse(JSON.stringify(errors)),
        status: finalStatus,
        completedAt: new Date(),
      },
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
    console.error('Import processing failed:', error);
    
    // Mark import as failed
    await prisma.dailyImportBatch.update({
      where: { id: batchId },
      data: {
        status: 'FAILED',
        errorLogs: [{
          rowNumber: 0,
          errorType: 'system_error',
          errorMessage: error instanceof Error ? error.message : 'Unknown system error',
        }],
        completedAt: new Date(),
      },
    });

    await cacheManager.setImportStatus(batchId, {
      status: 'FAILED',
      progress: 0,
      message: 'Import failed due to system error'
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

  // Process batch in a transaction
  await withTransaction(async (tx) => {
    for (let i = 0; i < batch.length; i++) {
      const rowIndex = startIndex + i;
      const row = batch[i];
      
      try {
        // Validate row data
        const validatedRow = CaseReturnRowSchema.parse(row);
        
        // Create or update case
        const caseResult = await createOrUpdateCase(validatedRow, tx, masterDataTracker);
        
        // Create case activity
        await createCaseActivity(validatedRow, caseResult.caseId, batchId, tx, masterDataTracker);
        
        successfulRecords++;
      } catch (error) {
        errors.push({
          rowNumber: rowIndex + 1,
          errorType: 'validation_error',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          rawData: row,
        });
      }
    }
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
  const filedDate = createDateFromParts(row.filed_dd, row.filed_mon, row.filed_yyyy);

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
    // Update existing case
    const updatedCase = await tx.case.update({
      where: { id: existingCase.id },
      data: {
        lastActivityDate: new Date(),
        totalActivities: { increment: 1 },
        caseAgeDays: Math.floor((Date.now() - filedDate.getTime()) / (1000 * 60 * 60 * 24)),
        hasLegalRepresentation: row.legalrep === 'Yes',
      },
    });
    
    return { caseId: updatedCase.id, isNewCase: false };
  } else {
    // Create new case
    const newCase = await tx.case.create({
      data: {
        caseNumber,
        caseTypeId,
        filedDate,
        originalCourtId: originalCourtResult?.courtId || null,
        originalCaseNumber: row.original_number,
        originalYear: row.original_year,
        // Use individual party count fields instead of JSON
        maleApplicant: row.male_applicant,
        femaleApplicant: row.female_applicant,
        organizationApplicant: row.organization_applicant,
        maleDefendant: row.male_defendant,
        femaleDefendant: row.female_defendant,
        organizationDefendant: row.organization_defendant,
        // CSV-specific fields
        caseidType: row.caseid_type,
        caseidNo: row.caseid_no,
        status: 'ACTIVE',
        caseAgeDays: Math.floor((Date.now() - filedDate.getTime()) / (1000 * 60 * 60 * 24)),
        lastActivityDate: new Date(),
        totalActivities: 1,
        hasLegalRepresentation: row.legalrep === 'Yes',
      },
    });
    
    // Create judge assignments
    const judges = extractJudgesFromRow(row);
    
    for (let i = 0; i < judges.length; i++) {
      const judgeResult = await extractAndNormalizeJudge(judges[i], tx);
      masterDataTracker.trackJudge(judgeResult.isNewJudge);
      
      await tx.caseJudgeAssignment.create({
        data: {
          caseId: newCase.id,
          judgeId: judgeResult.judgeId,
          isPrimary: i === 0, // First judge is primary
        },
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

  const activityDate = createDateFromParts(row.date_dd, row.date_mon, row.date_yyyy);
  const primaryJudge = await extractAndNormalizeJudge(row.judge_1, tx);
  masterDataTracker.trackJudge(primaryJudge.isNewJudge);
  
  let nextHearingDate: Date | undefined;
  if (row.next_dd && row.next_mon && row.next_yyyy) {
    nextHearingDate = createDateFromParts(row.next_dd, row.next_mon, row.next_yyyy);
  }
  
  await tx.caseActivity.create({
    data: {
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
    },
  });
}

// Utility functions
async function readCsvFile(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];

    createReadStream(filePath)
      .pipe(csv({
        // Ensure proper parsing of CSV with potential issues
        skipEmptyLines: true,
      }))
      .on('data', (data) => {
        // Clean up the data to handle empty strings and whitespace
        const cleanedData: any = {};
        for (const [key, value] of Object.entries(data)) {
          const trimmedKey = key.trim();
          const stringValue = String(value || '').trim();
          cleanedData[trimmedKey] = stringValue === '' ? undefined : stringValue;
        }
        results.push(cleanedData);
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
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
    successfulRecords: batch.successfulRecords,
    failedRecords: batch.failedRecords,
    errors: batch.errorLogs,
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
    createdAt: batch.createdAt,
    completedAt: batch.completedAt,
    createdBy: batch.user,
  }));
}