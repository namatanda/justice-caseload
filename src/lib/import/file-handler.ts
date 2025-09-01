import { promises as fs } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';
import { FileUploadSchema } from '../validation/schemas';

export interface ValidationError {
  type: 'file' | 'structure' | 'data' | 'schema';
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion?: string;
  field?: string;
  rowNumber?: number;
  rawValue?: any;
}

export interface FileValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  fileInfo?: {
    filename: string;
    size: number;
    type: string;
    checksum: string;
  };
}

export async function validateUploadedFile(
  file: File | { name: string; size: number; type: string }
): Promise<FileValidationResult> {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  try {
    // Check file extension first as a fallback
    const hasCsvExtension = file.name.toLowerCase().endsWith('.csv');
    const detectedMimeType = file.type;

    // Validate using Zod schema
    const validation = FileUploadSchema.safeParse({
      filename: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.success) {
      let hasValidFallback = false;

      validation.error.errors.forEach(err => {
        // Provide more specific error messages based on the issue
        let enhancedMessage = err.message;
        let enhancedSuggestion = getFileValidationSuggestion(err.message, detectedMimeType, hasCsvExtension);

        // If it's a type error and we have a .csv extension, provide a more lenient approach
        if (err.path.includes('type')) {
          if (hasCsvExtension) {
            // File has .csv extension but unsupported MIME type - this is often valid
            enhancedMessage = `File has .csv extension but detected MIME type "${detectedMimeType}" is not standard.`;
            enhancedSuggestion = 'This is usually fine. The file will be processed as CSV based on the extension.';
            hasValidFallback = true;

            // Convert to warning instead of error
            warnings.push({
              type: 'file',
              severity: 'warning',
              message: enhancedMessage,
              field: err.path.join('.'),
              suggestion: enhancedSuggestion,
              rawValue: detectedMimeType
            });
            return; // Don't add to errors
          } else {
            enhancedMessage = `Unsupported file type detected: "${detectedMimeType}". Expected CSV format.`;
          }
        }

        errors.push({
          type: 'file',
          severity: 'error',
          message: enhancedMessage,
          field: err.path.join('.'),
          suggestion: enhancedSuggestion,
          rawValue: detectedMimeType
        });
      });

      // If we have a valid fallback (CSV extension), don't fail validation
      if (hasValidFallback && errors.length === 0) {
        // Clear any type-related errors since we have a valid fallback
      }
    }

    // Additional validations
    if (!file.name.toLowerCase().endsWith('.csv')) {
      errors.push({
        type: 'file',
        severity: 'error',
        message: 'File must have .csv extension',
        field: 'filename',
        suggestion: 'Rename the file to have a .csv extension'
      });
    }

    if (file.size === 0) {
      errors.push({
        type: 'file',
        severity: 'error',
        message: 'File cannot be empty',
        field: 'size',
        suggestion: 'Ensure the CSV file contains data'
      });
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      errors.push({
        type: 'file',
        severity: 'error',
        message: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum limit of 10MB`,
        field: 'size',
        suggestion: 'Split large files into smaller chunks or remove unnecessary data'
      });
    }

    // Check for suspicious file sizes
    if (file.size < 100) {
      warnings.push({
        type: 'file',
        severity: 'warning',
        message: 'File is very small, may not contain sufficient data',
        field: 'size',
        suggestion: 'Verify the file contains the expected CSV data'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fileInfo: {
        filename: file.name,
        size: file.size,
        type: file.type,
        checksum: '', // Will be calculated when file is saved
      },
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [{
        type: 'file',
        severity: 'error',
        message: `File validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        suggestion: 'Try uploading the file again or check if the file is corrupted',
        field: 'file'
      }],
      warnings: []
    };
  }
}

function getFileValidationSuggestion(errorMessage: string, detectedMimeType?: string, hasCsvExtension?: boolean): string {
  if (errorMessage.includes('filename')) {
    return 'Ensure the filename is valid and not too long';
  }
  if (errorMessage.includes('size')) {
    return 'Check file size and ensure it meets requirements';
  }
  if (errorMessage.includes('type') || errorMessage.includes('Unsupported file type')) {
    // Provide specific suggestions based on the detected MIME type
    if (detectedMimeType) {
      if (detectedMimeType === 'text/plain' && hasCsvExtension) {
        return 'File appears to be a valid CSV but with plain text MIME type. This is normal for many CSV files.';
      }
      if (detectedMimeType.includes('excel') || detectedMimeType.includes('spreadsheet')) {
        return 'This appears to be an Excel file. Please save it as CSV format before uploading.';
      }
      if (detectedMimeType.includes('pdf')) {
        return 'PDF files are not supported. Please provide data in CSV format.';
      }
      if (detectedMimeType.includes('word') || detectedMimeType.includes('document')) {
        return 'Word documents are not supported. Please provide data in CSV format.';
      }
      return `Detected MIME type: "${detectedMimeType}". Please ensure the file is saved as CSV format.`;
    }
    return 'Ensure the file is a valid CSV format. Try saving it as "CSV (Comma delimited)" in Excel.';
  }
  return 'Please check the file and try again';
}

export async function saveUploadedFile(
  file: File,
  uploadDir: string = process.env.UPLOAD_DIR || './uploads'
): Promise<{
  success: boolean;
  filePath?: string;
  checksum?: string;
  error?: string;
}> {
  try {
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Generate unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}_${file.name}`;
    const filePath = join(uploadDir, filename);
    
    // Convert File to Buffer (in browser/Node.js environment)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Calculate checksum
    const hash = createHash('sha256');
    hash.update(buffer);
    const checksum = hash.digest('hex');
    
    // Save file
    await fs.writeFile(filePath, buffer);
    
    return {
      success: true,
      filePath,
      checksum,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

async function detectTextFile(filePath: string): Promise<boolean> {
  try {
    // Read first 512 bytes to check for binary content
    const { readFileSync } = await import('fs');
    const fullBuffer = readFileSync(filePath);
    const buffer = fullBuffer.slice(0, 512); // Take first 512 bytes

    // Check for null bytes or non-printable characters that indicate binary files
    for (let i = 0; i < buffer.length; i++) {
      const byte = buffer[i];

      // Null byte or non-printable characters (except common whitespace)
      if (byte === 0 ||
          (byte < 32 && byte !== 9 && byte !== 10 && byte !== 13)) {
        return false;
      }
    }

    return true;
  } catch (error) {
    // If we can't read the file, assume it's not a text file
    return false;
  }
}

export async function validateCsvStructure(filePath: string): Promise<{
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  columnCount?: number;
  sampleRows?: any[];
}> {
  try {
    // First, check if the file is actually a text file to prevent parsing binary files
    const isTextFile = await detectTextFile(filePath);
    if (!isTextFile) {
      return {
        isValid: false,
        errors: [{
          type: 'file',
          severity: 'error',
          message: 'File appears to be a binary file, not a text-based CSV file',
          suggestion: 'Please upload a valid CSV file. Binary files like images, PDFs, or executables cannot be processed as CSV data.',
          field: 'content'
        }],
        warnings: []
      };
    }

    const csv = await import('csv-parser');
    const { createReadStream } = await import('fs');

    return new Promise((resolve, reject) => {
      const errors: ValidationError[] = [];
      const warnings: ValidationError[] = [];
      const sampleRows: any[] = [];
      let columnCount = 0;
      let rowCount = 0;
      let stream: any = null;

      // Add timeout protection (30 seconds max)
      const timeout = setTimeout(() => {
        if (stream) {
          stream.destroy();
        }
        resolve({
          isValid: false,
          errors: [{
            type: 'structure',
            severity: 'error',
            message: 'CSV validation timed out. File may be too large or corrupted.',
            suggestion: 'Try with a smaller file or check if the CSV file is properly formatted.',
            field: 'timeout'
          }],
          warnings: []
        });
      }, 30000);

      const requiredColumns = [
        'date_dd', 'date_mon', 'date_yyyy',
        'caseid_type', 'caseid_no',
        'filed_dd', 'filed_mon', 'filed_yyyy',
        'court', 'case_type', 'judge_1',
        'comingfor', 'outcome',
        'male_applicant', 'female_applicant', 'organization_applicant',
        'male_defendant', 'female_defendant', 'organization_defendant',
        'legalrep', 'applicant_witness', 'defendant_witness', 'custody'
      ];

      stream = createReadStream(filePath)
        .pipe(csv.default({
          mapHeaders: ({ header }) => header.trim()
        }))
        .on('headers', (headers: string[]) => {
          // Trim all headers to remove trailing spaces
          const trimmedHeaders = headers.map(header => header.trim());
          console.log('🔍 DEBUG: Raw CSV headers:', headers);
          console.log('🔍 DEBUG: Trimmed CSV headers:', trimmedHeaders);
          columnCount = headers.length;

          // Check for required columns using trimmed headers
          const missingColumns = requiredColumns.filter(col =>
            !trimmedHeaders.some(header => header.toLowerCase() === col.toLowerCase())
          );

          console.log('🔍 DEBUG: Required columns:', requiredColumns);
          console.log('🔍 DEBUG: Missing columns:', missingColumns);

          if (missingColumns.length > 0) {
            errors.push({
              type: 'structure',
              severity: 'error',
              message: `Missing ${missingColumns.length} required column(s): ${missingColumns.join(', ')}`,
              suggestion: 'Ensure all required columns are present in the CSV file. Check the column headers match exactly.',
              field: 'headers'
            });
          }

          // Check for extra columns (warning)
          const extraColumns = headers.filter(header =>
            !requiredColumns.some(col => col.toLowerCase() === header.toLowerCase().trim())
          );

          if (extraColumns.length > 0) {
            warnings.push({
              type: 'structure',
              severity: 'warning',
              message: `Found ${extraColumns.length} extra column(s): ${extraColumns.join(', ')}`,
              suggestion: 'Extra columns will be ignored during import. Remove them if not needed.',
              field: 'headers'
            });
          }

          // Check for duplicate headers
          const duplicates = headers.filter((header, index) =>
            headers.indexOf(header) !== index
          );

          if (duplicates.length > 0) {
            errors.push({
              type: 'structure',
              severity: 'error',
              message: `Duplicate column headers found: ${[...new Set(duplicates)].join(', ')}`,
              suggestion: 'Remove duplicate column headers from the CSV file.',
              field: 'headers'
            });
          }
        })
        .on('data', (row: any) => {
          rowCount++;

          // Trim all string values to handle whitespace issues
          const trimmedRow: any = {};
          for (const [key, value] of Object.entries(row)) {
            if (typeof value === 'string') {
              trimmedRow[key] = value.trim();
            } else {
              trimmedRow[key] = value;
            }
          }

          // Debug logging for first few rows
          if (rowCount <= 3) {
            console.log(`🔍 DEBUG: Row ${rowCount} data:`, {
              caseid_type: trimmedRow.caseid_type,
              caseid_no: trimmedRow.caseid_no,
              court: trimmedRow.court,
              raw_caseid_type: `"${trimmedRow.caseid_type}"`,
              all_keys: Object.keys(trimmedRow)
            });
          }

          // Collect first 5 rows as samples
          if (sampleRows.length < 5) {
            sampleRows.push(trimmedRow);
          }

          // Stop after checking first 100 rows for performance
          if (rowCount >= 100 && stream) {
            stream.destroy();
          }
        })
        .on('end', () => {
          clearTimeout(timeout);

          if (rowCount === 0) {
            errors.push({
              type: 'structure',
              severity: 'error',
              message: 'CSV file appears to be empty or contains no data rows',
              suggestion: 'Ensure the CSV file contains data rows below the header row.',
              field: 'content'
            });
          } else if (rowCount < 5) {
            warnings.push({
              type: 'structure',
              severity: 'warning',
              message: `CSV file contains only ${rowCount} data rows`,
              suggestion: 'Verify this is the expected amount of data.',
              field: 'content'
            });
          }

          resolve({
            isValid: errors.length === 0,
            errors,
            warnings,
            columnCount,
            sampleRows,
          });
        })
        .on('error', (error: Error) => {
          clearTimeout(timeout);

          errors.push({
            type: 'structure',
            severity: 'error',
            message: `CSV parsing error: ${error.message}`,
            suggestion: getCsvParsingSuggestion(error.message),
            field: 'parsing'
          });
          resolve({
            isValid: false,
            errors,
            warnings,
          });
        });
    });
  } catch (error) {
    return {
      isValid: false,
      errors: [{
        type: 'structure',
        severity: 'error',
        message: `Failed to validate CSV structure: ${error instanceof Error ? error.message : 'Unknown error'}`,
        suggestion: 'Ensure the file is a valid CSV format and try again.',
        field: 'file'
      }],
      warnings: []
    };
  }
}

function getCsvParsingSuggestion(errorMessage: string): string {
  if (errorMessage.includes('delimiter')) {
    return 'Check that the CSV uses commas as delimiters and properly escapes special characters.';
  }
  if (errorMessage.includes('encoding')) {
    return 'Ensure the CSV file is saved with UTF-8 encoding.';
  }
  if (errorMessage.includes('quote')) {
    return 'Check that quoted fields are properly closed and escaped.';
  }
  if (errorMessage.includes('headers')) {
    return 'Verify the first row contains column headers.';
  }
  return 'Check the CSV file format and ensure it follows standard CSV conventions.';
}

export async function cleanupOldFiles(
  uploadDir: string = process.env.UPLOAD_DIR || './uploads',
  maxAgeHours: number = 24
): Promise<{ deletedFiles: number; errors: string[] }> {
  try {
    const files = await fs.readdir(uploadDir);
    const cutoffTime = Date.now() - (maxAgeHours * 60 * 60 * 1000);
    
    let deletedFiles = 0;
    const errors: string[] = [];
    
    for (const filename of files) {
      try {
        const filePath = join(uploadDir, filename);
        const stats = await fs.stat(filePath);
        
        if (stats.mtime.getTime() < cutoffTime) {
          await fs.unlink(filePath);
          deletedFiles++;
        }
      } catch (error) {
        errors.push(`Failed to delete ${filename}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return { deletedFiles, errors };
  } catch (error) {
    return {
      deletedFiles: 0,
      errors: [`Failed to cleanup files: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
}

export function generateSecureFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop() || 'csv';
  
  return `${timestamp}_${random}.${extension}`;
}

export async function getFileInfo(filePath: string): Promise<{
  exists: boolean;
  size?: number;
  created?: Date;
  modified?: Date;
}> {
  try {
    const stats = await fs.stat(filePath);
    return {
      exists: true,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
    };
  } catch (error) {
    return { exists: false };
  }
}