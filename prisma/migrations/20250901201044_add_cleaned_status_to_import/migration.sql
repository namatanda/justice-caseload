/*
  Warnings:

  - The values [MAGISTRATE,HIGH_COURT,TRIBUNAL,OTHER] on the enum `court_type` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `courts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `male_applicant` on table `cases` required. This step will fail if there are existing NULL values in that column.
  - Made the column `female_applicant` on table `cases` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organization_applicant` on table `cases` required. This step will fail if there are existing NULL values in that column.
  - Made the column `male_defendant` on table `cases` required. This step will fail if there are existing NULL values in that column.
  - Made the column `female_defendant` on table `cases` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organization_defendant` on table `cases` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `court_type` on the `courts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."error_severity" AS ENUM ('ERROR', 'WARNING', 'INFO');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."court_type_new" AS ENUM ('SC', 'ELC', 'ELRC', 'KC', 'SCC', 'COA', 'MC', 'HC', 'TC');
ALTER TABLE "public"."courts" ALTER COLUMN "court_type" TYPE "public"."court_type_new" USING ("court_type"::text::"public"."court_type_new");
ALTER TYPE "public"."court_type" RENAME TO "court_type_old";
ALTER TYPE "public"."court_type_new" RENAME TO "court_type";
DROP TYPE "public"."court_type_old";
COMMIT;

-- AlterEnum
ALTER TYPE "public"."import_status" ADD VALUE 'CLEANED';

-- DropForeignKey
ALTER TABLE "public"."cases" DROP CONSTRAINT "cases_original_court_id_fkey";

-- AlterTable
ALTER TABLE "public"."cases" ALTER COLUMN "male_applicant" SET NOT NULL,
ALTER COLUMN "female_applicant" SET NOT NULL,
ALTER COLUMN "organization_applicant" SET NOT NULL,
ALTER COLUMN "male_defendant" SET NOT NULL,
ALTER COLUMN "female_defendant" SET NOT NULL,
ALTER COLUMN "organization_defendant" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."courts" DROP CONSTRAINT "courts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "court_type",
ADD COLUMN     "court_type" "public"."court_type" NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT,
ADD CONSTRAINT "courts_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "public"."CourtType";

-- CreateTable
CREATE TABLE "public"."import_progress" (
    "id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "progress_percentage" INTEGER,
    "current_step" VARCHAR(100),
    "message" TEXT,
    "records_processed" INTEGER NOT NULL DEFAULT 0,
    "total_records" INTEGER NOT NULL DEFAULT 0,
    "errors_count" INTEGER NOT NULL DEFAULT 0,
    "warnings_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "import_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."import_error_details" (
    "id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "row_number" INTEGER,
    "column_name" VARCHAR(100),
    "error_type" VARCHAR(50) NOT NULL,
    "error_message" TEXT NOT NULL,
    "raw_value" TEXT,
    "suggested_fix" TEXT,
    "severity" "public"."error_severity" NOT NULL DEFAULT 'ERROR',
    "is_resolved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_error_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."import_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_token" VARCHAR(255) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "import_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."validation_results" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "file_checksum" VARCHAR(64) NOT NULL,
    "validation_status" VARCHAR(50) NOT NULL,
    "total_rows" INTEGER NOT NULL,
    "valid_rows" INTEGER NOT NULL,
    "invalid_rows" INTEGER NOT NULL,
    "errors" JSONB NOT NULL DEFAULT '[]',
    "warnings" JSONB NOT NULL DEFAULT '[]',
    "preview_data" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "validation_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "import_progress_batch_id_idx" ON "public"."import_progress"("batch_id");

-- CreateIndex
CREATE INDEX "import_progress_updated_at_idx" ON "public"."import_progress"("updated_at" DESC);

-- CreateIndex
CREATE INDEX "import_error_details_batch_id_idx" ON "public"."import_error_details"("batch_id");

-- CreateIndex
CREATE INDEX "import_error_details_severity_idx" ON "public"."import_error_details"("severity");

-- CreateIndex
CREATE INDEX "import_error_details_error_type_idx" ON "public"."import_error_details"("error_type");

-- CreateIndex
CREATE UNIQUE INDEX "import_sessions_session_token_key" ON "public"."import_sessions"("session_token");

-- CreateIndex
CREATE INDEX "import_sessions_user_id_idx" ON "public"."import_sessions"("user_id");

-- CreateIndex
CREATE INDEX "import_sessions_session_token_idx" ON "public"."import_sessions"("session_token");

-- CreateIndex
CREATE INDEX "import_sessions_status_idx" ON "public"."import_sessions"("status");

-- CreateIndex
CREATE INDEX "import_sessions_expires_at_idx" ON "public"."import_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "validation_results_user_id_idx" ON "public"."validation_results"("user_id");

-- CreateIndex
CREATE INDEX "validation_results_file_checksum_idx" ON "public"."validation_results"("file_checksum");

-- CreateIndex
CREATE INDEX "validation_results_created_at_idx" ON "public"."validation_results"("created_at" DESC);

-- CreateIndex
CREATE INDEX "case_activities_judge_1_idx" ON "public"."case_activities"("judge_1");

-- CreateIndex
CREATE INDEX "cases_caseid_type_caseid_no_idx" ON "public"."cases"("caseid_type", "caseid_no");

-- CreateIndex
CREATE INDEX "courts_court_type_is_active_idx" ON "public"."courts"("court_type", "is_active");

-- CreateIndex
CREATE INDEX "courts_original_code_idx" ON "public"."courts"("original_code");

-- AddForeignKey
ALTER TABLE "public"."cases" ADD CONSTRAINT "cases_original_court_id_fkey" FOREIGN KEY ("original_court_id") REFERENCES "public"."courts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."import_progress" ADD CONSTRAINT "import_progress_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "public"."daily_import_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."import_error_details" ADD CONSTRAINT "import_error_details_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "public"."daily_import_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."import_sessions" ADD CONSTRAINT "import_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."validation_results" ADD CONSTRAINT "validation_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "public"."case_activities_judge2_idx" RENAME TO "case_activities_judge_2_idx";

-- RenameIndex
ALTER INDEX "public"."case_activities_judge3_idx" RENAME TO "case_activities_judge_3_idx";

-- RenameIndex
ALTER INDEX "public"."case_activities_judge4_idx" RENAME TO "case_activities_judge_4_idx";

-- RenameIndex
ALTER INDEX "public"."case_activities_judge5_idx" RENAME TO "case_activities_judge_5_idx";

-- RenameIndex
ALTER INDEX "public"."case_activities_judge6_idx" RENAME TO "case_activities_judge_6_idx";

-- RenameIndex
ALTER INDEX "public"."case_activities_judge7_idx" RENAME TO "case_activities_judge_7_idx";
