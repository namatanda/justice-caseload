import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { createHash } from 'crypto';
import { validateUploadedFile, saveUploadedFile, validateCsvStructure } from '@/lib/import/file-handler';
import { initiateDailyImport, processCsvImport } from '@/lib/import/csv-processor';
import { IMPORT_CONFIG } from '@/lib/import';
import { checkRedisConnection } from '@/lib/database/redis';
import type { ImportJobData } from '@/lib/database/redis';

export async function POST(request: NextRequest) {
  try {
    console.log('📡 UPLOAD API: Received upload request');

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const config = formData.get('config') ? JSON.parse(formData.get('config') as string) : {};

    console.log('📡 UPLOAD API: File received:', file?.name, 'Size:', file?.size);

    if (!file) {
      console.error('❌ UPLOAD API: No file provided');
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

    // Get user ID from request (you may need to implement authentication)
    const userId = 'system'; // Placeholder - implement proper user authentication

    // Check Redis connection for queue-based processing
    const isRedisAvailable = await checkRedisConnection();
    console.log('🔍 UPLOAD API: Redis available for queue processing:', isRedisAvailable);

    if (isRedisAvailable) {
      // Use queue-based processing (asynchronous)
      console.log('🚀 UPLOAD API: Using queue-based import processing');

      const importResult = await initiateDailyImport(
        saveResult.filePath!,
        file.name,
        file.size,
        userId
      );

      console.log('🚀 UPLOAD API: Import initiation result:', importResult);

      if (!importResult.success) {
        console.error('❌ UPLOAD API: Failed to initiate import:', importResult);
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to initiate import',
            details: 'Import initiation failed'
          },
          { status: 500 }
        );
      }

      console.log('✅ UPLOAD API: Import initiated successfully, batch ID:', importResult.batchId);
      return NextResponse.json({
        success: true,
        batchId: importResult.batchId,
        message: 'Import initiated successfully (async processing)',
        processingMode: 'async',
        previewData: structureValidation.sampleRows?.slice(0, 10),
        estimatedProcessingTime: Math.ceil((file.size / (1024 * 1024)) * 30), // Rough estimate: 30 seconds per MB
      });
    } else {
      // Fallback to synchronous processing
      console.log('⚡ UPLOAD API: Redis not available, using synchronous import processing');

      try {
        // Create import batch record synchronously
        const { prisma } = await import('@/lib/database');
        const checksum = await createHash('sha256')
          .update(await import('fs').then(fs => fs.readFileSync(saveResult.filePath!)))
          .digest('hex');

        // Check for duplicate imports
        const existingImport = await prisma.dailyImportBatch.findFirst({
          where: {
            fileChecksum: checksum,
            status: { in: ['COMPLETED', 'PROCESSING'] }
          }
        });

        if (existingImport) {
          throw new Error(`File has already been imported. Batch ID: ${existingImport.id}`);
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

        // Process synchronously
        console.log('⚙️ UPLOAD API: Starting synchronous processing...');
        const syncJobData: ImportJobData = {
          filePath: saveResult.filePath!,
          filename: file.name,
          fileSize: file.size,
          checksum,
          userId,
          batchId: importBatch.id,
        };

        console.log('⚙️ UPLOAD API: Processing CSV import synchronously...');
        await processCsvImport(syncJobData);
        console.log('✅ UPLOAD API: Synchronous processing completed');

        return NextResponse.json({
          success: true,
          batchId: importBatch.id,
          message: 'Import completed successfully (sync processing)',
          processingMode: 'sync',
          previewData: structureValidation.sampleRows?.slice(0, 10),
        });

      } catch (syncError) {
        console.error('❌ Synchronous import failed:', syncError);
        return NextResponse.json(
          {
            success: false,
            error: 'Import failed',
            details: syncError instanceof Error ? syncError.message : 'Unknown error during synchronous processing'
          },
          { status: 500 }
        );
      }
    }

  } catch (error) {
    console.error('Upload error:', error);
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