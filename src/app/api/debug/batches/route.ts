import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { logger } from '@/lib/logger';

export async function GET() {
  // Skip debug endpoints in production build
  if (process.env.NODE_ENV === 'production' && process.env.SKIP_DEBUG_ROUTES === 'true') {
    return NextResponse.json(
      { success: false, error: 'Debug endpoints disabled in production build' },
      { status: 404 }
    );
  }

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
    logger.error('general', 'Error fetching batches:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch batches',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}