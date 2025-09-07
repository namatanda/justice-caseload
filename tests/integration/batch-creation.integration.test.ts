import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { prisma } from '../../src/lib/database';
import { Prisma } from '@prisma/client';
import { getOrCreateSystemUser } from '../../src/lib/import/csv-processor';
import { testDb } from '../setup';

console.log('[BATCH TEST] Using main prisma or testDb? Attempting to use testDb');

describe('Batch Creation Integration Tests', () => {
  let userId: string;
  let batchId: string;

  
    beforeAll(async () => {
      console.log('[BATCH TEST] beforeAll - checking env');
      // Ensure test environment is set
      if (!process.env.DATABASE_URL?.includes('test')) {
        console.warn('⚠️  Running against non-test database; set DATABASE_URL for isolation');
      }
      
      const dbClient = process.env.USE_TEST_DB === '1' ? testDb() : prisma;
      
      // Create system user in test context
      try {
        const systemUser = await dbClient.user.upsert({
          where: { email: 'system@justice.go.ke' },
          update: {},
          create: {
            email: 'system@justice.go.ke',
            name: 'System User',
            role: 'ADMIN',
            isActive: true,
          },
        });
        userId = systemUser.id;
        console.log('[BATCH TEST] System user created with ID:', userId);
      } catch (error) {
        console.error('[BATCH TEST] Failed to create system user:', error);
        throw error;
      }
      expect(userId).toBeDefined();
      expect(typeof userId).toBe('string');
    });
  afterEach(async () => {
    // Cleanup any created batches after each test to maintain isolation
    // Safe cleanup of test batches to avoid P2025 errors
    try {
      await (process.env.USE_TEST_DB === '1' ? testDb() : prisma).dailyImportBatch.deleteMany({
        where: { filename: { startsWith: 'test-' } }
      });
    } catch (error) {
      // Ignore cleanup errors
    }
    if (batchId) {
      try {
        await (process.env.USE_TEST_DB === '1' ? testDb() : prisma).dailyImportBatch.delete({ where: { id: batchId } });
      } catch (error) {
        // Ignore if not found
      }
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a batch successfully', async () => {
    const batchData = {
      importDate: new Date(),
      filename: 'test-batch.csv',
      fileSize: 1024,
      fileChecksum: `test-checksum-${Date.now()}`,
      totalRecords: 0,
      successfulRecords: 0,
      failedRecords: 0,
      errorLogs: [],
      status: 'PENDING' as const,
      createdBy: userId,
    };

    const batch = await (process.env.USE_TEST_DB === '1' ? testDb() : prisma).dailyImportBatch.create({
      data: {
        ...batchData,
        userConfig: Prisma.JsonNull,
        validationWarnings: Prisma.JsonNull,
      },
    });

    expect(batch).toBeDefined();
    expect(batch.id).toBeDefined();
    expect(batch.filename).toBe('test-batch.csv');
    expect(batch.status).toBe('PENDING');
    expect(batch.createdBy).toBe(userId);
    expect(batch.totalRecords).toBe(0);

    batchId = batch.id; // For cleanup
  });

  it('should persist the batch after creation', async () => {
    const batchData = {
      importDate: new Date(),
      filename: 'persistence-test.csv',
      fileSize: 1024,
      fileChecksum: `persistence-checksum-${Date.now()}`,
      totalRecords: 0,
      successfulRecords: 0,
      failedRecords: 0,
      errorLogs: [],
      status: 'PENDING' as const,
      createdBy: userId,
    };

    const batch = await (process.env.USE_TEST_DB === '1' ? testDb() : prisma).dailyImportBatch.create({
      data: {
        ...batchData,
        userConfig: Prisma.JsonNull,
        validationWarnings: Prisma.JsonNull,
      },
    });

    batchId = batch.id;

    // Simulate time passing for persistence check (minimal delay)
    await new Promise(resolve => setTimeout(resolve, 100));

    const foundBatch = await (process.env.USE_TEST_DB === '1' ? testDb() : prisma).dailyImportBatch.findUnique({
      where: { id: batch.id },
    });

    expect(foundBatch).toBeDefined();
    expect(foundBatch!.id).toBe(batch.id);
    expect(foundBatch!.filename).toBe('persistence-test.csv');
    expect(foundBatch!.status).toBe('PENDING');
  });

  it('should track changes in database counts after batch creation', async () => {
    const initialCounts = {
      users: await (process.env.USE_TEST_DB === '1' ? testDb() : prisma).user.count(),
      batches: await (process.env.USE_TEST_DB === '1' ? testDb() : prisma).dailyImportBatch.count(),
      cases: await (process.env.USE_TEST_DB === '1' ? testDb() : prisma).case.count(),
      activities: await (process.env.USE_TEST_DB === '1' ? testDb() : prisma).caseActivity.count(),
    };

    const batchData = {
      importDate: new Date(),
      filename: 'counts-test.csv',
      fileSize: 1024,
      fileChecksum: `counts-checksum-${Date.now()}`,
      totalRecords: 0,
      successfulRecords: 0,
      failedRecords: 0,
      errorLogs: [],
      status: 'PENDING' as const,
      createdBy: userId,
    };

    await (process.env.USE_TEST_DB === '1' ? testDb() : prisma).dailyImportBatch.create({
      data: {
        ...batchData,
        userConfig: Prisma.JsonNull,
        validationWarnings: Prisma.JsonNull,
      },
    });

    const finalCounts = {
      users: await (process.env.USE_TEST_DB === '1' ? testDb() : prisma).user.count(),
      batches: await (process.env.USE_TEST_DB === '1' ? testDb() : prisma).dailyImportBatch.count(),
      cases: await (process.env.USE_TEST_DB === '1' ? testDb() : prisma).case.count(),
      activities: await (process.env.USE_TEST_DB === '1' ? testDb() : prisma).caseActivity.count(),
    };

    expect(finalCounts.batches).toBe(initialCounts.batches + 1);
    expect(finalCounts.users).toBe(initialCounts.users); // User already exists
    expect(finalCounts.cases).toBe(initialCounts.cases); // No cases created
    expect(finalCounts.activities).toBe(initialCounts.activities); // No activities created
  });

  it('should handle batch creation errors gracefully', async () => {
    // Test invalid data to trigger error
    const invalidBatchData = {
      importDate: new Date(),
      filename: '', // Invalid: filename required
      fileSize: 1024,
      fileChecksum: `invalid-checksum-${Date.now()}`,
      totalRecords: 0,
      successfulRecords: 0,
      failedRecords: 0,
      errorLogs: [],
      status: 'PENDING' as const,
      createdBy: userId,
    };

    const testPrisma = process.env.USE_TEST_DB === '1' ? testDb() : prisma;
    await expect(
      testPrisma.dailyImportBatch.create({
        data: invalidBatchData,
      })
    ).rejects.toThrow(); // Expect validation error
  });
});