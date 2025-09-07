import Queue from 'bull';
import { Job } from 'bull';
import { Prisma } from '@prisma/client';
import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { logger } from '../logger';
import { parseCSV } from './csv-parser';
import { validateRows } from './validation';
import { batchInsert, updateBatchStatus } from './db-operations';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Create Bull Queue for CSV processing
const csvProcessingQueue = new Queue('csv-processing', {
  redis: { port: 6379, host: 'localhost' }
});

// Progress tracking via Redis
async function updateProgress(batchId: string, processed: number, total: number): Promise<void> {
  const progress = Math.round((processed / total) * 100);
  await redis.set(`import:progress:${batchId}`, progress.toString());
  logger.info('import', `Batch ${batchId} progress: ${progress}%`);
}

// Initiate daily import - creates batch record and queues processing
export async function initiateDailyImport(filePath: string): Promise<{ success: boolean; batchId: string }> {
  try {
    // Create batch record
    const batch = await prisma.dailyImportBatch.create({
      data: {
        filePath,
        status: 'PENDING',
        totalRows: 0, // Will be updated after parsing
        processedRows: 0,
        createdAt: new Date(),
        importType: 'daily'
      }
    });

    logger.info('import', `Daily import batch ${batch.id} initiated for file ${filePath}`);

    // Queue the processing job
    await csvProcessingQueue.add('process-csv', {
      batchId: batch.id,
      filePath
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 10,
      removeOnFail: 5
    });

    return { success: true, batchId: batch.id };
  } catch (error) {
    logger.error('import', `Failed to initiate daily import: ${error}`);
    return { success: false, batchId: '', error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Process CSV import job - handles parsing, validation, and batch processing
csvProcessingQueue.process('process-csv', 2, async (job: Job) => {  // 2 concurrent workers
  const { batchId, filePath } = job.data;
  
  try {
    logger.info('import', `Starting CSV processing for batch ${batchId}`);
    
    // Update batch status
    await prisma.dailyImportBatch.update({
      where: { id: batchId },
      data: { status: 'PROCESSING' }
    });

    // Step 1: Parse CSV
    const rows = await parseCSV(filePath);
    logger.info('import', `Parsed ${rows.length} rows from ${filePath}`);

    // Update total rows
    await prisma.dailyImportBatch.update({
      where: { id: batchId },
      data: { totalRecords: rows.length }
    });

    // Step 2: Validate rows
    const { validRows, invalidRows } = validateRows(rows);
    
    if (invalidRows.length > 0) {
      logger.warn('import', `Batch ${batchId}: ${invalidRows.length} invalid rows found`);
      // Log invalid rows to error table or file
      // For now, just skip them
    }

    // Step 3: Process in batches of 500
    const BATCH_SIZE = 500;
    const totalBatches = Math.ceil(validRows.length / BATCH_SIZE);
    let processedRows = 0;

    for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
      const batchRows = validRows.slice(i, i + BATCH_SIZE);
      logger.info('import', `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${totalBatches} (${batchRows.length} rows)`);
      
      // Process batch
      const result = await batchInsert(batchRows, batchId);
      
      // Update processed count
      processedRows += batchRows.length - result.failed;
      await prisma.dailyImportBatch.update({
        where: { id: batchId },
        data: { successfulRecords: processedRows }
      });

      // Update progress
      await updateProgress(batchId, processedRows, validRows.length);

      if (result.failed > 0) {
        logger.warn('import', `Batch ${batchId} had ${result.failed} failures`);
      }
    }

    // Step 4: Update final status
    const finalStatus = processedRows === validRows.length ? 'completed' : 'partial';
    await updateBatchStatus(batchId, finalStatus);
    
    // Clean up Redis progress
    await redis.del(`import:progress:${batchId}`);

    logger.info('import', `Batch ${batchId} completed: ${processedRows}/${validRows.length} rows processed`);
    
    return { status: 'completed', processed: processedRows, total: validRows.length };
  } catch (error) {
    logger.error('import', `Batch ${batchId} processing failed: ${error}`);
    
    await prisma.dailyImportBatch.update({
      where: { id: batchId },
      data: { status: 'FAILED', errorMessage: error instanceof Error ? error.message : 'Unknown error' }
    });

    throw error;
  }
});

// Get queue stats for monitoring
export async function getQueueStats(): Promise<any> {
  const stats = await csvProcessingQueue.getJobCounts();
  const waiting = await csvProcessingQueue.getWaiting();
  const active = await csvProcessingQueue.getActive();
  
  return {
    waiting: stats.waiting,
    active: stats.active,
    completed: stats.completed,
    failed: stats.failed,
    delayed: stats.delayed,
    sampleJobs: { waiting: waiting.length, active: active.length }
  };
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('import', 'Shutting down queue worker');
  await csvProcessingQueue.close();
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
});

export { csvProcessingQueue };