import { PrismaClient, ImportStatus } from '@prisma/client';

// Create a new Prisma client instance
const prisma = new PrismaClient();

/**
 * This script helps fix the issue with imports that show as COMPLETED
 * but actually have 0 successful records
 * 
 * Run this with: npx tsx fix-imports.ts
 */
async function fixFailedImports() {
  try {
    console.log('Starting to fix imports with 0 successful records...');
    
    // Find all imports that are marked as COMPLETED but have 0 successful records
    const imports = await prisma.dailyImportBatch.findMany({
      where: {
        status: 'COMPLETED',
        successfulRecords: 0,
      },
    });
    
    console.log(`Found ${imports.length} imports to fix`);
    
    // Update all these imports to FAILED status
    const updateResult = await prisma.dailyImportBatch.updateMany({
      where: {
        status: 'COMPLETED',
        successfulRecords: 0,
      },
      data: {
        status: 'FAILED',
      },
    });
    
    console.log(`Updated ${updateResult.count} imports from COMPLETED to FAILED`);
    
    if (imports.length > 0) {
      console.log('List of fixed import IDs:');
      imports.forEach(imp => {
        console.log(`- ${imp.id} | ${imp.filename} | Created: ${imp.createdAt.toISOString()}`);
      });
    }
    
    console.log('Import status cleanup complete!');
    
  } catch (error) {
    console.error('Error fixing imports:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
fixFailedImports();