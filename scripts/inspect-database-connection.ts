#!/usr/bin/env tsx

/**
 * Database Connection Inspector
 * 
 * This script shows exactly which database connection is being used
 */

import { prisma } from '../src/lib/database';

async function inspectDatabaseConnection() {
  console.log('🔍 Inspecting database connection...');
  
  try {
    // Show environment variable
    console.log('\n📋 Environment Configuration:');
    console.log('   DATABASE_URL:', process.env.DATABASE_URL);
    console.log('   NODE_ENV:', process.env.NODE_ENV);
    
    // Test connection and get database info
    console.log('\n🔗 Active Database Connection:');
    const result = await prisma.$queryRaw`
      SELECT 
        current_database() as database_name,
        current_user as user_name,
        version() as postgres_version,
        inet_server_addr() as server_addr,
        inet_server_port() as server_port,
        current_setting('port') as port,
        current_setting('data_directory') as data_directory
    `;
    
    console.log('   Database:', (result as any)[0].database_name);
    console.log('   User:', (result as any)[0].user_name);
    console.log('   Port:', (result as any)[0].port);
    console.log('   Server Address:', (result as any)[0].server_addr || 'localhost/socket');
    console.log('   Data Directory:', (result as any)[0].data_directory);
    console.log('   PostgreSQL Version:', (result as any)[0].postgres_version);
    
    // Check table counts to confirm we're in the right database
    console.log('\n📊 Current Database Contents:');
    const [
      userCount,
      courtCount,
      batchCount,
      caseCount,
      activityCount
    ] = await Promise.all([
      prisma.user.count(),
      prisma.court.count(),
      prisma.dailyImportBatch.count(),
      prisma.case.count(),
      prisma.caseActivity.count(),
    ]);
    
    console.log('   Users:', userCount);
    console.log('   Courts:', courtCount);
    console.log('   Import Batches:', batchCount);
    console.log('   Cases:', caseCount);
    console.log('   Case Activities:', activityCount);
    
    // Show recent activity
    if (activityCount > 0) {
      console.log('\n🕐 Recent Activity:');
      const recentActivity = await prisma.caseActivity.findFirst({
        orderBy: { createdAt: 'desc' },
        include: {
          case: {
            select: { caseNumber: true }
          },
          importBatch: {
            select: { filename: true }
          }
        }
      });
      
      if (recentActivity) {
        console.log('   Latest Activity:', recentActivity.activityType);
        console.log('   Case:', recentActivity.case?.caseNumber);
        console.log('   From Import:', recentActivity.importBatch?.filename);
        console.log('   Created:', recentActivity.createdAt.toISOString());
      }
    }
    
  } catch (error) {
    console.error('❌ Database inspection failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  inspectDatabaseConnection().catch(console.error);
}

export { inspectDatabaseConnection };