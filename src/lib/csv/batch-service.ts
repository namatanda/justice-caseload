/**
 * Batch Service Module
 * 
 * Handles all batch-related database operations including:
 * - Creating import batches
 * - Updating batch status
 * - Retrieving batch information and history
 * - Managing system user for imports
 */

import { prisma, cacheManager } from '../database';
import { logger } from '../logger';
import type {
  BatchService,
  BatchCreationData,
  ImportBatch,
  BatchStatus
} from './interfaces';

export class BatchServiceImpl implements BatchService {
  /**
   * Create a new import batch
   */
  async createBatch(batchData: BatchCreationData): Promise<ImportBatch> {
    try {
      logger.database.info('Creating import batch', {
        filename: batchData.filename,
        fileSize: batchData.fileSize,
        checksum: batchData.fileChecksum.substring(0, 20) + '...',
        userId: batchData.userId
      });

      // Ensure the user exists or create a placeholder
      await this.ensureUserExists(batchData.userId);

      const importBatch = await prisma.dailyImportBatch.create({
        data: {
          importDate: new Date(),
          filename: batchData.filename,
          fileSize: batchData.fileSize,
          fileChecksum: batchData.fileChecksum,
          totalRecords: 0,
          successfulRecords: 0,
          failedRecords: 0,
          errorLogs: [],
          userConfig: {},
          validationWarnings: [],
          status: 'PENDING',
          createdBy: batchData.userId,
        },
      });

      logger.database.info('Import batch created successfully', {
        id: importBatch.id,
        status: importBatch.status,
        createdAt: importBatch.createdAt
      });

      return {
        ...importBatch,
        errorLogs: importBatch.errorLogs as any[]
      };
    } catch (error) {
      logger.database.error('Failed to create import batch', error);
      throw new Error(`Failed to create import batch: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update batch status with optimized single query
   */
  async updateBatchStatus(batchId: string, status: BatchStatus): Promise<void> {
    try {
      logger.database.info('Updating batch status', { batchId, status });

      await prisma.dailyImportBatch.update({
        where: { id: batchId },
        data: {
          status,
          ...(status === 'COMPLETED' || status === 'FAILED' ? { completedAt: new Date() } : {})
        },
      });

      logger.database.info('Batch status updated successfully', { batchId, status });
    } catch (error) {
      logger.database.error('Failed to update batch status', { batchId, status, error });
      throw new Error(`Failed to update batch status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update batch with statistics in a single optimized query
   */
  async updateBatchWithStats(
    batchId: string,
    stats: {
      status: BatchStatus;
      totalRecords: number;
      successfulRecords: number;
      failedRecords: number;
      errorLogs?: any[];
      emptyRowsSkipped?: number;
    }
  ): Promise<void> {
    try {
      logger.database.info('Updating batch with stats', { batchId, stats });

      const updateData: any = {
        status: stats.status,
        totalRecords: stats.totalRecords,
        successfulRecords: stats.successfulRecords,
        failedRecords: stats.failedRecords,
        errorLogs: stats.errorLogs || [],
        ...(stats.status === 'COMPLETED' || stats.status === 'FAILED' ? { completedAt: new Date() } : {})
      };

      if (stats.emptyRowsSkipped !== undefined) {
        updateData.emptyRowsSkipped = stats.emptyRowsSkipped;
      }

      await prisma.dailyImportBatch.update({
        where: { id: batchId },
        data: updateData,
      });

      logger.database.info('Batch stats updated successfully', { batchId, stats });
    } catch (error) {
      logger.database.error('Failed to update batch stats', { batchId, stats, error });
      throw new Error(`Failed to update batch stats: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update batch with empty row statistics
   */
  async updateBatchWithEmptyRowStats(
    batchId: string,
    emptyRowsSkipped: number
  ): Promise<void> {
    try {
      logger.database.info('Updating batch with empty row statistics', {
        batchId,
        emptyRowsSkipped
      });

      const updateData: any = {
        emptyRowsSkipped
      };

      await prisma.dailyImportBatch.update({
        where: { id: batchId },
        data: updateData,
      });

      logger.database.info('Batch empty row statistics updated successfully', {
        batchId,
        emptyRowsSkipped
      });
    } catch (error) {
      logger.database.error('Failed to update batch empty row statistics', {
        batchId,
        emptyRowsSkipped,
        error
      });
      throw new Error(`Failed to update batch empty row statistics: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get batch by ID
   */
  async getBatch(batchId: string): Promise<ImportBatch | null> {
    try {
      logger.database.debug('Retrieving batch', { batchId });

      const batch = await prisma.dailyImportBatch.findUnique({
        where: { id: batchId },
      });

      if (!batch) {
        logger.database.debug('Batch not found', { batchId });
        return null;
      }

      logger.database.debug('Batch retrieved successfully', {
        batchId,
        status: batch.status,
        filename: batch.filename
      });

      return {
        id: batch.id,
        importDate: batch.importDate,
        filename: batch.filename,
        fileSize: batch.fileSize,
        fileChecksum: batch.fileChecksum,
        totalRecords: batch.totalRecords,
        successfulRecords: batch.successfulRecords,
        failedRecords: batch.failedRecords,
        status: batch.status,
        errorLogs: batch.errorLogs as any[],
        completedAt: batch.completedAt || undefined,
        createdBy: batch.createdBy,
        emptyRowsSkipped: batch.emptyRowsSkipped || undefined,
      };
    } catch (error) {
      logger.database.error('Failed to retrieve batch', { batchId, error });
      throw new Error(`Failed to retrieve batch: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get batch history with limit
   */
  async getBatchHistory(limit: number): Promise<ImportBatch[]> {
    try {
      logger.database.debug('Retrieving batch history', { limit });

      const batches = await prisma.dailyImportBatch.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      });

      logger.database.debug('Batch history retrieved successfully', {
        count: batches.length,
        limit
      });

      return batches.map(batch => ({
        id: batch.id,
        importDate: batch.importDate,
        filename: batch.filename,
        fileSize: batch.fileSize,
        fileChecksum: batch.fileChecksum,
        totalRecords: batch.totalRecords,
        successfulRecords: batch.successfulRecords,
        failedRecords: batch.failedRecords,
        status: batch.status,
        errorLogs: batch.errorLogs as any[],
        completedAt: batch.completedAt || undefined,
        createdBy: batch.createdBy,
        emptyRowsSkipped: batch.emptyRowsSkipped || undefined,
      }));
    } catch (error) {
      logger.database.error('Failed to retrieve batch history', { limit, error });
      throw new Error(`Failed to retrieve batch history: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get or create system user for imports
   */
  async getOrCreateSystemUser(): Promise<string> {
    try {
      logger.database.info('Getting or creating system user...');

      // Try to find an existing admin user
      let systemUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: 'admin@justice.go.ke' },
            { email: 'system@justice.go.ke' },
            { role: 'ADMIN' }
          ]
        }
      });

      logger.database.debug('Existing system user found', systemUser ? { id: systemUser.id, email: systemUser.email } : { found: false });

      // If no admin user exists, create a system user
      if (!systemUser) {
        logger.database.info('Creating new system user...');
        systemUser = await prisma.user.create({
          data: {
            email: 'system@justice.go.ke',
            name: 'System Import User',
            role: 'ADMIN',
            isActive: true,
          }
        });
        logger.database.info('System user created', { id: systemUser.id, email: systemUser.email });
      }

      logger.database.debug('Returning system user ID', { userId: systemUser.id });
      return systemUser.id;
    } catch (error) {
      logger.database.error('Failed to get/create system user', error);
      throw new Error('Failed to initialize system user for import');
    }
  }

  /**
   * Check for duplicate imports by checksum
   */
  async checkForDuplicateImport(checksum: string): Promise<ImportBatch | null> {
    try {
      logger.database.info('Checking for duplicate import', {
        checksum: checksum.substring(0, 20) + '...'
      });

      // Consider ANY previous import with the same checksum as a duplicate
      // This prevents importing the same file multiple times regardless of previous import status
      const existingImport = await prisma.dailyImportBatch.findFirst({
        where: {
          fileChecksum: checksum,
        },
        orderBy: {
          createdAt: 'desc' // Get the most recent import if there are multiple
        }
      });

      if (existingImport) {
        logger.database.warn('Duplicate import found', {
          existingImportId: existingImport.id,
          status: existingImport.status,
          successfulRecords: existingImport.successfulRecords
        });
        return {
          id: existingImport.id,
          importDate: existingImport.importDate,
          filename: existingImport.filename,
          fileSize: existingImport.fileSize,
          fileChecksum: existingImport.fileChecksum,
          totalRecords: existingImport.totalRecords,
          successfulRecords: existingImport.successfulRecords,
          failedRecords: existingImport.failedRecords,
          status: existingImport.status,
          errorLogs: existingImport.errorLogs as any[],
          completedAt: existingImport.completedAt || undefined,
          createdBy: existingImport.createdBy,
          emptyRowsSkipped: existingImport.emptyRowsSkipped || undefined,
        };
      }

      logger.database.info('No duplicate import found');
      return null;
    } catch (error) {
      logger.database.error('Failed to check for duplicate import', { checksum, error });
      throw new Error(`Failed to check for duplicate import: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get import status with cache fallback
   */
  async getImportStatus(batchId: string): Promise<any> {
    try {
      logger.database.info('Getting import status', { batchId });

      // Always get database data first for complete information
      const batch = await prisma.dailyImportBatch.findUnique({
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

      if (!batch) {
        logger.database.info('Batch not found in database', { batchId });

        // For debugging, list recent batches
        const recentBatches = await prisma.dailyImportBatch.findMany({
          select: { id: true, filename: true, createdAt: true, status: true },
          orderBy: { createdAt: 'desc' },
          take: 5
        });

        logger.database.debug(`Recent batches (${recentBatches.length} found)`,
          recentBatches.map(b => `${b.id.substring(0, 8)}... (${b.filename}, ${b.status})`));

        throw new Error('Import batch not found');
      }

      // Calculate actual data rows (excluding empty rows)
      const emptyRowsSkipped = batch?.emptyRowsSkipped ?? 0;
      const actualDataRows = batch.totalRecords - emptyRowsSkipped;

      // Base status from database
      const status = {
        status: batch.status,
        progress: batch.status === 'COMPLETED' ? 100 : batch.status === 'FAILED' ? 0 : 50,
        message: `Import ${batch.status.toLowerCase()}`,
        totalRecords: batch.totalRecords,
        actualDataRows,
        emptyRowsSkipped,
        processedRecords: batch.successfulRecords + batch.failedRecords,
        successfulRecords: batch.successfulRecords,
        failedRecords: batch.failedRecords,
        errors: batch.errorLogs || [],
        startedAt: batch.createdAt?.toISOString() || null,
        completedAt: batch.completedAt?.toISOString() || null,
        failureReason: null,
        failureCategory: null,
        duplicatesSkipped: 0
      };

      // Check cache for more up-to-date progress information
      const cachedStatus = await cacheManager.getImportStatus(batchId);
      if (cachedStatus) {
        logger.database.info('Found cached status, merging with database data');
        
        // Merge cached status with database data, preferring cache for real-time fields
        return {
          ...status,
          status: cachedStatus.status || status.status,
          progress: cachedStatus.progress !== undefined ? cachedStatus.progress : status.progress,
          message: cachedStatus.message || status.message,
          // Keep database statistics as they are the source of truth
          stats: cachedStatus.stats,
          duplicatesSkipped: cachedStatus.stats?.duplicatesSkipped || 0,
          failureReason: cachedStatus.stats?.failureReason || status.failureReason,
          failureCategory: cachedStatus.stats?.failureCategory || status.failureCategory
        };
      }

      logger.database.info('Import status retrieved from database', {
        batchId,
        status: status.status
      });

      return status;
    } catch (error) {
      logger.database.error('Failed to get import status', { batchId, error });
      throw error;
    }
  }

  /**
   * Get formatted import history
   */
  async getImportHistory(limit: number = 20): Promise<any[]> {
    try {
      logger.database.debug('Getting formatted import history', { limit });

      const batches = await this.getBatchHistory(limit);

      const formattedHistory = await Promise.all(batches.map(async (batch) => {
        const emptyRowsSkipped = batch.emptyRowsSkipped || 0;
        const actualDataRows = batch.totalRecords - emptyRowsSkipped;

        // Get cached status to include runtime stats like duplicatesSkipped
        let cachedStatus = null;
        try {
          cachedStatus = await cacheManager.getImportStatus(batch.id);
        } catch (cacheError) {
          logger.database.debug('Failed to get cached status for batch', { batchId: batch.id, error: cacheError });
        }

        const duplicatesSkipped = cachedStatus?.stats?.duplicatesSkipped || 0;
        const failureReason = cachedStatus?.stats?.failureReason || null;
        const failureCategory = cachedStatus?.stats?.failureCategory || null;

        return {
          id: batch.id,
          filename: batch.filename,
          status: batch.status,
          totalRecords: batch.totalRecords,
          actualDataRows,
          emptyRowsSkipped,
          duplicatesSkipped,
          successfulRecords: batch.successfulRecords,
          failedRecords: batch.failedRecords,
          createdAt: batch.importDate?.toISOString() || null,
          completedAt: batch.completedAt?.toISOString() || null,
          createdBy: { name: 'System User', email: 'system@justice.go.ke' }, // Simplified for now
          failureReason,
          failureCategory
        };
      }));

      logger.database.debug('Formatted import history retrieved', {
        count: formattedHistory.length
      });

      return formattedHistory;
    } catch (error) {
      logger.database.error('Failed to get formatted import history', { limit, error });
      throw error;
    }
  }

  /**
   * Private helper to ensure user exists
   */
  private async ensureUserExists(userId: string): Promise<void> {
    try {
      const existingUser = await prisma.user.findUnique({ where: { id: userId } });
      if (!existingUser) {
        logger.database.info('User not found for createdBy, creating placeholder user', { userId });
        await prisma.user.create({
          data: {
            id: userId,
            email: `${userId}@local.invalid`,
            name: `importer:${userId}`,
            role: 'DATA_ENTRY',
            isActive: true
          }
        });
      }
    } catch (userCheckErr) {
      // If user creation fails, log and continue — batch create will still surface
      // a clearer FK error if something is wrong with the users table.
      logger.database.error('Warning: failed to ensure user exists for import batch createdBy', userCheckErr);
    }
  }
}

// Export singleton instance
export const batchService = new BatchServiceImpl();