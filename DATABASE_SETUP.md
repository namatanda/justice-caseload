# Justice Caseload Management System - Database Setup

## Overview

This document provides comprehensive setup instructions for the Justice Caseload Management System database schema. The system is built with PostgreSQL, Prisma ORM, and includes advanced features for CSV data import, analytics, and performance monitoring.

## Technology Stack

- **Database**: PostgreSQL 15+
- **ORM**: Prisma 5.x
- **Validation**: Zod 3.24.2
- **Queue System**: BullMQ with Redis
- **File Processing**: CSV-parser and fast-csv
- **Testing**: Vitest
- **Caching**: Redis with ioredis client

## Prerequisites

Before setting up the database, ensure you have:

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (v15 or higher) - [Download](https://www.postgresql.org/download/)
3. **Redis** (v6 or higher) - [Download](https://redis.io/download)
4. **Git** for version control

## Initial Setup

### 1. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/justice_caseload"

# Redis Configuration (for queue processing)
REDIS_URL="redis://localhost:6379"

# Application Configuration
NODE_ENV="development"
LOG_LEVEL="info"

# File Upload Configuration
MAX_FILE_SIZE="10485760" # 10MB
UPLOAD_DIR="./uploads"

# Queue Configuration
QUEUE_CONCURRENCY="5"
QUEUE_RETRY_ATTEMPTS="3"
```

### 2. Install Dependencies

Install all required dependencies:

```bash
npm install
```

#### Troubleshooting Package Installation

If you encounter npm errors about missing packages, note that:

1. **@types/csv-parser** - This package doesn't exist on npm. We've created custom type declarations in `src/types/csv-parser.d.ts`
2. **Custom Type Declarations** - The project includes custom TypeScript declarations for packages without official types
3. **Package Verification** - All dependencies have been verified to exist on npm registry

If you still have issues, try:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### 3. Database Setup

#### Create Database

Create the PostgreSQL database:

```sql
CREATE DATABASE justice_caseload;
CREATE USER justice_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE justice_caseload TO justice_user;
```

#### Enable Required Extensions

Connect to your database and enable required PostgreSQL extensions:

```sql
-- Connect to the justice_caseload database
\c justice_caseload

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
```

### 4. Run Database Migrations

Deploy the database schema:

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Alternative: Use the migration script
npx tsx scripts/migrate.ts development
```

### 5. Seed Sample Data (Optional)

Populate the database with sample data for development:

```bash
npm run db:seed

# Alternative: Use the seed script directly
npx tsx prisma/seed.ts
```

## Database Schema Overview

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `users` | System users and authentication | Role-based access control |
| `courts` | Court master data | Support for different court types |
| `judges` | Judge master data | Name normalization and deduplication |
| `case_types` | Case type classifications | Flexible categorization system |
| `cases` | Primary case records | JSONB parties data, status tracking |
| `case_activities` | Court proceedings/activities | Comprehensive activity logging |
| `case_judge_assignments` | Case-judge relationships | Support for multiple judges per case |
| `daily_import_batches` | CSV import audit trail | Error tracking and batch processing |

### Key Features

#### 1. JSONB Support
Cases store party information in JSONB format for flexibility:

```json
{
  "applicants": {
    "maleCount": 1,
    "femaleCount": 1,
    "organizationCount": 0
  },
  "defendants": {
    "maleCount": 0,
    "femaleCount": 1,
    "organizationCount": 1
  }
}
```

#### 2. Comprehensive Indexing

The schema includes optimized indexes for:
- Common query patterns
- Full-text search capabilities
- Analytics queries
- Performance optimization

#### 3. Data Integrity

- Foreign key constraints
- Check constraints for data validation
- Enum types for controlled values
- UUID primary keys for security

## CSV Import System

### CSV Format

The system expects CSV files with the following structure:

```csv
date_dd,date_mon,date_yyyy,caseid_type,caseid_no,filed_dd,filed_mon,filed_yyyy,court,case_type,judge_1,comingfor,outcome,male_applicant,female_applicant,organization_applicant,male_defendant,female_defendant,organization_defendant,legalrep,applicant_witness,defendant_witness,custody,other_details
```

### Import Process

1. **File Upload**: Validate file format and size
2. **Queue Processing**: Background processing with BullMQ
3. **Data Validation**: Zod schema validation for each row
4. **Master Data Extraction**: Automatic creation of courts, judges, and case types
5. **Case Creation**: Create or update case records
6. **Activity Logging**: Record all case activities
7. **Error Handling**: Comprehensive error logging and reporting

### Usage Example

```typescript
import { initiateDailyImport } from '@/lib/import';

const result = await initiateDailyImport(
  '/path/to/file.csv',
  'daily_returns_2024.csv',
  1024000,
  'user-id'
);

console.log(`Import initiated: ${result.batchId}`);
```

## Analytics and Reporting

### Dashboard Analytics

The system provides comprehensive analytics:

```typescript
import { getDashboardAnalytics } from '@/lib/analytics';

const analytics = await getDashboardAnalytics({
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
  status: 'ACTIVE'
});
```

### Performance Metrics

Monitor system performance:

```typescript
import { getDatabasePerformanceReport } from '@/lib/database';

const report = await getDatabasePerformanceReport();
console.log('Slow queries:', report.slowQueries);
console.log('Index usage:', report.indexUsage);
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run specific test files
npm test -- schema.test.ts
```

### Test Database

Tests automatically create isolated test databases to avoid conflicts with development data.

## Backup and Recovery

### Create Backup

```bash
# Using npm script
npm run backup:create

# Using backup script directly
npx tsx scripts/backup.ts create --compress --keep=30
```

### Restore from Backup

```bash
# List available backups
npx tsx scripts/backup.ts list

# Restore from backup
npx tsx scripts/backup.ts restore /path/to/backup.sql.gz --force
```

### Automated Backups

Set up automated backups using cron:

```bash
# Add to crontab for daily backups at 2 AM
0 2 * * * cd /path/to/project && npm run backup:create
```

## Performance Optimization

### Database Maintenance

Regular maintenance tasks:

```bash
# Run database maintenance
npx tsx scripts/maintain.ts

# Vacuum tables
npx tsx scripts/backup.ts vacuum

# Update statistics
npx tsx scripts/backup.ts analyze
```

### Query Optimization

1. **Use Indexes**: Leverage the comprehensive indexing strategy
2. **Pagination**: Always use cursor-based pagination for large datasets
3. **Caching**: Utilize Redis caching for frequently accessed data
4. **Connection Pooling**: Configure appropriate connection pools

### Monitoring

Monitor database performance:

```typescript
import { getSlowQueries, getIndexUsage } from '@/lib/database';

// Check for slow queries
const slowQueries = await getSlowQueries(10);

// Monitor index usage
const indexStats = await getIndexUsage();
```

## Production Deployment

### Environment Setup

1. **Database Configuration**:
   - Use connection pooling (PgBouncer recommended)
   - Configure appropriate `max_connections`
   - Enable query logging for monitoring

2. **Redis Configuration**:
   - Configure persistence
   - Set up memory limits
   - Enable clustering if needed

3. **Security**:
   - Use SSL connections
   - Implement proper firewall rules
   - Regular security updates

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database created and accessible
- [ ] Redis server running
- [ ] SSL certificates installed
- [ ] Backup strategy implemented
- [ ] Monitoring systems configured
- [ ] Performance baseline established

## Troubleshooting

### Common Issues

#### 1. Connection Issues

```bash
# Test database connection
npx prisma db execute --stdin <<< "SELECT 1;"

# Check Redis connection
redis-cli ping
```

#### 2. Migration Issues

```bash
# Reset database (development only)
npx prisma migrate reset

# Force migration deployment
npx tsx scripts/migrate.ts production --force
```

#### 3. Performance Issues

```bash
# Check slow queries
npx tsx scripts/performance.ts slow-queries

# Analyze table statistics
npx tsx scripts/performance.ts analyze
```

### Getting Help

1. Check the application logs
2. Review database logs
3. Monitor system resources
4. Check Redis queue status

## API Reference

### Core Operations

```typescript
// Case management
import { 
  createCase, 
  getCaseById, 
  updateCaseStatus 
} from '@/lib/operations/case-crud';

// Master data
import { 
  createJudge, 
  createCourt, 
  createCaseType 
} from '@/lib/operations/master-data-crud';

// Analytics
import { 
  getDashboardAnalytics, 
  getJudgeWorkload 
} from '@/lib/analytics';

// Import processing
import { 
  initiateDailyImport, 
  getImportStatus 
} from '@/lib/import';
```

## Contributing

When making changes to the database schema:

1. Create a new migration: `npx prisma migrate dev --name description`
2. Update the documentation
3. Add appropriate tests
4. Update the seed data if necessary
5. Test with sample CSV data

## Support

For technical support or questions:

1. Check this documentation
2. Review the code comments
3. Run the test suite
4. Check application logs

## License

This project is part of the Justice Caseload Management System and follows the established licensing terms.