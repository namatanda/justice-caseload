const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestBatchWithErrors() {
  try {
    const user = await prisma.user.findFirst({ where: { email: 'test@example.com' } });
    if (!user) {
      console.log('❌ No test user found. Create user first.');
      return;
    }

    // Create batch with failed records
    const batch = await prisma.dailyImportBatch.create({
      data: {
        id: '9405b039-7400-48a1-9dcd-618d1aaf3f97',
        importDate: new Date('2025-01-15'),
        filename: 'test-failed-import.csv',
        fileSize: 10240,
        fileChecksum: 'abc123def456',
        totalRecords: 168,
        successfulRecords: 23,
        failedRecords: 145,
        errorLogs: JSON.stringify({ summary: 'Validation errors in CSV data' }),
        status: 'COMPLETED',
        createdAt: new Date('2025-01-15T10:00:00Z'),
        completedAt: new Date('2025-01-15T10:05:00Z'),
        createdBy: user.id,
        userConfig: JSON.stringify({ validate: true, process: true }),
        validationWarnings: JSON.stringify(['Some warnings during import'])
      }
    });

    console.log('✅ Batch created:', { id: batch.id, failedRecords: batch.failedRecords });

    // Create sample error details
    const errorTypes = ['VALIDATION_ERROR', 'FORMAT_ERROR', 'DUPLICATE_ERROR', 'MISSING_DATA'];
    const severities = ['ERROR', 'WARNING', 'ERROR', 'WARNING'];
    
    for (let i = 1; i <= 10; i++) { // Create 10 sample errors
      await prisma.importErrorDetail.create({
        data: {
          id: `error-${i}-${Date.now()}`,
          batchId: batch.id,
          rowNumber: 5 + i,
          errorType: errorTypes[i % 4],
          errorMessage: `Validation failed for row ${5 + i}: ${errorTypes[i % 4]} - Invalid case ID format`,
          severity: severities[i % 4],
          createdAt: new Date()
        }
      });
    }

    const errorCount = await prisma.importErrorDetail.count({ where: { batchId: batch.id } });
    console.log(`✅ Created ${errorCount} error details for batch ${batch.id}`);

    console.log('\n🎉 Test batch with errors created successfully!');
    console.log(`Batch ID: ${batch.id}`);
    console.log(`Use this batch for API/UI testing: /api/import/${batch.id}/errors`);

  } catch (error) {
    console.error('❌ Error creating test batch:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestBatchWithErrors();