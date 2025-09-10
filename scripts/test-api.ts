import fetch from 'node-fetch';

async function testApi() {
  try {
    const response = await fetch('http://localhost:9002/api/analytics/dashboard');
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testApi();