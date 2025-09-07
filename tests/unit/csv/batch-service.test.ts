/**
 * Unit tests for BatchService
 * Tests all batch-related operations with mocked database
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BatchServiceImpl } from '../../../src/lib/csv/batch-service';
import type { BatchCreationData, ImportBatch } from '../../../src/lib/csv/interfaces';

// Mock dependencies
vi.mock('../../../src/lib/database', () => ({
  prisma: {
    dailyImportBatch: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    user: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
  cacheManager: {
    getImportStatus: vi.fn(),
  },
}));

vi.mock('../../../src/lib/logger', () => ({
  logger: {
    database: {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  },
}));

// Import mocked modules
import { prisma, cacheManager } from '../../../src/lib/database';

describe('BatchService', () => {
  let batchService: BatchServiceImpl;
  
  beforeEach(() => {
    batchService = new BatchServiceImpl();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('createBatch', () => {
    it('should create a new batch successfully', async () => {
      const batchData: BatchCreationData = {
        filename: 'test.csv',
        fileSize: 1024,
        fileChecksum: 'abc123def456',
        userId: 'user-123',
      };

      const mockBatch: ImportBatch = {
        id: 'batch-123',
        importDate: new Date('2025-01-01'),
        filename: 'test.csv',
        fileSize: 1024,
        fileChecksum: 'abc123def456',
        totalRecords: 0,
        successfulRecords: 0,
        failedRecords: 0,
        status: 'PENDING',
        errorLogs: [],
        createdBy: 'user-123',
      };

      // Mock user exists
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'user-123' } as any);
      vi.mocked(prisma.dailyImportBatch.create).mockResolvedValue(mockBatch as any);

      const result = await batchService.createBatch(batchData);

      expect(result).toEqual(mockBatch);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' }
      });
      expect(prisma.dailyImportBatch.create).toHaveBeenCalledWith({
        data: {
          importDate: expect.any(Date),
          filename: 'test.csv',
          fileSize: 1024,
          fileChecksum: 'abc123def456',
          totalRecords: 0,
          successfulRecords: 0,
          failedRecords: 0,
          errorLogs: [],
          userConfig: {},
          validationWarnings: [],
          status: 'PENDING',
          createdBy: 'user-123',
        },
      });
    });

    it('should create placeholder user if user does not exist', async () => {
      const batchData: BatchCreationData = {
        filename: 'test.csv',
        fileSize: 1024,
        fileChecksum: 'abc123def456',
        userId: 'new-user-123',
      };

      const mockBatch: ImportBatch = {
        id: 'batch-123',
        importDate: new Date('2025-01-01'),
        filename: 'test.csv',
        fileSize: 1024,
        fileChecksum: 'abc123def456',
        totalRecords: 0,
        successfulRecords: 0,
        failedRecords: 0,
        status: 'PENDING',
        errorLogs: [],
        createdBy: 'new-user-123',
      };

      // Mock user does not exist, then gets created
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue({ id: 'new-user-123' } as any);
      vi.mocked(prisma.dailyImportBatch.create).mockResolvedValue(mockBatch as any);

      const result = await batchService.createBatch(batchData);

      expect(result).toEqual(mockBatch);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          id: 'new-user-123',
          email: 'new-user-123@local.invalid',
          name: 'importer:new-user-123',
          role: 'DATA_ENTRY',
          isActive: true
        }
      });
    });

    it('should handle database errors gracefully', async () => {
      const batchData: BatchCreationData = {
        filename: 'test.csv',
        fileSize: 1024,
        fileChecksum: 'abc123def456',
        userId: 'user-123',
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'user-123' } as any);
      vi.mocked(prisma.dailyImportBatch.create).mockRejectedValue(new Error('Database error'));

      await expect(batchService.createBatch(batchData)).rejects.toThrow('Failed to create import batch: Database error');
    });
  });

  describe('updateBatchStatus', () => {
    it('should update batch status successfully', async () => {
      const batchId = 'batch-123';
      const status = 'PROCESSING';

      vi.mocked(prisma.dailyImportBatch.update).mockResolvedValue({} as any);

      await batchService.updateBatchStatus(batchId, status);

      expect(prisma.dailyImportBatch.update).toHaveBeenCalledWith({
        where: { id: batchId },
        data: { status },
      });
    });

    it('should set completedAt when status is COMPLETED', async () => {
      const batchId = 'batch-123';
      const status = 'COMPLETED';

      vi.mocked(prisma.dailyImportBatch.update).mockResolvedValue({} as any);

      await batchService.updateBatchStatus(batchId, status);

      expect(prisma.dailyImportBatch.update).toHaveBeenCalledWith({
        where: { id: batchId },
        data: { 
          status,
          completedAt: expect.any(Date)
        },
      });
    });

    it('should set completedAt when status is FAILED', async () => {
      const batchId = 'batch-123';
      const status = 'FAILED';

      vi.mocked(prisma.dailyImportBatch.update).mockResolvedValue({} as any);

      await batchService.updateBatchStatus(batchId, status);

      expect(prisma.dailyImportBatch.update).toHaveBeenCalledWith({
        where: { id: batchId },
        data: { 
          status,
          completedAt: expect.any(Date)
        },
      });
    });

    it('should handle update errors gracefully', async () => {
      const batchId = 'batch-123';
      const status = 'PROCESSING';

      vi.mocked(prisma.dailyImportBatch.update).mockRejectedValue(new Error('Update failed'));

      await expect(batchService.updateBatchStatus(batchId, status)).rejects.toThrow('Failed to update batch status: Update failed');
    });
  });

  describe('getBatch', () => {
    it('should retrieve batch successfully', async () => {
      const batchId = 'batch-123';
      const mockBatch: ImportBatch = {
        id: 'batch-123',
        importDate: new Date('2025-01-01'),
        filename: 'test.csv',
        fileSize: 1024,
        fileChecksum: 'abc123def456',
        totalRecords: 100,
        successfulRecords: 95,
        failedRecords: 5,
        status: 'COMPLETED',
        errorLogs: [],
        createdBy: 'user-123',
      };

      vi.mocked(prisma.dailyImportBatch.findUnique).mockResolvedValue(mockBatch as any);

      const result = await batchService.getBatch(batchId);

      expect(result).toEqual(mockBatch);
      expect(prisma.dailyImportBatch.findUnique).toHaveBeenCalledWith({
        where: { id: batchId },
      });
    });

    it('should return null when batch not found', async () => {
      const batchId = 'nonexistent-batch';

      vi.mocked(prisma.dailyImportBatch.findUnique).mockResolvedValue(null);

      const result = await batchService.getBatch(batchId);

      expect(result).toBeNull();
    });

    it('should handle database errors gracefully', async () => {
      const batchId = 'batch-123';

      vi.mocked(prisma.dailyImportBatch.findUnique).mockRejectedValue(new Error('Database error'));

      await expect(batchService.getBatch(batchId)).rejects.toThrow('Failed to retrieve batch: Database error');
    });
  });

  describe('getBatchHistory', () => {
    it('should retrieve batch history successfully', async () => {
      const limit = 10;
      const mockBatches = [
        {
          id: 'batch-1',
          importDate: new Date('2025-01-01'),
          filename: 'test1.csv',
          fileSize: 1024,
          fileChecksum: 'abc123',
          totalRecords: 100,
          successfulRecords: 95,
          failedRecords: 5,
          status: 'COMPLETED',
          errorLogs: [],
          createdBy: 'user-123',
          user: { name: 'Test User', email: 'test@example.com' }
        },
        {
          id: 'batch-2',
          importDate: new Date('2025-01-02'),
          filename: 'test2.csv',
          fileSize: 2048,
          fileChecksum: 'def456',
          totalRecords: 200,
          successfulRecords: 190,
          failedRecords: 10,
          status: 'COMPLETED',
          errorLogs: [],
          createdBy: 'user-456',
          user: { name: 'Another User', email: 'another@example.com' }
        }
      ];

      vi.mocked(prisma.dailyImportBatch.findMany).mockResolvedValue(mockBatches as any);

      const result = await batchService.getBatchHistory(limit);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        ...mockBatches[0],
        user: undefined,
        createdBy: 'user-123'
      });
      expect(prisma.dailyImportBatch.findMany).toHaveBeenCalledWith({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      });
    });

    it('should handle empty results', async () => {
      const limit = 10;

      vi.mocked(prisma.dailyImportBatch.findMany).mockResolvedValue([]);

      const result = await batchService.getBatchHistory(limit);

      expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      const limit = 10;

      vi.mocked(prisma.dailyImportBatch.findMany).mockRejectedValue(new Error('Database error'));

      await expect(batchService.getBatchHistory(limit)).rejects.toThrow('Failed to retrieve batch history: Database error');
    });
  });

  describe('getOrCreateSystemUser', () => {
    it('should return existing admin user', async () => {
      const mockUser = {
        id: 'admin-123',
        email: 'admin@justice.go.ke',
        name: 'Admin User',
        role: 'ADMIN'
      };

      vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as any);

      const result = await batchService.getOrCreateSystemUser();

      expect(result).toBe('admin-123');
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: 'admin@justice.go.ke' },
            { email: 'system@justice.go.ke' },
            { role: 'ADMIN' }
          ]
        }
      });
    });

    it('should create system user if none exists', async () => {
      const mockCreatedUser = {
        id: 'system-123',
        email: 'system@justice.go.ke',
        name: 'System Import User',
        role: 'ADMIN'
      };

      vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue(mockCreatedUser as any);

      const result = await batchService.getOrCreateSystemUser();

      expect(result).toBe('system-123');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'system@justice.go.ke',
          name: 'System Import User',
          role: 'ADMIN',
          isActive: true,
        }
      });
    });

    it('should handle database errors gracefully', async () => {
      vi.mocked(prisma.user.findFirst).mockRejectedValue(new Error('Database error'));

      await expect(batchService.getOrCreateSystemUser()).rejects.toThrow('Failed to initialize system user for import');
    });
  });

  describe('checkForDuplicateImport', () => {
    it('should find duplicate import', async () => {
      const checksum = 'abc123def456';
      const mockDuplicate = {
        id: 'batch-123',
        fileChecksum: checksum,
        status: 'COMPLETED',
        successfulRecords: 100
      };

      vi.mocked(prisma.dailyImportBatch.findFirst).mockResolvedValue(mockDuplicate as any);

      const result = await batchService.checkForDuplicateImport(checksum);

      expect(result).toEqual(mockDuplicate);
      expect(prisma.dailyImportBatch.findFirst).toHaveBeenCalledWith({
        where: {
          fileChecksum: checksum,
          status: { in: ['COMPLETED', 'PROCESSING'] },
          successfulRecords: { gt: 0 }
        }
      });
    });

    it('should return null when no duplicate found', async () => {
      const checksum = 'abc123def456';

      vi.mocked(prisma.dailyImportBatch.findFirst).mockResolvedValue(null);

      const result = await batchService.checkForDuplicateImport(checksum);

      expect(result).toBeNull();
    });

    it('should handle database errors gracefully', async () => {
      const checksum = 'abc123def456';

      vi.mocked(prisma.dailyImportBatch.findFirst).mockRejectedValue(new Error('Database error'));

      await expect(batchService.checkForDuplicateImport(checksum)).rejects.toThrow('Failed to check for duplicate import: Database error');
    });
  });

  describe('getImportStatus', () => {
    it('should return cached status when available', async () => {
      const batchId = 'batch-123';
      const cachedStatus = {
        status: 'PROCESSING',
        progress: 50,
        message: 'Processing...'
      };

      vi.mocked(cacheManager.getImportStatus).mockResolvedValue(cachedStatus);

      const result = await batchService.getImportStatus(batchId);

      expect(result).toEqual(cachedStatus);
      expect(cacheManager.getImportStatus).toHaveBeenCalledWith(batchId);
      expect(prisma.dailyImportBatch.findUnique).not.toHaveBeenCalled();
    });

    it('should fallback to database when cache is empty', async () => {
      const batchId = 'batch-123';
      const mockBatch = {
        status: 'COMPLETED',
        totalRecords: 100,
        successfulRecords: 95,
        failedRecords: 5,
        emptyRowsSkipped: 0,
        createdAt: new Date('2025-01-01'),
        completedAt: new Date('2025-01-01'),
        errorLogs: []
      };

      vi.mocked(cacheManager.getImportStatus).mockResolvedValue(null);
      vi.mocked(prisma.dailyImportBatch.findUnique).mockResolvedValue(mockBatch as any);

      const result = await batchService.getImportStatus(batchId);

      expect(result).toEqual({
        status: 'COMPLETED',
        progress: 100,
        message: 'Import completed',
        totalRecords: 100,
        actualDataRows: 100,
        emptyRowsSkipped: 0,
        processedRecords: 100,
        successfulRecords: 95,
        failedRecords: 5,
        errors: [],
        startedAt: mockBatch.createdAt.toISOString(),
        completedAt: mockBatch.completedAt.toISOString(),
      });
    });

    it('should throw error when batch not found', async () => {
      const batchId = 'nonexistent-batch';

      vi.mocked(cacheManager.getImportStatus).mockResolvedValue(null);
      vi.mocked(prisma.dailyImportBatch.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.dailyImportBatch.findMany).mockResolvedValue([]);

      await expect(batchService.getImportStatus(batchId)).rejects.toThrow('Import batch not found');
    });
  });

  describe('getImportHistory', () => {
    it('should return formatted import history', async () => {
      const limit = 20;
      const mockBatches = [
        {
          id: 'batch-1',
          importDate: new Date('2025-01-01'),
          filename: 'test1.csv',
          fileSize: 1024,
          fileChecksum: 'abc123',
          totalRecords: 100,
          successfulRecords: 95,
          failedRecords: 5,
          emptyRowsSkipped: 0,
          status: 'COMPLETED',
          errorLogs: [],
          completedAt: new Date('2025-01-01'),
          createdBy: 'user-123',
          user: { name: 'Test User', email: 'test@example.com' }
        }
      ];

      vi.mocked(prisma.dailyImportBatch.findMany).mockResolvedValue(mockBatches as any);

      const result = await batchService.getImportHistory(limit);

      expect(result).toEqual([{
        id: 'batch-1',
        filename: 'test1.csv',
        status: 'COMPLETED',
        totalRecords: 100,
        actualDataRows: 100,
        emptyRowsSkipped: 0,
        successfulRecords: 95,
        failedRecords: 5,
        createdAt: mockBatches[0].importDate.toISOString(),
        completedAt: mockBatches[0].completedAt!.toISOString(),
        createdBy: { name: 'System User', email: 'system@justice.go.ke' },
      }]);
    });

    it('should use default limit when not provided', async () => {
      vi.mocked(prisma.dailyImportBatch.findMany).mockResolvedValue([]);

      await batchService.getImportHistory();

      expect(prisma.dailyImportBatch.findMany).toHaveBeenCalledWith({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      });
    });
  });

  describe('updateBatchWithEmptyRowStats', () => {
    it('should update batch with empty row statistics successfully', async () => {
      const batchId = 'batch-123';
      const emptyRowsSkipped = 15;

      vi.mocked(prisma.dailyImportBatch.update).mockResolvedValue({} as any);

      await batchService.updateBatchWithEmptyRowStats(batchId, emptyRowsSkipped);

      expect(prisma.dailyImportBatch.update).toHaveBeenCalledWith({
        where: { id: batchId },
        data: {
          emptyRowsSkipped
        },
      });
    });

    it('should handle database errors gracefully', async () => {
      const batchId = 'batch-123';
      const emptyRowsSkipped = 15;
      const error = new Error('Database error');

      vi.mocked(prisma.dailyImportBatch.update).mockRejectedValue(error);

      await expect(batchService.updateBatchWithEmptyRowStats(batchId, emptyRowsSkipped))
        .rejects.toThrow('Failed to update batch empty row statistics: Database error');
    });
  });
});