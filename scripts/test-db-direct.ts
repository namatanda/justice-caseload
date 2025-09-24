import 'dotenv/config';
import { prisma } from '../src/lib/db/prisma';

async function main() {
  try {
    console.log('🔧 Testing database connection...');
    
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection test:', result);
    
    // Test table existence
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'daily_import_batches'
      );
    `;
    console.log('✅ Table exists check:', tableExists);
    
    // Count all batches
    const count = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM daily_import_batches;
    `;
    console.log('📊 Total batches in database:', count);
    
    // Get all batch IDs directly from SQL
    const rawBatches = await prisma.$queryRaw`
      SELECT id, filename, status, created_at 
      FROM daily_import_batches 
      ORDER BY created_at DESC 
      LIMIT 5;
    `;
    console.log('📋 Raw batch data:', rawBatches);
    
    // Test the specific batch ID
    const targetId = '9b7d890b-b421-47cd-9cae-f63fb7f988d4';
    const specificBatch = await prisma.$queryRaw`
      SELECT id, filename, status 
      FROM daily_import_batches 
      WHERE id = ${targetId}::uuid;
    `;
    console.log(`🎯 Specific batch query (${targetId}):`, specificBatch);
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();