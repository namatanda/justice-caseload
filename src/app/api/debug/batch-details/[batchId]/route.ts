import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  // Skip debug endpoints in production build
  if (process.env.NODE_ENV === 'production' && process.env.SKIP_DEBUG_ROUTES === 'true') {
    return NextResponse.json(
      { success: false, error: 'Debug endpoints disabled in production build' },
      { status: 404 }
    );
  }

  try {
    const { batchId } = await params;

    const batch = await prisma.dailyImportBatch.findUnique({
      where: { id: batchId },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    if (!batch) {
      return NextResponse.json({
        success: false,
        error: 'Batch not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      batch: {
        id: batch.id,
        status: batch.status,
        filename: batch.filename,
        totalRecords: batch.totalRecords,
        successfulRecords: batch.successfulRecords,
        failedRecords: batch.failedRecords,
        errorLogs: batch.errorLogs,
        createdAt: batch.createdAt,
        completedAt: batch.completedAt,
        createdBy: batch.user
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}