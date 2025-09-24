/**
 * Comprehensive Tests for API Validation System
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  withValidation,
  createValidationMiddleware,
  CommonValidationSchemas,
  UserValidationSchemas,
  BatchValidationSchemas,
  FileValidationSchemas,
  ValidationHelpers,
} from '../../../src/lib/validation/api-validation';

describe('Common Validation Schemas', () => {
  describe('UUID validation', () => {
    it('should accept valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      const result = CommonValidationSchemas.uuid.parse(validUuid);
      expect(result).toBe(validUuid);
    });

    it('should reject invalid UUID', () => {
      expect(() => {
        CommonValidationSchemas.uuid.parse('invalid-uuid');
      }).toThrow();
    });
  });

  describe('Email validation', () => {
    it('should accept valid email', () => {
      const validEmail = 'user@example.com';
      const result = CommonValidationSchemas.email.parse(validEmail);
      expect(result).toBe(validEmail);
    });

    it('should reject invalid email', () => {
      expect(() => {
        CommonValidationSchemas.email.parse('invalid-email');
      }).toThrow();
    });
  });

  describe('Pagination validation', () => {
    it('should accept valid pagination params', () => {
      const result = CommonValidationSchemas.pagination.parse({
        page: '2',
        limit: '50',
      });
      expect(result).toEqual({ page: 2, limit: 50 });
    });

    it('should use defaults for missing params', () => {
      const result = CommonValidationSchemas.pagination.parse({});
      expect(result).toEqual({ page: 1, limit: 20 });
    });

    it('should reject invalid page number', () => {
      expect(() => {
        CommonValidationSchemas.pagination.parse({ page: '0' });
      }).toThrow('Page must be at least 1');
    });

    it('should reject limit exceeding maximum', () => {
      expect(() => {
        CommonValidationSchemas.pagination.parse({ limit: '200' });
      }).toThrow('Limit cannot exceed 100');
    });
  });

  describe('Date range validation', () => {
    it('should accept valid date range', () => {
      const result = CommonValidationSchemas.dateRange.parse({
        startDate: '2023-01-01T00:00:00.000Z',
        endDate: '2023-12-31T23:59:59.999Z',
      });
      expect(result.startDate).toBe('2023-01-01T00:00:00.000Z');
      expect(result.endDate).toBe('2023-12-31T23:59:59.999Z');
    });

    it('should reject end date before start date', () => {
      expect(() => {
        CommonValidationSchemas.dateRange.parse({
          startDate: '2023-12-31T00:00:00.000Z',
          endDate: '2023-01-01T00:00:00.000Z',
        });
      }).toThrow('Start date must be before end date');
    });
  });

  describe('File upload validation', () => {
    it('should accept valid CSV file', () => {
      const validFile = {
        filename: 'data.csv',
        size: 1024 * 1024, // 1MB
        mimetype: 'text/csv',
      };
      const result = CommonValidationSchemas.fileUpload.parse(validFile);
      expect(result).toEqual(validFile);
    });

    it('should reject file without extension', () => {
      expect(() => {
        CommonValidationSchemas.fileUpload.parse({
          filename: 'data',
          size: 1024,
          mimetype: 'text/csv',
        });
      }).toThrow();
    });

    it('should reject file too large', () => {
      expect(() => {
        CommonValidationSchemas.fileUpload.parse({
          filename: 'data.csv',
          size: 100 * 1024 * 1024, // 100MB
          mimetype: 'text/csv',
        });
      }).toThrow('File size cannot exceed 50MB');
    });

    it('should reject invalid file type', () => {
      expect(() => {
        CommonValidationSchemas.fileUpload.parse({
          filename: 'data.csv',
          size: 1024,
          mimetype: 'application/pdf',
        });
      }).toThrow('Invalid file type');
    });
  });
});

describe('User Validation Schemas', () => {
  describe('User creation', () => {
    it('should accept valid user data', () => {
      const validUser = {
        email: 'user@example.com',
        name: 'John Doe',
        role: 'DATA_ENTRY' as const,
        isActive: true,
      };
      const result = UserValidationSchemas.create.parse(validUser);
      expect(result).toEqual(validUser);
    });

    it('should use default isActive value', () => {
      const user = {
        email: 'user@example.com',
        name: 'John Doe',
        role: 'DATA_ENTRY' as const,
      };
      const result = UserValidationSchemas.create.parse(user);
      expect(result.isActive).toBe(true);
    });

    it('should reject short name', () => {
      expect(() => {
        UserValidationSchemas.create.parse({
          email: 'user@example.com',
          name: 'J',
          role: 'DATA_ENTRY',
        });
      }).toThrow('Name must be at least 2 characters');
    });

    it('should reject invalid role', () => {
      expect(() => {
        UserValidationSchemas.create.parse({
          email: 'user@example.com',
          name: 'John Doe',
          role: 'INVALID_ROLE',
        });
      }).toThrow();
    });
  });

  describe('User query', () => {
    it('should accept valid query params', () => {
      const result = UserValidationSchemas.query.parse({
        page: '1',
        limit: '10',
        role: 'ADMIN',
        isActive: 'true',
        search: 'john',
      });
      expect(result).toEqual({
        page: 1,
        limit: 10,
        role: 'ADMIN',
        isActive: true,
        search: 'john',
      });
    });
  });
});

describe('Batch Validation Schemas', () => {
  describe('Batch creation', () => {
    it('should accept valid batch data', () => {
      const validBatch = {
        filename: 'import.csv',
        fileSize: 2048,
        fileChecksum: 'abc123def456',
        userId: '123e4567-e89b-12d3-a456-426614174000',
      };
      const result = BatchValidationSchemas.create.parse(validBatch);
      expect(result).toEqual(validBatch);
    });

    it('should reject empty filename', () => {
      expect(() => {
        BatchValidationSchemas.create.parse({
          filename: '',
          fileSize: 2048,
          fileChecksum: 'abc123def456',
        });
      }).toThrow('Filename is required');
    });

    it('should reject invalid file size', () => {
      expect(() => {
        BatchValidationSchemas.create.parse({
          filename: 'import.csv',
          fileSize: 0,
          fileChecksum: 'abc123def456',
        });
      }).toThrow('File size must be positive');
    });
  });

  describe('Batch update', () => {
    it('should accept partial update data', () => {
      const updateData = {
        status: 'COMPLETED' as const,
        successfulRecords: 100,
      };
      const result = BatchValidationSchemas.update.parse(updateData);
      expect(result).toEqual(updateData);
    });

    it('should reject invalid status', () => {
      expect(() => {
        BatchValidationSchemas.update.parse({
          status: 'INVALID_STATUS',
        });
      }).toThrow();
    });
  });
});

describe('File Validation Schemas', () => {
  describe('CSV upload', () => {
    it('should accept valid CSV upload data', () => {
      const uploadData = {
        file: {
          name: 'data.csv',
          size: 1024,
          type: 'text/csv',
        },
        options: {
          validateOnly: true,
          skipErrors: false,
          batchSize: 200,
        },
      };
      const result = FileValidationSchemas.csvUpload.parse(uploadData);
      expect(result).toEqual(uploadData);
    });

    it('should use default options when not provided', () => {
      const uploadData = {
        file: {
          name: 'data.csv',
          size: 1024,
          type: 'text/csv',
        },
      };
      const result = FileValidationSchemas.csvUpload.parse(uploadData);
      expect(result.options).toEqual({
        validateOnly: false,
        skipErrors: false,
        batchSize: 100,
      });
    });
  });
});

describe('Validation Helpers', () => {
  describe('Case number validation', () => {
    it('should accept valid case number', () => {
      const validCaseNumber = 'ABC/123/2023';
      const result = ValidationHelpers.caseNumber.parse(validCaseNumber);
      expect(result).toBe(validCaseNumber);
    });

    it('should reject invalid case number format', () => {
      expect(() => {
        ValidationHelpers.caseNumber.parse('invalid-case-number');
      }).toThrow('Invalid case number format');
    });
  });

  describe('Judge name validation', () => {
    it('should accept valid judge name', () => {
      const validName = 'Hon. Justice John Smith';
      const result = ValidationHelpers.judgeName.parse(validName);
      expect(result).toBe(validName);
    });

    it('should reject judge name with numbers', () => {
      expect(() => {
        ValidationHelpers.judgeName.parse('Judge123');
      }).toThrow('Judge name can only contain letters');
    });

    it('should reject too short judge name', () => {
      expect(() => {
        ValidationHelpers.judgeName.parse('J');
      }).toThrow('Judge name must be at least 2 characters');
    });
  });

  describe('Court code validation', () => {
    it('should accept valid court code', () => {
      const validCode = 'HCKB';
      const result = ValidationHelpers.courtCode.parse(validCode);
      expect(result).toBe(validCode);
    });

    it('should reject lowercase court code', () => {
      expect(() => {
        ValidationHelpers.courtCode.parse('hckb');
      }).toThrow('Court code must be 2-6 uppercase letters');
    });

    it('should reject court code with numbers', () => {
      expect(() => {
        ValidationHelpers.courtCode.parse('HC123');
      }).toThrow('Court code must be 2-6 uppercase letters');
    });
  });

  describe('Flexible date validation', () => {
    it('should accept YYYY-MM-DD format', () => {
      const validDate = '2023-12-25';
      const result = ValidationHelpers.flexibleDate.parse(validDate);
      expect(result).toBe(validDate);
    });

    it('should accept MM/DD/YYYY format', () => {
      const validDate = '12/25/2023';
      const result = ValidationHelpers.flexibleDate.parse(validDate);
      expect(result).toBe(validDate);
    });

    it('should reject invalid date format', () => {
      expect(() => {
        ValidationHelpers.flexibleDate.parse('25-12-2023');
      }).toThrow('Invalid date format');
    });

    it('should reject non-existent date', () => {
      expect(() => {
        ValidationHelpers.flexibleDate.parse('2023-13-32');
      }).toThrow('Invalid date format');
    });
  });
});

describe('Validation Middleware', () => {
  it('should create validation middleware correctly', async () => {
    const bodySchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
    });

    const querySchema = z.object({
      page: z.coerce.number().int().min(1).default(1),
    });

    const middleware = createValidationMiddleware({
      body: bodySchema,
      query: querySchema,
    });

    const request = new NextRequest('http://localhost/api/test?page=2', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'John', email: 'john@example.com' }),
    });

    const result = await middleware(request);

    expect(result.body).toEqual({ name: 'John', email: 'john@example.com' });
    expect(result.query).toEqual({ page: 2 });
  });

  it('should throw validation error for invalid body', async () => {
    const bodySchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
    });

    const middleware = createValidationMiddleware({
      body: bodySchema,
    });

    const request = new NextRequest('http://localhost/api/test', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: '', email: 'invalid-email' }),
    });

    await expect(middleware(request)).rejects.toThrow();
  });

  it('should handle form data validation', async () => {
    const bodySchema = z.object({
      name: z.string().min(1),
      file: z.string(),
    });

    const middleware = createValidationMiddleware({
      body: bodySchema,
    });

    const formData = new FormData();
    formData.append('name', 'Test File');
    formData.append('file', 'test-content');

    const request = new NextRequest('http://localhost/api/test', {
      method: 'POST',
      body: formData,
    });

    const result = await middleware(request);

    expect(result.body).toEqual({ name: 'Test File', file: 'test-content' });
  });
});

describe('Validation Wrapper', () => {
  it('should wrap handler with validation successfully', async () => {
    const mockHandler = vi.fn().mockResolvedValue(
      NextResponse.json({ success: true })
    );

    const bodySchema = z.object({ name: z.string().min(1) });
    const wrappedHandler = withValidation({ body: bodySchema }, mockHandler);

    const request = new NextRequest('http://localhost/api/test', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Test' }),
    });

    await wrappedHandler(request);

    expect(mockHandler).toHaveBeenCalledWith(
      request,
      { body: { name: 'Test' } },
      undefined
    );
  });

  it('should return validation error response for invalid data', async () => {
    const mockHandler = vi.fn();

    const bodySchema = z.object({ name: z.string().min(2) });
    const wrappedHandler = withValidation({ body: bodySchema }, mockHandler);

    const request = new NextRequest('http://localhost/api/test', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'A' }),
    });

    const response = await wrappedHandler(request);

    expect(mockHandler).not.toHaveBeenCalled();
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data).toMatchObject({
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: {
        validationErrors: expect.arrayContaining([
          expect.objectContaining({
            field: 'name',
            message: expect.stringContaining('String must contain at least 2 character'),
          }),
        ]),
      },
    });
  });
});