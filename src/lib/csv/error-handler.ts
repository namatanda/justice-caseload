/**
 * CSV Error Handler Module
 * 
 * This module centralizes all error handling logic for CSV processing.
 * It provides consistent error categorization, formatting, and logging
 * across all CSV processing modules.
 */

import { logger } from '@/lib/logger';
import type { 
  ErrorHandler, 
  ImportError, 
  ErrorContext, 
  ErrorCategory 
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
 * Implementation of the Error Handler interface
 */
export class ErrorHandlerImpl implements ErrorHandler {

  /**
   * Handle validation errors and format them consistently
   */
  handleValidationError(error: any, row: any, rowNumber: number): ImportError[] {
    const errors: ImportError[] = [];

    try {
      // Handle Zod validation errors
      if (error.issues && Array.isArray(error.issues)) {
        // Handle ZodError with structured issues
        const fieldErrors = this.parseZodIssues(error.issues, row);
        
        fieldErrors.forEach(fieldError => {
          const errorType = this.categorizeValidationError(fieldError);
          
          errors.push({
            rowNumber,
            errorType,
            errorMessage: fieldError.message,
            field: fieldError.field,
            suggestion: fieldError.suggestion,
            rawValue: fieldError.rawValue,
            rawData: row
          });
        });
      } else {
        // Handle generic validation errors
        const errorMessage = error instanceof Error ? error.message : String(error);
        const fieldErrors = this.parseZodError(errorMessage, row);
        
        fieldErrors.forEach(importError => {
          errors.push({
            ...importError,
            rowNumber
          });
        });
      }

      // Log validation errors for debugging
      logger.import.warn(`Row ${rowNumber} validation failed`, {
        errorCount: errors.length,
        sampleErrors: errors.slice(0, 3).map(e => ({
          field: e.field,
          message: e.errorMessage,
          suggestion: e.suggestion
        })),
        rawDataKeys: Object.keys(row),
        rawDataSample: this.getSafeRowSample(row)
      });

    } catch (parseError) {
      // Fallback for unparseable errors
      logger.error('general', 'Failed to parse validation error:', parseError);
      
      errors.push({
        rowNumber,
        errorType: 'validation_error',
        errorMessage: error instanceof Error ? error.message : String(error),
        field: 'general',
        suggestion: 'Check the data format and ensure all required fields are properly formatted.',
        rawData: row
      });
    }

    return errors;
  }

  /**
   * Handle database errors with context
   */
  handleDatabaseError(error: any, context: ErrorContext): ImportError {
    let errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    let errorType = 'database_error';
    let suggestion = 'Please check the data and try again.';

    // Categorize database errors for better user feedback
    if (errorMessage.includes('Invalid `tx.case.create()`')) {
      errorType = 'case_create_error';
      errorMessage = 'Failed to create case record. Please check required fields.';
      suggestion = 'Ensure all required case fields are provided and properly formatted.';
    } else if (errorMessage.includes('Foreign key constraint')) {
      errorType = 'foreign_key_error';
      errorMessage = 'Referenced record not found. Check court or case type values.';
      suggestion = 'Verify that court and case type values exist in the system.';
    } else if (errorMessage.includes('Unique constraint')) {
      errorType = 'duplicate_error';
      errorMessage = 'Duplicate record detected.';
      suggestion = 'Check for duplicate case numbers or activities.';
    } else if (errorMessage.includes('Connection')) {
      errorType = 'connection_error';
      errorMessage = 'Database connection error.';
      suggestion = 'Please try again later or contact system administrator.';
    }

    // Log database errors with full context
    logger.error('general', `Database error in ${context.operation}`, {
      errorType,
      errorMessage,
      rowNumber: context.rowNumber,
      operation: context.operation,
      originalError: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    return {
      rowNumber: context.rowNumber || 0,
      errorType,
      errorMessage,
      suggestion,
      rawData: context.data
    };
  }

  /**
   * Format errors into user-friendly messages
   */
  formatUserFriendlyError(error: Error): string {
    const errorMessage = error.message;

    // Handle specific error patterns
    if (errorMessage.includes('Early validation failed')) {
      return 'Import failed: Multiple validation errors detected in the first few rows. Please check your CSV data format.';
    }
    
    if (errorMessage.includes('Too many consecutive')) {
      return 'Import failed: Too many consecutive validation errors detected. Please review your CSV data quality.';
    }
    
    if (errorMessage.includes('Invalid date')) {
      return 'Import failed: Date format validation errors. Please check date fields in your CSV.';
    }
    
    if (errorMessage.includes('Missing required fields')) {
      return 'Import failed: Required fields are missing. Please check your CSV headers and data.';
    }
    
    if (errorMessage.includes('already been imported')) {
      return errorMessage; // Preserve duplicate import messages as-is
    }
    
    if (errorMessage.includes('Connection') || errorMessage.includes('ECONNREFUSED')) {
      return 'Import failed: Database connection error. Please try again later.';
    }
    
    if (errorMessage.includes('timeout')) {
      return 'Import failed: Operation timed out. Please try again with a smaller file.';
    }

    // Default user-friendly message
    return 'Import failed due to system error. Please check your data and try again.';
  }

  /**
   * Categorize errors by type
   */
  categorizeError(error: Error): ErrorCategory {
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('validation') || 
        errorMessage.includes('invalid') || 
        errorMessage.includes('required') ||
        errorMessage.includes('missing')) {
      return 'validation';
    }

    if (errorMessage.includes('database') || 
        errorMessage.includes('connection') || 
        errorMessage.includes('constraint') ||
        errorMessage.includes('foreign key') ||
        errorMessage.includes('unique')) {
      return 'database';
    }

    if (errorMessage.includes('duplicate') || 
        errorMessage.includes('already exists') ||
        errorMessage.includes('business rule')) {
      return 'business';
    }

    return 'system';
  }

  /**
   * Parse Zod validation issues into field errors
   */
  private parseZodIssues(issues: any[], row: any): FieldError[] {
    const errors: FieldError[] = [];

    for (const issue of issues) {
      const field = issue.path && issue.path.length > 0 ? issue.path[0] : 'general';
      const rawValue = row[field];
      
      let message = `${field}: ${issue.message}`;
      if (issue.code === 'invalid_type' && issue.expected && issue.received) {
        if (issue.received === 'undefined') {
          message = `${field} is required but missing`;
        } else {
          message = `${field}: Expected ${issue.expected}, received ${issue.received}`;
        }
      }

      errors.push({
        field,
        message,
        suggestion: this.getFieldValidationSuggestion(field, issue.message, rawValue),
        rawValue
      });
    }

    return errors;
  }

  /**
   * Parse Zod error string into import errors
   */
  private parseZodError(zodError: string, row: any): ImportError[] {
    const errors: ImportError[] = [];

    // Handle the transform error for missing required fields
    if (zodError.includes('Missing required fields:')) {
      const missingFieldsMatch = zodError.match(/Missing required fields:\s*(.+)/);
      if (missingFieldsMatch) {
        const missingFields = missingFieldsMatch[1].split(', ');
        missingFields.forEach(field => {
          errors.push({
            rowNumber: 0, // Will be set by caller
            errorType: 'missing_fields_error',
            errorMessage: `${field} is required but missing or empty`,
            field,
            suggestion: `Please provide a value for ${field}`,
            rawValue: row[field] || null
          });
        });
        return errors;
      }
    }

    // Extract field-specific errors from Zod error message
    const errorLines = zodError.split('\n').filter(line => line.trim());

    for (const line of errorLines) {
      // Parse lines like: "date_dd: Number must be greater than or equal to 1"
      const fieldMatch = line.match(/^(\w+):\s*(.+)$/);
      if (fieldMatch) {
        const [, field, message] = fieldMatch;
        const rawValue = row[field];

        errors.push({
          rowNumber: 0, // Will be set by caller
          errorType: 'validation_error',
          errorMessage: `${field}: ${message}`,
          field,
          suggestion: this.getFieldValidationSuggestion(field, message, rawValue),
          rawValue
        });
      }
    }

    // If no specific field errors found, create a general error
    if (errors.length === 0) {
      errors.push({
        rowNumber: 0, // Will be set by caller
        errorType: 'validation_error',
        errorMessage: zodError,
        field: 'general',
        suggestion: 'Check the data format and ensure all required fields are properly formatted.',
        rawValue: null
      });
    }

    return errors;
  }

  /**
   * Get field-specific validation suggestions for better user experience
   */
  private getFieldValidationSuggestion(field: string, message: string, rawValue: any): string {
    // Date field validations
    if (field.includes('date') || field.includes('filed')) {
      // Handle year fields specifically
      if (field.includes('yyyy') || field === 'filed_yyyy' || field === 'date_yyyy' || field === 'next_yyyy') {
        const currentYear = new Date().getFullYear();
        if (message.includes('greater than or equal to')) {
          if (field === 'filed_yyyy') {
            return `Year must be 1960 or later. Found: ${rawValue}`;
          } else {
            return `Year must be 2015 or later. Found: ${rawValue}`;
          }
        }
        if (message.includes('less than or equal to')) {
          return `Year must be ${currentYear} or earlier. Found: ${rawValue}`;
        }
        if (field === 'filed_yyyy') {
          return `Year must be between 1960 and ${currentYear}. Found: ${rawValue}`;
        } else {
          return `Year must be between 2015 and ${currentYear}. Found: ${rawValue}`;
        }
      }

      // Handle day fields
      if (field.includes('dd') || field === 'filed_dd') {
        if (message.includes('greater than or equal to') || message.includes('less than or equal to') || message.includes('must be') || (message.toLowerCase().includes('required') && (rawValue === '0' || rawValue === 0))) {
          return `Day must be between 1-31. Found: ${rawValue}`;
        }
      }

      // Handle month fields
      if (field.includes('mon') || field === 'filed_mon') {
        if (message.includes('length') || message.includes('character') || message.includes('abbreviation')) {
          return `Month should be 3-letter abbreviation (e.g., Jan, Feb). Found: ${rawValue}`;
        }
      }

      // Generic date field suggestions
      if (message.includes('greater than or equal to')) {
        return `Ensure ${field} is a valid day (1-31)`;
      }
      if (message.includes('less than or equal to')) {
        return `Ensure ${field} is within valid range`;
      }
      if (message.includes('length')) {
        return `Month should be 3-letter abbreviation (e.g., Jan, Feb)`;
      }
      return `Ensure date format is correct: ${field} should be valid for its type`;
    }

    // Numeric field validations
    if (message.includes('number') || field.includes('male') || field.includes('female') || field.includes('witness') || field.includes('custody')) {
      if (message.includes('greater than or equal to')) {
        return `${field} must be 0 or greater`;
      }
      if (message.includes('less than or equal to')) {
        return `${field} exceeds maximum allowed value`;
      }
      return `${field} must be a valid number`;
    }

    // String field validations
    if (message.includes('length') || field.includes('court') || field.includes('judge') || field.includes('case')) {
      if (message.includes('too long')) {
        return `${field} is too long. Maximum length exceeded.`;
      }
      if (message.includes('too short') || message.includes('empty')) {
        return `${field} cannot be empty`;
      }
      return `${field} must be properly formatted text`;
    }

    // Enum validations
    if (message.includes('invalid enum') || field === 'legalrep') {
      if (field === 'legalrep') {
        return `${field} must be either "Yes" or "No" (case sensitive)`;
      }
      return `${field} contains invalid value. Check allowed values.`;
    }

    // Default suggestion
    return `Check the format and value for ${field}`;
  }

  /**
   * Categorize validation errors by field type
   */
  private categorizeValidationError(fieldError: FieldError): string {
    const field = fieldError.field;
    const message = fieldError.message;

    if (field.includes('date') || field.includes('filed') || field.includes('yyyy') || field.includes('dd') || field.includes('mon')) {
      return 'date_validation_error';
    }
    
    if (message.includes('Missing required fields') || message.includes('required but missing')) {
      return 'missing_fields_error';
    }
    
    if (message.includes('Invalid') || message.includes('invalid enum')) {
      return 'data_format_error';
    }

    return 'validation_error';
  }

  /**
   * Get a safe sample of row data for logging (avoiding sensitive information)
   */
  private getSafeRowSample(row: any): any {
    return {
      court: row.court,
      caseid_type: row.caseid_type,
      caseid_no: row.caseid_no,
      case_type: row.case_type,
      judge_1: row.judge_1,
      date_dd: row.date_dd,
      date_mon: row.date_mon,
      date_yyyy: row.date_yyyy
    };
  }
}

/**
 * Factory function to create an error handler instance
 */
export function createErrorHandler(): ErrorHandler {
  return new ErrorHandlerImpl();
}

/**
 * Default error handler instance for convenience
 */
export const errorHandler = createErrorHandler();