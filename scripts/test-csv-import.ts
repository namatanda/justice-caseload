#!/usr/bin/env tsx

/**
 * Test script to verify CSV import functionality with the new schema
 * This script tests the CSV processing logic without requiring a database connection
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { CaseReturnRowSchema } from '../src/lib/validation/schemas.js';
import { deriveCourtTypeFromCaseId } from '../src/lib/import/csv-processor';

async function testCsvImport() {
  console.log('🧪 Testing CSV Import Functionality\n');

  try {
    // Read sample CSV file
    const csvPath = join(__dirname, '..', 'data', 'sample_case_returns.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());

    console.log(`📄 Loaded CSV with ${lines.length - 1} data rows\n`);

    // Parse CSV headers
    const headers = lines[0].split(',').map(h => h.trim());
    console.log('📋 CSV Headers count:', headers.length);
    console.log('📋 First 10 headers:', headers.slice(0, 10).join(', '));
    console.log('📋 Last 10 headers:', headers.slice(-10).join(', '));

    // Test court type derivation
    console.log('\n🏛️  Testing Court Type Derivation:');
    const testCaseIds = ['SCC123', 'SC456', 'HC789', 'MC111', 'ELC222', 'INVALID'];
    testCaseIds.forEach(caseid => {
      const courtType = deriveCourtTypeFromCaseId(caseid);
      console.log(`  ${caseid} → ${courtType}`);
    });

    // Test CSV row validation
    console.log('\n✅ Testing CSV Row Validation:');
    const sampleRow = lines[1].split(',');
    console.log('📊 Sample row columns count:', sampleRow.length);
    console.log('📊 First 10 columns:', sampleRow.slice(0, 10));
    console.log('📊 Next hearing columns (21-23):', sampleRow.slice(20, 24));
    console.log('📊 Party count columns (24-29):', sampleRow.slice(23, 30));

    // Create row object from headers and sample data
    const rowObject: any = {};
    headers.forEach((header, index) => {
      const value = sampleRow[index]?.trim() || '';
      // Convert empty strings to undefined for all optional fields
      const optionalFields = [
        'original_court', 'original_code', 'original_number', 'original_year',
        'judge_2', 'judge_3', 'judge_4', 'judge_5', 'judge_6', 'judge_7',
        'comingfor', 'reason_adj', 'next_dd', 'next_mon', 'next_yyyy',
        'male_applicant', 'female_applicant', 'organization_applicant',
        'male_defendant', 'female_defendant', 'organization_defendant',
        'applicant_witness', 'defendant_witness', 'custody', 'other_details'
      ];

      if (value === '' && optionalFields.includes(header)) {
        rowObject[header] = undefined;
      } else {
        rowObject[header] = value;
      }
    });

    console.log('📊 Sample Row Data:');
    console.log('  Case ID:', `${rowObject.caseid_type}${rowObject.caseid_no}`);
    console.log('  Court:', rowObject.court);
    console.log('  Case Type:', rowObject.case_type);
    console.log('  Primary Judge:', rowObject.judge_1);
    console.log('  Party Counts:', {
      applicants: {
        male: rowObject.male_applicant,
        female: rowObject.female_applicant,
        organization: rowObject.organization_applicant
      },
      defendants: {
        male: rowObject.male_defendant,
        female: rowObject.female_defendant,
        organization: rowObject.organization_defendant
      }
    });

    // Validate row against schema
    const validation = CaseReturnRowSchema.safeParse(rowObject);
    if (validation.success) {
      console.log('✅ Row validation: PASSED');
    } else {
      console.log('❌ Row validation: FAILED');
      console.log('Validation errors:', validation.error.errors);
    }

    // Test multiple rows
    console.log('\n📈 Testing Multiple Rows:');
    let validRows = 0;
    let invalidRows = 0;

    for (let i = 1; i < Math.min(lines.length, 6); i++) { // Test first 5 data rows
      console.log(`\n🔍 Row ${i} raw data:`, lines[i].substring(0, 100) + '...');
      const rowData = lines[i].split(',');
      console.log(`🔍 Row ${i} parsed columns:`, rowData.length, 'columns');
      const rowObj: any = {};

      headers.forEach((header, index) => {
        const value = rowData[index]?.trim() || '';
        // Convert empty strings to undefined for all optional fields
        const optionalFields = [
          'original_court', 'original_code', 'original_number', 'original_year',
          'judge_2', 'judge_3', 'judge_4', 'judge_5', 'judge_6', 'judge_7',
          'comingfor', 'reason_adj', 'next_dd', 'next_mon', 'next_yyyy',
          'male_applicant', 'female_applicant', 'organization_applicant',
          'male_defendant', 'female_defendant', 'organization_defendant',
          'applicant_witness', 'defendant_witness', 'custody', 'other_details'
        ];

        if (value === '' && optionalFields.includes(header)) {
          rowObj[header] = undefined;
        } else {
          rowObj[header] = value;
        }
      });

      const rowValidation = CaseReturnRowSchema.safeParse(rowObj);
      if (rowValidation.success) {
        validRows++;
        console.log(`  Row ${i}: ✅ Valid (${rowObj.caseid_type}${rowObj.caseid_no})`);
      } else {
        invalidRows++;
        const firstError = rowValidation.error.errors[0];
        console.log(`  Row ${i}: ❌ Invalid - Field: ${firstError?.path?.join('.')}, Error: ${firstError?.message}`);
        console.log(`    Raw value: ${JSON.stringify(rowObj[firstError?.path?.[0] as string])}`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`  Total rows tested: ${Math.min(lines.length - 1, 5)}`);
    console.log(`  Valid rows: ${validRows}`);
    console.log(`  Invalid rows: ${invalidRows}`);

    if (validRows > 0 && invalidRows === 0) {
      console.log('\n🎉 All tests passed! CSV import functionality is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please review the validation errors above.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testCsvImport().catch(console.error);