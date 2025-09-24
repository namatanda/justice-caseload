import { caseService as csvCaseService } from '@/lib/csv/case-service';
import { CaseService } from '@/lib/csv/interfaces';

/**
 * Case Service
 * 
 * This service handles all case-related operations including:
 * - Creating or updating cases from data
 * - Creating case activities
 * - Finding existing cases
 * 
 * This abstraction allows other services and API routes to work with cases
 * without needing to know the implementation details.
 */

// Re-export the existing case service with the interface typing
export const caseService: CaseService = csvCaseService;

// Export the service instance as the default export
export default caseService;