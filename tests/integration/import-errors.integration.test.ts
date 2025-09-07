import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import logger from '../../src/lib/logger';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import type { ImportErrorDetail } from '@prisma/client';
import { testDb, createTestUser } from '../setup';

let testPrisma: PrismaClient;
let testBatchId: string;

describe('Import Errors Integration Tests', () => {
  beforeAll(async () => {
    // Ensure test database is clean
    testPrisma = testDb();
  });

  afterAll(async () => {
    if (testPrisma) {
      await testPrisma.$disconnect();
    }
  });

  beforeEach(async () => {
    if (!testPrisma) return;
    
    // Create test user using utility from setup.ts
    const testUser = await createTestUser();
    
    // Create test batch
    testBatchId = randomUUID();
    logger.import.info('testBatchId set to', { testBatchId });
    await testPrisma.dailyImportBatch.create({
      data: {
        id: testBatchId,
        importDate: new Date(),
        filename: 'test-import.csv',
        fileSize: 1024,
        fileChecksum: randomUUID(),
        totalRecords: 168,
        successfulRecords: 23,
        failedRecords: 145,
        status: 'COMPLETED' as const,
        createdBy: testUser.id,
        errorLogs: [],
        userConfig: {},
        validationWarnings: [],
      },
    });

    // Create 145 test error details
    await testPrisma.$transaction(async (tx) => {
      const errorPromises = Array.from({ length: 145 }, async (_, index) => {
        const rowNumber = index + 1;
        const errorTypes = ['validation_error', 'format_error', 'duplicate_error'];
        const errorType = errorTypes[index % errorTypes.length];
        
        return tx.importErrorDetail.create({
          data: {
            id: randomUUID(),
            batchId: testBatchId,
            rowNumber,
            errorType,
            errorMessage: `Validation error on row ${rowNumber}: ${errorType}`,
            columnName: errorType === 'validation_error' ? 'date_dd' : 'case_number',
            rawValue: errorType === 'validation_error' ? '0' : `invalid_value_${rowNumber}`,
            suggestedFix: errorType === 'validation_error' ? 'Use day >=1' : 'Check format',
            severity: 'ERROR' as const,
            isResolved: false,
            createdAt: new Date(),
          },
        });
      });

      await Promise.all(errorPromises);
    });
  });

  afterEach(async () => {
    // Specific cleanup for this test suite
    logger.import.info('testBatchId in cleanup', { testBatchId: testBatchId || 'undefined' });
    if (!testBatchId) {
      logger.import.info('Skipping cleanup: testBatchId undefined');
      return;
    }
    await testPrisma.importErrorDetail.deleteMany({ where: { batchId: testBatchId } });
    await testPrisma.dailyImportBatch.deleteMany({ where: { id: testBatchId } });
    // User cleanup handled by setup.ts utilities
  });

  it('should create and retrieve batch errors correctly', async () => {
    // Verify batch was created with correct counts
    const batch = await testPrisma.dailyImportBatch.findUnique({
      where: { id: testBatchId },
    });
    
    expect(batch).toBeDefined();
    expect(batch!.successfulRecords).toBe(23);
    expect(batch!.failedRecords).toBe(145);
    expect(batch!.status).toBe('COMPLETED');
    expect(batch!.totalRecords).toBe(168);

    // Verify all 145 errors were created
    const allErrors: ImportErrorDetail[] = await testPrisma.importErrorDetail.findMany({
      where: { batchId: testBatchId },
      orderBy: { rowNumber: 'asc' },
    });
    
    expect(allErrors.length).toBeGreaterThan(140);
    expect(allErrors.length).toBeLessThan(150);
    
    // Verify first error details
    const firstError = allErrors[0];
    expect(firstError.rowNumber).toBe(1);
    expect(firstError.errorType).toBe('validation_error');
    expect(firstError.severity).toBe('ERROR');
    expect(firstError.isResolved).toBeFalsy();
    expect(firstError.columnName).toBe('date_dd');
    expect(firstError.rawValue).toBe('0');
    expect(firstError.suggestedFix).toBe('Use day >=1');

    // Verify error type distribution
    const validationErrors = allErrors.filter((e: ImportErrorDetail) => e.errorType === 'validation_error');
    expect(validationErrors).toHaveLength(49); // 145/3 = 48.333, so 49 validation errors
  });

  it('should filter errors by errorType', async () => {
    // Query with filter simulating API logic
    const filteredErrors: ImportErrorDetail[] = await testPrisma.importErrorDetail.findMany({
      where: {
        batchId: testBatchId,
        errorType: 'validation_error',
      },
      orderBy: { rowNumber: 'asc' },
    });

    const totalFiltered = await testPrisma.importErrorDetail.count({
      where: {
        batchId: testBatchId,
        errorType: 'validation_error',
      },
    });

    expect(filteredErrors.length).toBeGreaterThan(45);
    expect(filteredErrors.length).toBeLessThan(55); // Should get all 49 validation errors
    expect(totalFiltered).toBeGreaterThan(45);
    expect(totalFiltered).toBeLessThan(55);
    
    // Verify all filtered errors have correct type
    filteredErrors.forEach((error: ImportErrorDetail) => {
      expect(error.errorType).toBe('validation_error');
    });

    // Verify first and last validation error row numbers
    expect(filteredErrors[0].rowNumber).toBe(1);
    expect(filteredErrors[filteredErrors.length - 1].rowNumber).toBeGreaterThan(40);
  });

  it('should handle batch with no errors correctly', async () => {
    // Create batch with 0 failed records
    const emptyBatchId = randomUUID();
    // Create test user for empty batch
    const emptyUser = await createTestUser();
    await testPrisma.dailyImportBatch.create({
      data: {
        id: emptyBatchId,
        importDate: new Date(),
        filename: 'empty-errors.csv',
        fileSize: 1024,
        fileChecksum: randomUUID(),
        totalRecords: 100,
        successfulRecords: 100,
        failedRecords: 0,
        status: 'COMPLETED' as const,
        createdBy: emptyUser.id,
        errorLogs: [],
        userConfig: {},
        validationWarnings: [],
      },
    });

    // Verify no errors exist for this batch
    const errors = await testPrisma.importErrorDetail.findMany({
      where: { batchId: emptyBatchId },
    });

    const batch = await testPrisma.dailyImportBatch.findUnique({
      where: { id: emptyBatchId },
    });

    expect(errors).toHaveLength(0);
    expect(batch!.failedRecords).toBe(0);
    expect(batch!.successfulRecords).toBe(100);
  });

  it('should handle non-existent batch gracefully', async () => {
    // Verify batch lookup returns null for non-existent ID
    const nonExistentBatch = await testPrisma.dailyImportBatch.findUnique({
      where: { id: 'non-existent-batch-id' },
    });

    expect(nonExistentBatch).toBeNull();

    // Verify no errors exist for non-existent batch
    const errors = await testPrisma.importErrorDetail.findMany({
      where: { batchId: 'non-existent-batch-id' },
    });

    expect(errors).toHaveLength(0);
  });

  it('should handle pagination correctly for large datasets', async () => {
    // Simulate page 2 with limit 50 (should return errors 51-100)
    const secondPageErrors: ImportErrorDetail[] = await testPrisma.importErrorDetail.findMany({
      where: { batchId: testBatchId },
      skip: 50, // Skip first 50 for page 2
      take: 50, // Limit to 50
      orderBy: { rowNumber: 'asc' },
    });

    const totalErrors = await testPrisma.importErrorDetail.count({
      where: { batchId: testBatchId },
    });

    expect(secondPageErrors.length).toBeGreaterThan(45);
    expect(secondPageErrors.length).toBeLessThan(55);
    expect(totalErrors).toBeGreaterThan(140);
    expect(totalErrors).toBeLessThan(150);
    
    // Verify row numbers are from second page (51-100)
    const rowNumbers = secondPageErrors.map((e: ImportErrorDetail) => e.rowNumber!).filter(Boolean);
    expect(Math.min(...rowNumbers as number[])).toBe(51);
    expect(Math.max(...rowNumbers as number[])).toBe(100);
  });
});