/**
 * Job Processing Integration Tests
 * 
 * Tests job processing with actual queue operations, progress tracking,
 * and background job execution to ensure the job service works correctly
 * with the import workflow.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { importService } from '@/lib/csv/import-service';
import { jobService } from '@/lib/csv/job-service';
import { testDb, createTestUser } from '../../setup';

// Mock logger
const mockLogger = {
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
};

vi.mock('@/lib/logger', () => ({
  logger: mockLogger,
}));

// Mock Redis with more realistic behavior
const mockQueue = {
  add: vi.fn(),
  process: vi.fn(),
  getJob: vi.fn(),
  getJobs: vi.fn(),
};

const mockCacheManager = {
  setImportStatus: vi.fn(),
  getImportStatus: vi.fn(),
  invalidateDashboardCache: vi.fn(),
  setCachedDashboardData: vi.fn(),
};

vi.mock('@/lib/database/redis', () => ({
  importQueue: mockQueue,
  cacheManager: mockCacheManager,
}));

describe('Job Processing Integration Tests', () => {
  let tempDir: string;
  let tempFiles: string[] = [];
  let testUserId: string;

  beforeEach(async () => {
    process.env.USE_TEST_DB = '1';
    
    // Reset mocks
    vi.clearAllMocks();
    
    // Set up mock implementations
    mockQueue.add.mockResolvedValue({ id: 'test-job-id' });
    mockCacheManager.setImportStatus.mockResolvedValue(undefined);
    mockCacheManager.getImportStatus.mockResolvedValue(null);
    mockCacheManager.invalidateDashboardCache.mockResolvedValue(undefined);
    
    // Clean up database
    const db = testDb();
    await db.caseActivity.deleteMany({});
    await db.case.deleteMany({});
    await db.dailyImportBatch.deleteMany({});
    await db.user.deleteMany({});
    
    // Create test user
    const testUser = await createTestUser();
    testUserId = testUser.id;
    
    // Create temp directory
    tempDir = await fs.mkdtemp(join(tmpdir(), 'job-integration-test-'));
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

  describe('Job Queue Integration', () => {
    it('should add import jobs to queue correctly', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Queue test case`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const result = await importService.initiateImport(
        filePath,
        'queue-test.csv',
        fileStats.size,
        testUserId
      );

      expect(result.success).toBe(true);
      expect(mockQueue.add).toHaveBeenCalledWith(
        'process-csv-import',
        expect.objectContaining({
          filePath,
          filename: 'queue-test.csv',
          fileSize: fileStats.size,
          batchId: result.batchId,
          userId: testUserId
        }),
        expect.any(Object)
      );
    });

    it('should handle job processing with progress updates', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Progress test case 1
NAIROBI HIGH COURT,16,JAN,2024,HCCC,E124,11,JAN,2024,,,,,CRIMINAL CASE,JUDGE BROWN,,,,,,,HEARING,CONTINUED,PENDING EVIDENCE,25,FEB,2024,0,1,0,1,1,0,NO,2,1,1,Progress test case 2
NAIROBI HIGH COURT,17,JAN,2024,HCCC,E125,12,JAN,2024,,,,,CIVIL SUIT,JUDGE JONES,,,,,,,MENTION,COMPLETED,,,,1,0,0,0,1,0,YES,1,0,0,Progress test case 3`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'progress-test.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'progress-test.csv',
        fileSize: fileStats.size,
        checksum: 'progress-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      // Process the import
      await importService.processImport(jobData, { dryRun: false });

      // Verify progress updates were called
      expect(mockCacheManager.setImportStatus).toHaveBeenCalled();
      
      // Check that progress was updated multiple times during processing
      const progressCalls = mockCacheManager.setImportStatus.mock.calls;
      expect(progressCalls.length).toBeGreaterThan(0);
      
      // Verify the final progress update
      const finalCall = progressCalls[progressCalls.length - 1];
      expect(finalCall[0]).toBe(initiationResult.batchId);
      expect(finalCall[1]).toMatchObject({
        status: 'COMPLETED',
        progress: 100
      });
    });

    it('should handle job failures gracefully', async () => {
      // Create a CSV file that will cause processing errors
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
INVALID COURT,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,,,,,INVALID,INVALID,,,,,,,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,Invalid case`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'failure-test.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'failure-test.csv',
        fileSize: fileStats.size,
        checksum: 'failure-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      // Process should not throw, but handle errors gracefully
      await expect(importService.processImport(jobData, { dryRun: false }))
        .resolves.not.toThrow();

      // Verify error handling
      const db = testDb();
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: initiationResult.batchId }
      });

      expect(batch?.status).toBe('COMPLETED');
      expect(batch?.failedRecords).toBe(1);
      expect(batch?.successfulRecords).toBe(0);
    });

    it('should handle concurrent job processing', async () => {
      // Create multiple CSV files
      const csvContent1 = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Concurrent job 1`;

      const csvContent2 = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,16,JAN,2024,HCCC,E124,11,JAN,2024,,,,,CRIMINAL CASE,JUDGE BROWN,,,,,,,HEARING,CONTINUED,PENDING EVIDENCE,25,FEB,2024,0,1,0,1,1,0,NO,2,1,1,Concurrent job 2`;

      const filePath1 = await createTestCsvFile(csvContent1);
      const filePath2 = await createTestCsvFile(csvContent2);
      const fileStats1 = await fs.stat(filePath1);
      const fileStats2 = await fs.stat(filePath2);

      // Initiate both imports
      const [result1, result2] = await Promise.all([
        importService.initiateImport(filePath1, 'concurrent1.csv', fileStats1.size, testUserId),
        importService.initiateImport(filePath2, 'concurrent2.csv', fileStats2.size, testUserId)
      ]);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);

      // Verify both jobs were added to queue
      expect(mockQueue.add).toHaveBeenCalledTimes(2);

      const jobData1 = {
        filePath: filePath1,
        filename: 'concurrent1.csv',
        fileSize: fileStats1.size,
        checksum: 'concurrent-checksum-1',
        batchId: result1.batchId,
        userId: testUserId
      };

      const jobData2 = {
        filePath: filePath2,
        filename: 'concurrent2.csv',
        fileSize: fileStats2.size,
        checksum: 'concurrent-checksum-2',
        batchId: result2.batchId,
        userId: testUserId
      };

      // Process both jobs concurrently
      await Promise.all([
        importService.processImport(jobData1, { dryRun: false }),
        importService.processImport(jobData2, { dryRun: false })
      ]);

      // Verify both completed successfully
      const db = testDb();
      const batch1 = await db.dailyImportBatch.findUnique({
        where: { id: result1.batchId }
      });
      const batch2 = await db.dailyImportBatch.findUnique({
        where: { id: result2.batchId }
      });

      expect(batch1?.status).toBe('COMPLETED');
      expect(batch2?.status).toBe('COMPLETED');
    });
  });

  describe('Progress Tracking', () => {
    it('should track progress accurately during processing', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Progress case 1
NAIROBI HIGH COURT,16,JAN,2024,HCCC,E124,11,JAN,2024,,,,,CRIMINAL CASE,JUDGE BROWN,,,,,,,HEARING,CONTINUED,PENDING EVIDENCE,25,FEB,2024,0,1,0,1,1,0,NO,2,1,1,Progress case 2
NAIROBI HIGH COURT,17,JAN,2024,HCCC,E125,12,JAN,2024,,,,,CIVIL SUIT,JUDGE JONES,,,,,,,MENTION,COMPLETED,,,,1,0,0,0,1,0,YES,1,0,0,Progress case 3
NAIROBI HIGH COURT,18,JAN,2024,HCCC,E126,13,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Progress case 4
NAIROBI HIGH COURT,19,JAN,2024,HCCC,E127,14,JAN,2024,,,,,CRIMINAL CASE,JUDGE BROWN,,,,,,,HEARING,CONTINUED,PENDING EVIDENCE,25,FEB,2024,0,1,0,1,1,0,NO,2,1,1,Progress case 5`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'progress-tracking.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'progress-tracking.csv',
        fileSize: fileStats.size,
        checksum: 'progress-tracking-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      // Verify progress tracking calls
      const progressCalls = mockCacheManager.setImportStatus.mock.calls;
      expect(progressCalls.length).toBeGreaterThan(0);

      // Check that progress increases over time
      const progressValues = progressCalls.map(call => call[1].progress);
      for (let i = 1; i < progressValues.length; i++) {
        expect(progressValues[i]).toBeGreaterThanOrEqual(progressValues[i - 1]);
      }

      // Final progress should be 100
      expect(progressValues[progressValues.length - 1]).toBe(100);
    });

    it('should update cache with import status', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Cache test case`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'cache-test.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'cache-test.csv',
        fileSize: fileStats.size,
        checksum: 'cache-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      // Verify cache operations
      expect(mockCacheManager.setImportStatus).toHaveBeenCalledWith(
        initiationResult.batchId,
        expect.objectContaining({
          status: expect.any(String),
          progress: expect.any(Number),
          message: expect.any(String)
        })
      );

      expect(mockCacheManager.invalidateDashboardCache).toHaveBeenCalled();
    });

    it('should handle progress updates for failed jobs', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Valid case
INVALID COURT,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,,,,,INVALID,INVALID,,,,,,,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,Invalid case`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'failed-progress.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'failed-progress.csv',
        fileSize: fileStats.size,
        checksum: 'failed-progress-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      // Verify progress was still tracked even with failures
      const progressCalls = mockCacheManager.setImportStatus.mock.calls;
      expect(progressCalls.length).toBeGreaterThan(0);

      // Final call should indicate completion with errors
      const finalCall = progressCalls[progressCalls.length - 1];
      expect(finalCall[1].status).toBe('COMPLETED');
      expect(finalCall[1].progress).toBe(100);
    });
  });

  describe('Job Service Direct Testing', () => {
    it('should add jobs with correct parameters', async () => {
      const jobData = {
        filePath: '/test/path.csv',
        filename: 'test.csv',
        fileSize: 1000,
        checksum: 'test-checksum',
        batchId: 'test-batch-id',
        userId: testUserId
      };

      const job = await jobService.addImportJob(jobData);

      expect(mockQueue.add).toHaveBeenCalledWith(
        'process-csv-import',
        jobData,
        expect.objectContaining({
          delay: expect.any(Number),
          attempts: expect.any(Number),
          backoff: expect.any(Object)
        })
      );

      expect(job.id).toBe('test-job-id');
    });

    it('should update job progress correctly', async () => {
      const batchId = 'test-batch-id';
      const progress = {
        status: 'PROCESSING' as const,
        progress: 50,
        message: 'Processing rows...',
        stats: { processed: 50, total: 100 }
      };

      await jobService.updateJobProgress(batchId, progress);

      expect(mockCacheManager.setImportStatus).toHaveBeenCalledWith(
        batchId,
        progress
      );
    });

    it('should handle job processing errors gracefully', async () => {
      const mockJob = {
        id: 'test-job-id',
        data: {
          filePath: '/non/existent/path.csv',
          filename: 'non-existent.csv',
          fileSize: 1000,
          checksum: 'test-checksum',
          batchId: 'test-batch-id',
          userId: testUserId
        }
      };

      // Should not throw even with invalid file path
      await expect(jobService.processJob(mockJob))
        .resolves.not.toThrow();

      // Should have attempted to update progress with error status
      expect(mockCacheManager.setImportStatus).toHaveBeenCalled();
    });
  });

  describe('Queue Configuration and Retry Logic', () => {
    it('should configure job retry parameters correctly', async () => {
      const jobData = {
        filePath: '/test/path.csv',
        filename: 'test.csv',
        fileSize: 1000,
        checksum: 'test-checksum',
        batchId: 'test-batch-id',
        userId: testUserId
      };

      await jobService.addImportJob(jobData);

      const addCall = mockQueue.add.mock.calls[0];
      const options = addCall[2];

      expect(options).toMatchObject({
        attempts: expect.any(Number),
        backoff: expect.objectContaining({
          type: expect.any(String),
          delay: expect.any(Number)
        })
      });

      expect(options.attempts).toBeGreaterThan(1);
    });

    it('should handle job delays appropriately', async () => {
      const jobData = {
        filePath: '/test/path.csv',
        filename: 'test.csv',
        fileSize: 1000,
        checksum: 'test-checksum',
        batchId: 'test-batch-id',
        userId: testUserId
      };

      await jobService.addImportJob(jobData);

      const addCall = mockQueue.add.mock.calls[0];
      const options = addCall[2];

      expect(options.delay).toBeDefined();
      expect(typeof options.delay).toBe('number');
      expect(options.delay).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Cache Integration', () => {
    it('should invalidate dashboard cache after successful import', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Cache invalidation test`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'cache-invalidation.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'cache-invalidation.csv',
        fileSize: fileStats.size,
        checksum: 'cache-invalidation-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      expect(mockCacheManager.invalidateDashboardCache).toHaveBeenCalled();
    });

    it('should handle cache errors gracefully', async () => {
      // Mock cache error
      mockCacheManager.setImportStatus.mockRejectedValueOnce(new Error('Cache error'));

      const progress = {
        status: 'PROCESSING' as const,
        progress: 50,
        message: 'Processing...',
      };

      // Should not throw even if cache fails
      await expect(jobService.updateJobProgress('test-batch-id', progress))
        .resolves.not.toThrow();
    });
  });
});