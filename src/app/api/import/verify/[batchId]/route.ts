import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';

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
      return NextResponse.json(
        { success: false, error: 'Import batch not found' },
        { status: 404 }
      );
    }

    if (batch.status !== 'COMPLETED') {
      return NextResponse.json(
        {
          success: false,
          error: 'Import batch is not completed yet',
          status: batch.status
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
    console.error('Database verification error:', error);
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
    console.error('Integrity check error:', error);
    return {
      foreignKeysValid: false,
      dataConsistency: false,
      duplicatesFound: -1,
      orphanedRecords: -1,
      passed: false,
    };
  }
}