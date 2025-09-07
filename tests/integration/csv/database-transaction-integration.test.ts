/**
 * Database Transaction Integration Tests
 * 
 * Tests database transaction handling across services to ensure data consistency,
 * proper rollback behavior, and ACID compliance during CSV import operations.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { importService } from '@/lib/csv/import-service';
import { caseService } from '@/lib/csv/case-service';
import { batchService } from '@/lib/csv/batch-service';
import { testDb, createTestUser, createTestCaseType, createTestJudge } from '../../setup';

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

describe('Database Transaction Integration Tests', () => {
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
    tempDir = await fs.mkdtemp(join(tmpdir(), 'transaction-integration-test-'));
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

  describe('Transaction Atomicity', () => {
    it('should ensure all-or-nothing behavior for individual case processing', async () => {
      const db = testDb();
      
      // Create test data
      const caseType = await createTestCaseType();
      const judge = await createTestJudge();
      
      const validCaseData = {
        caseNumber: 'HCCCE123/2024',
        caseTypeId: caseType.id,
        filedDate: new Date('2024-01-10'),
        maleApplicant: 1,
        femaleApplicant: 0,
        organizationApplicant: 0,
        maleDefendant: 1,
        femaleDefendant: 0,
        organizationDefendant: 0,
        caseidType: 'HCCC',
        caseidNo: 'E123',
        status: 'ACTIVE' as const,
        hasLegalRepresentation: true
      };

      // Test successful transaction
      await db.$transaction(async (tx) => {
        const result = await caseService.createOrUpdateCase(
          {
            caseid_type: 'HCCC',
            caseid_no: 'E123',
            filed_dd: '10',
            filed_mon: 'JAN',
            filed_yyyy: '2024',
            court: 'NAIROBI HIGH COURT',
            case_type: 'CIVIL SUIT',
            male_applicant: '1',
            female_applicant: '0',
            organization_applicant: '0',
            male_defendant: '1',
            female_defendant: '0',
            organization_defendant: '0',
            legalrep: 'YES'
          },
          tx
        );

        expect(result.caseId).toBeDefined();
        expect(result.isNewCase).toBe(true);

        // Verify case was created within transaction
        const createdCase = await tx.case.findUnique({
          where: { id: result.caseId }
        });
        expect(createdCase).toBeDefined();
      });

      // Verify case persisted after transaction commit
      const persistedCase = await db.case.findFirst({
        where: { caseNumber: 'HCCCE123/2024' }
      });
      expect(persistedCase).toBeDefined();
    });

    it('should rollback all changes when transaction fails', async () => {
      const db = testDb();
      
      // Create initial case count
      const initialCaseCount = await db.case.count();
      const initialActivityCount = await db.caseActivity.count();

      // Attempt transaction that should fail
      await expect(async () => {
        await db.$transaction(async (tx) => {
          // Create a case successfully
          const caseResult = await caseService.createOrUpdateCase(
            {
              caseid_type: 'HCCC',
              caseid_no: 'E123',
              filed_dd: '10',
              filed_mon: 'JAN',
              filed_yyyy: '2024',
              court: 'NAIROBI HIGH COURT',
              case_type: 'CIVIL SUIT',
              male_applicant: '1',
              female_applicant: '0',
              organization_applicant: '0',
              male_defendant: '1',
              female_defendant: '0',
              organization_defendant: '0',
              legalrep: 'YES'
            },
            tx
          );

          // Try to create activity with invalid data to force rollback
          await caseService.createCaseActivity(
            {
              caseid_type: 'HCCC',
              caseid_no: 'E123',
              date_dd: '15',
              date_mon: 'JAN',
              date_yyyy: '2024',
              judge_1: 'INVALID_JUDGE_THAT_DOES_NOT_EXIST',
              outcome: 'ADJOURNED',
              comingfor: 'MENTION',
              male_applicant: '1',
              female_applicant: '0',
              organization_applicant: '0',
              male_defendant: '1',
              female_defendant: '0',
              organization_defendant: '0',
              legalrep: 'YES',
              applicant_witness: '0',
              defendant_witness: '0',
              custody: '0'
            },
            caseResult.caseId,
            'test-batch-id',
            tx
          );

          // Force an error to trigger rollback
          throw new Error('Simulated transaction failure');
        });
      }).rejects.toThrow('Simulated transaction failure');

      // Verify no changes were persisted
      const finalCaseCount = await db.case.count();
      const finalActivityCount = await db.caseActivity.count();

      expect(finalCaseCount).toBe(initialCaseCount);
      expect(finalActivityCount).toBe(initialActivityCount);
    });
  });

  describe('Transaction Consistency', () => {
    it('should maintain referential integrity across related entities', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Test case with activity
NAIROBI HIGH COURT,16,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE BROWN,,,,,,,HEARING,CONTINUED,PENDING EVIDENCE,25,FEB,2024,1,0,0,1,0,0,YES,1,1,0,Second activity for same case`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'referential-integrity.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'referential-integrity.csv',
        fileSize: fileStats.size,
        checksum: 'referential-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      // Verify referential integrity
      const db = testDb();
      const cases = await db.case.findMany({
        include: {
          activities: true
        }
      });

      expect(cases).toHaveLength(1); // One case
      expect(cases[0].activities).toHaveLength(2); // Two activities

      // Verify all activities reference the correct case
      const activities = await db.caseActivity.findMany({
        where: { importBatchId: initiationResult.batchId }
      });

      expect(activities).toHaveLength(2);
      activities.forEach(activity => {
        expect(activity.caseId).toBe(cases[0].id);
      });
    });

    it('should handle concurrent case updates correctly', async () => {
      const db = testDb();
      
      // Create initial case
      const caseType = await createTestCaseType();
      const initialCase = await db.case.create({
        data: {
          caseNumber: 'HCCCE123/2024',
          caseTypeId: caseType.id,
          filedDate: new Date('2024-01-10'),
          parties: {
            applicants: { maleCount: 1, femaleCount: 0, organizationCount: 0 },
            defendants: { maleCount: 1, femaleCount: 0, organizationCount: 0 }
          },
          status: 'ACTIVE',
          hasLegalRepresentation: true
        }
      });

      // Simulate concurrent updates
      const updatePromises = [];
      
      for (let i = 0; i < 3; i++) {
        updatePromises.push(
          db.$transaction(async (tx) => {
            const existingCase = await tx.case.findUnique({
              where: { id: initialCase.id }
            });

            if (existingCase) {
              await tx.case.update({
                where: { id: initialCase.id },
                data: {
                  parties: {
                    applicants: { 
                      maleCount: (existingCase.parties as any).applicants.maleCount + 1,
                      femaleCount: 0,
                      organizationCount: 0
                    },
                    defendants: { maleCount: 1, femaleCount: 0, organizationCount: 0 }
                  }
                }
              });
            }
          })
        );
      }

      await Promise.all(updatePromises);

      // Verify final state is consistent
      const finalCase = await db.case.findUnique({
        where: { id: initialCase.id }
      });

      expect(finalCase).toBeDefined();
      expect((finalCase?.parties as any).applicants.maleCount).toBeGreaterThan(1);
    });
  });

  describe('Transaction Isolation', () => {
    it('should isolate concurrent import operations', async () => {
      // Create two different CSV files
      const csvContent1 = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Import 1 case`;

      const csvContent2 = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,16,JAN,2024,HCCC,E124,11,JAN,2024,,,,,CRIMINAL CASE,JUDGE BROWN,,,,,,,HEARING,CONTINUED,PENDING EVIDENCE,25,FEB,2024,0,1,0,1,1,0,NO,2,1,1,Import 2 case`;

      const filePath1 = await createTestCsvFile(csvContent1);
      const filePath2 = await createTestCsvFile(csvContent2);
      const fileStats1 = await fs.stat(filePath1);
      const fileStats2 = await fs.stat(filePath2);

      // Start both imports concurrently
      const [result1, result2] = await Promise.all([
        importService.initiateImport(filePath1, 'concurrent1.csv', fileStats1.size, testUserId),
        importService.initiateImport(filePath2, 'concurrent2.csv', fileStats2.size, testUserId)
      ]);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.batchId).not.toBe(result2.batchId);

      // Process both imports concurrently
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

      await Promise.all([
        importService.processImport(jobData1, { dryRun: false }),
        importService.processImport(jobData2, { dryRun: false })
      ]);

      // Verify both imports completed successfully
      const db = testDb();
      const batch1 = await db.dailyImportBatch.findUnique({
        where: { id: result1.batchId }
      });
      const batch2 = await db.dailyImportBatch.findUnique({
        where: { id: result2.batchId }
      });

      expect(batch1?.status).toBe('COMPLETED');
      expect(batch2?.status).toBe('COMPLETED');

      // Verify data integrity
      const cases = await db.case.findMany({});
      expect(cases).toHaveLength(2);

      const activities = await db.caseActivity.findMany({});
      expect(activities).toHaveLength(2);
    });

    it('should prevent dirty reads during import processing', async () => {
      const db = testDb();
      
      // Create a batch
      const batch = await batchService.createBatch({
        filename: 'isolation-test.csv',
        fileSize: 1000,
        fileChecksum: 'isolation-checksum',
        userId: testUserId
      });

      // Start a long-running transaction
      const transactionPromise = db.$transaction(async (tx) => {
        // Update batch status
        await tx.dailyImportBatch.update({
          where: { id: batch.id },
          data: { status: 'PROCESSING' }
        });

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 100));

        // Update with final status
        await tx.dailyImportBatch.update({
          where: { id: batch.id },
          data: { 
            status: 'COMPLETED',
            successfulRecords: 1
          }
        });
      });

      // Try to read batch status during transaction
      const readPromise = (async () => {
        await new Promise(resolve => setTimeout(resolve, 50)); // Wait for transaction to start
        return await batchService.getBatch(batch.id);
      })();

      const [, batchDuringTransaction] = await Promise.all([
        transactionPromise,
        readPromise
      ]);

      // The read should see either the initial state or final state, not intermediate
      expect(batchDuringTransaction?.status).toMatch(/^(PENDING|COMPLETED)$/);
    });
  });

  describe('Transaction Durability', () => {
    it('should persist changes after successful transaction commit', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Durability test case`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'durability-test.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'durability-test.csv',
        fileSize: fileStats.size,
        checksum: 'durability-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      await importService.processImport(jobData, { dryRun: false });

      // Verify data persists across multiple reads
      const db = testDb();
      
      for (let i = 0; i < 3; i++) {
        const batch = await db.dailyImportBatch.findUnique({
          where: { id: initiationResult.batchId }
        });
        
        expect(batch?.status).toBe('COMPLETED');
        expect(batch?.successfulRecords).toBe(1);

        const cases = await db.case.findMany({});
        expect(cases).toHaveLength(1);

        const activities = await db.caseActivity.findMany({
          where: { importBatchId: initiationResult.batchId }
        });
        expect(activities).toHaveLength(1);

        // Small delay between reads
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    });

    it('should handle batch processing with proper transaction boundaries', async () => {
      // Create CSV with multiple rows to test batch processing
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,,,,,CIVIL SUIT,JUDGE SMITH,,,,,,,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Batch case 1
NAIROBI HIGH COURT,16,JAN,2024,HCCC,E124,11,JAN,2024,,,,,CRIMINAL CASE,JUDGE BROWN,,,,,,,HEARING,CONTINUED,PENDING EVIDENCE,25,FEB,2024,0,1,0,1,1,0,NO,2,1,1,Batch case 2
NAIROBI HIGH COURT,17,JAN,2024,HCCC,E125,12,JAN,2024,,,,,CIVIL SUIT,JUDGE JONES,,,,,,,MENTION,COMPLETED,,,,1,0,0,0,1,0,YES,1,0,0,Batch case 3`;

      const filePath = await createTestCsvFile(csvContent);
      const fileStats = await fs.stat(filePath);

      const initiationResult = await importService.initiateImport(
        filePath,
        'batch-processing.csv',
        fileStats.size,
        testUserId
      );

      const jobData = {
        filePath,
        filename: 'batch-processing.csv',
        fileSize: fileStats.size,
        checksum: 'batch-processing-checksum',
        batchId: initiationResult.batchId,
        userId: testUserId
      };

      // Process with smaller batch size to test transaction boundaries
      await importService.processImport(jobData, { dryRun: false, batchSize: 2 });

      // Verify all data was processed correctly
      const db = testDb();
      const batch = await db.dailyImportBatch.findUnique({
        where: { id: initiationResult.batchId }
      });

      expect(batch?.status).toBe('COMPLETED');
      expect(batch?.totalRecords).toBe(3);
      expect(batch?.successfulRecords).toBe(3);

      const cases = await db.case.findMany({});
      expect(cases).toHaveLength(3);

      const activities = await db.caseActivity.findMany({
        where: { importBatchId: initiationResult.batchId }
      });
      expect(activities).toHaveLength(3);
    });
  });

  describe('Deadlock Prevention', () => {
    it('should handle potential deadlock scenarios gracefully', async () => {
      const db = testDb();
      
      // Create test data that could cause deadlocks
      const caseType = await createTestCaseType();
      const judge = await createTestJudge();

      // Create two cases that might be updated concurrently
      const case1 = await db.case.create({
        data: {
          caseNumber: 'HCCCE123/2024',
          caseTypeId: caseType.id,
          filedDate: new Date('2024-01-10'),
          parties: {
            applicants: { maleCount: 1, femaleCount: 0, organizationCount: 0 },
            defendants: { maleCount: 1, femaleCount: 0, organizationCount: 0 }
          },
          status: 'ACTIVE',
          hasLegalRepresentation: true
        }
      });

      const case2 = await db.case.create({
        data: {
          caseNumber: 'HCCCE124/2024',
          caseTypeId: caseType.id,
          filedDate: new Date('2024-01-11'),
          parties: {
            applicants: { maleCount: 0, femaleCount: 1, organizationCount: 0 },
            defendants: { maleCount: 1, femaleCount: 1, organizationCount: 0 }
          },
          status: 'ACTIVE',
          hasLegalRepresentation: false
        }
      });

      // Simulate concurrent transactions that could deadlock
      const transaction1 = db.$transaction(async (tx) => {
        // Update case1 first, then case2
        await tx.case.update({
          where: { id: case1.id },
          data: { hasLegalRepresentation: false }
        });

        await new Promise(resolve => setTimeout(resolve, 50));

        await tx.case.update({
          where: { id: case2.id },
          data: { hasLegalRepresentation: true }
        });
      });

      const transaction2 = db.$transaction(async (tx) => {
        // Update case2 first, then case1 (opposite order)
        await tx.case.update({
          where: { id: case2.id },
          data: { 
            parties: {
              applicants: { maleCount: 1, femaleCount: 1, organizationCount: 0 },
              defendants: { maleCount: 1, femaleCount: 1, organizationCount: 0 }
            }
          }
        });

        await new Promise(resolve => setTimeout(resolve, 50));

        await tx.case.update({
          where: { id: case1.id },
          data: {
            parties: {
              applicants: { maleCount: 2, femaleCount: 0, organizationCount: 0 },
              defendants: { maleCount: 1, femaleCount: 0, organizationCount: 0 }
            }
          }
        });
      });

      // Both transactions should complete without deadlock
      await expect(Promise.all([transaction1, transaction2]))
        .resolves.not.toThrow();

      // Verify final state
      const finalCase1 = await db.case.findUnique({ where: { id: case1.id } });
      const finalCase2 = await db.case.findUnique({ where: { id: case2.id } });

      expect(finalCase1).toBeDefined();
      expect(finalCase2).toBeDefined();
    });
  });
});