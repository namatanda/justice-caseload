import { PrismaClient } from '@prisma/client';
import logger from '@/lib/logger';
import { dbQueryDuration, dbQueriesTotal } from '@/lib/metrics';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaLog: Array<'query' | 'info' | 'warn' | 'error'> =
  process.env.PRISMA_DEBUG === '1'
    ? ['query', 'info', 'warn', 'error']
    : process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'];

// Connection pool configuration
const connectionLimit = parseInt(process.env.DB_CONNECTION_LIMIT || '20');
const poolTimeout = parseInt(process.env.DB_POOL_TIMEOUT || '10000');
const idleTimeout = parseInt(process.env.DB_IDLE_TIMEOUT || '30000');

// Build database URL with connection pooling parameters
const buildDatabaseUrl = (baseUrl: string) => {
  const url = new URL(baseUrl);
  url.searchParams.set('connection_limit', connectionLimit.toString());
  url.searchParams.set('pool_timeout', poolTimeout.toString());
  url.searchParams.set('idle_timeout', idleTimeout.toString());
  return url.toString();
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: prismaLog,
  datasources: {
    db: {
      url: buildDatabaseUrl(process.env.DATABASE_URL!),
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.database.error('Database connection failed', error);
    return false;
  }
}

// Graceful shutdown
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}

// Database statistics
export async function getDatabaseStats(): Promise<{
  totalCases: number;
  totalActivities: number;
  totalJudges: number;
  totalCourts: number;
  lastImportDate: Date | null;
}> {
  try {
    const [
      totalCases,
      totalActivities,
      totalJudges,
      totalCourts,
      lastImport
    ] = await Promise.all([
      prisma.case.count(),
      prisma.caseActivity.count(),
      prisma.judge.count({ where: { isActive: true } }),
      prisma.court.count({ where: { isActive: true } }),
      prisma.dailyImportBatch.findFirst({
        orderBy: { importDate: 'desc' },
        select: { importDate: true }
      })
    ]);

    return {
      totalCases,
      totalActivities,
      totalJudges,
      totalCourts,
      lastImportDate: lastImport?.importDate || null
    };
  } catch (error) {
    logger.database.error('Failed to get database stats', error);
    throw new Error('Failed to retrieve database statistics');
  }
}

// Transaction helper
export async function withTransaction<T>(
  fn: (tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(fn, {
    maxWait: 5000, // 5 seconds
    timeout: 10000, // 10 seconds
  });
}

// Database cleanup utilities
export async function cleanupOldData(daysToKeep: number = 365): Promise<{
  deletedActivities: number;
  deletedImportBatches: number;
}> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const [deletedActivities, deletedImportBatches] = await prisma.$transaction([
    prisma.caseActivity.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        }
      }
    }),
    prisma.dailyImportBatch.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate
        },
        status: 'COMPLETED'
      }
    })
  ]);

  return {
    deletedActivities: deletedActivities.count,
    deletedImportBatches: deletedImportBatches.count
  };
}

// Performance monitoring
export async function getSlowQueries(): Promise<any[]> {
  try {
    // This would require pg_stat_statements extension
    const slowQueries = await prisma.$queryRaw`
      SELECT 
        query,
        calls,
        total_time,
        mean_time,
        rows
      FROM pg_stat_statements 
      WHERE mean_time > 1000 -- queries taking more than 1 second on average
      ORDER BY mean_time DESC 
      LIMIT 10;
    `;
    return slowQueries as any[];
  } catch (error) {
    // pg_stat_statements might not be enabled
    logger.database.warn('Could not retrieve slow queries. Ensure pg_stat_statements extension is enabled');
    return [];
  }
}

