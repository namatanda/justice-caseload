#!/usr/bin/env tsx

/**
 * Script to replace console.log statements with proper logger calls
 * and remove debugging code from all modified modules
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

interface LogReplacement {
  pattern: RegExp;
  replacement: string;
}

// Define patterns for console.log replacements
const logReplacements: LogReplacement[] = [
  // Console.log patterns with emojis
  { pattern: /console\.log\('🔍 ([^']+):', ([^)]+)\);/g, replacement: "logger.import.info('$1', $2);" },
  { pattern: /console\.log\('📋 ([^']+):', ([^)]+)\);/g, replacement: "logger.import.debug('$1', $2);" },
  { pattern: /console\.log\('✅ ([^']+):', ([^)]+)\);/g, replacement: "logger.import.info('$1', $2);" },
  { pattern: /console\.log\('⚠️ ([^']+):', ([^)]+)\);/g, replacement: "logger.import.warn('$1', $2);" },
  { pattern: /console\.log\('👤 ([^']+):', ([^)]+)\);/g, replacement: "logger.database.debug('$1', $2);" },
  { pattern: /console\.log\('📝 ([^']+):', ([^)]+)\);/g, replacement: "logger.database.info('$1', $2);" },
  { pattern: /console\.log\('🚀 ([^']+):', ([^)]+)\);/g, replacement: "logger.import.info('$1', $2);" },
  { pattern: /console\.log\('💾 ([^']+):', ([^)]+)\);/g, replacement: "logger.upload.info('$1', $2);" },
  
  // Console.log patterns without data
  { pattern: /console\.log\('🔍 ([^']+)'\);/g, replacement: "logger.import.info('$1');" },
  { pattern: /console\.log\('📋 ([^']+)'\);/g, replacement: "logger.import.debug('$1');" },
  { pattern: /console\.log\('✅ ([^']+)'\);/g, replacement: "logger.import.info('$1');" },
  { pattern: /console\.log\('⚠️ ([^']+)'\);/g, replacement: "logger.import.warn('$1');" },
  { pattern: /console\.log\('👤 ([^']+)'\);/g, replacement: "logger.database.debug('$1');" },
  { pattern: /console\.log\('📝 ([^']+)'\);/g, replacement: "logger.database.info('$1');" },
  { pattern: /console\.log\('🚀 ([^']+)'\);/g, replacement: "logger.import.info('$1');" },
  { pattern: /console\.log\('💾 ([^']+)'\);/g, replacement: "logger.upload.info('$1');" },
  
  // Console.error patterns
  { pattern: /console\.error\('❌ ([^']+):', ([^)]+)\);/g, replacement: "logger.import.error('$1', $2);" },
  { pattern: /console\.error\('🚨 ([^']+):', ([^)]+)\);/g, replacement: "logger.upload.error('$1', $2);" },
  { pattern: /console\.error\('❌ ([^']+)'\);/g, replacement: "logger.import.error('$1');" },
  { pattern: /console\.error\('🚨 ([^']+)'\);/g, replacement: "logger.upload.error('$1');" },
  
  // Generic console.log patterns
  { pattern: /console\.log\(([^)]+)\);/g, replacement: "logger.info('general', $1);" },
  { pattern: /console\.error\(([^)]+)\);/g, replacement: "logger.error('general', $1);" },
  { pattern: /console\.warn\(([^)]+)\);/g, replacement: "logger.warn('general', $1);" },
];

// Files to process
const filesToProcess = [
  'src/lib/import/csv-processor.ts',
  'src/lib/import/upload-verification.ts',
  'src/app/api/system/health/route.ts',
  'src/app/api/import/upload/route.ts',
  'scripts/system-integrity-check.ts',
  'src/lib/import/queue-worker.ts',
  'src/app/api/debug/**/*.ts',
];

function processFile(filePath: string): boolean {
  try {
    console.log(`\n📝 Processing: ${filePath}`);
    
    let content = readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if logger is already imported
    const hasLoggerImport = content.includes("import { logger }");
    
    // Add logger import if not present
    if (!hasLoggerImport && content.includes('console.')) {
      // Find the best place to add the import (after other imports)
      const importLines = content.split('\n').filter(line => line.trim().startsWith('import '));
      if (importLines.length > 0) {
        const lastImportIndex = content.lastIndexOf(importLines[importLines.length - 1]);
        const afterLastImport = content.indexOf('\n', lastImportIndex) + 1;
        content = content.slice(0, afterLastImport) + 
                 "import { logger } from '@/lib/logger';\n" + 
                 content.slice(afterLastImport);
        modified = true;
        console.log('  ✅ Added logger import');
      }
    }
    
    // Apply replacements
    let replacementCount = 0;
    for (const { pattern, replacement } of logReplacements) {
      const before = content;
      content = content.replace(pattern, replacement);
      if (content !== before) {
        replacementCount++;
        modified = true;
      }
    }
    
    // Remove debugging comments (optional)
    const debugPatterns = [
      /\/\/ DEBUGGING:.*/g,
      /\/\/ DEBUG:.*/g,
      /\/\/ Diagnostic:.*/g,
      /\/\/ DIAGNOSTIC:.*/g,
    ];
    
    for (const pattern of debugPatterns) {
      const before = content;
      content = content.replace(pattern, '');
      if (content !== before) {
        modified = true;
        console.log('  🧹 Removed debugging comments');
      }
    }
    
    if (modified) {
      writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ Modified with ${replacementCount} log replacements`);
      return true;
    } else {
      console.log('  ⏭️  No changes needed');
      return false;
    }
    
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error);
    return false;
  }
}

async function main() {
  console.log('🔧 Starting console.log to logger conversion...\n');
  
  let totalProcessed = 0;
  let totalModified = 0;
  
  for (const pattern of filesToProcess) {
    console.log(`\n📂 Processing pattern: ${pattern}`);
    
    try {
      const files = await glob(pattern, { cwd: process.cwd() });
      
      for (const file of files) {
        totalProcessed++;
        if (processFile(file)) {
          totalModified++;
        }
      }
    } catch (error) {
      console.error(`❌ Error with pattern ${pattern}:`, error);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${totalProcessed}`);
  console.log(`   Files modified: ${totalModified}`);
  console.log(`   Files unchanged: ${totalProcessed - totalModified}`);
  
  if (totalModified > 0) {
    console.log(`\n✅ Logger conversion complete! Please review the changes.`);
    console.log(`\n📋 Next steps:`);
    console.log(`   1. Run TypeScript compilation to check for errors`);
    console.log(`   2. Test the application to ensure logging works correctly`);
    console.log(`   3. Update any remaining manual console.log statements`);
  } else {
    console.log(`\n✅ All files are already using the logger correctly.`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { processFile, logReplacements };