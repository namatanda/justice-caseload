import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import logger from '../src/lib/logger';
import { execSync } from 'child_process';
import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';

// Test database configuration (SQLite)
const generateTestDatabaseUrl = () => {
  // Use a file-based SQLite DB for tests
  return 'file:./test.db';
};

// Global test database instance (optional)
let testPrisma: PrismaClient | null = null;
let testDatabaseUrl: string | null = null;

// Only enable the test DB when the env var USE_TEST_DB=1 is set. This allows
// fast unit tests that don't need a DB to run without initializing Prisma
// (which otherwise is generated for the Postgres schema and will error when
// pointed at SQLite). To run the full suite with the SQLite test DB, set
// USE_TEST_DB=1 in your environment before running tests.
const shouldUseTestDb = process.env.USE_TEST_DB === '1';
console.log(`[TEST SETUP] USE_TEST_DB enabled: ${shouldUseTestDb}, DATABASE_URL: ${process.env.DATABASE_URL || 'NOT SET'}`);

// Setup before all tests
beforeAll(async () => {
  console.log('[TEST SETUP] Initializing test DB...');
  if (!shouldUseTestDb) {
    console.warn('[TEST SETUP] Test DB disabled - using main DB, which may cause issues for integration tests');
    return;
  }

  // Generate SQLite test database URL
  testDatabaseUrl = generateTestDatabaseUrl();

  // Use pre-generated test client from schema.test.prisma generator block
  const testClientPath = '../prisma/prisma/test-client';
  logger.info('general', 'Using test Prisma client from', testClientPath);
  const { PrismaClient: TestPrismaClient } = require(testClientPath);
  testPrisma = new TestPrismaClient({
    datasources: {
      db: {
        url: testDatabaseUrl,
      },
    },
  });

  // Run migrations (db push for SQLite using test schema)
  try {
    console.log('[TEST SETUP] Running db push for test schema...');
    execSync('npx prisma db push --skip-generate --accept-data-loss --schema=prisma/schema.test.prisma', {
      env: { ...process.env, DATABASE_URL: testDatabaseUrl },
      stdio: 'inherit', // Show output for debugging
    });
    console.log('[TEST SETUP] db push completed successfully');
  } catch (error) {
    console.error('[TEST SETUP] Failed to run db push:', (error as Error).message);
    logger.error('general', 'Failed to run migrations for SQLite test database', error);
    throw error;
  }
}, 60000);

// Cleanup after all tests
afterAll(async () => {
  if (testPrisma) {
    await testPrisma.$disconnect();
  }
  // For SQLite, optionally delete the test.db file if you want a clean slate each run
  // const fs = require('fs');
  // try { fs.unlinkSync('./test.db'); } catch (e) {}
}, 30000);

// Clean up data before each test
beforeEach(async () => {
  if (!shouldUseTestDb || !testPrisma) return;

  // Clean up data in reverse dependency order
  // NOTE: Disabled for SQLite test schema compatibility - integration tests handle their own cleanup
  // await testPrisma.caseActivity.deleteMany({});
  // await testPrisma.caseJudgeAssignment.deleteMany({});
  // await testPrisma.case.deleteMany({});
  // await testPrisma.dailyImportBatch.deleteMany({});
  // await testPrisma.judge.deleteMany({});
  // await testPrisma.court.deleteMany({});
  // await testPrisma.caseType.deleteMany({});
  // await testPrisma.user.deleteMany({});
});

// Test utilities
export const testDb = () => {
  console.log('[TEST DB] Accessing test DB instance');
  if (!shouldUseTestDb || !testPrisma) {
    throw new Error('Test DB is not enabled. Set USE_TEST_DB=1 to enable the SQLite test DB for tests that require it.');
  }
  return testPrisma;
};

export const createTestUser = async () => {
  const db = testDb();
  return await db.user.create({
    data: {
      id: randomUUID(),
      email: `test${Date.now()}@example.com`,
      name: 'Test User',
      role: 'ADMIN',
    },
  });
};

