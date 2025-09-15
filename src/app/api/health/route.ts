import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

interface HealthCheck {
  name: string;
  status: 'PASS' | 'FAIL';
  message: string;
}

export async function GET() {
  try {
    logger.health.info('Running basic health check');

    // Run basic health checks
    const checks: HealthCheck[] = await runBasicHealthChecks();

    const criticalIssues = checks.filter((check: HealthCheck) => check.status === 'FAIL');
    const isHealthy = criticalIssues.length === 0;

    logger.health.info(`Basic health check complete: ${checks.filter(c => c.status === 'PASS').length} passed, ${criticalIssues.length} failed`);

    return NextResponse.json({
      healthy: isHealthy,
      checks,
      timestamp: new Date().toISOString()
    }, {
      status: isHealthy ? 200 : 503 // Service Unavailable if not healthy
    });

  } catch (error) {
    logger.health.error('Basic health check failed', error);

    return NextResponse.json({
      healthy: false,
      error: 'Health check system failure',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

async function runBasicHealthChecks(): Promise<HealthCheck[]> {
  const checks: HealthCheck[] = [];

  // Check database connection
  try {
    const { prisma } = await import('@/lib/database');
    await prisma.$queryRaw`SELECT 1`;

    checks.push({
      name: 'Database',
      status: 'PASS',
      message: 'Connected successfully'
    });
  } catch (error) {
    checks.push({
      name: 'Database',
      status: 'FAIL',
      message: 'Cannot connect to database'
    });
  }

  // Check database pool health
  try {
    const { getPoolHealthStatus } = await import('@/lib/database');
    const poolHealth = await getPoolHealthStatus();

    checks.push({
      name: 'Database Pool',
      status: poolHealth.healthy ? 'PASS' : 'FAIL',
      message: poolHealth.healthy
        ? 'Pool operating normally'
        : `Pool issues detected: ${poolHealth.issues.join(', ')}`
    });
  } catch (error) {
    checks.push({
      name: 'Database Pool',
      status: 'FAIL',
      message: 'Cannot check pool health'
    });
  }

  // Check Redis connection
  try {
    const { checkRedisConnection } = await import('@/lib/database');
    const redisHealthy = await checkRedisConnection();

    checks.push({
      name: 'Redis',
      status: redisHealthy ? 'PASS' : 'FAIL',
      message: redisHealthy ? 'Connected successfully' : 'Cannot connect to Redis'
    });
  } catch (error) {
    checks.push({
      name: 'Redis',
      status: 'FAIL',
      message: 'Redis check failed'
    });
  }

  return checks;
}