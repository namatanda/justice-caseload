import { PrismaClient } from '@prisma/client';
import { logger } from '../logger';
import type { CaseReturnRow } from '../validation/schemas';
import { createDateFromParts } from '../validation/schemas';

const prisma = new PrismaClient();

export async function createOrUpdateCaseAndActivity(row: CaseReturnRow, batchId: string): Promise<{ caseId: string; activityId?: string; error?: string }> {
  try {
    return await prisma.$transaction(async (tx) => {
      // Extract date components using the validation helper
      const date = createDateFromParts(row.date_dd, row.date_mon, row.date_yyyy);
      
      // Handle master data - get or create court and judge
      let court = await tx.court.findFirst({
        where: { courtName: row.court }
      });
      
      if (!court) {
        court = await tx.court.create({
          data: {
            courtName: row.court,
            courtCode: `CRT_${row.court.replace(/\s+/g, '_').toUpperCase().substring(0, 20)}`,
            courtType: deriveCourtTypeFromCaseId(row.caseid_type + row.caseid_no) as any,
            isActive: true
          }
        });
      }

      let judge = null;
      if (row.judge_1) {
        // Find judge by full name or create
        judge = await tx.judge.findFirst({
          where: { fullName: row.judge_1 }
        });
        
        if (!judge) {
          judge = await tx.judge.create({
            data: {
              fullName: row.judge_1,
              firstName: row.judge_1.split(' ')[0] || row.judge_1,
              lastName: row.judge_1.split(' ').slice(1).join(' ') || '',
              isActive: true
            }
          });
        }
      }

      // Create or update case
      logger.database.debug('Creating/updating case', {
        caseNumber: `${row.caseid_type}-${row.caseid_no}`,
        courtName: row.court,
        caseType: row.case_type
      });
      
      const caseRecord = await tx.case.upsert({
        where: {
          case_number_court_unique: {
            caseNumber: `${row.caseid_type}-${row.caseid_no}`,
            courtName: row.court
          }
        },
        update: {
          status: row.outcome as any,
          originalCourtId: court.id,
          filedDate: date,
          // caseTypeId needs to be handled properly - for now using string cast
          caseTypeId: row.case_type || 'default',
          hasLegalRepresentation: row.legalrep === 'Yes'
        },
        create: {
          caseNumber: `${row.caseid_type}-${row.caseid_no}`,
          courtName: row.court,
          parties: {},
          status: row.outcome as any,
          originalCourtId: court.id,
          filedDate: date,
          caseTypeId: row.case_type || 'default',
          hasLegalRepresentation: row.legalrep === 'Yes'
        }
      });

      // Create case activity
      const activity = await tx.caseActivity.create({
        data: {
          caseId: caseRecord.id,
          importBatchId: batchId,
          activityType: 'import_update',
          activityDate: new Date(),
          details: `Case ${row.outcome} imported/updated from CSV batch ${batchId}`,
          primaryJudgeId: judge ? judge.id : 'default-judge-id',
          outcome: row.outcome as any,
          hasLegalRepresentation: row.legalrep === 'Yes',
          custodyStatus: 'NOT_APPLICABLE'
        }
      });

      logger.info('database', `Successfully processed case ${caseRecord.caseNumber} with activity ${activity.id}`);
      
      return { caseId: caseRecord.id, activityId: activity.id };
    });
  } catch (error) {
    logger.error('database', `Failed to process case ${row.caseid_no}: ${error}`);
    return { caseId: '', error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function batchInsert(validRows: CaseReturnRow[], batchId: string): Promise<{ success: number; failed: number; errors: string[] }> {
  const results = await Promise.allSettled(
    validRows.map(row => createOrUpdateCaseAndActivity(row, batchId))
  );

  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && !result.value.error) {
      success++;
    } else {
      failed++;
      if (result.status === 'rejected') {
        errors.push(`Row ${index}: ${result.reason}`);
      } else if (result.value.error) {
        errors.push(`Row ${index}: ${result.value.error}`);
      }
    }
  });

  logger.info('database', `Batch insert complete: ${success} successful, ${failed} failed`);
  if (errors.length > 0) {
    logger.error('database', `Batch errors: ${errors.length}`);
  }

  return { success, failed, errors };
}

// Simple court type derivation utility (to be moved to utils.ts later)
function deriveCourtTypeFromCaseId(caseId: string): 'SC' | 'ELC' | 'ELRC' | 'KC' | 'SCC' | 'COA' | 'MC' | 'HC' | 'TC' {
  // Simplified logic - in production, use more sophisticated pattern matching
  if (caseId.toLowerCase().includes('hc')) return 'HC';
  if (caseId.toLowerCase().includes('sc')) return 'SC';
  if (caseId.toLowerCase().includes('elc')) return 'ELC';
  if (caseId.toLowerCase().includes('elrc')) return 'ELRC';
  if (caseId.toLowerCase().includes('kc')) return 'KC';
  if (caseId.toLowerCase().includes('coa')) return 'COA';
  if (caseId.toLowerCase().includes('mc')) return 'MC';
  if (caseId.toLowerCase().includes('tc')) return 'TC';
  return 'MC'; // Default to Magistrate Court
}

// Cleanup function for batch completion
export async function updateBatchStatus(batchId: string, status: 'COMPLETED' | 'FAILED'): Promise<void> {
  try {
    await prisma.dailyImportBatch.update({
      where: { id: batchId },
      data: { status, completedAt: status === 'COMPLETED' ? new Date() : null }
    });
    logger.info('database', `Batch ${batchId} status updated to ${status}`);
  } catch (error) {
    logger.error('database', `Failed to update batch ${batchId} status: ${error}`);
  }
}