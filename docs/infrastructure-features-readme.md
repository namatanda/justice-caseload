# Infrastructure Features Documentation

This document provides documentation for the enhanced infrastructure features implemented in the "enhanced-infrastructure" branch.

## Table of Contents
1. [Redis Clustering](#redis-clustering)
2. [Enhanced Health Checks](#enhanced-health-checks)
3. [Prometheus Monitoring](#prometheus-monitoring)
4. [Database Connection Pooling](#database-connection-pooling)
5. [Configuration](#configuration)
6. [Docker Setup](#docker-setup)
7. [Testing](#testing)

## Redis Clustering

The application now supports Redis clustering with master-slave replication and automatic failover using Redis Sentinel.

### Features
- High availability through master-slave replication
- Automatic failover with Redis Sentinel
- Backward compatibility with single Redis instance
- Cluster-aware queue processing

### Configuration
To enable Redis clustering, set the following environment variables:
```
REDIS_CLUSTER_ENABLED=true
REDIS_SENTINEL_HOSTS=redis-sentinel:26379
REDIS_MASTER_NAME=mymaster
```

When clustering is disabled, the application will use the existing single Redis instance configuration.

## Enhanced Health Checks

The health check endpoints have been enhanced with detailed metrics and system information.

### Endpoints
- `/api/health` - Basic health check (existing)
- `/api/system/health` - System-level health check (existing)
- `/api/health/detailed` - Comprehensive health check with detailed metrics (new)

### Detailed Health Check Response
```json
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

## Prometheus Monitoring

The application now exposes metrics for Prometheus monitoring.

### Endpoint
- `/metrics` - Prometheus metrics endpoint

### Key Metrics
- `http_request_duration_seconds` - HTTP request duration histogram
- `http_requests_total` - HTTP request count by status code
- `database_query_duration_seconds` - Database query duration histogram
- `redis_operation_duration_seconds` - Redis operation duration histogram
- `active_queue_jobs` - Active queue job gauge
- `memory_usage_bytes` - Memory usage gauge
- `cpu_usage_percentage` - CPU usage gauge

### Custom Business Metrics
- `csv_import_success_total` - Total successful CSV imports
- `csv_import_failure_total` - Total failed CSV imports
- `cases_processed_total` - Total cases processed

## Database Connection Pooling

Database connection pooling has been enhanced with configurable limits and monitoring.

### Configuration
Set the following environment variable to configure connection limits:
```
DATABASE_CONNECTION_LIMIT=20
DATABASE_TIMEOUT=10000
```

### Health Check Integration
The detailed health check now includes database connection pool statistics:
```json
"database": {
  "status": "healthy",
  "latency": 5,
  "pool": {
    "used": 5,
    "available": 15,
    "max": 20
  },
  "error": null
}
```

## Configuration

### Environment Variables

#### Redis Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_CLUSTER_ENABLED` | Enable Redis clustering | `false` |
| `REDIS_SENTINEL_HOSTS` | Comma-separated list of sentinel hosts | `""` |
| `REDIS_MASTER_NAME` | Name of the master node | `"mymaster"` |

#### Database Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_CONNECTION_LIMIT` | Maximum number of database connections | `10` |
| `DATABASE_TIMEOUT` | Connection timeout in milliseconds | `30000` |

## Docker Setup

The Docker configuration has been updated to support Redis clustering and Prometheus monitoring.

### Services
- `redis-master` - Redis master node
- `redis-slave-1` - Redis slave node
- `redis-slave-2` - Redis slave node
- `redis-sentinel` - Redis Sentinel for failover
- `prometheus` - Prometheus monitoring server
- `app` - Main application (updated with new environment variables)

### Usage
1. Build the services:
   ```bash
   docker-compose build
   ```

2. Start the services:
   ```bash
   docker-compose up
   ```

3. Access the application at `http://localhost:3000`
4. Access Prometheus at `http://localhost:9090`

## Testing

### Unit Tests
Run unit tests with:
```bash
npm run test
```

### Integration Tests
Run integration tests with:
```bash
npm run test:integration
```

### Performance Tests
Run performance tests with:
```bash
npm run test:performance
```

### Redis Cluster Tests
Special tests for Redis clustering can be run with:
```bash
npm run test:redis-cluster
```

## Monitoring and Alerting

### Prometheus Queries
Some useful Prometheus queries for monitoring:

1. HTTP error rate:
   ```
   rate(http_requests_total{status_code=~"5.."}[5m])
   ```

2. Database query latency (95th percentile):
   ```
   histogram_quantile(0.95, rate(database_query_duration_seconds_bucket[5m]))
   ```

3. Redis operation latency (99th percentile):
   ```
   histogram_quantile(0.99, rate(redis_operation_duration_seconds_bucket[5m]))
   ```

### Grafana Dashboard
A Grafana dashboard template is available in `docs/grafana-dashboard.json` for visualizing the metrics.

## Troubleshooting

### Common Issues

1. **Redis Cluster Not Connecting**
   - Verify `REDIS_CLUSTER_ENABLED` is set to `true`
   - Check that Redis Sentinel is running and accessible
   - Ensure `REDIS_SENTINEL_HOSTS` contains the correct addresses

2. **Database Connection Pool Exhausted**
   - Increase `DATABASE_CONNECTION_LIMIT`
   - Check for connection leaks in the application code
   - Monitor active connections via health checks

3. **Prometheus Metrics Not Available**
   - Verify the `/metrics` endpoint is accessible
   - Check that the application is not blocking the metrics endpoint
   - Ensure Prometheus can reach the application

### Logs
Check the application logs for detailed error information:
```bash
docker-compose logs app
```

## Rollback

To rollback to the previous version:
1. Switch to the main branch:
   ```bash
   git checkout main
   ```

2. Rebuild and restart services:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

All new environment variables have backward-compatible defaults, so the application will continue to work with the single Redis instance configuration.