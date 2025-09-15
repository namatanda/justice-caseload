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

describe('Prometheus Monitoring Integration Tests', () => {
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

  describe('Metrics Endpoint (/api/metrics)', () => {
    it('should return Prometheus metrics', async () => {
      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      expect(response.headers.get('Content-Type')).toBe('text/plain; version=0.0.4; charset=utf-8');
      expect(metrics).toContain('# HELP');
      expect(metrics).toContain('# TYPE');
    });

    it('should include HTTP request metrics', async () => {
      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      expect(metrics).toContain('http_request_duration_seconds');
      expect(metrics).toContain('http_requests_total');
    });

    it('should include database metrics', async () => {
      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      expect(metrics).toContain('db_query_duration_seconds');
      expect(metrics).toContain('db_queries_total');
    });

    it('should include Redis metrics', async () => {
      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      expect(metrics).toContain('redis_operation_duration_seconds');
      expect(metrics).toContain('redis_operations_total');
    });

    it('should include queue metrics', async () => {
      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      expect(metrics).toContain('queue_job_duration_seconds');
      expect(metrics).toContain('queue_jobs_total');
      expect(metrics).toContain('queue_jobs_active');
    });

    it('should include system metrics', async () => {
      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      expect(metrics).toContain('system_memory_usage_bytes');
      expect(metrics).toContain('system_cpu_usage_percent');
    });

    it('should include business metrics', async () => {
      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      expect(metrics).toContain('cases_processed_total');
      expect(metrics).toContain('import_batches_total');
      expect(metrics).toContain('active_users');
    });
  });

  describe('Metrics Collection', () => {
    it('should collect HTTP request metrics', async () => {
      // Make some HTTP requests to generate metrics
      await fetch('http://localhost:3000/api/health');
      await fetch('http://localhost:3000/api/health');
      await fetch('http://localhost:3000/api/health/detailed');

      // Wait a moment for metrics to be collected
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      // Should contain metrics for the requests we made
      expect(metrics).toMatch(/http_requests_total{[^}]*} \d+/);
    });

    it('should collect database operation metrics', async () => {
      // Trigger some database operations through health checks
      await fetch('http://localhost:3000/api/health');

      // Wait for metrics collection
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      // Should contain database metrics
      expect(metrics).toMatch(/db_queries_total{[^}]*} \d+/);
    });

    it('should collect Redis operation metrics', async () => {
      // Trigger Redis operations through health checks
      await fetch('http://localhost:3000/api/health');

      // Wait for metrics collection
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      // Should contain Redis metrics
      expect(metrics).toMatch(/redis_operations_total{[^}]*} \d+/);
    });

    it('should collect system resource metrics', async () => {
      // Trigger system monitoring through health checks
      await fetch('http://localhost:3000/api/health/detailed');

      // Wait for metrics collection
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      // Should contain system metrics
      expect(metrics).toContain('system_memory_usage_bytes');
      expect(metrics).toContain('system_cpu_usage_percent');
    });
  });

  describe('Metrics Middleware', () => {
    it('should track request duration', async () => {
      const startTime = Date.now();

      await fetch('http://localhost:3000/api/health');

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      // Wait for metrics collection
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      // Should contain duration metrics
      expect(metrics).toMatch(/http_request_duration_seconds{[^}]*} [\d.]+/);
    });

    it('should track request status codes', async () => {
      // Make requests that should return different status codes
      await fetch('http://localhost:3000/api/health'); // Should be 200
      await fetch('http://localhost:3000/api/nonexistent'); // Should be 404

      // Wait for metrics collection
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      // Should contain status code metrics
      expect(metrics).toMatch(/http_requests_total{[^}]*status_code="200"[^}]*} \d+/);
      expect(metrics).toMatch(/http_requests_total{[^}]*status_code="404"[^}]*} \d+/);
    });

    it('should track different HTTP methods', async () => {
      // Make requests with different methods (if supported by endpoints)
      await fetch('http://localhost:3000/api/health'); // GET

      // Wait for metrics collection
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      // Should contain method metrics
      expect(metrics).toMatch(/http_requests_total{[^}]*method="GET"[^}]*} \d+/);
    });
  });

  describe('Metrics Format and Structure', () => {
    it('should follow Prometheus metrics format', async () => {
      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      const lines = metrics.split('\n');

      // Check for HELP comments
      const helpLines = lines.filter(line => line.startsWith('# HELP'));
      expect(helpLines.length).toBeGreaterThan(0);

      // Check for TYPE comments
      const typeLines = lines.filter(line => line.startsWith('# TYPE'));
      expect(typeLines.length).toBeGreaterThan(0);

      // Check for metric lines (not comments)
      const metricLines = lines.filter(line => !line.startsWith('#') && line.trim() !== '');
      expect(metricLines.length).toBeGreaterThan(0);

      // Each metric line should follow the format: name{labels} value
      metricLines.forEach(line => {
        expect(line).toMatch(/^[a-zA-Z_:][a-zA-Z0-9_:]*(\{[^}]*\})? [\d.]+$/);
      });
    });

    it('should include metric labels correctly', async () => {
      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      // Should contain metrics with labels
      expect(metrics).toMatch(/http_request_duration_seconds\{[^}]*method="[^"]*"[^}]*route="[^"]*"[^}]*status_code="[^"]*"[^}]*\}/);
      expect(metrics).toMatch(/db_queries_total\{[^}]*operation="[^"]*"[^}]*table="[^"]*"[^}]*status="[^"]*"[^}]*\}/);
      expect(metrics).toMatch(/redis_operations_total\{[^}]*operation="[^"]*"[^}]*status="[^"]*"[^}]*\}/);
    });

    it('should have reasonable metric values', async () => {
      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      const lines = metrics.split('\n');
      const metricLines = lines.filter(line => !line.startsWith('#') && line.trim() !== '');

      metricLines.forEach(line => {
        const match = line.match(/[\d.]+$/);
        if (match) {
          const value = parseFloat(match[0]);
          expect(value).toBeGreaterThanOrEqual(0);
          expect(isNaN(value)).toBe(false);
        }
      });
    });
  });

  describe('Metrics Performance', () => {
    it('should respond quickly to metrics requests', async () => {
      const startTime = Date.now();
      await fetch('http://localhost:3000/api/metrics');
      const endTime = Date.now();

      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });

    it('should handle concurrent metrics requests', async () => {
      const requests = [];
      const numRequests = 5;

      for (let i = 0; i < numRequests; i++) {
        requests.push(fetch('http://localhost:3000/api/metrics'));
      }

      const responses = await Promise.all(requests);
      const successCount = responses.filter(r => r.ok).length;

      expect(successCount).toBe(numRequests);
    });

    it('should maintain metrics consistency under load', async () => {
      // Make multiple requests to generate metrics
      const requests = [];
      for (let i = 0; i < 10; i++) {
        requests.push(fetch('http://localhost:3000/api/health'));
      }
      await Promise.all(requests);

      // Wait for metrics to be collected
      await new Promise(resolve => setTimeout(resolve, 200));

      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      // Metrics should be consistent and not corrupted
      expect(metrics).not.toContain('NaN');
      expect(metrics).not.toContain('Infinity');
    });
  });

  describe('Metrics Integration with Health Checks', () => {
    it('should collect metrics during health checks', async () => {
      // Get metrics before health check
      const beforeResponse = await fetch('http://localhost:3000/api/metrics');
      const beforeMetrics = await beforeResponse.text();

      // Perform health check
      await fetch('http://localhost:3000/api/health');

      // Wait for metrics collection
      await new Promise(resolve => setTimeout(resolve, 100));

      // Get metrics after health check
      const afterResponse = await fetch('http://localhost:3000/api/metrics');
      const afterMetrics = await afterResponse.text();

      // Metrics should have been updated
      expect(beforeMetrics).not.toBe(afterMetrics);
    });

    it('should track health check performance', async () => {
      await fetch('http://localhost:3000/api/health');

      // Wait for metrics collection
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await fetch('http://localhost:3000/api/metrics');
      const metrics = await response.text();

      // Should contain metrics for the health endpoint
      expect(metrics).toMatch(/http_request_duration_seconds\{[^}]*route="\/api\/health"[^}]*\}/);
    });
  });
});