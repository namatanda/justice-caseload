import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/middleware/auth';
import { logger } from '@/lib/logger';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { batchId: string } }
) {
  try {
    // Authentication check (consistent with existing import APIs)
    // const authResult = await requireAuth(request);
    // if (authResult instanceof NextResponse) {
    //   return authResult;
    // }

    const { batchId } = params;
    if (!batchId) {
      return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const errorType = searchParams.get('errorType') || undefined;
    const severity = searchParams.get('severity') || undefined;

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 });
    }

    // Query for batch existence and summary
    const batch = await prisma.dailyImportBatch.findUnique({
      where: { id: batchId },
      select: {
        successfulRecords: true,
        failedRecords: true,
        totalRecords: true, // Assuming totalRecords is available; if not, compute as successful + failed
      },
    });

    if (!batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    // Build filters for ImportErrorDetail
    const where: any = {
      batchId: batchId,
    };

    if (errorType) {
      where.errorType = { equals: errorType };
    }

    if (severity) {
      where.severity = { equals: severity };
    }

    // Count total matching errors
    const total = await prisma.importErrorDetail.count({ where });

    // Fetch paginated errors
    const skip = (page - 1) * limit;
    const errors = await prisma.importErrorDetail.findMany({
      where,
      skip,
      take: limit,
      orderBy: { rowNumber: 'asc' },
      select: {
        id: true,
        batchId: true,
        rowNumber: true,
        errorType: true,
        errorMessage: true,
        severity: true,
      },
    });

    // Calculate pagination
    const totalPages = Math.ceil(total / limit);

    // Response structure
    const response = {
      errors,
      total,
      batchSummary: {
        successfulRecords: batch.successfulRecords,
        failedRecords: batch.failedRecords,
        totalRecords: batch.totalRecords || batch.successfulRecords + batch.failedRecords,
      },
      pagination: {
        page,
        limit,
        totalPages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.api.error('Error fetching import errors', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}