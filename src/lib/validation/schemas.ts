import { z } from 'zod';
import { logger } from '@/lib/logger';

// Helper function to safely convert string to number, handling empty strings
const safeNumber = (val: any) => {
  if (val === null || val === undefined) return undefined;
  
  // Clean string values that might have various types of whitespace
  let stringVal = String(val)
    .trim() // Remove leading/trailing whitespace
    .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
    .replace(/\s{2,}/g, ' ') // Replace multiple consecutive spaces with single space
    .trim(); // Trim again
    
  if (stringVal === '' || stringVal === '0' || stringVal === 'null' || stringVal === 'NULL' || stringVal === 'undefined' || stringVal === 'N/A' || stringVal === 'n/a') {
    return undefined;
  }
  
  const num = Number(stringVal);
  return isNaN(num) ? undefined : num;
};

// Helper function to safely handle string values
const safeString = (val: any) => {
  if (val === null || val === undefined) return undefined;
  
  // Clean string values but preserve content
  let str = String(val)
    .trim() // Remove leading/trailing whitespace
    .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
    .replace(/\s{2,}/g, ' ') // Replace multiple consecutive spaces with single space
    .trim(); // Trim again
    
  if (str === '' || str === 'null' || str === 'NULL' || str === 'undefined' || str === 'N/A' || str === 'n/a') {
    return undefined;
  }
  
  return str;
};
// Constants for validation
const VALID_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1960;
const MAX_YEAR = CURRENT_YEAR + 1;

// Common validators
const monthRefine = (val: string) => (VALID_MONTHS as readonly string[]).includes(val);

// CSV row validation schema for daily case returns
export const CaseReturnRowSchema = z.object({
  // Date fields - activity date (required for processing)
  date_dd: z.preprocess(safeNumber, z.number().min(1).max(31)),
  date_mon: z.preprocess(safeString, z.string().length(3).refine(monthRefine, { message: "Month must be a valid 3-letter abbreviation (Jan, Feb, etc.)" })),
  date_yyyy: z.preprocess(safeNumber, z.number().min(2015).max(CURRENT_YEAR)),

  // Case identification (required)
  caseid_type: z.preprocess(safeString, z.string().min(1).max(20)),
  caseid_no: z.preprocess(safeString, z.string().min(1).max(50)),

  // Filing information (required)
  filed_dd: z.preprocess(safeNumber, z.number().min(1).max(31)),
  filed_mon: z.preprocess(safeString, z.string().length(3).refine(monthRefine, { message: "Month must be a valid 3-letter abbreviation (Jan, Feb, etc.)" })),
  filed_yyyy: z.preprocess(safeNumber, z.number().min(1960).max(CURRENT_YEAR)),

  // Court information (required)
  court: z.preprocess(safeString, z.string().min(1).max(255)),

  // Original case (for appeals) - make these optional as they may be empty
  original_court: z.preprocess(safeString, z.string().optional()),
  original_code: z.preprocess(safeString, z.string().optional()),
  original_number: z.preprocess(safeString, z.string().optional()),
  original_year: z.preprocess(safeNumber, z.number().min(0).max(CURRENT_YEAR).optional().nullable()),

  // Case details (required)
  case_type: z.preprocess(safeString, z.string().min(1).max(100)),
  judge_1: z.preprocess(safeString, z.string().min(1).max(500)),
  judge_2: z.preprocess(safeString, z.string().optional()),
  judge_3: z.preprocess(safeString, z.string().optional()),
  judge_4: z.preprocess(safeString, z.string().optional()),
  judge_5: z.preprocess(safeString, z.string().optional()),
  judge_6: z.preprocess(safeString, z.string().optional()),
  judge_7: z.preprocess(safeString, z.string().optional()),

  // Activity information (optional - may be empty in some cases)
  comingfor: z.preprocess(safeString, z.string().min(1).max(100).optional()),
  outcome: z.preprocess(safeString, z.string().min(1).max(100).optional()),
  reason_adj: z.preprocess(safeString, z.string().optional()),

  // Next hearing date (optional) - handle various formats
  next_dd: z.preprocess(safeNumber, z.number().min(1).max(31).optional()),
  next_mon: z.preprocess(safeString, z.string().length(3).refine(monthRefine, { message: "Month must be a valid 3-letter abbreviation" }).optional()),
  next_yyyy: z.preprocess(safeNumber, z.number().min(2015).max(CURRENT_YEAR).optional()),

  // Party counts - individual fields for better data integrity
  male_applicant: z.preprocess(safeNumber, z.number().min(0).max(999).optional().default(0)),
  female_applicant: z.preprocess(safeNumber, z.number().min(0).max(999).optional().default(0)),
  organization_applicant: z.preprocess(safeNumber, z.number().min(0).max(999).optional().default(0)),
  male_defendant: z.preprocess(safeNumber, z.number().min(0).max(999).optional().default(0)),
  female_defendant: z.preprocess(safeNumber, z.number().min(0).max(999).optional().default(0)),
  organization_defendant: z.preprocess(safeNumber, z.number().min(0).max(999).optional().default(0)),

  // Procedural details
  legalrep: z.preprocess(safeString, z.enum(['Yes', 'No']).optional().nullable()),
  applicant_witness: z.preprocess(safeNumber, z.number().min(0).max(999).optional().default(0)),
  defendant_witness: z.preprocess(safeNumber, z.number().min(0).max(999).optional().default(0)),
  custody: z.preprocess(safeNumber, z.number().min(0).max(999).optional().default(0)),
  other_details: z.preprocess(safeString, z.string().optional()),
});

