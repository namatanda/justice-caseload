// Test script to verify Zod error parsing improvements
import { CaseReturnRowSchema } from './src/lib/validation/schemas.js';

// Sample row with validation errors
const testRowWithErrors = {
  date_dd: 45, // Invalid: greater than 31
  date_mon: 'INVALID', // Invalid: not a 3-letter month
  date_yyyy: 2024,
  caseid_type: 'XYZ', // Invalid: not a valid court type
  caseid_no: '11111',
  filed_dd: '', // Missing required field
  filed_mon: '',
  filed_yyyy: '',
  court: '', // Missing required field
  case_type: 'INVALID_CASE_TYPE', // Invalid case type
  legalrep: 'INVALID_LEGALREP', // Invalid: must be Yes or No
  male_applicant: 'not_a_number', // Invalid: should be number
  female_applicant: 0,
  organization_applicant: 0,
  male_defendant: 1,
  female_defendant: 0,
  organization_defendant: 0,
  applicant_witness: 0,
  defendant_witness: 0,
  custody: 0,
  other_details: 'Test error row'
};

try {
  CaseReturnRowSchema.parse(testRowWithErrors);
  console.log('✅ Validation passed - unexpected!');
} catch (error) {
  console.log('❌ Validation failed as expected');
  console.log('Error message:', error.message);
  console.log('\nParsing error details...');
  
  // Test our parseZodError function
  const parseZodError = (zodError, row) => {
    const errors = [];

    // Handle the transform error for missing required fields
    if (zodError.includes('Missing required fields:')) {
      const missingFieldsMatch = zodError.match(/Missing required fields:\s*(.+)/);
      if (missingFieldsMatch) {
        const missingFields = missingFieldsMatch[1].split(', ');
        missingFields.forEach(field => {
          errors.push({
            field,
            message: `${field} is required but missing or empty`,
            suggestion: `Please provide a value for ${field}`,
            rawValue: row[field] || null
          });
        });
        return errors;
      }
    }

    // Extract field-specific errors from Zod error message
    const errorLines = zodError.split('\n').filter(line => line.trim());

    for (const line of errorLines) {
      // Parse lines like: "date_dd: Number must be greater than or equal to 1"
      const fieldMatch = line.match(/^(\w+):\s*(.+)$/);
      if (fieldMatch) {
        const [, field, message] = fieldMatch;
        const rawValue = row[field];

        errors.push({
          field,
          message: `${field}: ${message}`,
          suggestion: `Check the format and value for ${field}`,
          rawValue
        });
      }
    }

    // If no specific field errors found, create a general error
    if (errors.length === 0) {
      errors.push({
        field: 'general',
        message: zodError,
        suggestion: 'Check the data format and ensure all required fields are properly formatted.',
        rawValue: null
      });
    }

    return errors;
  };

  const fieldErrors = parseZodError(error.message, testRowWithErrors);
  
  console.log('\n📊 Parsed field errors:');
  fieldErrors.forEach((fieldError, index) => {
    console.log(`\n${index + 1}. Field: ${fieldError.field}`);
    console.log(`   Message: ${fieldError.message}`);
    console.log(`   Suggestion: ${fieldError.suggestion}`);
    console.log(`   Raw Value: ${JSON.stringify(fieldError.rawValue)}`);
  });
}