import { execSync } from 'child_process';
import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import { join } from 'path';

interface MigrationOptions {
  environment: 'development' | 'staging' | 'production';
  dryRun?: boolean;
  force?: boolean;
  backup?: boolean;
}

interface MigrationResult {
  success: boolean;
  backupFile?: string;
  migrationsApplied: string[];
  errors: string[];
  warnings: string[];
}

// Main migration runner
export async function runMigration(options: MigrationOptions): Promise<MigrationResult> {
  const { environment, dryRun = false, force = false, backup = true } = options;
  const result: MigrationResult = {
    success: false,
    migrationsApplied: [],
    errors: [],
    warnings: [],
  };
  
  console.log(`🚀 Running migration for ${environment} environment`);
  
  try {
    // Validate environment
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }
    
    // Check database connection
    console.log('🔍 Checking database connection...');
    await checkDatabaseConnection();
    console.log('✅ Database connection successful');
    
    // Create backup if requested and not dry run
    if (backup && !dryRun && environment === 'production') {
      console.log('💾 Creating database backup...');
      result.backupFile = await createDatabaseBackup();
      console.log(`✅ Backup created: ${result.backupFile}`);
    }
    
    if (dryRun) {
      console.log('🔍 DRY RUN - Analyzing pending migrations...');
      const pendingMigrations = await getPendingMigrations();
      result.migrationsApplied = pendingMigrations;
      console.log(`📋 Found ${pendingMigrations.length} pending migrations:`);
      pendingMigrations.forEach(migration => console.log(`   - ${migration}`));
      result.success = true;
      return result;
    }
    
    // Generate Prisma client
    console.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Run database migrations
    console.log('📦 Applying database migrations...');
    const migrationOutput = execSync('npx prisma migrate deploy', { 
      stdio: 'pipe',
      encoding: 'utf-8' 
    });
    
    // Parse migration output
    const appliedMigrations = parseMigrationOutput(migrationOutput);
    result.migrationsApplied = appliedMigrations;
    
    if (appliedMigrations.length > 0) {
      console.log(`✅ Applied ${appliedMigrations.length} migrations:`);
      appliedMigrations.forEach(migration => console.log(`   - ${migration}`));
    } else {
      console.log('✅ No new migrations to apply');
    }
    
    // Run post-migration maintenance
    console.log('🔧 Running post-migration maintenance...');
    await runPostMigrationMaintenance();
    
    // Validate schema integrity
    console.log('🔍 Validating schema integrity...');
    await validateSchemaIntegrity();
    
    result.success = true;
    console.log('🎉 Migration completed successfully');
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    result.errors.push(errorMessage);
    console.error('❌ Migration failed:', errorMessage);
    
    // Attempt rollback if backup exists and in production
    if (result.backupFile && environment === 'production' && !force) {
      console.log('🔄 Attempting to restore from backup...');
      try {
        await restoreFromBackup(result.backupFile);
        result.warnings.push('Database restored from backup after migration failure');
        console.log('✅ Database restored from backup');
      } catch (rollbackError) {
        const rollbackMessage = rollbackError instanceof Error ? rollbackError.message : 'Unknown rollback error';
        result.errors.push(`Rollback failed: ${rollbackMessage}`);
        console.error('❌ Rollback failed:', rollbackMessage);
      }
    }
  }
  
  return result;
}

// Check database connection
async function checkDatabaseConnection(): Promise<void> {
  try {
    execSync('npx prisma db execute --stdin', {
      input: 'SELECT 1;',
      stdio: 'pipe',
    });
  } catch (error) {
    throw new Error('Failed to connect to database. Please check DATABASE_URL.');
  }
}

// Get pending migrations
async function getPendingMigrations(): Promise<string[]> {
  try {
    const output = execSync('npx prisma migrate status', { 
      stdio: 'pipe', 
      encoding: 'utf-8' 
    });
    
    // Parse the output to extract pending migrations
    const lines = output.split('\n');
    const pendingMigrations: string[] = [];
    
    let inPendingSection = false;
    for (const line of lines) {
      if (line.includes('Following migration(s) have not been applied yet:')) {
        inPendingSection = true;
        continue;
      }
      
      if (inPendingSection && line.trim().startsWith('- ')) {
        pendingMigrations.push(line.trim().substring(2));
      }
      
      if (inPendingSection && line.trim() === '') {
        break;
      }
    }
    
    return pendingMigrations;
  } catch (error) {
    // If command fails, assume no pending migrations
    return [];
  }
}

// Parse migration output to extract applied migrations
function parseMigrationOutput(output: string): string[] {
  const lines = output.split('\n');
  const appliedMigrations: string[] = [];
  
  for (const line of lines) {
    if (line.includes('Applied migration')) {
      const match = line.match(/Applied migration (\d+_\w+)/);
      if (match) {
        appliedMigrations.push(match[1]);
      }
    }
  }
  
  return appliedMigrations;
}

