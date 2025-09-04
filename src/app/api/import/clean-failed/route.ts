import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

/**
 * API route to clear failed imports
 * This is helpful for cleaning up failed imports that might be blocking new uploads
 */
export async function POST(request: NextRequest) {
  try {
    // Optional batch ID parameter to clean a specific import
    const { batchId } = await request.json();
    
    // Create a where clause based on input
    const whereClause: any = {
      OR: [
        { status: 'FAILED' },
        { successfulRecords: 0, status: 'COMPLETED' } // Completed but with 0 successful records
      ]
    };
    
    // If a specific batch ID was provided, add it to the where clause
    if (batchId) {
      whereClause.id = batchId;
    }
    
    // Update the status of all matching records to 'CLEANED'
    const result = await prisma.dailyImportBatch.updateMany({
      where: whereClause,
      data: {
        status: 'CLEANED' as any // Type assertion as any to bypass Prisma type checking until client is regenerated
      }
    });
    
    return NextResponse.json({
      success: true,
      message: `Cleared ${result.count} failed import records`,
      count: result.count
    });
  } catch (error) {
    console.error('Failed to clear import records:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to clear import records',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * API route to get information about a specific batch
 */
export async function GET(request: NextRequest) {
  try {
    // Get batch ID from URL params
    const url = new URL(request.url);
    const batchId = url.searchParams.get('batchId');
    
    if (!batchId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing batchId parameter'
        },
        { status: 400 }
      );
    }
    
    // Get the batch information
    const batch = await prisma.dailyImportBatch.findUnique({
      where: { id: batchId }
    });
    
    if (!batch) {
      return NextResponse.json(
        {
          success: false,
          error: 'Batch not found'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      batch: {
        id: batch.id,
        filename: batch.filename,
        status: batch.status,
        totalRecords: batch.totalRecords,
        successfulRecords: batch.successfulRecords,
        failedRecords: batch.failedRecords,
        createdAt: batch.createdAt,
        completedAt: batch.completedAt
      }
    });
  } catch (error) {
    console.error('Failed to get batch information:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get batch information',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}