import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { createHash } from 'crypto';
import { validateUploadedFile, saveUploadedFile, validateCsvStructure } from '@/lib/import/file-handler';
import { initiateDailyImport } from '@/lib/import/csv-processor';
import { IMPORT_CONFIG } from '@/lib/import';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const config = formData.get('config') ? JSON.parse(formData.get('config') as string) : {};

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

    // Get user ID from request (you may need to implement authentication)
    const userId = 'system'; // Placeholder - implement proper user authentication

    // Initiate import
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
      message: 'Import initiated successfully',
      previewData: structureValidation.sampleRows?.slice(0, 10),
      estimatedProcessingTime: Math.ceil((file.size / (1024 * 1024)) * 30), // Rough estimate: 30 seconds per MB
    });

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