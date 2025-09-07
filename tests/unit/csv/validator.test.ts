/**
 * Unit tests for CSV Validator module
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CsvValidatorImpl, createValidator } from '@/lib/csv/validator';
import type { CsvRow } from '@/lib/csv/types';

describe('CsvValidator', () => {
  let validator: CsvValidatorImpl;

  beforeEach(() => {
    validator = new CsvValidatorImpl();
  });

  describe('validateRow', () => {
    it('should validate a correct row successfully', () => {
      const validRow: CsvRow = {
        date_dd: '15',
        date_mon: 'Jan',
        date_yyyy: '2024',
        caseid_type: 'TC',
        caseid_no: '123',
        filed_dd: '10',
        filed_mon: 'Dec',
        filed_yyyy: '2023',
        court: 'Test Court',
        case_type: 'Civil',
        judge_1: 'Judge Smith',
        outcome: 'Hearing',
        male_applicant: '1',
        female_applicant: '0',
        organization_applicant: '0',
        male_defendant: '1',
        female_defendant: '0',
        organization_defendant: '0',
        legalrep: 'Yes',
        applicant_witness: '2',
        defendant_witness: '1',
        custody: '0'
      };

      const result = validator.validateRow(validRow, 1);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.validatedData).toBeDefined();
    });

    it('should handle missing required fields', () => {
      const invalidRow: CsvRow = {
        date_dd: '15',
        date_mon: 'Jan',
        date_yyyy: '2024'
        // Missing required fields: caseid_type, caseid_no, etc.
      };

      const result = validator.validateRow(invalidRow, 1);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.validatedData).toBeUndefined();
    });

    it('should handle invalid date values', () => {
      const invalidRow: CsvRow = {
        date_dd: '32', // Invalid day
        date_mon: 'InvalidMonth', // Invalid month
        date_yyyy: '1900', // Year too old
        caseid_type: 'TC',
        caseid_no: '123',
        filed_dd: '10',
        filed_mon: 'Dec',
        filed_yyyy: '2023',
        court: 'Test Court',
        case_type: 'Civil',
        judge_1: 'Judge Smith'
      };

      const result = validator.validateRow(invalidRow, 1);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      
      // Check for specific date validation errors
      const dateErrors = result.errors.filter(error => 
        error.field.includes('date') || error.field.includes('yyyy') || error.field.includes('mon')
      );
      expect(dateErrors.length).toBeGreaterThan(0);
    });

    it('should handle invalid numeric values', () => {
      const invalidRow: CsvRow = {
        date_dd: '15',
        date_mon: 'Jan',
        date_yyyy: '2024',
        caseid_type: 'TC',
        caseid_no: '123',
        filed_dd: '10',
        filed_mon: 'Dec',
        filed_yyyy: '2023',
        court: 'Test Court',
        case_type: 'Civil',
        judge_1: 'Judge Smith',
        male_applicant: '-1', // Invalid negative number
        female_applicant: '1000', // Exceeds maximum
        applicant_witness: 'not_a_number' // Invalid format
      };

      const result = validator.validateRow(invalidRow, 1);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateBatch', () => {
    it('should validate a batch of valid rows', () => {
      const validRows: CsvRow[] = [
        {
          date_dd: '15',
          date_mon: 'Jan',
          date_yyyy: '2024',
          caseid_type: 'TC',
          caseid_no: '123',
          filed_dd: '10',
          filed_mon: 'Dec',
          filed_yyyy: '2023',
          court: 'Test Court',
          case_type: 'Civil',
          judge_1: 'Judge Smith',
          outcome: 'Hearing'
        },
        {
          date_dd: '16',
          date_mon: 'Feb',
          date_yyyy: '2024',
          caseid_type: 'HC',
          caseid_no: '456',
          filed_dd: '11',
          filed_mon: 'Jan',
          filed_yyyy: '2024',
          court: 'High Court',
          case_type: 'Criminal',
          judge_1: 'Judge Jones',
          outcome: 'Judgment'
        }
      ];

      const result = validator.validateBatch(validRows);

      expect(result.totalRows).toBe(2);
      expect(result.validRows).toHaveLength(2);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle mixed valid and invalid rows', () => {
      const mixedRows: CsvRow[] = [
        {
          date_dd: '15',
          date_mon: 'Jan',
          date_yyyy: '2024',
          caseid_type: 'TC',
          caseid_no: '123',
          filed_dd: '10',
          filed_mon: 'Dec',
          filed_yyyy: '2023',
          court: 'Test Court',
          case_type: 'Civil',
          judge_1: 'Judge Smith',
          outcome: 'Hearing'
        },
        {
          date_dd: '32', // Invalid day
          date_mon: 'Jan',
          date_yyyy: '2024'
          // Missing required fields
        }
      ];

      const result = validator.validateBatch(mixedRows);

      expect(result.totalRows).toBe(2);
      expect(result.validRows).toHaveLength(1);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should implement early failure detection', () => {
      // Create 15 invalid rows to trigger early failure
      const invalidRows: CsvRow[] = Array.from({ length: 15 }, (_, i) => ({
        date_dd: '32', // Invalid day
        date_mon: 'InvalidMonth', // Invalid month
        caseid_type: `TC${i}` // Some valid data to make it a proper row
      }));

      const result = validator.validateBatch(invalidRows);

      expect(result.totalRows).toBe(15);
      expect(result.validRows).toHaveLength(0);
      expect(result.errors.length).toBeGreaterThan(0);
      
      // Should have an early failure error
      const earlyFailureError = result.errors.find(error => 
        error.errorType === 'early_failure'
      );
      expect(earlyFailureError).toBeDefined();
    });
  });

  describe('parseZodIssues', () => {
    it('should parse Zod issues correctly', () => {
      const mockIssues = [
        {
          path: ['date_dd'],
          message: 'Number must be greater than or equal to 1',
          code: 'too_small'
        },
        {
          path: ['caseid_type'],
          message: 'String must contain at least 1 character(s)',
          code: 'too_small'
        }
      ];

      const mockRow = {
        date_dd: '0',
        caseid_type: ''
      };

      const result = validator.parseZodIssues(mockIssues, mockRow);

      expect(result).toHaveLength(2);
      expect(result[0].field).toBe('date_dd');
      expect(result[0].errorMessage).toContain('Number must be greater than or equal to 1');
      expect(result[0].suggestion).toBeDefined();
      expect(result[1].field).toBe('caseid_type');
    });

    it('should handle invalid_type issues', () => {
      const mockIssues = [
        {
          path: ['date_dd'],
          message: 'Expected number, received string',
          code: 'invalid_type',
          expected: 'number',
          received: 'string'
        }
      ];

      const mockRow = {
        date_dd: 'not_a_number'
      };

      const result = validator.parseZodIssues(mockIssues, mockRow);

      expect(result).toHaveLength(1);
      expect(result[0].errorMessage).toContain('Expected number, received string');
    });
  });

  describe('parseZodError', () => {
    it('should parse missing required fields error', () => {
      const zodError = 'Missing required fields: caseid_type, caseid_no, court';
      const mockRow = {};

      const result = validator.parseZodError(zodError, mockRow);

      expect(result).toHaveLength(3);
      expect(result[0].field).toBe('caseid_type');
      expect(result[1].field).toBe('caseid_no');
      expect(result[2].field).toBe('court');
      expect(result[0].errorMessage).toContain('is required but missing');
    });

    it('should parse field-specific error lines', () => {
      const zodError = 'date_dd: Number must be greater than or equal to 1\ndate_mon: String must be exactly 3 characters';
      const mockRow = {
        date_dd: '0',
        date_mon: 'January'
      };

      const result = validator.parseZodError(zodError, mockRow);

      expect(result).toHaveLength(2);
      expect(result[0].field).toBe('date_dd');
      expect(result[1].field).toBe('date_mon');
    });

    it('should handle general errors when no specific fields found', () => {
      const zodError = 'General validation error';
      const mockRow = {};

      const result = validator.parseZodError(zodError, mockRow);

      expect(result).toHaveLength(1);
      expect(result[0].field).toBe('general');
      expect(result[0].errorMessage).toBe(zodError);
    });
  });

  describe('getFieldValidationSuggestion (deprecated)', () => {
    it('should provide generic suggestions since method is deprecated', () => {
      // All deprecated method calls should return generic suggestion
      expect(validator.getFieldValidationSuggestion('date_yyyy', 'greater than or equal to', '1900'))
        .toContain('Check the format and value for date_yyyy');
      
      expect(validator.getFieldValidationSuggestion('filed_yyyy', 'greater than or equal to', '1900'))
        .toContain('Check the format and value for filed_yyyy');

      expect(validator.getFieldValidationSuggestion('date_dd', 'greater than or equal to', '0'))
        .toContain('Check the format and value for date_dd');

      expect(validator.getFieldValidationSuggestion('date_mon', 'length', 'January'))
        .toContain('Check the format and value for date_mon');
    });

    it('should provide generic suggestions for numeric fields', () => {
      expect(validator.getFieldValidationSuggestion('male_applicant', 'greater than or equal to', '-1'))
        .toContain('Check the format and value for male_applicant');

      expect(validator.getFieldValidationSuggestion('female_defendant', 'less than or equal to', '1000'))
        .toContain('Check the format and value for female_defendant');
    });

    it('should provide generic suggestions for string fields', () => {
      expect(validator.getFieldValidationSuggestion('court', 'too long', 'Very long court name'))
        .toContain('Check the format and value for court');

      expect(validator.getFieldValidationSuggestion('judge_1', 'empty', ''))
        .toContain('Check the format and value for judge_1');
    });

    it('should provide generic suggestions for enum fields', () => {
      expect(validator.getFieldValidationSuggestion('legalrep', 'invalid enum', 'Maybe'))
        .toContain('Check the format and value for legalrep');
    });

    it('should provide default suggestion for unknown fields', () => {
      expect(validator.getFieldValidationSuggestion('unknown_field', 'unknown error', 'value'))
        .toContain('Check the format and value');
    });
  });

  describe('factory function', () => {
    it('should create a validator instance', () => {
      const validator = createValidator();
      expect(validator).toBeInstanceOf(CsvValidatorImpl);
    });
  });
});