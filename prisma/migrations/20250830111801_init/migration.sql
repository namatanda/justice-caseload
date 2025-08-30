-- CreateEnum
CREATE TYPE "public"."court_type" AS ENUM ('MAGISTRATE', 'HIGH_COURT', 'TRIBUNAL', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."case_status" AS ENUM ('ACTIVE', 'RESOLVED', 'PENDING', 'TRANSFERRED', 'DELETED');

-- CreateEnum
CREATE TYPE "public"."custody_status" AS ENUM ('IN_CUSTODY', 'ON_BAIL', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "public"."import_status" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."user_role" AS ENUM ('ADMIN', 'DATA_ENTRY', 'VIEWER');

-- CreateTable
CREATE TABLE "public"."courts" (
    "id" TEXT NOT NULL,
    "court_name" VARCHAR(255) NOT NULL,
    "court_code" VARCHAR(50) NOT NULL,
    "court_type" "public"."court_type" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."judges" (
    "id" TEXT NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "judges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."case_types" (
    "id" TEXT NOT NULL,
    "case_type_name" VARCHAR(100) NOT NULL,
    "case_type_code" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cases" (
    "id" TEXT NOT NULL,
    "case_number" VARCHAR(50) NOT NULL,
    "case_type_id" TEXT NOT NULL,
    "filed_date" DATE NOT NULL,
    "original_court_id" TEXT,
    "original_case_number" VARCHAR(50),
    "original_year" INTEGER,
    "parties" JSONB NOT NULL,
    "status" "public"."case_status" NOT NULL DEFAULT 'ACTIVE',
    "case_age_days" INTEGER NOT NULL DEFAULT 0,
    "last_activity_date" TIMESTAMP(3),
    "total_activities" INTEGER NOT NULL DEFAULT 0,
    "has_legal_representation" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."case_activities" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "activity_date" DATE NOT NULL,
    "activity_type" VARCHAR(100) NOT NULL,
    "outcome" VARCHAR(100) NOT NULL,
    "reason_for_adjournment" TEXT,
    "next_hearing_date" DATE,
    "primary_judge_id" TEXT NOT NULL,
    "has_legal_representation" BOOLEAN NOT NULL,
    "applicant_witnesses" INTEGER NOT NULL DEFAULT 0,
    "defendant_witnesses" INTEGER NOT NULL DEFAULT 0,
    "custody_status" "public"."custody_status" NOT NULL,
    "details" TEXT,
    "import_batch_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."case_judge_assignments" (
    "case_id" TEXT NOT NULL,
    "judge_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "case_judge_assignments_pkey" PRIMARY KEY ("case_id","judge_id")
);

-- CreateTable
CREATE TABLE "public"."daily_import_batches" (
    "id" TEXT NOT NULL,
    "import_date" DATE NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "file_checksum" VARCHAR(64) NOT NULL,
    "total_records" INTEGER NOT NULL,
    "successful_records" INTEGER NOT NULL,
    "failed_records" INTEGER NOT NULL,
    "error_logs" JSONB NOT NULL,
    "status" "public"."import_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "created_by" TEXT NOT NULL,

    CONSTRAINT "daily_import_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" "public"."user_role" NOT NULL DEFAULT 'DATA_ENTRY',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courts_court_code_key" ON "public"."courts"("court_code");

-- CreateIndex
CREATE INDEX "courts_court_type_is_active_idx" ON "public"."courts"("court_type", "is_active");

-- CreateIndex
CREATE INDEX "courts_court_name_idx" ON "public"."courts"("court_name");

-- CreateIndex
CREATE INDEX "courts_court_code_idx" ON "public"."courts"("court_code");

-- CreateIndex
CREATE INDEX "judges_full_name_idx" ON "public"."judges"("full_name");

-- CreateIndex
CREATE INDEX "judges_first_name_last_name_idx" ON "public"."judges"("first_name", "last_name");

-- CreateIndex
CREATE INDEX "judges_is_active_idx" ON "public"."judges"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "case_types_case_type_code_key" ON "public"."case_types"("case_type_code");

-- CreateIndex
CREATE INDEX "case_types_case_type_name_idx" ON "public"."case_types"("case_type_name");

-- CreateIndex
CREATE INDEX "case_types_is_active_idx" ON "public"."case_types"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "cases_case_number_key" ON "public"."cases"("case_number");

-- CreateIndex
CREATE INDEX "cases_status_filed_date_idx" ON "public"."cases"("status", "filed_date" DESC);

-- CreateIndex
CREATE INDEX "cases_case_type_id_filed_date_idx" ON "public"."cases"("case_type_id", "filed_date" DESC);

-- CreateIndex
CREATE INDEX "cases_filed_date_idx" ON "public"."cases"("filed_date" DESC);

-- CreateIndex
CREATE INDEX "cases_case_number_idx" ON "public"."cases"("case_number");

-- CreateIndex
CREATE INDEX "cases_status_idx" ON "public"."cases"("status");

-- CreateIndex
CREATE INDEX "cases_case_age_days_idx" ON "public"."cases"("case_age_days");

-- CreateIndex
CREATE INDEX "cases_last_activity_date_idx" ON "public"."cases"("last_activity_date" DESC);

-- CreateIndex
CREATE INDEX "case_activities_case_id_activity_date_idx" ON "public"."case_activities"("case_id", "activity_date" DESC);

-- CreateIndex
CREATE INDEX "case_activities_activity_date_idx" ON "public"."case_activities"("activity_date" DESC);

-- CreateIndex
CREATE INDEX "case_activities_primary_judge_id_activity_date_idx" ON "public"."case_activities"("primary_judge_id", "activity_date" DESC);

-- CreateIndex
CREATE INDEX "case_activities_outcome_activity_date_idx" ON "public"."case_activities"("outcome", "activity_date" DESC);

-- CreateIndex
CREATE INDEX "case_activities_activity_type_idx" ON "public"."case_activities"("activity_type");

-- CreateIndex
CREATE INDEX "case_activities_import_batch_id_idx" ON "public"."case_activities"("import_batch_id");

-- CreateIndex
CREATE INDEX "case_activities_custody_status_idx" ON "public"."case_activities"("custody_status");

-- CreateIndex
CREATE INDEX "case_judge_assignments_case_id_idx" ON "public"."case_judge_assignments"("case_id");

-- CreateIndex
CREATE INDEX "case_judge_assignments_judge_id_idx" ON "public"."case_judge_assignments"("judge_id");

-- CreateIndex
CREATE INDEX "case_judge_assignments_is_primary_idx" ON "public"."case_judge_assignments"("is_primary");

-- CreateIndex
CREATE INDEX "daily_import_batches_import_date_idx" ON "public"."daily_import_batches"("import_date" DESC);

-- CreateIndex
CREATE INDEX "daily_import_batches_status_idx" ON "public"."daily_import_batches"("status");

-- CreateIndex
CREATE INDEX "daily_import_batches_created_by_idx" ON "public"."daily_import_batches"("created_by");

-- CreateIndex
CREATE INDEX "daily_import_batches_filename_idx" ON "public"."daily_import_batches"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "public"."users"("is_active");

-- AddForeignKey
ALTER TABLE "public"."cases" ADD CONSTRAINT "cases_case_type_id_fkey" FOREIGN KEY ("case_type_id") REFERENCES "public"."case_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cases" ADD CONSTRAINT "cases_original_court_id_fkey" FOREIGN KEY ("original_court_id") REFERENCES "public"."courts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."case_activities" ADD CONSTRAINT "case_activities_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."case_activities" ADD CONSTRAINT "case_activities_primary_judge_id_fkey" FOREIGN KEY ("primary_judge_id") REFERENCES "public"."judges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."case_activities" ADD CONSTRAINT "case_activities_import_batch_id_fkey" FOREIGN KEY ("import_batch_id") REFERENCES "public"."daily_import_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."case_judge_assignments" ADD CONSTRAINT "case_judge_assignments_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."case_judge_assignments" ADD CONSTRAINT "case_judge_assignments_judge_id_fkey" FOREIGN KEY ("judge_id") REFERENCES "public"."judges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."daily_import_batches" ADD CONSTRAINT "daily_import_batches_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
