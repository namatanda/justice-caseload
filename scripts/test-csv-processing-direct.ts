#!/usr/bin/env tsx

/**
 * Test CSV Processing Directly
 * 
 * This script tests CSV processing with minimal data to isolate the issue
 */

import { prisma } from '../src/lib/db';
import { processCsvImport, getOrCreateSystemUser } from '../src/lib/import/csv-processor';
import { createHash } from 'crypto';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Create a minimal test CSV file
const testCsvContent = `court,date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,original_court,original_code,original_number,original_year,case_type,judge_1,judge_2,judge_3,judge_4,judge_5,judge_6,judge_7,comingfor,outcome,reason_adj,next_dd,next_mon,next_yyyy,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
Milimani Civil,6,Nov,2023,HCCC,TEST123,13,Jun,2019,,,,,Civil Suit,"Kendagor, Caroline J",,,,,,Mention,Directions Given,,7,Mar,2024,0,0,1,0,0,1,Yes,0,0,0,`;

async function testCsvProcessingDirectly() {
  console.log('🧪 Testing CSV processing directly...');
  
  try {
    // Check initial state
    console.log('\n1. Checking initial state...');
    const initialCounts = {
      users: await prisma.user.count(),
      batches: await prisma.dailyImportBatch.count(),
      cases: await prisma.case.count(),
      activities: await prisma.caseActivity.count(),
      courts: await prisma.court.count(),
    };
    console.log('   Initial counts:', initialCounts);

    // Seed minimal data if needed
    if (initialCounts.courts === 0) {
      console.log('\n📦 Seeding minimal courts...');
      await prisma.court.createMany({
        data: [
          {
            courtName: 'Milimani Civil',
            courtCode: 'MC001',
            courtType: 'HC',
          }
        ]
      });
      console.log('   Seeded 1 court');
    }
    
    // Create test CSV file
    console.log('\n2. Creating test CSV file...');
    const testFilePath = join(process.cwd(), 'test-upload.csv');
    writeFileSync(testFilePath, testCsvContent);
    console.log(`   Created test file: ${testFilePath}`);
    
    // Create system user and batch
    console.log('\n3. Creating user and batch...');
    const userId = await getOrCreateSystemUser();
    const checksum = createHash('sha256').update(testCsvContent).digest('hex');
    
    const batch = await prisma.dailyImportBatch.create({
      data: {
        importDate: new Date(),
        filename: 'test-upload.csv',
        fileSize: testCsvContent.length,
        fileChecksum: checksum,
        totalRecords: 0,
        successfulRecords: 0,
        failedRecords: 0,
        errorLogs: [],
        status: 'PROCESSING',
        createdBy: userId,
      },
    });
    console.log('   Created batch:', batch.id);
    
    // Check state before processing
    console.log('\n4. State before processing...');
    const beforeCounts = {
      users: await prisma.user.count(),
      batches: await prisma.dailyImportBatch.count(),
      cases: await prisma.case.count(),
      activities: await prisma.caseActivity.count(),
      courts: await prisma.court.count(),
    };
    console.log('   Before counts:', beforeCounts);
    
    // Process CSV with explicit dryRun: false
    console.log('\n5. Processing CSV (dryRun: false)...');
    
    const jobData = {
      filePath: testFilePath,
      filename: 'test-upload.csv',
      fileSize: testCsvContent.length,
      checksum,
      userId,
      batchId: batch.id,
    };
    
    await processCsvImport(jobData, { dryRun: false });
    console.log('✅ CSV processing completed');
    
    // Check state after processing
    console.log('\n6. State after processing...');
    const afterCounts = {
      users: await prisma.user.count(),
      batches: await prisma.dailyImportBatch.count(),
      cases: await prisma.case.count(),
      activities: await prisma.caseActivity.count(),
      courts: await prisma.court.count(),
    };
    console.log('   After counts:', afterCounts);
    
    // Check specific batch status
    console.log('\n7. Checking batch status...');
    const finalBatch = await prisma.dailyImportBatch.findUnique({
      where: { id: batch.id }
    });
    
    if (finalBatch) {
      console.log('✅ Batch exists:', {
        id: finalBatch.id,
        status: finalBatch.status,
        total: finalBatch.totalRecords,
        successful: finalBatch.successfulRecords,
        failed: finalBatch.failedRecords,
      });
    } else {
      console.log('❌ Batch disappeared!');
    }
    
    // Show changes
    console.log('\n📊 Changes:');
    console.log('   Users:', afterCounts.users - beforeCounts.users);
    console.log('   Batches:', afterCounts.batches - beforeCounts.batches);
    console.log('   Cases:', afterCounts.cases - beforeCounts.cases);
    console.log('   Activities:', afterCounts.activities - beforeCounts.activities);
    console.log('   Courts:', afterCounts.courts - beforeCounts.courts);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    // Cleanup
    try {
      const { unlinkSync } = await import('fs');
      unlinkSync(join(process.cwd(), 'test-upload.csv'));
    } catch (e) {
      // File might not exist
    }
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  testCsvProcessingDirectly().catch(console.error);
}

export { testCsvProcessingDirectly };