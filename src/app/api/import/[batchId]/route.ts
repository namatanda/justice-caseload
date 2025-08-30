import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { importQueue } from '@/lib/database/redis';

export async function DELETE(
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

    // Check if batch exists and can be cancelled
    const batch = await prisma.dailyImportBatch.findUnique({
      where: { id: batchId },
      select: {
        id: true,
        status: true,
        filename: true,
      },
    });

    if (!batch) {
      return NextResponse.json(
        { success: false, error: 'Import batch not found' },
        { status: 404 }
      );
    }

    if (batch.status === 'COMPLETED' || batch.status === 'FAILED') {
      return NextResponse.json(
        { success: false, error: 'Cannot cancel a completed or failed import' },
        { status: 400 }
      );
    }

    // Update batch status to cancelled
    await prisma.dailyImportBatch.update({
      where: { id: batchId },
      data: {
        status: 'FAILED',
        errorLogs: [{
          rowNumber: 0,
          errorType: 'cancelled',
          errorMessage: 'Import was cancelled by user',
        }],
        completedAt: new Date(),
      },
    });

    // Try to remove from queue if still pending
    try {
      const jobs = await importQueue.getJobs(['active', 'waiting', 'delayed']);
      const jobToRemove = jobs.find(job => job.data.batchId === batchId);
      if (jobToRemove) {
        await jobToRemove.remove();
      }
    } catch (queueError) {
      console.warn('Could not remove job from queue:', queueError);
    }

    return NextResponse.json({
      success: true,
      message: 'Import cancelled successfully',
      batchId,
    });

  } catch (error) {
    console.error('Cancel import error:', error);
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

export async function POST(
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

    // Check if batch exists and can be retried
    const batch = await prisma.dailyImportBatch.findUnique({
      where: { id: batchId },
      select: {
        id: true,
        status: true,
        filename: true,
        fileSize: true,
        fileChecksum: true,
        createdBy: true,
      },
    });

    if (!batch) {
      return NextResponse.json(
        { success: false, error: 'Import batch not found' },
        { status: 404 }
      );
    }

    if (batch.status !== 'FAILED') {
      return NextResponse.json(
        { success: false, error: 'Only failed imports can be retried' },
        { status: 400 }
      );
    }

    // For retry, we need the original file. Since we don't store filePath,
    // we'll need to inform the user that they need to re-upload the file
    // This is a limitation of the current design - in a production system,
    // you might want to store files temporarily for a period after import
    return NextResponse.json(
      {
        success: false,
        error: 'Retry requires re-uploading the original file',
        details: 'The original file is no longer available. Please upload the file again to retry the import.',
        batchInfo: {
          filename: batch.filename,
          fileSize: batch.fileSize,
          checksum: batch.fileChecksum,
        }
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('Retry import error:', error);
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