#!/usr/bin/env tsx

import { processCsvImport } from '@/lib/import/csv-processor';
import type { ImportJobData } from '@/lib/database/redis';

async function testCsvProcessing() {
  console.log('🧪 Testing CSV processing...');
  
  // Check environment variables
  console.log('Environment check:');
  console.log('  USE_TEST_DB:', process.env.USE_TEST_DB || '<not set>');
  console.log('  NODE_ENV:', process.env.NODE_ENV || '<not set>');
  console.log('  DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not set');
  
  // Test dry-run logic
  const dryRunDefault = process.env.USE_TEST_DB !== '1';
  console.log('  Default dry-run mode:', dryRunDefault);
  
  // Create test job data
  const testJobData: ImportJobData = {
    filePath: 'C:\\Users\\Alexra\\SourceCode\\justice-caseload\\data\\case_returns.csv',
    filename: 'case_returns.csv',
    fileSize: 1024,
    checksum: 'test-checksum',
    userId: 'test-user',
    batchId: '40e95b4e-816a-4b12-9bb9-39fab5b3fd3a' // Use the existing batch ID
  };
  
  console.log('\n🚀 Testing processCsvImport with explicit dry-run = false...');
  
  try {
    await processCsvImport(testJobData, { dryRun: false });
    console.log('✅ Processing completed successfully');
  } catch (error) {
    console.error('❌ Processing failed:', error);
  }
}

testCsvProcessing();