export type CaseReturnRow = z.infer<typeof CaseReturnRowSchema>;

// Database entity validation schemas
export const CreateCaseSchema = z.object({
  caseNumber: z.string().min(1).max(50),
  courtName: z.string().min(1).max(255), // Required field
  caseTypeId: z.string().uuid(),
  filedDate: z.date(),
  originalCourtId: z.string().uuid().optional(),
  originalCaseNumber: z.string().max(50).optional(),
  originalYear: z.number().int().min(1960).max(new Date().getFullYear()).optional(),
  // Individual party count fields (matching database schema)
  maleApplicant: z.number().int().min(0).max(999).default(0),
  femaleApplicant: z.number().int().min(0).max(999).default(0),
  organizationApplicant: z.number().int().min(0).max(999).default(0),
  maleDefendant: z.number().int().min(0).max(999).default(0),
  femaleDefendant: z.number().int().min(0).max(999).default(0),
  organizationDefendant: z.number().int().min(0).max(999).default(0),
  // CSV-specific fields
  caseidType: z.string().max(20).optional(),
  caseidNo: z.string().max(50).optional(),
  status: z.enum(['ACTIVE', 'RESOLVED', 'PENDING', 'TRANSFERRED', 'DELETED']).default('ACTIVE'),
  hasLegalRepresentation: z.boolean().default(false),
});

export const CreateCaseActivitySchema = z.object({
  caseId: z.string().uuid(),
  activityDate: z.date(),
  activityType: z.string().min(1).max(100),
  outcome: z.string().min(1).max(100),
  reasonForAdjournment: z.string().optional(),
  nextHearingDate: z.date().optional(),
  primaryJudgeId: z.string().uuid(),
  hasLegalRepresentation: z.boolean(),
  applicantWitnesses: z.number().int().min(0).max(999).default(0),
  defendantWitnesses: z.number().int().min(0).max(999).default(0),
  custodyStatus: z.enum(['IN_CUSTODY', 'ON_BAIL', 'NOT_APPLICABLE']),
  details: z.string().optional(),
  importBatchId: z.string().uuid(),
  // Enhanced judge assignments (CSV supports up to 7 judges)
  judge1: z.string().max(255).optional(),
  judge2: z.string().max(255).optional(),
  judge3: z.string().max(255).optional(),
  judge4: z.string().max(255).optional(),
  judge5: z.string().max(255).optional(),
  judge6: z.string().max(255).optional(),
  judge7: z.string().max(255).optional(),
  // Enhanced activity details from CSV
  comingFor: z.string().max(100).optional(),
  // Enhanced legal representation (store original CSV string)
  legalRepString: z.string().max(10).optional(),
  // Enhanced custody status (store original CSV numeric value)
  custodyNumeric: z.number().int().min(0).max(999).optional(),
  // Additional details from CSV
  otherDetails: z.string().optional(),
});

