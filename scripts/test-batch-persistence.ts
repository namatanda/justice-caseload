import 'dotenv/config';
import { prisma } from '../src/lib/database/prisma';

async function main() {
  try {
    console.log('🔧 Testing batch creation and persistence...');
    
    // Get an existing user first
    const existingUser = await prisma.user.findFirst({
      where: { isActive: true }
    });
    
    if (!existingUser) {
      console.error('❌ No users found in database. Create a user first.');
      return;
    }
    
    console.log('👤 Using user:', { id: existingUser.id, email: existingUser.email });
    
    // Test creating a simple batch
    const testBatch = await prisma.dailyImportBatch.create({
      data: {
        importDate: new Date(),
        filename: 'test_batch.csv',
        fileSize: 1000,
        fileChecksum: 'test-checksum-123',
        totalRecords: 0,
        successfulRecords: 0,
        failedRecords: 0,
        errorLogs: [],
        status: 'PENDING',
        createdBy: existingUser.id // Use actual user ID
      }
    });
    
    console.log('✅ Batch created:', {
      id: testBatch.id,
      status: testBatch.status,
      createdAt: testBatch.createdAt
    });
    
    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if it still exists
    const foundBatch = await prisma.dailyImportBatch.findUnique({
      where: { id: testBatch.id }
    });
    
    console.log('🔍 Batch after 2 seconds:', foundBatch ? 'Still exists' : 'DISAPPEARED');
    
    if (foundBatch) {
      console.log('✅ Batch persisted successfully');
      
      // Clean up test batch
      await prisma.dailyImportBatch.delete({
        where: { id: testBatch.id }
      });
      console.log('🧹 Test batch cleaned up');
    } else {
      console.error('❌ Batch disappeared unexpectedly!');
      
      // Check if there are any batches at all
      const allBatches = await prisma.dailyImportBatch.findMany();
      console.log(`📊 Total batches in database: ${allBatches.length}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();