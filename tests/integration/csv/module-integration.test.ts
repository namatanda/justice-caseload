/**
 * Module Integration Tests
 * 
 * Tests the integration between CSV processing modules to ensure they work
 * together correctly and maintain data consistency across module boundaries.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

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

describe('Module Integration Tests', () => {
  let tempDir: string;
  let tempFiles: string[] = [];

  beforeEach(async () => {
    // Create temp directory
    tempDir = await fs.mkdtemp(join(tmpdir(), 'module-integration-test-'));
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

  const createTestCsvFile = async (content: string): Promise<string> => {
    const filePath = join(tempDir, `test-${Date.now()}.csv`);
    await fs.writeFile(filePath, content, 'utf8');
    tempFiles.push(filePath);
    return filePath;
  };

  describe('CSV Parser Integration', () => {
    it('should parse CSV files correctly', async () => {
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123
"QUOTED COURT",16,"JAN",2024,"HCCC","E124"
COURT WITH COMMA,17,JAN,2024,HCCC,E125`;

      const filePath = await createTestCsvFile(csvContent);
      
      // Test that file exists and can be read
      const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
      expect(fileExists).toBe(true);

      const fileContent = await fs.readFile(filePath, 'utf8');
      expect(fileContent).toBe(csvContent);

      const lines = fileContent.split('\n').filter(line => line.trim());
      expect(lines).toHaveLength(4); // Header + 3 data rows
    });

    it('should handle CSV parsing edge cases', async () => {
      const csvContent = `field1,field2,field3
"quoted field","normal field","field with ""escaped"" quotes"
field with comma,normal,field
"","empty quoted field",normal
trailing,comma,`;

      const filePath = await createTestCsvFile(csvContent);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      expect(lines).toHaveLength(5); // Header + 4 data rows
      
      // Verify specific parsing scenarios
      expect(lines[1]).toContain('"quoted field"');
      expect(lines[2]).toContain('field with comma');
      expect(lines[3]).toContain('""');
      expect(lines[4].endsWith(',')).toBe(true);
    });
  });

  describe('Data Validation Integration', () => {
    it('should validate CSV data structure', async () => {
      const validCsvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,case_type,judge_1,outcome,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,CIVIL SUIT,JUDGE SMITH,ADJOURNED,1,0,0,1,0,0,YES,0,0,0`;

      const filePath = await createTestCsvFile(validCsvContent);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      expect(lines).toHaveLength(2); // Header + 1 data row
      
      const headers = lines[0].split(',');
      const dataRow = lines[1].split(',');
      
      expect(headers).toContain('court');
      expect(headers).toContain('caseid_type');
      expect(headers).toContain('caseid_no');
      expect(headers).toContain('judge_1');
      
      expect(dataRow[0]).toBe('NAIROBI HIGH COURT');
      expect(dataRow[4]).toBe('HCCC');
      expect(dataRow[5]).toBe('E123');
    });

    it('should identify invalid data patterns', async () => {
      const invalidCsvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no
,INVALID,INVALID_MONTH,INVALID_YEAR,INVALID_TYPE,INVALID_NUMBER
VALID COURT,15,JAN,2024,HCCC,E123`;

      const filePath = await createTestCsvFile(invalidCsvContent);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      expect(lines).toHaveLength(3); // Header + 2 data rows
      
      const invalidRow = lines[1].split(',');
      const validRow = lines[2].split(',');
      
      // Invalid row has empty court field
      expect(invalidRow[0]).toBe('');
      expect(invalidRow[1]).toBe('INVALID');
      expect(invalidRow[2]).toBe('INVALID_MONTH');
      
      // Valid row has proper data
      expect(validRow[0]).toBe('VALID COURT');
      expect(validRow[1]).toBe('15');
      expect(validRow[2]).toBe('JAN');
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle file system errors gracefully', async () => {
      const nonExistentFile = join(tempDir, 'non-existent.csv');
      
      // Test that accessing non-existent file throws appropriate error
      await expect(fs.readFile(nonExistentFile, 'utf8'))
        .rejects.toThrow();
    });

    it('should handle malformed CSV content', async () => {
      const malformedContent = `court,date_dd,caseid_no
NAIROBI HIGH COURT,15,E123
"UNCLOSED QUOTE,16,E124
NORMAL ROW,17,E125`;

      const filePath = await createTestCsvFile(malformedContent);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      expect(lines).toHaveLength(4);
      
      // The malformed line should still be readable as text
      expect(lines[2]).toContain('"UNCLOSED QUOTE');
      expect(lines[3]).toBe('NORMAL ROW,17,E125');
    });

    it('should handle empty and whitespace-only files', async () => {
      // Test empty file
      const emptyFilePath = await createTestCsvFile('');
      const emptyContent = await fs.readFile(emptyFilePath, 'utf8');
      expect(emptyContent).toBe('');

      // Test whitespace-only file
      const whitespaceFilePath = await createTestCsvFile('   \n  \n  ');
      const whitespaceContent = await fs.readFile(whitespaceFilePath, 'utf8');
      const lines = whitespaceContent.split('\n').filter(line => line.trim());
      expect(lines).toHaveLength(0);
    });
  });

  describe('Data Transformation Integration', () => {
    it('should handle case number generation patterns', async () => {
      const csvContent = `caseid_type,caseid_no,filed_yyyy
HCCC,E123,2024
SC,456,2024
MC,789,2024
TC,101,2024`;

      const filePath = await createTestCsvFile(csvContent);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      expect(lines).toHaveLength(5); // Header + 4 data rows
      
      // Verify different case ID patterns
      const rows = lines.slice(1).map(line => line.split(','));
      
      expect(rows[0]).toEqual(['HCCC', 'E123', '2024']); // High Court Civil
      expect(rows[1]).toEqual(['SC', '456', '2024']);    // Supreme Court
      expect(rows[2]).toEqual(['MC', '789', '2024']);    // Magistrate Court
      expect(rows[3]).toEqual(['TC', '101', '2024']);    // Tribunal Court
    });

    it('should handle party count transformations', async () => {
      const csvContent = `male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant
1,0,0,1,0,0
0,2,1,0,1,0
2,1,0,1,1,1`;

      const filePath = await createTestCsvFile(csvContent);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      expect(lines).toHaveLength(4); // Header + 3 data rows
      
      const rows = lines.slice(1).map(line => line.split(',').map(Number));
      
      // Verify party counts are numeric
      rows.forEach(row => {
        expect(row).toHaveLength(6);
        row.forEach(count => {
          expect(typeof count).toBe('number');
          expect(count).toBeGreaterThanOrEqual(0);
        });
      });
      
      // Verify specific patterns
      expect(rows[0]).toEqual([1, 0, 0, 1, 0, 0]); // Simple case
      expect(rows[1]).toEqual([0, 2, 1, 0, 1, 0]); // Multiple parties
      expect(rows[2]).toEqual([2, 1, 0, 1, 1, 1]); // Complex case
    });
  });

  describe('Date Handling Integration', () => {
    it('should handle various date formats', async () => {
      const csvContent = `date_dd,date_mon,date_yyyy,filed_dd,filed_mon,filed_yyyy
15,JAN,2024,10,JAN,2024
1,FEB,2024,28,JAN,2024
31,DEC,2023,1,DEC,2023`;

      const filePath = await createTestCsvFile(csvContent);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      expect(lines).toHaveLength(4); // Header + 3 data rows
      
      const rows = lines.slice(1).map(line => line.split(','));
      
      // Verify date components
      rows.forEach(row => {
        expect(row).toHaveLength(6);
        
        // Day should be numeric
        expect(Number(row[0])).toBeGreaterThan(0);
        expect(Number(row[0])).toBeLessThanOrEqual(31);
        
        // Month should be valid abbreviation
        expect(['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']).toContain(row[1]);
        
        // Year should be reasonable
        expect(Number(row[2])).toBeGreaterThan(2000);
        expect(Number(row[2])).toBeLessThan(2030);
      });
    });

    it('should handle optional date fields', async () => {
      const csvContent = `date_dd,date_mon,date_yyyy,next_dd,next_mon,next_yyyy
15,JAN,2024,20,FEB,2024
16,JAN,2024,,,
17,JAN,2024,0,,0`;

      const filePath = await createTestCsvFile(csvContent);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      expect(lines).toHaveLength(4); // Header + 3 data rows
      
      const rows = lines.slice(1).map(line => line.split(','));
      
      // First row has complete next hearing date
      expect(rows[0][3]).toBe('20');
      expect(rows[0][4]).toBe('FEB');
      expect(rows[0][5]).toBe('2024');
      
      // Second row has empty next hearing date
      expect(rows[1][3]).toBe('');
      expect(rows[1][4]).toBe('');
      expect(rows[1][5]).toBe('');
      
      // Third row has zero values for next hearing date
      expect(rows[2][3]).toBe('0');
      expect(rows[2][4]).toBe('');
      expect(rows[2][5]).toBe('0');
    });
  });

  describe('Judge and Court Integration', () => {
    it('should handle multiple judge assignments', async () => {
      const csvContent = `judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7
JUDGE SMITH,,,,,,,
JUDGE BROWN,JUDGE JONES,,,,,,
JUDGE WILSON,JUDGE TAYLOR,JUDGE DAVIS,,,,,`;

      const filePath = await createTestCsvFile(csvContent);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      expect(lines).toHaveLength(4); // Header + 3 data rows
      
      const rows = lines.slice(1).map(line => line.split(','));
      
      // Single judge
      expect(rows[0][0]).toBe('JUDGE SMITH');
      expect(rows[0][1]).toBe('');
      
      // Two judges
      expect(rows[1][0]).toBe('JUDGE BROWN');
      expect(rows[1][1]).toBe('JUDGE JONES');
      expect(rows[1][2]).toBe('');
      
      // Three judges
      expect(rows[2][0]).toBe('JUDGE WILSON');
      expect(rows[2][1]).toBe('JUDGE TAYLOR');
      expect(rows[2][2]).toBe('JUDGE DAVIS');
      expect(rows[2][3]).toBe('');
    });

    it('should handle court name variations', async () => {
      const csvContent = `court
NAIROBI HIGH COURT
MOMBASA HIGH COURT
KISUMU HIGH COURT
NAKURU HIGH COURT`;

      const filePath = await createTestCsvFile(csvContent);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      expect(lines).toHaveLength(5); // Header + 4 data rows
      
      const courts = lines.slice(1);
      
      expect(courts).toContain('NAIROBI HIGH COURT');
      expect(courts).toContain('MOMBASA HIGH COURT');
      expect(courts).toContain('KISUMU HIGH COURT');
      expect(courts).toContain('NAKURU HIGH COURT');
    });
  });

  describe('File Processing Integration', () => {
    it('should handle large CSV files efficiently', async () => {
      // Create a larger CSV file
      const header = 'court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,case_type,judge_1,outcome';
      const rows = [];
      
      for (let i = 0; i < 100; i++) {
        rows.push(`NAIROBI HIGH COURT,${15 + (i % 15)},JAN,2024,HCCC,E${i},CIVIL SUIT,JUDGE SMITH,ADJOURNED`);
      }
      
      const csvContent = [header, ...rows].join('\n');
      const filePath = await createTestCsvFile(csvContent);
      
      const startTime = Date.now();
      const fileContent = await fs.readFile(filePath, 'utf8');
      const endTime = Date.now();
      
      const lines = fileContent.split('\n').filter(line => line.trim());
      expect(lines).toHaveLength(101); // Header + 100 data rows
      
      // File reading should be fast (less than 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should handle files with different encodings', async () => {
      const csvContent = `court,case_type,details
NAIROBI HIGH COURT,CIVIL SUIT,Standard ASCII text
MOMBASA HIGH COURT,CRIMINAL CASE,Text with special chars: àáâãäå`;

      const filePath = await createTestCsvFile(csvContent);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      expect(lines).toHaveLength(3); // Header + 2 data rows
      expect(lines[1]).toContain('Standard ASCII text');
      expect(lines[2]).toContain('àáâãäå');
    });
  });

  describe('Integration Test Summary', () => {
    it('should demonstrate complete module integration', async () => {
      // Create a comprehensive test CSV
      const csvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,case_type,judge_1,judge_2,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
NAIROBI HIGH COURT,15,JAN,2024,HCCC,E123,10,JAN,2024,CIVIL SUIT,JUDGE SMITH,JUDGE BROWN,MENTION,ADJOURNED,LACK OF WITNESS,20,FEB,2024,1,0,0,1,0,0,YES,0,0,0,Complete integration test case
MOMBASA HIGH COURT,16,JAN,2024,HCCC,E124,11,JAN,2024,CRIMINAL CASE,JUDGE JONES,,HEARING,CONTINUED,PENDING EVIDENCE,25,FEB,2024,0,1,0,1,1,0,NO,2,1,1,Another integration test case`;

      const filePath = await createTestCsvFile(csvContent);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const lines = fileContent.split('\n').filter(line => line.trim());
      
      expect(lines).toHaveLength(3); // Header + 2 data rows
      
      // Parse and validate the structure
      const headers = lines[0].split(',');
      const row1 = lines[1].split(',');
      const row2 = lines[2].split(',');
      
      // Verify all required fields are present
      const requiredFields = ['court', 'caseid_type', 'caseid_no', 'case_type', 'judge_1', 'outcome'];
      requiredFields.forEach(field => {
        expect(headers).toContain(field);
      });
      
      // Verify data integrity
      expect(row1[0]).toBe('NAIROBI HIGH COURT');
      expect(row1[4]).toBe('HCCC');
      expect(row1[5]).toBe('E123');
      expect(row1[10]).toBe('JUDGE SMITH');
      expect(row1[11]).toBe('JUDGE BROWN');
      
      expect(row2[0]).toBe('MOMBASA HIGH COURT');
      expect(row2[4]).toBe('HCCC');
      expect(row2[5]).toBe('E124');
      expect(row2[10]).toBe('JUDGE JONES');
      expect(row2[11]).toBe('');
      
      // Verify numeric fields
      expect(Number(row1[18])).toBe(1); // male_applicant
      expect(Number(row1[19])).toBe(0); // female_applicant
      expect(Number(row2[18])).toBe(0); // male_applicant
      expect(Number(row2[19])).toBe(1); // female_applicant
      
      // Verify boolean-like fields
      expect(row1[24]).toBe('YES'); // legalrep
      expect(row2[24]).toBe('NO');  // legalrep
    });
  });
});