import { promises as fs } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';
import { FileUploadSchema } from '../validation/schemas';

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
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
  const errors: string[] = [];
  
  try {
    // Validate using Zod schema
    const validation = FileUploadSchema.safeParse({
      filename: file.name,
      size: file.size,
      type: file.type,
    });
    
    if (!validation.success) {
      errors.push(...validation.error.errors.map(err => err.message));
    }
    
    // Additional validations
    if (!file.name.toLowerCase().endsWith('.csv')) {
      errors.push('File must have .csv extension');
    }
    
    if (file.size === 0) {
      errors.push('File cannot be empty');
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      errors.push('File size cannot exceed 10MB');
    }
    
    if (errors.length > 0) {
      return { isValid: false, errors };
    }
    
    return {
      isValid: true,
      errors: [],
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
      errors: [`File validation error: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
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

export async function validateCsvStructure(filePath: string): Promise<{
  isValid: boolean;
  errors: string[];
  columnCount?: number;
  sampleRows?: any[];
}> {
  try {
    const csv = await import('csv-parser');
    const { createReadStream } = await import('fs');
    
    return new Promise((resolve) => {
      const errors: string[] = [];
      const sampleRows: any[] = [];
      let columnCount = 0;
      let rowCount = 0;
      
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
      
      createReadStream(filePath)
        .pipe(csv.default())
        .on('headers', (headers: string[]) => {
          columnCount = headers.length;
          
          // Check for required columns
          const missingColumns = requiredColumns.filter(col => 
            !headers.some(header => header.toLowerCase().trim() === col.toLowerCase())
          );
          
          if (missingColumns.length > 0) {
            errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
          }
        })
        .on('data', (row: any) => {
          rowCount++;
          
          // Collect first 5 rows as samples
          if (sampleRows.length < 5) {
            sampleRows.push(row);
          }
          
          // Stop after checking first 100 rows for performance
          if (rowCount >= 100) {
            this.destroy();
          }
        })
        .on('end', () => {
          if (rowCount === 0) {
            errors.push('CSV file appears to be empty');
          }
          
          resolve({
            isValid: errors.length === 0,
            errors,
            columnCount,
            sampleRows,
          });
        })
        .on('error', (error: Error) => {
          errors.push(`CSV parsing error: ${error.message}`);
          resolve({
            isValid: false,
            errors,
          });
        });
    });
  } catch (error) {
    return {
      isValid: false,
      errors: [`Failed to validate CSV structure: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
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