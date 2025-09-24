/**
 * Auth Module
 * 
 * Centralized exports for authentication functionality
 */

export * from './middleware';

// Export commonly used types
export type {
  AuthenticatedRequest,
} from './middleware';

// Export main auth functions
export {
  authenticateUser,
  requireAuth,
  requireRole,
  isAdmin,
  canPerformDataEntry,
  SessionManager,
  rateLimit,
  rateLimitConfigs,
  withAuth,
  withOptionalAuth,
} from './middleware';