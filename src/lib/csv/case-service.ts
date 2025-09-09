/**
 * Case Service Module
 * 
 * Handles case-related database operations including:
 * - Case creation and updates
 * - Case activity creation
 * - Judge assignment creation
 * - Case lookup operations
 */

import { logger } from '../logger';
import { CaseService } from './interfaces';
import type { CaseData, ActivityData, CaseCreationResult, Transaction, Case } from './types';
import type { CaseReturnRow } from '../validation/schemas';
import {
  extractAndNormalizeCourt,
  extractAndNormalizeJudge,
  extractAndNormalizeCaseType,
  extractJudgesFromRow,
  createCaseNumber,
  determineCustodyStatus,
  MasterDataTracker
} from '../data/extraction';
import { createDateFromParts } from '../validation/schemas';
import { transformer } from './transformer';

class CaseServiceImpl implements CaseService {
  /**
   * Create or update a case based on CSV row data
   */
  async createOrUpdateCase(
    row: CaseReturnRow,
    tx: Transaction,
    masterDataTracker?: MasterDataTracker
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
    if (masterDataTracker) {
      masterDataTracker.trackCaseType(false); // We'll track this properly later
    }

    // Extract current court directly from 'court' column
    // Use court type derivation from caseid_type if available
    const derivedCourtType = row.caseid_type ? transformer.deriveCourtTypeFromCaseId(row.caseid_type) : undefined;
    const currentCourtResult = await extractAndNormalizeCourt(row.court, undefined, tx, derivedCourtType);
    if (currentCourtResult && masterDataTracker) {
      masterDataTracker.trackCourt(currentCourtResult.isNewCourt);
    }

    // Extract original court (for appeals only)
    const originalCourtResult = await extractAndNormalizeCourt(
      row.original_court,
      row.original_code,
      tx
    );
    if (originalCourtResult && masterDataTracker) {
      masterDataTracker.trackCourt(originalCourtResult.isNewCourt);
    }

    // Check if case exists using normalized court name
    const existingCase = await this.findExistingCase(caseNumber, currentCourtResult.courtName, tx);

    if (existingCase) {
      return await this.updateExistingCase(existingCase, row, filedDate, tx);
    } else {
      return await this.createNewCase(
        row,
        caseNumber,
        caseTypeId,
        filedDate,
        currentCourtResult,
        originalCourtResult,
        tx,
        masterDataTracker
      );
    }
  }

