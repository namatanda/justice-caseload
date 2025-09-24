import 'dotenv/config';
import { prisma } from '../src/lib/db/prisma';

async function main() {
  try {
    console.log('🔍 Getting all batches with full details...');
    
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
      take: 3
    });
    
    console.log(`Found ${batches.length} batches:`);
    batches.forEach((batch, index) => {
      console.log(`${index + 1}. ID: "${batch.id}"`);
      console.log(`   ID length: ${batch.id.length}`);
      console.log(`   ID type: ${typeof batch.id}`);
      console.log(`   Filename: ${batch.filename}`);
      console.log(`   Status: ${batch.status}`);
      console.log('');
    });
    
    if (batches.length > 0) {
      const firstBatch = batches[0];
      console.log(`🧪 Testing query with first batch ID: "${firstBatch.id}"`);
      
      const testBatch = await prisma.dailyImportBatch.findUnique({
        where: { id: firstBatch.id }
      });
      
      console.log('Result:', testBatch ? 'Found' : 'Not found');
      
      // Try with raw SQL
      console.log('🧪 Testing with raw SQL...');
      const rawResult = await prisma.$queryRaw`
        SELECT id, filename, status 
        FROM daily_import_batches 
        WHERE id = ${firstBatch.id}
      `;
      console.log('Raw SQL result:', rawResult);
    }
    
  } catch (error) {
    console.error('Database query failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();