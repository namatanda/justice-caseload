import { describe, it, expect } from 'vitest';
import { 
  testDb, 
  createTestUser, 
  createTestCourt, 
  createTestJudge, 
  createTestCaseType,
  createTestCase,
  createTestImportBatch,
  createTestCaseActivity
} from '../setup';

describe('Database Schema Tests', () => {
  describe('User Model', () => {
    it('should create a user with all required fields', async () => {
      const user = await createTestUser();
      
      expect(user.id).toBeDefined();
      expect(user.email).toContain('@example.com');
      expect(user.name).toBe('Test User');
      expect(user.role).toBe('ADMIN');
      expect(user.isActive).toBe(true);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should enforce unique email constraint', async () => {
      const email = 'duplicate@example.com';
      
      await testDb().user.create({
        data: {
          email,
          name: 'First User',
          role: 'ADMIN',
        },
      });

      await expect(
        testDb().user.create({
          data: {
            email,
            name: 'Second User',
            role: 'DATA_ENTRY',
          },
        })
      ).rejects.toThrow();
    });

    it('should have default values for role and isActive', async () => {
      const user = await testDb().user.create({
        data: {
          email: 'default@example.com',
          name: 'Default User',
        },
      });

      expect(user.role).toBe('DATA_ENTRY');
      expect(user.isActive).toBe(true);
    });
  });

  describe('Court Model', () => {
    it('should create a court with all required fields', async () => {
      const court = await createTestCourt();
      
      expect(court.id).toBeDefined();
      expect(court.courtName).toBe('Test Court');
      expect(court.courtCode).toContain('TEST');
      expect(court.courtType).toBe('HIGH_COURT');
      expect(court.isActive).toBe(true);
      expect(court.createdAt).toBeInstanceOf(Date);
      expect(court.updatedAt).toBeInstanceOf(Date);
    });

    it('should enforce unique court code constraint', async () => {
      const courtCode = 'UNIQUE_CODE';
      
      await testDb().court.create({
        data: {
          courtName: 'First Court',
          courtCode,
          courtType: 'MC' as const,
        },
      });

      await expect(
        testDb().court.create({
          data: {
            courtName: 'Second Court',
            courtCode,
            courtType: 'HC' as const,
          },
        })
      ).rejects.toThrow();
    });

    it('should support all court types', async () => {
      const courtTypes = ['SC','ELC','ELRC', 'KC', 'SCC', 'COA','MC', 'HC', 'TC'] as const;
      
      for (const courtType of courtTypes) {
        const court = await testDb().court.create({
          data: {
            courtName: `${courtType} Court`,
            courtCode: `${courtType}_CODE`,
            courtType,
          },
        });
        
        expect(court.courtType).toBe(courtType);
      }
    });
  });

  describe('Judge Model', () => {
    it('should create a judge with all required fields', async () => {
      const judge = await createTestJudge();
      
      expect(judge.id).toBeDefined();
      expect(judge.fullName).toBe('Test Judge');
      expect(judge.firstName).toBe('Test');
      expect(judge.lastName).toBe('Judge');
      expect(judge.isActive).toBe(true);
      expect(judge.createdAt).toBeInstanceOf(Date);
      expect(judge.updatedAt).toBeInstanceOf(Date);
    });

    it('should allow multiple judges with same names', async () => {
      const judge1 = await testDb().judge.create({
        data: {
          fullName: 'John Smith',
          firstName: 'John',
          lastName: 'Smith',
        },
      });

      const judge2 = await testDb().judge.create({
        data: {
          fullName: 'John Smith',
          firstName: 'John',
          lastName: 'Smith',
        },
      });

      expect(judge1.id).not.toBe(judge2.id);
      expect(judge1.fullName).toBe(judge2.fullName);
    });
  });

  describe('CaseType Model', () => {
    it('should create a case type with all required fields', async () => {
      const caseType = await createTestCaseType();
      
      expect(caseType.id).toBeDefined();
      expect(caseType.caseTypeName).toBe('Test Case Type');
      expect(caseType.caseTypeCode).toContain('TEST');
      expect(caseType.description).toBe('Test case type for unit testing');
      expect(caseType.isActive).toBe(true);
      expect(caseType.createdAt).toBeInstanceOf(Date);
    });

    it('should enforce unique case type code constraint', async () => {
      const caseTypeCode = 'UNIQUE_TYPE';
      
      await testDb().caseType.create({
        data: {
          caseTypeName: 'First Type',
          caseTypeCode,
        },
      });

      await expect(
        testDb().caseType.create({
          data: {
            caseTypeName: 'Second Type',
            caseTypeCode,
          },
        })
      ).rejects.toThrow();
    });
  });

  describe('Case Model', () => {
    it('should create a case with all required fields', async () => {
      const testCase = await createTestCase();
      
      expect(testCase.id).toBeDefined();
      expect(testCase.caseNumber).toContain('TEST-');
      expect(testCase.caseTypeId).toBeDefined();
      expect(testCase.filedDate).toBeInstanceOf(Date);
      expect(testCase.parties).toEqual({
        applicants: { maleCount: 1, femaleCount: 0, organizationCount: 0 },
        defendants: { maleCount: 0, femaleCount: 1, organizationCount: 0 },
      });
      expect(testCase.status).toBe('ACTIVE');
      expect(testCase.caseAgeDays).toBe(0);
      expect(testCase.totalActivities).toBe(0);
      expect(testCase.hasLegalRepresentation).toBe(false);
      expect(testCase.createdAt).toBeInstanceOf(Date);
      expect(testCase.updatedAt).toBeInstanceOf(Date);
    });

    it('should enforce unique case number constraint', async () => {
      const caseNumber = 'UNIQUE-001';
      
      await createTestCase(caseNumber);

      await expect(createTestCase(caseNumber)).rejects.toThrow();
    });

    it('should support all case statuses', async () => {
      const statuses = ['ACTIVE', 'RESOLVED', 'PENDING', 'TRANSFERRED', 'DELETED'] as const;
      
      for (const status of statuses) {
        const caseType = await createTestCaseType();
        const testCase = await testDb().case.create({
          data: {
            caseNumber: `${status}-${Date.now()}`,
            caseTypeId: caseType.id,
            filedDate: new Date(),
            parties: {
              applicants: { maleCount: 1, femaleCount: 0, organizationCount: 0 },
              defendants: { maleCount: 0, femaleCount: 1, organizationCount: 0 },
            },
            status,
          },
        });
        
        expect(testCase.status).toBe(status);
      }
    });

    it('should store JSONB parties data correctly', async () => {
      const partiesData = {
        applicants: { maleCount: 2, femaleCount: 1, organizationCount: 1 },
        defendants: { maleCount: 1, femaleCount: 2, organizationCount: 0 },
      };
      
      const caseType = await createTestCaseType();
      const testCase = await testDb().case.create({
        data: {
          caseNumber: `JSONB-${Date.now()}`,
          caseTypeId: caseType.id,
          filedDate: new Date(),
          parties: partiesData,
        },
      });
      
      expect(testCase.parties).toEqual(partiesData);
    });
  });

  describe('CaseActivity Model', () => {
    it('should create a case activity with all required fields', async () => {
      const activity = await createTestCaseActivity();
      
      expect(activity.id).toBeDefined();
      expect(activity.caseId).toBeDefined();
      expect(activity.activityDate).toBeInstanceOf(Date);
      expect(activity.activityType).toBe('Test Activity');
      expect(activity.outcome).toBe('Test Outcome');
      expect(activity.primaryJudgeId).toBeDefined();
      expect(activity.hasLegalRepresentation).toBe(false);
      expect(activity.applicantWitnesses).toBe(0);
      expect(activity.defendantWitnesses).toBe(0);
      expect(activity.custodyStatus).toBe('NOT_APPLICABLE');
      expect(activity.importBatchId).toBeDefined();
      expect(activity.createdAt).toBeInstanceOf(Date);
    });

    it('should support all custody statuses', async () => {
      const custodyStatuses = ['IN_CUSTODY', 'ON_BAIL', 'NOT_APPLICABLE'] as const;
      
      for (const custodyStatus of custodyStatuses) {
        const testCase = await createTestCase();
        const judge = await createTestJudge();
        const importBatch = await createTestImportBatch();
        
        const activity = await testDb().caseActivity.create({
          data: {
            caseId: testCase.id,
            activityDate: new Date(),
            activityType: 'Test Activity',
            outcome: 'Test Outcome',
            primaryJudgeId: judge.id,
            hasLegalRepresentation: false,
            custodyStatus,
            importBatchId: importBatch.id,
          },
        });
        
        expect(activity.custodyStatus).toBe(custodyStatus);
      }
    });
  });

  describe('CaseJudgeAssignment Model', () => {
    it('should create case judge assignments', async () => {
      const testCase = await createTestCase();
      const judge = await createTestJudge();
      
      const assignment = await testDb().caseJudgeAssignment.create({
        data: {
          caseId: testCase.id,
          judgeId: judge.id,
          isPrimary: true,
        },
      });
      
      expect(assignment.caseId).toBe(testCase.id);
      expect(assignment.judgeId).toBe(judge.id);
      expect(assignment.isPrimary).toBe(true);
      expect(assignment.assignedAt).toBeInstanceOf(Date);
    });

    it('should enforce composite primary key constraint', async () => {
      const testCase = await createTestCase();
      const judge = await createTestJudge();
      
      await testDb().caseJudgeAssignment.create({
        data: {
          caseId: testCase.id,
          judgeId: judge.id,
          isPrimary: true,
        },
      });

      await expect(
        testDb().caseJudgeAssignment.create({
          data: {
            caseId: testCase.id,
            judgeId: judge.id,
            isPrimary: false,
          },
        })
      ).rejects.toThrow();
    });

    it('should allow multiple judges per case', async () => {
      const testCase = await createTestCase();
      const judge1 = await createTestJudge();
      const judge2 = await testDb().judge.create({
        data: {
          fullName: 'Second Judge',
          firstName: 'Second',
          lastName: 'Judge',
        },
      });
      
      const assignment1 = await testDb().caseJudgeAssignment.create({
        data: {
          caseId: testCase.id,
          judgeId: judge1.id,
          isPrimary: true,
        },
      });

      const assignment2 = await testDb().caseJudgeAssignment.create({
        data: {
          caseId: testCase.id,
          judgeId: judge2.id,
          isPrimary: false,
        },
      });
      
      expect(assignment1.caseId).toBe(assignment2.caseId);
      expect(assignment1.judgeId).not.toBe(assignment2.judgeId);
    });
  });

  describe('DailyImportBatch Model', () => {
    it('should create an import batch with all required fields', async () => {
      const batch = await createTestImportBatch();
      
      expect(batch.id).toBeDefined();
      expect(batch.importDate).toBeInstanceOf(Date);
      expect(batch.filename).toContain('test-');
      expect(batch.fileSize).toBe(1024);
      expect(batch.fileChecksum).toBeDefined();
      expect(batch.totalRecords).toBe(0);
      expect(batch.successfulRecords).toBe(0);
      expect(batch.failedRecords).toBe(0);
      expect(batch.errorLogs).toEqual([]);
      expect(batch.status).toBe('PENDING');
      expect(batch.createdBy).toBeDefined();
      expect(batch.createdAt).toBeInstanceOf(Date);
    });

    it('should support all import statuses', async () => {
      const statuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'] as const;
      
      for (const status of statuses) {
        const user = await createTestUser();
        const batch = await testDb().dailyImportBatch.create({
          data: {
            importDate: new Date(),
            filename: `${status.toLowerCase()}-test.csv`,
            fileSize: 1024,
            fileChecksum: `checksum-${status}`,
            totalRecords: 0,
            successfulRecords: 0,
            failedRecords: 0,
            errorLogs: [],
            status,
            createdBy: user.id,
          },
        });
        
        expect(batch.status).toBe(status);
      }
    });
  });

  describe('Relationships', () => {
    it('should handle case to case type relationship', async () => {
      const caseWithType = await testDb().case.findFirst({
        include: {
          caseType: true,
        },
      });
      
      if (caseWithType) {
        expect(caseWithType.caseType).toBeDefined();
        expect(caseWithType.caseType.caseTypeName).toBeDefined();
      }
    });

    it('should handle case to case activities relationship', async () => {
      const activity = await createTestCaseActivity();
      
      const caseWithActivities = await testDb().case.findUnique({
        where: { id: activity.caseId },
        include: {
          activities: true,
        },
      });
      
      expect(caseWithActivities?.activities).toHaveLength(1);
      expect(caseWithActivities?.activities[0].id).toBe(activity.id);
    });

    it('should handle case to judge assignments relationship', async () => {
      const testCase = await createTestCase();
      const judge = await createTestJudge();
      
      await testDb().caseJudgeAssignment.create({
        data: {
          caseId: testCase.id,
          judgeId: judge.id,
          isPrimary: true,
        },
      });
      
      const caseWithJudges = await testDb().case.findUnique({
        where: { id: testCase.id },
        include: {
          judgeAssignments: {
            include: {
              judge: true,
            },
          },
        },
      });
      
      expect(caseWithJudges?.judgeAssignments).toHaveLength(1);
      expect(caseWithJudges?.judgeAssignments[0].judge.id).toBe(judge.id);
    });

    it('should handle cascade delete for case activities', async () => {
      const activity = await createTestCaseActivity();
      const caseId = activity.caseId;
      
      // Delete the case
      await testDb().case.delete({
        where: { id: caseId },
      });
      
      // Activity should be automatically deleted
      const deletedActivity = await testDb().caseActivity.findUnique({
        where: { id: activity.id },
      });
      
      expect(deletedActivity).toBeNull();
    });
  });
});