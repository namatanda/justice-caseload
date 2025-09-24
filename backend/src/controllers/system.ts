import { Request, Response, NextFunction } from 'express';
import { checkDatabaseConnection } from '@/config/database';
import { checkRedisConnection } from '@/config/redis';
import { config } from '@/config/environment';
import { logger } from '@/utils/logger';
import { register } from 'prom-client';

class SystemController {
  async healthCheck(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.env,
        version: process.env.npm_package_version || '1.0.0',
      };

      res.status(200).json(health);
    } catch (error) {
      next(error);
    }
  }

  async detailedHealthCheck(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const checks = {
        database: false,
        redis: false,
        memory: true,
        disk: true,
      };

      // Check database connection
      try {
        checks.database = await checkDatabaseConnection();
      } catch (error) {
        logger.error('Database health check failed:', error);
        checks.database = false;
      }

      // Check Redis connection
      try {
        checks.redis = await checkRedisConnection();
      } catch (error) {
        logger.error('Redis health check failed:', error);
        checks.redis = false;
      }

      // Memory usage check
      const memoryUsage = process.memoryUsage();
      const memoryUsageMB = {
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        external: Math.round(memoryUsage.external / 1024 / 1024),
      };

      const isHealthy = checks.database && checks.redis && checks.memory && checks.disk;

      const healthStatus = {
        healthy: isHealthy,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.env,
        version: process.env.npm_package_version || '1.0.0',
        checks,
        system: {
          memory: memoryUsageMB,
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
        },
      };

      const statusCode = isHealthy ? 200 : 503;
      res.status(statusCode).json(healthStatus);
    } catch (error) {
      next(error);
    }
  }

  async metrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await register.metrics();
      res.set('Content-Type', register.contentType);
      res.status(200).send(metrics);
    } catch (error) {
      next(error);
    }
  }

  async version(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const version = {
        name: 'CourtFlow Backend API',
        version: process.env.npm_package_version || '1.0.0',
        apiVersion: config.api.version,
        nodeVersion: process.version,
        environment: config.env,
        buildDate: new Date().toISOString(),
      };

      res.status(200).json(version);
    } catch (error) {
      next(error);
    }
  }
}

export const systemController = new SystemController();