export const CreateCourtSchema = z.object({
  courtName: z.string().min(1).max(255),
  courtCode: z.string().min(1).max(50),
  courtType: z.enum(['SC', 'ELC', 'ELRC', 'KC', 'SCC', 'COA', 'MC', 'HC', 'TC']),
  isActive: z.boolean().default(true),
});

export const CreateJudgeSchema = z.object({
  fullName: z.string().min(1).max(255),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  isActive: z.boolean().default(true),
});

export const CreateCaseTypeSchema = z.object({
  caseTypeName: z.string().min(1).max(100),
  caseTypeCode: z.string().min(1).max(20),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(255),
  role: z.enum(['ADMIN', 'DATA_ENTRY', 'VIEWER']).default('DATA_ENTRY'),
  isActive: z.boolean().default(true),
});

export const CreateImportBatchSchema = z.object({
  importDate: z.date(),
  filename: z.string().min(1).max(255),
  fileSize: z.number().int().min(0),
  fileChecksum: z.string().min(1).max(64),
  createdBy: z.string().uuid(),
});

// Update schemas
export const UpdateCaseSchema = CreateCaseSchema.partial().extend({
  id: z.string().uuid(),
});

export const UpdateCaseStatusSchema = z.object({
  caseId: z.string().uuid(),
  status: z.enum(['ACTIVE', 'RESOLVED', 'PENDING', 'TRANSFERRED', 'DELETED']),
  reason: z.string().optional(),
});

export const BulkUpdateCasesSchema = z.object({
  caseIds: z.array(z.string().uuid()).min(1),
  updates: z.object({
    status: z.enum(['ACTIVE', 'RESOLVED', 'PENDING', 'TRANSFERRED', 'DELETED']).optional(),
    hasLegalRepresentation: z.boolean().optional(),
  }),
  userId: z.string().uuid(),
});

// Filter schemas for queries
export const AnalyticsFiltersSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  caseTypeId: z.string().uuid().optional(),
  courtId: z.string().uuid().optional(),
  courtName: z.string().optional(),
  status: z.enum(['ACTIVE', 'RESOLVED', 'PENDING', 'TRANSFERRED', 'DELETED']).optional(),
  judgeId: z.string().uuid().optional(),
});

export const PaginationSchema = z.object({
  pageSize: z.number().int().min(1).max(100).default(50),
  cursor: z.string().optional(),
  sortBy: z.enum(['filedDate', 'caseNumber', 'lastActivityDate']).default('filedDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const CaseSearchSchema = z.object({
  query: z.string().min(1).max(255),
  filters: AnalyticsFiltersSchema.optional(),
  pagination: PaginationSchema.optional(),
});

// File upload validation
export const FileUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  size: z.number().int().min(1).max(10485760), // 10MB max
  type: z.string().refine(
    (type) => {
      // Accept common CSV MIME types and text-based formats
      const acceptedTypes = [
        'text/csv',
        'application/csv',
        'text/plain',
        'text/comma-separated-values',
        'application/vnd.ms-excel', // Excel CSV files
        'text/x-csv',
        'application/x-csv',
        'text/csv-schema'
      ];
      return acceptedTypes.includes(type.toLowerCase());
    },
    {
      message: 'File must be CSV format. Supported types: text/csv, application/csv, text/plain, and other CSV variants'
    }
  ),
});


