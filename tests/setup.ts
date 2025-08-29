import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';

// Test database configuration
const generateTestDatabaseUrl = () => {
  const testDbName = `test_justice_caseload_${randomUUID().replace(/-/g, '_')}`;
  const baseUrl = process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432';
  return baseUrl.replace(/\/\w+(\?.*)?$/, `/${testDbName}$1`);
};

// Global test database instance
let testPrisma: PrismaClient;
let testDatabaseUrl: string;

// Setup before all tests
beforeAll(async () => {
  // Generate unique test database URL
  testDatabaseUrl = generateTestDatabaseUrl();
  
  // Create test database
  const dbName = testDatabaseUrl.split('/').pop()?.split('?')[0];
  const baseUrl = testDatabaseUrl.replace(/\/[^/]+(\?.*)?$/, '/postgres$1');
  
  try {
    // Create the test database
    execSync(`createdb "${dbName}"`, { stdio: 'ignore' });
  } catch (error) {
    // Database might already exist, which is fine
    console.warn(`Database ${dbName} might already exist`);
  }
  
  // Initialize Prisma client with test database
  testPrisma = new PrismaClient({
    datasources: {
      db: {
        url: testDatabaseUrl,
      },
    },
  });
  
  // Run migrations
  try {
    execSync('npx prisma db push --skip-generate', {
      env: { ...process.env, DATABASE_URL: testDatabaseUrl },
      stdio: 'pipe',
    });
  } catch (error) {
    console.error('Failed to run migrations for test database:', error);
    throw error;
  }
}, 60000);

// Cleanup after all tests
afterAll(async () => {
  if (testPrisma) {
    await testPrisma.$disconnect();
  }
  
  // Drop test database
  const dbName = testDatabaseUrl.split('/').pop()?.split('?')[0];
  try {
    execSync(`dropdb "${dbName}"`, { stdio: 'ignore' });
  } catch (error) {
    console.warn(`Failed to drop test database ${dbName}:`, error);
  }
}, 30000);

// Clean up data before each test
beforeEach(async () => {
  if (testPrisma) {
    // Clean up data in reverse dependency order
    await testPrisma.caseActivity.deleteMany({});
    await testPrisma.caseJudgeAssignment.deleteMany({});
    await testPrisma.case.deleteMany({});
    await testPrisma.dailyImportBatch.deleteMany({});
    await testPrisma.judge.deleteMany({});
    await testPrisma.court.deleteMany({});
    await testPrisma.caseType.deleteMany({});
    await testPrisma.user.deleteMany({});
  }
});

// Test utilities
export const testDb = () => testPrisma;

export const createTestUser = async () => {
  return await testPrisma.user.create({
    data: {
      id: randomUUID(),
      email: `test${Date.now()}@example.com`,
      name: 'Test User',
      role: 'ADMIN',
    },
  });
};

export const createTestCourt = async () => {
  return await testPrisma.court.create({
    data: {
      courtName: 'Test Court',
      courtCode: `TEST${Date.now()}`,
      courtType: 'HIGH_COURT',
    },
  });
};

export const createTestJudge = async () => {
  return await testPrisma.judge.create({
    data: {
      fullName: 'Test Judge',
      firstName: 'Test',
      lastName: 'Judge',
    },
  });
};

export const createTestCaseType = async () => {
  return await testPrisma.caseType.create({
    data: {
      caseTypeName: 'Test Case Type',
      caseTypeCode: `TEST${Date.now()}`,
      description: 'Test case type for unit testing',
    },
  });
};

export const createTestCase = async (caseNumber?: string) => {
  const user = await createTestUser();
  const caseType = await createTestCaseType();
  
  return await testPrisma.case.create({
    data: {
      caseNumber: caseNumber || `TEST-${Date.now()}`,
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
  const user = await createTestUser();
  
  return await testPrisma.dailyImportBatch.create({
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
  const testCase = await createTestCase();
  const judge = await createTestJudge();
  const importBatch = await createTestImportBatch();
  
  return await testPrisma.caseActivity.create({
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