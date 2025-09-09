import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { createHash } from 'crypto';
import { validateUploadedFile, saveUploadedFile, validateCsvStructure } from '@/lib/import/file-handler';
import { importService } from '@/lib/csv/import-service';
import { batchService } from '@/lib/csv/batch-service';
import { IMPORT_CONFIG } from '@/lib/import';
import { checkRedisConnection } from '@/lib/database/redis';
import type { ImportJobData } from '@/lib/database/redis';
import { prisma } from '@/lib/database';
import { logger } from '@/lib/logger';
import { processCsvImport } from '@/lib/import/csv-processor';


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const config = formData.get('config') ? JSON.parse(formData.get('config') as string) : {};
    
    // Check for sync mode from query parameters or form data
    const { searchParams } = new URL(request.url);
    const syncParam = searchParams.get('sync');
    const formProcessingMode = formData.get('processingMode') as string;
    const processingMode = syncParam === 'true' ? 'sync' : (formProcessingMode || 'auto');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = await validateUploadedFile(file);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'File validation failed',
          errors: validation.errors,
          warnings: validation.warnings,
          errorCount: validation.errors.length,
          warningCount: validation.warnings.length
        },
        { status: 400 }
      );
    }

    // Save file temporarily
    const saveResult = await saveUploadedFile(file);
    logger.upload.info('File save result', { success: saveResult.success, filePath: saveResult.filePath, fileSize: file.size });
    if (!saveResult.success || !saveResult.filePath) {
      throw new Error('File save failed: No file path returned');
    }
    if (!saveResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save file',
          details: saveResult.error
        },
        { status: 500 }
      );
    }

    // Validate CSV structure
    const structureValidation = await validateCsvStructure(saveResult.filePath!);
    
    if (!structureValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'CSV structure validation failed',
          details: structureValidation.errors
        },
        { status: 400 }
      );
    }

    // Get or create system user for imports
    const userId = await batchService.getOrCreateSystemUser();
    logger.upload.debug('UserId obtained in upload route', { userId });

    // Check Redis connection for queue-based processing
    const isRedisAvailable = processingMode === 'sync' ? false : await checkRedisConnection();
    logger.upload.info('Redis availability check', { isRedisAvailable, processingMode });

    if (isRedisAvailable) {
      // Use queue-based processing (asynchronous)
      try {
        logger.upload.info('Initiating import with', { filePath: saveResult.filePath, filename: file.name, fileSize: file.size, userId });
        try {
          const result = await importService.initiateImport(saveResult.filePath!, file.name, file.size, userId);
          if (!result.success) {
            throw new Error(result.error || 'Failed to initiate import');
          }
          const batchId = result.batchId;
          
          logger.upload.info('Import initiated, returning batchId', { batchId });
          
          // Wait a moment to ensure the batch is persisted before returning
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Verify batch exists before returning success
          const batchExists = await prisma.dailyImportBatch.findUnique({
            where: { id: batchId }
          });
          
          if (!batchExists) {
            logger.upload.error('Batch was created but not found in database after creation');
            return NextResponse.json(
              {
                success: false,
                error: 'Import batch creation failed',
                details: 'Batch was created but immediately lost - check Redis queue worker'
              },
              { status: 500 }
            );
          }
          
          return NextResponse.json({
            success: true,
            batchId,
            message: 'Import initiated successfully (async processing)',
            processingMode: 'async',
            previewData: structureValidation.sampleRows?.slice(0, 10),
            estimatedProcessingTime: Math.ceil((file.size / (1024 * 1024)) * 30), // Rough estimate: 30 seconds per MB
          });
        } catch (error) {
          logger.upload.error('Import initiation failed', error);

          // If the error is because the file was already imported, return 409 Conflict
          const errMsg = error instanceof Error ? error.message : String(error);
          if (errMsg.includes('already been imported')) {
            // Try to extract a Batch ID from the error message if present
            const m = errMsg.match(/Batch ID:\s*([0-9a-fA-F-]+)/);
            const batchId = m ? m[1] : undefined;

            return NextResponse.json(
              {
                success: false,
                error: 'Duplicate import',
                message: 'This file appears to have been imported already.',
                batchId,
              },
              { status: 409 }
            );
          }

          return NextResponse.json(
            {
              success: false,
              error: 'Failed to initiate import',
              details: errMsg || 'Unknown error during import initiation'
            },
            { status: 500 }
          );
        }
        
        logger.upload.info('Import initiated, returning batchId', { batchId: importResult.batchId });
        
        // Wait a moment to ensure the batch is persisted before returning
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Verify batch exists before returning success
        const batchExists = await prisma.dailyImportBatch.findUnique({
          where: { id: importResult.batchId }
        });
        
        if (!batchExists) {
          logger.upload.error('Batch was created but not found in database after creation');
          return NextResponse.json(
            {
              success: false,
              error: 'Import batch creation failed',
              details: 'Batch was created but immediately lost - check Redis queue worker'
            },
            { status: 500 }
          );
        }
        
        return NextResponse.json({
          success: true,
          batchId: importResult.batchId,
          message: 'Import initiated successfully (async processing)',
          processingMode: 'async',
          previewData: structureValidation.sampleRows?.slice(0, 10),
          estimatedProcessingTime: Math.ceil((file.size / (1024 * 1024)) * 30), // Rough estimate: 30 seconds per MB
        });
        
      } catch (error) {
        logger.upload.error('Import initiation failed', error);

        // If the error is because the file was already imported, return 409 Conflict
        const errMsg = error instanceof Error ? error.message : String(error);
        if (errMsg.includes('already been imported')) {
          // Try to extract a Batch ID from the error message if present
          const m = errMsg.match(/Batch ID:\s*([0-9a-fA-F-]+)/);
          const batchId = m ? m[1] : undefined;

          return NextResponse.json(
            {
              success: false,
              error: 'Duplicate import',
              message: 'This file appears to have been imported already.',
              batchId,
            },
            { status: 409 }
          );
        }

        return NextResponse.json(
          {
            success: false,
            error: 'Failed to initiate import',
            details: errMsg || 'Unknown error during import initiation'
          },
          { status: 500 }
        );
      }
    } else {
      // Fallback to synchronous processing
      try {
        // Create import batch record synchronously
        const userId = await batchService.getOrCreateSystemUser();
        const { prisma } = await import('@/lib/database');
        const checksum = await createHash('sha256')
          .update(await import('fs').then(fs => fs.readFileSync(saveResult.filePath!)))
          .digest('hex');

        // Check for duplicate imports, but exclude failed or empty imports
        const existingImport = await prisma.dailyImportBatch.findFirst({
          where: {
            fileChecksum: checksum,
            status: { in: ['COMPLETED', 'PROCESSING'] },
            // Only consider as duplicate if it had some successful records
            successfulRecords: { gt: 0 }
          }
        });

        if (existingImport) {
          throw new Error(`File has already been imported previously. Batch ID: ${existingImport.id}`);
        }

        // Create import batch
        const importBatch = await prisma.dailyImportBatch.create({
          data: {
            importDate: new Date(),
            filename: file.name,
            fileSize: file.size,
            fileChecksum: checksum,
            totalRecords: 0,
            successfulRecords: 0,
            failedRecords: 0,
            errorLogs: [],
            status: 'PROCESSING',
            createdBy: userId,
          },
        });

        // Process synchronously with explicit dryRun: false
        const syncJobData: ImportJobData = {
          filePath: saveResult.filePath!,
          filename: file.name,
          fileSize: file.size,
          checksum,
          userId,
          batchId: importBatch.id,
        };

        await processCsvImport(syncJobData, { dryRun: false });

        // Add comprehensive verification for sync uploads
        const { verifyUploadSuccess } = await import('@/lib/import/upload-verification');
        const verification = await verifyUploadSuccess(importBatch.id, undefined, 3000);
        
        if (!verification.success) {
          logger.upload.error('Upload verification failed after sync processing', verification);
          
          return NextResponse.json({
            success: false,
            error: 'Upload verification failed - data may not have persisted correctly',
            details: {
              errors: verification.errors,
              warnings: verification.warnings,
              recordsImported: verification.recordsImported
            },
            batchId: importBatch.id,
            processingMode: 'sync',
          }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          batchId: importBatch.id,
          message: 'Import completed successfully (sync processing)',
          processingMode: 'sync',
          verification: {
            recordsImported: verification.recordsImported,
            warnings: verification.warnings
          },
          previewData: structureValidation.sampleRows?.slice(0, 10),
        });

      } catch (syncError) {
        logger.upload.error('Synchronous import failed', syncError);

        const errMsg = syncError instanceof Error ? syncError.message : String(syncError);
        if (errMsg.includes('already been imported')) {
          const m = errMsg.match(/Batch ID:\s*([0-9a-fA-F-]+)/);
          const batchId = m ? m[1] : undefined;

          return NextResponse.json(
            {
              success: false,
              error: 'Duplicate import',
              message: 'This file appears to have been imported already.',
              batchId,
            },
            { status: 409 }
          );
        }

        return NextResponse.json(
          {
            success: false,
            error: 'Import failed',
            details: errMsg || 'Unknown error during synchronous processing'
          },
          { status: 500 }
        );
      }
    }

  } catch (error) {
    logger.upload.error('Upload API error', error);
    const errMsg = error instanceof Error ? error.message : String(error);
    if (errMsg.includes('already been imported')) {
      const m = errMsg.match(/Batch ID:\s*([0-9a-fA-F-]+)/);
      const batchId = m ? m[1] : undefined;

      return NextResponse.json(
        {
          success: false,
          error: 'Duplicate import',
          message: 'This file appears to have been imported already.',
          batchId,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: errMsg || 'Unknown error'
      },
      { status: 500 }
    );
  }
}