/**
 * Unit tests for JobService module
 */

import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { jobService } from '../../../src/lib/csv/job-service';
import type { ImportJobData, Job, ProgressUpdate } from '../../../src/lib/csv/types';

// Mock dependencies
vi.mock('../../../src/lib/database/redis', () => ({
  importQueue: {
    add: vi.fn(),
  },
  cacheManager: {
    setImportStatus: vi.fn(),
    getImportStatus: vi.fn(),
    invalidateDashboardCache: vi.fn(),
  },
}));

vi.mock('../../../src/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    import: {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  },
}));

// Import mocked modules
import { importQueue, cacheManager } from '../../../src/lib/database/redis';
import { logger } from '../../../src/lib/logger';

describe('JobService', () => {
  const mockJobData: ImportJobData = {
    filePath: '/test/file.csv',
    filename: 'test.csv',
    fileSize: 1024,
    checksum: 'abc123',
    userId: 'user-123',
    batchId: 'batch-123',
  };

  const mockJob: Job = {
    id: 'job-123',
    data: mockJobData,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure mocks return resolved promises by default
    (cacheManager.setImportStatus as Mock).mockResolvedValue(undefined);
    (cacheManager.invalidateDashboardCache as Mock).mockResolvedValue(undefined);
  });

  describe('addImportJob', () => {
    it('should add job to queue with correct configuration', async () => {
      (importQueue.add as Mock).mockResolvedValue(mockJob);

      const result = await jobService.addImportJob(mockJobData);

      expect(importQueue.add).toHaveBeenCalledWith(
        'process-csv-import',
        mockJobData,
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
          removeOnComplete: 10,
          removeOnFail: 5,
          delay: 1000,
        }
      );

      expect(result).toEqual(mockJob);
      expect(logger.info).toHaveBeenCalledWith('general', '📤 Adding job to queue:', {
        jobType: 'process-csv-import',
        batchId: mockJobData.batchId,
        filePath: mockJobData.filePath,
        filename: mockJobData.filename,
      });
      expect(logger.import.info).toHaveBeenCalledWith('Job added to queue', {
        jobId: mockJob.id,
        batchId: mockJobData.batchId,
      });
    });

    it('should handle queue add failure', async () => {
      const error = new Error('Queue connection failed');
      (importQueue.add as Mock).mockRejectedValue(error);

      await expect(jobService.addImportJob(mockJobData)).rejects.toThrow('Queue connection failed');
    });
  });

  describe('processJob', () => {
    it('should log job processing initiation', async () => {
      await jobService.processJob(mockJob);

      expect(logger.import.info).toHaveBeenCalledWith('Background job started', {
        batchId: mockJobData.batchId,
        filePath: mockJobData.filePath,
        filename: mockJobData.filename,
        timestamp: expect.any(String),
      });

      expect(logger.import.info).toHaveBeenCalledWith('Job processing initiated', {
        jobId: mockJob.id,
        batchId: mockJobData.batchId,
      });
    });
  });

  describe('updateJobProgress', () => {
    it('should update cache with progress information', async () => {
      const progress: ProgressUpdate = {
        status: 'PROCESSING',
        progress: 50,
        message: 'Processing records...',
        stats: { processed: 100 },
      };

      await jobService.updateJobProgress('batch-123', progress);

      expect(cacheManager.setImportStatus).toHaveBeenCalledWith('batch-123', {
        status: 'PROCESSING',
        progress: 50,
        message: 'Processing records...',
        stats: { processed: 100 },
      });

      expect(logger.import.debug).toHaveBeenCalledWith('Updating job progress', {
        batchId: 'batch-123',
        status: 'PROCESSING',
        progress: 50,
        message: 'Processing records...',
      });

      expect(logger.import.info).toHaveBeenCalledWith('Job progress updated', {
        batchId: 'batch-123',
        status: 'PROCESSING',
        progress: 50,
      });
    });

    it('should handle cache update failure', async () => {
      const error = new Error('Cache connection failed');
      (cacheManager.setImportStatus as Mock).mockRejectedValue(error);

      const progress: ProgressUpdate = {
        status: 'PROCESSING',
        progress: 50,
        message: 'Processing records...',
      };

      await expect(jobService.updateJobProgress('batch-123', progress)).rejects.toThrow('Cache connection failed');
    });
  });

  describe('setProcessingStatus', () => {
    it('should set initial processing status with default message', async () => {
      await jobService.setProcessingStatus('batch-123');

      expect(cacheManager.setImportStatus).toHaveBeenCalledWith('batch-123', {
        status: 'PROCESSING',
        progress: 5,
        message: 'Reading CSV file...',
        stats: undefined,
      });
    });

    it('should set initial processing status with custom message', async () => {
      await jobService.setProcessingStatus('batch-123', 'Custom message');

      expect(cacheManager.setImportStatus).toHaveBeenCalledWith('batch-123', {
        status: 'PROCESSING',
        progress: 5,
        message: 'Custom message',
        stats: undefined,
      });
    });
  });

  describe('setFileReadProgress', () => {
    it('should set file read progress with record count', async () => {
      await jobService.setFileReadProgress('batch-123', 1000);

      expect(cacheManager.setImportStatus).toHaveBeenCalledWith('batch-123', {
        status: 'PROCESSING',
        progress: 10,
        message: 'Processing 1000 records...',
        stats: undefined,
      });
    });
  });

  describe('setBatchProgress', () => {
    it('should calculate and set batch processing progress', async () => {
      await jobService.setBatchProgress('batch-123', 250, 1000);

      // Progress calculation: Math.floor((250 / 1000) * 80) + 10 = 30
      expect(cacheManager.setImportStatus).toHaveBeenCalledWith('batch-123', {
        status: 'PROCESSING',
        progress: 30,
        message: 'Processed 250 of 1000 records...',
        stats: undefined,
      });
    });

    it('should handle edge case where processed exceeds total', async () => {
      await jobService.setBatchProgress('batch-123', 1100, 1000);

      expect(cacheManager.setImportStatus).toHaveBeenCalledWith('batch-123', {
        status: 'PROCESSING',
        progress: 98, // Math.floor((1100 / 1000) * 80) + 10 = 98
        message: 'Processed 1000 of 1000 records...',
        stats: undefined,
      });
    });
  });

  describe('setCompletionStatus', () => {
    it('should set completed status and invalidate dashboard cache', async () => {
      const stats = { newCourts: 5, newJudges: 3 };

      await jobService.setCompletionStatus('batch-123', 'COMPLETED', 950, 50, stats);

      expect(cacheManager.setImportStatus).toHaveBeenCalledWith('batch-123', {
        status: 'COMPLETED',
        progress: 100,
        message: 'Import completed. 950 successful, 50 failed.',
        stats,
      });

      expect(cacheManager.invalidateDashboardCache).toHaveBeenCalled();
    });

    it('should set failed status without invalidating dashboard cache', async () => {
      await jobService.setCompletionStatus('batch-123', 'FAILED', 0, 1000);

      expect(cacheManager.setImportStatus).toHaveBeenCalledWith('batch-123', {
        status: 'FAILED',
        progress: 0,
        message: 'Import failed. 0 successful, 1000 failed.',
        stats: undefined,
      });

      expect(cacheManager.invalidateDashboardCache).not.toHaveBeenCalled();
    });

    it('should not invalidate dashboard cache if no successful records', async () => {
      await jobService.setCompletionStatus('batch-123', 'COMPLETED', 0, 1000);

      expect(cacheManager.invalidateDashboardCache).not.toHaveBeenCalled();
    });
  });

  describe('setFailureStatus', () => {
    it('should set failure status with error details', async () => {
      const errorDetails = { 
        errorType: 'validation',
        sampleErrors: ['Row 1: Invalid date', 'Row 2: Missing field'] 
      };

      await jobService.setFailureStatus('batch-123', 'Validation failed', errorDetails);

      expect(cacheManager.setImportStatus).toHaveBeenCalledWith('batch-123', {
        status: 'FAILED',
        progress: 0,
        message: 'Validation failed',
        errorDetails,
      });

      expect(logger.import.error).toHaveBeenCalledWith('Job marked as failed', {
        batchId: 'batch-123',
        errorMessage: 'Validation failed',
        errorDetails,
      });
    });

    it('should set failure status without error details', async () => {
      await jobService.setFailureStatus('batch-123', 'System error');

      expect(cacheManager.setImportStatus).toHaveBeenCalledWith('batch-123', {
        status: 'FAILED',
        progress: 0,
        message: 'System error',
        errorDetails: undefined,
      });
    });
  });

  describe('setVerificationFailureStatus', () => {
    it('should set verification failure status and invalidate dashboard cache', async () => {
      await jobService.setVerificationFailureStatus('batch-123', 950, 900, 50);

      const expectedMessage = 'Import verification failed: Verification mismatch: computed successfulRecords=950 but persisted caseActivity rows=900';

      expect(cacheManager.setImportStatus).toHaveBeenCalledWith('batch-123', {
        status: 'FAILED',
        progress: 0,
        message: expectedMessage,
        errorDetails: {
          computedSuccessful: 950,
          persistedActivities: 900,
          failedRecords: 50,
        },
      });

      expect(cacheManager.invalidateDashboardCache).toHaveBeenCalled();

      expect(logger.import.warn).toHaveBeenCalledWith('Job verification failed', {
        batchId: 'batch-123',
        computedSuccessful: 950,
        persistedActivities: 900,
        failedRecords: 50,
      });
    });
  });

  describe('getJobStatus', () => {
    it('should retrieve job status from cache', async () => {
      const mockStatus = {
        status: 'PROCESSING',
        progress: 75,
        message: 'Processing records...',
      };

      (cacheManager.getImportStatus as Mock).mockResolvedValue(mockStatus);

      const result = await jobService.getJobStatus('batch-123');

      expect(cacheManager.getImportStatus).toHaveBeenCalledWith('batch-123');
      expect(result).toEqual(mockStatus);
    });

    it('should return null if no status found in cache', async () => {
      (cacheManager.getImportStatus as Mock).mockResolvedValue(null);

      const result = await jobService.getJobStatus('batch-123');

      expect(result).toBeNull();
    });

    it('should handle cache retrieval failure', async () => {
      const error = new Error('Cache connection failed');
      (cacheManager.getImportStatus as Mock).mockRejectedValue(error);

      await expect(jobService.getJobStatus('batch-123')).rejects.toThrow('Cache connection failed');
    });
  });
});