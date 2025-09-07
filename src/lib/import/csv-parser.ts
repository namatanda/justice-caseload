import * as fs from 'fs';
import csv from 'csv-parser';
import { logger } from '../logger';

export interface CaseReturnRow {
  court: string;
  date_dd: string;
  date_mon: string;
  date_yyyy: string;
  caseid_type: string;
  caseid_no: string;
  outcome: string;
  legalrep: string;
  judge_name: string;
  // Add other 28 fields based on standard 37-column format
  // For brevity, assuming common fields like filing_date, resolution_date, etc.
  filing_date: string;
  resolution_date: string;
  case_type: string;
  status: string;
  notes: string;
  // ... (total 37 fields, but simplified here for implementation)
}

export async function parseCSV(filePath: string): Promise<CaseReturnRow[]> {
  return new Promise((resolve, reject) => {
    const rows: CaseReturnRow[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Map CSV columns to CaseReturnRow interface
        // Assuming CSV headers match interface keys exactly
        rows.push(row as CaseReturnRow);
      })
      .on('end', () => {
        logger.info('import', `Parsed ${rows.length} rows from ${filePath}`);
        resolve(rows);
      })
      .on('error', (error) => {
        logger.error('import', `Error parsing CSV: ${error.message}`);
        reject(error);
      });
  });
}