import { describe, it, expect } from 'vitest';
import {
  CaseReturnRowSchema,
  CreateCaseSchema,
  CreateCaseActivitySchema,
  CreateCourtSchema,
  CreateJudgeSchema,
  CreateCaseTypeSchema,
  CreateUserSchema,
  UpdateCaseStatusSchema,
  BulkUpdateCasesSchema,
  AnalyticsFiltersSchema,
  PaginationSchema,
  FileUploadSchema,
  createDateFromParts,
  validateExtractedCourt,
  validateExtractedJudge,
  validateExtractedCaseType,
} from '@/lib/validation/schemas';
import { generateMockCsvRow } from '../setup';

describe('Validation Schemas Tests', () => {
  describe('CaseReturnRowSchema', () => {
    it('should validate a complete CSV row', () => {
      const mockRow = generateMockCsvRow();
      
      const result = CaseReturnRowSchema.safeParse(mockRow);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.caseid_type).toBe('HCCC');
        expect(result.data.legalrep).toBe('Yes');
        expect(result.data.male_applicant).toBe(1);
      }
    });

    it('should fail validation for missing required fields', () => {
      const incompleteRow = {
        date_dd: 1,
        date_mon: 'Jan',
        // Missing date_yyyy and other required fields
      };
      
      const result = CaseReturnRowSchema.safeParse(incompleteRow);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors.length).toBeGreaterThan(0);
      }
    });

    it('should fail validation for invalid date values', () => {
      const mockRow = generateMockCsvRow();
      mockRow.date_dd = 32; // Invalid day
      mockRow.date_mon = 'XYZ'; // Invalid month
      
      const result = CaseReturnRowSchema.safeParse(mockRow);
      
      expect(result.success).toBe(false);
    });

    it('should fail validation for invalid year range', () => {
      const mockRow = generateMockCsvRow();
      mockRow.date_yyyy = 2010; // Year before 2015 minimum

      const result = CaseReturnRowSchema.safeParse(mockRow);

      expect(result.success).toBe(false);
    });

    it('should validate optional fields correctly', () => {
      const mockRow = generateMockCsvRow();
      mockRow.original_court = 'Original Court Name';
      mockRow.reason_adj = 'Test adjournment reason';
      mockRow.other_details = 'Additional details';
      
      const result = CaseReturnRowSchema.safeParse(mockRow);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.original_court).toBe('Original Court Name');
        expect(result.data.reason_adj).toBe('Test adjournment reason');
      }
    });

    it('should coerce string numbers to numbers', () => {
      const mockRow = generateMockCsvRow();
      // Simulate CSV data where numbers come as strings
      (mockRow as any).male_applicant = '2';
      (mockRow as any).custody = '1';
      
      const result = CaseReturnRowSchema.safeParse(mockRow);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.male_applicant).toBe(2);
        expect(result.data.custody).toBe(1);
        expect(typeof result.data.male_applicant).toBe('number');
      }
    });
  });

  describe('CreateCaseSchema', () => {
    it('should validate valid case data', () => {
      const validCaseData = {
        caseNumber: 'TEST-001',
        caseTypeId: '123e4567-e89b-12d3-a456-426614174000',
        filedDate: new Date(),
        parties: {
          applicants: { maleCount: 1, femaleCount: 1, organizationCount: 0 },
          defendants: { maleCount: 0, femaleCount: 1, organizationCount: 1 },
        },
        status: 'ACTIVE',
        hasLegalRepresentation: true,
      };
      
      const result = CreateCaseSchema.safeParse(validCaseData);
      
      expect(result.success).toBe(true);
    });

    it('should fail validation for invalid UUID', () => {
      const invalidCaseData = {
        caseNumber: 'TEST-001',
        caseTypeId: 'invalid-uuid',
        filedDate: new Date(),
        parties: {
          applicants: { maleCount: 1, femaleCount: 0, organizationCount: 0 },
          defendants: { maleCount: 0, femaleCount: 1, organizationCount: 0 },
        },
      };
      
      const result = CreateCaseSchema.safeParse(invalidCaseData);
      
      expect(result.success).toBe(false);
    });

    it('should validate parties object structure', () => {
      const caseDataWithInvalidParties = {
        caseNumber: 'TEST-001',
        caseTypeId: '123e4567-e89b-12d3-a456-426614174000',
        filedDate: new Date(),
        parties: {
          applicants: { maleCount: -1 }, // Missing required fields and negative number
        },
      };
      
      const result = CreateCaseSchema.safeParse(caseDataWithInvalidParties);
      
      expect(result.success).toBe(false);
    });
  });

  describe('CreateCaseActivitySchema', () => {
    it('should validate valid case activity data', () => {
      const validActivityData = {
        caseId: '123e4567-e89b-12d3-a456-426614174000',
        activityDate: new Date(),
        activityType: 'Hearing',
        outcome: 'Adjourned',
        primaryJudgeId: '123e4567-e89b-12d3-a456-426614174001',
        hasLegalRepresentation: true,
        custodyStatus: 'ON_BAIL',
        importBatchId: '123e4567-e89b-12d3-a456-426614174002',
      };
      
      const result = CreateCaseActivitySchema.safeParse(validActivityData);
      
      expect(result.success).toBe(true);
    });

    it('should validate custody status enum', () => {
      const activityDataWithInvalidCustody = {
        caseId: '123e4567-e89b-12d3-a456-426614174000',
        activityDate: new Date(),
        activityType: 'Hearing',
        outcome: 'Adjourned',
        primaryJudgeId: '123e4567-e89b-12d3-a456-426614174001',
        hasLegalRepresentation: true,
        custodyStatus: 'INVALID_STATUS',
        importBatchId: '123e4567-e89b-12d3-a456-426614174002',
      };
      
      const result = CreateCaseActivitySchema.safeParse(activityDataWithInvalidCustody);
      
      expect(result.success).toBe(false);
    });
  });

  describe('CreateCourtSchema', () => {
    it('should validate valid court data', () => {
      const validCourtData = {
        courtName: 'Test High Court',
        courtCode: 'THC',
        courtType: 'HC',
        isActive: true,
      };
      
      const result = CreateCourtSchema.safeParse(validCourtData);
      
      expect(result.success).toBe(true);
    });

    it('should validate court type enum', () => {
      const invalidCourtData = {
        courtName: 'Test Court',
        courtCode: 'TC',
        courtType: 'INVALID_TYPE',
      };
      
      const result = CreateCourtSchema.safeParse(invalidCourtData);
      
      expect(result.success).toBe(false);
    });
  });

  describe('CreateJudgeSchema', () => {
    it('should validate valid judge data', () => {
      const validJudgeData = {
        fullName: 'Hon. John Smith',
        firstName: 'John',
        lastName: 'Smith',
        isActive: true,
      };
      
      const result = CreateJudgeSchema.safeParse(validJudgeData);
      
      expect(result.success).toBe(true);
    });

    it('should fail validation for empty names', () => {
      const invalidJudgeData = {
        fullName: '',
        firstName: '',
        lastName: '',
      };
      
      const result = CreateJudgeSchema.safeParse(invalidJudgeData);
      
      expect(result.success).toBe(false);
    });
  });

  describe('CreateUserSchema', () => {
    it('should validate valid user data', () => {
      const validUserData = {
        email: 'test@example.com',
        name: 'Test User',
        role: 'DATA_ENTRY',
        isActive: true,
      };
      
      const result = CreateUserSchema.safeParse(validUserData);
      
      expect(result.success).toBe(true);
    });

    it('should fail validation for invalid email', () => {
      const invalidUserData = {
        email: 'invalid-email',
        name: 'Test User',
      };
      
      const result = CreateUserSchema.safeParse(invalidUserData);
      
      expect(result.success).toBe(false);
    });

    it('should validate user role enum', () => {
      const userDataWithInvalidRole = {
        email: 'test@example.com',
        name: 'Test User',
        role: 'INVALID_ROLE',
      };
      
      const result = CreateUserSchema.safeParse(userDataWithInvalidRole);
      
      expect(result.success).toBe(false);
    });
  });

  describe('UpdateCaseStatusSchema', () => {
    it('should validate valid status update data', () => {
      const validStatusData = {
        caseId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'RESOLVED',
        reason: 'Case settled',
      };
      
      const result = UpdateCaseStatusSchema.safeParse(validStatusData);
      
      expect(result.success).toBe(true);
    });

    it('should validate case status enum', () => {
      const invalidStatusData = {
        caseId: '123e4567-e89b-12d3-a456-426614174000',
        status: 'INVALID_STATUS',
      };
      
      const result = UpdateCaseStatusSchema.safeParse(invalidStatusData);
      
      expect(result.success).toBe(false);
    });
  });

  describe('BulkUpdateCasesSchema', () => {
    it('should validate valid bulk update data', () => {
      const validBulkData = {
        caseIds: [
          '123e4567-e89b-12d3-a456-426614174000',
          '123e4567-e89b-12d3-a456-426614174001',
        ],
        updates: {
          status: 'TRANSFERRED',
          hasLegalRepresentation: true,
        },
        userId: '123e4567-e89b-12d3-a456-426614174002',
      };
      
      const result = BulkUpdateCasesSchema.safeParse(validBulkData);
      
      expect(result.success).toBe(true);
    });

    it('should fail validation for empty case IDs array', () => {
      const invalidBulkData = {
        caseIds: [],
        updates: { status: 'RESOLVED' },
        userId: '123e4567-e89b-12d3-a456-426614174000',
      };
      
      const result = BulkUpdateCasesSchema.safeParse(invalidBulkData);
      
      expect(result.success).toBe(false);
    });
  });

  describe('FileUploadSchema', () => {
    it('should validate valid file data', () => {
      const validFileData = {
        filename: 'test.csv',
        size: 1024,
        type: 'text/csv',
      };
      
      const result = FileUploadSchema.safeParse(validFileData);
      
      expect(result.success).toBe(true);
    });

    it('should fail validation for non-CSV files', () => {
      const invalidFileData = {
        filename: 'test.txt',
        size: 1024,
        type: 'text/plain',
      };
      
      const result = FileUploadSchema.safeParse(invalidFileData);
      
      expect(result.success).toBe(false);
    });

    it('should fail validation for oversized files', () => {
      const oversizedFileData = {
        filename: 'large.csv',
        size: 20 * 1024 * 1024, // 20MB, exceeds 10MB limit
        type: 'text/csv',
      };
      
      const result = FileUploadSchema.safeParse(oversizedFileData);
      
      expect(result.success).toBe(false);
    });
  });

  describe('Date Helper Functions', () => {
    describe('createDateFromParts', () => {
      it('should create valid dates from parts', () => {
        const date = createDateFromParts(15, 'Mar', 2024);
        
        expect(date).toBeInstanceOf(Date);
        expect(date.getFullYear()).toBe(2024);
        expect(date.getMonth()).toBe(2); // March is month 2 (0-based)
        expect(date.getDate()).toBe(15);
      });

      it('should throw error for invalid month', () => {
        expect(() => {
          createDateFromParts(15, 'InvalidMonth', 2024);
        }).toThrow('Invalid month');
      });

      it('should throw error for invalid date', () => {
        expect(() => {
          createDateFromParts(31, 'Feb', 2024); // Feb 31 doesn't exist
        }).toThrow('Invalid date');
      });

      it('should handle leap years correctly', () => {
        // 2024 is a leap year
        const leapDate = createDateFromParts(29, 'Feb', 2024);
        expect(leapDate.getDate()).toBe(29);
        
        // 2023 is not a leap year
        expect(() => {
          createDateFromParts(29, 'Feb', 2023);
        }).toThrow('Invalid date');
      });
    });
  });

  describe('Data Validation Functions', () => {
    describe('validateExtractedCourt', () => {
      it('should validate valid court names', () => {
        const result = validateExtractedCourt('High Court of Kenya');
        
        expect(result.isValid).toBe(true);
        expect(result.issues).toHaveLength(0);
      });

      it('should fail validation for empty court name', () => {
        const result = validateExtractedCourt('');
        
        expect(result.isValid).toBe(false);
        expect(result.issues).toContain('Court name is empty');
      });

      it('should fail validation for overly long court name', () => {
        const longName = 'A'.repeat(300);
        const result = validateExtractedCourt(longName);
        
        expect(result.isValid).toBe(false);
        expect(result.issues).toContain('Court name exceeds maximum length');
      });

      it('should fail validation for invalid characters', () => {
        const result = validateExtractedCourt('Court@#$%');
        
        expect(result.isValid).toBe(false);
        expect(result.issues).toContain('Court name contains invalid characters');
      });
    });

    describe('validateExtractedJudge', () => {
      it('should validate valid judge names', () => {
        const result = validateExtractedJudge('Hon. John Smith');
        
        expect(result.isValid).toBe(true);
        expect(result.issues).toHaveLength(0);
      });

      it('should fail validation for empty judge name', () => {
        const result = validateExtractedJudge('');
        
        expect(result.isValid).toBe(false);
        expect(result.issues).toContain('Judge name is empty');
      });

      it('should fail validation for invalid characters', () => {
        const result = validateExtractedJudge('Judge123');
        
        expect(result.isValid).toBe(false);
        expect(result.issues).toContain('Judge name contains invalid characters');
      });
    });

    describe('validateExtractedCaseType', () => {
      it('should validate valid case type names', () => {
        const result = validateExtractedCaseType('Civil Suit');
        
        expect(result.isValid).toBe(true);
        expect(result.issues).toHaveLength(0);
      });

      it('should fail validation for empty case type name', () => {
        const result = validateExtractedCaseType('');
        
        expect(result.isValid).toBe(false);
        expect(result.issues).toContain('Case type name is empty');
      });

      it('should fail validation for overly long case type name', () => {
        const longName = 'A'.repeat(150);
        const result = validateExtractedCaseType(longName);
        
        expect(result.isValid).toBe(false);
        expect(result.issues).toContain('Case type name exceeds maximum length');
      });
    });
  });
});