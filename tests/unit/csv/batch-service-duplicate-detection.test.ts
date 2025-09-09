import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { batchService } from '../../../src/lib/csv/batch-service';

describe('BatchService Duplicate Detection', () => {
  test('should detect duplicate imports regardless of previous import status', async () => {
    const checksum = 'test-checksum-' + Date.now();
    
    // Create a failed import batch with the same checksum
    const failedBatch = await batchService.createBatch({
      filename: 'test-file.csv',
      fileSize: 1000,
      fileChecksum: checksum,
      userId: 'test-user-id'
    });
    
    // Update it to failed status with 0 successful records
    await batchService.updateBatchWithStats(failedBatch.id, {
      status: 'FAILED',
      totalRecords: 10,
      successfulRecords: 0,
      failedRecords: 10,
      errorLogs: []
    });
    
    // Try to create another batch with the same checksum
    // This should be detected as a duplicate
    const duplicateResult = await batchService.checkForDuplicateImport(checksum);
    
    // Currently this fails because the logic only considers COMPLETED/PROCESSING batches with successful records
    // After the fix, this should return the failed batch
    expect(duplicateResult).not.toBeNull();
    expect(duplicateResult?.id).toBe(failedBatch.id);
  });
  
  test('should detect duplicate imports with 0 successful records but completed status', async () => {
    const checksum = 'test-checksum-2-' + Date.now();
    
    // Create a completed import batch with 0 successful records
    const completedBatch = await batchService.createBatch({
      filename: 'test-file2.csv',
      fileSize: 1000,
      fileChecksum: checksum,
      userId: 'test-user-id'
    });
    
    // Update it to completed status with 0 successful records
    await batchService.updateBatchWithStats(completedBatch.id, {
      status: 'COMPLETED',
      totalRecords: 10,
      successfulRecords: 0,
      failedRecords: 10,
      errorLogs: []
    });
    
    // Try to create another batch with the same checksum
    const duplicateResult = await batchService.checkForDuplicateImport(checksum);
    
    // This should return the completed batch
    expect(duplicateResult).not.toBeNull();
    expect(duplicateResult?.id).toBe(completedBatch.id);
  });
});