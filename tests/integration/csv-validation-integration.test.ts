/**
 * Integration tests for CSV validation module with main processing workflow
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { validator } from '@/lib/csv/validator';
import { CaseReturnRowSchema } from '@/lib/validation/schemas';
import type { CsvRow } from '@/lib/csv/types';

describe('CSV Validation Integration', () => {
  describe('Integration with Zod Schema', () => {
    it('should validate the same data consistently between validator and direct schema', () => {
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
        outcome: 'Hearing'
      };

      // Test with validator module
      const validatorResult = validator.validateRow(validRow, 1);
      
      // Test with direct schema
      let schemaResult;
      try {
        schemaResult = CaseReturnRowSchema.parse(validRow);
      } catch (error) {
        schemaResult = null;
      }

      // Both should succeed
      expect(validatorResult.isValid).toBe(true);
      expect(schemaResult).not.toBeNull();
      expect(validatorResult.validatedData).toBeDefined();
    });

    it('should handle validation errors consistently', () => {
      const invalidRow: CsvRow = {
        date_dd: '32', // Invalid day
        date_mon: 'InvalidMonth', // Invalid month
        date_yyyy: '1900', // Year too old
        caseid_type: '', // Empty required field
        caseid_no: '123',
        filed_dd: '10',
        filed_mon: 'Dec',
        filed_yyyy: '2023',
        court: 'Test Court',
        case_type: 'Civil',
        judge_1: 'Judge Smith'
      };

      // Test with validator module
      const validatorResult = validator.validateRow(invalidRow, 1);
      
      // Test with direct schema
      let schemaError = null;
      try {
        CaseReturnRowSchema.parse(invalidRow);
      } catch (error) {
        schemaError = error;
      }

      // Both should fail
      expect(validatorResult.isValid).toBe(false);
      expect(schemaError).not.toBeNull();
      expect(validatorResult.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Error Message Quality', () => {
    it('should provide helpful suggestions for common validation errors', () => {
      const invalidRow: CsvRow = {
        date_dd: '0', // Invalid day
        date_mon: 'January', // Wrong format
        date_yyyy: '1900', // Too old
        caseid_type: 'TC',
        caseid_no: '123',
        filed_dd: '10',
        filed_mon: 'Dec',
        filed_yyyy: '2023',
        court: 'Test Court',
        case_type: 'Civil',
        judge_1: 'Judge Smith',
        male_applicant: '-1', // Invalid negative
        legalrep: 'Maybe' // Invalid enum
      };

      const result = validator.validateRow(invalidRow, 1);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);

      // Check for specific helpful suggestions
      const dayError = result.errors.find(e => e.field === 'date_dd');
      expect(dayError?.suggestion).toContain('Day must be between 1-31');

      const monthError = result.errors.find(e => e.field === 'date_mon');
      expect(monthError?.suggestion).toContain('3-letter abbreviation');

      const yearError = result.errors.find(e => e.field === 'date_yyyy');
      expect(yearError?.suggestion).toContain('2015 or later');

      const numericError = result.errors.find(e => e.field === 'male_applicant');
      expect(numericError?.suggestion).toContain('must be 0 or greater');

      const enumError = result.errors.find(e => e.field === 'legalrep');
      expect(enumError?.suggestion).toContain('must be either "Yes" or "No"');
    });
  });

  describe('Batch Processing Performance', () => {
    it('should handle large batches efficiently', () => {
      // Create a batch of 1000 rows
      const largeBatch: CsvRow[] = Array.from({ length: 1000 }, (_, i) => ({
        date_dd: '15',
        date_mon: 'Jan',
        date_yyyy: '2024',
        caseid_type: 'TC',
        caseid_no: `${i + 1}`,
        filed_dd: '10',
        filed_mon: 'Dec',
        filed_yyyy: '2023',
        court: 'Test Court',
        case_type: 'Civil',
        judge_1: 'Judge Smith',
        outcome: 'Hearing'
      }));

      const startTime = Date.now();
      const result = validator.validateBatch(largeBatch);
      const endTime = Date.now();

      expect(result.totalRows).toBe(1000);
      expect(result.validRows).toHaveLength(1000);
      expect(result.errors).toHaveLength(0);
      
      // Should complete within reasonable time (less than 5 seconds)
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('should implement early failure detection correctly', () => {
      // Create a batch with many consecutive invalid rows
      const invalidBatch: CsvRow[] = Array.from({ length: 20 }, (_, i) => ({
        date_dd: '32', // Invalid day
        date_mon: 'InvalidMonth', // Invalid month
        caseid_type: `TC${i}` // Some valid data to make it a proper row
      }));

      const result = validator.validateBatch(invalidBatch);

      expect(result.totalRows).toBe(20);
      expect(result.validRows).toHaveLength(0);
      expect(result.errors.length).toBeGreaterThan(0);
      
      // Should have early failure error
      const earlyFailureError = result.errors.find(error => 
        error.errorType === 'early_failure'
      );
      expect(earlyFailureError).toBeDefined();
      expect(earlyFailureError?.errorMessage).toContain('consecutive validation errors');
    });
  });

  describe('Real-world Data Scenarios', () => {
    it('should handle typical CSV data with optional fields', () => {
      const typicalRow: CsvRow = {
        date_dd: '15',
        date_mon: 'Jan',
        date_yyyy: '2024',
        caseid_type: 'HCCC',
        caseid_no: '123/2024',
        filed_dd: '10',
        filed_mon: 'Dec',
        filed_yyyy: '2023',
        court: 'Milimani Commercial Court',
        case_type: 'Commercial Suit',
        judge_1: 'Hon. Justice Smith',
        judge_2: 'Hon. Justice Jones', // Optional
        outcome: 'Mention',
        comingfor: 'Directions',
        next_dd: '20',
        next_mon: 'Feb',
        next_yyyy: '2024',
        male_applicant: '1',
        female_applicant: '0',
        organization_applicant: '0',
        male_defendant: '2',
        female_defendant: '1',
        organization_defendant: '0',
        legalrep: 'Yes',
        applicant_witness: '3',
        defendant_witness: '2',
        custody: '0',
        other_details: 'Additional case notes'
      };

      const result = validator.validateRow(typicalRow, 1);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.validatedData).toBeDefined();
      
      // Verify optional fields are handled correctly
      expect(result.validatedData?.judge_2).toBe('Hon. Justice Jones');
      expect(result.validatedData?.other_details).toBe('Additional case notes');
    });

    it('should handle CSV data with empty optional fields', () => {
      const rowWithEmptyOptionals: CsvRow = {
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
        judge_2: '', // Empty optional field
        judge_3: '', // Empty optional field
        outcome: 'Hearing',
        next_dd: '', // Empty optional date
        next_mon: '', // Empty optional date
        next_yyyy: '', // Empty optional date
        reason_adj: '', // Empty optional field
        other_details: '' // Empty optional field
      };

      const result = validator.validateRow(rowWithEmptyOptionals, 1);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.validatedData).toBeDefined();
    });
  });
});