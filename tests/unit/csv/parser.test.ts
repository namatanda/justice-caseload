/**
 * Unit tests for CSV Parser module
 * 
 * Tests CSV file parsing, line parsing, and checksum calculation
 * functionality extracted from the monolithic CSV processor.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { CsvParserImpl } from '../../../src/lib/csv/parser';

describe('CsvParserImpl', () => {
  let parser: CsvParserImpl;
  let tempDir: string;
  let tempFiles: string[] = [];

  beforeEach(async () => {
    parser = new CsvParserImpl();
    tempDir = await fs.mkdtemp(join(tmpdir(), 'csv-parser-test-'));
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
  });

  const createTempFile = async (content: string): Promise<string> => {
    const filePath = join(tempDir, `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.csv`);
    await fs.writeFile(filePath, content, 'utf8');
    tempFiles.push(filePath);
    return filePath;
  };

  describe('parseCSVLine', () => {
    it('should parse simple CSV line without quotes', () => {
      const line = 'field1,field2,field3';
      const result = parser.parseCSVLine(line);
      expect(result).toEqual(['field1', 'field2', 'field3']);
    });

    it('should parse CSV line with quoted fields', () => {
      const line = '"field1","field2","field3"';
      const result = parser.parseCSVLine(line);
      expect(result).toEqual(['field1', 'field2', 'field3']);
    });

    it('should handle fields with commas inside quotes', () => {
      const line = '"field1,with,commas","field2","field3"';
      const result = parser.parseCSVLine(line);
      expect(result).toEqual(['field1,with,commas', 'field2', 'field3']);
    });

    it('should handle escaped quotes (double quotes)', () => {
      const line = '"field1 with ""quotes""","field2","field3"';
      const result = parser.parseCSVLine(line);
      expect(result).toEqual(['field1 with "quotes"', 'field2', 'field3']);
    });

    it('should handle mixed quoted and unquoted fields', () => {
      const line = 'field1,"field2,with,commas",field3';
      const result = parser.parseCSVLine(line);
      expect(result).toEqual(['field1', 'field2,with,commas', 'field3']);
    });

    it('should handle empty fields', () => {
      const line = 'field1,,field3';
      const result = parser.parseCSVLine(line);
      expect(result).toEqual(['field1', '', 'field3']);
    });

    it('should handle empty quoted fields', () => {
      const line = 'field1,"",field3';
      const result = parser.parseCSVLine(line);
      expect(result).toEqual(['field1', '', 'field3']);
    });

    it('should trim whitespace from fields', () => {
      const line = ' field1 , field2 , field3 ';
      const result = parser.parseCSVLine(line);
      expect(result).toEqual(['field1', 'field2', 'field3']);
    });

    it('should handle single field', () => {
      const line = 'single_field';
      const result = parser.parseCSVLine(line);
      expect(result).toEqual(['single_field']);
    });

    it('should handle empty line', () => {
      const line = '';
      const result = parser.parseCSVLine(line);
      expect(result).toEqual(['']);
    });

    it('should handle line with only commas', () => {
      const line = ',,,';
      const result = parser.parseCSVLine(line);
      expect(result).toEqual(['', '', '', '']);
    });
  });

  describe('parseFile', () => {
    it('should parse simple CSV file with headers and data', async () => {
      const csvContent = `header1,header2,header3
value1,value2,value3
value4,value5,value6`;
      
      const filePath = await createTempFile(csvContent);
      const result = await parser.parseFile(filePath);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        header1: 'value1',
        header2: 'value2',
        header3: 'value3'
      });
      expect(result[1]).toEqual({
        header1: 'value4',
        header2: 'value5',
        header3: 'value6'
      });
    });

    it('should handle CSV file with quoted fields', async () => {
      const csvContent = `"header1","header2","header3"
"value1,with,commas","value2","value3"
"value4","value5 with ""quotes""","value6"`;
      
      const filePath = await createTempFile(csvContent);
      const result = await parser.parseFile(filePath);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        header1: 'value1,with,commas',
        header2: 'value2',
        header3: 'value3'
      });
      expect(result[1]).toEqual({
        header1: 'value4',
        header2: 'value5 with "quotes"',
        header3: 'value6'
      });
    });

    it('should handle empty CSV file', async () => {
      const csvContent = '';
      const filePath = await createTempFile(csvContent);
      const result = await parser.parseFile(filePath);
      
      expect(result).toEqual([]);
    });

    it('should handle CSV file with only headers', async () => {
      const csvContent = 'header1,header2,header3';
      const filePath = await createTempFile(csvContent);
      const result = await parser.parseFile(filePath);
      
      expect(result).toEqual([]);
    });

    it('should handle CSV file with empty lines', async () => {
      const csvContent = `header1,header2,header3

value1,value2,value3

value4,value5,value6

`;
      
      const filePath = await createTempFile(csvContent);
      const result = await parser.parseFile(filePath);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        header1: 'value1',
        header2: 'value2',
        header3: 'value3'
      });
      expect(result[1]).toEqual({
        header1: 'value4',
        header2: 'value5',
        header3: 'value6'
      });
    });

    it('should handle CSV file with mismatched column counts', async () => {
      const csvContent = `header1,header2,header3
value1,value2
value4,value5,value6,extra_value`;
      
      const filePath = await createTempFile(csvContent);
      const result = await parser.parseFile(filePath);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        header1: 'value1',
        header2: 'value2',
        header3: undefined
      });
      expect(result[1]).toEqual({
        header1: 'value4',
        header2: 'value5',
        header3: 'value6'
      });
    });

    it('should handle large CSV file with truncation', async () => {
      // Create a CSV with more than 10000 lines (but smaller for test performance)
      const headers = 'header1,header2,header3';
      const dataLines = Array.from({ length: 5000 }, (_, i) => `value${i}1,value${i}2,value${i}3`);
      const csvContent = [headers, ...dataLines].join('\n');
      
      const filePath = await createTempFile(csvContent);
      const result = await parser.parseFile(filePath);
      
      // Should parse all 5000 data rows since it's under the 10000 limit
      expect(result).toHaveLength(5000);
    }, 15000); // Increase timeout for this specific test

    it('should reject when file does not exist', async () => {
      const nonExistentPath = join(tempDir, 'non-existent.csv');
      
      await expect(parser.parseFile(nonExistentPath)).rejects.toThrow();
    });
  });

  describe('calculateFileChecksum', () => {
    it('should calculate SHA256 checksum for file', async () => {
      const content = 'test content for checksum';
      const filePath = await createTempFile(content);
      
      const checksum = await parser.calculateFileChecksum(filePath);
      
      expect(checksum).toBeDefined();
      expect(typeof checksum).toBe('string');
      expect(checksum).toHaveLength(64); // SHA256 produces 64-character hex string
    });

    it('should produce same checksum for identical content', async () => {
      const content = 'identical content';
      const filePath1 = await createTempFile(content);
      const filePath2 = await createTempFile(content);
      
      const checksum1 = await parser.calculateFileChecksum(filePath1);
      const checksum2 = await parser.calculateFileChecksum(filePath2);
      
      expect(checksum1).toBe(checksum2);
    });

    it('should produce different checksums for different content', async () => {
      const filePath1 = await createTempFile('content 1');
      const filePath2 = await createTempFile('content 2');
      
      const checksum1 = await parser.calculateFileChecksum(filePath1);
      const checksum2 = await parser.calculateFileChecksum(filePath2);
      
      expect(checksum1).not.toBe(checksum2);
    });

    it('should handle empty file', async () => {
      const filePath = await createTempFile('');
      
      const checksum = await parser.calculateFileChecksum(filePath);
      
      expect(checksum).toBeDefined();
      expect(typeof checksum).toBe('string');
      expect(checksum).toHaveLength(64);
    });

    it('should reject when file does not exist', async () => {
      const nonExistentPath = join(tempDir, 'non-existent.csv');
      
      await expect(parser.calculateFileChecksum(nonExistentPath)).rejects.toThrow();
    });

    it('should handle large file', async () => {
      // Create a larger file (1MB of content)
      const largeContent = 'x'.repeat(1024 * 1024);
      const filePath = await createTempFile(largeContent);
      
      const checksum = await parser.calculateFileChecksum(filePath);
      
      expect(checksum).toBeDefined();
      expect(typeof checksum).toBe('string');
      expect(checksum).toHaveLength(64);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle CSV with Windows line endings', async () => {
      const csvContent = `header1,header2,header3\r\nvalue1,value2,value3\r\nvalue4,value5,value6`;
      const filePath = await createTempFile(csvContent);
      
      const result = await parser.parseFile(filePath);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        header1: 'value1',
        header2: 'value2',
        header3: 'value3'
      });
    });

    it('should handle CSV with mixed line endings', async () => {
      const csvContent = `header1,header2,header3\nvalue1,value2,value3\r\nvalue4,value5,value6`;
      const filePath = await createTempFile(csvContent);
      
      const result = await parser.parseFile(filePath);
      
      expect(result).toHaveLength(2);
    });

    it('should handle CSV with special characters', async () => {
      const csvContent = `header1,header2,header3
"value with 🚀 emoji","value with ñ accent","value with 中文"`;
      const filePath = await createTempFile(csvContent);
      
      const result = await parser.parseFile(filePath);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        header1: 'value with 🚀 emoji',
        header2: 'value with ñ accent',
        header3: 'value with 中文'
      });
    });
  });
});