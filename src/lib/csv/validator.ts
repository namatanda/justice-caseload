/**
 * CSV Validation Module
 * 
 * This module handles all validation logic for CSV data processing.
 * It provides validation for individual rows and batches, with detailed
 * error reporting and user-friendly suggestions.
 */

import { CaseReturnRowSchema, CaseReturnRow } from '@/lib/validation/schemas';
import { logger } from '@/lib/logger';
import { errorHandler } from './error-handler';
import type { 
  CsvValidator, 
  CsvRow, 
  ValidationResult, 
  BatchValidationResult, 
  ImportError 
} from './interfaces';

/**
 * Interface for field-specific validation errors
 */
interface FieldError {
  field: string;
  message: string;
  suggestion: string;
  rawValue: any;
}



/**
 * Implementation of the CSV Validator interface
 */
export class CsvValidatorImpl implements CsvValidator {
  
  /**
   * Validate a single CSV row against the schema
   */
  validateRow(row: CsvRow, rowNumber: number): ValidationResult {
    try {
      // Attempt to parse the row using Zod schema
      const validatedData = CaseReturnRowSchema.parse(row);
      
      return {
        isValid: true,
        errors: [],
        validatedData
      };
    } catch (error: any) {
      // Use centralized error handler for validation errors
      const importErrors = errorHandler.handleValidationError(error, row, rowNumber);
      
      // Convert ImportError[] to FieldError[] for ValidationResult interface
      const fieldErrors = importErrors.map(importError => ({
        field: importError.field || 'general',
        message: importError.errorMessage,
        suggestion: importError.suggestion || 'Check the data format',
        rawValue: importError.rawValue
      }));
      
      return {
        isValid: false,
        errors: fieldErrors,
        validatedData: undefined
      };
    }
  }

  /**
   * Validate an entire batch of rows with early failure detection
   */
  validateBatch(rows: CsvRow[]): BatchValidationResult {
    const validRows: CaseReturnRow[] = [];
    const errors: ImportError[] = [];
    let consecutiveErrors = 0;
    const maxConsecutiveErrors = 10; // Early failure threshold
    
    logger.import.info('Starting batch validation', { 
      totalRows: rows.length,
      maxConsecutiveErrors 
    });

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 1;
      
      try {
        const validationResult = this.validateRow(row, rowNumber);
        
        if (validationResult.isValid && validationResult.validatedData) {
          validRows.push(validationResult.validatedData);
          consecutiveErrors = 0; // Reset consecutive error counter
        } else {
          // Use error handler to get properly formatted import errors
          const importErrors = errorHandler.handleValidationError(
            new Error('Validation failed'), // Generic error for batch processing
            row, 
            rowNumber
          );
          
          errors.push(...importErrors);
          consecutiveErrors++;
          
          // Early failure detection
          if (consecutiveErrors >= maxConsecutiveErrors) {
            logger.import.warn('Early failure detected', {
              consecutiveErrors,
              rowNumber,
              totalProcessed: i + 1
            });
            
            errors.push({
              rowNumber: 0,
              errorType: 'early_failure',
              errorMessage: `Too many consecutive validation errors (${consecutiveErrors}). Stopping batch validation.`,
              suggestion: 'Please review your CSV data format and fix common issues before retrying.'
            });
            
            break;
          }
        }
      } catch (error) {
        // Handle unexpected errors during validation
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push({
          rowNumber,
          errorType: 'system_error',
          errorMessage: `Unexpected validation error: ${errorMessage}`,
          rawData: row
        });
        
        consecutiveErrors++;
        
        if (consecutiveErrors >= maxConsecutiveErrors) {
          break;
        }
      }
    }
    
    logger.import.info('Batch validation completed', {
      totalRows: rows.length,
      validRows: validRows.length,
      errorCount: errors.length,
      successRate: `${((validRows.length / rows.length) * 100).toFixed(1)}%`
    });

    return {
      totalRows: rows.length,
      validRows,
      errors
    };
  }

  /**
   * Parse Zod validation errors into user-friendly messages
   * @deprecated Use errorHandler.handleValidationError instead
   */
  parseZodError(zodError: string, row: any): ImportError[] {
    return errorHandler.handleValidationError(new Error(zodError), row, 0);
  }

  /**
   * Parse Zod issues into field errors
   * @deprecated Use errorHandler.handleValidationError instead
   */
  parseZodIssues(issues: any[], row: any): ImportError[] {
    const zodError = { issues };
    return errorHandler.handleValidationError(zodError, row, 0);
  }

  /**
   * Get field-specific validation suggestions
   * @deprecated Use errorHandler.handleValidationError instead
   */
  getFieldValidationSuggestion(field: string, message: string, rawValue: any): string {
    // This method is deprecated - error handler now provides suggestions
    return `Check the format and value for ${field}`;
  }
}

/**
 * Factory function to create a validator instance
 */
export function createValidator(): CsvValidator {
  return new CsvValidatorImpl();
}

/**
 * Default validator instance for convenience
 */
export const validator = createValidator();