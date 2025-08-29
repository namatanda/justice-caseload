import { Redis } from 'ioredis';
import { Queue, Worker, Job } from 'bullmq';

// Redis connection configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  lazyConnect: true,
};

// Create Redis instances
export const redis = new Redis(redisConfig);
export const redisPublisher = new Redis(redisConfig);
export const redisSubscriber = new Redis(redisConfig);

// Queue configuration
export const importQueue = new Queue('csv-import', { 
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 50,      // Keep last 50 failed jobs
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

// Queue job types
export interface ImportJobData {
  filePath: string;
  filename: string;
  fileSize: number;
  checksum: string;
  userId: string;
  batchId: string;
}

export interface AnalyticsJobData {
  type: 'refresh_dashboard' | 'generate_report';
  userId: string;
  filters?: any;
}

// Analytics queue for background reporting
export const analyticsQueue = new Queue('analytics', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 50,
    removeOnFail: 25,
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 5000,
    },
  },
});

// Cache utilities
export class CacheManager {
  private redis: Redis;
  
  constructor() {
    this.redis = redis;
  }

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  // Dashboard specific cache methods
  async getCachedDashboardData(filters: string): Promise<any | null> {
    return this.get(`dashboard:${filters}`);
  }

  async setCachedDashboardData(filters: string, data: any): Promise<void> {
    await this.set(`dashboard:${filters}`, data, 300); // 5 minutes
  }

  async invalidateDashboardCache(): Promise<void> {
    await this.invalidatePattern('dashboard:*');
  }

  // Import status cache
  async setImportStatus(batchId: string, status: any): Promise<void> {
    await this.set(`import:${batchId}`, status, 3600); // 1 hour
  }

  async getImportStatus(batchId: string): Promise<any | null> {
    return this.get(`import:${batchId}`);
  }
}

export const cacheManager = new CacheManager();

// Redis health check
export async function checkRedisConnection(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.error('Redis connection failed:', error);
    return false;
  }
}

// Graceful shutdown for Redis connections
export async function disconnectRedis(): Promise<void> {
  await Promise.all([
    redis.disconnect(),
    redisPublisher.disconnect(),
    redisSubscriber.disconnect(),
  ]);
}

// Queue monitoring utilities
export async function getQueueStats() {
  const [importStats, analyticsStats] = await Promise.all([
    importQueue.getJobCounts(),
    analyticsQueue.getJobCounts(),
  ]);

  return {
    import: importStats,
    analytics: analyticsStats,
  };
}

// Clean up old jobs
export async function cleanupQueues(): Promise<void> {
  await Promise.all([
    importQueue.clean(24 * 60 * 60 * 1000, 100, 'completed'), // Clean completed jobs older than 24h
    importQueue.clean(7 * 24 * 60 * 60 * 1000, 50, 'failed'), // Clean failed jobs older than 7 days
    analyticsQueue.clean(24 * 60 * 60 * 1000, 50, 'completed'),
    analyticsQueue.clean(7 * 24 * 60 * 60 * 1000, 25, 'failed'),
  ]);
}

// Session and rate limiting utilities
export class SessionManager {
  private redis: Redis;
  
  constructor() {
    this.redis = redis;
  }

  async setSession(sessionId: string, data: any, ttlSeconds: number = 3600): Promise<void> {
    await this.redis.setex(`session:${sessionId}`, ttlSeconds, JSON.stringify(data));
  }

  async getSession(sessionId: string): Promise<any | null> {
    const value = await this.redis.get(`session:${sessionId}`);
    return value ? JSON.parse(value) : null;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.redis.del(`session:${sessionId}`);
  }

  async extendSession(sessionId: string, ttlSeconds: number = 3600): Promise<void> {
    await this.redis.expire(`session:${sessionId}`, ttlSeconds);
  }
}

export class RateLimiter {
  private redis: Redis;
  
  constructor() {
    this.redis = redis;
  }

  async checkLimit(
    key: string, 
    maxRequests: number, 
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Math.floor(Date.now() / 1000);
    const window = Math.floor(now / windowSeconds);
    const redisKey = `rate_limit:${key}:${window}`;
    
    const current = await this.redis.incr(redisKey);
    
    if (current === 1) {
      await this.redis.expire(redisKey, windowSeconds);
    }
    
    const remaining = Math.max(0, maxRequests - current);
    const resetTime = (window + 1) * windowSeconds;
    
    return {
      allowed: current <= maxRequests,
      remaining,
      resetTime,
    };
  }
}

export const sessionManager = new SessionManager();
export const rateLimiter = new RateLimiter();

export default redis;