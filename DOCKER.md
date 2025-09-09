# Docker Setup for Justice Caseload Management System

This document provides instructions for running the Justice Caseload Management System using Docker for easier deployment and development.

## Prerequisites

1. **Docker** - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. **Docker Compose** - Included with Docker Desktop

## Quick Start

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd justice-caseload
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your settings. For Docker, you can use:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://justice_user:justice_password@database:5432/justice_caseload"
   
   # Redis Configuration
   REDIS_URL="redis://redis:6379"
   
   # Application Configuration
   NODE_ENV="development"
   ```

3. **Start the Application**:
   ```bash
   docker-compose up --build
   ```

4. **Access the Application**:
   - Application: http://localhost:3000
   - Database: localhost:5432
   - Redis: localhost:6379

## Services Overview

The Docker Compose setup includes:

- **app**: The Next.js application
- **database**: PostgreSQL 15 database
- **redis**: Redis server for caching and queues

## Docker Commands

### Start Services
```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Start with rebuild
docker-compose up --build
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs app
docker-compose logs database
docker-compose logs redis
```

### Execute Commands
```bash
# Run commands in the app container
docker-compose exec app npm run db:seed
docker-compose exec app npm test
docker-compose exec app npm run validate

# Access the database
docker-compose exec database psql -U justice_user -d justice_caseload
```

## Environment Variables

The Docker setup uses the following environment variables:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| DATABASE_URL | postgresql://justice_user:justice_password@database:5432/justice_caseload | PostgreSQL connection string |
| REDIS_URL | redis://redis:6379 | Redis connection string |
| NODE_ENV | development | Node.js environment |

## Data Persistence

Data is persisted using Docker volumes:

- **postgres_data**: PostgreSQL data
- **redis_data**: Redis data

To reset all data:
```bash
docker-compose down -v
```

## Development Workflow

1. **Make code changes** - Files are mounted into the container for hot reloading
2. **Run tests**:
   ```bash
   docker-compose exec app npm test
   ```
3. **Run migrations**:
   ```bash
   docker-compose exec app npm run db:migrate
   ```
4. **Seed database**:
   ```bash
   docker-compose exec app npm run db:seed
   ```

## Production Deployment

For production deployment, update the `.env` file:

```env
NODE_ENV="production"
# Use strong passwords in production
DATABASE_URL="postgresql://justice_user:STRONG_PASSWORD@database:5432/justice_caseload"
```

And consider using a reverse proxy like Nginx for SSL termination.

## Troubleshooting

### Common Issues

1. **Port already in use**:
   - Stop conflicting services or change ports in `docker-compose.yml`

2. **Database connection failed**:
   - Ensure all services are running: `docker-compose ps`
   - Check database logs: `docker-compose logs database`

3. **Permission errors**:
   - Ensure Docker has necessary file system permissions

4. **Build failures**:
   - Clear Docker cache: `docker builder prune`
   - Rebuild: `docker-compose up --build --force-recreate`

### Useful Commands

```bash
# List running containers
docker-compose ps

# View resource usage
docker stats

# Check container health
docker-compose ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Remove unused containers and images
docker system prune -a
```

# DROP DATABASE
docker exec -it justice-caseload-database-1 psql -h localhost -p 5432 -U fiend -d postgres -c "DROP DATABASE IF EXISTS caseload;"
# CREATE DATABASE
docker exec -it justice-caseload-database-1 psql -h localhost -p 5432 -U fiend -d postgres -c "CREATE DATABASE caseload;"
docker-compose restart database

npx prisma db pull

npx prisma validate
npx prisma migrate reset
npx prisma migrate reset --force
npx prisma migrate dev --name remove_original_court_relation 
#
Remove-Item -Recurse -Force node_modules\.prisma\client -ErrorAction SilentlyContinue
npx prisma migrate dev --name init-fresh-schema 
npx prisma generate --schema=prisma/schema.test.prisma 

# npx tsc --noEmit --skipLibCheck src/lib/csv/batch-service.ts