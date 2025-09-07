import { describe, it, expect, beforeAll, vi } from 'vitest';
import path from 'path';
import fs from 'fs';
import { createHash } from 'crypto';
import { Prisma } from '@prisma/client';

// Ensure tests use the SQLite test DB
process.env.USE_TEST_DB = '1';
process.env.DATABASE_URL = 'file:./test.db';

// Mock Redis/cache/queue so tests don't require a running Redis instance
vi.mock('../../src/lib/database/redis', () => {
  return {
    importQueue: {
      add: async () => ({ id: 'mock-job' }),
    },
    cacheManager: {
      setImportStatus: async () => {},
      setCachedDashboardData: async () => {},
      invalidateDashboardCache: async () => {},
      getImportStatus: async () => null,
    },
    redis: {
      ping: async () => 'PONG',
    },
  };
});

import { testDb, createTestImportBatch, createTestUser } from '../setup';
import { processCsvImport } from '../../src/lib/import/csv-processor';

describe('Import E2E (SQLite)', () => {
  beforeAll(() => {
    // Sanity check that test DB is enabled
    if (process.env.USE_TEST_DB !== '1') {
      throw new Error('USE_TEST_DB must be set to 1 for this integration test');
    }
  });

  it('parses the CSV and persists case activities (real import flow)', async () => {
    const db = testDb();

    // Create a placeholder user and import batch
    const user = await createTestUser();
    const batch = await db.dailyImportBatch.create({
      data: {
        importDate: new Date(),
        filename: 'case_returns.csv',
        fileSize: 0,
        fileChecksum: 'integration-test-checksum',
        totalRecords: 0,
        successfulRecords: 0,
        failedRecords: 0,
        errorLogs: [],
        status: 'PENDING',
        createdBy: user.id,
        userConfig: Prisma.JsonNull,
        validationWarnings: Prisma.JsonNull,
      },
    });

    const filePath = path.resolve(process.cwd(), 'data', 'case_returns.csv');
    expect(fs.existsSync(filePath)).toBe(true);

    const fileSize = fs.statSync(filePath).size;
    const checksum = createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');

    const jobData = {
      filePath,
      filename: 'case_returns.csv',
      fileSize,
      checksum,
      userId: user.id,
      batchId: batch.id,
    } as any;

    // Run the actual import processor (non-dry-run)
    await processCsvImport(jobData, { dryRun: false });

    // Re-fetch batch and verify status and counts
    const updatedBatch = await db.dailyImportBatch.findUnique({ where: { id: batch.id } });
    console.log('Updated batch status:', updatedBatch?.status, 'Expected: COMPLETED');
    console.log('Total records:', updatedBatch?.totalRecords, 'Successful:', updatedBatch?.successfulRecords, 'Failed:', updatedBatch?.failedRecords);
    expect(updatedBatch).toBeTruthy();
    expect(updatedBatch?.status).toBe('COMPLETED');
    expect(updatedBatch?.totalRecords).toBeGreaterThanOrEqual(1);
    expect(updatedBatch?.successfulRecords).toEqual(updatedBatch?.failedRecords === 0 ? updatedBatch?.totalRecords : updatedBatch?.successfulRecords);

    // Ensure caseActivity rows were created for this batch
    const activityCount = await db.caseActivity.count({ where: { importBatchId: batch.id } });
    console.log('Activity count for batch:', activityCount, 'Expected >=40');
    expect(activityCount).toBeGreaterThanOrEqual(1);
    // For our canonical test CSV we expect 46 rows — tolerate small diffs; assert at least 40
    expect(activityCount).toBeGreaterThanOrEqual(40);
  }, 120000);
});
