/**
 * Unit tests for CSV Error Handler module
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorHandlerImpl, createErrorHandler, errorHandler } from '@/lib/csv/error-handler';
import type { ErrorContext } from '@/lib/csv/interfaces';

// Mock the logger
vi.mock('@/lib/logger', () => ({
  logger: {
    import: {
      warn: vi.fn(),
      error: vi.fn()
    },
    error: vi.fn()
  }
}));

describe('ErrorHandlerImpl', () => {
  let handler: ErrorHandlerImpl;

  beforeEach(() => {
    handler = new ErrorHandlerImpl();
    vi.clearAllMocks();
  });

  describe('handleValidationError', () => {
    it('should handle Zod validation errors with issues array', () => {
      const zodError = {
        issues: [
          {
            path: ['date_dd'],
            message: 'Number must be greater than or equal to 1',
            code: 'too_small'
          },
          {
            path: ['court'],
            message: 'String must contain at least 1 character(s)',
            code: 'too_small'
          }
        ]
      };

      const row = {
        date_dd: 0,
        court: '',
        caseid_type: 'HC',
        caseid_no: '123'
      };

      const result = handler.handleValidationError(zodError, row, 5);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        rowNumber: 5,
        errorType: 'date_validation_error',
        field: 'date_dd',
        errorMessage: 'date_dd: Number must be greater than or equal to 1',
        suggestion: 'Day must be between 1-31. Found: 0',
        rawValue: 0,
        rawData: row
      });

      expect(result[1]).toMatchObject({
        rowNumber: 5,
        errorType: 'validation_error',
        field: 'court',
        errorMessage: 'court: String must contain at least 1 character(s)',
        suggestion: 'court must be properly formatted text',
        rawValue: '',
        rawData: row
      });
    });

    it('should handle generic validation errors without issues array', () => {
      const error = new Error('Missing required fields: court, caseid_type');
      const row = { date_dd: 1, date_mon: 'Jan' };

      const result = handler.handleValidationError(error, row, 3);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        rowNumber: 3,
        errorType: 'missing_fields_error',
        field: 'court',
        errorMessage: 'court is required but missing or empty',
        suggestion: 'Please provide a value for court'
      });

      expect(result[1]).toMatchObject({
        rowNumber: 3,
        errorType: 'missing_fields_error',
        field: 'caseid_type',
        errorMessage: 'caseid_type is required but missing or empty',
        suggestion: 'Please provide a value for caseid_type'
      });
    });

    it('should handle Zod invalid_type errors', () => {
      const zodError = {
        issues: [
          {
            path: ['date_dd'],
            message: 'Expected number, received string',
            code: 'invalid_type',
            expected: 'number',
            received: 'string'
          },
          {
            path: ['court'],
            message: 'Required',
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined'
          }
        ]
      };

      const row = {
        date_dd: 'invalid',
        caseid_type: 'HC'
      };

      const result = handler.handleValidationError(zodError, row, 2);

      expect(result).toHaveLength(2);
      expect(result[0].errorMessage).toBe('date_dd: Expected number, received string');
      expect(result[1].errorMessage).toBe('court is required but missing');
    });

    it('should handle unparseable errors gracefully', () => {
      const error = { weird: 'object' };
      const row = { court: 'Test Court' };

      const result = handler.handleValidationError(error, row, 1);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        rowNumber: 1,
        errorType: 'validation_error',
        field: 'general',
        errorMessage: '[object Object]',
        suggestion: 'Check the data format and ensure all required fields are properly formatted.'
      });
    });
  });

  describe('handleDatabaseError', () => {
    it('should categorize case creation errors', () => {
      const error = new Error('Invalid `tx.case.create()` invocation');
      const context: ErrorContext = {
        operation: 'createCase',
        rowNumber: 5,
        data: { caseNumber: 'HC/123/2024' }
      };

      const result = handler.handleDatabaseError(error, context);

      expect(result).toMatchObject({
        rowNumber: 5,
        errorType: 'case_create_error',
        errorMessage: 'Failed to create case record. Please check required fields.',
        suggestion: 'Ensure all required case fields are provided and properly formatted.',
        rawData: context.data
      });
    });

    it('should categorize foreign key constraint errors', () => {
      const error = new Error('Foreign key constraint failed on the field: `courtId`');
      const context: ErrorContext = {
        operation: 'createCase',
        rowNumber: 3
      };

      const result = handler.handleDatabaseError(error, context);

      expect(result).toMatchObject({
        rowNumber: 3,
        errorType: 'foreign_key_error',
        errorMessage: 'Referenced record not found. Check court or case type values.',
        suggestion: 'Verify that court and case type values exist in the system.'
      });
    });

    it('should categorize unique constraint errors', () => {
      const error = new Error('Unique constraint failed on the fields: (`caseNumber`)');
      const context: ErrorContext = {
        operation: 'createCase',
        rowNumber: 7
      };

      const result = handler.handleDatabaseError(error, context);

      expect(result).toMatchObject({
        rowNumber: 7,
        errorType: 'duplicate_error',
        errorMessage: 'Duplicate record detected.',
        suggestion: 'Check for duplicate case numbers or activities.'
      });
    });

    it('should categorize connection errors', () => {
      const error = new Error('Connection timeout');
      const context: ErrorContext = {
        operation: 'query',
        rowNumber: 1
      };

      const result = handler.handleDatabaseError(error, context);

      expect(result).toMatchObject({
        rowNumber: 1,
        errorType: 'connection_error',
        errorMessage: 'Database connection error.',
        suggestion: 'Please try again later or contact system administrator.'
      });
    });

    it('should handle generic database errors', () => {
      const error = new Error('Some unknown database error');
      const context: ErrorContext = {
        operation: 'update'
      };

      const result = handler.handleDatabaseError(error, context);

      expect(result).toMatchObject({
        rowNumber: 0,
        errorType: 'database_error',
        errorMessage: 'Some unknown database error',
        suggestion: 'Please check the data and try again.'
      });
    });
  });

  describe('formatUserFriendlyError', () => {
    it('should format early validation failure errors', () => {
      const error = new Error('Early validation failed: 3 errors in first 5 rows');
      const result = handler.formatUserFriendlyError(error);
      
      expect(result).toBe('Import failed: Multiple validation errors detected in the first few rows. Please check your CSV data format.');
    });

    it('should format consecutive validation errors', () => {
      const error = new Error('Too many consecutive validation errors detected');
      const result = handler.formatUserFriendlyError(error);
      
      expect(result).toBe('Import failed: Too many consecutive validation errors detected. Please review your CSV data quality.');
    });

    it('should format date validation errors', () => {
      const error = new Error('Invalid date format in field date_dd');
      const result = handler.formatUserFriendlyError(error);
      
      expect(result).toBe('Import failed: Date format validation errors. Please check date fields in your CSV.');
    });

    it('should format missing fields errors', () => {
      const error = new Error('Missing required fields: court, judge');
      const result = handler.formatUserFriendlyError(error);
      
      expect(result).toBe('Import failed: Required fields are missing. Please check your CSV headers and data.');
    });

    it('should preserve duplicate import messages', () => {
      const error = new Error('File has already been imported previously. Batch ID: 123');
      const result = handler.formatUserFriendlyError(error);
      
      expect(result).toBe('File has already been imported previously. Batch ID: 123');
    });

    it('should format connection errors', () => {
      const error = new Error('Connection refused ECONNREFUSED');
      const result = handler.formatUserFriendlyError(error);
      
      expect(result).toBe('Import failed: Database connection error. Please try again later.');
    });

    it('should format timeout errors', () => {
      const error = new Error('Operation timeout after 30 seconds');
      const result = handler.formatUserFriendlyError(error);
      
      expect(result).toBe('Import failed: Operation timed out. Please try again with a smaller file.');
    });

    it('should provide default message for unknown errors', () => {
      const error = new Error('Some unknown system error');
      const result = handler.formatUserFriendlyError(error);
      
      expect(result).toBe('Import failed due to system error. Please check your data and try again.');
    });
  });

  describe('categorizeError', () => {
    it('should categorize validation errors', () => {
      expect(handler.categorizeError(new Error('Validation failed'))).toBe('validation');
      expect(handler.categorizeError(new Error('Invalid data format'))).toBe('validation');
      expect(handler.categorizeError(new Error('Required field missing'))).toBe('validation');
    });

    it('should categorize database errors', () => {
      expect(handler.categorizeError(new Error('Database connection failed'))).toBe('database');
      expect(handler.categorizeError(new Error('Foreign key constraint'))).toBe('database');
      expect(handler.categorizeError(new Error('Unique constraint violation'))).toBe('database');
    });

    it('should categorize business errors', () => {
      expect(handler.categorizeError(new Error('Duplicate record found'))).toBe('business');
      expect(handler.categorizeError(new Error('Record already exists'))).toBe('business');
      expect(handler.categorizeError(new Error('Business rule violation'))).toBe('business');
    });

    it('should categorize system errors as default', () => {
      expect(handler.categorizeError(new Error('Unknown system error'))).toBe('system');
      expect(handler.categorizeError(new Error('Memory allocation failed'))).toBe('system');
    });
  });

  describe('field validation suggestions', () => {
    it('should provide year field suggestions', () => {
      const zodError = {
        issues: [
          {
            path: ['date_yyyy'],
            message: 'Number must be greater than or equal to 2015',
            code: 'too_small'
          },
          {
            path: ['filed_yyyy'],
            message: 'Number must be greater than or equal to 1960',
            code: 'too_small'
          }
        ]
      };

      const row = { date_yyyy: 2010, filed_yyyy: 1950 };
      const result = handler.handleValidationError(zodError, row, 1);

      expect(result[0].suggestion).toBe('Year must be 2015 or later. Found: 2010');
      expect(result[1].suggestion).toBe('Year must be 1960 or later. Found: 1950');
    });

    it('should provide day field suggestions', () => {
      const zodError = {
        issues: [
          {
            path: ['date_dd'],
            message: 'Number must be greater than or equal to 1',
            code: 'too_small'
          }
        ]
      };

      const row = { date_dd: 0 };
      const result = handler.handleValidationError(zodError, row, 1);

      expect(result[0].suggestion).toBe('Day must be between 1-31. Found: 0');
    });

    it('should provide month field suggestions', () => {
      const zodError = {
        issues: [
          {
            path: ['date_mon'],
            message: 'String must contain exactly 3 character(s)',
            code: 'invalid_string'
          }
        ]
      };

      const row = { date_mon: 'January' };
      const result = handler.handleValidationError(zodError, row, 1);

      expect(result[0].suggestion).toBe('Month should be 3-letter abbreviation (e.g., Jan, Feb). Found: January');
    });

    it('should provide enum field suggestions', () => {
      const zodError = {
        issues: [
          {
            path: ['legalrep'],
            message: 'Invalid enum value',
            code: 'invalid_enum_value'
          }
        ]
      };

      const row = { legalrep: 'maybe' };
      const result = handler.handleValidationError(zodError, row, 1);

      expect(result[0].suggestion).toBe('legalrep must be either "Yes" or "No" (case sensitive)');
    });
  });
});

describe('Factory functions', () => {
  it('should create error handler instance', () => {
    const handler = createErrorHandler();
    expect(handler).toBeInstanceOf(ErrorHandlerImpl);
  });

  it('should provide default error handler instance', () => {
    expect(errorHandler).toBeInstanceOf(ErrorHandlerImpl);
  });
});

describe('Integration scenarios', () => {
  let handler: ErrorHandlerImpl;

  beforeEach(() => {
    handler = new ErrorHandlerImpl();
  });

  it('should handle complex validation scenario with multiple field types', () => {
    const zodError = {
      issues: [
        {
          path: ['court'],
          message: 'Required',
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined'
        },
        {
          path: ['date_dd'],
          message: 'Number must be greater than or equal to 1',
          code: 'too_small'
        },
        {
          path: ['date_mon'],
          message: 'String must contain exactly 3 character(s)',
          code: 'invalid_string'
        },
        {
          path: ['legalrep'],
          message: 'Invalid enum value',
          code: 'invalid_enum_value'
        }
      ]
    };

    const row = {
      date_dd: 0,
      date_mon: 'January',
      legalrep: 'maybe',
      caseid_type: 'HC'
    };

    const result = handler.handleValidationError(zodError, row, 10);

    expect(result).toHaveLength(4);
    
    // Check error types are correctly categorized
    expect(result[0].errorType).toBe('missing_fields_error'); // court
    expect(result[1].errorType).toBe('date_validation_error'); // date_dd
    expect(result[2].errorType).toBe('date_validation_error'); // date_mon
    expect(result[3].errorType).toBe('data_format_error'); // legalrep

    // Check suggestions are field-specific
    expect(result[0].suggestion).toContain('court');
    expect(result[1].suggestion).toContain('Day must be between 1-31');
    expect(result[2].suggestion).toContain('3-letter abbreviation');
    expect(result[3].suggestion).toContain('Yes" or "No"');
  });

  it('should handle database error with full context', () => {
    const error = new Error('Foreign key constraint failed on the field: `courtId`');
    const context: ErrorContext = {
      operation: 'createCase',
      rowNumber: 15,
      data: {
        caseNumber: 'HC/123/2024',
        court: 'Unknown Court',
        caseType: 'Civil'
      }
    };

    const result = handler.handleDatabaseError(error, context);

    expect(result).toMatchObject({
      rowNumber: 15,
      errorType: 'foreign_key_error',
      errorMessage: 'Referenced record not found. Check court or case type values.',
      suggestion: 'Verify that court and case type values exist in the system.',
      rawData: context.data
    });
  });
});