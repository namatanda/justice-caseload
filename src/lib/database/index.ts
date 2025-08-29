// Database connection and utilities
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
  type PrismaTransaction,
  type DatabaseStats
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
  console.log('Starting graceful shutdown...');
  
  await Promise.all([
    disconnectDatabase(),
    disconnectRedis(),
  ]);
  
  console.log('Graceful shutdown completed');
}