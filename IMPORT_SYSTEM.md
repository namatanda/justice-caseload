# Data Import System Documentation

## Overview

The Justice Caseload system uses a robust data import infrastructure that supports both asynchronous (queue-based) and synchronous processing methods for CSV files. This document explains the architecture, requirements, and troubleshooting steps.

## System Architecture

The import system consists of the following components:

1. **Web Frontend**: Handles file uploads, validation, and displays import progress
2. **API Layer**: Processes upload requests and manages the import workflow
3. **Background Processing**: Uses Redis + BullMQ for asynchronous job processing
4. **Database Layer**: Stores imported data using PostgreSQL + Prisma ORM

## Requirements

### Redis Connection

The system requires Redis for optimal performance:

- **Redis Server**: Required for background processing (default port: 6379)
- **Worker Initialization**: Workers must be initialized to process jobs in the queue

When Redis is unavailable, the system falls back to synchronous processing, which:
- Processes uploads immediately in the request handler
- May be slower for large files
- Lacks real-time progress updates

### Database Requirements

- PostgreSQL 15+ database
- Valid DATABASE_URL in the .env file
- Prisma migrations applied using `npx prisma migrate dev`

## Troubleshooting

### Upload Gets Stuck at "PENDING"

If your upload gets stuck with a "PENDING" status:

1. **Check Redis Connection**:
   - Verify Redis is running (the status indicator should show "Redis Connected")
   - Check Docker status: `docker ps | grep redis`

2. **Initialize Workers**:
   - If Redis is running but workers aren't processing jobs:
   - Send a POST request to `/api/workers/init` to initialize workers
   - This should be automatic, but can be done manually if needed

3. **System Status Indicators**:
   - The application includes status indicators for both database and Redis/workers
   - Use these indicators to diagnose connection issues

### Redis Connection Failures

If the system reports Redis connection failures:

1. **Check Docker**:
   - Ensure the Redis container is running: `docker ps | grep redis`
   - Restart if needed: `docker-compose restart redis`

2. **Port Conflicts**:
   - Redis uses port 6379 by default
   - Check for port conflicts: `netstat -an | grep 6379`

## Automatic Worker Initialization

The application automatically initializes workers on startup through:

1. `WorkerInitializer` component in the app layout
2. `/api/workers/init` endpoint for worker management
3. Periodic status checks and worker re-initialization

## Fallback Processing

When Redis is unavailable, the system automatically uses synchronous processing:

1. The upload component detects Redis unavailability
2. The API uses synchronous processing instead of queueing
3. Import still completes, but without background processing benefits

## Best Practices

1. **Always check system status indicators** before uploading large files
2. For production deployments, ensure Redis is configured with proper persistence
3. For large files, the async queue-based approach is strongly recommended
4. Monitor the terminal logs for detailed processing information