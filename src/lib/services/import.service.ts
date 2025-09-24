import { ImportServiceImpl } from '@/lib/csv/import-service';
import { ImportService } from '@/lib/csv/interfaces';

/**
 * Import Service
 * 
 * This service orchestrates the complete CSV import workflow.
 * It coordinates all other services to provide a complete import process.
 * 
 * This is a higher-level service that abstracts the implementation details
 * of the CSV import process from the API routes.
 */

// Export the implementation with a clearer name
export const importService: ImportService = new ImportServiceImpl();

// Export the service instance as the default export
export default importService;