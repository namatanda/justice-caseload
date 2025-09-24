import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { healthService } from '@/lib/csv';

interface HealthCheck {
  name: string;
  status: 'PASS' | 'FAIL';
  message: string;
}

export async function GET() {
  try {
    logger.health.info('Running basic health check');

    // Run basic health checks using the health service
    const checks: HealthCheck[] = await healthService.runBasicHealthChecks();

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