  /**
   * Create case activity record
   * Checks for existing identical activity to prevent duplicates
   */
  async createCaseActivity(
    row: CaseReturnRow,
    caseId: string,
    importBatchId: string,
    tx: Transaction,
    masterDataTracker?: MasterDataTracker
  ): Promise<boolean> {
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
    if (masterDataTracker) {
      masterDataTracker.trackJudge(primaryJudge.isNewJudge);
    }

    let nextHearingDate: Date | undefined;
    if (row.next_dd && row.next_mon && row.next_yyyy) {
      try {
        nextHearingDate = createDateFromParts(row.next_dd, row.next_mon, row.next_yyyy);
      } catch (error) {
        nextHearingDate = undefined; // Skip invalid next hearing dates
      }
    }

    // Prepare activity data
    const activityData = {
      caseId,
      activityDate,
      activityType: row.comingfor || 'Unknown',
      outcome: row.outcome || 'Pending',
      reasonForAdjournment: row.reason_adj,
      nextHearingDate,
      primaryJudgeId: primaryJudge.judgeId,
      hasLegalRepresentation: row.legalrep === 'Yes',
      applicantWitnesses: this.safeNumericValue(row.applicant_witness),
      defendantWitnesses: this.safeNumericValue(row.defendant_witness),
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

    // Check for existing identical activity to prevent duplicates
    const existingActivity = await tx.caseActivity.findFirst({
      where: {
        caseId: activityData.caseId,
        activityDate: activityData.activityDate,
        activityType: activityData.activityType,
        primaryJudgeId: activityData.primaryJudgeId,
      },
    });

    if (existingActivity) {
      logger.database.info('Skipping duplicate case activity creation', {
        caseId: activityData.caseId,
        activityDate: activityData.activityDate.toISOString(),
        activityType: activityData.activityType,
        primaryJudgeId: activityData.primaryJudgeId,
        existingActivityId: existingActivity.id,
        importBatchId,
      });
      return false; // Skip creating duplicate activity
    }

    logger.database.info('Creating case activity', {
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

    let createdActivity;
    try {
      createdActivity = await tx.caseActivity.create({ data: activityData });
    } catch (err) {
      logger.error('general', 'Prisma error creating case activity', { activityData, error: err });
      throw err;
    }

    logger.import.info('CASE ACTIVITY CREATED SUCCESSFULLY', {
      id: createdActivity.id,
      caseId: createdActivity.caseId,
      activityDate: createdActivity.activityDate,
      activityType: createdActivity.activityType
    });

    return true;
  }

  /**
   * Find existing case by case number and court
   */
  async findExistingCase(caseNumber: string, courtName: string, tx: Transaction): Promise<Case | null> {
    return await tx.case.findFirst({
      where: {
        caseNumber,
        courtName
      },
    });
  }

  /**
   * Update existing case with new activity information
   */
  private async updateExistingCase(
    existingCase: Case,
    row: CaseReturnRow,
    filedDate: Date,
    tx: Transaction
  ): Promise<CaseCreationResult> {
    // Prepare update data for logging
    const updateData = {
      lastActivityDate: new Date(),
      totalActivities: { increment: 1 },
      hasLegalRepresentation: row.legalrep === 'Yes',
    };

    logger.database.info('Updating existing case', {
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
    let updatedCase;
    try {
      updatedCase = await tx.case.update({
        where: { id: existingCase.id },
        data: updateData,
      });
    } catch (err) {
      logger.error('general', 'Prisma error updating case', {
        caseId: existingCase.id,
        attemptData: updateData,
        error: err
      });
      throw err;
    }

    logger.import.info('CASE UPDATED SUCCESSFULLY', {
      id: updatedCase.id,
      caseNumber: updatedCase.caseNumber,
      newTotalActivities: updatedCase.totalActivities,
      lastActivityDate: updatedCase.lastActivityDate
    });

    return { caseId: updatedCase.id, isNewCase: false };
  }

  /**
   * Create new case with all associated data
   */
  private async createNewCase(
    row: CaseReturnRow,
    caseNumber: string,
    caseTypeId: string,
    filedDate: Date,
    currentCourtResult: any,
    originalCourtResult: any,
    tx: Transaction,
    masterDataTracker?: MasterDataTracker
  ): Promise<CaseCreationResult> {
    // Safely handle numeric fields
    const maleApp = this.safeNumericValue(row.male_applicant);
    const femaleApp = this.safeNumericValue(row.female_applicant);
    const orgApp = this.safeNumericValue(row.organization_applicant);
    const maleDef = this.safeNumericValue(row.male_defendant);
    const femaleDef = this.safeNumericValue(row.female_defendant);
    const orgDef = this.safeNumericValue(row.organization_defendant);
    
    // Prepare case data
    const caseData = {
      caseNumber,
      courtName: currentCourtResult.courtName,  // Use normalized court name
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
      status: 'ACTIVE' as const,
      lastActivityDate: new Date(),
      totalActivities: 1,
      hasLegalRepresentation: row.legalrep === 'Yes',
    };

    logger.database.info('Creating new case', {
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
    let newCase;
    try {
      newCase = await tx.case.create({ data: caseData });
    } catch (err) {
      logger.error('general', 'Prisma error creating case', { caseNumber: caseData.caseNumber, caseData, error: err });
      throw err;
    }

    logger.import.info('CASE CREATED SUCCESSFULLY', {
      id: newCase.id,
      caseNumber: newCase.caseNumber,
      status: newCase.status,
      createdAt: newCase.createdAt
    });

    // Create judge assignments
    await this.createJudgeAssignments(row, newCase.id, tx, masterDataTracker);

    return { caseId: newCase.id, isNewCase: true };
  }

  /**
   * Create judge assignments for a case
   * Optimized to batch process judge normalization
   */
  private async createJudgeAssignments(
    row: CaseReturnRow,
    caseId: string,
    tx: Transaction,
    masterDataTracker?: MasterDataTracker
  ): Promise<void> {
    const judges = extractJudgesFromRow(row);
    
    if (judges.length === 0) return;

    // Batch process judge normalization for better performance
    const judgeResults = await Promise.all(
      judges.map(judge => extractAndNormalizeJudge(judge, tx))
    );

    // Track new judges
    if (masterDataTracker) {
      judgeResults.forEach(result => masterDataTracker.trackJudge(result.isNewJudge));
    }

    logger.database.info('CREATING JUDGE ASSIGNMENTS', {
      caseId,
      judgeCount: judgeResults.length,
      judges: judges.map((judge, i) => ({ name: judge, isPrimary: i === 0 }))
    });

    // Create assignments individually (for compatibility with all Prisma versions)
    const createdAssignments = [];
    for (let i = 0; i < judgeResults.length; i++) {
      const judgeResult = judgeResults[i];
      const assignmentData = {
        caseId: caseId,
        judgeId: judgeResult.judgeId,
        isPrimary: i === 0, // First judge is primary
      };

      try {
        const assignment = await tx.caseJudgeAssignment.create({ data: assignmentData });
        createdAssignments.push(assignment);
      } catch (err) {
        logger.error('general', 'Prisma error creating judge assignment', { 
          assignmentData, 
          error: err 
        });
        throw err;
      }
    }

    logger.import.info('JUDGE ASSIGNMENTS CREATED', {
      caseId,
      count: createdAssignments.length,
      expectedCount: judgeResults.length
    });
  }

  /**
   * Safely convert value to number, defaulting to 0 for invalid values
   */
  private safeNumericValue(value: any): number {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
}

// Export singleton instance
export const caseService = new CaseServiceImpl();
export default caseService;