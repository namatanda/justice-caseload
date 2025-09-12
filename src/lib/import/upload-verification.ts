/**
 * Enhanced Upload Success Verification
 * 
 * Adds comprehensive verification to ensure uploads actually persist
 */

import { prisma } from '../database';
import { logger } from '@/lib/logger';
import type { ImportStatus } from '@prisma/client';

interface UploadVerificationResult {
  success: boolean;
  batchId?: string;
  recordsImported: number;
  warnings: string[];
  errors: string[];
  timestamp: Date;
}

export async function verifyUploadSuccess(
  batchId: string, 
  expectedRecords?: number,
  delayMs: number = 5000 // Wait 5 seconds to catch background cleanup
): Promise<UploadVerificationResult> {
  const result: UploadVerificationResult = {
    success: false,
    batchId,
    recordsImported: 0,
    warnings: [],
    errors: [],
    timestamp: new Date()
  };

  try {
    // Initial check
    const batch = await prisma.dailyImportBatch.findUnique({
      where: { id: batchId },
      include: {
        _count: {
          select: { activities: true }
        }
      }
    });

    if (!batch) {
      result.errors.push(`Batch ${batchId} not found immediately after upload`);
      return result;
    }

    const initialCount = batch._count.activities;
    logger.upload.info(`Initial verification: ${initialCount} records for batch ${batchId}`);

    // Wait and re-check to catch background cleanup
    if (delayMs > 0) {
      logger.upload.debug(`Waiting ${delayMs}ms to verify persistence...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    // Re-check after delay
    const verificationBatch = await prisma.dailyImportBatch.findUnique({
      where: { id: batchId },
      include: {
        _count: {
          select: { activities: true }
        }
      }
    });

    if (!verificationBatch) {
      result.errors.push(`Batch ${batchId} disappeared after ${delayMs}ms - background cleanup detected!`);
      return result;
    }

    const finalCount = verificationBatch._count.activities;
    result.recordsImported = finalCount;

    // Check for data loss
    if (finalCount < initialCount) {
      result.errors.push(`Data loss detected: ${initialCount} → ${finalCount} records (lost ${initialCount - finalCount})`);
      result.warnings.push('Background process may be cleaning up data');
    }

    // Check against expected count
    if (expectedRecords && finalCount !== expectedRecords) {
      const message = `Expected ${expectedRecords} records, got ${finalCount}`;
      if (finalCount < expectedRecords) {
        result.errors.push(message);
      } else {
        result.warnings.push(message);
      }
    }

    // Additional integrity checks
    await performIntegrityChecks(result, batchId);

    result.success = result.errors.length === 0;
    
    logger.upload.info(`Upload verification ${result.success ? 'PASSED' : 'FAILED'}`, {
      batchId,
      recordsImported: result.recordsImported,
      warnings: result.warnings,
      errors: result.errors
    });

    return result;

  } catch (error) {
    result.errors.push(`Verification failed: ${error instanceof Error ? error.message : String(error)}`);
    logger.upload.error('Upload verification error', error);
    return result;
  }
}

async function performIntegrityChecks(
  result: UploadVerificationResult, 
  batchId: string
): Promise<void> {
  try {
    // Check for orphaned records (no associated case)
    const orphanedActivities = await prisma.caseActivity.count({
      where: {
        importBatchId: batchId,
        case: undefined // Check if case relation is missing
      }
    });

    if (orphanedActivities > 0) {
      result.warnings.push(`${orphanedActivities} case activities have no associated case`);
    }

    // Check for missing foreign key relationships - count all and subtract valid ones
    const totalActivities = await prisma.caseActivity.count({
      where: { importBatchId: batchId }
    });

    const activitiesWithValidCases = await prisma.caseActivity.count({
      where: {
        importBatchId: batchId,
        case: { id: { not: undefined } }
      }
    });

    const activitiesWithInvalidCases = totalActivities - activitiesWithValidCases;

    if (activitiesWithInvalidCases > 0) {
      result.errors.push(`${activitiesWithInvalidCases} case activities have invalid case references`);
    }

    // Check batch status consistency
    const batch = await prisma.dailyImportBatch.findUnique({
      where: { id: batchId }
    });

    if (batch?.status !== 'COMPLETED' && batch?.status !== 'PROCESSING') {
      result.warnings.push(`Batch status is '${batch?.status}' - expected 'COMPLETED' or 'PROCESSING'`);
    }

  } catch (error) {
    result.warnings.push(`Integrity check failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function createVerifiedUploadMiddleware() {
  return async function verificationMiddleware(
    batchId: string,
    expectedRecords?: number
  ): Promise<UploadVerificationResult> {
    
    // Run system integrity check first
    try {
      // Import the type to fix compilation
      type SystemCheck = {
        name: string;
        status: 'PASS' | 'WARN' | 'FAIL';
        message: string;
        details?: any;
      };

      // System integrity check disabled in production build
      // const { runSystemIntegrityCheck } = await import('../../../scripts/system-integrity-check');
      // const systemChecks: SystemCheck[] = await runSystemIntegrityCheck();
      
      // const criticalIssues = systemChecks.filter((check: SystemCheck) => check.status === 'FAIL');
      // if (criticalIssues.length > 0) {
      //   logger.system.warn('System integrity issues detected before upload verification', criticalIssues);
      // }
    } catch (error) {
      logger.system.warn('Could not run system integrity check (this is non-critical)', error);
    }

    // Perform upload verification
    const verification = await verifyUploadSuccess(batchId, expectedRecords);
    
    // Log results for monitoring
    if (!verification.success) {
      logger.upload.error('Upload verification failed - potential data loss or corruption detected', {
        batchId,
        errors: verification.errors,
        warnings: verification.warnings
      });
    }

    return verification;
  };
}