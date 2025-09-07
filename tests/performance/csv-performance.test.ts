/**
 * Performance benchmarks for CSV processing
 * 
 * These tests establish baseline performance metrics and ensure
 * no regression after optimizations.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { performance } from 'perf_hooks';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { csvParser } from '../../src/lib/csv/parser';
import { validator } from '../../src/lib/csv/validator';
import { importService } from '../../src/lib/csv/import-service';
// No database setup needed for performance tests

describe('CSV Performance Benchmarks', () => {
  const testDataDir = join(process.cwd(), 'tests', 'performance', 'data');
  const smallFile = join(testDataDir, 'small-test.csv');
  const mediumFile = join(testDataDir, 'medium-test.csv');
  const largeFile = join(testDataDir, 'large-test.csv');

  beforeAll(async () => {
    // Create test data directory
    const fs = require('fs');
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir, { recursive: true });
    }

    // Generate test CSV files of different sizes
    generateTestCsvFile(smallFile, 100);
    generateTestCsvFile(mediumFile, 1000);
    generateTestCsvFile(largeFile, 5000);
  });

  afterAll(async () => {
    // Clean up test files
    try {
      unlinkSync(smallFile);
      unlinkSync(mediumFile);
      unlinkSync(largeFile);
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('Parser Performance', () => {
    it('should parse small file (100 rows) within performance threshold', async () => {
      const startTime = performance.now();
      const result = await csvParser.parseFile(smallFile);
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      expect(result).toHaveLength(100);
      expect(duration).toBeLessThan(100); // Should complete in under 100ms
      
      console.log(`Small file parsing: ${duration.toFixed(2)}ms for 100 rows`);
    });

    it('should parse medium file (1000 rows) within performance threshold', async () => {
      const startTime = performance.now();
      const result = await csvParser.parseFile(mediumFile);
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      expect(result).toHaveLength(1000);
      expect(duration).toBeLessThan(500); // Should complete in under 500ms
      
      console.log(`Medium file parsing: ${duration.toFixed(2)}ms for 1000 rows`);
    });

    it('should parse large file (5000 rows) within performance threshold', async () => {
      const startTime = performance.now();
      const result = await csvParser.parseFile(largeFile);
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      expect(result).toHaveLength(5000);
      expect(duration).toBeLessThan(2000); // Should complete in under 2 seconds
      
      console.log(`Large file parsing: ${duration.toFixed(2)}ms for 5000 rows`);
    });

    it('should have consistent memory usage for large files', async () => {
      const initialMemory = process.memoryUsage();
      
      await csvParser.parseFile(largeFile);
      
      const afterParsingMemory = process.memoryUsage();
      const memoryIncrease = afterParsingMemory.heapUsed - initialMemory.heapUsed;
      
      // Memory increase should be reasonable (less than 50MB for 5000 rows)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
      
      console.log(`Memory increase for large file: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    });
  });

  describe('Validation Performance', () => {
    it('should validate small batch within performance threshold', async () => {
      const rows = await csvParser.parseFile(smallFile);
      
      const startTime = performance.now();
      const result = validator.validateBatch(rows);
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(200); // Should complete in under 200ms
      
      console.log(`Small batch validation: ${duration.toFixed(2)}ms for 100 rows`);
    });

    it('should validate medium batch within performance threshold', async () => {
      const rows = await csvParser.parseFile(mediumFile);
      
      const startTime = performance.now();
      const result = validator.validateBatch(rows);
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(1000); // Should complete in under 1 second
      
      console.log(`Medium batch validation: ${duration.toFixed(2)}ms for 1000 rows`);
    });
  });

  describe('Memory Usage Benchmarks', () => {
    it('should not leak memory during repeated parsing', async () => {
      const initialMemory = process.memoryUsage();
      
      // Parse the same file multiple times
      for (let i = 0; i < 10; i++) {
        await csvParser.parseFile(mediumFile);
        
        // Force garbage collection if available
        if (global.gc) {
          global.gc();
        }
      }
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      // Memory increase should be minimal (less than 10MB after 10 iterations)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
      
      console.log(`Memory increase after 10 iterations: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
    });
  });
});

/**
 * Generate a test CSV file with the specified number of rows
 */
function generateTestCsvFile(filePath: string, rowCount: number): void {
  const headers = [
    'court', 'date_dd', 'date_mon', 'date_yyyy', 'caseid_type', 'caseid_no',
    'filed_dd', 'filed_mon', 'filed_yyyy', 'original_court', 'original_code',
    'original_number', 'original_year', 'case_type', 'judge_1', 'judge_2',
    'judge_3', 'judge_4', 'judge_5', 'judge_6', 'judge_7', 'comingfor',
    'outcome', 'reason_adj', 'next_dd', 'next_mon', 'next_yyyy',
    'male_applicant', 'female_applicant', 'organization_applicant',
    'male_defendant', 'female_defendant', 'organization_defendant',
    'legalrep', 'applicant_witness', 'defendant_witness', 'custody', 'other_details'
  ];

  let csvContent = headers.join(',') + '\n';

  for (let i = 1; i <= rowCount; i++) {
    const row = [
      'Nairobi High Court',
      String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'),
      String(Math.floor(Math.random() * 12) + 1).padStart(2, '0'),
      '2024',
      'HC',
      String(i).padStart(4, '0'),
      String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'),
      String(Math.floor(Math.random() * 12) + 1).padStart(2, '0'),
      '2024',
      '',
      '',
      '',
      '',
      'Civil',
      `Judge ${Math.floor(Math.random() * 10) + 1}`,
      '',
      '',
      '',
      '',
      '',
      '',
      'Hearing',
      Math.random() > 0.5 ? 'Adjourned' : 'Concluded',
      Math.random() > 0.7 ? 'Lack of time' : '',
      '',
      '',
      '',
      String(Math.floor(Math.random() * 3)),
      String(Math.floor(Math.random() * 3)),
      String(Math.floor(Math.random() * 2)),
      String(Math.floor(Math.random() * 3)),
      String(Math.floor(Math.random() * 3)),
      String(Math.floor(Math.random() * 2)),
      Math.random() > 0.5 ? 'Yes' : 'No',
      String(Math.floor(Math.random() * 5)),
      String(Math.floor(Math.random() * 5)),
      String(Math.floor(Math.random() * 3)),
      ''
    ];
    
    csvContent += row.join(',') + '\n';
  }

  writeFileSync(filePath, csvContent);
}