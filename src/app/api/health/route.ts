import { NextResponse } from 'next/server';
import { checkRedisConnection } from '@/lib/database/redis';
import { prisma } from '@/lib/database/prisma';

export async function GET() {
  try {
    const healthCheck = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      services: {
        database: { status: 'unknown', latency: 0, error: null as string | null },
        redis: { status: 'unknown', error: null as string | null },
        workers: { status: 'unknown', error: null as string | null }
      }
    };

    // Database health check
    const dbStart = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      healthCheck.services.database = {
        status: 'healthy',
        latency: Date.now() - dbStart,
        error: null
      };
    } catch (error) {
      healthCheck.services.database = {
        status: 'unhealthy',
        latency: Date.now() - dbStart,
        error: error instanceof Error ? error.message : 'Unknown database error'
      };
      healthCheck.status = 'degraded';
    }

    // Redis health check
    try {
      const redisConnected = await checkRedisConnection();
      healthCheck.services.redis = {
        status: redisConnected ? 'healthy' : 'unhealthy',
        error: redisConnected ? null : 'Redis connection failed'
      };
      if (!redisConnected) {
        healthCheck.status = 'degraded';
      }
    } catch (error) {
      healthCheck.services.redis = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown Redis error'
      };
      healthCheck.status = 'degraded';
    }

    // Workers health check (simplified - check if we can access the queue)
    try {
      if (healthCheck.services.redis.status === 'healthy') {
        // If Redis is healthy, workers should be accessible
        healthCheck.services.workers = {
          status: 'healthy',
          error: null
        };
      } else {
        healthCheck.services.workers = {
          status: 'unhealthy',
          error: 'Redis unavailable - workers cannot function'
        };
      }
    } catch (error) {
      healthCheck.services.workers = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown worker error'
      };
      healthCheck.status = 'degraded';
    }

    // Overall status
    if (healthCheck.services.database.status === 'unhealthy') {
      healthCheck.status = 'unhealthy';
    }

    const statusCode = healthCheck.status === 'unhealthy' ? 503 : 
                      healthCheck.status === 'degraded' ? 200 : 200;

    return NextResponse.json(healthCheck, { status: statusCode });

  } catch (error) {
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown health check error'
      },
      { status: 503 }
    );
  }
}