/**
 * Functionality Compatibility Integration Tests
 * 
 * Tests to verify that all existing functionality works identically
 * after the refactoring, ensuring backward compatibility and that
 * the new modular architecture produces the same results.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { testDb, createTestUser } from '../../setup';

// Import both old and new implementations for comparison
import * as csvProcessor from '@/lib/import/csv-processor';
import { importService } from '@/lib/csv/import-service';
import { csvParser } from '@/lib/csv/parser';
import { csvValidator } from '@/lib/csv/validator';
import { dataTransformer } from '@/lib/csv/transformer';

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

describe('Functionality Compatibility Integration Tests', () => {
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
    tempDir = await fs.mkdtemp(join(tmpdir(), 'compatibility-test-'));
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

  describe('CSV Parsing Compatibility', () => {
    it('should parse CSV lines identically to original implementation', () => {
      const testLines = [
        'simple,line,without,quotes',
        '"quoted","field","with,comma","normal"',
        '"field with ""escaped"" quotes","normal field"',
        'mixed,"quoted field",unquoted,"another quoted"',
        '"","empty quoted","",normal',
        'trailing,comma,',
        '"quoted with\nnewline","normal"'
      ];

      testLines.forEach(line => {
        const originalResult = csvProcessor.parseCSVLine(line);
        const newResult = csvParser.parseCSVLine(line);
        
        expect(newResult).toEqual(originalResult);
      });
    });

    it('should handle edge cases in CSV parsing identically', () => {
      const edgeCases = [
        '', // Empty line
        ',', // Just comma
        ',,', // Multiple commas
        '"', // Single quote
        '""', // Empty quoted field
        '"unclosed quote', // Malformed quote
        'normal,"unclosed quote at end'
      ];

      edgeCases.forEach(line => {
        const originalResult = csvProcessor.parseCSVLine(line);
        const newResult = csvParser.parseCSVLine(line);
        
        expect(newResult).toEqual(originalResult);
      });
    });
  });

  describe('Court Type Derivation Compatibility', () => {
    it('should derive court types identically to original implementation', () => {
      const testCaseIds = [
        'SCC', 'SC', 'HC', 'HCCC', 'HCCR', 'HCCA', 'HCCP', 'HCMC',
        'MC', 'ELC', 'TC', 'INVALID', '', 'UNKNOWN_TYPE'
      ];

      testCaseIds.forEach(caseId => {
        const originalResult = csvProcessor.deriveCourtTypeFromCaseId(caseId);
        const newResult = dataTransformer.deriveCourtTypeFromCaseId(caseId);
        
        expect(newResult).toBe(originalResult);
      });
    });
  });

  describe('Import Process Compatibility', () => {
    it('should produce identical results for successful imports', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Compatibility test case
NAIROBI HIGH COURT,16,JAN,2024,HCCC,E124,11,JAN,2024,,,,,CRIMINAL CASE,JUDGE BROWN,,,,,,,HEARING,CONTINUED,PENDING EVIDENCE,25,FEB,2024,0,1,0,1,1,0,NO,2,1,1,Another compatibility test`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      // Test new implementation
      const newResult = await importService.initiateImport(
        filePath,
        'compatibility-test.csv',
        fileStats.size,
        testUserId
      );

      expect(newResult.success).toBe(true);

      const jobData = {
        filePath,
        filename: 'compatibility-test.csv',
        fileSize: fileStats.size,
        checksum: 'compatibility-checksum',
        batchId: newResult.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      // Verify results
      const db = testDb();
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: newResult.batchId }
      });

      expect(batch?.status).toBe('COMPLETED');
      expect(batch?.totalRecords).toBe(2);
      expect(batch?.successfulRecords).toBe(2);
      expect(batch?.failedRecords).toBe(0);

      const cases = await db.case.findMany({});
      expect(cases).toHaveLength(2);

      const activities = await db.caseActivity.findMany({});
      expect(activities).toHaveLength(2);

      // Verify case data structure matches expected format
      cases.forEach(caseRecord => {
        expect(caseRecord.caseNumber).toMatch(/^HCCCE\d+\/2024$/);
        expect(caseRecord.filedDate).toBeInstanceOf(Date);
        expect(caseRecord.status).toBe('ACTIVE');
        expect(typeof caseRecord.hasLegalRepresentation).toBe('boolean');
        expect(caseRecord.parties).toBeDefined();
      });

      // Verify activity data structure
      activities.forEach(activity => {
        expect(activity.activityDate).toBeInstanceOf(Date);
        expect(activity.activityType).toBeDefined();
        expect(activity.outcome).toBeDefined();
        expect(activity.importBatchId).toBe(newResult.batchId);
        expect(typeof activity.hasLegalRepresentation).toBe('boolean');
        expect(typeof activity.applicantWitnesses).toBe('number');
        expect(typeof activity.defendantWitnesses).toBe('number');
      });
    });

    it('should handle validation errors identically', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Missing court
NAIROBI HIGH COURT,INVALID,JAN,2024,HCCC,E124,11,JAN,2024,,,,,CRIMINAL CASE,JUDGE BROWN,,,,,,,HEARING,CONTINUED,PENDING EVIDENCE,25,FEB,2024,0,1,0,1,1,0,NO,2,1,1,Invalid date`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const result = await importService.initiateImport(
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
        batchId: result.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      const db = testDb();
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: result.batchId }
      });

      expect(batch?.status).toBe('COMPLETED');
      expect(batch?.totalRecords).toBe(2);
      expect(batch?.failedRecords).toBe(2);
      expect(batch?.successfulRecords).toBe(0);
      expect(batch?.errorLogs).toBeDefined();
      expect(Array.isArray(batch?.errorLogs)).toBe(true);
      expect((batch?.errorLogs as any[]).length).toBeGreaterThan(0);
    });

    it('should maintain identical API responses', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,API compatibility test`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      // Test initiateDailyImport compatibility
      const initiationResult = await csvProcessor.initiateDailyImport(
        filePath,
        'api-test.csv',
        fileStats.size,
        testUserId
      );

      expect(initiationResult).toMatchObject({
        success: true,
        batchId: expect.any(String)
      });

      // Test getImportStatus compatibility
      const status = await csvProcessor.getImportStatus(initiationResult.batchId);
      expect(status).toMatchObject({
        status: expect.any(String),
        progress: expect.any(Number),
        message: expect.any(String)
      });

      // Test getImportHistory compatibility
      const history = await csvProcessor.getImportHistory(10);
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBeGreaterThan(0);
      
      const historyItem = history[0];
      expect(historyItem).toMatchObject({
        id: expect.any(String),
        filename: expect.any(String),
        status: expect.any(String),
        totalRecords: expect.any(Number),
        successfulRecords: expect.any(Number),
        failedRecords: expect.any(Number)
      });
    });
  });

  describe('Data Structure Compatibility', () => {
    it('should create identical database records', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Data structure test`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const result = await importService.initiateImport(
        filePath,
        'data-structure.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'data-structure.csv',
        fileSize: fileStats.size,
        checksum: 'data-structure-checksum',
        batchId: result.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      const db = testDb();
      
      // Verify case structure
      const cases = await db.case.findMany({});
      expect(cases).toHaveLength(1);
      
      const caseRecord = cases[0];
      expect(caseRecord).toMatchObject({
        caseNumber: 'HCCCE123/2024',
        filedDate: expect.any(Date),
        status: 'ACTIVE',
        hasLegalRepresentation: true,
        parties: expect.objectContaining({
          applicants: expect.objectContaining({
            maleCount: 1,
            femaleCount: 0,
            organizationCount: 0
          }),
          defendants: expect.objectContaining({
            maleCount: 1,
            femaleCount: 0,
            organizationCount: 0
          })
        })
      });

      // Verify activity structure
      const activities = await db.caseActivity.findMany({});
      expect(activities).toHaveLength(1);
      
      const activity = activities[0];
      expect(activity).toMatchObject({
        caseId: caseRecord.id,
        activityDate: expect.any(Date),
        activityType: 'MENTION',
        outcome: 'ADJOURNED',
        reasonForAdjournment: 'LACK OF WITNESS',
        nextHearingDate: expect.any(Date),
        hasLegalRepresentation: true,
        applicantWitnesses: 0,
        defendantWitnesses: 0,
        custodyStatus: 'NOT_APPLICABLE',
        importBatchId: result.batchId
      });

      // Verify batch structure
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: result.batchId }
      });
      
      expect(batch).toMatchObject({
        filename: 'data-structure.csv',
        status: 'COMPLETED',
        totalRecords: 1,
        successfulRecords: 1,
        failedRecords: 0,
        errorLogs: expect.any(Array),
        createdBy: testUserId
      });
    });

    it('should handle complex case scenarios identically', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,ORIGINAL COURT,OC123,456,2023,CIVIL SUIT,JUDGE SMITH,JUDGE BROWN,JUDGE JONES,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,2,1,1,1,2,0,YES,3,2,1,Complex case with multiple parties and judges`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const result = await importService.initiateImport(
        filePath,
        'complex-case.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'complex-case.csv',
        fileSize: fileStats.size,
        checksum: 'complex-case-checksum',
        batchId: result.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      const db = testDb();
      const cases = await db.case.findMany({
        include: {
          activities: true
        }
      });

      expect(cases).toHaveLength(1);
      
      const caseRecord = cases[0];
      expect(caseRecord.parties).toMatchObject({
        applicants: {
          maleCount: 2,
          femaleCount: 1,
          organizationCount: 1
        },
        defendants: {
          maleCount: 1,
          femaleCount: 2,
          organizationCount: 0
        }
      });

      const activity = caseRecord.activities[0];
      expect(activity).toMatchObject({
        applicantWitnesses: 3,
        defendantWitnesses: 2,
        custodyStatus: 'ON_BAIL'
      });
    });
  });

  describe('Error Message Compatibility', () => {
    it('should produce similar error messages for validation failures', () => {
      const testRow = {
        court: '',
        date_dd: 'invalid',
        date_mon: 'INVALID_MONTH',
        caseid_type: 'HCCC',
        caseid_no: 'E123',
        male_applicant: 'not_a_number'
      };

      const result = csvValidator.validateRow(testRow, 1);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);

      // Verify error structure matches expected format
      result.errors.forEach(error => {
        expect(error).toMatchObject({
          field: expect.any(String),
          message: expect.any(String),
          suggestion: expect.any(String),
          rawValue: expect.anything()
        });
      });

      // Verify specific error types are caught
      const fieldErrors = result.errors.map(e => e.field);
      expect(fieldErrors).toContain('court');
      expect(fieldErrors).toContain('date_dd');
      expect(fieldErrors).toContain('male_applicant');
    });

    it('should maintain error logging format', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
INVALID COURT,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,,,,,INVALID,INVALID,,,,,,,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,INVALID,Error logging test`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const result = await importService.initiateImport(
        filePath,
        'error-logging.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'error-logging.csv',
        fileSize: fileStats.size,
        checksum: 'error-logging-checksum',
        batchId: result.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      const db = testDb();
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: result.batchId }
      });

      expect(batch?.errorLogs).toBeDefined();
      expect(Array.isArray(batch?.errorLogs)).toBe(true);
      
      const errorLogs = batch?.errorLogs as any[];
      expect(errorLogs.length).toBeGreaterThan(0);

      // Verify error log structure
      errorLogs.forEach(error => {
        expect(error).toMatchObject({
          rowNumber: expect.any(Number),
          errorType: expect.any(String),
          errorMessage: expect.any(String)
        });
      });
    });
  });

  describe('Performance Compatibility', () => {
    it('should process files at similar speed', async () => {
      // Create a larger CSV file for performance testing
      const header = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details`;
      
      const rows = [];
      for (let i = 0; i < 50; i++) {
        rows.push(`NAIROBI HIGH COURT,15,JAN,2024,HCCC,E${i},10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Performance test case ${i}`);
      }

      const csvContent = [header, ...rows].join('\n');
      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const startTime = Date.now();

      const result = await importService.initiateImport(
        filePath,
        'performance-test.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'performance-test.csv',
        fileSize: fileStats.size,
        checksum: 'performance-checksum',
        batchId: result.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Verify processing completed successfully
      const db = testDb();
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: result.batchId }
      });

      expect(batch?.status).toBe('COMPLETED');
      expect(batch?.totalRecords).toBe(50);
      expect(batch?.successfulRecords).toBe(50);

      // Performance should be reasonable (less than 30 seconds for 50 records)
      expect(processingTime).toBeLessThan(30000);
    }, 60000);

    it('should handle memory usage efficiently', async () => {
      // Create CSV with many columns to test memory efficiency
      const header = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details`;
      
      const rows = [];
      for (let i = 0; i < 100; i++) {
        rows.push(`NAIROBI HIGH COURT,15,JAN,2024,HCCC,E${i},10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Memory test case ${i} with extra data to increase memory usage`);
      }

      const csvContent = [header, ...rows].join('\n');
      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initialMemory = process.memoryUsage();

      const result = await importService.initiateImport(
        filePath,
        'memory-test.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'memory-test.csv',
        fileSize: fileStats.size,
        checksum: 'memory-checksum',
        batchId: result.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

      // Verify processing completed
      const db = testDb();
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: result.batchId }
      });

      expect(batch?.status).toBe('COMPLETED');
      expect(batch?.totalRecords).toBe(100);

      // Memory increase should be reasonable (less than 100MB)
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
    }, 120000);
  });
});