import path from 'path';
import { initiateDailyImport, processCsvImport } from '../src/lib/import/csv-processor';
import fs from 'fs';

async function main() {
  const csvPath = process.argv[2] || path.resolve(process.cwd(), 'data', 'case_returns.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found at', csvPath);
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL must be set to run full import script. Aborting.');
    process.exit(1);
  }

  console.log('Starting full import using DATABASE_URL:', process.env.DATABASE_URL);

  // Create a batch record in DB using initiateDailyImport
  const fileSize = fs.statSync(csvPath).size;
  const filename = path.basename(csvPath);
  const userId = process.env.TEST_IMPORT_USER || 'script-user';

  const { batchId } = await initiateDailyImport(csvPath, filename, fileSize, userId);
  console.log('Created import batch:', batchId);

  // Run processor (this will write to DB and use the real cache/redis if configured)
  await processCsvImport({
    filePath: csvPath,
    filename,
    fileSize,
    checksum: 'full-demo-checksum',
    userId,
    batchId,
  }, { dryRun: false });

  console.log('Full import completed.');
}

main().catch(err => {
  console.error('Full import run failed:', err);
  process.exit(1);
});
