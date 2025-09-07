const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBatch() {
  try {
    const batchId = '9405b039-7400-48a1-9dcd-618d1aaf3f97';
    
    const batch = await prisma.dailyImportBatch.findUnique({
      where: { id: batchId }
    });
    
    console.log('Batch exists:', !!batch);
    if (batch) {
      console.log('Batch details:', {
        id: batch.id,
        status: batch.status,
        successfulRecords: batch.successfulRecords,
        failedRecords: batch.failedRecords
      });
    }
    
    const errorCount = await prisma.importErrorDetail.count({
      where: { batchId: batchId }
    });
    
    console.log('Error details count:', errorCount);
  } catch (error) {
    console.error('Error checking batch:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBatch();