import { execSync } from 'child_process';
import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import { join, basename } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createGzip, createGunzip } from 'zlib';

interface BackupOptions {
  compress?: boolean;
  includeLogs?: boolean;
  maxBackups?: number;
  encryptionKey?: string;
  remotePath?: string;
}

interface BackupMetadata {
  timestamp: string;
  environment: string;
  databaseUrl: string;
  fileSize: number;
  checksum: string;
  compressed: boolean;
  schema_version?: string;
  tables: Array<{
    name: string;
    rowCount: number;
  }>;
}

interface RestoreOptions {
  force?: boolean;
  skipIntegrityCheck?: boolean;
  targetDatabase?: string;
}

interface BackupInfo {
  filename: string;
  path: string;
  size: number;
  created: Date;
  metadata: BackupMetadata;
  isValid: boolean;
}

// Backup manager class
export class BackupManager {
  private backupDir: string;
  
  constructor(backupDir: string = join(process.cwd(), 'backups')) {
    this.backupDir = backupDir;
  }
  
  // Create a database backup
  async createBackup(options: BackupOptions = {}): Promise<string> {
    const {
      compress = true,
      includeLogs = false,
      maxBackups = 30,
    } = options;
    
    console.log('🚀 Starting database backup...');
    
    // Ensure backup directory exists
    await fs.mkdir(this.backupDir, { recursive: true });
    
    // Generate backup filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseFilename = `backup_${timestamp}`;
    const sqlFilename = `${baseFilename}.sql`;
    const finalFilename = compress ? `${sqlFilename}.gz` : sqlFilename;
    const backupPath = join(this.backupDir, finalFilename);
    
    try {
      // Get table statistics before backup
      const tableStats = await this.getTableStatistics();
      
      // Create SQL dump
      console.log('📦 Creating SQL dump...');
      const dumpPath = join(this.backupDir, sqlFilename);
      
      // Build pg_dump command with options
      let dumpCommand = `pg_dump "${process.env.DATABASE_URL}"`;
      
      // Add specific options
      dumpCommand += ' --verbose';
      dumpCommand += ' --no-password';
      dumpCommand += ' --format=plain';
      dumpCommand += ' --no-privileges';
      dumpCommand += ' --no-owner';
      
      if (!includeLogs) {
        dumpCommand += ' --exclude-table-data=audit_logs';
      }
      
      // Execute backup
      execSync(`${dumpCommand} > "${dumpPath}"`, {
        stdio: ['inherit', 'inherit', 'inherit'],
      });
      
      // Compress if requested
      if (compress) {
        console.log('🗜️  Compressing backup...');
        await this.compressFile(dumpPath, backupPath);
        
        // Remove uncompressed file
        await fs.unlink(dumpPath);
      } else {
        // Just rename to final path
        await fs.rename(dumpPath, backupPath);
      }
      
      // Calculate checksum and file size
      const stats = await fs.stat(backupPath);
      const content = await fs.readFile(backupPath);
      const checksum = createHash('sha256').update(content).digest('hex');
      
      // Create metadata
      const metadata: BackupMetadata = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'unknown',
        databaseUrl: this.sanitizeDatabaseUrl(process.env.DATABASE_URL || ''),
        fileSize: stats.size,
        checksum,
        compressed: compress,
        tables: tableStats,
      };
      
      // Save metadata
      const metadataPath = `${backupPath}.meta`;
      await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
      
      console.log(`✅ Backup created: ${finalFilename}`);
      console.log(`📊 Size: ${this.formatBytes(stats.size)}`);
      console.log(`🔢 Tables backed up: ${tableStats.length}`);
      
      // Cleanup old backups
      if (maxBackups > 0) {
        await this.cleanupOldBackups(maxBackups);
      }
      
      return backupPath;
    } catch (error) {
      console.error('❌ Backup failed:', error);
      
      // Cleanup failed backup files
      try {
        await fs.unlink(backupPath);
      } catch {}
      
      throw new Error(`Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Restore database from backup
  async restoreBackup(backupPath: string, options: RestoreOptions = {}): Promise<void> {
    const { force = false, skipIntegrityCheck = false, targetDatabase } = options;
    
    console.log(`🔄 Starting database restore from: ${basename(backupPath)}`);
    
    try {
      // Verify backup file exists
      await fs.access(backupPath);
      
      // Load and verify metadata
      const metadata = await this.loadBackupMetadata(backupPath);
      if (!skipIntegrityCheck) {
        await this.verifyBackupIntegrity(backupPath, metadata);
      }
      
      // Warning for production
      if (process.env.NODE_ENV === 'production' && !force) {
        throw new Error('Restore in production requires --force flag');
      }
      
      console.log('📋 Backup metadata:');
      console.log(`   Created: ${metadata.timestamp}`);
      console.log(`   Environment: ${metadata.environment}`);
      console.log(`   Size: ${this.formatBytes(metadata.fileSize)}`);
      console.log(`   Tables: ${metadata.tables.length}`);
      
      // Prepare restore command
      const databaseUrl = targetDatabase || process.env.DATABASE_URL;
      let restoreCommand: string;
      
      if (metadata.compressed) {
        // Decompress and restore in one command
        restoreCommand = `gunzip -c "${backupPath}" | psql "${databaseUrl}"`;
      } else {
        restoreCommand = `psql "${databaseUrl}" < "${backupPath}"`;
      }
      
      // Drop existing database content (if force)
      if (force) {
        console.log('⚠️  Dropping existing database content...');
        await this.dropDatabaseContent(databaseUrl);
      }
      
      // Execute restore
      console.log('📥 Restoring database...');
      execSync(restoreCommand, {
        stdio: ['inherit', 'inherit', 'inherit'],
      });
      
      // Verify restore
      if (!skipIntegrityCheck) {
        console.log('🔍 Verifying restore...');
        await this.verifyRestore(metadata);
      }
      
      // Run post-restore maintenance
      console.log('🔧 Running post-restore maintenance...');
      await this.runPostRestoreMaintenance();
      
      console.log('✅ Database restore completed successfully');
      
    } catch (error) {
      console.error('❌ Restore failed:', error);
      throw new Error(`Restore failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // List available backups
  async listBackups(): Promise<BackupInfo[]> {
    try {
      const files = await fs.readdir(this.backupDir);
      const backupFiles = files.filter(file => 
        (file.endsWith('.sql') || file.endsWith('.sql.gz')) && !file.endsWith('.meta')
      );
      
      const backups: BackupInfo[] = [];
      
      for (const filename of backupFiles) {
        try {
          const filepath = join(this.backupDir, filename);
          const stats = await fs.stat(filepath);
          
          // Try to load metadata
          let metadata: BackupMetadata | null = null;
          let isValid = true;
          
          try {
            metadata = await this.loadBackupMetadata(filepath);
            // Quick integrity check
            await this.verifyBackupIntegrity(filepath, metadata);
          } catch (error) {
            isValid = false;
            // Create minimal metadata
            metadata = {
              timestamp: stats.mtime.toISOString(),
              environment: 'unknown',
              databaseUrl: 'unknown',
              fileSize: stats.size,
              checksum: 'unknown',
              compressed: filename.endsWith('.gz'),
              tables: [],
            };
          }
          
          backups.push({
            filename,
            path: filepath,
            size: stats.size,
            created: stats.mtime,
            metadata,
            isValid,
          });
        } catch (error) {
          // Skip invalid files
          console.warn(`⚠️  Skipping invalid backup file: ${filename}`);
        }
      }
      
      // Sort by creation date (newest first)
      return backups.sort((a, b) => b.created.getTime() - a.created.getTime());
    } catch (error) {
      console.error('Error listing backups:', error);
      return [];
    }
  }
  
  // Cleanup old backups
  async cleanupOldBackups(keepCount: number): Promise<{ deleted: number; errors: string[] }> {
    const backups = await this.listBackups();
    const toDelete = backups.slice(keepCount);
    
    let deleted = 0;
    const errors: string[] = [];
    
    for (const backup of toDelete) {
      try {
        await fs.unlink(backup.path);
        
        // Also delete metadata file
        const metadataPath = `${backup.path}.meta`;
        try {
          await fs.unlink(metadataPath);
        } catch {
          // Metadata file might not exist
        }
        
        deleted++;
        console.log(`🗑️  Deleted old backup: ${backup.filename}`);
      } catch (error) {
        const errorMsg = `Failed to delete ${backup.filename}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }
    
    return { deleted, errors };
  }
  
  // Helper methods
  private async compressFile(inputPath: string, outputPath: string): Promise<void> {
    const readStream = createReadStream(inputPath);
    const writeStream = createWriteStream(outputPath);
    const gzipStream = createGzip();
    
    await pipeline(readStream, gzipStream, writeStream);
  }
  
  private async loadBackupMetadata(backupPath: string): Promise<BackupMetadata> {
    const metadataPath = `${backupPath}.meta`;
    
    try {
      const content = await fs.readFile(metadataPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to load backup metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  private async verifyBackupIntegrity(backupPath: string, metadata: BackupMetadata): Promise<void> {
    const content = await fs.readFile(backupPath);
    const checksum = createHash('sha256').update(content).digest('hex');
    
    if (checksum !== metadata.checksum) {
      throw new Error('Backup file checksum mismatch - file may be corrupted');
    }
  }
  
  private async getTableStatistics(): Promise<Array<{ name: string; rowCount: number }>> {
    try {
      const tables = ['users', 'courts', 'judges', 'case_types', 'cases', 'case_activities', 'case_judge_assignments', 'daily_import_batches'];
      const stats: Array<{ name: string; rowCount: number }> = [];
      
      for (const table of tables) {
        try {
          const result = execSync(`echo "SELECT COUNT(*) FROM ${table};" | psql "${process.env.DATABASE_URL}" -t`, {
            encoding: 'utf-8',
          });
          
          const rowCount = parseInt(result.trim()) || 0;
          stats.push({ name: table, rowCount });
        } catch (error) {
          // Table might not exist, skip it
          console.warn(`⚠️  Could not get stats for table ${table}`);
        }
      }
      
      return stats;
    } catch (error) {
      console.warn('⚠️  Could not collect table statistics');
      return [];
    }
  }
  
  private async dropDatabaseContent(databaseUrl: string): Promise<void> {
    const dropCommand = `psql "${databaseUrl}" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"`;
    execSync(dropCommand, { stdio: 'pipe' });
  }
  
  private async verifyRestore(metadata: BackupMetadata): Promise<void> {
    // Simple verification - check if main tables exist and have data
    const mainTables = ['users', 'cases', 'case_activities'];
    
    for (const table of mainTables) {
      try {
        const result = execSync(`echo "SELECT COUNT(*) FROM ${table};" | psql "${process.env.DATABASE_URL}" -t`, {
          encoding: 'utf-8',
        });
        
        const count = parseInt(result.trim()) || 0;
        console.log(`   ${table}: ${count} rows`);
      } catch (error) {
        throw new Error(`Verification failed: Table ${table} not accessible`);
      }
    }
  }
  
  private async runPostRestoreMaintenance(): Promise<void> {
    const maintenanceQueries = [
      'ANALYZE;',
      'VACUUM ANALYZE;',
      'REINDEX DATABASE ' + (new URL(process.env.DATABASE_URL!).pathname.substring(1)) + ';',
    ];
    
    for (const query of maintenanceQueries) {
      try {
        execSync(`echo "${query}" | psql "${process.env.DATABASE_URL}"`, { stdio: 'pipe' });
      } catch (error) {
        console.warn(`⚠️  Maintenance query failed: ${query}`);
      }
    }
  }
  
  private sanitizeDatabaseUrl(url: string): string {
    return url.replace(/\/\/.*@/, '//***:***@');
  }
  
  private formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// CLI interface
if (require.main === module) {
  const backupManager = new BackupManager();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  async function main() {
    try {
      switch (command) {
        case 'create':
          const backupPath = await backupManager.createBackup({
            compress: !args.includes('--no-compress'),
            includeLogs: args.includes('--include-logs'),
            maxBackups: parseInt(args.find(arg => arg.startsWith('--keep='))?.split('=')[1] || '30'),
          });
          console.log(`Backup created: ${backupPath}`);
          break;
          
        case 'restore':
          const restorePath = args[1];
          if (!restorePath) {
            throw new Error('Backup file path required for restore');
          }
          await backupManager.restoreBackup(restorePath, {
            force: args.includes('--force'),
            skipIntegrityCheck: args.includes('--skip-check'),
          });
          break;
          
        case 'list':
          const backups = await backupManager.listBackups();
          console.log('Available backups:');
          backups.forEach(backup => {
            const status = backup.isValid ? '✅' : '❌';
            console.log(`${status} ${backup.filename} (${backupManager['formatBytes'](backup.size)}) - ${backup.created.toISOString()}`);
          });
          break;
          
        case 'cleanup':
          const keepCount = parseInt(args[1]) || 30;
          const result = await backupManager.cleanupOldBackups(keepCount);
          console.log(`Deleted ${result.deleted} old backups`);
          if (result.errors.length > 0) {
            console.error('Errors:', result.errors);
          }
          break;
          
        default:
          console.log(`
Usage: ts-node scripts/backup.ts <command> [options]

Commands:
  create              Create a new backup
  restore <file>      Restore from backup file
  list                List available backups
  cleanup [count]     Keep only the specified number of recent backups (default: 30)

Options:
  --no-compress       Don't compress backup files
  --include-logs      Include log tables in backup
  --keep=N            Keep N most recent backups during create (default: 30)
  --force             Force restore without confirmation
  --skip-check        Skip integrity checks during restore
          `);
          break;
      }
    } catch (error) {
      console.error('❌ Command failed:', error);
      process.exit(1);
    }
  }
  
  main();
}