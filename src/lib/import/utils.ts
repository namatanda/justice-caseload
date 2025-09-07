import { PrismaClient } from '@prisma/client';
import { logger } from '../logger';
import crypto from 'crypto';

const prisma = new PrismaClient();

export function deriveCourtTypeFromCaseId(caseId: string): 'SC' | 'ELC' | 'ELRC' | 'KC' | 'SCC' | 'COA' | 'MC' | 'HC' | 'TC' {
  const lowerCaseId = caseId.toLowerCase();
  
  // Simple mapping based on common case ID patterns
  if (lowerCaseId.includes('hc')) return 'HC';
  if (lowerCaseId.includes('sc')) return 'SC';
  if (lowerCaseId.includes('elc')) return 'ELC';
  if (lowerCaseId.includes('elrc')) return 'ELRC';
  if (lowerCaseId.includes('kc')) return 'KC';
  if (lowerCaseId.includes('coa')) return 'COA';
  if (lowerCaseId.includes('mc')) return 'MC';
  if (lowerCaseId.includes('tc')) return 'TC';
  
  // Default to magistrate court
  return 'MC';
}

export async function getOrCreateSystemUser(): Promise<string> {
  try {
    // Try to find existing system user
    let systemUser = await prisma.user.findFirst({
      where: {
        email: 'system@justice-caseload.com'
      }
    });

    if (!systemUser) {
      // Create system user
      systemUser = await prisma.user.create({
        data: {
          email: 'system@justice-caseload.com',
          name: 'System Import User',
          role: 'DATA_ENTRY',
          isActive: true
        }
      });
      logger.info('database', 'Created system import user');
    }

    return systemUser.id;
  } catch (error) {
    logger.error('database', `Failed to get or create system user: ${error}`);
    // Fallback to empty values - in production, this should be handled more robustly
    return '';
  }
}

export async function calculateFileChecksum(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fs = require('fs');
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    stream.on('data', (data: Buffer) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

export async function getImportStatus(batchId: string): Promise<any> {
  try {
    const batch = await prisma.dailyImportBatch.findUnique({
      where: { id: batchId },
      select: {
        id: true,
        status: true,
        totalRecords: true,
        successfulRecords: true,
        failedRecords: true,
        createdAt: true,
        completedAt: true
      }
    });

    if (!batch) {
      return { status: 'NOT_FOUND', message: 'Batch not found' };
    }

    return {
      batchId: batch.id,
      status: batch.status,
      progress: batch.totalRecords > 0 ? 
        Math.round((batch.successfulRecords / batch.totalRecords) * 100) : 0,
      total: batch.totalRecords,
      successful: batch.successfulRecords,
      failed: batch.failedRecords,
      createdAt: batch.createdAt,
      completedAt: batch.completedAt
    };
  } catch (error) {
    logger.error('database', `Failed to get import status for ${batchId}: ${error}`);
    return { status: 'ERROR', message: 'Failed to retrieve status' };
  }
}

export async function getImportHistory(limit: number = 10): Promise<any[]> {
  try {
    const batches = await prisma.dailyImportBatch.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        filename: true,
        status: true,
        totalRecords: true,
        successfulRecords: true,
        failedRecords: true,
        createdAt: true,
        completedAt: true
      }
    });

    return batches.map(batch => ({
      id: batch.id,
      filename: batch.filename,
      status: batch.status,
      total: batch.totalRecords,
      successful: batch.successfulRecords,
      failed: batch.failedRecords,
      createdAt: batch.createdAt,
      completedAt: batch.completedAt,
      duration: batch.completedAt ? 
        Math.round((batch.completedAt.getTime() - batch.createdAt.getTime()) / 1000) : null
    }));
  } catch (error) {
    logger.error('database', `Failed to get import history: ${error}`);
    return [];
  }
}

// Simple duplicate detection utility
export function detectDuplicateCase(rows: any[], caseField: string = 'caseNumber'): string[] {
  const seen = new Set();
  const duplicates: string[] = [];

  for (const row of rows) {
    const caseValue = row[caseField];
    if (seen.has(caseValue)) {
      duplicates.push(caseValue);
    } else {
      seen.add(caseValue);
    }
  }

  return Array.from(new Set(duplicates));
}

// Export Prisma client for reuse in other modules
export { prisma };