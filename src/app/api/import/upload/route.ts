import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { createHash } from 'crypto';
import { validateUploadedFile, saveUploadedFile, validateCsvStructure } from '@/lib/import/file-handler';
import { initiateDailyImport, processCsvImport } from '@/lib/import/csv-processor';
import { IMPORT_CONFIG } from '@/lib/import';
import { checkRedisConnection } from '@/lib/database/redis';
import type { ImportJobData } from '@/lib/database/redis';
import { prisma } from '@/lib/database';

async function getOrCreateSystemUser(): Promise<string> {
  try {
    console.log('Getting or creating system user...');
    
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

    console.log('Existing system user found:', systemUser ? { id: systemUser.id, email: systemUser.email } : 'None');

    // If no admin user exists, create a system user
    if (!systemUser) {
      console.log('Creating new system user...');
      systemUser = await prisma.user.create({
        data: {
          email: 'system@justice.go.ke',
          name: 'System Import User',
          role: 'ADMIN',
          isActive: true,
        }
      });
      console.log('System user created:', { id: systemUser.id, email: systemUser.email });
    }

    return systemUser.id;
  } catch (error) {
    console.error('Failed to get/create system user:', error);
    throw new Error('Failed to initialize system user for import');
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const config = formData.get('config') ? JSON.parse(formData.get('config') as string) : {};
    const processingMode = formData.get('processingMode') as string || 'auto';

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
    const userId = await getOrCreateSystemUser();

    // Check Redis connection for queue-based processing
    const isRedisAvailable = processingMode === 'sync' ? false : await checkRedisConnection();
    console.log(`Redis availability: ${isRedisAvailable}, processing mode: ${processingMode}`);

    if (isRedisAvailable) {
      // Use queue-based processing (asynchronous)
      try {
        const importResult = await initiateDailyImport(
          saveResult.filePath!,
          file.name,
          file.size,
          userId
        );

        if (!importResult.success) {
          return NextResponse.json(
            {
              success: false,
              error: 'Failed to initiate import',
              details: 'Import initiation failed'
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
        console.error('Import initiation failed:', error);
        
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to initiate import',
            details: error instanceof Error ? error.message : 'Unknown error during import initiation'
          },
          { status: 500 }
        );
      }
    } else {
      // Fallback to synchronous processing
      try {
        // Create import batch record synchronously
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
          throw new Error(`File has already been imported successfully. Batch ID: ${existingImport.id}`);
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
        const syncJobData: ImportJobData = {
          filePath: saveResult.filePath!,
          filename: file.name,
          fileSize: file.size,
          checksum,
          userId,
          batchId: importBatch.id,
        };

        await processCsvImport(syncJobData);

        return NextResponse.json({
          success: true,
          batchId: importBatch.id,
          message: 'Import completed successfully (sync processing)',
          processingMode: 'sync',
          previewData: structureValidation.sampleRows?.slice(0, 10),
        });

      } catch (syncError) {
        console.error('Synchronous import failed:', syncError);
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
    console.error('Upload API error:', error);
    
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