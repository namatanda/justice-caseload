import { prisma } from './prisma';
import logger from '@/lib/logger';

// Performance monitoring interfaces
export interface QueryPerformance {
  query: string;
  calls: number;
  totalTime: number;
  meanTime: number;
  rows: number;
}

export interface IndexUsage {
  schemaname: string;
  tablename: string;
  indexname: string;
  numScans: number;
  tuplesRead: number;
  tuplesUsed: number;
  efficiency: number;
}

export interface TableStatistics {
  tableName: string;
  rowCount: number;
  tableSize: string;
  indexSize: string;
  totalSize: string;
  lastVacuum: Date | null;
  lastAnalyze: Date | null;
}

export interface DatabasePerformanceReport {
  queryPerformance: QueryPerformance[];
  indexUsage: IndexUsage[];
  tableStatistics: TableStatistics[];
  slowQueries: QueryPerformance[];
  unusedIndexes: IndexUsage[];
  recommendations: string[];
}

// Get slow queries from pg_stat_statements
export async function getSlowQueries(limit: number = 10): Promise<QueryPerformance[]> {
  try {
    const slowQueries = await prisma.$queryRaw<QueryPerformance[]>`
      SELECT 
        query,
        calls,
        total_time,
        mean_time,
        rows
      FROM pg_stat_statements 
      WHERE mean_time > 100 -- queries taking more than 100ms on average
        AND calls > 5 -- called more than 5 times
      ORDER BY mean_time DESC 
      LIMIT ${limit};
    `;
    
    return slowQueries.map(query => ({
      ...query,
      totalTime: Number(query.totalTime),
      meanTime: Number(query.meanTime),
      calls: Number(query.calls),
      rows: Number(query.rows),
    }));
  } catch (error) {
    logger.database.warn('Could not retrieve slow queries. Ensure pg_stat_statements extension is enabled');
    return [];
  }
}

// Get index usage statistics
export async function getIndexUsage(): Promise<IndexUsage[]> {
  try {
    const indexStats = await prisma.$queryRaw<IndexUsage[]>`
      SELECT 
        schemaname,
        tablename,
        indexname,
        idx_scan as "numScans",
        idx_tup_read as "tuplesRead",
        idx_tup_fetch as "tuplesUsed",
        CASE 
          WHEN idx_tup_read > 0 
          THEN round((idx_tup_fetch * 100.0 / idx_tup_read), 2)
          ELSE 0 
        END as efficiency
      FROM pg_stat_user_indexes 
      WHERE schemaname = 'public'
      ORDER BY idx_scan DESC;
    `;
    
    return indexStats.map(index => ({
      ...index,
      numScans: Number(index.numScans),
      tuplesRead: Number(index.tuplesRead),
      tuplesUsed: Number(index.tuplesUsed),
      efficiency: Number(index.efficiency),
    }));
  } catch (error) {
    logger.database.error('Error retrieving index usage', error);
    return [];
  }
}

// Get unused indexes (indexes with very low usage)
export async function getUnusedIndexes(): Promise<IndexUsage[]> {
  const indexUsage = await getIndexUsage();
  
  return indexUsage.filter(index => 
    index.numScans < 10 && 
    !index.indexname.endsWith('_pkey') && 
    !index.indexname.includes('unique')
  );
}

// Get table statistics
export async function getTableStatistics(): Promise<TableStatistics[]> {
  try {
    const tableStats = await prisma.$queryRaw<any[]>`
      SELECT 
        t.tablename as "tableName",
        pg_relation_size(c.oid) as "tableSize",
        pg_indexes_size(c.oid) as "indexSize",
        pg_total_relation_size(c.oid) as "totalSize",
        n_tup_ins + n_tup_upd + n_tup_del as "rowCount",
        last_vacuum as "lastVacuum",
        last_analyze as "lastAnalyze"
      FROM pg_tables t
      JOIN pg_class c ON c.relname = t.tablename
      JOIN pg_stat_user_tables s ON s.relname = t.tablename
      WHERE t.schemaname = 'public'
      ORDER BY pg_total_relation_size(c.oid) DESC;
    `;
    
    return tableStats.map(table => ({
      tableName: table.tableName,
      rowCount: Number(table.rowCount),
      tableSize: formatBytes(Number(table.tableSize)),
      indexSize: formatBytes(Number(table.indexSize)),
      totalSize: formatBytes(Number(table.totalSize)),
      lastVacuum: table.lastVacuum,
      lastAnalyze: table.lastAnalyze,
    }));
  } catch (error) {
    logger.database.error('Error retrieving table statistics', error);
    return [];
  }
}

// Format bytes to human readable format
function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// Get comprehensive performance report
export async function getDatabasePerformanceReport(): Promise<DatabasePerformanceReport> {
  const [
    queryPerformance,
    indexUsage,
    tableStatistics,
    slowQueries,
    unusedIndexes
  ] = await Promise.all([
    getSlowQueries(20),
    getIndexUsage(),
    getTableStatistics(),
    getSlowQueries(5),
    getUnusedIndexes(),
  ]);
  
  const recommendations = generateRecommendations({
    queryPerformance,
    indexUsage,
    tableStatistics,
    slowQueries,
    unusedIndexes,
  });
  
  return {
    queryPerformance,
    indexUsage,
    tableStatistics,
    slowQueries,
    unusedIndexes,
    recommendations,
  };
}

