-- Add missing columns to daily_import_batches table
-- These columns exist in the Prisma schema but were missing from the database

ALTER TABLE "public"."daily_import_batches"
ADD COLUMN IF NOT EXISTS "estimated_completion_time" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "processing_start_time" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "user_config" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "validation_warnings" JSONB NOT NULL DEFAULT '[]';
