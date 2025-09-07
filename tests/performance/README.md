# Performance Tests

This directory contains performance benchmarks and optimization validation tests for the CSV processing system.

## Test Files

### `csv-performance.test.ts`
General CSV processing performance benchmarks that establish baseline performance metrics for:
- Parser performance with different file sizes
- Validation performance 
- Memory usage patterns
- Memory leak detection

### `empty-row-filtering-performance.test.ts`
Specific performance tests for the empty row filtering feature that verify:
- **Parsing Performance**: Ensures empty row detection doesn't significantly impact parsing speed
- **Memory Efficiency**: Validates that filtering reduces memory usage by not storing empty rows
- **Validation Improvements**: Confirms that pre-filtering empty rows improves validation efficiency
- **No Regression**: Ensures files without empty rows maintain their performance characteristics

## Key Performance Characteristics Tested

### 1. Parser Performance
- Files with many empty rows should parse within reasonable time limits
- Files without empty rows should maintain baseline performance
- Large files (5000+ rows) should complete within acceptable thresholds

### 2. Memory Usage
- Empty row detection should not significantly increase memory consumption
- Filtered parsing should store fewer rows in memory (only data rows)
- Repeated parsing operations should not leak memory

### 3. Validation Performance
- Pre-filtering empty rows should reduce the number of rows sent to validation
- Validation accuracy should be maintained (same number of actual validation errors)
- Processing statistics should be more accurate by excluding empty rows

### 4. End-to-End Performance
- Overall import workflow should benefit from accurate row counting
- Processing time may have slight overhead for detection but saves validation time
- Memory efficiency improves by not processing empty rows through the entire pipeline

## Running Performance Tests

```bash
# Run all performance tests
npm test tests/performance/

# Run specific performance test
npm test tests/performance/empty-row-filtering-performance.test.ts

# Run with verbose output to see performance metrics
npm test tests/performance/ -- --reporter=verbose
```

## Performance Expectations

The tests are designed to validate functionality and efficiency rather than enforce strict timing requirements, as performance can vary significantly across different systems and environments.

### Key Success Criteria:
1. **Accuracy**: Empty row filtering provides accurate statistics
2. **Memory Efficiency**: Fewer rows stored in memory when empty rows are filtered
3. **No Regression**: Files without empty rows maintain reasonable performance
4. **Scalability**: Large files complete within acceptable time limits

### Performance Metrics Logged:
- Parsing time with and without filtering
- Memory usage patterns
- Row counts (data vs empty rows)
- Validation performance comparisons

## Test Data Generation

The performance tests automatically generate test CSV files with different patterns:
- Files with many trailing empty rows
- Files with no empty rows
- Files with interspersed empty rows
- Large files for stress testing

These files are created in `tests/performance/data/` during test execution and cleaned up afterward.