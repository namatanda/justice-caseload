# Infrastructure Enhancements Implementation Plan

This document outlines the implementation plan for enhancing the application's infrastructure with the following features:
1. Redis clustering implementation
2. Enhanced application health checks
3. Basic monitoring with Prometheus
4. Database connection pooling

## 1. Redis Clustering Implementation

### Current State
The application currently uses a single Redis instance for:
- Caching (`cacheManager`)
- Queue processing (`importQueue`, `analyticsQueue`)
- Session management (`sessionManager`)
- Rate limiting (`rateLimiter`)

### Proposed Solution
Implement Redis clustering with master-slave replication using Redis Sentinel for high availability.

#### Implementation Steps:
1. Create a new `redis-cluster.ts` module that extends the existing Redis functionality
2. Modify `src/lib/database/redis.ts` to support configurable Redis clustering
3. Update connection configuration to use Redis cluster client when enabled
4. Ensure all existing Redis functionality works with both single instance and cluster modes
5. Add cluster health check functionality

#### Technical Details:
- Use `ioredis` cluster functionality with Sentinel support
- Configure multiple Redis nodes (master-slave setup)
- Implement automatic failover handling
- Update connection pooling settings
- Add environment variables for cluster configuration:
  - `REDIS_CLUSTER_ENABLED` - Enable/disable clustering
  - `REDIS_SENTINEL_HOSTS` - Comma-separated list of sentinel hosts
  - `REDIS_MASTER_NAME` - Name of the master node

#### Code Structure:
```typescript
// New file: src/lib/database/redis-cluster.ts
import { Cluster } from 'ioredis';
import { RedisOptions } from 'ioredis';

// Configuration
const clusterConfig: RedisOptions = {
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  lazyConnect: true,
};

// Create cluster instance
export const redisCluster = new Cluster([
  { host: 'redis-node-1', port: 6379 },
  { host: 'redis-node-2', port: 6379 },
 { host: 'redis-node-3', port: 6379 },
], clusterConfig);

// Cluster-aware versions of existing functionality
export const clusterCacheManager = new CacheManager(redisCluster);
export const clusterImportQueue = new Queue('csv-import', { connection: redisCluster });
export const clusterAnalyticsQueue = new Queue('analytics', { connection: redisCluster });
```

## 2. Enhanced Application Health Checks

### Current State
The application has basic health checks at:
- `/api/health` - Basic service health
- `/api/system/health` - System-level checks

### Proposed Solution
Enhance health checks with more detailed metrics and structured responses.

#### Implementation Steps:
1. Extend existing health check endpoints with more detailed information
2. Add specific health checks for:
   - Database connection pool status
   - Redis cluster status
   - Queue processing status
   - Memory usage
   - Disk space (if applicable)
3. Implement health check caching to prevent excessive resource usage
4. Add detailed metrics to health responses

#### Technical Details:
- Add latency metrics to existing checks
- Implement circuit breaker pattern for external dependencies
- Add detailed error information for troubleshooting
- Standardize response format across all health endpoints
- Add new endpoint `/api/health/detailed` for comprehensive health information

#### Enhanced Health Check Response:
```typescript
{
  "timestamp": "2023-01-01T0:00:00.000Z",
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 3600,
  "services": {
    "database": {
      "status": "healthy",
      "latency": 5,
      "pool": {
        "used": 5,
        "available": 15,
        "max": 20
      },
      "error": null
    },
    "redis": {
      "status": "healthy",
      "latency": 2,
      "mode": "cluster",
      "nodes": 3,
      "error": null
    },
    "queues": {
      "import": {
        "status": "healthy",
        "waiting": 0,
        "active": 2,
        "completed": 100
      },
      "analytics": {
        "status": "healthy",
        "waiting": 5,
        "active": 0,
        "completed": 50
      }
    }
  },
  "system": {
    "memory": {
      "used": "128MB",
      "total": "512MB",
      "percentage": 25
    },
    "cpu": {
      "usage": 15
    }
  }
}
```

## 3. Basic Monitoring with Prometheus

### Current State
No built-in monitoring or metrics collection.

### Proposed Solution
Implement Prometheus metrics collection endpoint with basic application metrics.

#### Implementation Steps:
1. Add Prometheus metrics collection library (`prom-client`)
2. Create `/metrics` endpoint for Prometheus scraping
3. Implement basic metrics:
   - HTTP request latency and count
   - Database query performance
   - Redis operation performance
   - Queue processing metrics
   - Memory and CPU usage
4. Add custom business metrics

#### Technical Details:
- Use `prom-client` library for metrics collection
- Implement metrics middleware for automatic collection
- Add metrics for all major application components
- Ensure metrics endpoint is secured in production

