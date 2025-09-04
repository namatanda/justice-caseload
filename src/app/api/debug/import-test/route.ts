import { NextRequest, NextResponse } from 'next/server';
import { processCsvImport } from '@/lib/import/csv-processor';
import type { ImportJobData } from '@/lib/database/redis';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 DEBUG ENDPOINT: Starting import test');
    
    const body = await request.json();
    const { batchId } = body;
    
    if (!batchId) {
      return NextResponse.json(
        { success: false, error: 'Batch ID is required' },
        { status: 400 }
      );
    }
    
    console.log('🧪 DEBUG ENDPOINT: Testing import for batch:', batchId);
    
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
    
    console.log('🧪 DEBUG ENDPOINT: Found batch:', JSON.stringify(batch, null, 2));
    
    // Create mock job data for testing
    const mockJobData: ImportJobData = {
      filePath: `/tmp/uploads/${batch.filename}`, // This might not exist, but we'll see what happens
      filename: batch.filename,
      fileSize: batch.fileSize,
      checksum: batch.fileChecksum,
      userId: batch.createdBy,
      batchId: batch.id,
    };
    
    console.log('🧪 DEBUG ENDPOINT: Mock job data:', JSON.stringify(mockJobData, null, 2));
    
    // Try to process (this will likely fail but give us debug info)
    try {
      await processCsvImport(mockJobData);
      console.log('🧪 DEBUG ENDPOINT: Import processing completed successfully');
    } catch (error) {
      console.error('🧪 DEBUG ENDPOINT: Import processing failed:', error);
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
    console.error('🧪 DEBUG ENDPOINT: Error:', error);
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