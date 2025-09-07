#!/usr/bin/env node

/**
 * Script to generate and apply the court_name migration for cases table
 * This script ensures proper handling of the schema change with data migration
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting court_name migration process...');

try {
  // Step 1: Generate Prisma migration
  console.log('📝 Generating Prisma migration...');
  execSync('npx prisma migrate dev --name add_court_name_to_cases --create-only', {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  // Step 2: Find the generated migration file
  const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations');
  const migrationFolders = fs.readdirSync(migrationsDir)
    .filter(folder => folder.includes('add_court_name_to_cases'))
    .sort()
    .reverse(); // Get the most recent one

  if (migrationFolders.length === 0) {
    throw new Error('No migration folder found');
  }

  const latestMigrationFolder = migrationFolders[0];
  const migrationFilePath = path.join(migrationsDir, latestMigrationFolder, 'migration.sql');

  console.log(`📁 Found migration file: ${migrationFilePath}`);

  // Step 3: Read our custom migration content
  const customMigrationPath = path.join(process.cwd(), 'prisma', 'migrations', 'add_court_name_to_cases', 'migration.sql');
  
  if (fs.existsSync(customMigrationPath)) {
    const customMigrationContent = fs.readFileSync(customMigrationPath, 'utf8');
    
    // Step 4: Replace the generated migration with our custom one
    fs.writeFileSync(migrationFilePath, customMigrationContent);
    console.log('✅ Updated migration file with custom content');
  } else {
    console.log('⚠️  Custom migration file not found, using Prisma-generated migration');
  }

  // Step 5: Apply the migration
  console.log('🔄 Applying migration...');
  execSync('npx prisma migrate dev', {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  // Step 6: Generate Prisma client
  console.log('🔧 Regenerating Prisma client...');
  execSync('npx prisma generate', {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('✅ Migration completed successfully!');
  console.log('');
  console.log('📋 Summary of changes:');
  console.log('  • Added court_name field to cases table');
  console.log('  • Populated court_name from existing court relationships');
  console.log('  • Updated unique constraint to (case_number, court_name)');
  console.log('  • Added performance indexes for court_name queries');
  console.log('');
  console.log('🔍 Next steps:');
  console.log('  • Update your application code to handle the new courtName field');
  console.log('  • Test case creation and querying functionality');
  console.log('  • Verify that duplicate case numbers across courts are now supported');

} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.error('');
  console.error('🔧 Troubleshooting:');
  console.error('  • Ensure your database is running and accessible');
  console.error('  • Check that no other migrations are pending');
  console.error('  • Verify Prisma schema syntax is correct');
  console.error('  • Review database logs for constraint violations');
  process.exit(1);
}