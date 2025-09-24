#!/usr/bin/env tsx
import logger from '@/lib/logger';

import { prisma } from '@/lib/db';
import { getOrCreateSystemUser } from '@/lib/import/csv-processor';

async function debugBatchCreation() {
  logger.info('general', 'Debugging batch creation');
  
  try {
    // Step 1: Check if we have users
    const users = await prisma.user.findMany();
    logger.info('general', `Found ${users.length} users in database`);
    users.forEach(user => {
      logger.info('general', `User: ${user.email} (${user.id}) - ${user.role}`);
    });
    
    // Step 2: Get or create system user
    logger.info('general', 'Getting system user');
    const userId = await getOrCreateSystemUser();
    logger.info('general', `System user ID: ${userId}`);
    
    // Step 3: Try to create a batch directly
    logger.info('general', 'Creating test batch');
    const testBatch = await prisma.dailyImportBatch.create({
      data: {
        importDate: new Date(),
        filename: 'debug-test.csv',
        fileSize: 1024,
        fileChecksum: 'debug-checksum-' + Date.now(),
        totalRecords: 0,
        successfulRecords: 0,
        failedRecords: 0,
        errorLogs: [],
        status: 'PENDING',
        createdBy: userId,
      },
    });
    
    logger.info('general', `Batch created successfully: ${testBatch.id}`);
    
    // Step 4: Immediately check if it exists
    logger.info('general', 'Checking if batch exists immediately');
    const foundBatch = await prisma.dailyImportBatch.findUnique({
      where: { id: testBatch.id }
    });
    
    if (foundBatch) {
      logger.info('general', 'Batch found immediately after creation');
      logger.info('general', `Batch status: ${foundBatch.status}`);
      logger.info('general', `Created by: ${foundBatch.createdBy}`);
    } else {
      logger.error('general', 'Batch NOT found immediately after creation');
    }
    
    // Step 5: Wait a moment and check again
    logger.info('general', 'Waiting 2 seconds');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const foundBatchAfterWait = await prisma.dailyImportBatch.findUnique({
      where: { id: testBatch.id }
    });
    
    if (foundBatchAfterWait) {
      logger.info('general', 'Batch still exists after 2 seconds');
    } else {
      logger.error('general', 'Batch disappeared after 2 seconds');
    }
    
    // Step 6: Check all batches
    logger.info('general', 'All batches in database');
    const allBatches = await prisma.dailyImportBatch.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    if (allBatches.length === 0) {
      logger.info('general', 'No batches found');
    } else {
      allBatches.forEach(batch => {
        logger.info('general', `Batch: ${batch.id.substring(0, 8)}... - ${batch.filename} (${batch.status})`);
      });
    }
    
    // Clean up
    if (foundBatchAfterWait) {
      await prisma.dailyImportBatch.delete({
        where: { id: testBatch.id }
      });
      logger.info('general', 'Test batch cleaned up');
    }
    
  } catch (error) {
    logger.error('general', 'Debug failed', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugBatchCreation();