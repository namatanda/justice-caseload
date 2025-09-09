/**
 * Unit tests for Empty Row Detector
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { EmptyRowDetector, DEFAULT_EMPTY_ROW_CONFIG, type EmptyRowConfig } from '../../../src/lib/csv/utils/empty-row-detector';
import type { CsvRow } from '../../../src/lib/csv/types';

describe('EmptyRowDetector', () => {
    let detector: EmptyRowDetector;

    beforeEach(() => {
        detector = new EmptyRowDetector();
    });

    describe('isEmptyField', () => {
        test('detects empty string as empty', () => {
            expect(detector.isEmptyField('')).toBe(true);
        });

        test('detects null as empty when configured', () => {
            expect(detector.isEmptyField(null)).toBe(true);
        });

        test('detects undefined as empty when configured', () => {
            expect(detector.isEmptyField(undefined)).toBe(true);
        });

        test('detects whitespace-only string as empty when trimming enabled', () => {
            expect(detector.isEmptyField('   ')).toBe(true);
            expect(detector.isEmptyField('\t')).toBe(true);
            expect(detector.isEmptyField('\n')).toBe(true);
            expect(detector.isEmptyField('  \t\n  ')).toBe(true);
        });

        test('detects custom empty values', () => {
            expect(detector.isEmptyField('N/A')).toBe(true);
            expect(detector.isEmptyField('NULL')).toBe(true);
            expect(detector.isEmptyField('null')).toBe(true);
            expect(detector.isEmptyField('-')).toBe(true);
            expect(detector.isEmptyField('n/a')).toBe(true);
        });

        test('does not detect actual data as empty', () => {
            expect(detector.isEmptyField('data')).toBe(false);
            expect(detector.isEmptyField('0')).toBe(false);
            expect(detector.isEmptyField('false')).toBe(false);
            expect(detector.isEmptyField('123')).toBe(false);
        });

        test('respects trimWhitespace configuration', () => {
            const noTrimDetector = new EmptyRowDetector({
                ...DEFAULT_EMPTY_ROW_CONFIG,
                trimWhitespace: false
            });

            expect(noTrimDetector.isEmptyField('   ')).toBe(false);
            expect(noTrimDetector.isEmptyField('')).toBe(true);
        });
    });

    describe('isEmptyRow', () => {
        test('detects row with all empty strings as empty', () => {
            const row: CsvRow = { field1: '', field2: '', field3: '' };
            expect(detector.isEmptyRow(row)).toBe(true);
        });

        test('detects row with all whitespace-only fields as empty', () => {
            const row: CsvRow = { field1: '   ', field2: '\t', field3: '\n' };
            expect(detector.isEmptyRow(row)).toBe(true);
        });

        test('detects row with mixed empty representations as empty', () => {
            const row: CsvRow = { field1: '', field2: 'N/A', field3: '   ', field4: 'NULL' };
            expect(detector.isEmptyRow(row)).toBe(true);
        });

        test('does not detect row with actual data as empty', () => {
            const config: EmptyRowConfig = {
                ...DEFAULT_EMPTY_ROW_CONFIG,
                treatMissingCriticalFieldsAsEmpty: false // Disable critical fields check for this test
            };
            const testDetector = new EmptyRowDetector(config);
            
            const row: CsvRow = { field1: 'data', field2: '', field3: '' };
            expect(testDetector.isEmptyRow(row)).toBe(false);
        });

        test('detects empty row object as empty', () => {
            const row: CsvRow = {};
            expect(detector.isEmptyRow(row)).toBe(true);
        });

        test('tracks empty row statistics', () => {
            const row1: CsvRow = { field1: '', field2: '' };
            const row2: CsvRow = { field1: 'data', field2: '' };
            const row3: CsvRow = { field1: 'N/A', field2: '   ' };

            detector.isEmptyRow(row1, 1);
            detector.isEmptyRow(row2, 2);
            detector.isEmptyRow(row3, 3);

            const stats = detector.getEmptyRowStats();
            expect(stats.totalEmptyRows).toBe(2);
            expect(stats.emptyRowNumbers).toEqual([1, 3]);
        });
    });

    describe('statistics tracking', () => {
        test('tracks empty row count correctly', () => {
            const emptyRow1: CsvRow = { field1: '', field2: '' };
            const emptyRow2: CsvRow = { field1: 'N/A', field2: '   ' };
            const validRow: CsvRow = { field1: 'data', field2: 'value' };

            detector.isEmptyRow(emptyRow1);
            detector.isEmptyRow(validRow);
            detector.isEmptyRow(emptyRow2);

            const stats = detector.getEmptyRowStats();
            expect(stats.totalEmptyRows).toBe(2);
        });

        test('resets statistics correctly', () => {
            const emptyRow: CsvRow = { field1: '', field2: '' };
            detector.isEmptyRow(emptyRow, 1);

            let stats = detector.getEmptyRowStats();
            expect(stats.totalEmptyRows).toBe(1);

            detector.resetStats();
            stats = detector.getEmptyRowStats();
            expect(stats.totalEmptyRows).toBe(0);
            expect(stats.emptyRowNumbers).toEqual([]);
        });
    });

    describe('configuration', () => {
        test('allows custom configuration', () => {
            const customConfig: EmptyRowConfig = {
                trimWhitespace: false,
                treatNullAsEmpty: false,
                treatUndefinedAsEmpty: false,
                customEmptyValues: ['EMPTY', 'BLANK'],
                treatMissingCriticalFieldsAsEmpty: false,
                criticalFields: []
            };

            const customDetector = new EmptyRowDetector(customConfig);

            expect(customDetector.isEmptyField('   ')).toBe(false);
            expect(customDetector.isEmptyField(null)).toBe(false);
            expect(customDetector.isEmptyField('EMPTY')).toBe(true);
            expect(customDetector.isEmptyField('BLANK')).toBe(true);
        });

        test('allows configuration updates', () => {
            detector.updateConfig({ customEmptyValues: ['CUSTOM_EMPTY'] });

            expect(detector.isEmptyField('CUSTOM_EMPTY')).toBe(true);
            expect(detector.isEmptyField('N/A')).toBe(false); // Original config overridden
        });
    });

    describe('critical fields missing detection', () => {
        test('detects row with missing critical fields as empty when enabled', () => {
            const config: EmptyRowConfig = {
                ...DEFAULT_EMPTY_ROW_CONFIG,
                treatMissingCriticalFieldsAsEmpty: true,
                criticalFields: ['date_dd', 'date_mon', 'date_yyyy', 'court', 'case_type']
            };

            const criticalFieldsDetector = new EmptyRowDetector(config);

            // Row with missing critical fields
            const rowWithMissingCritical: CsvRow = {
                date_dd: '', // Missing critical field
                date_mon: '', // Missing critical field
                date_yyyy: '', // Missing critical field
                court: 'Some Court', // Has data
                case_type: 'Civil', // Has data
                other_field: 'some data' // Has data
            };

            expect(criticalFieldsDetector.isEmptyRow(rowWithMissingCritical, 5)).toBe(true);

            const stats = criticalFieldsDetector.getEmptyRowStats();
            expect(stats.criticalFieldsMissingRows).toBe(1);
            expect(stats.criticalFieldsMissingRowNumbers).toEqual([5]);
        });

        test('does not treat row with missing critical fields as empty when disabled', () => {
            const config: EmptyRowConfig = {
                ...DEFAULT_EMPTY_ROW_CONFIG,
                treatMissingCriticalFieldsAsEmpty: false,
                criticalFields: ['date_dd', 'date_mon', 'date_yyyy']
            };

            const detector = new EmptyRowDetector(config);

            const rowWithMissingCritical: CsvRow = {
                date_dd: '', // Missing critical field
                date_mon: '', // Missing critical field
                date_yyyy: '', // Missing critical field
                court: 'Some Court', // Has data
                case_type: 'Civil' // Has data
            };

            expect(detector.isEmptyRow(rowWithMissingCritical)).toBe(false);
        });

        test('does not treat row with all critical fields present as empty', () => {
            const config: EmptyRowConfig = {
                ...DEFAULT_EMPTY_ROW_CONFIG,
                treatMissingCriticalFieldsAsEmpty: true,
                criticalFields: ['date_dd', 'date_mon', 'date_yyyy', 'court', 'case_type']
            };

            const detector = new EmptyRowDetector(config);

            const rowWithAllCritical: CsvRow = {
                date_dd: '15', // Has data
                date_mon: 'Jan', // Has data
                date_yyyy: '2024', // Has data
                court: 'Some Court', // Has data
                case_type: 'Civil', // Has data
                other_field: 'some data' // Has data
            };

            expect(detector.isEmptyRow(rowWithAllCritical)).toBe(false);
        });

        test('tracks both regular empty rows and critical fields missing rows separately', () => {
            const config: EmptyRowConfig = {
                ...DEFAULT_EMPTY_ROW_CONFIG,
                treatMissingCriticalFieldsAsEmpty: true,
                criticalFields: ['date_dd', 'date_mon', 'date_yyyy']
            };

            const detector = new EmptyRowDetector(config);

            // Regular empty row (no critical fields present)
            const regularEmptyRow: CsvRow = { field1: '', field2: '' };
            detector.isEmptyRow(regularEmptyRow, 1);

            // Row with critical fields present but empty
            const criticalMissingRow: CsvRow = {
                date_dd: '', // Critical field present but empty
                date_mon: '', // Critical field present but empty
                date_yyyy: '', // Critical field present but empty
                court: 'Some Court'
            };
            detector.isEmptyRow(criticalMissingRow, 2);

            // Valid row
            const validRow: CsvRow = {
                date_dd: '15',
                date_mon: 'Jan',
                date_yyyy: '2024',
                court: 'Some Court'
            };
            detector.isEmptyRow(validRow, 3);

            const stats = detector.getEmptyRowStats();
            expect(stats.totalEmptyRows).toBe(2);
            expect(stats.emptyRowNumbers).toEqual([1]);
            expect(stats.criticalFieldsMissingRows).toBe(1);
            expect(stats.criticalFieldsMissingRowNumbers).toEqual([2]);
        });

        test('handles mixed empty field types correctly', () => {
            const config: EmptyRowConfig = {
                ...DEFAULT_EMPTY_ROW_CONFIG,
                treatMissingCriticalFieldsAsEmpty: true,
                criticalFields: ['date_dd', 'court']
            };

            const detector = new EmptyRowDetector(config);

            // Row with null/undefined critical fields
            const rowWithNullCritical: CsvRow = {
                date_dd: null as any,
                court: undefined as any,
                other_field: 'data'
            };

            expect(detector.isEmptyRow(rowWithNullCritical)).toBe(true);
        });

        test('respects critical fields configuration', () => {
            const config: EmptyRowConfig = {
                ...DEFAULT_EMPTY_ROW_CONFIG,
                treatMissingCriticalFieldsAsEmpty: true,
                criticalFields: ['court', 'judge_1'] // Only these are critical
            };

            const detector = new EmptyRowDetector(config);

            // Row missing only non-critical fields
            const rowMissingNonCritical: CsvRow = {
                date_dd: '', // Not critical
                date_mon: '', // Not critical
                court: 'Some Court', // Critical and present
                judge_1: 'Judge Name', // Critical and present
                other_field: 'data'
            };

            expect(detector.isEmptyRow(rowMissingNonCritical)).toBe(false);
        });
    });
});