import { prisma } from '@/lib/db';
import type { ImportStatus } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { BatchRepository } from './interfaces';
import { PrismaTransaction } from '@/lib/db';

/**
 * Batch Repository Implementation
 *
 * Handles all data access operations for DailyImportBatch entities.
*/

export class BatchRepositoryImpl extends BaseRepository<any> implements BatchRepository {
  constructor() {
    super(prisma.dailyImportBatch);
  }

  async findByChecksum(checksum: string): Promise<any | null> {
    return await prisma.dailyImportBatch.findFirst({
      where: {
        fileChecksum: checksum,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async updateStatus(id: string, status: ImportStatus, tx?: PrismaTransaction): Promise<any> {
    const client = tx ? tx.dailyImportBatch : prisma.dailyImportBatch;
    return await client.update({
      where: { id },
      data: {
        status,
        ...(status === 'COMPLETED' || status === 'FAILED' ? { completedAt: new Date() } : {})
      },
    });
  }

  async updateWithStats(
    id: string,
    data: {
      status: ImportStatus;
      totalRecords: number;
      successfulRecords: number;
      failedRecords: number;
      errorLogs?: any[];
      emptyRowsSkipped?: number;
    },
    tx?: PrismaTransaction
  ): Promise<any> {
    const client = tx ? tx.dailyImportBatch : prisma.dailyImportBatch;
    
    const updateData: any = {
      status: data.status,
      totalRecords: data.totalRecords,
      successfulRecords: data.successfulRecords,
      failedRecords: data.failedRecords,
      errorLogs: data.errorLogs || [],
      ...(data.status === 'COMPLETED' || data.status === 'FAILED' ? { completedAt: new Date() } : {})
    };

    if (data.emptyRowsSkipped !== undefined) {
      updateData.emptyRowsSkipped = data.emptyRowsSkipped;
    }

    return await client.update({
      where: { id },
      data: updateData,
    });
  }

  async updateWithEmptyRowStats(
    id: string,
    emptyRowsSkipped: number,
    tx?: PrismaTransaction
  ): Promise<any> {
    const client = tx ? tx.dailyImportBatch : prisma.dailyImportBatch;
    return await client.update({
      where: { id },
      data: {
        emptyRowsSkipped
      },
    });
  }

  async findHistory(limit: number): Promise<any[]> {
    return await prisma.dailyImportBatch.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });
  }

  async getImportStatus(batchId: string): Promise<any> {
    return await prisma.dailyImportBatch.findUnique({
      where: { id: batchId },
      select: {
        status: true,
        totalRecords: true,
        successfulRecords: true,
        failedRecords: true,
        createdAt: true,
        completedAt: true,
        errorLogs: true,
        emptyRowsSkipped: true,
      },
    }) as {
      status: any;
      totalRecords: number;
      successfulRecords: number;
      failedRecords: number;
      createdAt: Date;
      completedAt: Date | null;
      errorLogs: any;
      emptyRowsSkipped: number | null;
    } | null;
  }

  async getImportHistory(limit: number = 20): Promise<any[]> {
    const batches = await prisma.dailyImportBatch.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return batches.map((batch: any) => ({
      id: batch.id,
      filename: batch.filename,
      status: batch.status,
      totalRecords: batch.totalRecords,
      actualDataRows: batch.totalRecords - (batch.emptyRowsSkipped || 0),
      emptyRowsSkipped: batch.emptyRowsSkipped || 0,
      successfulRecords: batch.successfulRecords,
      failedRecords: batch.failedRecords,
      createdAt: batch.importDate?.toISOString() || null,
      completedAt: batch.completedAt?.toISOString() || null,
      createdBy: { name: 'System User', email: 'system@justice.go.ke' }, // Simplified for now
    }));
  }
}

// Export singleton instance
export const batchRepository = new BatchRepositoryImpl();
export default batchRepository;