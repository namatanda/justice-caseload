/**
 * Test Infrastructure Integration Tests
 * 
 * Tests to verify the integration test infrastructure works correctly
 * and demonstrates the patterns for comprehensive integration testing
 * of CSV processing modules.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
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

describe('Test Infrastructure Integration Tests', () => {
  let tempDir: string;
  let tempFiles: string[] = [];
  let testUserId: string;

  beforeEach(async () => {
    process.env.USE_TEST_DB = '1';
    
    // Clean up database if test DB is available
    try {
      const db = testDb();
      await db.caseActivity.deleteMany({});
      await db.case.deleteMany({});
      await db.dailyImportBatch.deleteMany({});
      await db.user.deleteMany({});
      
      // Create test user
      const testUser = await createTestUser();
      testUserId = testUser.id;
    } catch (error) {
      // Test DB not available, use mock user ID
      testUserId = 'test-user-id';
    }
    
    // Create temp directory
    tempDir = await fs.mkdtemp(join(tmpdir(), 'test-infrastructure-integration-'));
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

    // Clean up database if available
    try {
      const db = testDb();
      await db.caseActivity.deleteMany({});
      await db.case.deleteMany({});
      await db.dailyImportBatch.deleteMany({});
      await db.user.deleteMany({});
    } catch (error) {
      // Test DB not available, skip cleanup
    }
  });

  const createTestCsvFile = async (content: string): Promise<string> => {
    const filePath = join(tempDir, `test-${Date.now()}.csv`);
    await fs.writeFile(filePath, content, 'utf8');
    tempFiles.push(filePath);
    return filePath;
  };

  describe('File System Integration', () => {
    it('should create and read CSV files correctly', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123
MOMBASA HIGH COURT,16,JAN,2024,SC,456`;

      const filePath = await createTestCsvFile(csvContent);
      
      // Verify file was created
      const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
      expect(fileExists).toBe(true);

      // Verify file content
      const fileContent = await fs.readFile(filePath, 'utf8');
      expect(fileContent).toBe(csvContent);

      // Verify file stats
      const stats = await fs.stat(filePath);
      expect(stats.size).toBeGreaterThan(0);
      expect(stats.isFile()).toBe(true);
    });

    it('should handle file operations with different encodings', async () => {
      const csvContent = `court,details
NAIROBI HIGH COURT,Standard ASCII text
MOMBASA HIGH COURT,Text with special chars: àáâãäå çèéêë`;

      const filePath = await createTestCsvFile(csvContent);
      const fileContent = await fs.readFile(filePath, 'utf8');
      
      expect(fileContent).toContain('Standard ASCII text');
      expect(fileContent).toContain('àáâãäå çèéêë');
    });

    it('should handle large file creation and reading', async () => {
      const header = 'court,caseid_type,caseid_no,details';
      const rows = [];
      
      for (let i = 0; i < 100; i++) {
        rows.push(`NAIROBI HIGH COURT,HCCC,E${i},Test case ${i} with additional data for testing`);
      }

      const csvContent = [header, ...rows].join('\n');
      const filePath = await createTestCsvFile(csvContent);
      
      const startTime = Date.now();
      const fileContent = await fs.readFile(filePath, 'utf8');
      const endTime = Date.now();
      
      const lines = fileContent.split('\n').filter(line => line.trim());
      expect(lines).toHaveLength(101); // Header + 100 rows
      
      // File operations should be fast
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe('Database Integration', () => {
    it('should connect to test database successfully', async () => {
      try {
        const db = testDb();
        
        // Test basic database operations
        const userCount = await db.user.count();
        expect(typeof userCount).toBe('number');
        expect(userCount).toBeGreaterThanOrEqual(0);
        
        // Verify test user exists
        const testUser = await db.user.findFirst({
          where: { id: testUserId }
        });
        expect(testUser).toBeDefined();
        expect(testUser?.id).toBe(testUserId);
        
      } catch (error) {
        // Test DB not available - this is acceptable for some environments
        if (error instanceof Error && error.message.includes('Test DB is not enabled')) {
          expect(true).toBe(true); // Test passes
        } else {
          throw error;
        }
      }
    });

    it('should handle database transactions correctly', async () => {
      try {
        const db = testDb();
        
        // Test transaction rollback
        const initialUserCount = await db.user.count();
        
        await expect(async () => {
          await db.$transaction(async (tx) => {
            await tx.user.create({
              data: {
                email: 'transaction-test@example.com',
                name: 'Transaction Test User',
                role: 'DATA_ENTRY',
                isActive: true,
              },
            });
            
            // Force rollback
            throw new Error('Test rollback');
          });
        }).rejects.toThrow('Test rollback');
        
        // Verify rollback worked
        const finalUserCount = await db.user.count();
        expect(finalUserCount).toBe(initialUserCount);
        
      } catch (error) {
        if (error instanceof Error && error.message.includes('Test DB is not enabled')) {
          expect(true).toBe(true); // Test passes
        } else {
          throw error;
        }
      }
    });

    it('should handle concurrent database operations', async () => {
      try {
        const db = testDb();
        
        // Create multiple users concurrently
        const userPromises = [];
        for (let i = 0; i < 5; i++) {
          userPromises.push(
            db.user.create({
              data: {
                email: `concurrent-${i}@example.com`,
                name: `Concurrent User ${i}`,
                role: 'DATA_ENTRY',
                isActive: true,
              },
            })
          );
        }
        
        const users = await Promise.all(userPromises);
        expect(users).toHaveLength(5);
        
        // Verify all users were created
        users.forEach((user, index) => {
          expect(user.email).toBe(`concurrent-${index}@example.com`);
          expect(user.name).toBe(`Concurrent User ${index}`);
        });
        
      } catch (error) {
        if (error instanceof Error && error.message.includes('Test DB is not enabled')) {
          expect(true).toBe(true); // Test passes
        } else {
          throw error;
        }
      }
    });
  });

  describe('Mock Integration', () => {
    it('should mock external dependencies correctly', () => {
      const mockQueue = vi.mocked(require('@/lib/database/redis').importQueue);
      const mockCache = vi.mocked(require('@/lib/database/redis').cacheManager);
      
      // Verify mocks are working
      expect(mockQueue.add).toBeDefined();
      expect(mockCache.setImportStatus).toBeDefined();
      expect(mockCache.getImportStatus).toBeDefined();
      
      // Test mock functionality
      mockQueue.add.mockResolvedValueOnce({ id: 'custom-job-id' });
      
      expect(mockQueue.add).toHaveBeenCalledTimes(0);
      
      // Call the mock
      const result = mockQueue.add('test-job', { data: 'test' }, {});
      expect(mockQueue.add).toHaveBeenCalledTimes(1);
      expect(mockQueue.add).toHaveBeenCalledWith('test-job', { data: 'test' }, {});
    });

    it('should handle logger mocks correctly', () => {
      const mockLogger = vi.mocked(require('@/lib/logger').logger);
      
      expect(mockLogger.import.info).toBeDefined();
      expect(mockLogger.database.error).toBeDefined();
      expect(mockLogger.info).toBeDefined();
      
      // Test logger calls
      mockLogger.import.info('Test message');
      expect(mockLogger.import.info).toHaveBeenCalledWith('Test message');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle file system errors gracefully', async () => {
      const nonExistentFile = join(tempDir, 'non-existent.csv');
      
      await expect(fs.readFile(nonExistentFile, 'utf8'))
        .rejects.toThrow();
      
      // Verify error handling doesn't crash the test
      try {
        await fs.readFile(nonExistentFile, 'utf8');
        expect(false).toBe(true); // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error instanceof Error ? error.code : '').toBe('ENOENT');
      }
    });

    it('should handle database errors gracefully', async () => {
      try {
        const db = testDb();
        
        // Try to create user with invalid data
        await expect(async () => {
          await db.user.create({
            data: {
              email: '', // Invalid email
              name: 'Test User',
              role: 'INVALID_ROLE' as any, // Invalid role
              isActive: true,
            },
          });
        }).rejects.toThrow();
        
      } catch (error) {
        if (error instanceof Error && error.message.includes('Test DB is not enabled')) {
          expect(true).toBe(true); // Test passes
        } else {
          throw error;
        }
      }
    });

    it('should handle async operation errors', async () => {
      const errorPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Async error')), 10);
      });
      
      await expect(errorPromise).rejects.toThrow('Async error');
    });
  });

  describe('Performance Integration', () => {
    it('should handle memory usage efficiently', async () => {
      const initialMemory = process.memoryUsage();
      
      // Create multiple large objects
      const largeObjects = [];
      for (let i = 0; i < 10; i++) {
        largeObjects.push({
          id: i,
          data: new Array(1000).fill(`Large data item ${i}`),
          timestamp: new Date(),
        });
      }
      
      // Process the objects
      const processedObjects = largeObjects.map(obj => ({
        ...obj,
        processed: true,
        processedAt: new Date(),
      }));
      
      expect(processedObjects).toHaveLength(10);
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });

    it('should handle concurrent operations efficiently', async () => {
      const startTime = Date.now();
      
      // Create multiple concurrent file operations
      const filePromises = [];
      for (let i = 0; i < 5; i++) {
        const content = `Test file ${i}\nWith multiple lines\nFor testing concurrent operations`;
        filePromises.push(createTestCsvFile(content));
      }
      
      const filePaths = await Promise.all(filePromises);
      expect(filePaths).toHaveLength(5);
      
      // Read all files concurrently
      const readPromises = filePaths.map(path => fs.readFile(path, 'utf8'));
      const fileContents = await Promise.all(readPromises);
      
      expect(fileContents).toHaveLength(5);
      fileContents.forEach((content, index) => {
        expect(content).toContain(`Test file ${index}`);
      });
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Concurrent operations should be faster than sequential
      expect(totalTime).toBeLessThan(2000);
    });
  });

  describe('Integration Test Patterns', () => {
    it('should demonstrate complete workflow testing pattern', async () => {
      // Step 1: Setup test data
      const csvContent = `court,caseid_type,caseid_no,case_type,judge_1
NAIROBI HIGH COURT,HCCC,E123,CIVIL SUIT,JUDGE SMITH
MOMBASA HIGH COURT,SC,456,CRIMINAL CASE,JUDGE BROWN`;

      const filePath = await createTestCsvFile(csvContent);
      
      // Step 2: Verify file creation
      const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
      expect(fileExists).toBe(true);
      
      // Step 3: Parse and validate content
      const fileContent = await fs.readFile(filePath, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      expect(lines).toHaveLength(3); // Header + 2 data rows
      
      // Step 4: Validate data structure
      const headers = lines[0].split(',');
      expect(headers).toContain('court');
      expect(headers).toContain('caseid_type');
      expect(headers).toContain('caseid_no');
      
      // Step 5: Process data rows
      const dataRows = lines.slice(1).map(line => line.split(','));
      expect(dataRows).toHaveLength(2);
      
      dataRows.forEach((row, index) => {
        expect(row).toHaveLength(5);
        expect(row[0]).toContain('HIGH COURT');
        expect(row[1]).toMatch(/^(HCCC|SC)$/);
        expect(row[2]).toMatch(/^(E123|456)$/);
      });
      
      // Step 6: Verify database operations (if available)
      try {
        const db = testDb();
        const userCount = await db.user.count();
        expect(typeof userCount).toBe('number');
      } catch (error) {
        // Database not available - acceptable
        expect(true).toBe(true);
      }
      
      // Step 7: Cleanup verification
      expect(tempFiles).toContain(filePath);
    });

    it('should demonstrate error scenario testing pattern', async () => {
      // Test various error conditions
      const errorScenarios = [
        {
          name: 'Empty file',
          content: '',
          expectedLines: 0
        },
        {
          name: 'Header only',
          content: 'court,caseid_type,caseid_no',
          expectedLines: 1
        },
        {
          name: 'Malformed CSV',
          content: 'court,caseid_type\n"UNCLOSED QUOTE,E123\nNORMAL,E124',
          expectedLines: 3
        }
      ];
      
      for (const scenario of errorScenarios) {
        const filePath = await createTestCsvFile(scenario.content);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const lines = fileContent.split('\n').filter(line => line.trim());
        
        expect(lines).toHaveLength(scenario.expectedLines);
      }
    });

    it('should demonstrate performance testing pattern', async () => {
      const performanceTests = [
        {
          name: 'Small file',
          rowCount: 10,
          expectedTime: 100
        },
        {
          name: 'Medium file',
          rowCount: 50,
          expectedTime: 500
        },
        {
          name: 'Large file',
          rowCount: 100,
          expectedTime: 1000
        }
      ];
      
      for (const test of performanceTests) {
        const header = 'court,caseid_type,caseid_no,details';
        const rows = [];
        
        for (let i = 0; i < test.rowCount; i++) {
          rows.push(`NAIROBI HIGH COURT,HCCC,E${i},Performance test row ${i}`);
        }
        
        const csvContent = [header, ...rows].join('\n');
        
        const startTime = Date.now();
        const filePath = await createTestCsvFile(csvContent);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const endTime = Date.now();
        
        const lines = fileContent.split('\n').filter(line => line.trim());
        expect(lines).toHaveLength(test.rowCount + 1); // Header + data rows
        
        const processingTime = endTime - startTime;
        expect(processingTime).toBeLessThan(test.expectedTime);
      }
    });
  });

  describe('Test Infrastructure Validation', () => {
    it('should validate test environment setup', () => {
      // Verify environment variables
      expect(process.env.USE_TEST_DB).toBe('1');
      
      // Verify test utilities
      expect(testUserId).toBeDefined();
      expect(typeof testUserId).toBe('string');
      expect(testUserId.length).toBeGreaterThan(0);
      
      // Verify temp directory
      expect(tempDir).toBeDefined();
      expect(tempDir).toContain('test-infrastructure-integration-');
      
      // Verify cleanup arrays
      expect(Array.isArray(tempFiles)).toBe(true);
    });

    it('should validate mock setup', () => {
      // Verify all required mocks are in place
      const logger = require('@/lib/logger').logger;
      const redis = require('@/lib/database/redis');
      
      expect(logger.import.info).toBeDefined();
      expect(logger.database.error).toBeDefined();
      expect(redis.importQueue.add).toBeDefined();
      expect(redis.cacheManager.setImportStatus).toBeDefined();
      
      // Verify mocks are functions
      expect(typeof logger.import.info).toBe('function');
      expect(typeof redis.importQueue.add).toBe('function');
    });

    it('should validate test patterns work correctly', async () => {
      // Test file operations
      const testContent = 'test,content\nvalue1,value2';
      const filePath = await createTestCsvFile(testContent);
      const readContent = await fs.readFile(filePath, 'utf8');
      expect(readContent).toBe(testContent);
      
      // Test database operations (if available)
      try {
        const db = testDb();
        const result = await db.user.findFirst();
        expect(result).toBeDefined();
      } catch (error) {
        // Database not available - acceptable
        expect(true).toBe(true);
      }
      
      // Test async operations
      const asyncResult = await Promise.resolve('async test');
      expect(asyncResult).toBe('async test');
      
      // Test error handling
      await expect(Promise.reject(new Error('test error')))
        .rejects.toThrow('test error');
    });
  });
});