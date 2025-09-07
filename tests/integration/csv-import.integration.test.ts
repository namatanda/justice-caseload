import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import logger from '../../src/lib/logger';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CaseReturnRowSchema } from '../../src/lib/validation/schemas';
import { deriveCourtTypeFromCaseId } from '../../src/lib/import/csv-processor';

describe('CSV Import Integration Tests', () => {
  let sampleCsvPath: string;
  let testCaseIds: string[];
  let headers: string[];
  let sampleRow: string[];

  beforeAll(() => {
    sampleCsvPath = join(process.cwd(), 'data', 'sample_case_returns.csv');
    testCaseIds = ['SCC123', 'SC456', 'HC789', 'MC111', 'ELC222', 'INVALID'];
  });

  it('should load and parse CSV file correctly', () => {
    const csvContent = readFileSync(sampleCsvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    expect(lines.length).toBeGreaterThan(0);

    headers = lines[0].split(',').map(h => h.trim());
    expect(headers.length).toBeGreaterThan(0);

    sampleRow = lines[1].split(',');
    expect(sampleRow.length).toBeGreaterThan(0);

    logger.info('general', `Loaded CSV with ${lines.length - 1} data rows`);
    logger.info('general', `CSV Headers count: ${headers.length}`);
    logger.info('general', `First 10 headers: ${headers.slice(0, 10).join(', ')}`);
    logger.info('general', `Last 10 headers: ${headers.slice(-10).join(', ')}`);
  });

  it('should derive court type from case ID correctly', () => {
    logger.info('general', 'Testing Court Type Derivation');
    const results = testCaseIds.map(caseid => deriveCourtTypeFromCaseId(caseid));
    expect(results[0]).toBe('SCC');
    expect(results[1]).toBe('SC');
    expect(results[2]).toBe('HC');
    expect(results[3]).toBe('MC');
    expect(results[4]).toBe('ELC');
    expect(results[5]).toBe('TC');

    testCaseIds.forEach(caseid => {
      const courtType = deriveCourtTypeFromCaseId(caseid);
      logger.info('general', `Case ID ${caseid} → Court Type: ${courtType}`);
    });
  });

  it('should validate sample CSV row against schema', () => {
    const rowObject: any = {};
    headers.forEach((header, index) => {
      const value = sampleRow[index]?.trim() || '';
      const optionalFields = [
        'original_court', 'original_code', 'original_number', 'original_year',
        'judge_2', 'judge_3', 'judge_4', 'judge_5', 'judge_6', 'judge_7',
        'comingfor', 'reason_adj', 'next_dd', 'next_mon', 'next_yyyy',
        'male_applicant', 'female_applicant', 'organization_applicant',
        'male_defendant', 'female_defendant', 'organization_defendant',
        'applicant_witness', 'defendant_witness', 'custody', 'other_details'
      ];

      rowObject[header] = value === '' && optionalFields.includes(header) ? undefined : value;
    });

    const validation = CaseReturnRowSchema.safeParse(rowObject);
    expect(validation.success).toBe(true);

    logger.info('general', 'Sample Row Data');
    logger.info('general', `Case ID: ${rowObject.caseid_type}${rowObject.caseid_no}`);
    logger.info('general', `Court: ${rowObject.court}`);
    logger.info('general', `Case Type: ${rowObject.case_type}`);
    logger.info('general', `Primary Judge: ${rowObject.judge_1}`);
    logger.info('general', 'Party Counts', {
      applicants: {
        male: rowObject.male_applicant,
        female: rowObject.female_applicant,
        organization: rowObject.organization_applicant
      },
      defendants: {
        male: rowObject.male_defendant,
        female: rowObject.female_defendant,
        organization: rowObject.organization_defendant
      }
    });
    logger.info('general', 'Row validation: PASSED');
  });

  it('should validate multiple CSV rows correctly', () => {
    const csvContent = readFileSync(sampleCsvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    let validRows = 0;
    let invalidRows = 0;

    logger.info('general', 'Testing Multiple Rows');
    for (let i = 1; i < Math.min(lines.length, 6); i++) {
      logger.info('general', `Row ${i} raw data: ${lines[i].substring(0, 100)}...`);
      const rowData = lines[i].split(',');
      logger.info('general', `Row ${i} parsed columns: ${rowData.length} columns`);
      const rowObj: any = {};

      headers.forEach((header, index) => {
        const value = rowData[index]?.trim() || '';
        const optionalFields = [
          'original_court', 'original_code', 'original_number', 'original_year',
          'judge_2', 'judge_3', 'judge_4', 'judge_5', 'judge_6', 'judge_7',
          'comingfor', 'reason_adj', 'next_dd', 'next_mon', 'next_yyyy',
          'male_applicant', 'female_applicant', 'organization_applicant',
          'male_defendant', 'female_defendant', 'organization_defendant',
          'applicant_witness', 'defendant_witness', 'custody', 'other_details'
        ];

        rowObj[header] = value === '' && optionalFields.includes(header) ? undefined : value;
      });

      const rowValidation = CaseReturnRowSchema.safeParse(rowObj);
      if (rowValidation.success) {
        validRows++;
        logger.info('general', `Row ${i}: Valid (${rowObj.caseid_type}${rowObj.caseid_no})`);
      } else {
        invalidRows++;
        const firstError = rowValidation.error.errors[0];
        logger.info('general', `Row ${i}: Invalid - Field: ${firstError?.path?.join('.')}, Error: ${firstError?.message}`);
        logger.info('general', `Raw value: ${JSON.stringify(rowObj[firstError?.path?.[0] as string])}`);
      }
    }

    expect(validRows).toBeGreaterThan(0);
    logger.info('general', 'Summary');
    logger.info('general', `Total rows tested: ${Math.min(lines.length - 1, 5)}`);
    logger.info('general', `Valid rows: ${validRows}`);
    logger.info('general', `Invalid rows: ${invalidRows}`);

    if (validRows > 0 && invalidRows === 0) {
      logger.info('general', 'All tests passed! CSV import functionality is working correctly');
    } else {
      logger.warn('general', 'Some tests failed. Please review the validation errors above');
    }
  });

  it('should handle CSV import test errors gracefully', () => {
    const invalidPath = join(process.cwd(), 'data', 'nonexistent.csv');
    expect(() => readFileSync(invalidPath, 'utf-8')).toThrow();
  });
});
it('should successfully validate CSV import without next hearing date columns', () => {
  const sampleCsvWithoutNextHearing = `date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,court,case_type,judge_1,comingfor,outcome,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
15,Jan,2024,SCC,12345,10,Jan,2024,Milimani Small Claims Court,Civil Suit,Justice Smith,Hearing,Adjourned,2,1,0,1,0,1,Yes,3,2,0,Case involves commercial dispute over contract
45,Feb,2024,TC,67890,5,Feb,2024,Kiambu Tribunal Court,Employment Case,Justice Brown,Mention,Continued,1,0,0,2,1,0,No,1,3,1,Employment termination dispute`;

  const lines = sampleCsvWithoutNextHearing.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  const dataRows = lines.slice(1);

  let validRows = 0;
  dataRows.forEach((line, index) => {
    const values = line.split(',');
    const rowObj: any = {};
    headers.forEach((header, hIndex) => {
      const value = hIndex < values.length ? values[hIndex].trim() : '';
      rowObj[header] = value === '' ? undefined : value;
    });

    const validation = CaseReturnRowSchema.safeParse(rowObj);
    if (validation.success) {
      validRows++;
      // Verify next hearing fields are undefined
      expect(rowObj.next_dd).toBeUndefined();
      expect(rowObj.next_mon).toBeUndefined();
      expect(rowObj.next_yyyy).toBeUndefined();
    }
  });

  expect(validRows).toBe(1);
  logger.info('general', `Successfully validated ${validRows} rows without next hearing date columns`);
});