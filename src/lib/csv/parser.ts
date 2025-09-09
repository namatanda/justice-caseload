/**
 * CSV Parser Module
 * 
 * Handles CSV file reading and parsing into structured data.
 * Extracted from the monolithic CSV processor to provide focused,
 * testable CSV parsing functionality.
 */

import { createReadStream } from 'fs';
import { createHash } from 'crypto';
import { logger } from '../logger';
import type { CsvParser, CsvRow, ParseResult } from './interfaces';
import { EmptyRowDetector, type EmptyRowConfig, DEFAULT_EMPTY_ROW_CONFIG } from './utils/empty-row-detector';

/**
 * Implementation of the CSV Parser interface
 * Handles file reading, line parsing, and checksum calculation
 */
export class CsvParserImpl implements CsvParser {

  /**
   * Parse a CSV file with empty row filtering and return detailed results
   * @param filePath Path to the CSV file
   * @param config Configuration for empty row detection
   * @returns Promise resolving to ParseResult with filtered rows and statistics
   */
  async parseFileWithFiltering(filePath: string, config: EmptyRowConfig = DEFAULT_EMPTY_ROW_CONFIG): Promise<ParseResult> {
    return new Promise((resolve, reject) => {
      try {
        const fs = require('fs');
        logger.import.debug('Reading CSV file with empty row filtering', { filePath, exists: fs.existsSync(filePath) });

        const emptyRowDetector = new EmptyRowDetector(config);

        // Use streaming for better memory efficiency with large files
        const stream = fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: 64 * 1024 });
        let buffer = '';
        let headers: string[] = [];
        const validRows: CsvRow[] = [];
        let lineCount = 0;
        let headersParsed = false;
        let totalRowsParsed = 0;
        let emptyLinesCount = 0;

        stream.on('data', (chunk: string) => {
          buffer += chunk;
          const lines = buffer.split('\n');

          // Keep the last incomplete line in buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            lineCount++;

            // Safety limit for very large files - stop processing early
            if (lineCount > 10000) {
              logger.import.warn('CSV file has unusually high number of lines, truncating to first 10000', {
                totalLines: lineCount
              });
              stream.destroy();
              return; // Exit early to prevent further processing
            }

            // Check for empty lines
            if (line.trim() === '') {
              // Count empty lines but don't process them
              emptyLinesCount++;
              continue;
            }

            if (!headersParsed) {
              // First non-empty line is the header
              headers = this.parseCSVLine(line);
              headersParsed = true;
              logger.import.debug('Headers parsed', {
                headersCount: headers.length,
                headers: headers.slice(0, 10)
              });
              continue;
            }

            const values = this.parseCSVLine(line);
            const row: CsvRow = {};

            // Map values to headers efficiently - only store non-empty values
            for (let j = 0; j < headers.length; j++) {
              const header = headers[j];
              const value = j < values.length ? values[j] : undefined;
              if (value !== undefined && value !== '') {
                row[header] = value;
              }
            }

            totalRowsParsed++;

            // Check if row is empty using the detector
            if (!emptyRowDetector.isEmptyRow(row, totalRowsParsed)) {
              validRows.push(row);
            }
          }
        });

        stream.on('end', () => {
          // Process any remaining data in buffer
          // We need to process the buffer even if it's empty (to account for trailing newlines)
          lineCount++; // Count the last line
            
          // Check if the last line is empty
          if (buffer.trim() === '') {
            // Count empty lines but don't process them
            emptyLinesCount++;
          } else {
            if (!headersParsed) {
              // Buffer contains the header line
              headers = this.parseCSVLine(buffer);
              headersParsed = true;
            } else {
              const values = this.parseCSVLine(buffer);
              const row: CsvRow = {};

              for (let j = 0; j < headers.length; j++) {
                const header = headers[j];
                const value = j < values.length ? values[j] : undefined;
                if (value !== undefined && value !== '') {
                  row[header] = value;
                }
              }

              totalRowsParsed++;

              // Check if row is empty using the detector
              if (!emptyRowDetector.isEmptyRow(row, totalRowsParsed)) {
                validRows.push(row);
              }
            }
          }

          const emptyRowStats = emptyRowDetector.getEmptyRowStats();
          // Add the empty lines at the start to the empty row stats
          const totalEmptyRows = emptyRowStats.totalEmptyRows + emptyLinesCount;
          const totalCriticalFieldsMissingRows = emptyRowStats.criticalFieldsMissingRows;

          logger.import.info('CSV file parsed successfully with filtering', {
            totalRowsParsed,
            validRows: validRows.length,
            emptyRowsSkipped: totalEmptyRows,
            criticalFieldsMissingRowsSkipped: totalCriticalFieldsMissingRows,
            headerCount: headers.length
          });

          resolve({
            validRows,
            emptyRowStats: {
              totalEmptyRows,
              emptyRowNumbers: Array.from({ length: emptyLinesCount }, (_, i) => i + 1).concat(
                emptyRowStats.emptyRowNumbers.map(n => n + emptyLinesCount)
              ),
              criticalFieldsMissingRows: totalCriticalFieldsMissingRows,
              criticalFieldsMissingRowNumbers: emptyRowStats.criticalFieldsMissingRowNumbers.map(n => n + emptyLinesCount)
            },
            totalRowsParsed
          });
        });

        stream.on('error', (error: Error) => {
          logger.import.error('Failed to parse CSV file with filtering', { filePath, error });
          reject(error);
        });

      } catch (error) {
        logger.import.error('Failed to parse CSV file with filtering', { filePath, error });
        reject(error);
      }
    });
  }

  /**
   * Parse a CSV file and return structured data
   * Optimized for memory usage with large files using streaming approach
   * @param filePath Path to the CSV file
   * @returns Promise resolving to array of CSV rows
   */
  async parseFile(filePath: string): Promise<CsvRow[]> {
    return new Promise((resolve, reject) => {
      try {
        const fs = require('fs');
        logger.import.debug('Reading CSV file', { filePath, exists: fs.existsSync(filePath) });

        // Use streaming for better memory efficiency with large files
        const stream = fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: 64 * 1024 });
        let buffer = '';
        let headers: string[] = [];
        const data: CsvRow[] = [];
        let lineCount = 0;
        let headersParsed = false;

        stream.on('data', (chunk: string) => {
          buffer += chunk;
          const lines = buffer.split('\n');

          // Keep the last incomplete line in buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim() === '') continue;

            lineCount++;

            // Safety limit for very large files - stop processing early
            if (lineCount > 10000) {
              logger.import.warn('CSV file has unusually high number of lines, truncating to first 10000', {
                totalLines: lineCount
              });
              stream.destroy();
              return; // Exit early to prevent further processing
            }

            if (!headersParsed) {
              headers = this.parseCSVLine(line);
              headersParsed = true;
              logger.import.debug('Headers parsed', {
                headersCount: headers.length,
                headers: headers.slice(0, 10)
              });
              continue;
            }

            const values = this.parseCSVLine(line);
            const row: CsvRow = {};

            // Map values to headers efficiently - only store non-empty values
            for (let j = 0; j < headers.length; j++) {
              const header = headers[j];
              const value = j < values.length ? values[j] : undefined;
              if (value !== undefined && value !== '') {
                row[header] = value;
              }
            }

            data.push(row);
          }
        });

        stream.on('end', () => {
          // Process any remaining data in buffer
          if (buffer.trim() !== '') {
            if (!headersParsed) {
              headers = this.parseCSVLine(buffer);
            } else {
              const values = this.parseCSVLine(buffer);
              const row: CsvRow = {};

              for (let j = 0; j < headers.length; j++) {
                const header = headers[j];
                const value = j < values.length ? values[j] : undefined;
                if (value !== undefined && value !== '') {
                  row[header] = value;
                }
              }

              data.push(row);
            }
          }

          logger.import.info('CSV file parsed successfully', {
            totalRows: data.length,
            headerCount: headers.length
          });

          resolve(data);
        });

        stream.on('error', (error: Error) => {
          logger.import.error('Failed to parse CSV file', { filePath, error });
          reject(error);
        });

      } catch (error) {
        logger.import.error('Failed to parse CSV file', { filePath, error });
        reject(error);
      }
    });
  }

  /**
   * Parse a single CSV line handling quotes and escaping
   * @param line The CSV line to parse
   * @returns Array of field values
   */
  parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          // Escaped quote (double quote)
          current += '"';
          i += 2;
        } else {
          // Toggle quote state - don't include the quote in the value
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator - add current field and reset
        values.push(current.trim()); // Trim whitespace from field
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }

    // Add the last field
    values.push(current.trim());

    return values;
  }

  /**
   * Calculate file checksum for duplicate detection
   * @param filePath Path to the file
   * @returns Promise resolving to SHA256 hash
   */
  async calculateFileChecksum(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = createHash('sha256');
      const stream = createReadStream(filePath);

      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }
}

// Export a default instance for convenience
export const csvParser = new CsvParserImpl();