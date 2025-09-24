/**
 * API Input Validation Utilities
 * 
 * Provides additional validation helpers and middleware for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ValidationError } from '@/lib/errors/api-errors';

// Common validation schemas for API endpoints
export const CommonValidationSchemas = {
  // UUID validation
  uuid: z.string().uuid('Invalid UUID format'),
  
  // Email validation
  email: z.string().email('Invalid email format'),
  
  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
    limit: z.coerce.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(20),
  }),
  
  // Date range
  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }).refine(data => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  }, 'Start date must be before end date'),
  
  // File upload
  fileUpload: z.object({
    filename: z.string().min(1, 'Filename is required'),
    size: z.number().int().min(1, 'File cannot be empty').max(50 * 1024 * 1024, 'File size cannot exceed 50MB'),
    mimetype: z.string().refine(
      (type) => ['text/csv', 'application/csv', 'text/plain'].includes(type),
      'Only CSV files are allowed'
    ),
  }),
};

// Validation middleware factory
export function createValidationMiddleware<TBody, TQuery, TParams>(schemas: {
  body?: z.ZodSchema<TBody>;
  query?: z.ZodSchema<TQuery>;
  params?: z.ZodSchema<TParams>;
}) {
  return async function validateRequest(request: NextRequest, context?: any): Promise<{
    body?: TBody;
    query?: TQuery;
    params?: TParams;
  }> {
    const validated: { body?: TBody; query?: TQuery; params?: TParams } = {};
    
    try {
      // Validate request body
      if (schemas.body && (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH')) {
        const contentType = request.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
          const bodyText = await request.text();
          if (bodyText.trim()) {
            const bodyData = JSON.parse(bodyText);
            validated.body = schemas.body.parse(bodyData);
          }
        } else if (contentType?.includes('multipart/form-data')) {
          const formData = await request.formData();
          const bodyData = Object.fromEntries(formData.entries());
          validated.body = schemas.body.parse(bodyData);
        }
      }
      
      // Validate query parameters
      if (schemas.query) {
        const url = new URL(request.url);
        const queryObj: Record<string, any> = {};
        
        for (const [key, value] of url.searchParams.entries()) {
          if (queryObj[key]) {
            // Handle multiple values for same key
            if (Array.isArray(queryObj[key])) {
              queryObj[key].push(value);
            } else {
              queryObj[key] = [queryObj[key], value];
            }
          } else {
            queryObj[key] = value;
          }
        }
        
        validated.query = schemas.query.parse(queryObj);
      }
      
      // Validate URL parameters (from context)
      if (schemas.params && context?.params) {
        validated.params = schemas.params.parse(context.params);
      }
      
      return validated;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Validation failed', error.issues);
      }
      throw error;
    }
  };
}

// Higher-order function to wrap API routes with validation
export function withValidation<TBody = any, TQuery = any, TParams = any>(
  schemas: {
    body?: z.ZodSchema<TBody>;
    query?: z.ZodSchema<TQuery>;
    params?: z.ZodSchema<TParams>;
  },
  handler: (
    request: NextRequest,
    validated: {
      body?: TBody;
      query?: TQuery;
      params?: TParams;
    },
    context?: any
  ) => Promise<NextResponse> | NextResponse
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    const validate = createValidationMiddleware(schemas);
    const validated = await validate(request, context);
    return handler(request, validated, context);
  };
}

// Specific validation schemas for common API operations

// User management schemas
export const UserValidationSchemas = {
  create: z.object({
    email: CommonValidationSchemas.email,
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
    role: z.enum(['ADMIN', 'DATA_ENTRY', 'VIEWER']),
    isActive: z.boolean().default(true),
  }),
  
  update: z.object({
    email: CommonValidationSchemas.email.optional(),
    name: z.string().min(2).max(100).optional(),
    role: z.enum(['ADMIN', 'DATA_ENTRY', 'VIEWER']).optional(),
    isActive: z.boolean().optional(),
  }),
  
  query: CommonValidationSchemas.pagination.extend({
    role: z.enum(['ADMIN', 'DATA_ENTRY', 'VIEWER']).optional(),
    isActive: z.boolean().optional(),
    search: z.string().optional(),
  }),
};

// Import batch schemas
export const BatchValidationSchemas = {
  create: z.object({
    filename: z.string().min(1, 'Filename is required'),
    fileSize: z.number().int().min(1, 'File size must be positive'),
    fileChecksum: z.string().min(10, 'File checksum is required'),
    userId: CommonValidationSchemas.uuid.optional(),
  }),
  
  update: z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED']).optional(),
    totalRecords: z.number().int().min(0).optional(),
    successfulRecords: z.number().int().min(0).optional(),
    failedRecords: z.number().int().min(0).optional(),
    errorLogs: z.array(z.any()).optional(),
  }),
  
  query: CommonValidationSchemas.pagination.extend({
    status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED']).optional(),
    userId: CommonValidationSchemas.uuid.optional(),
    ...CommonValidationSchemas.dateRange.shape,
  }),
};

// Analytics schemas
export const AnalyticsValidationSchemas = {
  dashboard: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    courtId: CommonValidationSchemas.uuid.optional(),
    caseTypeId: CommonValidationSchemas.uuid.optional(),
    status: z.string().optional(),
  }).refine(data => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  }, 'Start date must be before end date'),
  
  metrics: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    period: z.enum(['day', 'week', 'month', 'year']).default('month'),
    groupBy: z.enum(['court', 'caseType', 'judge', 'status']).optional(),
  }).refine(data => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  }, 'Start date must be before end date'),
};

// File upload validation with enhanced checks
export const FileValidationSchemas = {
  csvUpload: z.object({
    file: z.object({
      name: z.string()
        .min(1, 'Filename is required')
        .regex(/\.(csv|txt)$/i, 'File must have .csv or .txt extension'),
      size: z.number()
        .int()
        .min(1, 'File cannot be empty')
        .max(50 * 1024 * 1024, 'File size cannot exceed 50MB'),
      type: z.string().refine(
        (type) => [
          'text/csv',
          'application/csv',
          'text/plain',
          'application/vnd.ms-excel',
          'text/comma-separated-values'
        ].includes(type),
        'Invalid file type. Only CSV files are allowed'
      ),
    }),
    options: z.object({
      validateOnly: z.boolean().default(false),
      skipErrors: z.boolean().default(false),
      batchSize: z.number().int().min(1).max(1000).default(100),
    }).optional(),
  }),
};

// Authentication schemas
export const AuthValidationSchemas = {
  login: z.object({
    email: CommonValidationSchemas.email,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    rememberMe: z.boolean().default(false),
  }),
  
  register: z.object({
    email: CommonValidationSchemas.email,
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
  
  changePassword: z.object({
    currentPassword: z.string().min(8),
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    confirmNewPassword: z.string(),
  }).refine(data => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  }),
};

// System configuration schemas
export const SystemValidationSchemas = {
  config: z.object({
    maxFileSize: z.number().int().min(1024).max(100 * 1024 * 1024), // 1KB to 100MB
    allowedFileTypes: z.array(z.string()),
    maxConcurrentImports: z.number().int().min(1).max(10),
    sessionTimeout: z.number().int().min(300).max(86400), // 5 minutes to 24 hours
    debugMode: z.boolean(),
  }),
  
  maintenance: z.object({
    enabled: z.boolean(),
    message: z.string().optional(),
    estimatedDuration: z.number().int().optional(), // in minutes
    allowedRoles: z.array(z.enum(['ADMIN', 'DATA_ENTRY', 'VIEWER'])).optional(),
  }),
};

// Validation helpers for specific data types
export const ValidationHelpers = {
  // Validate case number format
  caseNumber: z.string().regex(
    /^[A-Z]{2,4}\/\d{1,6}\/\d{4}$/,
    'Invalid case number format. Expected format: ABC/123/2023'
  ),
  
  // Validate phone number
  phoneNumber: z.string().regex(
    /^(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/,
    'Invalid phone number format'
  ),
  
  // Validate court code
  courtCode: z.string().regex(
    /^[A-Z]{2,6}$/,
    'Court code must be 2-6 uppercase letters'
  ),
  
  // Validate judge name (no numbers allowed)
  judgeName: z.string()
    .min(2, 'Judge name must be at least 2 characters')
    .max(255, 'Judge name cannot exceed 255 characters')
    .regex(
      /^[A-Za-z\s.,'-]+$/,
      'Judge name can only contain letters, spaces, and basic punctuation'
    ),
  
  // Validate date string in various formats
  flexibleDate: z.string().refine(
    (date) => {
      const formats = [
        /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
        /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
        /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
      ];
      return formats.some(format => format.test(date)) && !isNaN(Date.parse(date));
    },
    'Invalid date format. Use YYYY-MM-DD, MM/DD/YYYY, or MM-DD-YYYY'
  ),
};

// Export validation middleware creators (use specific schemas)
export const createValidationFor = {
  userCreate: (handler: any) => withValidation({ body: UserValidationSchemas.create }, handler),
  userUpdate: (handler: any) => withValidation({ body: UserValidationSchemas.update }, handler),
  userQuery: (handler: any) => withValidation({ query: UserValidationSchemas.query }, handler),
  
  batchCreate: (handler: any) => withValidation({ body: BatchValidationSchemas.create }, handler),
  batchUpdate: (handler: any) => withValidation({ body: BatchValidationSchemas.update }, handler),
  batchQuery: (handler: any) => withValidation({ query: BatchValidationSchemas.query }, handler),
  
  dashboardQuery: (handler: any) => withValidation({ query: AnalyticsValidationSchemas.dashboard }, handler),
  metricsQuery: (handler: any) => withValidation({ query: AnalyticsValidationSchemas.metrics }, handler),
  
  fileUpload: (handler: any) => withValidation({ body: FileValidationSchemas.csvUpload }, handler),
  
  login: (handler: any) => withValidation({ body: AuthValidationSchemas.login }, handler),
  register: (handler: any) => withValidation({ body: AuthValidationSchemas.register }, handler),
  changePassword: (handler: any) => withValidation({ body: AuthValidationSchemas.changePassword }, handler),
};

// Export all validation schemas for direct use
export const AllValidationSchemas = {
  Common: CommonValidationSchemas,
  User: UserValidationSchemas,
  Batch: BatchValidationSchemas,
  Analytics: AnalyticsValidationSchemas,
  File: FileValidationSchemas,
  Auth: AuthValidationSchemas,
  System: SystemValidationSchemas,
  Helpers: ValidationHelpers,
};