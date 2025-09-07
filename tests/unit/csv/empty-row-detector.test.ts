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
            const row: CsvRow = { field1: 'data', field2: '', field3: '' };
            expect(detector.isEmptyRow(row)).toBe(false);
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
                customEmptyValues: ['EMPTY', 'BLANK']
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

    describe('edge cases', () => {
        test('handles special characters correctly', () => {
            const row: CsvRow = { field1: '©', field2: '®', field3: '™' };
            expect(detector.isEmptyRow(row)).toBe(false);
        });

        test('handles unicode whitespace', () => {
            const row: CsvRow = { field1: '\u00A0', field2: '\u2000', field3: '\u3000' };
            // These are non-breaking spaces and other unicode spaces
            // They should be detected as empty when trimmed
            expect(detector.isEmptyRow(row)).toBe(true);
        });

        test('handles numeric strings correctly', () => {
            const row: CsvRow = { field1: '0', field2: '0.0', field3: '-1' };
            expect(detector.isEmptyRow(row)).toBe(false);
        });
    });
});