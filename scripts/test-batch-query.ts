import 'dotenv/config';
import { prisma } from '../src/lib/db/prisma';

async function main() {
  try {
    const batchId = '9b7d890b-b421-47cd-9cae-f63fb7f988d4';
    console.log(`🔍 Testing database query for batch: ${batchId}`);
    
    const batch = await prisma.dailyImportBatch.findUnique({
      where: { id: batchId },
      select: {
        id: true,
        status: true,
        totalRecords: true,
        successfulRecords: true,
        failedRecords: true,
        createdAt: true,
        completedAt: true,
        errorLogs: true,
      },
    });
    
    console.log('Raw database result:', batch);
    
    if (!batch) {
      console.log('❌ Batch not found');
    } else {
      console.log('✅ Batch found:', {
        id: batch.id,
        status: batch.status,
        totalRecords: batch.totalRecords,
        successfulRecords: batch.successfulRecords,
        failedRecords: batch.failedRecords,
        createdAt: batch.createdAt,
        completedAt: batch.completedAt,
        errorLogs: batch.errorLogs
      });
    }
    
  } catch (error) {
    console.error('Database query failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();