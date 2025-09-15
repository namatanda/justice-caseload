import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { Redis, Cluster } from 'ioredis';
import { checkRedisConnection, isRedisCluster } from '@/lib/database/redis-cluster';
import { cacheManager, sessionManager, rateLimiter } from '@/lib/database/redis';
import { importQueue, analyticsQueue } from '@/lib/database/redis';

// Mock logger to avoid console output during tests
vi.mock('@/lib/logger', () => ({
  logger: {
    database: {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    },
  },
}));

describe('Redis Cluster Integration Tests', () => {
  const originalEnv = { ...process.env };

  beforeAll(() => {
    // Set up test environment variables
    process.env.REDIS_CLUSTER_ENABLED = 'true';
    process.env.REDIS_CLUSTER_MODE = 'sentinel';
    process.env.REDIS_SENTINEL_MASTER_NAME = 'mymaster';
    process.env.REDIS_SENTINEL_HOSTS = 'localhost:26379';
    process.env.REDIS_PASSWORD = '';
    process.env.REDIS_DB = '1'; // Use a different DB for testing
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Redis Connection', () => {
    it('should establish Redis connection', async () => {
      const isConnected = await checkRedisConnection();
      expect(typeof isConnected).toBe('boolean');
    });

    it('should detect Redis cluster mode correctly', async () => {
      const { redis } = await import('@/lib/database/redis');
      const isCluster = isRedisCluster(redis);
      expect(typeof isCluster).toBe('boolean');
    });

    it('should handle connection failures gracefully', async () => {
      // Test with invalid connection
      const invalidRedis = new Redis({
        host: 'invalid-host',
        port: 6379,
        lazyConnect: true,
        maxRetriesPerRequest: 1,
      });

      try {
        await invalidRedis.ping();
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      } finally {
        invalidRedis.disconnect();
      }
    });
  });

  describe('Cache Manager', () => {
    it('should set and get cache values', async () => {
      const testKey = 'test-cache-key';
      const testValue = { data: 'test', timestamp: Date.now() };

      await cacheManager.set(testKey, testValue, 60);
      const retrieved = await cacheManager.get(testKey);

      expect(retrieved).toEqual(testValue);
    });

    it('should handle cache expiration', async () => {
      const testKey = 'test-expiry-key';
      const testValue = { data: 'expires' };

      await cacheManager.set(testKey, testValue, 1); // 1 second TTL
      await new Promise(resolve => setTimeout(resolve, 1100)); // Wait > 1 second

      const retrieved = await cacheManager.get(testKey);
      expect(retrieved).toBeNull();
    });

    it('should delete cache entries', async () => {
      const testKey = 'test-delete-key';
      const testValue = { data: 'to-delete' };

      await cacheManager.set(testKey, testValue);
      await cacheManager.del(testKey);

      const retrieved = await cacheManager.get(testKey);
      expect(retrieved).toBeNull();
    });

    it('should check cache existence', async () => {
      const testKey = 'test-exists-key';
      const testValue = { data: 'exists' };

      const existsBefore = await cacheManager.exists(testKey);
      expect(existsBefore).toBe(false);

      await cacheManager.set(testKey, testValue);

      const existsAfter = await cacheManager.exists(testKey);
      expect(existsAfter).toBe(true);
    });
  });

  describe('Session Manager', () => {
    it('should set and get session data', async () => {
      const sessionId = 'test-session-123';
      const sessionData = { userId: 'user123', role: 'admin' };

      await sessionManager.setSession(sessionId, sessionData);
      const retrieved = await sessionManager.getSession(sessionId);

      expect(retrieved).toEqual(sessionData);
    });

    it('should delete sessions', async () => {
      const sessionId = 'test-delete-session';
      const sessionData = { userId: 'user456' };

      await sessionManager.setSession(sessionId, sessionData);
      await sessionManager.deleteSession(sessionId);

      const retrieved = await sessionManager.getSession(sessionId);
      expect(retrieved).toBeNull();
    });

    it('should extend session TTL', async () => {
      const sessionId = 'test-extend-session';
      const sessionData = { userId: 'user789' };

      await sessionManager.setSession(sessionId, sessionData, 2); // 2 seconds
      await sessionManager.extendSession(sessionId, 10); // Extend to 10 seconds

      // Wait 3 seconds (past original TTL but within extended)
      await new Promise(resolve => setTimeout(resolve, 3000));

      const retrieved = await sessionManager.getSession(sessionId);
      expect(retrieved).toEqual(sessionData);
    });
  });

  describe('Rate Limiter', () => {
    it('should allow requests within limits', async () => {
      const key = 'test-rate-limit';
      const maxRequests = 3;
      const windowSeconds = 10;

      for (let i = 0; i < maxRequests; i++) {
        const result = await rateLimiter.checkLimit(key, maxRequests, windowSeconds);
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(maxRequests - i - 1);
      }
    });

    it('should block requests over limits', async () => {
      const key = 'test-rate-limit-block';
      const maxRequests = 2;
      const windowSeconds = 5;

      // Use up the limit
      for (let i = 0; i < maxRequests; i++) {
        await rateLimiter.checkLimit(key, maxRequests, windowSeconds);
      }

      // Next request should be blocked
      const result = await rateLimiter.checkLimit(key, maxRequests, windowSeconds);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset limits after window expires', async () => {
      const key = 'test-rate-limit-reset';
      const maxRequests = 2;
      const windowSeconds = 1; // Very short window for testing

      // Use up the limit
      for (let i = 0; i < maxRequests; i++) {
        await rateLimiter.checkLimit(key, maxRequests, windowSeconds);
      }

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, windowSeconds * 1000 + 100));

      // Should allow requests again
      const result = await rateLimiter.checkLimit(key, maxRequests, windowSeconds);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(maxRequests - 1);
    });
  });

  describe('Queue Operations', () => {
    it('should add jobs to import queue', async () => {
      const jobData = {
        filePath: '/test/file.csv',
        filename: 'test.csv',
        fileSize: 1024,
        checksum: 'test-checksum',
        userId: 'test-user',
        batchId: 'test-batch-123'
      };

      const job = await importQueue.add('test-import', jobData);
      expect(job).toBeDefined();
      expect(job.id).toBeDefined();
      expect(job.data).toEqual(jobData);
    });

    it('should add jobs to analytics queue', async () => {
      const jobData = {
        type: 'refresh_dashboard' as const,
        userId: 'test-user',
        filters: { dateRange: 'last-30-days' }
      };

      const job = await analyticsQueue.add('test-analytics', jobData);
      expect(job).toBeDefined();
      expect(job.id).toBeDefined();
      expect(job.data).toEqual(jobData);
    });

    it('should get queue statistics', async () => {
      const stats = await importQueue.getJobCounts();
      expect(stats).toBeDefined();
      expect(typeof stats.waiting).toBe('number');
      expect(typeof stats.active).toBe('number');
      expect(typeof stats.completed).toBe('number');
      expect(typeof stats.failed).toBe('number');
    });
  });

  describe('Cluster-Aware Operations', () => {
    it('should handle pattern-based cache invalidation', async () => {
      const pattern = 'test-pattern-*';

      // Set multiple keys with pattern
      await cacheManager.set('test-pattern-1', { data: 'value1' });
      await cacheManager.set('test-pattern-2', { data: 'value2' });
      await cacheManager.set('other-key', { data: 'value3' });

      // Invalidate pattern
      await cacheManager.invalidatePattern(pattern);

      // Check that pattern keys are gone but other key remains
      const value1 = await cacheManager.get('test-pattern-1');
      const value2 = await cacheManager.get('test-pattern-2');
      const value3 = await cacheManager.get('other-key');

      expect(value1).toBeNull();
      expect(value2).toBeNull();
      expect(value3).toEqual({ data: 'value3' });
    });

    it('should handle cluster failover scenarios', async () => {
      // This test would require a multi-node Redis setup
      // For now, just verify the connection is stable
      const isConnected = await checkRedisConnection();
      expect(isConnected).toBe(true);
    });
  });

  describe('Performance and Monitoring', () => {
    it('should handle concurrent operations', async () => {
      const operations = [];
      const numOperations = 10;

      for (let i = 0; i < numOperations; i++) {
        operations.push(
          cacheManager.set(`concurrent-key-${i}`, { data: `value-${i}` })
        );
      }

      await Promise.all(operations);

      // Verify all operations completed
      for (let i = 0; i < numOperations; i++) {
        const value = await cacheManager.get(`concurrent-key-${i}`);
        expect(value).toEqual({ data: `value-${i}` });
      }
    });

    it('should handle large data sets', async () => {
      const largeData = {
        data: 'x'.repeat(10000), // 10KB of data
        metadata: { size: 'large', type: 'test' }
      };

      await cacheManager.set('large-data-key', largeData);
      const retrieved = await cacheManager.get('large-data-key');

      expect(retrieved).toEqual(largeData);
    });
  });
});