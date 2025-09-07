/**
 * Unit tests for Data Transformation Module
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CourtType } from '@prisma/client';
import { CsvDataTransformer, deriveCourtTypeFromCaseId } from '../../../src/lib/csv/transformer';
import type { CaseReturnRow } from '../../../src/lib/validation/schemas';

describe('CsvDataTransformer', () => {
  let transformer: CsvDataTransformer;

  beforeEach(() => {
    transformer = new CsvDataTransformer();
  });

  describe('deriveCourtTypeFromCaseId', () => {
    it('should return TC for null or undefined input', () => {
      expect(transformer.deriveCourtTypeFromCaseId('')).toBe(CourtType.TC);
      expect(transformer.deriveCourtTypeFromCaseId(null as any)).toBe(CourtType.TC);
      expect(transformer.deriveCourtTypeFromCaseId(undefined as any)).toBe(CourtType.TC);
    });

    it('should return TC for non-string input', () => {
      expect(transformer.deriveCourtTypeFromCaseId(123 as any)).toBe(CourtType.TC);
      expect(transformer.deriveCourtTypeFromCaseId({} as any)).toBe(CourtType.TC);
    });

    it('should prioritize 3-letter SCC over 2-letter SC', () => {
      expect(transformer.deriveCourtTypeFromCaseId('SCC123')).toBe(CourtType.SCC);
      expect(transformer.deriveCourtTypeFromCaseId('scc456')).toBe(CourtType.SCC);
      expect(transformer.deriveCourtTypeFromCaseId('SCC-789')).toBe(CourtType.SCC);
    });

    it('should handle 2-letter prefixes correctly', () => {
      expect(transformer.deriveCourtTypeFromCaseId('SC123')).toBe(CourtType.SC);
      expect(transformer.deriveCourtTypeFromCaseId('KC456')).toBe(CourtType.KC);
      expect(transformer.deriveCourtTypeFromCaseId('MC789')).toBe(CourtType.MC);
      expect(transformer.deriveCourtTypeFromCaseId('HC012')).toBe(CourtType.HC);
      expect(transformer.deriveCourtTypeFromCaseId('CO345')).toBe(CourtType.COA);
    });

    it('should handle EL prefix variations', () => {
      expect(transformer.deriveCourtTypeFromCaseId('ELC123')).toBe(CourtType.ELC);
      expect(transformer.deriveCourtTypeFromCaseId('ELRC456')).toBe(CourtType.ELRC);
      expect(transformer.deriveCourtTypeFromCaseId('EL789')).toBe(CourtType.ELRC); // Default EL to ELRC
    });

    it('should be case insensitive', () => {
      expect(transformer.deriveCourtTypeFromCaseId('sc123')).toBe(CourtType.SC);
      expect(transformer.deriveCourtTypeFromCaseId('kc456')).toBe(CourtType.KC);
      expect(transformer.deriveCourtTypeFromCaseId('elc789')).toBe(CourtType.ELC);
    });

    it('should handle whitespace', () => {
      expect(transformer.deriveCourtTypeFromCaseId(' SC123 ')).toBe(CourtType.SC);
      expect(transformer.deriveCourtTypeFromCaseId('\tKC456\n')).toBe(CourtType.KC);
    });

    it('should default to TC for unrecognized prefixes', () => {
      expect(transformer.deriveCourtTypeFromCaseId('XY123')).toBe(CourtType.TC);
      expect(transformer.deriveCourtTypeFromCaseId('ABC456')).toBe(CourtType.TC);
      expect(transformer.deriveCourtTypeFromCaseId('123')).toBe(CourtType.TC);
    });
  });

  describe('transformToCase', () => {
    const validRow: CaseReturnRow = {
      caseid_type: 'SC',
      caseid_no: '123',
      case_type: 'CIVIL',
      filed_dd: 15,
      filed_mon: 'Jun',
      filed_yyyy: 2023,
      male_applicant: 2,
      female_applicant: 1,
      organization_applicant: 0,
      male_defendant: 1,
      female_defendant: 2,
      organization_defendant: 1,
      legalrep: 'Yes',
      original_number: 'ORIG-456',
      original_year: 2022,
      // Required fields for validation
      date_dd: 20,
      date_mon: 'Jun',
      date_yyyy: 2023,
      judge_1: 'Judge Smith',
      comingfor: 'Hearing',
      outcome: 'Adjourned',
      court: 'Supreme Court'
    };

    it('should transform valid row to case data', () => {
      const result = transformer.transformToCase(validRow);

      expect(result.caseNumber).toBe('SC-123');
      expect(result.caseTypeId).toBe('CIVIL');
      expect(result.filedDate.getFullYear()).toBe(2023);
      expect(result.filedDate.getMonth()).toBe(6); // July (0-indexed)
      expect(result.filedDate.getDate()).toBe(15);
      expect(result.originalCourtId).toBeUndefined();
      expect(result.originalCaseNumber).toBe('ORIG-456');
      expect(result.originalYear).toBe(2022);
      expect(result.maleApplicant).toBe(2);
      expect(result.femaleApplicant).toBe(1);
      expect(result.organizationApplicant).toBe(0);
      expect(result.maleDefendant).toBe(1);
      expect(result.femaleDefendant).toBe(2);
      expect(result.organizationDefendant).toBe(1);
      expect(result.caseidType).toBe('SC');
      expect(result.caseidNo).toBe('123');
      expect(result.status).toBe('ACTIVE');
      expect(result.hasLegalRepresentation).toBe(true);
    });

    it('should handle missing optional fields', () => {
      const rowWithoutOptionals = {
        ...validRow,
        original_number: undefined,
        original_year: undefined,
        male_applicant: undefined,
        female_applicant: undefined,
        organization_applicant: undefined,
        male_defendant: undefined,
        female_defendant: undefined,
        organization_defendant: undefined,
      };

      const result = transformer.transformToCase(rowWithoutOptionals);

      expect(result.originalCaseNumber).toBeUndefined();
      expect(result.originalYear).toBeUndefined();
      expect(result.maleApplicant).toBe(0);
      expect(result.femaleApplicant).toBe(0);
      expect(result.organizationApplicant).toBe(0);
      expect(result.maleDefendant).toBe(0);
      expect(result.femaleDefendant).toBe(0);
      expect(result.organizationDefendant).toBe(0);
    });

    it('should handle string numeric values', () => {
      const rowWithStringNumbers = {
        ...validRow,
        male_applicant: '3',
        female_applicant: '2',
        organization_applicant: '1',
        original_year: '2021',
      };

      const result = transformer.transformToCase(rowWithStringNumbers);

      expect(result.maleApplicant).toBe(3);
      expect(result.femaleApplicant).toBe(2);
      expect(result.organizationApplicant).toBe(1);
      expect(result.originalYear).toBe(2021);
    });

    it('should handle invalid numeric values', () => {
      const rowWithInvalidNumbers = {
        ...validRow,
        male_applicant: 'invalid',
        female_applicant: null,
        organization_applicant: {},
      };

      const result = transformer.transformToCase(rowWithInvalidNumbers);

      expect(result.maleApplicant).toBe(0);
      expect(result.femaleApplicant).toBe(0);
      expect(result.organizationApplicant).toBe(0);
    });

    it('should handle legal representation correctly', () => {
      const rowWithLegalRep = { ...validRow, legalrep: 'Yes' };
      const rowWithoutLegalRep = { ...validRow, legalrep: 'No' };
      const rowWithUndefinedLegalRep = { ...validRow, legalrep: undefined };

      expect(transformer.transformToCase(rowWithLegalRep).hasLegalRepresentation).toBe(true);
      expect(transformer.transformToCase(rowWithoutLegalRep).hasLegalRepresentation).toBe(false);
      expect(transformer.transformToCase(rowWithUndefinedLegalRep).hasLegalRepresentation).toBe(false);
    });

    it('should throw error for missing required fields', () => {
      expect(() => {
        transformer.transformToCase({ ...validRow, caseid_type: undefined });
      }).toThrow('Missing required fields: caseid_type and caseid_no are required');

      expect(() => {
        transformer.transformToCase({ ...validRow, caseid_no: undefined });
      }).toThrow('Missing required fields: caseid_type and caseid_no are required');

      expect(() => {
        transformer.transformToCase({ ...validRow, case_type: undefined });
      }).toThrow('Missing required field: case_type is required');
    });

    it('should throw error for missing date fields', () => {
      expect(() => {
        transformer.transformToCase({ ...validRow, filed_dd: undefined });
      }).toThrow('Missing required date fields: filed_dd, filed_mon, filed_yyyy are required');

      expect(() => {
        transformer.transformToCase({ ...validRow, filed_mon: undefined });
      }).toThrow('Missing required date fields: filed_dd, filed_mon, filed_yyyy are required');

      expect(() => {
        transformer.transformToCase({ ...validRow, filed_yyyy: undefined });
      }).toThrow('Missing required date fields: filed_dd, filed_mon, filed_yyyy are required');
    });

    it('should throw error for invalid date', () => {
      expect(() => {
        transformer.transformToCase({ ...validRow, filed_dd: 32, filed_mon: 6, filed_yyyy: 2023 });
      }).toThrow('Invalid filed date: 32/6/2023');
    });
  });

  describe('transformToActivity', () => {
    const validRow: CaseReturnRow = {
      date_dd: 20,
      date_mon: 6,
      date_yyyy: 2023,
      judge_1: 'Judge Smith',
      judge_2: 'Judge Jones',
      judge_3: undefined,
      judge_4: undefined,
      judge_5: undefined,
      judge_6: undefined,
      judge_7: undefined,
      comingfor: 'Hearing',
      outcome: 'Adjourned',
      reason_adj: 'Missing witness',
      next_dd: 25,
      next_mon: 'Jun',
      next_yyyy: 2023,
      legalrep: 'Yes',
      applicant_witness: 2,
      defendant_witness: 1,
      custody: 1,
      other_details: 'Additional notes',
      // Required fields for case validation
      caseid_type: 'SC',
      caseid_no: '123',
      case_type: 'CIVIL',
      filed_dd: 15,
      filed_mon: 'Jun',
      filed_yyyy: 2023,
      court: 'Supreme Court'
    };

    it('should transform valid row to activity data', () => {
      const caseId = 'case-123';
      const result = transformer.transformToActivity(validRow, caseId);

      expect(result.caseId).toBe('case-123');
      expect(result.activityDate.getFullYear()).toBe(2023);
      expect(result.activityDate.getMonth()).toBe(6); // July (0-indexed)
      expect(result.activityDate.getDate()).toBe(20);
      expect(result.activityType).toBe('Hearing');
      expect(result.outcome).toBe('Adjourned');
      expect(result.reasonForAdjournment).toBe('Missing witness');
      expect(result.nextHearingDate?.getFullYear()).toBe(2023);
      expect(result.nextHearingDate?.getMonth()).toBe(6); // July (0-indexed)
      expect(result.nextHearingDate?.getDate()).toBe(25);
      expect(result.primaryJudgeId).toBe(''); // Will be set by service layer
      expect(result.hasLegalRepresentation).toBe(true);
      expect(result.applicantWitnesses).toBe(2);
      expect(result.defendantWitnesses).toBe(1);
      expect(result.custodyStatus).toBe('IN_CUSTODY');
      expect(result.details).toBe('Additional notes');
      expect(result.importBatchId).toBe(''); // Will be set by service layer
      expect(result.judge1).toBe('Judge Smith');
      expect(result.judge2).toBe('Judge Jones');
      expect(result.judge3).toBeUndefined();
      expect(result.judge4).toBeUndefined();
      expect(result.judge5).toBeUndefined();
      expect(result.judge6).toBeUndefined();
      expect(result.judge7).toBeUndefined();
    });

    it('should handle missing optional fields', () => {
      const rowWithoutOptionals = {
        ...validRow,
        judge_2: undefined,
        reason_adj: undefined,
        next_dd: undefined,
        next_mon: undefined,
        next_yyyy: undefined,
        applicant_witness: undefined,
        defendant_witness: undefined,
        custody: undefined,
        other_details: undefined,
      };

      const result = transformer.transformToActivity(rowWithoutOptionals, 'case-123');

      expect(result.judge2).toBeUndefined();
      expect(result.reasonForAdjournment).toBeUndefined();
      expect(result.nextHearingDate).toBeUndefined();
      expect(result.applicantWitnesses).toBe(0);
      expect(result.defendantWitnesses).toBe(0);
      expect(result.custodyStatus).toBe('NOT_APPLICABLE');
      expect(result.details).toBeUndefined();
    });

    it('should handle custody status correctly', () => {
      const rowWithCustody = { ...validRow, custody: 2 };
      const rowNoCustody = { ...validRow, custody: 0 };

      expect(transformer.transformToActivity(rowWithCustody, 'case-123').custodyStatus).toBe('IN_CUSTODY');
      expect(transformer.transformToActivity(rowNoCustody, 'case-123').custodyStatus).toBe('NOT_APPLICABLE');
    });

    it('should handle invalid next hearing date gracefully', () => {
      const rowWithInvalidNextDate = {
        ...validRow,
        next_dd: 32,
        next_mon: 13,
        next_yyyy: 2023,
      };

      const result = transformer.transformToActivity(rowWithInvalidNextDate, 'case-123');
      expect(result.nextHearingDate).toBeUndefined();
    });

    it('should handle string numeric values', () => {
      const rowWithStringNumbers = {
        ...validRow,
        applicant_witness: '5',
        defendant_witness: '3',
        custody: '2',
      };

      const result = transformer.transformToActivity(rowWithStringNumbers, 'case-123');

      expect(result.applicantWitnesses).toBe(5);
      expect(result.defendantWitnesses).toBe(3);
      expect(result.custodyStatus).toBe('IN_CUSTODY');
    });

    it('should handle invalid numeric values', () => {
      const rowWithInvalidNumbers = {
        ...validRow,
        applicant_witness: 'invalid',
        defendant_witness: null,
        custody: {},
      };

      const result = transformer.transformToActivity(rowWithInvalidNumbers, 'case-123');

      expect(result.applicantWitnesses).toBe(0);
      expect(result.defendantWitnesses).toBe(0);
      expect(result.custodyStatus).toBe('NOT_APPLICABLE');
    });

    it('should throw error for missing required fields', () => {
      expect(() => {
        transformer.transformToActivity({ ...validRow, date_dd: undefined }, 'case-123');
      }).toThrow('Missing required date fields: date_dd, date_mon, date_yyyy are required for activity');

      expect(() => {
        transformer.transformToActivity({ ...validRow, date_mon: undefined }, 'case-123');
      }).toThrow('Missing required date fields: date_dd, date_mon, date_yyyy are required for activity');

      expect(() => {
        transformer.transformToActivity({ ...validRow, date_yyyy: undefined }, 'case-123');
      }).toThrow('Missing required date fields: date_dd, date_mon, date_yyyy are required for activity');

      expect(() => {
        transformer.transformToActivity({ ...validRow, judge_1: undefined }, 'case-123');
      }).toThrow('Missing required field: judge_1 is required for activity');
    });

    it('should throw error for invalid activity date', () => {
      expect(() => {
        transformer.transformToActivity({ ...validRow, date_dd: 32, date_mon: 6, date_yyyy: 2023 }, 'case-123');
      }).toThrow('Invalid activity date: 32/6/2023');
    });

    it('should handle empty string values', () => {
      const rowWithEmptyStrings = {
        ...validRow,
        comingfor: '',
        outcome: '',
      };

      const result = transformer.transformToActivity(rowWithEmptyStrings, 'case-123');

      expect(result.activityType).toBe('');
      expect(result.outcome).toBe('');
    });
  });

  describe('backward compatibility', () => {
    it('should export deriveCourtTypeFromCaseId function', () => {
      expect(typeof deriveCourtTypeFromCaseId).toBe('function');
      expect(deriveCourtTypeFromCaseId('SC123')).toBe(CourtType.SC);
      expect(deriveCourtTypeFromCaseId('SCC456')).toBe(CourtType.SCC);
    });
  });
});