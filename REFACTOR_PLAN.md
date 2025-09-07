# CSV Processor Refactor Plan

## Current Issues

The current `src/lib/import/csv-processor.ts` file is a monolithic 1728-line implementation that handles multiple responsibilities, leading to significant bloat and maintenance challenges. Key sources of bloat include:

- **Excessive Logging and Debugging (Lines 453-865 in processCsvImport, 868-1062 in processBatch)**: Verbose per-row logging, error details, and progress updates inflate the code with repetitive console.log and logger calls. This is redundant for a standard CSV format with predictable columns.
  
- **Custom CSV Parsing (Lines 1411-1600 in readCsvFile/parseCSVLine)**: A bespoke parser for handling quoted fields and edge cases, despite the sample CSV having a standard format with 37 fixed columns (e.g., court, date_dd/date_mon/date_yyyy, caseid_type, caseid_no, etc.) and no complex quoting issues. This can be replaced with a simpler library like `csv-parser`.

- **Redundant Error Parsing and Suggestions (Lines 1-194)**: Over-engineered error handling with detailed suggestions and verbose Zod error parsing, unnecessary for predictable datatypes (strings for names/codes, numbers for dates/counts, enums for outcomes/legalrep).

- **Over-Engineered Functions and Utilities**:
  - Lines 203-235: `deriveCourtType` - Can be simplified to direct mapping without complex logic.
  - Lines 263-300: `getOrCreateSystemUser` - Should be extracted to a separate utility module.
  - Lines 301-450: `initiateDailyImport` - Extract to a dedicated queue handler.
  - Lines 1065-1296: `createOrUpdateCase` and Lines 1299-1408: `createCaseActivity` - Redundant; can be merged into a single case/activity creation function.
  - Lines 1651-1703: `getImportStatus` and Lines 1706-1728: `getImportHistory` - Simple queries bloated by integration with the main processor.

- **Redundant Validation and Transaction Handling**: Multiple Zod checks and verbose transaction wrappers, plus dry-run modes and verification steps that are not critical for standard imports.

- **Other Bloat**: Queueing integration, duplicate detection, and progress caching are intertwined, leading to poor separation of concerns. This results in ~70% of the code being non-essential for core functionality.

Overall, the file violates single responsibility principle, making it hard to test, debug, and extend.

## Proposed Architecture

To address the bloat, refactor into a modular structure with smaller, focused files under `src/lib/import/`. The total codebase will be reduced to ~300-500 lines (70-80% reduction) by:

- Removing redundant logging (keep essential error and progress logs).
- Using `csv-parser` for standard CSV handling.
- Streamlining Zod errors to basic messages.
- Batching DB operations efficiently with Prisma transactions.
- Removing non-critical dry-run and verification features.
- Extracting utilities and handlers.

### New File Structure
```
src/lib/import/
├── csv-processor.ts          # Main orchestrator (~100 lines): Handles queue initiation, status updates, and high-level flow.
├── csv-parser.ts             # CSV reading and parsing (~50 lines): Uses csv-parser for standard format.
├── validation.ts             # Zod schemas and basic error handling (~50 lines): CaseReturnRowSchema with simplified errors.
├── db-operations.ts          # Database CRUD for cases, activities, judges, courts (~150 lines): Merged create/update functions, batched inserts.
├── queue-handler.ts          # Bull Queue integration and batch processing (~100 lines): initiateDailyImport, processBatch with minimal logging.
└── utils.ts                  # Shared utilities (~50 lines): getOrCreateSystemUser, deriveCourtType (simplified), checksum, duplicate detection.
```

### Key Function Breakdowns
- **csv-processor.ts**:
  - `processImport(batchId: string)`: Orchestrates parsing → validation → queueing → status tracking.
  
- **csv-parser.ts**:
  - `parseCSV(filePath: string)`: Reads file, parses into array of CaseReturnRow objects using fixed 37-column schema.

- **validation.ts**:
  - `validateRow(row: any)`: Uses Zod for type checking (e.g., date parts as numbers, enums for outcome/legalrep), returns basic error messages.

- **db-operations.ts**:
  - `createOrUpdateCaseAndActivity(row: CaseReturnRow)`: Merged function for case creation/update, activity logging, master data (judges/courts) handling in a single transaction.
  - `batchInsert(rows: CaseReturnRow[])`: Efficient batched DB operations.

- **queue-handler.ts**:
  - `initiateDailyImport(filePath: string)`: Queues batches, handles progress caching via Redis.
  - `processBatch(batch: CaseReturnRow[])`: Processes with minimal per-row logging, error aggregation.

