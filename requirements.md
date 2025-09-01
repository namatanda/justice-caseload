# Requirements Document

## Introduction

The current database schema needs to be refactored to properly conform with the CSV data structure from case_returns.csv. The existing schema has several mismatches with the actual data fields, data types, and relationships that need to be addressed to ensure accurate data import and processing.

## Requirements

### Requirement 1

**User Story:** As a data analyst, I want the database schema to accurately reflect the CSV data structure, so that all case return data can be imported without data loss or type mismatches.

#### Acceptance Criteria

1. WHEN importing CSV data THEN the system SHALL support all CSV columns without field mapping errors
2. WHEN storing date information THEN the system SHALL handle separate day, month, and year fields as they appear in the CSV
3. WHEN processing case identifiers THEN the system SHALL support the caseid_type and caseid_no format from the CSV
4. WHEN storing judge information THEN the system SHALL support up to 7 judges per case activity as indicated in the CSV
5. WHEN handling party information THEN the system SHALL store separate counts for male_applicant, female_applicant, organization_applicant, male_defendant, female_defendant, and organization_defendant

### Requirement 2

**User Story:** As a system administrator, I want the database to maintain referential integrity while supporting the flexible data structure from the CSV, so that data consistency is preserved during imports.

#### Acceptance Criteria

1. WHEN creating case records THEN the system SHALL properly link cases to their original court information
2. WHEN storing case activities THEN the system SHALL maintain relationships between cases and their activities
3. WHEN handling judge assignments THEN the system SHALL support multiple judges per case activity
4. WHEN processing court information THEN the system SHALL handle both current court and original court data
5. IF original court information is missing THEN the system SHALL allow null values without constraint violations

### Requirement 3

**User Story:** As a developer, I want the schema to support efficient querying and reporting on case data, so that performance remains optimal as the dataset grows.

#### Acceptance Criteria

1. WHEN querying case data THEN the system SHALL provide appropriate indexes for common search patterns
2. WHEN filtering by date ranges THEN the system SHALL support efficient date-based queries
3. WHEN searching by judge THEN the system SHALL provide fast lookup capabilities
4. WHEN reporting on case outcomes THEN the system SHALL enable efficient aggregation queries
5. WHEN analyzing case types THEN the system SHALL support grouping and filtering operations

### Requirement 4

**User Story:** As a data entry user, I want the system to handle the specific data formats and constraints present in the CSV, so that import operations complete successfully without manual data transformation.

#### Acceptance Criteria

1. WHEN processing custody status THEN the system SHALL handle numeric values (0/1) as they appear in the CSV
2. WHEN storing legal representation data THEN the system SHALL accept "Yes"/"No" string values from the CSV
3. WHEN handling witness counts THEN the system SHALL store integer values for applicant and defendant witnesses
4. WHEN processing case outcomes THEN the system SHALL support the full range of outcome types present in the CSV
5. WHEN storing additional details THEN the system SHALL accommodate variable-length text content
6. WHEN deriving court type from caseid_type THEN the system SHALL use the first two letters of caseid_type, except for Small Claims Court (SCC) which requires checking the three-letter prefix to avoid conflict with Supreme Court (SC)
7. IF no matching court type prefix exists THEN the system SHALL default to TC (Trubunal Court)

### Requirement 5

**User Story:** As a system integrator, I want the refactored schema to maintain backward compatibility with existing application code, so that minimal changes are required to the application layer.

#### Acceptance Criteria

1. WHEN accessing case data THEN existing API endpoints SHALL continue to function with appropriate data mapping
2. WHEN querying judge information THEN the system SHALL provide both individual judge fields and consolidated judge lists
3. WHEN retrieving party information THEN the system SHALL support both detailed party counts and summary totals
4. WHEN working with dates THEN the system SHALL provide both component date fields and consolidated date objects
5. IF schema changes affect existing queries THEN the system SHALL provide migration scripts to update dependent code