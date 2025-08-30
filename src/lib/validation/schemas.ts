import { z } from 'zod';

// CSV row validation schema for daily case returns
export const CaseReturnRowSchema = z.object({
   // Date fields
   date_dd: z.coerce.number().min(1).max(31),
   date_mon: z.string().length(3),
   date_yyyy: z.coerce.number().min(2015).max(new Date().getFullYear()),

   // Case identification
   caseid_type: z.string().min(1).max(20),
   caseid_no: z.string().min(1).max(50),

   // Filing information
   filed_dd: z.coerce.number().min(1).max(31),
   filed_mon: z.string().length(3),
   filed_yyyy: z.coerce.number().min(1960).max(new Date().getFullYear()),
  
  // Court information
  court: z.string().min(1).max(255), // Current court handling the case
  
  // Original case (for appeals)
  original_court: z.string().optional(),
  original_code: z.string().optional(),
  original_number: z.string().optional(),
  original_year: z.coerce.number().optional(),
  
  // Case details
  case_type: z.string().min(1).max(100),
  judge_1: z.string().min(1).max(255),
  judge_2: z.string().optional(),
  judge_3: z.string().optional(),
  judge_4: z.string().optional(),
  judge_5: z.string().optional(),
  judge_6: z.string().optional(),
  judge_7: z.string().optional(),
  
  // Activity information
  comingfor: z.string().min(1).max(100),
  outcome: z.string().min(1).max(100),
  reason_adj: z.string().optional(),
  
  // Next hearing date (optional)
  next_dd: z.coerce.number().min(1).max(31).optional(),
  next_mon: z.string().length(3).optional(),
  next_yyyy: z.coerce.number().min(2015).max(new Date().getFullYear()).optional(),

  // Party counts
  male_applicant: z.coerce.number().min(0).max(999),
  female_applicant: z.coerce.number().min(0).max(999),
  organization_applicant: z.coerce.number().min(0).max(999),
  male_defendant: z.coerce.number().min(0).max(999),
  female_defendant: z.coerce.number().min(0).max(999),
  organization_defendant: z.coerce.number().min(0).max(999),

  // Procedural details
  legalrep: z.enum(['Yes', 'No']),
  applicant_witness: z.coerce.number().min(0).max(999),
  defendant_witness: z.coerce.number().min(0).max(999),
  custody: z.coerce.number().min(0).max(999),
  other_details: z.string().optional(),
});

export type CaseReturnRow = z.infer<typeof CaseReturnRowSchema>;

// Database entity validation schemas
export const CreateCaseSchema = z.object({
  caseNumber: z.string().min(1).max(50),
  caseTypeId: z.string().uuid(),
  filedDate: z.date(),
  originalCourtId: z.string().uuid().optional(),
  originalCaseNumber: z.string().max(50).optional(),
  originalYear: z.number().int().min(1960).max(new Date().getFullYear()).optional(),
  parties: z.object({
    applicants: z.object({
      maleCount: z.number().int().min(0),
      femaleCount: z.number().int().min(0),
      organizationCount: z.number().int().min(0),
    }),
    defendants: z.object({
      maleCount: z.number().int().min(0),
      femaleCount: z.number().int().min(0),
      organizationCount: z.number().int().min(0),
    }),
  }),
  status: z.enum(['ACTIVE', 'RESOLVED', 'PENDING', 'TRANSFERRED']).default('ACTIVE'),
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
  applicantWitnesses: z.number().int().min(0).default(0),
  defendantWitnesses: z.number().int().min(0).default(0),
  custodyStatus: z.enum(['IN_CUSTODY', 'ON_BAIL', 'NOT_APPLICABLE']),
  details: z.string().optional(),
  importBatchId: z.string().uuid(),
});

export const CreateCourtSchema = z.object({
   courtName: z.string().min(1).max(255),
   courtCode: z.string().min(1).max(50),
   courtType: z.enum(['SC','ELC','ELRC', 'KC', 'SCC', 'COA','MC', 'HC', 'TC']),
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


// Helper function to validate and transform dates
export function createDateFromParts(day: number, month: string, year: number): Date {
  const monthMap: Record<string, number> = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  const monthIndex = monthMap[month];
  if (monthIndex === undefined) {
    throw new Error(`Invalid month: ${month}`);
  }
  
  const date = new Date(year, monthIndex, day);
  
  // Validate the date is real (handles cases like Feb 30)
  if (date.getDate() !== day || date.getMonth() !== monthIndex || date.getFullYear() !== year) {
    throw new Error(`Invalid date: ${day}/${month}/${year}`);
  }
  
  return date;
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
  
  if (!/^[a-zA-Z0-9\s\-.,()]+$/.test(courtName)) {
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
  
  // Check for basic name format
  if (!/^[a-zA-Z\s,.-]+$/.test(judgeName)) {
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
  
  return {
    isValid: issues.length === 0,
    issues
  };
}