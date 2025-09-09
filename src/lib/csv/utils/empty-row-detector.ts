/**
 * Empty Row Detection Utility
 * 
 * Provides configurable empty row detection for CSV processing.
 * Handles various empty field representations and tracks statistics.
 */

import type { CsvRow } from '../types';

export interface EmptyRowConfig {
  trimWhitespace: boolean;
  treatNullAsEmpty: boolean;
  treatUndefinedAsEmpty: boolean;
  customEmptyValues: string[];
  treatMissingCriticalFieldsAsEmpty: boolean;
  criticalFields: string[];
}

export interface EmptyRowStats {
  totalEmptyRows: number;
  emptyRowNumbers: number[];
  criticalFieldsMissingRows: number;
  criticalFieldsMissingRowNumbers: number[];
}

export const DEFAULT_EMPTY_ROW_CONFIG: EmptyRowConfig = {
  trimWhitespace: true,
  treatNullAsEmpty: true,
  treatUndefinedAsEmpty: true,
  customEmptyValues: ['', 'N/A', 'NULL', 'null', '-', 'n/a'],
  treatMissingCriticalFieldsAsEmpty: true,
  criticalFields: [
    'date_dd', 'date_mon', 'date_yyyy', // Activity date (required)
    'caseid_type', 'caseid_no', // Case identification (required)
    'filed_dd', 'filed_mon', 'filed_yyyy', // Filing information (required)
    'court', // Court information (required)
    'case_type', 'judge_1' // Case details (required)
  ]
};

/**
 * Empty Row Detector class for configurable empty row detection
 */
export class EmptyRowDetector {
  private config: EmptyRowConfig;
  private stats: EmptyRowStats;

  constructor(config: EmptyRowConfig = DEFAULT_EMPTY_ROW_CONFIG) {
    this.config = config;
    this.stats = {
      totalEmptyRows: 0,
      emptyRowNumbers: [],
      criticalFieldsMissingRows: 0,
      criticalFieldsMissingRowNumbers: []
    };
  }

  /**
   * Check if an individual field is considered empty
   * @param value The field value to check
   * @returns true if the field is empty according to configuration
   */
  isEmptyField(value: string | undefined | null): boolean {
    // Handle null and undefined
    if (value === null && this.config.treatNullAsEmpty) {
      return true;
    }
    if (value === undefined && this.config.treatUndefinedAsEmpty) {
      return true;
    }
    if (value === null || value === undefined) {
      return false;
    }

    // Convert to string for processing
    const stringValue = String(value);

    // Handle whitespace trimming
    const processedValue = this.config.trimWhitespace ? stringValue.trim() : stringValue;

    // Check against custom empty values
    return this.config.customEmptyValues.includes(processedValue);
  }

  /**
   * Check if a CSV row contains only empty fields
   * @param row The CSV row to check
   * @param rowNumber Optional row number for statistics tracking
   * @returns true if all fields in the row are empty
   */
  isEmptyRow(row: CsvRow, rowNumber?: number): boolean {
    // Get all values from the row
    const values = Object.values(row);
    
    // If row has no values, it's empty
    if (values.length === 0) {
      this.trackEmptyRow(rowNumber);
      return true;
    }

    // Check if all fields are empty
    const allFieldsEmpty = values.every(value => this.isEmptyField(value));
    
    if (allFieldsEmpty) {
      this.trackEmptyRow(rowNumber);
      return true;
    }

    // Check if critical fields are missing (treat as effectively empty)
    if (this.config.treatMissingCriticalFieldsAsEmpty) {
      const missingCriticalFields = this.getMissingCriticalFields(row);
      if (missingCriticalFields.length > 0) {
        this.trackCriticalFieldsMissingRow(rowNumber);
        return true;
      }
    }

    return false;
  }

  /**
   * Track empty row statistics
   * @param rowNumber Optional row number to track
   */
  private trackEmptyRow(rowNumber?: number): void {
    this.stats.totalEmptyRows++;
    if (rowNumber !== undefined) {
      this.stats.emptyRowNumbers.push(rowNumber);
    }
  }

  /**
   * Track critical fields missing row statistics
   * @param rowNumber Optional row number to track
   */
  private trackCriticalFieldsMissingRow(rowNumber?: number): void {
    this.stats.criticalFieldsMissingRows++;
    this.stats.totalEmptyRows++; // Also count as total empty row
    if (rowNumber !== undefined) {
      this.stats.criticalFieldsMissingRowNumbers.push(rowNumber);
    }
  }

  /**
   * Check if critical fields are missing in a row
   * @param row The CSV row to check
   * @returns true if any critical fields are missing/empty
   */
  isCriticalFieldsMissing(row: CsvRow): boolean {
    if (!this.config.treatMissingCriticalFieldsAsEmpty) {
      return false;
    }
    
    const missingFields = this.getMissingCriticalFields(row);
    return missingFields.length > 0;
  }

  /**
   * Get list of missing critical fields in a row
   * @param row The CSV row to check
   * @returns Array of missing critical field names
   */
  getMissingCriticalFields(row: CsvRow): string[] {
    const missingFields: string[] = [];

    for (const field of this.config.criticalFields) {
      // Only check fields that actually exist in the row
      if (field in row) {
        const value = row[field];
        if (this.isEmptyField(value)) {
          missingFields.push(field);
        }
      }
    }

    return missingFields;
  }

  /**
   * Get current empty row statistics
   * @returns Current statistics about empty rows encountered
   */
  getEmptyRowStats(): EmptyRowStats {
    return {
      totalEmptyRows: this.stats.totalEmptyRows,
      emptyRowNumbers: [...this.stats.emptyRowNumbers],
      criticalFieldsMissingRows: this.stats.criticalFieldsMissingRows,
      criticalFieldsMissingRowNumbers: [...this.stats.criticalFieldsMissingRowNumbers]
    };
  }

  /**
   * Reset statistics (useful for processing multiple files)
   */
  resetStats(): void {
    this.stats = {
      totalEmptyRows: 0,
      emptyRowNumbers: [],
      criticalFieldsMissingRows: 0,
      criticalFieldsMissingRowNumbers: []
    };
  }

  /**
   * Update configuration
   * @param config New configuration to apply
   */
  updateConfig(config: Partial<EmptyRowConfig>): void {
    this.config = { ...this.config, ...config };
  }
}