// Create database backup
async function createDatabaseBackup(): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = `backup_${timestamp}.sql`;
  const backupDir = join(process.cwd(), 'backups');
  
  // Ensure backup directory exists
  await fs.mkdir(backupDir, { recursive: true });
  
  const backupPath = join(backupDir, backupFile);
  
  try {
    // Create backup using pg_dump
    execSync(`pg_dump "${process.env.DATABASE_URL}" > "${backupPath}"`, {
      stdio: 'pipe',
    });
    
    // Verify backup file was created and has content
    const stats = await fs.stat(backupPath);
    if (stats.size === 0) {
      throw new Error('Backup file is empty');
    }
    
    // Calculate and store checksum
    const content = await fs.readFile(backupPath);
    const checksum = createHash('sha256').update(content).digest('hex');
    
    // Create metadata file
    const metadataPath = backupPath + '.meta';
    const metadata = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      databaseUrl: process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
      fileSize: stats.size,
      checksum,
    };
    
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    
    return backupPath;
  } catch (error) {
    throw new Error(`Failed to create database backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Restore from backup
async function restoreFromBackup(backupPath: string): Promise<void> {
  try {
    // Verify backup file exists
    await fs.access(backupPath);
    
    // Read and verify checksum if metadata exists
    const metadataPath = backupPath + '.meta';
    try {
      const metadataContent = await fs.readFile(metadataPath, 'utf-8');
      const metadata = JSON.parse(metadataContent);
      
      const content = await fs.readFile(backupPath);
      const checksum = createHash('sha256').update(content).digest('hex');
      
      if (checksum !== metadata.checksum) {
        throw new Error('Backup file checksum mismatch - file may be corrupted');
      }
    } catch (metaError) {
      console.warn('Could not verify backup checksum, proceeding anyway');
    }
    
    // Restore database
    console.log('⚠️  Dropping existing database and restoring from backup...');
    execSync(`psql "${process.env.DATABASE_URL}" < "${backupPath}"`, {
      stdio: 'pipe',
    });
    
  } catch (error) {
    throw new Error(`Failed to restore from backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Post-migration maintenance
async function runPostMigrationMaintenance(): Promise<void> {
  try {
    // Update computed fields
    await updateComputedFields();
    
    // Refresh materialized views if any
    await refreshMaterializedViews();
    
    // Update table statistics
    await updateTableStatistics();
    
    console.log('✅ Post-migration maintenance completed');
  } catch (error) {
    console.warn('⚠️  Post-migration maintenance failed:', error);
    // Don't throw error as this is not critical
  }
}

// Update computed fields
async function updateComputedFields(): Promise<void> {
  const queries = [
    // Update case age for all cases
    `UPDATE cases SET case_age_days = EXTRACT(DAY FROM NOW() - filed_date) WHERE case_age_days = 0;`,
    
    // Update total activities count
    `UPDATE cases SET total_activities = (
      SELECT COUNT(*) FROM case_activities WHERE case_activities.case_id = cases.id
    ) WHERE total_activities = 0;`,
    
    // Update last activity date
    `UPDATE cases SET last_activity_date = (
      SELECT MAX(activity_date) FROM case_activities WHERE case_activities.case_id = cases.id
    ) WHERE last_activity_date IS NULL;`,
  ];
  
  for (const query of queries) {
    execSync('npx prisma db execute --stdin', {
      input: query,
      stdio: 'pipe',
    });
  }
}

// Refresh materialized views (if any are added in the future)
async function refreshMaterializedViews(): Promise<void> {
  // Placeholder for future materialized views
  // Example: REFRESH MATERIALIZED VIEW case_statistics;
}

// Update table statistics
async function updateTableStatistics(): Promise<void> {
  const tables = ['cases', 'case_activities', 'judges', 'courts', 'case_types', 'daily_import_batches'];
  
  for (const table of tables) {
    execSync('npx prisma db execute --stdin', {
      input: `ANALYZE ${table};`,
      stdio: 'pipe',
    });
  }
}

// Validate schema integrity
async function validateSchemaIntegrity(): Promise<void> {
  try {
    // Check for any constraint violations
    const integrityQueries = [
      // Check foreign key constraints
      'SELECT COUNT(*) FROM cases WHERE case_type_id NOT IN (SELECT id FROM case_types);',
      'SELECT COUNT(*) FROM case_activities WHERE case_id NOT IN (SELECT id FROM cases);',
      'SELECT COUNT(*) FROM case_activities WHERE primary_judge_id NOT IN (SELECT id FROM judges);',
    ];
    
    for (const query of integrityQueries) {
      const result = execSync('npx prisma db execute --stdin', {
        input: query,
        stdio: 'pipe',
        encoding: 'utf-8',
      });
      
      // If any integrity check returns > 0, we have data integrity issues
      if (result.trim() !== '0') {
        console.warn(`⚠️  Data integrity warning: ${query}`);
      }
    }
  } catch (error) {
    console.warn('⚠️  Could not validate schema integrity:', error);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const environment = (args[0] as any) || 'development';
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force');
  const noBackup = args.includes('--no-backup');
  
  runMigration({
    environment,
    dryRun,
    force,
    backup: !noBackup,
  }).then(result => {
    if (!result.success) {
      console.error('Migration failed:', result.errors);
      process.exit(1);
    }
    console.log('Migration completed successfully');
    process.exit(0);
  }).catch(error => {
    console.error('Migration script error:', error);
    process.exit(1);
  });
}