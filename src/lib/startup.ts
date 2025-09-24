import { initializeQueueWorkers } from '@/lib/db/redis';
import { logger } from '@/lib/logger';

let workersInitialized = false;

export async function startupTasks() {
  if (workersInitialized) {
    logger.system.info('Workers already initialized, skipping initialization');
    return;
  }

  try {
    logger.system.info('Starting application initialization');
    
    // Initialize queue workers
    await initializeQueueWorkers();
    workersInitialized = true;
    
    logger.system.info('Application startup completed successfully');
  } catch (error) {
    logger.system.error('Application startup failed', { error });
    // Don't throw error to prevent app from crashing
    // Workers can be initialized manually via API endpoint
  }
}

// Auto-initialize on import (Next.js will call this during startup)
if (typeof window === 'undefined') { // Server-side only
  startupTasks();
}