- **utils.ts**:
  - `deriveCourtType(court: string)`: Simple mapping.
  - `getOrCreateSystemUser()`: Standalone utility.
  - `getImportStatus(batchId: string)` / `getImportHistory()`: Simple Prisma/Redis queries.

### Estimated Line Reductions
- Original: 1728 lines.
- Refactored: ~500 lines total (e.g., main file from 1728 to 100, parsing from 190 to 50).
- Reduction: ~1200 lines (70%), primarily from logging removal (400+ lines), custom parser simplification (150 lines), merged functions (300 lines), and streamlined errors (200 lines).

### Potential Performance Improvements
- **Faster Parsing**: Switch to `csv-parser` reduces processing time by 50-70% for standard CSVs (no custom quoted field handling).
- **Fewer DB Queries**: Batched inserts/transactions reduce query count from per-row to per-batch (e.g., 10x fewer for 1000 rows), improving throughput by 2-5x.
- **Reduced Memory Usage**: Streamed parsing and minimal logging cut memory footprint by 30-50%.
- **Queue Efficiency**: Simplified handler reduces Redis/Bull overhead, enabling faster parallel processing.

Core functionality preserved: Queue-based processing, validation against CaseReturnRowSchema, case/activity creation, master data tracking, error logging, status updates. Assumes standard CSV (no malformed quoting/empty rows).

## Proposed Architecture Diagram

```mermaid
graph TD
    A[Upload CSV] --> B{csv-parser.ts}
    B --> C[Parse to CaseReturnRow[]]
    C --> D{validation.ts}
    D --> E[Validate Rows]
    E --> F[Error Aggregation]
    F --> G{queue-handler.ts}
    G --> H[Initiate Queue Batch]
    H --> I[db-operations.ts]
    I --> J[Batch Create/Update Case & Activity]
    J --> K[Master Data: Judges/Courts]
    K --> L[Update Status via Redis/Prisma]
    L --> M[Complete/Retry on Errors]
    F --> M
    subgraph "Utils"
        U1[deriveCourtType]
        U2[getOrCreateSystemUser]
    end
    G -.-> U1
    I -.-> U2
```

## Migration Steps

1. **Preparation (1-2 days)**:
   - Install `csv-parser` dependency.
   - Extract and test utilities (e.g., utils.ts) independently using existing scripts like `scripts/test-csv-import.ts`.
   - Define CaseReturnRowSchema in validation.ts based on 37-column format.

2. **Modular Extraction (2-3 days)**:
   - Create csv-parser.ts: Replace custom parser, test with sample data/case_returns.csv.
   - Create validation.ts: Simplify Zod and errors, unit test with sample rows.
   - Create db-operations.ts: Merge case/activity functions, implement batching, test transactions.
   - Create queue-handler.ts: Extract initiation and batch processing, integrate with Bull Queue.

3. **Main Orchestrator Refactor (1 day)**:
   - Update csv-processor.ts to import and orchestrate new modules.
   - Remove dry-run modes and excessive logging; add essential status updates.

4. **Integration and Testing (2 days)**:
   - Update API routes (e.g., src/app/api/import/upload/route.ts) to use new orchestrator.
   - Run integration tests (e.g., tests/integration/csv-import.integration.test.ts) with sample CSV.
   - Verify queue processing, error logging, and status via Redis/Prisma.
   - Performance benchmark: Compare import time for 1000+ rows.

5. **Cleanup and Deployment (1 day)**:
   - Remove old code sections, update imports in related files (e.g., file-handler.ts).
   - Deploy and monitor with production CSV imports.

Total estimated effort: 7-9 days.

## Risks/Mitigations

- **Risk: Breaking Core Functionality (e.g., queueing or DB inserts)**:
  - Mitigation: Comprehensive unit/integration tests covering sample CSV scenarios. Use feature flags to toggle old/new processor during migration.

- **Risk: Performance Regression in Edge Cases (e.g., large files)**:
  - Mitigation: Benchmark with real data sizes; fallback to streamed processing if needed. Monitor Redis/Bull queue metrics post-deploy.

- **Risk: Data Integrity Issues from Batched Operations**:
  - Mitigation: Use Prisma transactions for atomicity; add rollback on batch failures. Validate post-import counts against originals.

- **Risk: Dependency on Standard CSV Format**:
  - Mitigation: Document assumptions; add optional custom parser fallback if future CSVs vary. Test with provided sample to confirm predictability.

- **Risk: Module Integration Bugs**:
  - Mitigation: Incremental extraction with TDD; use existing scripts for smoke tests.

This plan ensures a cleaner, more maintainable codebase while preserving all essential features.