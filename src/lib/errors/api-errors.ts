/**
 * Centralized API Error Handling System
 * 
 * Provides consistent error responses and prevents information leakage
 */

import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { ZodError } from 'zod';

// Base API Error class
export class APIError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error classes
export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends APIError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT_ERROR');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends APIError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}

export class DatabaseError extends APIError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

// Error response formatter
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    timestamp: string;
    requestId?: string;
  };
  details?: any;
}

// Safe error message mapping for production
const SAFE_ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: 'Invalid input provided',
  AUTHENTICATION_ERROR: 'Authentication required',
  AUTHORIZATION_ERROR: 'Insufficient permissions',
  NOT_FOUND_ERROR: 'Resource not found',
  CONFLICT_ERROR: 'Resource conflict occurred',
  RATE_LIMIT_ERROR: 'Rate limit exceeded',
  DATABASE_ERROR: 'Database operation failed',
  INTERNAL_ERROR: 'Internal server error occurred',
};

// Create safe error response
export function createErrorResponse(
  error: Error | APIError,
  requestId?: string,
  includeDetails: boolean = process.env.NODE_ENV === 'development'
): NextResponse<ErrorResponse> {
  const timestamp = new Date().toISOString();
  
  // Handle known API errors
  if (error instanceof APIError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: includeDetails ? error.message : SAFE_ERROR_MESSAGES[error.code] || 'An error occurred',
        code: error.code,
        statusCode: error.statusCode,
        timestamp,
        ...(requestId && { requestId }),
      },
    };

    // Log error with appropriate level
    const logLevel = error.statusCode >= 500 ? 'error' : 'warn';
    logger.api[logLevel]('API Error', {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack,
      requestId,
    });

    return NextResponse.json(response, { status: error.statusCode });
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        timestamp,
        ...(requestId && { requestId }),
      },
      ...(includeDetails && {
        details: {
          validationErrors: error.issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
        },
      }),
    };

    logger.api.warn('Validation Error', {
      errors: error.issues,
      requestId,
    });

    return NextResponse.json(response, { status: 400 });
  }

  // Handle unknown errors - never expose internal details in production
  const response: ErrorResponse = {
    success: false,
    error: {
      message: includeDetails ? error.message : 'An internal error occurred',
      code: 'INTERNAL_ERROR',
      statusCode: 500,
      timestamp,
      ...(requestId && { requestId }),
    },
  };

  logger.api.error('Unhandled Error', {
    error: error.message,
    stack: error.stack,
    requestId,
  });

  return NextResponse.json(response, { status: 500 });
}

// Error handler wrapper for API routes
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse> | NextResponse,
  routeName: string = 'unknown'
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      // Generate request ID for tracing
      const requestId = Math.random().toString(36).substring(2, 15);
      
      logger.api.error(`Error in ${routeName}`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        requestId,
        route: routeName,
      });

      return createErrorResponse(
        error instanceof Error ? error : new Error(String(error)),
        requestId
      );
    }
  };
}

// Async error boundary for components
export function handleAsyncError(error: Error, errorInfo?: any) {
  logger.error('general', 'Async Error Boundary', {
    error: error.message,
    stack: error.stack,
    errorInfo,
  });

  // In development, re-throw to get better debugging
  if (process.env.NODE_ENV === 'development') {
    throw error;
  }

  // In production, handle gracefully
  console.error('An error occurred:', error.message);
}

// Database error translator
export function translateDatabaseError(error: any): APIError {
  // Prisma specific error codes
  if (error.code) {
    switch (error.code) {
      case 'P2002':
        return new ConflictError('Resource already exists');
      case 'P2025':
        return new NotFoundError('Record');
      case 'P2003':
        return new ValidationError('Foreign key constraint failed');
      case 'P2021':
        return new DatabaseError('Table does not exist');
      case 'P2024':
        return new DatabaseError('Connection timeout');
      default:
        return new DatabaseError('Database operation failed');
    }
  }

  // Generic database errors
  if (error.message?.includes('connection')) {
    return new DatabaseError('Database connection failed');
  }

  if (error.message?.includes('timeout')) {
    return new DatabaseError('Database operation timed out');
  }

  return new DatabaseError();
}

// Export utility functions
export {
  SAFE_ERROR_MESSAGES,
  type ErrorResponse,
};