// Enhanced helper function to validate and transform dates
export function createDateFromParts(day: number | string, month: string | number, year: number | string): Date {
  logger.import.debug('Creating date from parts', {
    day: { value: day, type: typeof day },
    month: { value: month, type: typeof month },
    year: { value: year, type: typeof year }
  });

  // Check for null/undefined values first
  if (day === null || day === undefined || month === null || month === undefined || year === null || year === undefined) {
    logger.import.error('Missing date components', { day, month, year });
    throw new Error(`Missing date components: day=${day}, month=${month}, year=${year}. All components are required.`);
  }

  // Convert inputs to proper types and validate
  const dayNum = typeof day === 'string' ? parseInt(String(day).trim(), 10) : Number(day);
  const yearNum = typeof year === 'string' ? parseInt(String(year).trim(), 10) : Number(year);

  logger.import.debug('Converting date parts to numbers', {
    dayNum: { value: dayNum, isNaN: isNaN(dayNum) },
    yearNum: { value: yearNum, isNaN: isNaN(yearNum) }
  });

  // Validate parsed numbers
  if (isNaN(dayNum) || isNaN(yearNum)) {
    logger.import.error('Invalid numeric conversion for date', { day, dayNum, year, yearNum });
    throw new Error(`Invalid date values: day=${day}, month=${month}, year=${year}. Day and year must be valid numbers.`);
  }

  // Handle both string month names and numeric months
  let monthIndex: number;

  if (typeof month === 'string') {
    const monthStr = String(month).trim();
    const monthMap: Record<string, number> = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };

    monthIndex = monthMap[monthStr];
    if (monthIndex === undefined) {
      throw new Error(`Invalid month name: "${monthStr}". Expected format: Jan, Feb, Mar, etc.`);
    }
  } else {
    const monthNum = Number(month);
    if (isNaN(monthNum)) {
      throw new Error(`Invalid month value: ${month}. Must be a valid number or month name.`);
    }
    // Handle numeric months (0-11)
    if (monthNum < 0 || monthNum > 11) {
      throw new Error(`Invalid month number: ${monthNum}. Expected range: 0-11`);
    }
    monthIndex = monthNum;
  }

  // Validate year range
  if (yearNum < MIN_YEAR || yearNum > MAX_YEAR) {
    throw new Error(`Invalid year: ${yearNum}. Expected range: ${MIN_YEAR}-${MAX_YEAR}`);
  }

  // Validate day range
  if (dayNum < 1 || dayNum > 31) {
    throw new Error(`Invalid day: ${dayNum}. Expected range: 1-31`);
  }

  const date = new Date(yearNum, monthIndex, dayNum);

  logger.import.debug('Created date object', {
    input: { dayNum, monthIndex, yearNum },
    created: date,
    validation: {
      getDate: date.getDate(),
      getMonth: date.getMonth(),
      getFullYear: date.getFullYear(),
      isValid: date.getDate() === dayNum && date.getMonth() === monthIndex && date.getFullYear() === yearNum
    }
  });

  // Validate the date is real (handles cases like Feb 30, Apr 31, etc.)
  if (date.getDate() !== dayNum || date.getMonth() !== monthIndex || date.getFullYear() !== yearNum) {
    logger.import.error('Invalid date combination', {
      input: { dayNum, monthIndex, yearNum },
      created: { day: date.getDate(), month: date.getMonth(), year: date.getFullYear() }
    });
    throw new Error(`Invalid date combination: ${dayNum}/${typeof month === 'string' ? month : monthIndex + 1}/${yearNum} (this date does not exist)`);
  }

  logger.import.debug('Valid date created', { date });
  return date;
}

// Helper function to validate next hearing date (handles optional/empty values)
export function createOptionalDateFromParts(
  day?: number | string,
  month?: string | number,
  year?: number | string
): Date | undefined {
  // If any component is missing or empty, return undefined
  if (!day || !month || !year) return undefined;
  if (typeof day === 'string' && day.trim() === '') return undefined;
  if (typeof month === 'string' && month.trim() === '') return undefined;
  if (typeof year === 'string' && String(year).trim() === '') return undefined;

  try {
    return createDateFromParts(
      typeof day === 'string' ? parseInt(day) : day,
      month,
      typeof year === 'string' ? parseInt(year) : year
    );
  } catch (error) {
    // For optional dates, we can be more lenient and return undefined on validation errors
    logger.import.warn(`Invalid optional date components: ${day}/${month}/${year}`, { error: error instanceof Error ? error.message : 'Unknown error' });
    return undefined;
  }
}

