import { NextRequest, NextResponse } from 'next/server';
import { getImportStatus } from '@/lib/import/csv-processor';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const { batchId } = await params;

    if (!batchId) {
      return NextResponse.json(
        { success: false, error: 'Batch ID is required' },
        { status: 400 }
      );
    }

    const status = await getImportStatus(batchId);

    return NextResponse.json({
      success: true,
      batchId,
      ...status,
    });

  } catch (error) {
    const requestedBatchId = await params.then(p => p.batchId);
    logger.api.error('Status check failed', { error, batchId: requestedBatchId });

    if (error instanceof Error && error.message === 'Import batch not found') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Import batch not found',
          batchId: await params.then(p => p.batchId),
          details: 'The requested import batch does not exist in the database. It may have been deleted, failed to create, or the ID is invalid.'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}