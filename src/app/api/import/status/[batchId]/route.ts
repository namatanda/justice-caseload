import { NextRequest, NextResponse } from 'next/server';
import { getImportStatus } from '@/lib/import/csv-processor';

export async function GET(
  request: NextRequest,
  { params }: { params: { batchId: string } }
) {
  try {
    const { batchId } = params;

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
    console.error('Status check error:', error);

    if (error instanceof Error && error.message === 'Import batch not found') {
      return NextResponse.json(
        { success: false, error: 'Import batch not found' },
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