// Validation helper functions for extracted master data
export function validateExtractedCourt(courtName: string): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!courtName || courtName.trim().length === 0) {
    issues.push('Court name is empty');
  }

  if (courtName.length > 255) {
    issues.push('Court name exceeds maximum length');
  }

  // More permissive validation to allow common court name characters including Unicode letters
  // Allow letters, numbers, spaces, hyphens, periods, commas, parentheses, ampersands, and apostrophes
  if (!/^[\p{L}0-9\s\-.,()'&]+$/u.test(courtName)) {
    issues.push('Court name contains invalid characters');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
}

export function validateExtractedJudge(judgeName: string): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!judgeName || judgeName.trim().length === 0) {
    issues.push('Judge name is empty');
  }

  if (judgeName.length > 255) {
    issues.push('Judge name exceeds maximum length');
  }

  // More permissive validation to allow common judge name characters including Unicode letters
  // Allow letters, spaces, commas, periods, hyphens, apostrophes
  if (!/^[A-Za-z\s,.'-]+$/.test(judgeName)) {
    issues.push('Judge name contains invalid characters');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
}

export function validateExtractedCaseType(caseTypeName: string): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!caseTypeName || caseTypeName.trim().length === 0) {
    issues.push('Case type name is empty');
  }

  if (caseTypeName.length > 100) {
    issues.push('Case type name exceeds maximum length');
  }

  // More permissive validation to allow common case type characters including Unicode letters
  // Allow letters, numbers, spaces, hyphens, periods, commas, parentheses, ampersands, apostrophes, and slashes
  if (!/^[\p{L}0-9\s\-.,()'&/]+$/u.test(caseTypeName)) {
    issues.push('Case type name contains invalid characters');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
}

// Additional validation schemas for import-related operations
export const CreateImportProgressSchema = z.object({
  batchId: z.string().uuid(),
  progressPercentage: z.number().int().min(0).max(100).optional(),
  currentStep: z.string().max(100).optional(),
  message: z.string().optional(),
  recordsProcessed: z.number().int().min(0).default(0),
  totalRecords: z.number().int().min(0).default(0),
  errorsCount: z.number().int().min(0).default(0),
  warningsCount: z.number().int().min(0).default(0),
});

export const CreateImportErrorDetailSchema = z.object({
  batchId: z.string().uuid(),
  rowNumber: z.number().int().optional(),
  columnName: z.string().max(100).optional(),
  errorType: z.string().min(1).max(50),
  errorMessage: z.string().min(1),
  rawValue: z.string().optional(),
  suggestedFix: z.string().optional(),
  severity: z.enum(['ERROR', 'WARNING', 'INFO']).default('ERROR'),
});

// Enhanced validation for CSV data processing
export function validateCsvRowData(row: any): {
  isValid: boolean;
  errors: Array<{ field: string; message: string; value?: any }>;
  warnings: Array<{ field: string; message: string; value?: any }>;
} {
  const errors: Array<{ field: string; message: string; value?: any }> = [];
  const warnings: Array<{ field: string; message: string; value?: any }> = [];

  // Validate required fields
  const requiredFields = ['caseid_type', 'caseid_no', 'court', 'case_type', 'judge_1', 'outcome'];
  for (const field of requiredFields) {
    if (!row[field] || row[field].toString().trim() === '') {
      errors.push({
        field,
        message: `${field} is required`,
        value: row[field]
      });
    }
  }

  // Validate date fields
  const dateFields = ['date_dd', 'filed_dd'];
  for (const field of dateFields) {
    const value = row[field];
    if (value && (isNaN(Number(value)) || Number(value) < 1 || Number(value) > 31)) {
      errors.push({
        field,
        message: `${field} must be a valid day (1-31)`,
        value
      });
    }
  }

  // Validate month fields
  const monthFields = ['date_mon', 'filed_mon'];
  for (const field of monthFields) {
    const value = row[field];
    if (value && !(VALID_MONTHS as readonly string[]).includes(value)) {
      errors.push({
        field,
        message: `${field} must be a valid month abbreviation (Jan, Feb, etc.)`,
        value
      });
    }
  }

  // Validate year fields
  const yearFields = ['date_yyyy', 'filed_yyyy'];
  for (const field of yearFields) {
    const value = row[field];
    if (value && (isNaN(Number(value)) || Number(value) < MIN_YEAR || Number(value) > MAX_YEAR)) {
      errors.push({
        field,
        message: `${field} must be a valid year (${MIN_YEAR}-${MAX_YEAR})`,
        value
      });
    }
  }

  // Validate party count fields
  const partyFields = ['male_applicant', 'female_applicant', 'organization_applicant',
    'male_defendant', 'female_defendant', 'organization_defendant'];
  for (const field of partyFields) {
    const value = row[field];
    if (value && (isNaN(Number(value)) || Number(value) < 0 || Number(value) > 999)) {
      errors.push({
        field,
        message: `${field} must be a number between 0 and 999`,
        value
      });
    }
  }

  // Validate legal representation
  if (row.legalrep && !['Yes', 'No'].includes(row.legalrep)) {
    errors.push({
      field: 'legalrep',
      message: 'legalrep must be either "Yes" or "No"',
      value: row.legalrep
    });
  }

  // Generate warnings for potential issues
  if (row.judge_2 && !row.judge_1) {
    warnings.push({
      field: 'judge_2',
      message: 'Secondary judge specified but no primary judge',
      value: row.judge_2
    });
  }

  if (row.next_dd && (!row.next_mon || !row.next_yyyy)) {
    warnings.push({
      field: 'next_dd',
      message: 'Next hearing day specified but missing month or year',
      value: row.next_dd
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Validation for bulk import operations
export const BulkImportValidationSchema = z.object({
  file: z.instanceof(File),
  options: z.object({
    validateOnly: z.boolean().default(false),
    skipErrors: z.boolean().default(false),
    batchSize: z.number().int().min(1).max(1000).default(100),
    maxErrors: z.number().int().min(0).max(1000).default(50),
  }).optional(),
});

// Enhanced court type validation with better error messages
export function validateCourtType(courtType: string): {
  isValid: boolean;
  normalizedType?: string;
  issues: string[];
} {
  const issues: string[] = [];
  const validTypes = ['SC', 'ELC', 'ELRC', 'KC', 'SCC', 'COA', 'MC', 'HC', 'TC'];

  if (!courtType || courtType.trim().length === 0) {
    issues.push('Court type is required');
    return { isValid: false, issues };
  }

  const normalized = courtType.trim().toUpperCase();

  if (!validTypes.includes(normalized)) {
    issues.push(`Invalid court type: ${courtType}. Valid types: ${validTypes.join(', ')}`);
    return { isValid: false, issues };
  }

  return {
    isValid: true,
    normalizedType: normalized,
    issues: []
  };
}

// Enhanced case status validation
export function validateCaseStatus(status: string): {
  isValid: boolean;
  normalizedStatus?: string;
  issues: string[];
} {
  const issues: string[] = [];
  const validStatuses = ['ACTIVE', 'RESOLVED', 'PENDING', 'TRANSFERRED', 'DELETED'];

  if (!status || status.trim().length === 0) {
    return { isValid: true, normalizedStatus: 'ACTIVE', issues: [] }; // Default to ACTIVE
  }

  const normalized = status.trim().toUpperCase();

  if (!validStatuses.includes(normalized)) {
    issues.push(`Invalid case status: ${status}. Valid statuses: ${validStatuses.join(', ')}`);
    return { isValid: false, issues };
  }

  return {
    isValid: true,
    normalizedStatus: normalized,
    issues: []
  };
}