const { CsvParserImpl } = require('./src/lib/csv/parser');

async function testParser() {
  const parser = new CsvParserImpl();
  
  try {
    const result = await parser.parseFileWithFiltering('./test-sample.csv');
    console.log('Parse result:', result);
  } catch (error) {
    console.error('Error parsing file:', error);
  }
}

testParser();