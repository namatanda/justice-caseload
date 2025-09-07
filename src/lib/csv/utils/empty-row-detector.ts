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
}

export interface EmptyRowStats {
  totalEmptyRows: number;
  emptyRowNumbers: number[];
}

export const DEFAULT_EMPTY_ROW_CONFIG: EmptyRowConfig = {
  trimWhitespace: true,
  treatNullAsEmpty: true,
  treatUndefinedAsEmpty: true,
  customEmptyValues: ['', 'N/A', 'NULL', 'null', '-', 'n/a']
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
      emptyRowNumbers: []
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
    }

    return allFieldsEmpty;
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
   * Get current empty row statistics
   * @returns Current statistics about empty rows encountered
   */
  getEmptyRowStats(): EmptyRowStats {
    return {
      totalEmptyRows: this.stats.totalEmptyRows,
      emptyRowNumbers: [...this.stats.emptyRowNumbers]
    };
  }

  /**
   * Reset statistics (useful for processing multiple files)
   */
  resetStats(): void {
    this.stats = {
      totalEmptyRows: 0,
      emptyRowNumbers: []
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