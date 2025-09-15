import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';

// Mock logger to avoid console output during tests
vi.mock('@/lib/logger', () => ({
  logger: {
    health: {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    },
    database: {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    },
    system: {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
    },
  },
}));

describe('Health Checks Integration Tests', () => {
  const originalEnv = { ...process.env };

  beforeAll(() => {
    // Set up test environment variables
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
    process.env.REDIS_HOST = 'localhost';
    process.env.REDIS_PORT = '6379';
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Basic Health Check (/api/health)', () => {
    it('should return health status', async () => {
      const response = await fetch('http://localhost:3000/api/health');
      const data = await response.json();

      expect(data).toHaveProperty('healthy');
      expect(data).toHaveProperty('checks');
      expect(data).toHaveProperty('timestamp');
      expect(Array.isArray(data.checks)).toBe(true);
    });

    it('should include database check', async () => {
      const response = await fetch('http://localhost:3000/api/health');
      const data = await response.json();

      const dbCheck = data.checks.find((check: any) => check.name === 'Database');
      expect(dbCheck).toBeDefined();
      expect(['PASS', 'FAIL']).toContain(dbCheck.status);
      expect(typeof dbCheck.message).toBe('string');
    });

    it('should include Redis check', async () => {
      const response = await fetch('http://localhost:3000/api/health');
      const data = await response.json();

      const redisCheck = data.checks.find((check: any) => check.name === 'Redis');
      expect(redisCheck).toBeDefined();
      expect(['PASS', 'FAIL']).toContain(redisCheck.status);
      expect(typeof redisCheck.message).toBe('string');
    });

    it('should include database pool check', async () => {
      const response = await fetch('http://localhost:3000/api/health');
      const data = await response.json();

      const poolCheck = data.checks.find((check: any) => check.name === 'Database Pool');
      expect(poolCheck).toBeDefined();
      expect(['PASS', 'FAIL']).toContain(poolCheck.status);
      expect(typeof poolCheck.message).toBe('string');
    });

    it('should return appropriate HTTP status codes', async () => {
      const response = await fetch('http://localhost:3000/api/health');

      if (response.ok) {
        expect(response.status).toBe(200);
      } else {
        expect(response.status).toBe(503); // Service Unavailable
      }
    });
  });

  describe('Detailed Health Check (/api/health/detailed)', () => {
    it('should return comprehensive health data', async () => {
      const response = await fetch('http://localhost:3000/api/health/detailed');
      const data = await response.json();

      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('overall');
      expect(data).toHaveProperty('services');
      expect(data).toHaveProperty('system');
      expect(data).toHaveProperty('recommendations');
    });

    it('should include overall health status', async () => {
      const response = await fetch('http://localhost:3000/api/health/detailed');
      const data = await response.json();

      expect(data.overall).toHaveProperty('healthy');
      expect(data.overall).toHaveProperty('status');
      expect(data.overall).toHaveProperty('uptime');
      expect(['HEALTHY', 'DEGRADED', 'UNHEALTHY']).toContain(data.overall.status);
    });

    it('should include database service details', async () => {
      const response = await fetch('http://localhost:3000/api/health/detailed');
      const data = await response.json();

      expect(data.services).toHaveProperty('database');
      expect(data.services.database).toHaveProperty('connected');
      expect(data.services.database).toHaveProperty('pool');
      expect(data.services.database).toHaveProperty('stats');
      expect(data.services.database).toHaveProperty('performance');
    });

    it('should include Redis service details', async () => {
      const response = await fetch('http://localhost:3000/api/health/detailed');
      const data = await response.json();

      expect(data.services).toHaveProperty('redis');
      expect(data.services.redis).toHaveProperty('connected');
      expect(data.services.redis).toHaveProperty('mode');
    });

    it('should include queue service details', async () => {
      const response = await fetch('http://localhost:3000/api/health/detailed');
      const data = await response.json();

      expect(data.services).toHaveProperty('queues');
      expect(data.services.queues).toHaveProperty('import');
      expect(data.services.queues).toHaveProperty('analytics');
    });

    it('should include system resource details', async () => {
      const response = await fetch('http://localhost:3000/api/health/detailed');
      const data = await response.json();

      expect(data.system).toHaveProperty('resources');
      expect(data.system).toHaveProperty('performance');
      expect(data.system.resources).toHaveProperty('cpu');
      expect(data.system.resources).toHaveProperty('memory');
      expect(data.system.resources).toHaveProperty('uptime');
    });

    it('should provide actionable recommendations', async () => {
      const response = await fetch('http://localhost:3000/api/health/detailed');
      const data = await response.json();

      expect(Array.isArray(data.recommendations)).toBe(true);
      // Recommendations should be strings
      data.recommendations.forEach((rec: any) => {
        expect(typeof rec).toBe('string');
      });
    });
  });

  describe('System Health Check (/api/system/health)', () => {
    it('should return system health status', async () => {
      const response = await fetch('http://localhost:3000/api/system/health');
      const data = await response.json();

      expect(data).toHaveProperty('healthy');
      expect(data).toHaveProperty('summary');
      expect(data).toHaveProperty('checks');
      expect(data).toHaveProperty('recommendations');
      expect(data).toHaveProperty('timestamp');
    });

    it('should include detailed check results', async () => {
      const response = await fetch('http://localhost:3000/api/system/health');
      const data = await response.json();

      expect(Array.isArray(data.checks)).toBe(true);
      data.checks.forEach((check: any) => {
        expect(check).toHaveProperty('name');
        expect(check).toHaveProperty('status');
        expect(check).toHaveProperty('message');
        expect(['PASS', 'WARN', 'FAIL']).toContain(check.status);
      });
    });

    it('should include system resource checks', async () => {
      const response = await fetch('http://localhost:3000/api/system/health');
      const data = await response.json();

      const systemCheck = data.checks.find((check: any) => check.name === 'System Resources');
      expect(systemCheck).toBeDefined();
      expect(systemCheck.details).toHaveProperty('cpu');
      expect(systemCheck.details).toHaveProperty('memory');
    });

    it('should include database connection checks', async () => {
      const response = await fetch('http://localhost:3000/api/system/health');
      const data = await response.json();

      const dbCheck = data.checks.find((check: any) => check.name === 'Database Connection');
      expect(dbCheck).toBeDefined();
      expect(['PASS', 'WARN', 'FAIL']).toContain(dbCheck.status);
    });

    it('should include Redis cluster checks', async () => {
      const response = await fetch('http://localhost:3000/api/system/health');
      const data = await response.json();

      const redisCheck = data.checks.find((check: any) => check.name === 'Redis Cluster');
      expect(redisCheck).toBeDefined();
      expect(['PASS', 'WARN', 'FAIL']).toContain(redisCheck.status);
    });

    it('should include queue processing checks', async () => {
      const response = await fetch('http://localhost:3000/api/system/health');
      const data = await response.json();

      const queueCheck = data.checks.find((check: any) => check.name === 'Queue Processing');
      expect(queueCheck).toBeDefined();
      expect(['PASS', 'WARN', 'FAIL']).toContain(queueCheck.status);
    });
  });

  describe('Health Check Integration', () => {
    it('should handle concurrent health check requests', async () => {
      const requests = [];
      const numRequests = 5;

      for (let i = 0; i < numRequests; i++) {
        requests.push(fetch('http://localhost:3000/api/health'));
      }

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.ok || response.status === 503).toBe(true);
      });
    });

    it('should provide consistent results across endpoints', async () => {
      const [basic, detailed, system] = await Promise.all([
        fetch('http://localhost:3000/api/health').then(r => r.json()),
        fetch('http://localhost:3000/api/health/detailed').then(r => r.json()),
        fetch('http://localhost:3000/api/system/health').then(r => r.json()),
      ]);

      // All should have timestamps
      expect(basic.timestamp).toBeDefined();
      expect(detailed.timestamp).toBeDefined();
      expect(system.timestamp).toBeDefined();

      // Basic and detailed should have overall health
      expect(typeof basic.healthy).toBe('boolean');
      expect(typeof detailed.overall.healthy).toBe('boolean');
      expect(typeof system.healthy).toBe('boolean');
    });

    it('should handle network timeouts gracefully', async () => {
      // Test with a very short timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1);

      try {
        await fetch('http://localhost:3000/api/health', {
          signal: controller.signal,
        });
      } catch (error: any) {
        expect(error.name).toBe('AbortError');
      } finally {
        clearTimeout(timeoutId);
      }
    });
  });

  describe('Health Check Performance', () => {
    it('should respond within acceptable time limits', async () => {
      const startTime = Date.now();
      const response = await fetch('http://localhost:3000/api/health');
      const endTime = Date.now();

      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds
    });

    it('should handle high-frequency health checks', async () => {
      const requests = [];
      const numRequests = 10;

      for (let i = 0; i < numRequests; i++) {
        requests.push(fetch('http://localhost:3000/api/health'));
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay between requests
      }

      const responses = await Promise.all(requests);
      const successCount = responses.filter(r => r.ok || r.status === 503).length;

      expect(successCount).toBe(numRequests);
    });
  });
});