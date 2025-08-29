// CSV Import Processing
export {
  initiateDailyImport,
  processCsvImport,
  getImportStatus,
  getImportHistory,
  type ImportResult,
  type ImportError
} from './csv-processor';

// Queue Workers
export {
  csvImportWorker,
  analyticsWorker,
  shutdownWorkers,
  checkWorkerHealth
} from './queue-worker';

// File upload utilities
export { validateUploadedFile, saveUploadedFile } from './file-handler';

// Import status constants
export const IMPORT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

// Import configuration
export const IMPORT_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ['csv'],
  BATCH_SIZE: 100,
  MAX_ERRORS_PER_BATCH: 50,
} as const;