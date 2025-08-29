import { Worker, Job } from 'bullmq';
import { redis, ImportJobData, AnalyticsJobData } from '../database/redis';
import { processCsvImport } from './csv-processor';
import { refreshDashboardAnalytics, generateReport } from '../analytics/dashboard';

// CSV Import Worker
export const csvImportWorker = new Worker(
  'csv-import',
  async (job: Job<ImportJobData>) => {
    const { data } = job;
    
    console.log(`Processing CSV import job ${job.id} for file: ${data.filename}`);
    
    try {
      // Update job progress
      await job.updateProgress({ step: 'starting', progress: 0 });
      
      // Process the CSV import
      await processCsvImport(data);
      
      // Mark job as complete
      await job.updateProgress({ step: 'completed', progress: 100 });
      
      console.log(`CSV import job ${job.id} completed successfully`);
      
      return { success: true, batchId: data.batchId };
    } catch (error) {
      console.error(`CSV import job ${job.id} failed:`, error);
      throw error;
    }
  },
  {
    connection: redis,
    concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '5'),
    removeOnComplete: 100,
    removeOnFail: 50,
  }
);

// Analytics Worker
export const analyticsWorker = new Worker(
  'analytics',
  async (job: Job<AnalyticsJobData>) => {
    const { data } = job;
    
    console.log(`Processing analytics job ${job.id} of type: ${data.type}`);
    
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
      
      console.log(`Analytics job ${job.id} completed successfully`);
      
      return { success: true };
    } catch (error) {
      console.error(`Analytics job ${job.id} failed:`, error);
      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 2,
    removeOnComplete: 50,
    removeOnFail: 25,
  }
);

// Worker event handlers
csvImportWorker.on('completed', (job) => {
  console.log(`CSV import job ${job.id} completed`);
});

csvImportWorker.on('failed', (job, err) => {
  console.error(`CSV import job ${job?.id} failed:`, err);
});

csvImportWorker.on('progress', (job, progress) => {
  console.log(`CSV import job ${job.id} progress:`, progress);
});

analyticsWorker.on('completed', (job) => {
  console.log(`Analytics job ${job.id} completed`);
});

analyticsWorker.on('failed', (job, err) => {
  console.error(`Analytics job ${job?.id} failed:`, err);
});

// Graceful shutdown
export async function shutdownWorkers(): Promise<void> {
  console.log('Shutting down workers...');
  
  await Promise.all([
    csvImportWorker.close(),
    analyticsWorker.close(),
  ]);
  
  console.log('Workers shut down successfully');
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