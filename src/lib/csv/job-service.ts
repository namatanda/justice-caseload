/**
 * Job Service Module
 * 
 * Handles job queue management, progress tracking, and cache updates for CSV import processing.
 * This module abstracts the job processing orchestration from the main import logic.
 */

import { importQueue, cacheManager } from '../db/redis';
import { logger } from '../logger';
import type {
  JobService,
  ImportJobData,
  Job,
  ProgressUpdate
} from './interfaces';

class JobServiceImpl implements JobService {
  /**
   * Add import job to queue for background processing
   */
  async addImportJob(jobData: ImportJobData): Promise<Job> {
    logger.info('general', '📤 Adding job to queue:', {
      jobType: 'process-csv-import',
      batchId: jobData.batchId,
      filePath: jobData.filePath,
      filename: jobData.filename
    });

    const job = await importQueue.add('process-csv-import', jobData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000, // Start with 5 second delay, exponentially increase
      },
      removeOnComplete: 10,
      removeOnFail: 5,
      delay: 1000 // Wait 1 second before starting
    });

    logger.import.info('Job added to queue', {
      jobId: job.id,
      batchId: jobData.batchId
    });

    return job as Job;
  }

  /**
   * Process a job (this would be called by the queue worker)
   */
  async processJob(job: Job): Promise<void> {
    const jobData = job.data as ImportJobData;
    
    logger.import.info('Background job started', {
      batchId: jobData.batchId,
      filePath: jobData.filePath,
      filename: jobData.filename,
      timestamp: new Date().toISOString()
    });

    // The actual processing logic will be handled by the ImportService
    // This method is primarily for job lifecycle management
    logger.import.info('Job processing initiated', {
      jobId: job.id,
      batchId: jobData.batchId
    });
  }

  /**
   * Update job progress and cache status
   */
  async updateJobProgress(batchId: string, progress: ProgressUpdate): Promise<void> {
    logger.import.debug('Updating job progress', {
      batchId,
      status: progress.status,
      progress: progress.progress,
      message: progress.message
    });

    // Update cache with progress status
    await cacheManager.setImportStatus(batchId, {
      status: progress.status,
      progress: progress.progress,
      message: progress.message,
      stats: progress.stats
    });

    logger.import.info('Job progress updated', {
      batchId,
      status: progress.status,
      progress: progress.progress
    });
  }

  /**
   * Set initial processing status
   */
  async setProcessingStatus(batchId: string, message: string = 'Reading CSV file...'): Promise<void> {
    await this.updateJobProgress(batchId, {
      status: 'PROCESSING',
      progress: 5,
      message
    });
  }

  /**
   * Update progress during file reading
   */
  async setFileReadProgress(batchId: string, totalRecords: number): Promise<void> {
    await this.updateJobProgress(batchId, {
      status: 'PROCESSING',
      progress: 10,
      message: `Processing ${totalRecords} records...`
    });
  }

  /**
   * Update progress during batch processing
   */
  async setBatchProgress(batchId: string, processed: number, total: number): Promise<void> {
    const progress = Math.floor(((processed) / total) * 80) + 10;
    await this.updateJobProgress(batchId, {
      status: 'PROCESSING',
      progress,
      message: `Processed ${Math.min(processed, total)} of ${total} records...`
    });
  }

  /**
   * Set final completion status
   */
  async setCompletionStatus(
    batchId: string, 
    status: 'COMPLETED' | 'FAILED',
    successfulRecords: number,
    failedRecords: number,
    stats?: any
  ): Promise<void> {
    const message = status === 'COMPLETED' 
      ? `Import completed. ${successfulRecords} successful, ${failedRecords} failed.`
      : `Import failed. ${successfulRecords} successful, ${failedRecords} failed.`;

    await this.updateJobProgress(batchId, {
      status,
      progress: status === 'COMPLETED' ? 100 : 0,
      message,
      stats
    });

    // Invalidate dashboard cache since data has changed
    if (status === 'COMPLETED' && successfulRecords > 0) {
      await cacheManager.invalidateDashboardCache();
    }
  }

  /**
   * Set failure status with error details
   */
  async setFailureStatus(
    batchId: string,
    errorMessage: string,
    errorDetails?: any
  ): Promise<void> {
    await cacheManager.setImportStatus(batchId, {
      status: 'FAILED',
      progress: 0,
      message: errorMessage,
      errorDetails
    });

    logger.import.error('Job marked as failed', {
      batchId,
      errorMessage,
      errorDetails
    });
  }

  /**
   * Set verification failure status
   */
  async setVerificationFailureStatus(
    batchId: string,
    computedSuccessful: number,
    persistedActivities: number,
    failedRecords: number
  ): Promise<void> {
    const mismatchMessage = `Verification mismatch: computed successfulRecords=${computedSuccessful} but persisted caseActivity rows=${persistedActivities}`;
    
    await cacheManager.setImportStatus(batchId, {
      status: 'FAILED',
      progress: 0,
      message: `Import verification failed: ${mismatchMessage}`,
      errorDetails: {
        computedSuccessful,
        persistedActivities,
        failedRecords
      }
    });

    // Invalidate dashboard cache so UI gets consistent data
    await cacheManager.invalidateDashboardCache();

    logger.import.warn('Job verification failed', {
      batchId,
      computedSuccessful,
      persistedActivities,
      failedRecords
    });
  }

  /**
   * Get job status from cache
   */
  async getJobStatus(batchId: string): Promise<any> {
    return await cacheManager.getImportStatus(batchId);
  }
}

// Export singleton instance
export const jobService = new JobServiceImpl();
export default jobService;