// Generate performance recommendations
function generateRecommendations(data: {
  queryPerformance: QueryPerformance[];
  indexUsage: IndexUsage[];
  tableStatistics: TableStatistics[];
  slowQueries: QueryPerformance[];
  unusedIndexes: IndexUsage[];
}): string[] {
  const recommendations: string[] = [];
  
  // Check for slow queries
  if (data.slowQueries.length > 0) {
    recommendations.push(
      `Found ${data.slowQueries.length} slow queries. Consider optimizing queries with mean time > 100ms.`
    );
  }
  
  // Check for unused indexes
  if (data.unusedIndexes.length > 0) {
    recommendations.push(
      `Found ${data.unusedIndexes.length} potentially unused indexes. Consider dropping: ${data.unusedIndexes.slice(0, 3).map(i => i.indexname).join(', ')}`
    );
  }
  
  // Check for tables that need vacuum/analyze
  const needsAnalyze = data.tableStatistics.filter(table => 
    !table.lastAnalyze || 
    (new Date().getTime() - table.lastAnalyze.getTime()) > 7 * 24 * 60 * 60 * 1000 // 7 days
  );
  
  if (needsAnalyze.length > 0) {
    recommendations.push(
      `Tables need ANALYZE: ${needsAnalyze.slice(0, 3).map(t => t.tableName).join(', ')}`
    );
  }
  
  // Check for low efficiency indexes
  const lowEfficiencyIndexes = data.indexUsage.filter(index => 
    index.efficiency < 50 && index.numScans > 100
  );
  
  if (lowEfficiencyIndexes.length > 0) {
    recommendations.push(
      `Low efficiency indexes detected: ${lowEfficiencyIndexes.slice(0, 3).map(i => i.indexname).join(', ')}`
    );
  }
  
  // Check for large tables
  const largeTables = data.tableStatistics.filter(table => 
    table.totalSize.includes('GB') || 
    (table.totalSize.includes('MB') && parseInt(table.totalSize) > 500)
  );
  
  if (largeTables.length > 0) {
    recommendations.push(
      `Large tables detected: ${largeTables.slice(0, 3).map(t => t.tableName).join(', ')}. Consider partitioning or archiving.`
    );
  }
  
  return recommendations;
}

// Database maintenance operations
export async function runDatabaseMaintenance(): Promise<{
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
      WHERE status IN ('ACTIVE', 'PENDING');
    `;
    operations.push('Updated case age calculations');
    
    // Update total activities count
    await prisma.$executeRaw`
      UPDATE cases 
      SET total_activities = (
        SELECT COUNT(*) 
        FROM case_activities 
        WHERE case_activities.case_id = cases.id
      )
      WHERE total_activities = 0 OR total_activities IS NULL;
    `;
    operations.push('Updated total activities count');
    
    // Update last activity date
    await prisma.$executeRaw`
      UPDATE cases 
      SET last_activity_date = (
        SELECT MAX(activity_date) 
        FROM case_activities 
        WHERE case_activities.case_id = cases.id
      )
      WHERE last_activity_date IS NULL;
    `;
    operations.push('Updated last activity dates');
    
    // Analyze tables to update statistics
    const tables = ['cases', 'case_activities', 'judges', 'courts', 'case_types'];
    for (const table of tables) {
      await prisma.$executeRawUnsafe(`ANALYZE ${table};`);
    }
    operations.push('Updated table statistics');
    
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

// Vacuum tables to reclaim space
export async function vacuumTables(
  tables: string[] = ['cases', 'case_activities', 'daily_import_batches']
): Promise<{ success: boolean; operations: string[]; errors: string[] }> {
  const operations: string[] = [];
  const errors: string[] = [];
  
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`VACUUM ANALYZE ${table};`);
      operations.push(`Vacuumed table: ${table}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Failed to vacuum ${table}: ${errorMessage}`);
    }
  }
  
  return {
    success: errors.length === 0,
    operations,
    errors
  };
}

// Reset query statistics
export async function resetQueryStatistics(): Promise<boolean> {
  try {
    await prisma.$executeRaw`SELECT pg_stat_statements_reset();`;
    return true;
  } catch (error) {
    logger.database.error('Failed to reset query statistics', error);
    return false;
  }
}

// Get connection statistics
export async function getConnectionStatistics(): Promise<{
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  maxConnections: number;
}> {
  try {
    const [stats, maxConn] = await Promise.all([
      prisma.$queryRaw<Array<{
        state: string;
        count: number;
      }>>`
        SELECT state, count(*) as count
        FROM pg_stat_activity 
        WHERE datname = current_database()
        GROUP BY state;
      `,
      prisma.$queryRaw<Array<{ max_connections: number }>>`
        SHOW max_connections;
      `
    ]);
    
    const connectionStats = stats.reduce((acc, item) => {
      acc[item.state || 'unknown'] = Number(item.count);
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalConnections: Object.values(connectionStats).reduce((sum, count) => sum + count, 0),
      activeConnections: connectionStats.active || 0,
      idleConnections: connectionStats.idle || 0,
      maxConnections: Number(maxConn[0]?.max_connections) || 0,
    };
  } catch (error) {
    logger.database.error('Error retrieving connection statistics', error);
    return {
      totalConnections: 0,
      activeConnections: 0,
      idleConnections: 0,
      maxConnections: 0,
    };
  }
}

// Monitor query execution plan
export async function explainQuery(query: string): Promise<any[]> {
  try {
    const plan = await prisma.$queryRawUnsafe(`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`);
    return plan as any[];
  } catch (error) {
    logger.database.error('Error explaining query', error);
    return [];
  }
}