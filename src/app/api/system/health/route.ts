import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

interface SystemCheck {
  name: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  message: string;
  details?: any;
}

export async function GET() {
  try {
    logger.health.info('Running pre-upload system health check');
    
    // Run basic health checks
    const checks: SystemCheck[] = await runBasicHealthChecks();
    
    const criticalIssues = checks.filter((check: SystemCheck) => check.status === 'FAIL');
    const warnings = checks.filter((check: SystemCheck) => check.status === 'WARN');
    const passed = checks.filter((check: SystemCheck) => check.status === 'PASS');
    
    const isHealthy = criticalIssues.length === 0;
    
    logger.health.info(`Health check complete: ${passed.length} passed, ${warnings.length} warnings, ${criticalIssues.length} critical`);
    
    return NextResponse.json({
      healthy: isHealthy,
      summary: {
        passed: passed.length,
        warnings: warnings.length,
        critical: criticalIssues.length
      },
      checks,
      recommendations: generateRecommendations(checks),
      timestamp: new Date().toISOString()
    }, { 
      status: isHealthy ? 200 : 503 // Service Unavailable if not healthy
    });
    
  } catch (error) {
    logger.health.error('Health check failed', error);
    
    return NextResponse.json({
      healthy: false,
      error: 'Health check system failure',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

async function runBasicHealthChecks(): Promise<SystemCheck[]> {
  const checks: SystemCheck[] = [];
  
  // Check database connection
  try {
    const { prisma } = await import('@/lib/database');
    const courtCount = await prisma.court.count();
    
    checks.push({
      name: 'Database Connection',
      status: 'PASS',
      message: `Connected successfully (${courtCount} courts found)`,
      details: { courtCount }
    });
  } catch (error) {
    checks.push({
      name: 'Database Connection',
      status: 'FAIL',
      message: 'Cannot connect to database',
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }
  
  // Check for failed migrations
  try {
    const { prisma } = await import('@/lib/database');
    const failedMigrations = await prisma.$queryRaw`
      SELECT migration_name, finished_at, logs 
      FROM _prisma_migrations 
      WHERE finished_at IS NULL OR logs LIKE '%error%' OR logs LIKE '%failed%'
      ORDER BY started_at DESC
      LIMIT 5
    ` as any[];
    
    // Filter out resolved migrations (those with logs showing errors but are actually completed)
    const actuallyFailedMigrations = failedMigrations.filter((m: any) => m.finished_at === null);
    
    checks.push({
      name: 'Database Migrations',
      status: actuallyFailedMigrations.length === 0 ? 'PASS' : 'FAIL',
      message: actuallyFailedMigrations.length === 0 
        ? 'All migrations completed successfully' 
        : `${actuallyFailedMigrations.length} incomplete migrations found`,
      details: { failedMigrations: actuallyFailedMigrations }
    });
  } catch (error) {
    checks.push({
      name: 'Database Migrations',
      status: 'WARN',
      message: 'Could not check migration status',
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }
  
  // Check basic data integrity
  try {
    const { prisma } = await import('@/lib/database');
    const [users, courts, batches] = await Promise.all([
      prisma.user.count(),
      prisma.court.count(),
      prisma.dailyImportBatch.count()
    ]);
    
    const hasBasicData = courts > 0;
    
    checks.push({
      name: 'Data Integrity',
      status: hasBasicData ? 'PASS' : 'WARN',
      message: hasBasicData 
        ? `Database contains reference data (${courts} courts, ${users} users, ${batches} batches)`
        : 'Database appears to be empty or recently reset',
      details: { users, courts, batches }
    });
  } catch (error) {
    checks.push({
      name: 'Data Integrity',
      status: 'FAIL',
      message: 'Could not check data integrity',
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }
  
  return checks;
}

function generateRecommendations(checks: any[]): string[] {
  const recommendations: string[] = [];
  
  checks.forEach(check => {
    if (check.status !== 'PASS') {
      switch (check.name) {
        case 'Port Conflicts':
          recommendations.push('Multiple processes detected on port 9002 - ensure only one development server is running');
          break;
        case 'Docker Containers':
          recommendations.push('Stop problematic Docker containers that may interfere with uploads');
          break;
        case 'Database Migrations':
          recommendations.push('Resolve failed database migrations before uploading data');
          break;
        case 'Background Processes':
          recommendations.push('Stop background processes that may cleanup or reset data');
          break;
        case 'Data Integrity':
          recommendations.push('Database appears empty - ensure proper seeding before uploads');
          break;
      }
    }
  });
  
  if (recommendations.length === 0) {
    recommendations.push('System appears healthy - ready for uploads');
  }
  
  return recommendations;
}