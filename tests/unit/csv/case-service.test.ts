/**
 * Unit tests for Case Service module
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { caseService } from '../../../src/lib/csv/case-service';
import type { CaseReturnRow } from '../../../src/lib/validation/schemas';
import { logger } from '../../../src/lib/logger';

// Mock dependencies
vi.mock('../../../src/lib/logger', () => ({
  logger: {
    database: {
      info: vi.fn(),
    },
    error: vi.fn(),
    import: {
      info: vi.fn(),
    },
  },
}));

vi.mock('../../../src/lib/data/extraction', () => ({
  extractAndNormalizeCourt: vi.fn(),
  extractAndNormalizeJudge: vi.fn(),
  extractAndNormalizeCaseType: vi.fn(),
  extractJudgesFromRow: vi.fn(),
  createCaseNumber: vi.fn(),
  determineCustodyStatus: vi.fn(),
  MasterDataTracker: vi.fn().mockImplementation(() => ({
    trackCaseType: vi.fn(),
    trackCourt: vi.fn(),
    trackJudge: vi.fn(),
  })),
}));

vi.mock('../../../src/lib/validation/schemas', () => ({
  createDateFromParts: vi.fn(),
}));

vi.mock('../../../src/lib/csv/transformer', () => ({
  transformer: {
    deriveCourtTypeFromCaseId: vi.fn(),
  },
}));

// Import mocked modules
import {
  extractAndNormalizeCourt,
  extractAndNormalizeJudge,
  extractAndNormalizeCaseType,
  extractJudgesFromRow,
  createCaseNumber,
  determineCustodyStatus,
  MasterDataTracker,
} from '../../../src/lib/data/extraction';
import { createDateFromParts } from '../../../src/lib/validation/schemas';
import { transformer } from '../../../src/lib/csv/transformer';

describe('CaseService', () => {
  let mockTx: any;
  let mockMasterDataTracker: any;
  let sampleRow: CaseReturnRow;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock transaction object
    mockTx = {
      case: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      caseActivity: {
        create: vi.fn(),
      },
      caseJudgeAssignment: {
        create: vi.fn(),
      },
    };

    // Mock master data tracker
    mockMasterDataTracker = {
      trackCaseType: vi.fn(),
      trackCourt: vi.fn(),
      trackJudge: vi.fn(),
    };

    // Sample CSV row data
    sampleRow = {
      caseid_type: 'CRL',
      caseid_no: '12345',
      case_type: 'Criminal',
      court: 'District Court',
      judge_1: 'Hon. John Doe',
      filed_dd: '15',
      filed_mon: '06',
      filed_yyyy: '2023',
      date_dd: '20',
      date_mon: '06',
      date_yyyy: '2023',
      comingfor: 'Hearing',
      outcome: 'Adjourned',
      legalrep: 'Yes',
      male_applicant: '1',
      female_applicant: '0',
      organization_applicant: '0',
      male_defendant: '1',
      female_defendant: '0',
      organization_defendant: '0',
      applicant_witness: '2',
      defendant_witness: '1',
      custody: '1',
      other_details: 'Test details',
    } as CaseReturnRow;

    // Setup default mocks
    (createCaseNumber as any).mockReturnValue('CRL-12345');
    (createDateFromParts as any).mockReturnValue(new Date('2023-06-15'));
    (extractAndNormalizeCaseType as any).mockResolvedValue('case-type-id');
    (extractAndNormalizeCourt as any).mockResolvedValue({
      courtId: 'court-id',
      isNewCourt: false,
    });
    (extractAndNormalizeJudge as any).mockResolvedValue({
      judgeId: 'judge-id',
      isNewJudge: false,
    });
    (extractJudgesFromRow as any).mockReturnValue(['Hon. John Doe']);
    (determineCustodyStatus as any).mockReturnValue('IN_CUSTODY');
    (transformer.deriveCourtTypeFromCaseId as any).mockReturnValue('DISTRICT');
  });

  describe('createOrUpdateCase', () => {
    it('should create a new case when case does not exist', async () => {
      // Arrange
      mockTx.case.findUnique.mockResolvedValue(null);
      mockTx.case.create.mockResolvedValue({
        id: 'new-case-id',
        caseNumber: 'CRL-12345',
        status: 'ACTIVE',
        createdAt: new Date(),
      });
      mockTx.caseJudgeAssignment.create.mockResolvedValue({
        id: 'assignment-id',
        caseId: 'new-case-id',
        judgeId: 'judge-id',
        isPrimary: true,
      });

      // Act
      const result = await caseService.createOrUpdateCase(sampleRow, mockTx, mockMasterDataTracker);

      // Assert
      expect(result).toEqual({
        caseId: 'new-case-id',
        isNewCase: true,
      });
      expect(mockTx.case.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          caseNumber: 'CRL-12345',
          caseTypeId: 'case-type-id',
          status: 'ACTIVE',
          hasLegalRepresentation: true,
        }),
      });
      expect(mockTx.caseJudgeAssignment.create).toHaveBeenCalled();
    });

    it('should update existing case when case exists', async () => {
      // Arrange
      const existingCase = {
        id: 'existing-case-id',
        caseNumber: 'CRL-12345',
        totalActivities: 5,
      };
      mockTx.case.findUnique.mockResolvedValue(existingCase);
      mockTx.case.update.mockResolvedValue({
        ...existingCase,
        totalActivities: 6,
        lastActivityDate: new Date(),
      });

      // Act
      const result = await caseService.createOrUpdateCase(sampleRow, mockTx, mockMasterDataTracker);

      // Assert
      expect(result).toEqual({
        caseId: 'existing-case-id',
        isNewCase: false,
      });
      expect(mockTx.case.update).toHaveBeenCalledWith({
        where: { id: 'existing-case-id' },
        data: expect.objectContaining({
          totalActivities: { increment: 1 },
          hasLegalRepresentation: true,
        }),
      });
    });

    it('should throw error for missing required fields', async () => {
      // Arrange
      const invalidRow = { ...sampleRow, caseid_type: undefined };

      // Act & Assert
      await expect(
        caseService.createOrUpdateCase(invalidRow, mockTx, mockMasterDataTracker)
      ).rejects.toThrow('Missing required fields: caseid_type and caseid_no are required');
    });

    it('should throw error for invalid filed date', async () => {
      // Arrange
      (createDateFromParts as any).mockImplementation(() => {
        throw new Error('Invalid date');
      });

      // Act & Assert
      await expect(
        caseService.createOrUpdateCase(sampleRow, mockTx, mockMasterDataTracker)
      ).rejects.toThrow('Invalid filed date');
    });

    it('should handle database errors during case creation', async () => {
      // Arrange
      mockTx.case.findUnique.mockResolvedValue(null);
      mockTx.case.create.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(
        caseService.createOrUpdateCase(sampleRow, mockTx, mockMasterDataTracker)
      ).rejects.toThrow('Database error');
    });

    it('should handle numeric fields safely', async () => {
      // Arrange
      const rowWithInvalidNumbers = {
        ...sampleRow,
        male_applicant: 'invalid',
        female_applicant: null,
        organization_applicant: undefined,
      };
      mockTx.case.findUnique.mockResolvedValue(null);
      mockTx.case.create.mockResolvedValue({
        id: 'new-case-id',
        caseNumber: 'CRL-12345',
        status: 'ACTIVE',
        createdAt: new Date(),
      });
      mockTx.caseJudgeAssignment.create.mockResolvedValue({
        id: 'assignment-id',
        caseId: 'new-case-id',
        judgeId: 'judge-id',
        isPrimary: true,
      });

      // Act
      const result = await caseService.createOrUpdateCase(rowWithInvalidNumbers, mockTx, mockMasterDataTracker);

      // Assert
      expect(result.isNewCase).toBe(true);
      expect(mockTx.case.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          maleApplicant: 0, // Should default to 0 for invalid values
          femaleApplicant: 0,
          organizationApplicant: 0,
        }),
      });
    });
  });

  describe('createCaseActivity', () => {
    it('should create case activity successfully', async () => {
      // Arrange
      const caseId = 'test-case-id';
      const importBatchId = 'test-batch-id';
      mockTx.caseActivity.create.mockResolvedValue({
        id: 'activity-id',
        caseId,
        activityDate: new Date('2023-06-20'),
        activityType: 'Hearing',
      });

      // Act
      await caseService.createCaseActivity(sampleRow, caseId, importBatchId, mockTx, mockMasterDataTracker);

      // Assert
      expect(mockTx.caseActivity.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          caseId,
          activityType: 'Hearing',
          outcome: 'Adjourned',
          primaryJudgeId: 'judge-id',
          hasLegalRepresentation: true,
          importBatchId,
          custodyStatus: 'IN_CUSTODY',
        }),
      });
      expect(extractAndNormalizeJudge).toHaveBeenCalledWith('Hon. John Doe', mockTx);
    });

    it('should throw error for missing required activity fields', async () => {
      // Arrange
      const invalidRow = { ...sampleRow, date_dd: undefined };

      // Act & Assert
      await expect(
        caseService.createCaseActivity(invalidRow, 'case-id', 'batch-id', mockTx, mockMasterDataTracker)
      ).rejects.toThrow('Missing required date fields: date_dd, date_mon, date_yyyy are required for activity');
    });

    it('should throw error for missing judge', async () => {
      // Arrange
      const invalidRow = { ...sampleRow, judge_1: undefined };

      // Act & Assert
      await expect(
        caseService.createCaseActivity(invalidRow, 'case-id', 'batch-id', mockTx, mockMasterDataTracker)
      ).rejects.toThrow('Missing required field: judge_1 is required for activity');
    });

    it('should handle invalid activity date', async () => {
      // Arrange
      (createDateFromParts as any).mockImplementation(() => {
        throw new Error('Invalid date');
      });

      // Act & Assert
      await expect(
        caseService.createCaseActivity(sampleRow, 'case-id', 'batch-id', mockTx, mockMasterDataTracker)
      ).rejects.toThrow('Invalid activity date');
    });

    it('should handle optional next hearing date', async () => {
      // Arrange
      const rowWithNextDate = {
        ...sampleRow,
        next_dd: '25',
        next_mon: '06',
        next_yyyy: '2023',
      };
      const nextDate = new Date('2023-06-25');
      (createDateFromParts as any)
        .mockReturnValueOnce(new Date('2023-06-20')) // activity date
        .mockReturnValueOnce(nextDate); // next hearing date
      
      mockTx.caseActivity.create.mockResolvedValue({
        id: 'activity-id',
        caseId: 'case-id',
        activityDate: new Date('2023-06-20'),
        activityType: 'Hearing',
      });

      // Act
      await caseService.createCaseActivity(rowWithNextDate, 'case-id', 'batch-id', mockTx, mockMasterDataTracker);

      // Assert
      expect(mockTx.caseActivity.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          nextHearingDate: nextDate,
        }),
      });
    });

    it('should handle database errors during activity creation', async () => {
      // Arrange
      mockTx.caseActivity.create.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(
        caseService.createCaseActivity(sampleRow, 'case-id', 'batch-id', mockTx, mockMasterDataTracker)
      ).rejects.toThrow('Database error');
    });

    it('should handle witness counts safely', async () => {
      // Arrange
      const rowWithInvalidWitnesses = {
        ...sampleRow,
        applicant_witness: 'invalid',
        defendant_witness: null,
      };
      mockTx.caseActivity.create.mockResolvedValue({
        id: 'activity-id',
        caseId: 'case-id',
        activityDate: new Date('2023-06-20'),
        activityType: 'Hearing',
      });

      // Act
      await caseService.createCaseActivity(rowWithInvalidWitnesses, 'case-id', 'batch-id', mockTx, mockMasterDataTracker);

      // Assert
      expect(mockTx.caseActivity.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          applicantWitnesses: 0, // Should default to 0 for invalid values
          defendantWitnesses: 0,
        }),
      });
    });
  });

  describe('findExistingCase', () => {
    it('should find existing case by case number', async () => {
      // Arrange
      const expectedCase = {
        id: 'case-id',
        caseNumber: 'CRL-12345',
        status: 'ACTIVE',
      };
      mockTx.case.findUnique.mockResolvedValue(expectedCase);

      // Act
      const result = await caseService.findExistingCase('CRL-12345', 'Test Court', mockTx);

      // Assert
      expect(result).toEqual(expectedCase);
      expect(mockTx.case.findUnique).toHaveBeenCalledWith({
        where: { caseNumber: 'CRL-12345' },
      });
    });

    it('should return null when case does not exist', async () => {
      // Arrange
      mockTx.case.findUnique.mockResolvedValue(null);

      // Act
      const result = await caseService.findExistingCase('NON-EXISTENT', 'Test Court', mockTx);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('judge assignments', () => {
    it('should create multiple judge assignments', async () => {
      // Arrange
      (extractJudgesFromRow as any).mockReturnValue(['Hon. John Doe', 'Hon. Jane Smith']);
      (extractAndNormalizeJudge as any)
        .mockResolvedValueOnce({ judgeId: 'judge-1', isNewJudge: false })
        .mockResolvedValueOnce({ judgeId: 'judge-2', isNewJudge: true });
      
      mockTx.case.findUnique.mockResolvedValue(null);
      mockTx.case.create.mockResolvedValue({
        id: 'new-case-id',
        caseNumber: 'CRL-12345',
        status: 'ACTIVE',
        createdAt: new Date(),
      });
      mockTx.caseJudgeAssignment.create
        .mockResolvedValueOnce({
          id: 'assignment-1',
          caseId: 'new-case-id',
          judgeId: 'judge-1',
          isPrimary: true,
        })
        .mockResolvedValueOnce({
          id: 'assignment-2',
          caseId: 'new-case-id',
          judgeId: 'judge-2',
          isPrimary: false,
        });

      // Act
      await caseService.createOrUpdateCase(sampleRow, mockTx, mockMasterDataTracker);

      // Assert
      expect(mockTx.caseJudgeAssignment.create).toHaveBeenCalledTimes(2);
      expect(mockTx.caseJudgeAssignment.create).toHaveBeenNthCalledWith(1, {
        data: {
          caseId: 'new-case-id',
          judgeId: 'judge-1',
          isPrimary: true,
        },
      });
      expect(mockTx.caseJudgeAssignment.create).toHaveBeenNthCalledWith(2, {
        data: {
          caseId: 'new-case-id',
          judgeId: 'judge-2',
          isPrimary: false,
        },
      });
    });

    it('should handle judge assignment creation errors', async () => {
      // Arrange
      mockTx.case.findUnique.mockResolvedValue(null);
      mockTx.case.create.mockResolvedValue({
        id: 'new-case-id',
        caseNumber: 'CRL-12345',
        status: 'ACTIVE',
        createdAt: new Date(),
      });
      mockTx.caseJudgeAssignment.create.mockRejectedValue(new Error('Judge assignment error'));

      // Act & Assert
      await expect(
        caseService.createOrUpdateCase(sampleRow, mockTx, mockMasterDataTracker)
      ).rejects.toThrow('Judge assignment error');
    });
  });

  describe('master data tracking', () => {
    it('should track master data when tracker is provided', async () => {
      // Arrange
      mockTx.case.findUnique.mockResolvedValue(null);
      mockTx.case.create.mockResolvedValue({
        id: 'new-case-id',
        caseNumber: 'CRL-12345',
        status: 'ACTIVE',
        createdAt: new Date(),
      });
      mockTx.caseJudgeAssignment.create.mockResolvedValue({
        id: 'assignment-id',
        caseId: 'new-case-id',
        judgeId: 'judge-id',
        isPrimary: true,
      });

      // Act
      await caseService.createOrUpdateCase(sampleRow, mockTx, mockMasterDataTracker);

      // Assert
      expect(mockMasterDataTracker.trackCaseType).toHaveBeenCalled();
      expect(mockMasterDataTracker.trackCourt).toHaveBeenCalled();
      expect(mockMasterDataTracker.trackJudge).toHaveBeenCalled();
    });

    it('should work without master data tracker', async () => {
      // Arrange
      mockTx.case.findUnique.mockResolvedValue(null);
      mockTx.case.create.mockResolvedValue({
        id: 'new-case-id',
        caseNumber: 'CRL-12345',
        status: 'ACTIVE',
        createdAt: new Date(),
      });
      mockTx.caseJudgeAssignment.create.mockResolvedValue({
        id: 'assignment-id',
        caseId: 'new-case-id',
        judgeId: 'judge-id',
        isPrimary: true,
      });

      // Act & Assert - should not throw error
      await expect(
        caseService.createOrUpdateCase(sampleRow, mockTx)
      ).resolves.toEqual({
        caseId: 'new-case-id',
        isNewCase: true,
      });
    });
  });
});