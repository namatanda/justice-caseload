#!/usr/bin/env tsx

/**
 * System Integrity Monitor
 * 
 * This script monitors for common issues that could cause data loss:
 * 1. Conflicting processes (Docker vs local dev)
 * 2. Failed migrations
 * 3. Database connection inconsistencies
 * 4. Background cleanup processes
 */

import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { logger } from '@/lib/logger';

const prisma = new PrismaClient();

interface SystemCheck {
  name: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  message: string;
  details?: any;
}

async function runSystemIntegrityCheck(): Promise<SystemCheck[]> {
  const checks: SystemCheck[] = [];

  // 1. Check for multiple server processes
  try {
    const processes = execSync('netstat -an | findstr :9002', { encoding: 'utf8' });
    const processCount = processes.split('\n').filter(line => line.includes('LISTENING')).length;
    
    checks.push({
      name: 'Port Conflicts',
      status: processCount <= 1 ? 'PASS' : 'WARN',
      message: processCount <= 1 
        ? 'Single server process detected' 
        : `Multiple processes on port 9002 detected (${processCount})`,
      details: { processCount, processes: processes.split('\n').filter(Boolean) }
    });
  } catch (error) {
    checks.push({
      name: 'Port Conflicts',
      status: 'FAIL',
      message: 'Could not check port usage',
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }

  // 2. Check Docker container status
  try {
    const dockerPs = execSync('docker ps --filter "name=justice" --format "table {{.Names}}\\t{{.Status}}"', { encoding: 'utf8' });
    const containers = dockerPs.split('\n').slice(1).filter(Boolean);
    
    const problematic = containers.filter(container => 
      container.includes('Restarting') || container.includes('Exited')
    );

    checks.push({
      name: 'Docker Containers',
      status: problematic.length === 0 ? 'PASS' : 'WARN',
      message: problematic.length === 0 
        ? 'All Docker containers healthy' 
        : `${problematic.length} problematic containers detected`,
      details: { containers, problematic }
    });
  } catch (error) {
    checks.push({
      name: 'Docker Containers',
      status: 'WARN',
      message: 'Could not check Docker status (Docker may not be running)',
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }

  // 3. Check migration status
  try {
    const migrations = await prisma.$queryRaw`
      SELECT migration_name, finished_at, logs 
      FROM _prisma_migrations 
      WHERE finished_at IS NULL OR logs LIKE '%error%' OR logs LIKE '%failed%'
      ORDER BY started_at DESC 
      LIMIT 5
    ` as any[];

    checks.push({
      name: 'Database Migrations',
      status: migrations.length === 0 ? 'PASS' : 'FAIL',
      message: migrations.length === 0 
        ? 'All migrations completed successfully' 
        : `${migrations.length} failed/incomplete migrations found`,
      details: { failedMigrations: migrations }
    });
  } catch (error) {
    checks.push({
      name: 'Database Migrations',
      status: 'FAIL',
      message: 'Could not check migration status',
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }

  // 4. Check database connection consistency
  try {
    const dbInfo = await prisma.$queryRaw`
      SELECT current_database(), current_user, version()
    ` as any[];

    const expectedDb = process.env.DATABASE_URL?.includes('/caseload') ? 'caseload' : 'unknown';
    const actualDb = dbInfo[0]?.current_database;

    checks.push({
      name: 'Database Connection',
      status: actualDb === expectedDb ? 'PASS' : 'WARN',
      message: actualDb === expectedDb 
        ? `Connected to correct database: ${actualDb}`
        : `Database mismatch: expected ${expectedDb}, got ${actualDb}`,
      details: { 
        expected: expectedDb, 
        actual: actualDb,
        user: dbInfo[0]?.current_user,
        version: dbInfo[0]?.version 
      }
    });
  } catch (error) {
    checks.push({
      name: 'Database Connection',
      status: 'FAIL',
      message: 'Could not verify database connection',
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }

  // 5. Check for data integrity
  try {
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.court.count(),
      prisma.dailyImportBatch.count(),
      prisma.case.count(),
      prisma.caseActivity.count()
    ]);

    const [users, courts, batches, cases, activities] = counts;
    const hasBasicData = courts > 0; // Courts should always exist
    const hasUserData = users > 0 || batches > 0 || cases > 0 || activities > 0;

    checks.push({
      name: 'Data Integrity',
      status: hasBasicData ? 'PASS' : 'WARN',
      message: hasBasicData 
        ? `Database contains expected reference data (${courts} courts)`
        : 'Database appears to be empty or recently reset',
      details: { users, courts, batches, cases, activities, hasUserData }
    });
  } catch (error) {
    checks.push({
      name: 'Data Integrity',
      status: 'FAIL',
      message: 'Could not check data integrity',
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }

  // 6. Check for background processes that might cleanup data
  try {
    const backgroundJobs = execSync('wmic process where "name=\'node.exe\' or name=\'npx.exe\'" get commandline,processid /format:csv', { encoding: 'utf8' });
    const relevantJobs = backgroundJobs.split('\n')
      .filter(line => line.includes('prisma') || line.includes('migrate') || line.includes('reset'))
      .filter(Boolean);

    checks.push({
      name: 'Background Processes',
      status: relevantJobs.length === 0 ? 'PASS' : 'WARN',
      message: relevantJobs.length === 0 
        ? 'No suspicious background processes detected'
        : `${relevantJobs.length} potential cleanup processes detected`,
      details: { relevantJobs }
    });
  } catch (error) {
    checks.push({
      name: 'Background Processes',
      status: 'WARN',
      message: 'Could not check background processes',
      details: { error: error instanceof Error ? error.message : String(error) }
    });
  }

  return checks;
}

function formatCheckResults(checks: SystemCheck[]): void {
  logger.info('general', '\n🔍 System Integrity Check Results\n');
  // Remove console.log as it's mixed with logger

  const passed = checks.filter(c => c.status === 'PASS').length;
  const warned = checks.filter(c => c.status === 'WARN').length;
  const failed = checks.filter(c => c.status === 'FAIL').length;

  logger.info('general', `✅ Passed: ${passed} | ⚠️  Warnings: ${warned} | ❌ Failed: ${failed}\n`);

  checks.forEach(check => {
    const icon = check.status === 'PASS' ? '✅' : check.status === 'WARN' ? '⚠️' : '❌';
    logger.info('general', `${icon} ${check.name}: ${check.message}`);
    
    if (check.details && (check.status === 'WARN' || check.status === 'FAIL')) {
    // Remove console.log as it's mixed with logger
    }
  // Remove console.log as it's mixed with logger
  });

  // Overall assessment
  if (failed > 0) {
    logger.info('general', '🚨 CRITICAL: System has serious issues that need immediate attention!');
  } else if (warned > 0) {
    logger.import.warn(' WARNING: System has potential issues that should be investigated.');
  } else {
    logger.info('general', '🎉 SUCCESS: System appears healthy and ready for uploads.');
  }

  // Recommendations
  logger.info('general', '\n📋 Recommendations:');
  
  if (checks.find(c => c.name === 'Port Conflicts' && c.status !== 'PASS')) {
    logger.info('general', '   • Stop conflicting processes or use different ports');
  }
  
  if (checks.find(c => c.name === 'Docker Containers' && c.status !== 'PASS')) {
    logger.info('general', '   • Stop problematic Docker containers: docker stop justice_caseload_app');
  }
  
  if (checks.find(c => c.name === 'Database Migrations' && c.status !== 'PASS')) {
    logger.info('general', '   • Resolve failed migrations: npx prisma migrate resolve');
  }
  
  if (checks.find(c => c.name === 'Background Processes' && c.status !== 'PASS')) {
    logger.info('general', '   • Investigate and stop unnecessary background processes');
  }

  logger.info('general', '   • Run this check before important uploads');
  logger.info('general', '   • Consider adding this to your development workflow\n');
}

async function main() {
  try {
    logger.import.info('Running comprehensive system integrity check...\n');
    
    const checks = await runSystemIntegrityCheck();
    formatCheckResults(checks);
    
    // Exit with appropriate code
    const hasCritical = checks.some(c => c.status === 'FAIL');
    process.exit(hasCritical ? 1 : 0);
    
  } catch (error) {
    logger.import.error('System check failed', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { runSystemIntegrityCheck, formatCheckResults };