// Database maintenance
export async function runMaintenance(): Promise<{
  success: boolean;
  operations: string[];
  errors: string[];
}> {
  const operations: string[] = [];
  const errors: string[] = [];

  try {
    // Update case age for all active cases
    await prisma.$executeRaw`
      UPDATE cases 
      SET case_age_days = EXTRACT(DAY FROM NOW() - filed_date)
      WHERE status = 'ACTIVE';
    `;
    operations.push('Updated case age calculations');

    // Update total activities count
    await prisma.$executeRaw`
      UPDATE cases 
      SET total_activities = (
        SELECT COUNT(*) 
        FROM case_activities 
        WHERE case_activities.case_id = cases.id
      );
    `;
    operations.push('Updated total activities count');

    // Update last activity date
    await prisma.$executeRaw`
      UPDATE cases 
      SET last_activity_date = (
        SELECT MAX(activity_date) 
        FROM case_activities 
        WHERE case_activities.case_id = cases.id
      );
    `;
    operations.push('Updated last activity dates');

    return {
      success: true,
      operations,
      errors
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    errors.push(errorMessage);
    
    return {
      success: false,
      operations,
      errors
    };
  }
}

// Database metrics utilities
export async function withDatabaseMetrics<T>(
  operation: () => Promise<T>,
  operationName: string,
  tableName: string = 'unknown'
): Promise<T> {
  const startTime = Date.now();

  try {
    const result = await operation();
    const duration = (Date.now() - startTime) / 1000;

    dbQueryDuration
      .labels(operationName, tableName)
      .observe(duration);

    dbQueriesTotal
      .labels(operationName, tableName, 'success')
      .inc();

    return result;
  } catch (error) {
    const duration = (Date.now() - startTime) / 1000;

    dbQueryDuration
      .labels(operationName, tableName)
      .observe(duration);

    dbQueriesTotal
      .labels(operationName, tableName, 'error')
      .inc();

    throw error;
  }
}

// Connection pool statistics and monitoring
export async function getConnectionStatistics(): Promise<{
  activeConnections: number;
  idleConnections: number;
  totalConnections: number;
  waitingClients: number;
  maxConnections: number;
  poolUtilization: number;
}> {
  try {
    // Get connection pool statistics from PostgreSQL
    const poolStats = await prisma.$queryRaw`
      SELECT
        count(*) filter (where state = 'active') as active_connections,
        count(*) filter (where state = 'idle') as idle_connections,
        count(*) as total_connections,
        (SELECT count(*) FROM pg_stat_activity WHERE state = 'active' AND datname = current_database()) as waiting_clients
      FROM pg_stat_activity
      WHERE datname = current_database() AND pid <> pg_backend_pid()
    ` as any[];

    const stats = poolStats[0] || {};
    const maxConnections = connectionLimit;
    const activeConnections = parseInt(stats.active_connections || '0');
    const idleConnections = parseInt(stats.idle_connections || '0');
    const totalConnections = parseInt(stats.total_connections || '0');
    const waitingClients = parseInt(stats.waiting_clients || '0');

    return {
      activeConnections,
      idleConnections,
      totalConnections,
      waitingClients,
      maxConnections,
      poolUtilization: maxConnections > 0 ? (activeConnections / maxConnections) * 100 : 0
    };
  } catch (error) {
    logger.database.error('Failed to get connection statistics', error);
    return {
      activeConnections: 0,
      idleConnections: 0,
      totalConnections: 0,
      waitingClients: 0,
      maxConnections: connectionLimit,
      poolUtilization: 0
    };
  }
}

// Connection pool health monitoring
export async function getPoolHealthStatus(): Promise<{
  healthy: boolean;
  issues: string[];
  recommendations: string[];
}> {
  try {
    const stats = await getConnectionStatistics();
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for high utilization
    if (stats.poolUtilization > 90) {
      issues.push(`Connection pool utilization is critically high: ${stats.poolUtilization.toFixed(1)}%`);
      recommendations.push('Consider increasing DB_CONNECTION_LIMIT or optimizing query performance');
    } else if (stats.poolUtilization > 75) {
      issues.push(`Connection pool utilization is high: ${stats.poolUtilization.toFixed(1)}%`);
      recommendations.push('Monitor connection usage and consider scaling database resources');
    }

    // Check for waiting clients
    if (stats.waitingClients > 5) {
      issues.push(`${stats.waitingClients} clients waiting for database connections`);
      recommendations.push('Reduce concurrent database operations or increase connection pool size');
    }

    // Check for too many idle connections
    if (stats.idleConnections > stats.maxConnections * 0.7) {
      recommendations.push('Consider reducing DB_CONNECTION_LIMIT to optimize resource usage');
    }

    return {
      healthy: issues.length === 0,
      issues,
      recommendations
    };
  } catch (error) {
    logger.database.error('Failed to get pool health status', error);
    return {
      healthy: false,
      issues: ['Unable to monitor connection pool health'],
      recommendations: ['Check database connectivity and monitoring setup']
    };
  }
}

// Export types for use in other modules
export type PrismaTransaction = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];
export type DatabaseStats = Awaited<ReturnType<typeof getDatabaseStats>>;
export type ConnectionStatistics = Awaited<ReturnType<typeof getConnectionStatistics>>;
export type PoolHealthStatus = Awaited<ReturnType<typeof getPoolHealthStatus>>;

export default prisma;