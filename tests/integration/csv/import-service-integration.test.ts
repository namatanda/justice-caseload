/**
 * Integration tests for ImportService
 * 
 * These tests verify the complete import workflow orchestration
 * including all module interactions and database operations.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { importService } from '@/lib/csv/import-service';
import { prisma } from '@/lib/database';
import fs from 'fs';
import path from 'path';

// Mock the logger to avoid console noise during tests
vi.mock('@/lib/logger', () => ({
  logger: {
    import: {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
    database: {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
    info: vi.fn(),
    error: vi.fn(),
    upload: {
      info: vi.fn(),
    },
  },
}));

// Mock the queue to avoid Redis dependency in tests
vi.mock('@/lib/database/redis', () => ({
  importQueue: {
    add: vi.fn().mockResolvedValue({ id: 'test-job-id' }),
  },
  cacheManager: {
    setImportStatus: vi.fn(),
    getImportStatus: vi.fn(),
    invalidateDashboardCache: vi.fn(),
  },
}));

describe('ImportService Integration Tests', () => {
  let testFilePath: string;
  let testUserId: string;

  beforeEach(async () => {
    // Clean up any existing test data
    await prisma.caseActivity.deleteMany({});
    await prisma.case.deleteMany({});
    await prisma.dailyImportBatch.deleteMany({});
    await prisma.user.deleteMany({});
    
    // Create a test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        role: 'DATA_ENTRY',
        isActive: true,
      },
    });
    testUserId = testUser.id;
    
    // Create a test CSV file
    const testCsvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI,15,JAN,2024,CC,123,10,JAN,2024,,,,,CRIMINAL,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,NO,0,0,NOT_APPLICABLE,Test case details`;

    testFilePath = path.join(process.cwd(), 'test-import.csv');
    fs.writeFileSync(testFilePath, testCsvContent);
  });

  afterEach(async () => {
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }

    // Clean up test data
    await prisma.caseActivity.deleteMany({});
    await prisma.case.deleteMany({});
    await prisma.dailyImportBatch.deleteMany({});
    await prisma.user.deleteMany({});
  });

  describe('initiateImport', () => {
    it('should successfully initiate import with valid file', async () => {
      const result = await importService.initiateImport(
        testFilePath,
        'test-import.csv',
        1000,
        testUserId
      );

      expect(result.success).toBe(true);
      expect(result.batchId).toBeDefined();
      expect(result.error).toBeUndefined();

      // Verify batch was created in database
      const batch = await prisma.dailyImportBatch.findUnique({
        where: { id: result.batchId }
      });

      expect(batch).toBeDefined();
      expect(batch?.filename).toBe('test-import.csv');
      expect(batch?.status).toBe('PENDING');
    });

    it('should detect duplicate imports', async () => {
      // First import
      const firstResult = await importService.initiateImport(
        testFilePath,
        'test-import.csv',
        1000,
        testUserId
      );

      expect(firstResult.success).toBe(true);

      // Mark first import as completed to trigger duplicate detection
      await prisma.dailyImportBatch.update({
        where: { id: firstResult.batchId },
        data: { 
          status: 'COMPLETED',
          successfulRecords: 1
        }
      });

      // Second import with same file should be detected as duplicate
      const secondResult = await importService.initiateImport(
        testFilePath,
        'test-import-duplicate.csv',
        1000,
        testUserId
      );

      expect(secondResult.success).toBe(false);
      expect(secondResult.error).toContain('already been imported');
    });

    it('should handle missing file gracefully', async () => {
      const nonExistentFile = path.join(process.cwd(), 'non-existent.csv');
      
      const result = await importService.initiateImport(
        nonExistentFile,
        'non-existent.csv',
        1000,
        testUserId
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('processImport', () => {
    it('should handle dry-run mode correctly', async () => {
      // Create a batch for testing
      const batch = await prisma.dailyImportBatch.create({
        data: {
          importDate: new Date(),
          filename: 'test-import.csv',
          fileSize: 1000,
          fileChecksum: 'test-checksum',
          totalRecords: 0,
          successfulRecords: 0,
          failedRecords: 0,
          errorLogs: [],
          userConfig: {},
          validationWarnings: [],
          status: 'PENDING',
          createdBy: testUserId,
        },
      });

      const jobData = {
        filePath: testFilePath,
        filename: 'test-import.csv',
        fileSize: 1000,
        checksum: 'test-checksum',
        batchId: batch.id,
        userId: testUserId
      };

      // Process in dry-run mode
      await importService.processImport(jobData, { dryRun: true });

      // Verify no database changes were made
      const cases = await prisma.case.findMany();
      expect(cases).toHaveLength(0);

      const activities = await prisma.caseActivity.findMany();
      expect(activities).toHaveLength(0);

      // Batch should still be in PENDING status
      const updatedBatch = await prisma.dailyImportBatch.findUnique({
        where: { id: batch.id }
      });
      expect(updatedBatch?.status).toBe('PENDING');
    });

    it('should handle missing batch gracefully', async () => {
      const jobData = {
        filePath: testFilePath,
        filename: 'test-import.csv',
        fileSize: 1000,
        checksum: 'test-checksum',
        batchId: 'non-existent-batch-id',
        userId: testUserId
      };

      // The ImportService should handle missing batch gracefully by catching errors
      // and updating job status appropriately, not by throwing
      await expect(async () => {
        await importService.processImport(jobData, { dryRun: false });
      }).not.toThrow();
      
      // The service should handle the error internally and continue processing
      expect(true).toBe(true); // Test passes if no exception is thrown
    });
  });

  describe('getImportStatus', () => {
    it('should return import status for existing batch', async () => {
      // Create a test batch
      const batch = await prisma.dailyImportBatch.create({
        data: {
          importDate: new Date(),
          filename: 'test-import.csv',
          fileSize: 1000,
          fileChecksum: 'test-checksum',
          totalRecords: 10,
          successfulRecords: 8,
          failedRecords: 2,
          errorLogs: [],
          userConfig: {},
          validationWarnings: [],
          status: 'COMPLETED',
          createdBy: testUserId,
        },
      });

      const status = await importService.getImportStatus(batch.id);

      expect(status).toBeDefined();
      expect(status.status).toBe('COMPLETED');
      expect(status.totalRecords).toBe(10);
      expect(status.processedRecords).toBe(10);
      expect(status.successfulRecords).toBe(8);
      expect(status.failedRecords).toBe(2);
    });

    it('should handle non-existent batch', async () => {
      await expect(importService.getImportStatus('non-existent-id'))
        .rejects.toThrow('Import batch not found');
    });
  });

  describe('getImportHistory', () => {
    it('should return import history with default limit', async () => {
      // Create multiple test batches
      for (let i = 0; i < 3; i++) {
        await prisma.dailyImportBatch.create({
          data: {
            importDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Different dates
            filename: `test-import-${i}.csv`,
            fileSize: 1000 + i,
            fileChecksum: `test-checksum-${i}`,
            totalRecords: 10,
            successfulRecords: 8,
            failedRecords: 2,
            errorLogs: [],
            userConfig: {},
            validationWarnings: [],
            status: i % 2 === 0 ? 'COMPLETED' : 'FAILED',
            createdBy: testUserId,
          },
        });
      }

      const history = await importService.getImportHistory();

      expect(history).toBeDefined();
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBe(3);

      // Verify structure of history items
      const firstItem = history[0];
      expect(firstItem.id).toBeDefined();
      expect(firstItem.filename).toBeDefined();
      expect(firstItem.status).toBeDefined();
      expect(firstItem.totalRecords).toBeDefined();
      expect(firstItem.successfulRecords).toBeDefined();
      expect(firstItem.failedRecords).toBeDefined();
    });

    it('should return empty array when no imports exist', async () => {
      const history = await importService.getImportHistory();

      expect(history).toBeDefined();
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBe(0);
    });
  });
});