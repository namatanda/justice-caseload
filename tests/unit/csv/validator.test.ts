import { describe, it, expect, vi } from 'vitest';
import { CaseReturnRowSchema } from '@/lib/validation/schemas';
import { validateExtractedJudge } from '@/lib/validation/schemas';
import type { CaseReturnRow } from '@/lib/validation/schemas';

describe('CSV Validator Judge Name Validation', () => {
  it('should validate comma-separated judge name correctly', () => {
    const judgeName = 'Musyoki, Benjamin Mwikya';
    
    const validation = validateExtractedJudge(judgeName);
    
    expect(validation.isValid).toBe(true);
    expect(validation.issues).toEqual([]);
  });

  it('should reject judge name with invalid characters (numbers)', () => {
    const judgeName = 'Smith123, John Doe';
    
    const validation = validateExtractedJudge(judgeName);
    
    expect(validation.isValid).toBe(false);
    expect(validation.issues).toContain('Judge name contains invalid characters');
  });

  it('should validate CSV row with comma-separated judge name', () => {
    const validRow = {
      date_dd: 15,
      date_mon: 'Oct',
      date_yyyy: 2023,
      caseid_type: 'HC',
      caseid_no: '123/2023',
      filed_dd: 1,
      filed_mon: 'Jan',
      filed_yyyy: 2023,
      court: 'High Court of Kenya',
      case_type: 'Civil Suit',
      judge_1: 'Musyoki, Benjamin Mwikya',
      judge_2: undefined,
      judge_3: undefined,
      judge_4: undefined,
      judge_5: undefined,
      judge_6: undefined,
      judge_7: undefined,
      comingfor: 'Hearing',
      outcome: 'Adjourned',
      reason_adj: undefined,
      next_dd: undefined,
      next_mon: undefined,
      next_yyyy: undefined,
      male_applicant: 1,
      female_applicant: 0,
      organization_applicant: 0,
      male_defendant: 1,
      female_defendant: 0,
      organization_defendant: 0,
      legalrep: 'Yes',
      applicant_witness: 0,
      defendant_witness: 0,
      custody: 0,
      other_details: undefined
    };

    const result = CaseReturnRowSchema.safeParse(validRow);
    
    expect(result.success).toBe(true);
    const parsedData = result.data as CaseReturnRow;
    expect(parsedData.judge_1).toBe('Musyoki, Benjamin Mwikya');
  });

  it('should reject CSV row with invalid judge name containing numbers', () => {
    const invalidRow = {
      date_dd: 15,
      date_mon: 'Oct',
      date_yyyy: 2023,
      caseid_type: 'HC',
      caseid_no: '123/2023',
      filed_dd: 1,
      filed_mon: 'Jan',
      filed_yyyy: 2023,
      court: 'High Court of Kenya',
      case_type: 'Civil Suit',
      judge_1: 'Smith123, John Doe',
      judge_2: undefined,
      judge_3: undefined,
      judge_4: undefined,
      judge_5: undefined,
      judge_6: undefined,
      judge_7: undefined,
      comingfor: 'Hearing',
      outcome: 'Adjourned',
      reason_adj: undefined,
      next_dd: undefined,
      next_mon: undefined,
      next_yyyy: undefined,
      male_applicant: 1,
      female_applicant: 0,
      organization_applicant: 0,
      male_defendant: 1,
      female_defendant: 0,
      organization_defendant: 0,
      legalrep: 'Yes',
      applicant_witness: 0,
      defendant_witness: 0,
      custody: 0,
      other_details: undefined
    };

    const result = CaseReturnRowSchema.safeParse(invalidRow);
    
    expect(result.success).toBe(false);
  });

  it('should validate specific judge name "Njoroge, Benjamin Kimani"', () => {
    const judgeName = 'Njoroge, Benjamin Kimani';
    
    const validation = validateExtractedJudge(judgeName);
    
    expect(validation.isValid).toBe(true);
    expect(validation.issues).toEqual([]);
  });

  it('should reject judge name "Judge123" containing numbers', () => {
    const judgeName = 'Judge123';
    
    const validation = validateExtractedJudge(judgeName);
    
    expect(validation.isValid).toBe(false);
    expect(validation.issues).toContain('Judge name contains invalid characters');
  });
});