const fs = require('fs');
const path = require('path');

async function testCsvUpload() {
  try {
    // Read the test CSV file
    const csvFilePath = path.join(__dirname, 'test-data.csv');
    const csvBuffer = fs.readFileSync(csvFilePath);
    
    // Create FormData
    const formData = new FormData();
    const file = new Blob([csvBuffer], { type: 'text/csv' });
    formData.append('file', file, 'test-data.csv');
    
    // Send request to the upload API
    console.log('Sending upload request...');
    const response = await fetch('http://localhost:9002/api/import/upload?sync=true', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    console.log('Upload response:', result);
    
    if (result.success) {
      console.log('✅ Upload successful!');
      console.log('Batch ID:', result.batchId);
      
      // Check the database to verify data was persisted
      console.log('Checking database for persisted data...');
      
      // Let's wait a moment for processing to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check database directly
      const { exec } = require('child_process');
      exec('docker exec justice-caseload-database-1 psql -U fiend -d caseload -c "SELECT COUNT(*) FROM cases;"', (error, stdout, stderr) => {
        if (error) {
          console.error('Error checking database:', error);
          return;
        }
        console.log('Cases count:', stdout);
      });
      
      exec('docker exec justice-caseload-database-1 psql -U fiend -d caseload -c "SELECT COUNT(*) FROM case_activities;"', (error, stdout, stderr) => {
        if (error) {
          console.error('Error checking database:', error);
          return;
        }
        console.log('Case activities count:', stdout);
      });
      
    } else {
      console.log('❌ Upload failed:', result.error);
      if (result.errors) {
        console.log('Validation errors:', result.errors);
      }
    }
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

testCsvUpload();