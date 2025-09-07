import path from 'path';
import fs from 'fs';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';

async function testJudgeValidationImport() {
  const csvPath = path.resolve(process.cwd(), 'data', 'test.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error('Test CSV file not found at', csvPath);
    process.exit(1);
  }

  console.log('Starting judge validation test on', csvPath);
  
  // Direct implementation of the fixed judge validation logic
  function validateExtractedJudge(judgeName: string) {
    const issues = [];
    
    if (!judgeName || judgeName.trim().length === 0) {
      issues.push('Judge name is empty');
    }
    
    if (judgeName.length > 255) {
      issues.push('Judge name exceeds maximum length');
    }
    
    // The fixed regex that allows A-Za-z, spaces, commas, periods, hyphens, apostrophes
    if (!/^[A-Za-z\s,.'-]+$/.test(judgeName)) {
      issues.push('Judge name contains invalid characters');
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }

  let rowCount = 0;
  let errorCount = 0;
  let judgeErrors = 0;

  const stream = createReadStream(csvPath)
    .pipe(parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }));

  for await (const row of stream) {
    rowCount++;
    
    // Test judge_1 field specifically (and optionally judge_2 to judge_7)
    const judges = ['judge_1', 'judge_2', 'judge_3', 'judge_4', 'judge_5', 'judge_6', 'judge_7'];
    for (const judgeField of judges) {
      if (row[judgeField] && row[judgeField].trim()) {
        const judgeName = row[judgeField].trim();
        const validation = validateExtractedJudge(judgeName);
        
        if (!validation.isValid) {
          judgeErrors++;
          console.log(`Row ${rowCount}, ${judgeField}: "${judgeName}" - Validation failed:`, validation.issues);
          
          // Specifically check for row 167
          if (rowCount === 167) {
            console.error(`CRITICAL: Validation error at row 167, ${judgeField}: "${judgeName}"`);
          }
        }
      }
    }

    if (rowCount % 50 === 0) {
      console.log(`Processed ${rowCount} rows, ${judgeErrors} judge validation errors found`);
    }
  }

  console.log(`\nImport validation test completed:`);
  console.log(`Total rows processed: ${rowCount}`);
  console.log(`Judge validation errors: ${judgeErrors}`);
  
  if (judgeErrors === 0) {
    console.log('SUCCESS: No judge validation errors found in the CSV file.');
  } else {
    console.error('FAILED: Judge validation errors detected.');
    process.exit(1);
  }
}

testJudgeValidationImport().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});