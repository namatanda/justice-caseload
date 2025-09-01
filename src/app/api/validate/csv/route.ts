import { NextRequest, NextResponse } from 'next/server';
import { validateUploadedFile, validateCsvStructure, ValidationError } from '@/lib/import/file-handler';
import { CaseReturnRowSchema } from '@/lib/validation/schemas';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = await validateUploadedFile(file);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'File validation failed',
          errors: validation.errors,
          warnings: validation.warnings,
          errorCount: validation.errors.length,
          warningCount: validation.warnings.length
        },
        { status: 400 }
      );
    }

    // Save file temporarily for validation
    const { writeFile, mkdir } = await import('fs/promises');
    const { join } = await import('path');
    const { createHash } = await import('crypto');

    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    await mkdir(uploadDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const hash = createHash('sha256');
    hash.update(buffer);
    const checksum = hash.digest('hex');

    const tempFilename = `temp_${Date.now()}_${file.name}`;
    const tempFilePath = join(uploadDir, tempFilename);
    await writeFile(tempFilePath, buffer);

    try {
      // Validate CSV structure
      const structureValidation = await validateCsvStructure(tempFilePath);
      if (!structureValidation.isValid) {
        return NextResponse.json(
          {
            success: false,
            error: 'CSV structure validation failed',
            errors: structureValidation.errors,
            warnings: structureValidation.warnings,
            errorCount: structureValidation.errors.length,
            warningCount: structureValidation.warnings.length
          },
          { status: 400 }
        );
      }

      // Validate sample data against schema
      const validationErrors: ValidationError[] = [];
      const validationWarnings: ValidationError[] = [];
      const validSampleRows: any[] = [];

      if (structureValidation.sampleRows) {
        for (let i = 0; i < structureValidation.sampleRows.length; i++) {
          const row = structureValidation.sampleRows[i];
          try {
            const validatedRow = CaseReturnRowSchema.parse(row);
            validSampleRows.push(validatedRow);
          } catch (error) {
            if (error instanceof Error) {
              // Parse Zod error for better error messages
              const zodError = error.message;
              const fieldErrors = parseZodError(zodError, row);

              fieldErrors.forEach(fieldError => {
                validationErrors.push({
                  type: 'data',
                  severity: 'error',
                  message: fieldError.message,
                  suggestion: fieldError.suggestion,
                  field: fieldError.field,
                  rowNumber: i + 1,
                  rawValue: fieldError.rawValue
                });
              });
            }
          }
        }
      }

      // Clean up temp file
      const { unlink } = await import('fs/promises');
      await unlink(tempFilePath).catch(() => {}); // Ignore cleanup errors

      return NextResponse.json({
        success: true,
        valid: validationErrors.length === 0,
        errors: validationErrors,
        warnings: validationWarnings,
        recordCount: structureValidation.sampleRows?.length || 0,
        previewData: validSampleRows.slice(0, 10),
        checksum,
      });

    } catch (error) {
      // Clean up temp file on error
      const { unlink } = await import('fs/promises');
      await unlink(tempFilePath).catch(() => {});

      throw error;
    }

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

interface FieldError {
  field: string;
  message: string;
  suggestion: string;
  rawValue: any;
}

function parseZodError(zodError: string, row: any): FieldError[] {
  const errors: FieldError[] = [];

  // Handle the transform error for missing required fields
  if (zodError.includes('Missing required fields:')) {
    const missingFieldsMatch = zodError.match(/Missing required fields:\s*(.+)/);
    if (missingFieldsMatch) {
      const missingFields = missingFieldsMatch[1].split(', ');
      missingFields.forEach(field => {
        errors.push({
          field,
          message: `${field} is required but missing or empty`,
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
        field,
        message: `${field}: ${message}`,
        suggestion: getFieldValidationSuggestion(field, message, rawValue),
        rawValue
      });
    }
  }

  // If no specific field errors found, create a general error
  if (errors.length === 0) {
    errors.push({
      field: 'general',
      message: zodError,
      suggestion: 'Check the data format and ensure all required fields are properly formatted.',
      rawValue: null
    });
  }

  return errors;
}

function getFieldValidationSuggestion(field: string, message: string, rawValue: any): string {
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
      if (message.includes('greater than or equal to')) {
        return `Day must be between 1-31. Found: ${rawValue}`;
      }
      if (message.includes('less than or equal to')) {
        return `Day must be between 1-31. Found: ${rawValue}`;
      }
    }

    // Handle month fields
    if (field.includes('mon') || field === 'filed_mon') {
      if (message.includes('length')) {
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