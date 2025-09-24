/**
 * API Module
 * 
 * Centralized exports for API functionality
 */

// Middleware
export { withMetrics } from './middleware';
export { withDevOnly, withDebugWarnings } from './debug';

// Types
export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface APIErrorResponse {
  error: string;
  code?: string;
  details?: any;
}

// Constants
export const API_ENDPOINTS = {
  BATCHES: '/api/batches',
  CASES: '/api/cases',
  USERS: '/api/users',
  UPLOAD: '/api/upload',
  IMPORT: '/api/import',
  METRICS: '/api/metrics',
  AUTH: '/api/auth',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;