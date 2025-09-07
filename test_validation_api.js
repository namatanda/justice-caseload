const fs = require('fs');
const path = require('path');

async function testValidationAPI() {
  try {
    // Read the test CSV file
    const csvPath = path.join(__dirname, 'test_validation_errors.csv');
    const csvContent = fs.readFileSync(csvPath);
    
    // Create form data
    const formData = new FormData();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const file = new File([blob], 'test_validation_errors.csv', { type: 'text/csv' });
    formData.append('file', file);

    console.log('🔍 Testing validation API with error-containing CSV...');
    
    // Call the validation API
    const response = await fetch('http://localhost:9002/api/validate/csv', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    
    console.log('\n📊 Validation Result:');
    console.log('Success:', result.success);
    console.log('Valid:', result.valid);
    console.log('Record Count:', result.recordCount);
    console.log('Errors Found:', result.errors?.length || 0);
    console.log('Warnings Found:', result.warnings?.length || 0);
    
    if (result.errors && result.errors.length > 0) {
      console.log('\n❌ Validation Errors:');
      result.errors.forEach((error, index) => {
        console.log(`\n${index + 1}. Row ${error.rowNumber || 'Unknown'} - ${error.field || 'Unknown Field'}`);
        console.log(`   Type: ${error.type}`);
        console.log(`   Message: ${error.message}`);
        console.log(`   Suggestion: ${error.suggestion || 'No suggestion'}`);
        console.log(`   Raw Value: ${JSON.stringify(error.rawValue)}`);
      });
    }
    
    if (result.warnings && result.warnings.length > 0) {
      console.log('\n⚠️ Validation Warnings:');
      result.warnings.forEach((warning, index) => {
        console.log(`\n${index + 1}. ${warning.message}`);
      });
    }
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testValidationAPI();