export const createTestCourt = async () => {
  const db = testDb();
  return await db.court.create({
    data: {
      courtName: 'Test Court',
      courtCode: `TEST${Date.now()}`,
      courtType: 'HC' as const,
    },
  });
};

export const createTestJudge = async () => {
  const db = testDb();
  return await db.judge.create({
    data: {
      fullName: 'Test Judge',
      firstName: 'Test',
      lastName: 'Judge',
    },
  });
};

export const createTestCaseType = async () => {
  const db = testDb();
  return await db.caseType.create({
    data: {
      caseTypeName: 'Test Case Type',
      caseTypeCode: `TEST${Date.now()}`,
      description: 'Test case type for unit testing',
    },
  });
};

export const createTestCase = async (caseNumber?: string) => {
  const db = testDb();
  const user = await createTestUser();
  const caseType = await createTestCaseType();
  
  return await db.case.create({
    data: {
      caseNumber: caseNumber || `TEST-${Date.now()}`,
      courtName: 'Test Court',
      caseTypeId: caseType.id,
      filedDate: new Date(),
      parties: {
        applicants: { maleCount: 1, femaleCount: 0, organizationCount: 0 },
        defendants: { maleCount: 0, femaleCount: 1, organizationCount: 0 },
      },
      status: 'ACTIVE',
    },
  });
};

export const createTestImportBatch = async () => {
  const db = testDb();
  const user = await createTestUser();
  
  return await db.dailyImportBatch.create({
    data: {
      importDate: new Date(),
      filename: `test-${Date.now()}.csv`,
      fileSize: 1024,
      fileChecksum: randomUUID(),
      totalRecords: 0,
      successfulRecords: 0,
      failedRecords: 0,
      errorLogs: [],
      status: 'PENDING',
      createdBy: user.id,
    },
  });
};

export const createTestCaseActivity = async () => {
  const db = testDb();
  const testCase = await createTestCase();
  const judge = await createTestJudge();
  const importBatch = await createTestImportBatch();
  
  return await db.caseActivity.create({
    data: {
      caseId: testCase.id,
      activityDate: new Date(),
      activityType: 'Test Activity',
      outcome: 'Test Outcome',
      primaryJudgeId: judge.id,
      hasLegalRepresentation: false,
      custodyStatus: 'NOT_APPLICABLE',
      importBatchId: importBatch.id,
    },
  });
};

// Mock data generators
export const generateMockCsvRow = () => ({
  date_dd: 1,
  date_mon: 'Jan',
  date_yyyy: 2024,
  caseid_type: 'HCCC',
  caseid_no: `E${Date.now()}`,
  filed_dd: 1,
  filed_mon: 'Jan',
  filed_yyyy: 2024,
  court: 'Test High Court',
  original_court: '',
  original_code: '',
  original_number: '',
  original_year: 0,
  case_type: 'Civil Suit',
  judge_1: 'Test Judge',
  judge_2: '',
  judge_3: '',
  judge_4: '',
  judge_5: '',
  judge_6: '',
  judge_7: '',
  comingfor: 'Certificate of urgency',
  outcome: 'Certified Urgent',
  reason_adj: '',
  next_dd: 0,
  next_mon: '',
  next_yyyy: 0,
  male_applicant: 1,
  female_applicant: 0,
  organization_applicant: 0,
  male_defendant: 0,
  female_defendant: 1,
  organization_defendant: 0,
  legalrep: 'Yes' as const,
  applicant_witness: 0,
  defendant_witness: 0,
  custody: 0,
  other_details: '',
});

// Database assertion helpers
export const expectDatabaseToContain = async (
  table: string,
  conditions: Record<string, any>
) => {
  const result = await (testPrisma as any)[table].findFirst({
    where: conditions,
  });
  return result;
};

export const expectDatabaseCount = async (
  table: string,
  expectedCount: number
) => {
  const count = await (testPrisma as any)[table].count();
  return count === expectedCount;
};