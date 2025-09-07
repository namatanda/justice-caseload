import { NextRequest, NextResponse } from 'next/server';
import { processCsvImport } from '@/lib/import/csv-processor';
import type { ImportJobData } from '@/lib/database/redis';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('general', '🧪 DEBUG ENDPOINT: Starting import test');
    
    const body = await request.json();
    const { batchId } = body;
    
    if (!batchId) {
      return NextResponse.json(
        { success: false, error: 'Batch ID is required' },
        { status: 400 }
      );
    }
    
    logger.info('general', '🧪 DEBUG ENDPOINT: Testing import for batch:', batchId);
    
    // Get batch info from database
    const { prisma } = await import('@/lib/database');
    const batch = await prisma.dailyImportBatch.findUnique({
      where: { id: batchId },
      include: { user: true }
    });
    
    if (!batch) {
      return NextResponse.json(
        { success: false, error: 'Batch not found' },
        { status: 404 }
      );
    }
    
    logger.api.info('DEBUG ENDPOINT: Found batch', batch);
    
    // Create mock job data for testing
    const mockJobData: ImportJobData = {
      filePath: `/tmp/uploads/${batch.filename}`, // This might not exist, but we'll see what happens
      filename: batch.filename,
      fileSize: batch.fileSize,
      checksum: batch.fileChecksum,
      userId: batch.createdBy,
      batchId: batch.id,
    };
    
    logger.api.info('DEBUG ENDPOINT: Mock job data', mockJobData);
    
    // Try to process (this will likely fail but give us debug info)
    try {
      await processCsvImport(mockJobData);
      logger.info('general', '🧪 DEBUG ENDPOINT: Import processing completed successfully');
    } catch (error) {
      logger.error('general', '🧪 DEBUG ENDPOINT: Import processing failed:', error);
      return NextResponse.json({
        success: false,
        error: 'Import processing failed (expected for debug)',
        details: error instanceof Error ? error.message : 'Unknown error',
        debugInfo: 'Check server console for detailed logs'
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Debug test completed',
      batchId,
      debugInfo: 'Check server console for detailed logs'
    });
    
  } catch (error) {
    logger.error('general', '🧪 DEBUG ENDPOINT: Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Debug test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}