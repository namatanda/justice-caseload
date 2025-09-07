import { z } from 'zod';
import { logger } from '../logger';

export const CaseReturnRowSchema = z.object({
  court: z.string().min(1, 'Court name is required'),
  date_dd: z.string().regex(/^\d{1,2}$/, 'Day must be 1-31'),
  date_mon: z.string().regex(/^\d{1,2}$/, 'Month must be 1-12'),
  date_yyyy: z.string().regex(/^\d{4}$/, 'Year must be 4 digits'),
  caseid_type: z.enum(['civil', 'criminal', 'family', 'commercial'], { message: 'Invalid case type' }),
  caseid_no: z.string().min(1, 'Case number is required'),
  outcome: z.enum(['filed', 'resolved', 'dismissed', 'pending'], { message: 'Invalid outcome' }),
  legalrep: z.enum(['represented', 'self', 'none'], { message: 'Invalid legal representation' }),
  judge_name: z.string().optional(),
  filing_date: z.string().optional(),
  resolution_date: z.string().optional(),
  case_type: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  // Add other 22 fields with appropriate Zod schemas based on 37-column format
  // For simplicity, assuming most are optional strings or numbers
  // In production, expand to all 37 fields with proper validation
});

export type CaseReturnRow = z.infer<typeof CaseReturnRowSchema>;

export function validateRow(row: any): { valid: boolean; data?: CaseReturnRow; errors?: string[] } {
  try {
    const validated = CaseReturnRowSchema.parse(row);
    logger.info('import', 'Row validation successful');
    return { valid: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      logger.error('import', `Row validation failed: ${errors.length} errors`);
      return { valid: false, errors };
    }
    logger.error('import', `Unexpected validation error: ${error}`);
    return { valid: false, errors: ['Validation failed unexpectedly'] };
  }
}

export function validateRows(rows: any[]): { validRows: CaseReturnRow[]; invalidRows: { row: any; errors: string[] }[] } {
  const validRows: CaseReturnRow[] = [];
  const invalidRows: { row: any; errors: string[] }[] = [];

  rows.forEach((row, index) => {
    const result = validateRow(row);
    if (result.valid && result.data) {
      validRows.push(result.data);
    } else {
      invalidRows.push({ row, errors: result.errors || [] });
      logger.error('import', `Row ${index} validation failed: ${result.errors?.join(', ')}`);
    }
  });

  logger.info('import', `Validation complete: ${validRows.length} valid, ${invalidRows.length} invalid rows`);
  return { validRows, invalidRows };
}