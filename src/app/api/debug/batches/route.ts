import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { withDevOnly, withDebugWarnings } from '@/lib/api/debug';
import { withErrorHandler, DatabaseError } from '@/lib/errors/api-errors';

async function batchesDebugHandler() {

  try {
    const batches = await prisma.dailyImportBatch.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        filename: true,
        totalRecords: true,
        successfulRecords: true,
        failedRecords: true,
        createdAt: true,
        completedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      batches,
      count: batches.length
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('database')) {
      throw new DatabaseError('Failed to fetch debug batch data');
    }
    throw error;
  }
}

// Export with all middleware layers
export const GET = withDevOnly(
  withDebugWarnings(
    withErrorHandler(batchesDebugHandler, '/api/debug/batches')
  )
);