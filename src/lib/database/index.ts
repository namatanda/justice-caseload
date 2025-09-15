// Database connection and utilities
import { logger } from '@/lib/logger';
import { 
  checkDatabaseConnection,
  disconnectDatabase
} from './prisma';
import {
  checkRedisConnection,
  disconnectRedis
} from './redis';

export {
  prisma as default,
  prisma,
  checkDatabaseConnection,
  disconnectDatabase,
  getDatabaseStats,
  withTransaction,
  cleanupOldData,
  getSlowQueries,
  runMaintenance,
  getPoolHealthStatus,
  type PrismaTransaction,
  type DatabaseStats,
  type ConnectionStatistics,
  type PoolHealthStatus
} from './prisma';

// Redis and queue utilities
export {
  redis,
  redisPublisher,
  redisSubscriber,
  importQueue,
  analyticsQueue,
  cacheManager,
  sessionManager,
  rateLimiter,
  checkRedisConnection,
  disconnectRedis,
  getQueueStats,
  cleanupQueues,
  CacheManager,
  SessionManager,
  RateLimiter,
  type ImportJobData,
  type AnalyticsJobData
} from './redis';

// Performance monitoring and optimization
export {
  getSlowQueries as getSlowQueriesDetailed,
  getIndexUsage,
  getUnusedIndexes,
  getTableStatistics,
  getDatabasePerformanceReport,
  runDatabaseMaintenance,
  vacuumTables,
  resetQueryStatistics,
  getConnectionStatistics,
  explainQuery,
  type QueryPerformance,
  type IndexUsage,
  type TableStatistics,
  type DatabasePerformanceReport
} from './performance';

// Combined health check
export async function checkSystemHealth(): Promise<{
  database: boolean;
  redis: boolean;
  overall: boolean;
}> {
  const [database, redis] = await Promise.all([
    checkDatabaseConnection(),
    checkRedisConnection(),
  ]);

  return {
    database,
    redis,
    overall: database && redis,
  };
}

// Graceful shutdown for all connections
export async function gracefulShutdown(): Promise<void> {
  logger.system.info('Starting graceful database shutdown');
  
  await Promise.all([
    disconnectDatabase(),
    disconnectRedis(),
  ]);
  
  logger.system.info('Graceful shutdown completed');
}