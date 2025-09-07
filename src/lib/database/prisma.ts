import { PrismaClient } from '@prisma/client';
import logger from '@/lib/logger';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaLog: Array<'query' | 'info' | 'warn' | 'error'> =
  process.env.PRISMA_DEBUG === '1'
    ? ['query', 'info', 'warn', 'error']
    : process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'];

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: prismaLog,
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
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

// Export types for use in other modules
export type PrismaTransaction = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];
export type DatabaseStats = Awaited<ReturnType<typeof getDatabaseStats>>;

export default prisma;