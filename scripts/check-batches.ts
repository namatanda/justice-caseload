import 'dotenv/config';
import logger from '../src/lib/logger';
import { prisma } from '../src/lib/database/prisma';

async function main() {
  try {
    logger.info('general', 'Checking existing import batches');
    
    const batches = await prisma.dailyImportBatch.findMany({
      select: {
        id: true,
        filename: true,
        status: true,
        createdAt: true,
        totalRecords: true,
        successfulRecords: true,
        failedRecords: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    logger.info('general', `Found ${batches.length} import batches`);
    batches.forEach((batch, index) => {
      logger.info('general', `Batch ${index + 1} ID`, { id: batch.id });
      logger.info('general', `Batch filename`, { filename: batch.filename });
      logger.info('general', `Batch status`, { status: batch.status });
      logger.info('general', `Batch created`, { createdAt: batch.createdAt });
      logger.info('general', `Batch records`, { total: batch.totalRecords, successful: batch.successfulRecords, failed: batch.failedRecords });
      console.log('');
    });
    
    // Check if the specific batch ID exists
    const targetBatchId = '91d7fbb2-fb87-45e3-a0fb-0a3ff94660c0';
    const targetBatch = await prisma.dailyImportBatch.findUnique({
      where: { id: targetBatchId }
    });
    
    logger.info('general', `Looking for batch ID`, { batchId: targetBatchId });
    logger.info('general', `Batch found`, { found: targetBatch ? 'Yes' : 'No', batchId: targetBatchId });
    
  } catch (error) {
    logger.error('general', 'Database query failed', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();