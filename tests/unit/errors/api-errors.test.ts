/**
 * Comprehensive Tests for Error Handling System
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import {
  APIError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  createErrorResponse,
  withErrorHandler,
  handleAsyncError,
  translateDatabaseError,
} from '../../../src/lib/errors/api-errors';

describe('API Error Classes', () => {
  it('should create APIError with default values', () => {
    const error = new APIError('Test error');
    
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.isOperational).toBe(true);
    expect(error.name).toBe('APIError');
  });

  it('should create APIError with custom values', () => {
    const error = new APIError('Custom error', 400, 'CUSTOM_ERROR', false);
    
    expect(error.message).toBe('Custom error');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('CUSTOM_ERROR');
    expect(error.isOperational).toBe(false);
  });

  it('should create ValidationError correctly', () => {
    const error = new ValidationError('Validation failed');
    
    expect(error.message).toBe('Validation failed');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.name).toBe('ValidationError');
  });

  it('should create AuthenticationError with default message', () => {
    const error = new AuthenticationError();
    
    expect(error.message).toBe('Authentication required');
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe('AUTHENTICATION_ERROR');
  });

  it('should create AuthorizationError with default message', () => {
    const error = new AuthorizationError();
    
    expect(error.message).toBe('Insufficient permissions');
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe('AUTHORIZATION_ERROR');
  });

  it('should create NotFoundError with custom resource', () => {
    const error = new NotFoundError('User');
    
    expect(error.message).toBe('User not found');
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND_ERROR');
  });

  it('should create ConflictError', () => {
    const error = new ConflictError('Resource already exists');
    
    expect(error.message).toBe('Resource already exists');
    expect(error.statusCode).toBe(409);
    expect(error.code).toBe('CONFLICT_ERROR');
  });

  it('should create RateLimitError with default message', () => {
    const error = new RateLimitError();
    
    expect(error.message).toBe('Rate limit exceeded');
    expect(error.statusCode).toBe(429);
    expect(error.code).toBe('RATE_LIMIT_ERROR');
  });

  it('should create DatabaseError with default message', () => {
    const error = new DatabaseError();
    
    expect(error.message).toBe('Database operation failed');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('DATABASE_ERROR');
  });
});

describe('Error Response Creation', () => {
  beforeEach(() => {
    // Mock NODE_ENV as development for detailed error messages
    vi.stubEnv('NODE_ENV', 'development');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should create error response for APIError', async () => {
    const error = new ValidationError('Invalid input');
    const response = createErrorResponse(error, 'req-123');
    
    expect(response.status).toBe(400);
    
    // Parse the JSON response
    const responseData = await response.json();
    expect(responseData).toMatchObject({
      success: false,
      error: {
        message: 'Invalid input',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        requestId: 'req-123',
      },
    });
  });

  it('should create error response for ZodError', async () => {
    const schema = z.object({ name: z.string().min(1) });
    let zodError: ZodError;
    
    try {
      schema.parse({ name: '' });
    } catch (error) {
      zodError = error as ZodError;
    }
    
    const response = createErrorResponse(zodError!, 'req-124');
    
    expect(response.status).toBe(400);
    
    const responseData = await response.json();
    expect(responseData).toMatchObject({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        requestId: 'req-124',
      },
      details: {
        validationErrors: expect.arrayContaining([
          expect.objectContaining({
            field: 'name',
            message: expect.stringContaining('Too small'),
            code: 'too_small',
          }),
        ]),
      },
    });
  });

  it('should create safe error response for unknown error', async () => {
    const error = new Error('Internal database connection failed');
    const response = createErrorResponse(error, 'req-125');
    
    expect(response.status).toBe(500);
    
    const responseData = await response.json();
    expect(responseData).toMatchObject({
      success: false,
      error: {
        message: 'Internal database connection failed', // Development mode shows message
        code: 'INTERNAL_ERROR',
        statusCode: 500,
        requestId: 'req-125',
      },
    });
  });

  it('should hide error details in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    
    const error = new Error('Internal database connection failed');
    const response = createErrorResponse(error, 'req-126');
    
    const responseData = await response.json();
    expect(responseData).toMatchObject({
      success: false,
      error: {
        message: 'An internal error occurred', // Production mode hides message
        code: 'INTERNAL_ERROR',
        statusCode: 500,
        requestId: 'req-126',
      },
    });
  });
});

describe('Error Handler Wrapper', () => {
  it('should call handler successfully when no error occurs', async () => {
    const mockHandler = vi.fn().mockResolvedValue(
      NextResponse.json({ success: true, data: 'test' })
    );
    
    const wrappedHandler = withErrorHandler(mockHandler, 'test-route');
    const request = new NextRequest('http://localhost/api/test');
    
    const response = await wrappedHandler(request);
    
    expect(mockHandler).toHaveBeenCalledWith(request);
    expect(response.status).toBe(200);
  });

  it('should handle APIError thrown by handler', async () => {
    const mockHandler = vi.fn().mockRejectedValue(
      new ValidationError('Invalid data')
    );
    
    const wrappedHandler = withErrorHandler(mockHandler, 'test-route');
    const request = new NextRequest('http://localhost/api/test');
    
    const response = await wrappedHandler(request);
    
    expect(response.status).toBe(400);
    
    const responseData = await response.json();
    expect(responseData).toMatchObject({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        statusCode: 400,
      },
    });
  });

  it('should handle unknown error thrown by handler', async () => {
    const mockHandler = vi.fn().mockRejectedValue(
      new Error('Unexpected error')
    );
    
    const wrappedHandler = withErrorHandler(mockHandler, 'test-route');
    const request = new NextRequest('http://localhost/api/test');
    
    const response = await wrappedHandler(request);
    
    expect(response.status).toBe(500);
    
    const responseData = await response.json();
    expect(responseData).toMatchObject({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        statusCode: 500,
      },
    });
  });
});

describe('Database Error Translation', () => {
  it('should translate P2002 (unique constraint) error', () => {
    const dbError = {
      code: 'P2002',
      message: 'Unique constraint failed',
    };
    
    const apiError = translateDatabaseError(dbError);
    
    expect(apiError).toBeInstanceOf(ConflictError);
    expect(apiError.message).toBe('Resource already exists');
  });

  it('should translate P2025 (record not found) error', () => {
    const dbError = {
      code: 'P2025',
      message: 'Record not found',
    };
    
    const apiError = translateDatabaseError(dbError);
    
    expect(apiError).toBeInstanceOf(NotFoundError);
    expect(apiError.message).toBe('Record not found');
  });

  it('should translate P2003 (foreign key constraint) error', () => {
    const dbError = {
      code: 'P2003',
      message: 'Foreign key constraint failed',
    };
    
    const apiError = translateDatabaseError(dbError);
    
    expect(apiError).toBeInstanceOf(ValidationError);
    expect(apiError.message).toBe('Foreign key constraint failed');
  });

  it('should translate connection timeout error', () => {
    const dbError = {
      message: 'Connection timeout occurred',
    };
    
    const apiError = translateDatabaseError(dbError);
    
    expect(apiError).toBeInstanceOf(DatabaseError);
    expect(apiError.message).toBe('Database operation timed out');
  });

  it('should translate generic database error', () => {
    const dbError = {
      message: 'Some database error',
    };
    
    const apiError = translateDatabaseError(dbError);
    
    expect(apiError).toBeInstanceOf(DatabaseError);
    expect(apiError.message).toBe('Database operation failed');
  });
});

describe('Async Error Handler', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'development');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should handle async error in development', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const error = new Error('Async component error');
    
    expect(() => {
      handleAsyncError(error, { component: 'TestComponent' });
    }).toThrow('Async component error'); // Re-throws in development
    
    consoleErrorSpy.mockRestore();
  });

  it('should handle async error in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const error = new Error('Async component error');
    
    expect(() => {
      handleAsyncError(error, { component: 'TestComponent' });
    }).not.toThrow(); // Does not re-throw in production
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'An error occurred:',
      'Async component error'
    );
    
    consoleErrorSpy.mockRestore();
  });
});