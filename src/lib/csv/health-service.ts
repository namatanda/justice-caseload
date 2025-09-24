/**
 * Health Service Module
 *
 * Handles health check business logic including:
 * - Database connectivity checks
 * - Redis connectivity checks
 * - Database pool health checks
 */

import { logger } from '../logger';
import { HealthServiceInterface } from '../interfaces/justice-caseload.interfaces';

interface HealthCheck {
  name: string;
  status: 'PASS' | 'FAIL';
  message: string;
}

export class HealthServiceImpl implements HealthServiceInterface {
  /**
   * Run basic health checks
   */
  async runBasicHealthChecks(): Promise<HealthCheck[]> {
    const checks: HealthCheck[] = [];

    // Check database connection
    try {
      const { prisma } = await import('../db');
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
      const { getPoolHealthStatus } = await import('../db');
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
      const { checkRedisConnection } = await import('../db');
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
}

// Export singleton instance
export const healthService = new HealthServiceImpl();
export default healthService;