#### Key Metrics to Collect:
- HTTP request duration histogram
- HTTP request count by status code
- Database query duration histogram
- Redis operation duration histogram
- Active queue job gauge
- Memory usage gauge
- CPU usage gauge
- Custom business metrics (e.g., import success/failure count)

#### Implementation Example:
```typescript
// metrics.ts
import client from 'prom-client';

// Create metrics
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

export const databaseQueryDuration = new client.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
});

// Middleware to collect metrics
export function metricsMiddleware(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.observe({
      method: req.method,
      route: req.path,
      status_code: res.statusCode
    }, duration);
  });
  
  next();
}
```

## 4. Database Connection Pooling

### Current State
Prisma manages database connections internally with its own connection pooling.

### Proposed Solution
Enhance database connection pooling configuration and add monitoring.

#### Implementation Steps:
1. Configure Prisma connection pool settings via environment variables
2. Add connection pool monitoring and metrics
3. Implement connection pool health checks
4. Add connection pool configuration documentation

#### Technical Details:
- Configure `connection_limit` in database URL
- Add pool statistics to health checks
- Implement connection timeout and retry logic
- Monitor pool performance and resource usage

#### Environment Variables:
- `DATABASE_CONNECTION_LIMIT` - Maximum number of database connections
- `DATABASE_TIMEOUT` - Connection timeout in milliseconds
- `DATABASE_RETRY_ATTEMPTS` - Number of retry attempts for failed connections

#### Database URL Configuration:
```
postgresql://user:password@host:port/database?connection_limit=20&pool_timeout=10
```

#### Health Check Integration:
```typescript
// Enhanced database health check
export async function checkDatabaseConnection(): Promise<DatabaseHealth> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;
    
    // Get pool statistics (if available)
    const poolStats = {
      used: 5, // Example value
      available: 15, // Example value
      max: 20 // Example value
    };
    
    return {
      status: 'healthy',
      latency,
      pool: poolStats,
      error: null
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      latency: Date.now() - start,
      pool: null,
      error: error instanceof Error ? error.message : 'Unknown database error'
    };
  }
}
```

## Implementation Architecture

```mermaid
graph TD
    A[Application] --> B[Health Check Endpoint]
    A --> C[Metrics Endpoint]
    A --> D[Database Connection Pool]
    A --> E[Redis Cluster]
    
    D --> F[(PostgreSQL Database)]
    E --> G[(Redis Master)]
    E --> H[(Redis Slave 1)]
    E --> I[(Redis Slave 2)]
    
    J[Prometheus] --> C
    K[Monitoring Dashboard] --> J
    L[Health Check Probes] --> B
```

## Docker Configuration Updates

### Current State
Docker Compose defines single instances of services.

### Proposed Solution
Update Docker configuration to support Redis clustering.

#### Implementation Steps:
1. Modify `docker-compose.prod.yml` to include Redis Sentinel
2. Add Redis replica services
3. Update application environment variables
4. Add Prometheus service

#### Updated Docker Compose Configuration:
```yaml
services:
  # Redis master node
  redis-master:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    
  # Redis slave nodes
  redis-slave-1:
    image: redis:7-alpine
    ports:
      - "6380:6379"
    command: redis-server --slaveof redis-master 6379
    
  redis-slave-2:
    image: redis:7-alpine
    ports:
      - "6381:6379"
    command: redis-server --slaveof redis-master 6379
    
  # Redis Sentinel
  redis-sentinel:
    image: redis:7-alpine
    ports:
      - "26379:26379"
    volumes:
      - ./redis-sentinel.conf:/etc/redis/sentinel.conf
    command: redis-sentinel /etc/redis/sentinel.conf
    
  # Prometheus monitoring
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    
  # Application
  app:
    # ... existing configuration
    environment:
      REDIS_CLUSTER_ENABLED: "true"
      REDIS_SENTINEL_HOSTS: "redis-sentinel:26379"
      REDIS_MASTER_NAME: "mymaster"
      DATABASE_CONNECTION_LIMIT: "20"
```

## Testing Strategy

1. Unit tests for new health check functions
2. Integration tests for Redis clustering
3. Performance tests for connection pooling
4. End-to-end tests for monitoring metrics
5. Failover tests for Redis cluster

## Deployment Considerations

1. Backward compatibility with existing single Redis setup
2. Environment-specific configurations
3. Migration path from single Redis to cluster
4. Monitoring and alerting setup

## Rollback Plan

1. Maintain compatibility with single Redis instance
2. Configurable feature flags
3. Database migration rollback procedures
4. Health check fallback mechanisms

## Next Steps

To implement these features, we recommend switching to the Code mode where we can create the actual implementation files:
1. Create Redis clustering module
2. Enhance health check endpoints
3. Implement Prometheus metrics collection
4. Update database connection pooling
5. Modify Docker configurations