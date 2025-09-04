import { PrismaClient } from '@prisma/client';

// Create a new Prisma client instance
const prisma = new PrismaClient();

/**
 * This script helps retrieve error details from the most recent import
 * 
 * Run this with: npx tsx check-errors.ts
 */
async function checkRecentImportErrors() {
  try {
    console.log('Checking recent import errors...');
    
    // Find the most recent failed import batch
    const failedImport = await prisma.dailyImportBatch.findFirst({
      where: {
        status: 'FAILED',
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        errorDetails: true,
      },
    });
    
    if (!failedImport) {
      console.log('No failed imports found');
      return;
    }
    
    console.log(`Found failed import batch ID: ${failedImport.id}`);
    console.log(`File: ${failedImport.filename}`);
    console.log(`Created: ${failedImport.createdAt}`);
    console.log(`Status: ${failedImport.status}`);
    console.log(`Records: ${failedImport.totalRecords} total, ${failedImport.successfulRecords} successful, ${failedImport.failedRecords} failed`);
    
    // Display error logs
    console.log('\nError Logs:');
    const errorLogs = failedImport.errorLogs;
    if (Array.isArray(errorLogs) && errorLogs.length > 0) {
      errorLogs.forEach((error, index) => {
        console.log(`\nError ${index + 1}:`);
        console.log(JSON.stringify(error, null, 2));
      });
    } else {
      console.log('No detailed error logs found');
    }
    
    console.log('\nRaw errorLogs field:');
    console.log(JSON.stringify(failedImport.errorLogs, null, 2));
    
    // Check for specific batch ID
    const specificBatchId = '7ba2dcb4-d824-4413-bf0c-bd46cf3699fa';
    const specificBatch = await prisma.dailyImportBatch.findUnique({
      where: { id: specificBatchId },
      select: {
        id: true,
        status: true,
        errorLogs: true,
        totalRecords: true,
        successfulRecords: true,
        failedRecords: true,
      },
    });
    
    if (specificBatch) {
      console.log(`\nInformation for specific batch ID ${specificBatchId}:`);
      console.log(`Status: ${specificBatch.status}`);
      console.log(`Records: ${specificBatch.totalRecords} total, ${specificBatch.successfulRecords} successful, ${specificBatch.failedRecords} failed`);
      console.log('Error logs:');
      console.log(JSON.stringify(specificBatch.errorLogs, null, 2));
    } else {
      console.log(`\nBatch ID ${specificBatchId} not found`);
    }
    
  } catch (error) {
    console.error('Error checking import errors:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
checkRecentImportErrors();