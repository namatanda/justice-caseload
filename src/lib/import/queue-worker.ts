import { Worker, Job } from 'bullmq';
import { redis, ImportJobData, AnalyticsJobData } from '../database/redis';
import { importService } from '../csv/import-service';
import { refreshDashboardAnalytics, generateReport } from '../analytics/dashboard';
import { logger } from '@/lib/logger';

// CSV Import Worker
export const csvImportWorker = new Worker(
  'csv-import',
  async (job: Job<ImportJobData>) => {
    const { data } = job;
    const attemptNumber = job.attemptsMade + 1;
    const maxAttempts = 3;
    
    logger.import.info(`Processing CSV import job ${job.id}`, { 
      filename: data.filename, 
      attempt: attemptNumber, 
      maxAttempts 
    });
    
    try {
      // Update job progress
      await job.updateProgress({ 
        step: 'starting', 
        progress: 0, 
        attempt: attemptNumber,
        message: `Starting import process (attempt ${attemptNumber})`
      });
      
      // Process the CSV import
      await importService.processImport(data);
      
      // Mark job as complete
      await job.updateProgress({ 
        step: 'completed', 
        progress: 100,
        attempt: attemptNumber,
        message: 'Import completed successfully'
      });
      
      logger.info('general', `✅ CSV import job ${job.id} completed successfully on attempt ${attemptNumber}`);
      
      return { success: true, batchId: data.batchId, attempts: attemptNumber };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('general', `❌ CSV import job ${job.id} failed on attempt ${attemptNumber}:`, errorMessage);
      
      // Update job progress with error info
      await job.updateProgress({ 
        step: 'failed', 
        progress: 0,
        attempt: attemptNumber,
        message: `Import failed: ${errorMessage}`,
        error: errorMessage
      });
      
      // If this is not the last attempt, provide retry info
      if (attemptNumber < maxAttempts) {
        logger.import.info(`Job ${job.id} will be retried`, { 
          nextAttempt: attemptNumber + 1, 
          maxAttempts 
        });
      } else {
        logger.error('general', `💥 Job ${job.id} failed permanently after ${maxAttempts} attempts`);
      }
      
      throw error;
    }
  },
  {
    connection: redis,
    concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '3'),
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 }
  }
);

// Analytics Worker
export const analyticsWorker = new Worker(
  'analytics',
  async (job: Job<AnalyticsJobData>) => {
    const { data } = job;
    
    logger.info('general', `Processing analytics job ${job.id} of type: ${data.type}`);
    
    try {
      await job.updateProgress({ step: 'starting', progress: 0 });
      
      switch (data.type) {
        case 'refresh_dashboard':
          await refreshDashboardAnalytics();
          break;
        case 'generate_report':
          await generateReport(data.filters, data.userId);
          break;
        default:
          throw new Error(`Unknown analytics job type: ${data.type}`);
      }
      
      await job.updateProgress({ step: 'completed', progress: 100 });
      
      logger.info('general', `Analytics job ${job.id} completed successfully`);
      
      return { success: true };
    } catch (error) {
      logger.error('general', `Analytics job ${job.id} failed:`, error);
      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 2,
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 25 }
  }
);

// Worker event handlers
csvImportWorker.on('completed', (job) => {
  logger.info('general', `CSV import job ${job.id} completed`);
});

csvImportWorker.on('failed', (job, err) => {
  logger.error('general', `CSV import job ${job?.id} failed:`, err);
});

csvImportWorker.on('progress', (job, progress) => {
  logger.info('general', `CSV import job ${job.id} progress:`, progress);
});

analyticsWorker.on('completed', (job) => {
  logger.info('general', `Analytics job ${job.id} completed`);
});

analyticsWorker.on('failed', (job, err) => {
  logger.error('general', `Analytics job ${job?.id} failed:`, err);
});

// Graceful shutdown
export async function shutdownWorkers(): Promise<void> {
  logger.info('general', 'Shutting down workers...');
  
  await Promise.all([
    csvImportWorker.close(),
    analyticsWorker.close(),
  ]);
  
  logger.info('general', 'Workers shut down successfully');
}

// Worker health check
export async function checkWorkerHealth(): Promise<{
  csvImportWorker: boolean;
  analyticsWorker: boolean;
}> {
  return {
    csvImportWorker: !csvImportWorker.closing,
    analyticsWorker: !analyticsWorker.closing,
  };
}