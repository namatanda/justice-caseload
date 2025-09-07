import { describe, it, expect, beforeEach } from 'vitest';
import { 
  testDb, 
  createTestUser, 
  createTestCase, 
  createTestCourt,
  createTestJudge,
  createTestCaseType,
  createTestImportBatch
} from '../setup';
import {
  createCase,
  getCaseById,
  getCasesPaginated,
  updateCase,
  updateCaseStatus,
  bulkUpdateCases,
  softDeleteCase,
  getCaseStatistics,
  getRecentCases,
} from '@/lib/operations/case-crud';
import {
  createJudge,
  getAllJudges,
  updateJudge,
  deactivateJudge,
  createCourt,
  getAllCourts,
  createCaseType,
  getAllCaseTypes,
  createUser,
  getUserByEmail,
} from '@/lib/operations/master-data-crud';

describe('CRUD Operations Tests', () => {
  describe('Case CRUD Operations', () => {
    it('should create a new case', async () => {
      const user = await createTestUser();
      const caseType = await createTestCaseType();
      
      const caseData = {
        caseNumber: 'TEST-CREATE-001',
        caseTypeId: caseType.id,
        filedDate: new Date(),
        parties: {
          applicants: { maleCount: 1, femaleCount: 1, organizationCount: 0 },
          defendants: { maleCount: 0, femaleCount: 1, organizationCount: 1 },
        },
        status: 'ACTIVE' as const,
        hasLegalRepresentation: true,
      };
      
      const result = await createCase(caseData, user.id);
      
      expect(result.success).toBe(true);
      expect(result.caseId).toBeDefined();
      
      // Verify case was created in database
      const createdCase = await testDb().case.findUnique({
        where: { id: result.caseId },
      });
      
      expect(createdCase).toBeTruthy();
      expect(createdCase?.caseNumber).toBe('TEST-CREATE-001');
      expect(createdCase?.hasLegalRepresentation).toBe(true);
    });

    it('should retrieve a case by ID with all relationships', async () => {
      const testCase = await createTestCase();
      
      const retrievedCase = await getCaseById(testCase.id);
      
      expect(retrievedCase).toBeTruthy();
      expect(retrievedCase?.id).toBe(testCase.id);
      expect(retrievedCase?.caseType).toBeDefined();
      expect(retrievedCase?.activities).toBeDefined();
      expect(retrievedCase?.judgeAssignments).toBeDefined();
    });

    it('should return null for non-existent case', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const result = await getCaseById(nonExistentId);
      
      expect(result).toBeNull();
    });

    it('should retrieve paginated cases with filters', async () => {
      // Create multiple test cases
      const caseType = await createTestCaseType();
      
      for (let i = 0; i < 5; i++) {
        await testDb().case.create({
          data: {
            caseNumber: `PAGINATED-${i + 1}`,
            courtName: 'Test Court',
            caseTypeId: caseType.id,
            filedDate: new Date(),
            parties: {
              applicants: { maleCount: 1, femaleCount: 0, organizationCount: 0 },
              defendants: { maleCount: 0, femaleCount: 1, organizationCount: 0 },
            },
            status: i % 2 === 0 ? 'ACTIVE' : 'RESOLVED',
          },
        });
      }
      
      const result = await getCasesPaginated({
        pageSize: 3,
        filters: { status: 'ACTIVE' },
      });
      
      expect(result.cases.length).toBeLessThanOrEqual(3);
      expect(result.totalCount).toBeGreaterThan(0);
      expect(result.cases.every(c => c.status === 'ACTIVE')).toBe(true);
    });

    it('should update a case successfully', async () => {
      const testCase = await createTestCase();
      const user = await createTestUser();
      
      const updateData = {
        hasLegalRepresentation: true,
        status: 'PENDING' as const,
      };
      
      const result = await updateCase(testCase.id, updateData, user.id);
      
      expect(result.success).toBe(true);
      
      // Verify update in database
      const updatedCase = await testDb().case.findUnique({
        where: { id: testCase.id },
      });
      
      expect(updatedCase?.hasLegalRepresentation).toBe(true);
      expect(updatedCase?.status).toBe('PENDING');
    });

    it('should update case status with reason', async () => {
      const testCase = await createTestCase();
      
      const statusData = {
        caseId: testCase.id,
        status: 'RESOLVED' as const,
        reason: 'Case settled out of court',
      };
      
      const result = await updateCaseStatus(statusData);
      
      expect(result.success).toBe(true);
      
      // Verify status update
      const updatedCase = await testDb().case.findUnique({
        where: { id: testCase.id },
      });
      
      expect(updatedCase?.status).toBe('RESOLVED');
      
      // Verify status change activity was created
      const activities = await testDb().caseActivity.findMany({
        where: { caseId: testCase.id },
      });
      
      expect(activities.some(a => a.activityType === 'Status Change')).toBe(true);
    });

    it('should perform bulk updates on multiple cases', async () => {
      // Create multiple test cases
      const cases = [];
      for (let i = 0; i < 3; i++) {
        const testCase = await createTestCase(`BULK-${i + 1}`);
        cases.push(testCase);
      }
      
      const user = await createTestUser();
      const updateData = {
        caseIds: cases.map(c => c.id),
        updates: { status: 'TRANSFERRED' as const },
        userId: user.id,
      };
      
      const result = await bulkUpdateCases(updateData);
      
      expect(result.success).toBe(true);
      expect(result.updatedCount).toBe(3);
      expect(result.errors).toHaveLength(0);
      
      // Verify all cases were updated
      const updatedCases = await testDb().case.findMany({
        where: { id: { in: cases.map(c => c.id) } },
      });
      
      expect(updatedCases.every(c => c.status === 'TRANSFERRED')).toBe(true);
    });

    it('should soft delete a case', async () => {
      const testCase = await createTestCase();
      const user = await createTestUser();
      
      const result = await softDeleteCase(
        testCase.id,
        'Test deletion reason',
        user.id
      );
      
      expect(result.success).toBe(true);
      
      // Verify case is marked as deleted
      const deletedCase = await testDb().case.findUnique({
        where: { id: testCase.id },
      });
      
      expect(deletedCase?.status).toBe('DELETED');
      
      // Verify deletion activity was created
      const activities = await testDb().caseActivity.findMany({
        where: { caseId: testCase.id },
      });
      
      expect(activities.some(a => a.activityType === 'Case Deletion')).toBe(true);
    });

    it('should get case statistics', async () => {
      // Create cases with different statuses
      const caseType = await createTestCaseType();
      const statuses = ['ACTIVE', 'RESOLVED', 'PENDING'] as const;
      
      for (const status of statuses) {
        await testDb().case.create({
          data: {
            caseNumber: `STATS-${status}`,
            courtName: 'Test Court',
            caseTypeId: caseType.id,
            filedDate: new Date(),
            parties: {
              applicants: { maleCount: 1, femaleCount: 0, organizationCount: 0 },
              defendants: { maleCount: 0, femaleCount: 1, organizationCount: 0 },
            },
            status,
            caseAgeDays: 30,
          },
        });
      }
      
      const stats = await getCaseStatistics();
      
      expect(stats.totalCases).toBeGreaterThan(0);
      expect(stats.activeCases).toBeGreaterThan(0);
      expect(stats.resolvedCases).toBeGreaterThan(0);
      expect(stats.pendingCases).toBeGreaterThan(0);
      expect(stats.averageCaseAge).toBeGreaterThanOrEqual(0);
    });

    it('should get recent cases', async () => {
      // Create a test case
      await createTestCase();
      
      const recentCases = await getRecentCases(5);
      
      expect(recentCases.length).toBeGreaterThan(0);
      expect(recentCases[0].caseType).toBeDefined();
      expect(recentCases[0].activities).toBeDefined();
    });
  });

  describe('Judge CRUD Operations', () => {
    it('should create a new judge', async () => {
      const judgeData = {
        fullName: 'Hon. Jane Smith',
        firstName: 'Jane',
        lastName: 'Smith',
        isActive: true,
      };
      
      const result = await createJudge(judgeData);
      
      expect(result.success).toBe(true);
      expect(result.judgeId).toBeDefined();
      
      // Verify judge was created
      const createdJudge = await testDb().judge.findUnique({
        where: { id: result.judgeId },
      });
      
      expect(createdJudge).toBeTruthy();
      expect(createdJudge?.fullName).toBe('Hon. Jane Smith');
    });

    it('should get all active judges', async () => {
      await createTestJudge();
      
      const judges = await getAllJudges();
      
      expect(judges.length).toBeGreaterThan(0);
      expect(judges.every(j => j.isActive)).toBe(true);
    });

    it('should update a judge', async () => {
      const judge = await createTestJudge();
      
      const result = await updateJudge(judge.id, {
        fullName: 'Updated Judge Name',
      });
      
      expect(result.success).toBe(true);
      
      // Verify update
      const updatedJudge = await testDb().judge.findUnique({
        where: { id: judge.id },
      });
      
      expect(updatedJudge?.fullName).toBe('Updated Judge Name');
    });

    it('should deactivate a judge', async () => {
      const judge = await createTestJudge();
      
      const result = await deactivateJudge(judge.id);
      
      expect(result.success).toBe(true);
      
      // Verify deactivation
      const deactivatedJudge = await testDb().judge.findUnique({
        where: { id: judge.id },
      });
      
      expect(deactivatedJudge?.isActive).toBe(false);
    });
  });

  describe('Court CRUD Operations', () => {
    it('should create a new court', async () => {
      const courtData = {
        courtName: 'New Test Court',
        courtCode: 'NTC',
        courtType: 'MC' as const,
        isActive: true,
      };
      
      const result = await createCourt(courtData);
      
      expect(result.success).toBe(true);
      expect(result.courtId).toBeDefined();
    });

    it('should prevent duplicate court codes', async () => {
      const courtData1 = {
        courtName: 'First Court',
        courtCode: 'DUPLICATE',
        courtType: 'HC' as const,
      };
      
      const courtData2 = {
        courtName: 'Second Court',
        courtCode: 'DUPLICATE',
        courtType: 'MAGISTRATE' as const,
      };
      
      const result1 = await createCourt(courtData1);
      expect(result1.success).toBe(true);
      
      const result2 = await createCourt(courtData2);
      expect(result2.success).toBe(false);
      expect(result2.error).toContain('already exists');
    });

    it('should get all active courts', async () => {
      await createTestCourt();
      
      const courts = await getAllCourts();
      
      expect(courts.length).toBeGreaterThan(0);
      expect(courts.every(c => c.isActive)).toBe(true);
    });
  });

  describe('CaseType CRUD Operations', () => {
    it('should create a new case type', async () => {
      const caseTypeData = {
        caseTypeName: 'Environmental Case',
        caseTypeCode: 'ENV',
        description: 'Environmental law cases',
        isActive: true,
      };
      
      const result = await createCaseType(caseTypeData);
      
      expect(result.success).toBe(true);
      expect(result.caseTypeId).toBeDefined();
    });

    it('should get all active case types', async () => {
      await createTestCaseType();
      
      const caseTypes = await getAllCaseTypes();
      
      expect(caseTypes.length).toBeGreaterThan(0);
      expect(caseTypes.every(ct => ct.isActive)).toBe(true);
    });
  });

  describe('User CRUD Operations', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        name: 'New User',
        role: 'DATA_ENTRY' as const,
        isActive: true,
      };
      
      const result = await createUser(userData);
      
      expect(result.success).toBe(true);
      expect(result.userId).toBeDefined();
    });

    it('should prevent duplicate emails', async () => {
      const email = 'duplicate@example.com';
      
      const userData1 = {
        email,
        name: 'First User',
        role: 'ADMIN' as const,
      };
      
      const userData2 = {
        email,
        name: 'Second User',
        role: 'VIEWER' as const,
      };
      
      const result1 = await createUser(userData1);
      expect(result1.success).toBe(true);
      
      const result2 = await createUser(userData2);
      expect(result2.success).toBe(false);
      expect(result2.error).toContain('already exists');
    });

    it('should get user by email', async () => {
      const user = await createTestUser();
      
      const foundUser = await getUserByEmail(user.email);
      
      expect(foundUser).toBeTruthy();
      expect(foundUser?.id).toBe(user.id);
      expect(foundUser?.email).toBe(user.email);
    });
  });
});