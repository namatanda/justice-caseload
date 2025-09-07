import path from 'path';

const modPath = path.resolve(process.cwd(), 'src', 'lib', 'import', 'csv-processor');

async function main() {
  // Dynamically import the processor so this script works in ESM/CJS environments
  let processor: any;
  try {
    // On Windows, dynamic import needs a file:// URL for absolute paths
  const modUrl = process.platform === 'win32' ? `file://${modPath.replace(/\\/g, '/')}` : modPath;
  processor = await import(modUrl as any);
  } catch (e) {
    console.error('Failed to import processor module at', modPath, e);
    process.exit(1);
  }

  const { processCsvImport } = processor;

  const csvPath = process.argv[2] || path.resolve(process.cwd(), 'data', 'case_returns.csv');
  const filename = path.basename(csvPath);
  const fileSize = 0;
  const userId = 'demo-user';

  console.log('Running import demo (dry-run) for file:', csvPath);

  // We're not creating a batch in DB here — instead we fabricate a batchId for diagnostics.
  const fakeBatchId = 'demo-batch-' + Date.now();

  await processCsvImport({
    filePath: csvPath,
    filename,
    fileSize,
    checksum: 'demo-checksum',
    userId,
    batchId: fakeBatchId,
  }, { dryRun: true });

  console.log('Demo run complete.');
}

main().catch(err => {
  console.error('Demo run failed:', err);
  process.exit(1);
});
