/**
 * Data Transformation Module
 * 
 * Handles transformation of validated CSV data into database entities.
 * This module is responsible for converting CSV rows into structured data
 * that can be used to create cases and activities in the database.
 */

import { CourtType } from '@prisma/client';
import type { DataTransformer, CaseData, ActivityData } from './interfaces';
import type { CaseReturnRow } from '../validation/schemas';
import { createDateFromParts } from '../validation/schemas';
import { createCaseNumber, determineCustodyStatus } from '../data/extraction';

export class CsvDataTransformer implements DataTransformer {
  
  /**
   * Derives CourtType from caseid_type prefix according to CSV data structure requirements.
   * Rules from requirements.md:
   * - Check for 3-letter SCC first to avoid conflict with SC (Supreme Court)
   * - Then check 2-letter prefixes for other court types
   * - Default to TC (Tribunal Court) for unmatched prefixes
   */
  deriveCourtTypeFromCaseId(caseidType: string): CourtType {
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

  /**
   * Transform validated CSV row to case data structure
   */
  transformToCase(row: CaseReturnRow): CaseData {
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

    return {
      caseNumber,
      caseTypeId: row.case_type, // This will be normalized by the service layer
      filedDate,
      originalCourtId: undefined, // Will be set by service layer after court normalization
      originalCaseNumber: row.original_number || undefined,
      originalYear: row.original_year ? (typeof row.original_year === 'string' ? parseInt(row.original_year, 10) : row.original_year) : undefined,
      maleApplicant: maleApp,
      femaleApplicant: femaleApp,
      organizationApplicant: orgApp,
      maleDefendant: maleDef,
      femaleDefendant: femaleDef,
      organizationDefendant: orgDef,
      caseidType: row.caseid_type,
      caseidNo: row.caseid_no,
      status: 'ACTIVE',
      hasLegalRepresentation: row.legalrep === 'Yes',
    };
  }

  /**
   * Transform validated CSV row to activity data structure
   */
  transformToActivity(row: CaseReturnRow, caseId: string): ActivityData {
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

    let nextHearingDate: Date | undefined;
    if (row.next_dd && row.next_mon && row.next_yyyy) {
      try {
        nextHearingDate = createDateFromParts(row.next_dd, row.next_mon, row.next_yyyy);
      } catch (error) {
        nextHearingDate = undefined; // Skip invalid next hearing dates
      }
    }

    // Safely handle numeric fields
    const safeNumericValue = (value: any): number => {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? 0 : parsed;
    };

    return {
      caseId,
      activityDate,
      activityType: row.comingfor || '',
      outcome: row.outcome || '',
      reasonForAdjournment: row.reason_adj,
      nextHearingDate,
      primaryJudgeId: '', // Will be set by service layer after judge normalization
      hasLegalRepresentation: row.legalrep === 'Yes',
      applicantWitnesses: safeNumericValue(row.applicant_witness),
      defendantWitnesses: safeNumericValue(row.defendant_witness),
      custodyStatus: determineCustodyStatus(safeNumericValue(row.custody)),
      details: row.other_details,
      importBatchId: '', // Will be set by service layer
      // Store multiple judges from CSV
      judge1: row.judge_1,
      judge2: row.judge_2,
      judge3: row.judge_3,
      judge4: row.judge_4,
      judge5: row.judge_5,
      judge6: row.judge_6,
      judge7: row.judge_7,
    };
  }
}

// Export singleton instance
export const transformer = new CsvDataTransformer();

// Export the deriveCourtTypeFromCaseId function for backward compatibility
export function deriveCourtTypeFromCaseId(caseidType: string): CourtType {
  return transformer.deriveCourtTypeFromCaseId(caseidType);
}