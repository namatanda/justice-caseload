import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Define mock structure first
const mockPrismaStructure = {
  importErrorDetail: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
  dailyImportBatch: {
    findUnique: vi.fn(),
  },
};

// Hoist mock with the structure
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => mockPrismaStructure),
}));

import { NextRequest } from 'next/server';
import { GET } from '@/app/api/import/[batchId]/errors/route';
import { requireAuth } from '@/lib/auth';

const mockPrisma = mockPrismaStructure;

console.log('Shared mockPrisma instance:', mockPrisma);


describe('Import Errors API', () => {
  let request: NextRequest;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.doMock('@/lib/middleware/auth', () => ({
      requireAuth: vi.fn(),
    }));
    const { requireAuth } = require('@/lib/middleware/auth');
    (requireAuth as any).mockResolvedValue({ userId: 'test-user' } as any);
    request = new NextRequest('http://localhost/api/import/test-batch/errors', {
      method: 'GET',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 404 for invalid batchId', async () => {
    mockPrisma.dailyImportBatch.findUnique.mockResolvedValue(null);

    const response = await GET(request, { params: { batchId: 'invalid-id' } } as any);

    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json.error).toBe('Batch not found');
  });

  it('should fetch errors successfully with pagination', async () => {
    const mockBatch = {
      id: 'test-batch',
      successfulRecords: 23,
      failedRecords: 145,
      status: 'COMPLETED' as const,
      createdAt: new Date(),
      importDate: new Date(),
      filename: 'test-batch.csv',
      fileSize: 1024,
      fileChecksum: 'test-checksum',
      totalRecords: 168,
      processedAt: new Date(),
      estimatedCompletionTime: null,
      processingStartTime: null,
      completedAt: new Date(),
      userConfig: '{}',
      validationWarnings: [],
      createdBy: 'test-user',
      errorLogs: [],
    };
    mockPrisma.dailyImportBatch.findUnique.mockResolvedValue(mockBatch);

    const mockErrors = Array.from({ length: 10 }, (_, i) => ({
      id: `error-${i}`,
      batchId: 'test-batch',
      rowNumber: i + 1,
      errorType: 'validation_error',
      errorMessage: `Error message ${i}`,
      columnName: 'date_dd',
      rawValue: '0',
      suggestedFix: 'Use day >=1',
      severity: 'ERROR' as const,
      isResolved: false,
      createdAt: new Date(),
    }));
    mockPrisma.importErrorDetail.findMany.mockResolvedValue(mockErrors);
    mockPrisma.importErrorDetail.count.mockResolvedValue(10);

    request.nextUrl.searchParams.set('page', '1');
    request.nextUrl.searchParams.set('limit', '10');

    const response = await GET(request, { params: { batchId: 'test-batch' } } as any);

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.errors).toHaveLength(10);
    expect(json.total).toBe(10);
    expect(json.batchSummary).toEqual({ successfulRecords: 23, failedRecords: 145, status: 'COMPLETED' });
    expect(json.pagination).toEqual({ currentPage: 1, totalPages: 1, hasNext: false, hasPrev: false });
  });

  it('should filter errors by errorType', async () => {
    const mockBatch = {
      id: 'test-batch',
      successfulRecords: 23,
      failedRecords: 145,
      status: 'COMPLETED' as const,
      createdAt: new Date(),
      importDate: new Date(),
      filename: 'test-batch.csv',
      fileSize: 1024,
      fileChecksum: 'test-checksum',
      totalRecords: 168,
      processedAt: new Date(),
      estimatedCompletionTime: null,
      processingStartTime: null,
      completedAt: new Date(),
      userConfig: '{}',
      validationWarnings: [],
      createdBy: 'test-user',
      errorLogs: [],
    };
    mockPrisma.dailyImportBatch.findUnique.mockResolvedValue(mockBatch);

    const mockErrors = Array.from({ length: 5 }, () => ({
      id: 'error-1',
      batchId: 'test-batch',
      rowNumber: 1,
      errorType: 'validation_error',
      errorMessage: 'Error message',
      columnName: 'date_dd',
      rawValue: '0',
      suggestedFix: 'Use day >=1',
      severity: 'ERROR' as const,
      isResolved: false,
      createdAt: new Date(),
    }));
    mockPrisma.importErrorDetail.findMany.mockResolvedValue(mockErrors);
    mockPrisma.importErrorDetail.count.mockResolvedValue(5);

    request.nextUrl.searchParams.set('errorType', 'validation_error');

    const response = await GET(request, { params: { batchId: 'test-batch' } } as any);

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.errors).toHaveLength(5);
    expect(mockPrisma.importErrorDetail.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ errorType: 'validation_error' }),
      })
    );
  });

  it('should handle empty results', async () => {
    const mockBatch = {
      id: 'test-batch',
      successfulRecords: 23,
      failedRecords: 0,
      status: 'COMPLETED' as const,
      createdAt: new Date(),
      importDate: new Date(),
      filename: 'test-batch.csv',
      fileSize: 1024,
      fileChecksum: 'test-checksum',
      totalRecords: 23,
      processedAt: new Date(),
      estimatedCompletionTime: null,
      processingStartTime: null,
      completedAt: new Date(),
      userConfig: '{}',
      validationWarnings: [],
      createdBy: 'test-user',
      errorLogs: [],
    };
    mockPrisma.dailyImportBatch.findUnique.mockResolvedValue(mockBatch);
    mockPrisma.importErrorDetail.findMany.mockResolvedValue([]);
    mockPrisma.importErrorDetail.count.mockResolvedValue(0);

    const response = await GET(request, { params: { batchId: 'test-batch' } } as any);

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.errors).toHaveLength(0);
    expect(json.total).toBe(0);
  });

  it('should handle auth failure', async () => {
    (requireAuth as any).mockRejectedValue(new Error('Unauthorized'));

    const response = await GET(request, { params: { batchId: 'test-batch' } } as any);

    expect(response.status).toBe(401);
  });
});