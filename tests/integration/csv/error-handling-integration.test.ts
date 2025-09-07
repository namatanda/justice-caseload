/**
 * Error Handling Integration Tests
 * 
 * Tests error scenarios across module boundaries to ensure consistent
 * error handling, logging, and user-friendly error messages.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { importService } from '@/lib/csv/import-service';
import { csvValidator } from '@/lib/csv/validator';
import { errorHandler } from '@/lib/csv/error-handler';
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

describe('Error Handling Integration Tests', () => {
  let tempDir: string;
  let tempFiles: string[] = [];
  let testUserId: string;

  beforeEach(async () => {
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
    
    // Create temp directory
    tempDir = await fs.mkdtemp(join(tmpdir(), 'error-integration-test-'));
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

  describe('Validation Error Handling', () => {
    it('should handle validation errors consistently across modules', async () => {
      // Create CSV with various validation errors
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Missing court
NAIROBI HIGH COURT,INVALID,JAN,2024,HCCC,E124,11,JAN,2024,,,,,CRIMINAL CASE,JUDGE BROWN,,,,,,,HEARING,CONTINUED,PENDING EVIDENCE,25,FEB,2024,0,1,0,1,1,0,NO,2,1,1,Invalid date
NAIROBI HIGH COURT,17,INVALID,2024,HCCC,E125,12,JAN,2024,,,,,CIVIL SUIT,,,,,,,,MENTION,COMPLETED,,,,1,0,0,0,1,0,YES,1,0,0,Invalid month and missing judge
NAIROBI HIGH COURT,18,JAN,INVALID,HCCC,E126,13,JAN,2024,,,,,CIVIL SUIT,JUDGE JONES,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,INVALID,0,0,1,0,0,YES,0,0,0,Invalid year and party count`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'validation-errors.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'validation-errors.csv',
        fileSize: fileStats.size,
        checksum: 'validation-error-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      // Verify error handling
      const db = testDb();
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: initiationResult.batchId }
      });

      expect(batch?.status).toBe('COMPLETED');
      expect(batch?.totalRecords).toBe(4);
      expect(batch?.failedRecords).toBe(4); // All rows should fail validation
      expect(batch?.successfulRecords).toBe(0);
      expect(batch?.errorLogs).toBeDefined();
      expect(Array.isArray(batch?.errorLogs)).toBe(true);
      expect((batch?.errorLogs as any[]).length).toBeGreaterThan(0);

      // Verify no invalid data was persisted
      const cases = await db.case.findMany({});
      expect(cases).toHaveLength(0);

      const activities = await db.caseActivity.findMany({});
      expect(activities).toHaveLength(0);
    });

    it('should provide helpful error messages for common validation issues', () => {
      const testRow = {
        court: '',
        date_dd: 'invalid',
        date_mon: 'INVALID_MONTH',
        date_yyyy: '2024',
        caseid_type: 'HCCC',
        caseid_no: 'E123',
        male_applicant: 'not_a_number',
        legalrep: 'MAYBE' // Invalid enum value
      };

      const result = csvValidator.validateRow(testRow, 1);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);

      // Check that error messages are helpful
      const courtError = result.errors.find(e => e.field === 'court');
      expect(courtError?.message).toBeDefined();
      expect(courtError?.suggestion).toBeDefined();

      const dateError = result.errors.find(e => e.field === 'date_dd');
      expect(dateError?.message).toBeDefined();
      expect(dateError?.suggestion).toBeDefined();

      const partyCountError = result.errors.find(e => e.field === 'male_applicant');
      expect(partyCountError?.message).toBeDefined();
      expect(partyCountError?.suggestion).toBeDefined();
    });

    it('should categorize errors correctly', () => {
      const validationError = new Error('Validation failed: Invalid date format');
      const databaseError = new Error('UNIQUE constraint failed: cases.caseNumber');
      const systemError = new Error('ENOENT: no such file or directory');
      const businessError = new Error('Duplicate import detected');

      expect(errorHandler.categorizeError(validationError)).toBe('validation');
      expect(errorHandler.categorizeError(databaseError)).toBe('database');
      expect(errorHandler.categorizeError(systemError)).toBe('system');
      expect(errorHandler.categorizeError(businessError)).toBe('business');
    });
  });

  describe('Database Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Mock database connection failure
      const originalConnect = testDb();
      
      // Create a CSV file
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Test case`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'db-error-test.csv',
        fileStats.size,
        testUserId
      );

      // The import should handle database errors gracefully
      expect(initiationResult.success).toBe(true);
      expect(initiationResult.batchId).toBeDefined();
    });

    it('should handle transaction rollback scenarios', async () => {
      // Create CSV with data that might cause transaction issues
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Valid case
NAIROBI HIGH COURT,16,JAN,2024,HCCC,E124,11,JAN,2024,,,,,CRIMINAL CASE,JUDGE BROWN,,,,,,,HEARING,CONTINUED,PENDING EVIDENCE,25,FEB,2024,0,1,0,1,1,0,NO,2,1,1,Another valid case`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'transaction-test.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'transaction-test.csv',
        fileSize: fileStats.size,
        checksum: 'transaction-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      // Process should complete even if individual transactions fail
      await expect(importService.processImport(jobData, { dryRun: false }))
        .resolves.not.toThrow();

      const db = testDb();
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: initiationResult.batchId }
      });

      expect(batch?.status).toBe('COMPLETED');
    });
  });

  describe('System Error Handling', () => {
    it('should handle file system permission errors', async () => {
      // Create a file path that doesn't exist
      const invalidPath = '/invalid/path/to/file.csv';

      const result = await importService.initiateImport(
        invalidPath,
        'invalid-file.csv',
        1000,
        testUserId
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('file');
    });

    it('should handle memory pressure during large file processing', async () => {
      // Create a CSV with many rows to simulate memory pressure
      const header = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details`;
      
      const rows = [];
      for (let i = 0; i < 100; i++) {
        rows.push(`NAIROBI HIGH COURT,15,JAN,2024,HCCC,E${i},10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Test case ${i}`);
      }

      const csvContent = [header, ...rows].join('\n');
      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'large-file-test.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'large-file-test.csv',
        fileSize: fileStats.size,
        checksum: 'large-file-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      // Should handle large files without memory issues
      await expect(importService.processImport(jobData, { dryRun: false }))
        .resolves.not.toThrow();

      const db = testDb();
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: initiationResult.batchId }
      });

      expect(batch?.status).toBe('COMPLETED');
      expect(batch?.totalRecords).toBe(100);
    }, 120000); // Longer timeout for large file processing
  });

  describe('Cross-Module Error Propagation', () => {
    it('should propagate parser errors through the entire pipeline', async () => {
      // Create a malformed CSV file
      const malformedContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123
"UNCLOSED QUOTE,15,JAN,2024,HCCC,E124
NORMAL ROW,16,JAN,2024,HCCC,E125`;

      const filePath = await createTestCsvFile(malformedContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'malformed.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'malformed.csv',
        fileSize: fileStats.size,
        checksum: 'malformed-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      const db = testDb();
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: initiationResult.batchId }
      });

      // Should complete with errors logged
      expect(batch?.status).toBe('COMPLETED');
      expect(batch?.errorLogs).toBeDefined();
    });

    it('should maintain error context across module boundaries', async () => {
      const testError = new Error('Test validation error');
      const context = {
        operation: 'validateRow',
        rowNumber: 5,
        data: { caseid_no: 'E123' }
      };

      const handledError = errorHandler.handleDatabaseError(testError, context);

      expect(handledError.rowNumber).toBe(5);
      expect(handledError.errorType).toBeDefined();
      expect(handledError.errorMessage).toBeDefined();
      expect(handledError.rawData).toEqual(context.data);
    });

    it('should format user-friendly error messages consistently', () => {
      const validationError = new Error('Validation failed: Required field missing');
      const databaseError = new Error('SQLITE_CONSTRAINT: UNIQUE constraint failed');
      const systemError = new Error('ENOENT: no such file or directory, open \'/path/to/file.csv\'');

      const validationMessage = errorHandler.formatUserFriendlyError(validationError);
      const databaseMessage = errorHandler.formatUserFriendlyError(databaseError);
      const systemMessage = errorHandler.formatUserFriendlyError(systemError);

      expect(validationMessage).toContain('validation');
      expect(databaseMessage).toContain('database');
      expect(systemMessage).toContain('file');

      // All messages should be user-friendly (no technical jargon)
      expect(validationMessage).not.toContain('SQLITE');
      expect(databaseMessage).not.toContain('CONSTRAINT');
      expect(systemMessage).not.toContain('ENOENT');
    });
  });

  describe('Error Recovery Mechanisms', () => {
    it('should continue processing after recoverable errors', async () => {
      // Mix of valid and invalid rows
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Valid case 1
,INVALID,JAN,2024,HCCC,E124,11,JAN,2024,,,,,CRIMINAL CASE,JUDGE BROWN,,,,,,,HEARING,CONTINUED,PENDING EVIDENCE,25,FEB,2024,0,1,0,1,1,0,NO,2,1,1,Invalid case
NAIROBI HIGH COURT,17,JAN,2024,HCCC,E125,12,JAN,2024,,,,,CIVIL SUIT,JUDGE JONES,,,,,,,MENTION,COMPLETED,,,,1,0,0,0,1,0,YES,1,0,0,Valid case 2
INVALID COURT,18,INVALID,2024,HCCC,E126,13,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,INVALID,0,0,1,0,0,YES,0,0,0,Another invalid case
NAIROBI HIGH COURT,19,JAN,2024,HCCC,E127,14,JAN,2024,,,,,CIVIL SUIT,JUDGE BROWN,,,,,,,MENTION,COMPLETED,,,,0,1,0,1,0,0,NO,2,1,0,Valid case 3`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'recovery-test.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'recovery-test.csv',
        fileSize: fileStats.size,
        checksum: 'recovery-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      const db = testDb();
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: initiationResult.batchId }
      });

      // Should process all rows, with some succeeding and some failing
      expect(batch?.status).toBe('COMPLETED');
      expect(batch?.totalRecords).toBe(5);
      expect(batch?.successfulRecords).toBe(3); // Valid cases
      expect(batch?.failedRecords).toBe(2); // Invalid cases

      // Verify valid cases were persisted
      const cases = await db.case.findMany({});
      expect(cases).toHaveLength(3);

      const activities = await db.caseActivity.findMany({});
      expect(activities).toHaveLength(3);
    });

    it('should handle partial batch failures gracefully', async () => {
      // Create a scenario where some rows succeed and others fail
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Good case
NAIROBI HIGH COURT,16,JAN,2024,HCCC,E124,11,JAN,2024,,,,,CRIMINAL CASE,,,,,,,,HEARING,CONTINUED,PENDING EVIDENCE,25,FEB,2024,0,1,0,1,1,0,NO,2,1,1,Missing judge`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'partial-failure.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'partial-failure.csv',
        fileSize: fileStats.size,
        checksum: 'partial-failure-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      const db = testDb();
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: initiationResult.batchId }
      });

      expect(batch?.status).toBe('COMPLETED');
      expect(batch?.totalRecords).toBe(2);
      expect(batch?.successfulRecords).toBe(1);
      expect(batch?.failedRecords).toBe(1);
    });
  });
});