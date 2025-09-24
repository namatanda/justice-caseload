import { BatchServiceImpl } from '@/lib/csv/batch-service';
import { BatchService } from '@/lib/csv/interfaces';

/**
 * Batch Service
 * 
 * This service handles all batch-related operations including:
 * - Creating import batches
 * - Updating batch status
 * - Retrieving batch information and history
 * - Managing system user for imports
 * 
 * This abstraction allows API routes to work with batches without
 * needing to know the implementation details.
 */

// Export the implementation with a clearer name
export const batchService: BatchService = new BatchServiceImpl();

// Export the service instance as the default export
export default batchService;