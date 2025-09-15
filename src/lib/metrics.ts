import { Registry, collectDefaultMetrics, Counter, Gauge, Histogram } from 'prom-client';

// Create a Registry which registers the metrics
export const registerMetrics = new Registry();

// Enable the collection of default metrics
collectDefaultMetrics({ register: registerMetrics });

// HTTP Request Metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  registers: [registerMetrics],
});

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [registerMetrics],
});

// Database Operation Metrics
export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
  registers: [registerMetrics],
});

export const dbQueriesTotal = new Counter({
  name: 'db_queries_total',
  help: 'Total number of database queries',
  labelNames: ['operation', 'table', 'status'],
  registers: [registerMetrics],
});

// Redis Operation Metrics
export const redisOperationDuration = new Histogram({
  name: 'redis_operation_duration_seconds',
  help: 'Duration of Redis operations in seconds',
  labelNames: ['operation', 'key'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1],
  registers: [registerMetrics],
});

export const redisOperationsTotal = new Counter({
  name: 'redis_operations_total',
  help: 'Total number of Redis operations',
  labelNames: ['operation', 'status'],
  registers: [registerMetrics],
});

// Queue Processing Metrics
export const queueJobDuration = new Histogram({
  name: 'queue_job_duration_seconds',
  help: 'Duration of queue job processing in seconds',
  labelNames: ['queue_name', 'job_type'],
  buckets: [0.1, 0.5, 1, 5, 10, 30],
  registers: [registerMetrics],
});

export const queueJobsTotal = new Counter({
  name: 'queue_jobs_total',
  help: 'Total number of queue jobs processed',
  labelNames: ['queue_name', 'job_type', 'status'],
  registers: [registerMetrics],
});

export const queueJobsActive = new Gauge({
  name: 'queue_jobs_active',
  help: 'Number of active jobs in queue',
  labelNames: ['queue_name'],
  registers: [registerMetrics],
});

// System Resource Metrics
export const systemMemoryUsage = new Gauge({
  name: 'system_memory_usage_bytes',
  help: 'System memory usage in bytes',
  labelNames: ['type'],
  registers: [registerMetrics],
});

export const systemCpuUsage = new Gauge({
  name: 'system_cpu_usage_percent',
  help: 'System CPU usage percentage',
  registers: [registerMetrics],
});

// Custom Business Metrics
export const casesProcessedTotal = new Counter({
  name: 'cases_processed_total',
  help: 'Total number of cases processed',
  labelNames: ['status', 'court'],
  registers: [registerMetrics],
});

export const importBatchesTotal = new Counter({
  name: 'import_batches_total',
  help: 'Total number of import batches',
  labelNames: ['status'],
  registers: [registerMetrics],
});

export const activeUsers = new Gauge({
  name: 'active_users',
  help: 'Number of active users',
  registers: [registerMetrics],
});

// Function to get metrics as string
export async function getMetrics(): Promise<string> {
  return registerMetrics.metrics();
}