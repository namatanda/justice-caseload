-- Performance indexes for optimal query performance
-- Create indexes concurrently to avoid blocking operations

-- Cases table indexes for common query patterns
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_cases_status_filed_date" 
ON "cases" ("status", "filed_date" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_cases_case_type_filed_date" 
ON "cases" ("case_type_id", "filed_date" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_cases_filed_date" 
ON "cases" ("filed_date" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_cases_status" 
ON "cases" ("status");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_cases_case_age_days" 
ON "cases" ("case_age_days");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_cases_last_activity_date" 
ON "cases" ("last_activity_date" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_cases_original_court" 
ON "cases" ("original_court_id") WHERE "original_court_id" IS NOT NULL;

-- Case activities indexes for activity queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_case_activities_case_activity_date" 
ON "case_activities" ("case_id", "activity_date" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_case_activities_activity_date" 
ON "case_activities" ("activity_date" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_case_activities_judge_date" 
ON "case_activities" ("primary_judge_id", "activity_date" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_case_activities_outcome_date" 
ON "case_activities" ("outcome", "activity_date" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_case_activities_activity_type" 
ON "case_activities" ("activity_type");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_case_activities_import_batch" 
ON "case_activities" ("import_batch_id");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_case_activities_custody_status" 
ON "case_activities" ("custody_status");

-- JSONB indexes for party information
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_cases_parties_gin" 
ON "cases" USING GIN ("parties");

-- Partial indexes for active cases only (more efficient for common queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_cases_active_filed_date" 
ON "cases" ("filed_date" DESC) WHERE "status" = 'ACTIVE';

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_cases_active_case_age" 
ON "cases" ("case_age_days" DESC) WHERE "status" = 'ACTIVE';

-- Composite index for dashboard queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_cases_dashboard" 
ON "cases" ("status", "case_type_id", "filed_date" DESC);

-- Judge assignments indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_case_judge_assignments_case" 
ON "case_judge_assignments" ("case_id");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_case_judge_assignments_judge" 
ON "case_judge_assignments" ("judge_id");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_case_judge_assignments_primary" 
ON "case_judge_assignments" ("is_primary") WHERE "is_primary" = true;

-- Courts table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_courts_type_active" 
ON "courts" ("court_type", "is_active");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_courts_name" 
ON "courts" ("court_name");

-- Judges table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_judges_full_name" 
ON "judges" ("full_name");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_judges_first_last_name" 
ON "judges" ("first_name", "last_name");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_judges_active" 
ON "judges" ("is_active");

-- Case types indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_case_types_name" 
ON "case_types" ("case_type_name");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_case_types_active" 
ON "case_types" ("is_active");

-- Import batches indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_import_batches_date" 
ON "daily_import_batches" ("import_date" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_import_batches_status" 
ON "daily_import_batches" ("status");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_import_batches_created_by" 
ON "daily_import_batches" ("created_by");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_import_batches_filename" 
ON "daily_import_batches" ("filename");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_import_batches_checksum" 
ON "daily_import_batches" ("file_checksum");

-- Users indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_users_role" 
ON "users" ("role");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_users_active" 
ON "users" ("is_active");

-- Text search indexes for case numbers and names
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_cases_case_number_text" 
ON "cases" USING gin(to_tsvector('english', "case_number"));

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_judges_name_text" 
ON "judges" USING gin(to_tsvector('english', "full_name"));

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_courts_name_text" 
ON "courts" USING gin(to_tsvector('english', "court_name"));

-- Analyze tables to update statistics
ANALYZE "cases";
ANALYZE "case_activities";
ANALYZE "case_judge_assignments";
ANALYZE "courts";
ANALYZE "judges";
ANALYZE "case_types";
ANALYZE "daily_import_batches";
ANALYZE "users";