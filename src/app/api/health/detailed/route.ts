import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getSystemResources, formatBytes, formatUptime } from '@/lib/system-monitoring';

interface DetailedHealthResponse {
  timestamp: string;
  overall: {
    healthy: boolean;
    status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
    uptime: string;
  };
  services: {
    database: {
      connected: boolean;
      pool: any;
      stats: any;
      performance: any;
    };
    redis: {
      connected: boolean;
      mode: string;
      cluster?: any;
    };
    queues: {
      import: any;
      analytics: any;
    };
  };
  system: {
    resources: any;
    performance: any;
  };
  recommendations: string[];
}

export async function GET() {
  try {
    logger.health.info('Running comprehensive health check');

    const healthData = await gatherComprehensiveHealthData();

    // Determine overall health status
    const criticalServices = ['database', 'redis'];
    const degradedServices = ['queues'];

    let overallHealthy = true;
    let overallStatus: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' = 'HEALTHY';

    // Check critical services
    if (!healthData.services.database.connected || !healthData.services.redis.connected) {
      overallHealthy = false;
      overallStatus = 'UNHEALTHY';
    }

    // Check for degradation
    if (overallHealthy) {
      const queueStats = healthData.services.queues;
      const totalFailed = queueStats.import.failed + queueStats.analytics.failed;
      const totalQueued = queueStats.import.waiting + queueStats.import.active +
                          queueStats.analytics.waiting + queueStats.analytics.active;

      if (totalFailed > 50 || totalQueued > 100) {
        overallStatus = 'DEGRADED';
      }

      // Check database pool health
      const pool = healthData.services.database.pool;
      if (pool && !pool.health) {
        overallStatus = 'DEGRADED';
      }

      // Check system resources
      const resources = healthData.system.resources;
      if (resources && resources.memory && resources.cpu &&
          (resources.memory.usage > 90 || resources.cpu.usage > 90)) {
        overallStatus = 'DEGRADED';
      }
    }

    const response: DetailedHealthResponse = {
      timestamp: new Date().toISOString(),
      overall: {
        healthy: overallHealthy,
        status: overallStatus,
        uptime: formatUptime(getSystemResources().uptime)
      },
      services: healthData.services,
      system: healthData.system,
      recommendations: healthData.recommendations
    };

    return NextResponse.json(response, {
      status: overallHealthy ? 200 : overallStatus === 'DEGRADED' ? 200 : 503
    });

  } catch (error) {
    logger.health.error('Comprehensive health check failed', error);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      overall: {
        healthy: false,
        status: 'UNHEALTHY',
        uptime: 'Unknown'
      },
      error: 'Health check system failure',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

async function gatherComprehensiveHealthData() {
  const [
    databaseConnection,
    databasePool,
    databaseStats,
    databasePerformance,
    redisConnection,
    redisMode,
    queueStats,
    systemResources,
    systemPerformance
  ] = await Promise.allSettled([
    checkDatabaseConnection(),
    getDatabasePoolStats(),
    getDatabaseStats(),
    getDatabasePerformance(),
    checkRedisConnection(),
    getRedisMode(),
    getQueueStats(),
    getSystemResourcesData(),
    getSystemPerformanceData()
  ]);

  const services = {
    database: {
      connected: databaseConnection.status === 'fulfilled' ? databaseConnection.value : false,
      pool: databasePool.status === 'fulfilled' ? databasePool.value : null,
      stats: databaseStats.status === 'fulfilled' ? databaseStats.value : null,
      performance: databasePerformance.status === 'fulfilled' ? databasePerformance.value : null
    },
    redis: {
      connected: redisConnection.status === 'fulfilled' ? redisConnection.value : false,
      mode: redisMode.status === 'fulfilled' ? redisMode.value : 'Unknown',
      cluster: redisMode.status === 'fulfilled' ? redisMode.value : null
    },
    queues: queueStats.status === 'fulfilled' ? queueStats.value : { import: {}, analytics: {} }
  };

  const system = {
    resources: systemResources.status === 'fulfilled' ? systemResources.value : {},
    performance: systemPerformance.status === 'fulfilled' ? systemPerformance.value : {}
  };

  const recommendations = generateDetailedRecommendations(services, system);

  return { services, system, recommendations };
}

async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const { prisma } = await import('@/lib/database');
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

async function getDatabasePoolStats() {
  try {
    const { getConnectionStatistics, getPoolHealthStatus } = await import('@/lib/database');
    const stats = await getConnectionStatistics();
    const health = await getPoolHealthStatus();

    return {
      ...stats,
      health: health.healthy,
      issues: health.issues,
      recommendations: health.recommendations
    };
  } catch {
    return null;
  }
}

async function getDatabaseStats() {
  try {
    const { getDatabaseStats } = await import('@/lib/database');
    return await getDatabaseStats();
  } catch {
    return null;
  }
}

async function getDatabasePerformance() {
  try {
    const { getDatabasePerformanceReport } = await import('@/lib/database');
    return await getDatabasePerformanceReport();
  } catch {
    return null;
  }
}

async function checkRedisConnection(): Promise<boolean> {
  try {
    const { checkRedisConnection } = await import('@/lib/database');
    return await checkRedisConnection();
  } catch {
    return false;
  }
}

async function getRedisMode(): Promise<string> {
  try {
    const { redis } = await import('@/lib/database');
    const { isRedisCluster } = await import('@/lib/database/redis-cluster');
    return isRedisCluster(redis) ? 'Cluster' : 'Single Instance';
  } catch {
    return 'Unknown';
  }
}

async function getQueueStats() {
  try {
    const { getQueueStats } = await import('@/lib/database');
    return await getQueueStats();
  } catch {
    return { import: {}, analytics: {} };
  }
}

async function getSystemResourcesData() {
  try {
    const resources = getSystemResources();
    return {
      cpu: {
        usage: resources.cpu.usage,
        cores: resources.cpu.cores,
        loadAverage: resources.cpu.loadAverage
      },
      memory: {
        usage: resources.memory.usage,
        used: formatBytes(resources.memory.used),
        total: formatBytes(resources.memory.total),
        free: formatBytes(resources.memory.free)
      },
      uptime: formatUptime(resources.uptime),
      platform: resources.platform,
      nodeVersion: resources.nodeVersion
    };
  } catch {
    return {};
  }
}

async function getSystemPerformanceData() {
  // Could include additional performance metrics here
  return {
    process: {
      pid: process.pid,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    }
  };
}

function generateDetailedRecommendations(services: any, system: any): string[] {
  const recommendations: string[] = [];

  // Database recommendations
  if (!services.database.connected) {
    recommendations.push('CRITICAL: Database connection failed - check database server and connection string');
  } else {
    const pool = services.database.pool;
    if (pool) {
      const utilization = (pool.activeConnections / pool.maxConnections) * 100;
      if (utilization > 90) {
        recommendations.push(`HIGH: Database pool utilization at ${utilization.toFixed(1)}% - consider increasing max connections`);
      }

      // Add pool-specific recommendations
      if (pool.issues && pool.issues.length > 0) {
        pool.issues.forEach((issue: string) => recommendations.push(`WARNING: ${issue}`));
      }
      if (pool.recommendations && pool.recommendations.length > 0) {
        pool.recommendations.forEach((rec: string) => recommendations.push(`INFO: ${rec}`));
      }
    }
  }

  // Redis recommendations
  if (!services.redis.connected) {
    recommendations.push('CRITICAL: Redis connection failed - check Redis server and configuration');
  }

  // Queue recommendations
  const queues = services.queues;
  if (queues) {
    const totalFailed = queues.import.failed + queues.analytics.failed;
    const totalQueued = queues.import.waiting + queues.import.active +
                       queues.analytics.waiting + queues.analytics.active;

    if (totalFailed > 10) {
      recommendations.push(`WARNING: ${totalFailed} failed queue jobs - investigate queue processing issues`);
    }

    if (totalQueued > 50) {
      recommendations.push(`INFO: ${totalQueued} jobs in queue - monitor processing capacity`);
    }
  }

  // System recommendations
  const resources = system.resources;
  if (resources) {
    if (resources.memory.usage > 90) {
      recommendations.push(`HIGH: Memory usage at ${resources.memory.usage.toFixed(1)}% - monitor for memory leaks`);
    }

    if (resources.cpu.usage > 90) {
      recommendations.push(`HIGH: CPU usage at ${resources.cpu.usage.toFixed(1)}% - check for performance bottlenecks`);
    }
  }

  // Performance recommendations
  const performance = services.database.performance;
  if (performance && performance.slowQueries && performance.slowQueries.length > 0) {
    recommendations.push(`INFO: ${performance.slowQueries.length} slow database queries detected - review query optimization`);
  }

  if (performance && performance.unusedIndexes && performance.unusedIndexes.length > 0) {
    recommendations.push(`INFO: ${performance.unusedIndexes.length} potentially unused indexes - consider cleanup`);
  }

  return recommendations;
}