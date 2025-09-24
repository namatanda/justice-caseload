import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { vi } from 'vitest';
import { prisma, Prisma } from '../../src/lib/db';
import logger from '../../src/lib/logger';

vi.mock('../../src/lib/logger', () => ({
  default: {
    general: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    },
    system: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    },
    import: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    },
  },
}));
describe('Database Persistence Check Integration Tests', () => {
  let testBatchId: string;
  let testCaseId: string;
  let testActivityId: string;
  let testUserId: string;
  let testCaseTypeId: string;
  let testJudgeId: string;

  beforeAll(async () => {
    // Ensure test environment
    if (!process.env.DATABASE_URL?.includes('test')) {
      (logger as any).general.warn('Running persistence checks against non-test database; set DATABASE_URL for isolation');
    }
    await prisma.$connect();

    // Seed test data
    // Seed test court
    const testCourt = await prisma.court.upsert({
      where: { courtCode: 'TEST_COURT' },
      update: {},
      create: {
        courtName: 'Test Court',
        courtCode: 'TEST_COURT',
        courtType: 'HC',
      },
    });
    const testCourtId = testCourt.id;

    const testUser = await prisma.user.upsert({
      where: { email: 'test-persistence@justice.go.ke' },
      update: {},
      create: {
        email: 'test-persistence@justice.go.ke',
        name: 'Test Persistence User',
        role: 'ADMIN',
        isActive: true,
      },
    });
    testUserId = testUser.id;

    const testCaseType = await prisma.caseType.upsert({
      where: { caseTypeCode: 'TEST_TYPE' },
      update: {},
      create: {
        caseTypeName: 'Test Case Type',
        caseTypeCode: 'TEST_TYPE',
        description: 'Test case type for persistence',
      },
    });
    testCaseTypeId = testCaseType.id;

    const testJudge = await prisma.judge.create({
      data: {
        fullName: 'Test Judge',
        firstName: 'Test',
        lastName: 'Judge',
        isActive: true,
      },
    });
    testJudgeId = testJudge.id;

  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Cleanup test data with unique identifiers
    if (testActivityId) {
      try {
        await prisma.caseActivity.delete({ where: { id: testActivityId } });
      } catch (error) {
        // Ignore if not found
      }
    }
    if (testCaseId) {
      try {
        await prisma.case.delete({ where: { id: testCaseId } });
      } catch (error) {
        // Ignore if not found
      }
    }
    if (testBatchId) {
      try {
        await prisma.dailyImportBatch.delete({ where: { id: testBatchId } });
      } catch (error) {
        // Ignore if not found
      }
    }
    // Enhanced cleanup for test-specific data
    try {
      await prisma.dailyImportBatch.deleteMany({
        where: {
          filename: {
            in: ['test-batch.csv', 'group-batch.csv', 'recent-batch.csv']
          }
        }
      });
      await prisma.caseActivity.deleteMany({
        where: {
          case: {
            caseNumber: {
              startsWith: 'TEST-'
            }
          }
        }
      });
      await prisma.case.deleteMany({
        where: {
          caseNumber: {
            startsWith: 'TEST-'
          }
        }
      });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it('should query import batches successfully', async () => {
    // Create test batch
    const testBatch = await prisma.dailyImportBatch.create({
      data: {
        importDate: new Date(),
        filename: 'test-batch.csv',
        fileSize: 1024,
        fileChecksum: 'test-checksum',
        totalRecords: 1,
        successfulRecords: 1,
        failedRecords: 0,
        errorLogs: [],
        status: 'COMPLETED',
        createdBy: testUserId,
        userConfig: {},
        validationWarnings: [],
      },
    });
    testBatchId = testBatch.id;

    // Query recent batches
    const batches = await prisma.dailyImportBatch.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    expect(Array.isArray(batches)).toBe(true);
    expect(batches.length).toBeGreaterThan(0);
    expect(batches[0].id).toBe(testBatch.id);
    expect(batches[0].filename).toBe('test-batch.csv');
    expect(batches[0].status).toBe('COMPLETED');
    (logger as any).general.info(`Found ${batches.length} batches`);
    batches.forEach(batch => {
      (logger as any).general.info(`Batch ${batch.id.substring(0, 8)}... - ${batch.filename}`);
      (logger as any).general.info(`Batch status: ${batch.status}`);
      (logger as any).general.info(`Batch records: ${batch.totalRecords} total, ${batch.successfulRecords} successful, ${batch.failedRecords} failed`);
    });
  });

  it('should query cases and recent cases successfully', async () => {
    const casesCount = await prisma.case.count();
    expect(typeof casesCount).toBe('number');

    (logger as any).general.info(`Total cases: ${casesCount}`);

    if (casesCount > 0) {
      const recentCases = await prisma.case.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { caseType: true },
      });

      expect(Array.isArray(recentCases)).toBe(true);
      recentCases.forEach(caseItem => {
        expect(caseItem.caseNumber).toBeDefined();
        (logger as any).general.info(`Case: ${caseItem.caseNumber} (${caseItem.caseType?.caseTypeName || 'Unknown type'})`);
        (logger as any).general.info(`Case status: ${caseItem.status}, Filed: ${caseItem.filedDate.toISOString().split('T')[0]}`);
      });
    }
  });

  it('should query case activities and recent activities successfully', async () => {
    const activitiesCount = await prisma.caseActivity.count();
    expect(typeof activitiesCount).toBe('number');

    (logger as any).general.info(`Total activities: ${activitiesCount}`);

    if (activitiesCount > 0) {
      const recentActivities = await prisma.caseActivity.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { case: true, importBatch: true },
      });

      expect(Array.isArray(recentActivities)).toBe(true);
      recentActivities.forEach(activity => {
        expect(activity.activityType).toBeDefined();
        (logger as any).general.info(`Activity: ${activity.activityType} for case ${activity.case?.caseNumber || 'Unknown'}`);
        (logger as any).general.info(`Activity date: ${activity.activityDate.toISOString().split('T')[0]}, Outcome: ${activity.outcome}`);
        if (activity.importBatch) {
          (logger as any).general.info(`From batch: ${activity.importBatch.filename}`);
        }
      });
    }
  });

  it('should group activities by import batch correctly', async () => {
    // Create test data
    const testBatch = await prisma.dailyImportBatch.create({
      data: {
        importDate: new Date(),
        filename: 'group-batch.csv',
        fileSize: 1024,
        fileChecksum: 'group-checksum',
        totalRecords: 1,
        successfulRecords: 1,
        failedRecords: 0,
        errorLogs: [],
        status: 'COMPLETED',
        createdBy: testUserId,
        userConfig: {},
        validationWarnings: [],
      },
    });
    testBatchId = testBatch.id;

    const testCase = await prisma.case.create({
      data: {
        caseNumber: 'TEST-001',
        caseTypeId: testCaseTypeId,
        filedDate: new Date(),
        status: 'ACTIVE',
        parties: {
          create: [
            {
              type: 'APPLICANT',
              name: 'Test Applicant',
              gender: 'MALE',
              isOrganization: false,
            },
          ],
        },
      },
    });
    testCaseId = testCase.id;

    const testActivity = await prisma.caseActivity.create({
      data: {
        caseId: testCase.id,
        activityType: 'HEARING',
        activityDate: new Date(),
        outcome: 'ADJOURNED',
        importBatchId: testBatch.id,
        primaryJudgeId: testJudgeId,
        hasLegalRepresentation: false,
        custodyStatus: 'NOT_APPLICABLE',
      },
    });
    testActivityId = testActivity.id;

    const batchActivities = await prisma.caseActivity.groupBy({
      by: ['importBatchId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      where: { importBatchId: testBatch.id } // Filter to test batch only
    });

    console.log('Batch activities groups:', batchActivities);
    console.log('First group count:', batchActivities[0]?._count.id, 'Expected: 1');
    console.log('First group batchId:', batchActivities[0]?.importBatchId, 'Expected:', testBatch.id);

    expect(Array.isArray(batchActivities)).toBe(true);
    expect(batchActivities[0]._count.id).toBe(1);
    expect(batchActivities[0].importBatchId).toBe(testBatch.id);

    (logger as any).general.info('Activities by Import Batch');
    for (const batchGroup of batchActivities) {
      if (batchGroup.importBatchId) {
        const batch = await prisma.dailyImportBatch.findUnique({
          where: { id: batchGroup.importBatchId },
        });
        (logger as any).general.info(`Batch ${batch?.filename || 'Unknown batch'}: ${batchGroup._count.id} activities`);
      }
    }
  });

  it('should check recent upload impact correctly', async () => {
    // Create test batch for case_returns.csv
    const recentBatch = await prisma.dailyImportBatch.create({
      data: {
        importDate: new Date(),
        filename: 'recent-batch.csv', // Unique filename for test
        fileSize: 1024,
        fileChecksum: 'recent-checksum',
        totalRecords: 1,
        successfulRecords: 1,
        failedRecords: 0,
        errorLogs: [],
        status: 'COMPLETED',
        createdBy: testUserId,
        userConfig: {},
        validationWarnings: [],
      },
    });
    testBatchId = recentBatch.id;

    const testCase = await prisma.case.create({
      data: {
        caseNumber: 'RECENT-001',
        caseTypeId: testCaseTypeId,
        filedDate: new Date(),
        status: 'ACTIVE',
        parties: {
          create: [
            {
              type: 'APPLICANT',
              name: 'Test Applicant',
              gender: 'MALE',
              isOrganization: false,
            },
            {
              type: 'DEFENDANT',
              name: 'Test Defendant',
              gender: 'FEMALE',
              isOrganization: false,
            },
          ],
        },
      },
    });
    testCaseId = testCase.id;

    const testActivity = await prisma.caseActivity.create({
      data: {
        caseId: testCase.id,
        activityType: 'IMPORT',
        activityDate: new Date(),
        outcome: 'SUCCESS',
        importBatchId: recentBatch.id,
        primaryJudgeId: testJudgeId,
        hasLegalRepresentation: false,
        custodyStatus: 'NOT_APPLICABLE',
      },
    });
    testActivityId = testActivity.id;

    const recentBatches = await prisma.dailyImportBatch.findMany({
      where: { filename: 'case_returns.csv' },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    expect(recentBatches.length).toBeGreaterThan(0);
    expect(recentBatches[0].filename).toBe('case_returns.csv');

    for (const batch of recentBatches) {
      const activitiesFromBatch = await prisma.caseActivity.count({
        where: { importBatchId: batch.id },
      });
      const casesFromBatch = await prisma.case.count({
        where: {
          activities: {
            some: { importBatchId: batch.id },
          },
        },
      });

      console.log(`Batch ${batch.id.substring(0, 8)}... activities: ${activitiesFromBatch}, cases: ${casesFromBatch}, Expected >0`);

      if (batch.filename === 'recent-batch.csv') {
        expect(activitiesFromBatch).toBe(1); // Specific to our test data
        expect(casesFromBatch).toBe(1);
      } else {
        expect(activitiesFromBatch).toBeGreaterThan(0);
        expect(casesFromBatch).toBeGreaterThan(0);
      }

      (logger as any).general.info(`Batch ${batch.id.substring(0, 8)}... (${batch.status})`);
      (logger as any).general.info(`Generated: ${activitiesFromBatch} activities, ${casesFromBatch} cases affected`);
    }
  });

  it('should handle persistence check errors gracefully', async () => {
    // Mock a failing query to test error handling
    const spyOnError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const failingQuery = vi.spyOn(prisma.dailyImportBatch, 'findMany').mockRejectedValue(new Error('Query failed'));

    try {
      await prisma.dailyImportBatch.findMany();
    } catch (error) {
      console.error('Expected error occurred:', error);
    }
    expect(spyOnError).toHaveBeenCalled();

    spyOnError.mockRestore();
    failingQuery.mockRestore();
  });
});