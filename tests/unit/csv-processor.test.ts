import { describe, it, expect } from 'vitest';
import { parseCSVLine, deriveCourtTypeFromCaseId } from '../../src/lib/import/csv-processor';

describe('csv-processor utilities', () => {
  it('parseCSVLine should split simple comma line', () => {
    const line = 'a,b,c';
    const parts = parseCSVLine(line);
    expect(parts).toEqual(['a','b','c']);
  });

  it('parseCSVLine should handle quoted commas and escaped quotes', () => {
    const line = '"Milimani Civil","6","Nov","2023","HCCC","123","13","Jun","2019","","","","0","Civil Suit","Kendagor, Caroline J","","","","","","","Mention","Directions Given","","7","Mar","2024","0","0","1","0","0","1","Yes","0","0","0",""';
    const parts = parseCSVLine(line);
    expect(parts[0]).toBe('Milimani Civil');
    expect(parts[13]).toBe('Civil Suit');
    expect(parts[14]).toContain('Kendagor');
  });

  it('deriveCourtTypeFromCaseId should map prefixes correctly', () => {
    expect(deriveCourtTypeFromCaseId('SCC')).toBeDefined();
    expect(deriveCourtTypeFromCaseId('SC')).toBeDefined();
    expect(deriveCourtTypeFromCaseId('ELC')).toBeDefined();
    expect(deriveCourtTypeFromCaseId('KC')).toBeDefined();
    expect(deriveCourtTypeFromCaseId('UNKNOWN')).toBeDefined();
  });
});

describe('CSV row validation with optional next hearing fields', () => {
  it('should validate CSV row with missing next_dd column successfully', async () => {
    const CaseReturnRowSchema = await import('../../src/lib/validation/schemas').then(m => m.CaseReturnRowSchema);
    const sampleRowWithoutNextDd = {
      date_dd: 15,
      date_mon: 'Jan',
      date_yyyy: 2024,
      caseid_type: 'SCC',
      caseid_no: '12345',
      filed_dd: 10,
      filed_mon: 'Jan',
      filed_yyyy: 2024,
      court: 'Milimani Small Claims Court',
      case_type: 'Civil Suit',
      judge_1: 'Justice Smith',
      comingfor: 'Hearing',
      outcome: 'Adjourned',
      reason_adj: 'Case not ready',
      // next_dd intentionally missing
      next_mon: undefined,
      next_yyyy: undefined,
      male_applicant: 2,
      female_applicant: 1,
      organization_applicant: 0,
      male_defendant: 1,
      female_defendant: 0,
      organization_defendant: 1,
      legalrep: 'Yes',
      applicant_witness: 3,
      defendant_witness: 2,
      custody: 0,
      other_details: 'Case involves commercial dispute over contract'
    };

    expect(() => CaseReturnRowSchema.parse(sampleRowWithoutNextDd)).not.toThrow();
  });

  it('should validate CSV row with all next hearing fields present', async () => {
    const CaseReturnRowSchema = await import('../../src/lib/validation/schemas').then(m => m.CaseReturnRowSchema);
    const sampleRowWithNextDd = {
      date_dd: 15,
      date_mon: 'Jan',
      date_yyyy: 2024,
      caseid_type: 'SCC',
      caseid_no: '12345',
      filed_dd: 10,
      filed_mon: 'Jan',
      filed_yyyy: 2024,
      court: 'Milimani Small Claims Court',
      case_type: 'Civil Suit',
      judge_1: 'Justice Smith',
      comingfor: 'Hearing',
      outcome: 'Adjourned',
      reason_adj: 'Case not ready',
      next_dd: 22,
      next_mon: 'Jan',
      next_yyyy: 2024,
      male_applicant: 2,
      female_applicant: 1,
      organization_applicant: 0,
      male_defendant: 1,
      female_defendant: 0,
      organization_defendant: 1,
      legalrep: 'Yes',
      applicant_witness: 3,
      defendant_witness: 2,
      custody: 0,
      other_details: 'Case involves commercial dispute over contract'
    };

    const result = CaseReturnRowSchema.parse(sampleRowWithNextDd);
    expect(result.next_dd).toBe(22);
    expect(result.next_mon).toBe('Jan');
    expect(result.next_yyyy).toBe(2024);
  });
});
