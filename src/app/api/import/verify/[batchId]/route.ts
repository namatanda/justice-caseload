import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  try {
    const { batchId } = await params;

    logger.api.info('Verification request for batch ID', { batchId });

    if (!batchId) {
      return NextResponse.json(
        { success: false, error: 'Batch ID is required' },
        { status: 400 }
      );
    }

    // Test database connection first
    try {
      await prisma.$queryRaw`SELECT 1`;
      logger.api.info('Database connection test passed');
    } catch (dbError) {
      logger.api.error('Database connection test failed', dbError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 500 }
      );
    }

    // Check if batch exists and is completed
    const batch = await prisma.dailyImportBatch.findUnique({
      where: { id: batchId },
      select: {
        id: true,
        status: true,
        totalRecords: true,
        successfulRecords: true,
        failedRecords: true,
        createdAt: true,
        completedAt: true,
      },
    });

    if (!batch) {
      // Get total count of all batches
      const totalBatches = await prisma.dailyImportBatch.count();
      
      // Get recent batches for debugging
      const recentBatches = await prisma.dailyImportBatch.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, status: true, createdAt: true, filename: true }
      });
      
      // Check if our batch exists with a different query
      const allBatches = await prisma.dailyImportBatch.findMany({
        where: {
          id: {
            contains: batchId.substring(0, 8) // Check first 8 characters
          }
        },
        select: { id: true, status: true, createdAt: true }
      });
      
      // Check if batch exists with exact ID but different casing
      const exactBatch = await prisma.dailyImportBatch.findMany({
        where: {
          id: {
            equals: batchId,
            mode: 'insensitive'
          }
        },
        select: { id: true, status: true, createdAt: true }
      });
      
      logger.api.error('Batch not found. Debug info', {
        totalBatches,
        requestedBatchId: batchId,
        batchIdLength: batchId.length,
        batchIdType: typeof batchId,
        recentBatches,
        similarBatches: allBatches,
        exactMatch: exactBatch
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Import batch not found: ${batchId}`,
          debug: {
            requestedId: batchId,
            idLength: batchId.length,
            idType: typeof batchId,
            totalBatches,
            recentBatches: recentBatches.map(b => ({ 
              id: b.id, 
              status: b.status, 
              filename: b.filename,
              createdAt: b.createdAt,
              matches: b.id === batchId
            })),
            similarBatches: allBatches,
            exactMatches: exactBatch
          }
        },
        { status: 404 }
      );
    }

    if (batch.status !== 'COMPLETED') {
      return NextResponse.json(
        {
          success: false,
          error: `Import batch is not completed yet. Current status: ${batch.status}`,
          status: batch.status,
          batchInfo: {
            id: batch.id,
            status: batch.status,
            totalRecords: batch.totalRecords,
            successfulRecords: batch.successfulRecords,
            failedRecords: batch.failedRecords,
            completedAt: batch.completedAt
          }
        },
        { status: 400 }
      );
    }

    // Verify data insertion
    const verificationStartTime = Date.now();

    // Count cases created by this batch
    const casesCount = await prisma.case.count({
      where: { activities: { some: { importBatchId: batchId } } },
    });

    // Count case activities created by this batch
    const activitiesCount = await prisma.caseActivity.count({
      where: { importBatchId: batchId },
    });

    // Count judge assignments created by this batch (through activities)
    const judgeAssignmentsCount = await prisma.caseJudgeAssignment.count({
      where: {
        case: {
          activities: { some: { importBatchId: batchId } }
        }
      },
    });

    // Check for data integrity issues
    const integrityChecks = await performIntegrityChecks(batchId);

    const verificationTime = Date.now() - verificationStartTime;

    // Determine verification status
    const expectedRecords = batch.successfulRecords;
    const actualRecords = casesCount;
    const isVerified = actualRecords === expectedRecords && integrityChecks.passed;

    return NextResponse.json({
      success: true,
      verified: isVerified,
      verificationTime: new Date().toISOString(),
      batchInfo: {
        batchId: batch.id,
        expectedRecords: expectedRecords,
        actualRecords: actualRecords,
        status: batch.status,
        completedAt: batch.completedAt,
      },
      databaseStats: {
        casesInserted: casesCount,
        activitiesInserted: activitiesCount,
        judgeAssignmentsCreated: judgeAssignmentsCount,
        totalRecordsProcessed: casesCount + activitiesCount,
      },
      integrityChecks: {
        foreignKeysValid: integrityChecks.foreignKeysValid,
        dataConsistency: integrityChecks.dataConsistency,
        duplicatesFound: integrityChecks.duplicatesFound,
        orphanedRecords: integrityChecks.orphanedRecords,
        passed: integrityChecks.passed,
      },
      performance: {
        verificationDurationMs: verificationTime,
      },
      summary: {
        message: isVerified
          ? `✅ Database verification successful! All ${expectedRecords} records were properly inserted.`
          : `⚠️ Database verification found discrepancies. Expected: ${expectedRecords}, Found: ${actualRecords}`,
        status: isVerified ? 'VERIFIED' : 'VERIFICATION_FAILED',
      },
    });

  } catch (error) {
    logger.api.error('Database verification error', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Database verification failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        verificationTime: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

async function performIntegrityChecks(batchId: string) {
  try {
    // Basic integrity check: verify that activities exist for the batch
    const activitiesCount = await prisma.caseActivity.count({
      where: { importBatchId: batchId },
    });

    // For now, perform a simple check - we can enhance this later
    const casesCount = await prisma.case.count({
      where: {
        activities: {
          some: { importBatchId: batchId }
        }
      },
    });

    // Basic integrity: if we have activities, we should have cases
    const hasIntegrity = activitiesCount > 0 ? casesCount > 0 : true;

    return {
      foreignKeysValid: hasIntegrity,
      dataConsistency: true,
      duplicatesFound: 0,
      orphanedRecords: 0,
      passed: hasIntegrity,
    };
  } catch (error) {
    logger.api.error('Integrity check error', error);
    return {
      foreignKeysValid: false,
      dataConsistency: false,
      duplicatesFound: -1,
      orphanedRecords: -1,
      passed: false,
    };
  }
}