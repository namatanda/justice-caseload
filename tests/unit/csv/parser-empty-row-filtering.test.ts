/**
 * Unit tests for CSV Parser with Empty Row Filtering
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { CsvParserImpl } from '../../../src/lib/csv/parser';
import { DEFAULT_EMPTY_ROW_CONFIG } from '../../../src/lib/csv/utils/empty-row-detector';

describe('CsvParser with Empty Row Filtering', () => {
  let parser: CsvParserImpl;
  let testFilePath: string;

  beforeEach(() => {
    parser = new CsvParserImpl();
    testFilePath = join(process.cwd(), 'test-empty-rows.csv');
  });

  afterEach(() => {
    if (existsSync(testFilePath)) {
      unlinkSync(testFilePath);
    }
  });

  test('filters out rows with all empty fields', async () => {
    const csvContent = `field1,field2,field3
data1,data2,data3
,,
valid,data,here
N/A,,   
another,valid,row
,NULL,`;

    writeFileSync(testFilePath, csvContent);

    const result = await parser.parseFileWithFiltering(testFilePath);

    expect(result.validRows).toHaveLength(3);
    expect(result.emptyRowStats.totalEmptyRows).toBe(3);
    expect(result.totalRowsParsed).toBe(6);

    // Check that valid rows are preserved
    expect(result.validRows[0]).toEqual({ field1: 'data1', field2: 'data2', field3: 'data3' });
    expect(result.validRows[1]).toEqual({ field1: 'valid', field2: 'data', field3: 'here' });
    expect(result.validRows[2]).toEqual({ field1: 'another', field2: 'valid', field3: 'row' });
  });

  test('handles file with no empty rows', async () => {
    const csvContent = `field1,field2,field3
data1,data2,data3
valid,data,here
another,valid,row`;

    writeFileSync(testFilePath, csvContent);

    const result = await parser.parseFileWithFiltering(testFilePath);

    expect(result.validRows).toHaveLength(3);
    expect(result.emptyRowStats.totalEmptyRows).toBe(0);
    expect(result.totalRowsParsed).toBe(3);
  });

  test('handles file with all empty rows', async () => {
    const csvContent = `field1,field2,field3
,,
N/A,NULL,   
,,-`;

    writeFileSync(testFilePath, csvContent);

    const result = await parser.parseFileWithFiltering(testFilePath);

    expect(result.validRows).toHaveLength(0);
    expect(result.emptyRowStats.totalEmptyRows).toBe(3);
    expect(result.totalRowsParsed).toBe(3);
  });

  test('handles trailing empty rows like test_data.csv', async () => {
    const csvContent = `field1,field2,field3
data1,data2,data3
valid,data,here
,,
,,
,,`;

    writeFileSync(testFilePath, csvContent);

    const result = await parser.parseFileWithFiltering(testFilePath);

    expect(result.validRows).toHaveLength(2);
    expect(result.emptyRowStats.totalEmptyRows).toBe(3);
    expect(result.totalRowsParsed).toBe(5);
  });

  test('handles interspersed empty rows', async () => {
    const csvContent = `field1,field2,field3
data1,data2,data3
,,
valid,data,here
   ,N/A,
another,valid,row
,NULL,   `;

    writeFileSync(testFilePath, csvContent);

    const result = await parser.parseFileWithFiltering(testFilePath);

    expect(result.validRows).toHaveLength(3);
    expect(result.emptyRowStats.totalEmptyRows).toBe(3);
    expect(result.totalRowsParsed).toBe(6);
  });

  test('respects custom empty row configuration', async () => {
    const csvContent = `field1,field2,field3
data1,data2,data3
CUSTOM_EMPTY,BLANK,VOID
valid,data,here`;

    writeFileSync(testFilePath, csvContent);

    const customConfig = {
      ...DEFAULT_EMPTY_ROW_CONFIG,
      customEmptyValues: ['CUSTOM_EMPTY', 'BLANK', 'VOID']
    };

    const result = await parser.parseFileWithFiltering(testFilePath, customConfig);

    expect(result.validRows).toHaveLength(2);
    expect(result.emptyRowStats.totalEmptyRows).toBe(1);
    expect(result.totalRowsParsed).toBe(3);
  });

  test('maintains backward compatibility with parseFile method', async () => {
    const csvContent = `field1,field2,field3
data1,data2,data3
,,
valid,data,here`;

    writeFileSync(testFilePath, csvContent);

    const originalResult = await parser.parseFile(testFilePath);
    const filteredResult = await parser.parseFileWithFiltering(testFilePath);

    // Original method should return all rows including empty ones
    expect(originalResult).toHaveLength(3);
    
    // Filtered method should return only valid rows
    expect(filteredResult.validRows).toHaveLength(2);
    expect(filteredResult.emptyRowStats.totalEmptyRows).toBe(1);
  });

  test('tracks empty row numbers for debugging', async () => {
    const csvContent = `field1,field2,field3
data1,data2,data3
,,
valid,data,here
   ,N/A,
another,valid,row`;

    writeFileSync(testFilePath, csvContent);

    const result = await parser.parseFileWithFiltering(testFilePath);

    expect(result.emptyRowStats.emptyRowNumbers).toEqual([2, 4]);
  });

  test('handles edge cases with quotes and special characters', async () => {
    const csvContent = `field1,field2,field3
"data1","data2","data3"
"","",""
"valid","data","here"
"   ","N/A","   "`;

    writeFileSync(testFilePath, csvContent);

    const result = await parser.parseFileWithFiltering(testFilePath);

    expect(result.validRows).toHaveLength(2);
    expect(result.emptyRowStats.totalEmptyRows).toBe(2);
    expect(result.totalRowsParsed).toBe(4);
  });
});