/**
 * Complete Workflow Integration Tests
 * 
 * Tests the entire CSV import workflow from file upload to database persistence,
 * verifying all modules work together correctly and maintain data integrity.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { importService } from '@/lib/csv/import-service';
import { testDb, createTestUser } from '../../setup';

// Mock external dependencies
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

describe('Complete Workflow Integration Tests', () => {
  let tempDir: string;
  let tempFiles: string[] = [];
  let testUserId: string;

  beforeEach(async () => {
    // Set up test environment
    process.env.USE_TEST_DB = '1';
    
    // Clean up database
    const db = testDb();
    await db.caseActivity.deleteMany({});
    await db.case.deleteMany({});
    await db.dailyImportBatch.deleteMany({});
    await db.user.deleteMany({});
    
    // Create test user
    const testUser = await createTestUser();
    testUserId = testUser.id;
    
    // Create temp directory for test files
    tempDir = await fs.mkdtemp(join(tmpdir(), 'csv-integration-test-'));
  });

  afterEach(async () => {
    // Clean up temp files
    for (const file of tempFiles) {
      try {
        await fs.unlink(file);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    tempFiles = [];
    
    try {
      await fs.rmdir(tempDir);
    } catch (error) {
      // Ignore cleanup errors
    }

    // Clean up database
    const db = testDb();
    await db.caseActivity.deleteMany({});
    await db.case.deleteMany({});
    await db.dailyImportBatch.deleteMany({});
    await db.user.deleteMany({});
  });

  const createTestCsvFile = async (content: string): Promise<string> => {
    const filePath = join(tempDir, `test-${Date.now()}.csv`);
    await fs.writeFile(filePath, content, 'utf8');
    tempFiles.push(filePath);
    return filePath;
  };

  describe('End-to-End Import Workflow', () => {
    it('should complete full import workflow with valid data', async () => {
      // Create test CSV with valid data
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Test case details
NAIROBI HIGH COURT,16,JAN,2024,HCCC,E124,11,JAN,2024,,,,,CRIMINAL CASE,JUDGE BROWN,,,,,,,HEARING,CONTINUED,PENDING EVIDENCE,25,FEB,2024,0,1,0,1,1,0,NO,2,1,1,Another test case`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      // Step 1: Initiate import
      const initiationResult = await importService.initiateImport(
        filePath,
        'test-import.csv',
        fileStats.size,
        testUserId
      );

      expect(initiationResult.success).toBe(true);
      expect(initiationResult.batchId).toBeDefined();

      // Verify batch was created
      const db = testDb();
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: initiationResult.batchId }
      });

      expect(batch).toBeDefined();
      expect(batch?.filename).toBe('test-import.csv');
      expect(batch?.status).toBe('PENDING');

      // Step 2: Process import
      const jobData = {
        filePath,
        filename: 'test-import.csv',
        fileSize: fileStats.size,
        checksum: 'test-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      // Step 3: Verify results
      const updatedBatch = await db.dailyImportBatch.findUnique({
        where: { id: initiationResult.batchId }
      });

      expect(updatedBatch?.status).toBe('COMPLETED');
      expect(updatedBatch?.totalRecords).toBe(2);
      expect(updatedBatch?.successfulRecords).toBe(2);
      expect(updatedBatch?.failedRecords).toBe(0);

      // Verify cases were created
      const cases = await db.case.findMany({});
      expect(cases).toHaveLength(2);

      // Verify activities were created
      const activities = await db.caseActivity.findMany({
        where: { importBatchId: initiationResult.batchId }
      });
      expect(activities).toHaveLength(2);

      // Step 4: Check import status
      const status = await importService.getImportStatus(initiationResult.batchId);
      expect(status.status).toBe('COMPLETED');

      // Step 5: Check import history
      const history = await importService.getImportHistory(10);
      expect(history).toHaveLength(1);
      expect(history[0].id).toBe(initiationResult.batchId);
    }, 60000);

    it('should handle mixed valid and invalid data correctly', async () => {
      // Create CSV with mixed valid/invalid data
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Valid case
INVALID COURT,INVALID,JAN,2024,INVALID,E124,11,JAN,2024,,,,,CRIMINAL CASE,JUDGE BROWN,,,,,,,HEARING,CONTINUED,PENDING EVIDENCE,25,FEB,2024,INVALID,1,0,1,1,0,NO,2,1,1,Invalid case with bad data
NAIROBI HIGH COURT,17,JAN,2024,HCCC,E125,12,JAN,2024,,,,,CIVIL SUIT,JUDGE JONES,,,,,,,MENTION,COMPLETED,,,,1,0,0,0,1,0,YES,1,0,0,Another valid case`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      // Initiate and process import
      const initiationResult = await importService.initiateImport(
        filePath,
        'mixed-data.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'mixed-data.csv',
        fileSize: fileStats.size,
        checksum: 'test-checksum-mixed',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      // Verify results
      const db = testDb();
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: initiationResult.batchId }
      });

      expect(batch?.status).toBe('COMPLETED');
      expect(batch?.totalRecords).toBe(3);
      expect(batch?.successfulRecords).toBe(2); // Only valid records
      expect(batch?.failedRecords).toBe(1); // Invalid record
      expect(batch?.errorLogs).toBeDefined();

      // Verify only valid cases were created
      const cases = await db.case.findMany({});
      expect(cases).toHaveLength(2);

      const activities = await db.caseActivity.findMany({
        where: { importBatchId: initiationResult.batchId }
      });
      expect(activities).toHaveLength(2);
    }, 60000);

    it('should handle dry-run mode correctly', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Dry run test`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'dry-run-test.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'dry-run-test.csv',
        fileSize: fileStats.size,
        checksum: 'test-checksum-dry',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      // Process in dry-run mode
      await importService.processImport(jobData, { dryRun: true });

      // Verify no data was persisted
      const db = testDb();
      const cases = await db.case.findMany({});
      expect(cases).toHaveLength(0);

      const activities = await db.caseActivity.findMany({});
      expect(activities).toHaveLength(0);

      // Batch should still be in PENDING status for dry runs
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: initiationResult.batchId }
      });
      expect(batch?.status).toBe('PENDING');
    }, 60000);

    it('should detect and prevent duplicate imports', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Duplicate test`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      // First import
      const firstResult = await importService.initiateImport(
        filePath,
        'duplicate-test.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'duplicate-test.csv',
        fileSize: fileStats.size,
        checksum: 'duplicate-checksum',
        batchId: firstResult.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      // Mark first import as completed
      const db = testDb();
      await db.dailyImportBatch.update({
        where: { id: firstResult.batchId },
        data: { 
          status: 'COMPLETED',
          successfulRecords: 1
        }
      });

      // Second import with same content should be detected as duplicate
      const secondResult = await importService.initiateImport(
        filePath,
        'duplicate-test-2.csv',
        fileStats.size,
        testUserId
      );

      expect(secondResult.success).toBe(false);
      expect(secondResult.error).toContain('already been imported');
    }, 60000);
  });

  describe('Error Recovery and Resilience', () => {
    it('should handle file system errors gracefully', async () => {
      const nonExistentFile = join(tempDir, 'non-existent.csv');

      const result = await importService.initiateImport(
        nonExistentFile,
        'non-existent.csv',
        1000,
        testUserId
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle corrupted CSV files gracefully', async () => {
      // Create a corrupted CSV file
      const corruptedContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123
INCOMPLETE ROW,15,JAN
ANOTHER INCOMPLETE`;

      const filePath = await createTestCsvFile(corruptedContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'corrupted.csv',
        fileStats.size,
        testUserId
      );

      expect(initiationResult.success).toBe(true);

      const jobData = {
        filePath,
        filename: 'corrupted.csv',
        fileSize: fileStats.size,
        checksum: 'corrupted-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      // Should not throw, but handle errors gracefully
      await expect(importService.processImport(jobData, { dryRun: false }))
        .resolves.not.toThrow();

      // Verify error handling
      const db = testDb();
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: initiationResult.batchId }
      });

      // Should complete with errors logged
      expect(batch?.status).toBe('COMPLETED');
      expect(batch?.failedRecords).toBeGreaterThan(0);
    }, 60000);

    it('should handle database constraint violations gracefully', async () => {
      // Create CSV with duplicate case numbers
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,First case
NAIROBI HIGH COURT,16,JAN,2024,HCCC,E123,11,JAN,2024,,,,,CRIMINAL CASE,JUDGE BROWN,,,,,,,HEARING,CONTINUED,PENDING EVIDENCE,25,FEB,2024,0,1,0,1,1,0,NO,2,1,1,Duplicate case number`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'constraint-test.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'constraint-test.csv',
        fileSize: fileStats.size,
        checksum: 'constraint-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      // Should handle constraint violations gracefully
      const db = testDb();
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: initiationResult.batchId }
      });

      expect(batch?.status).toBe('COMPLETED');
      // Should have processed both rows, with the second one updating the first
      expect(batch?.totalRecords).toBe(2);
    }, 60000);
  });
});