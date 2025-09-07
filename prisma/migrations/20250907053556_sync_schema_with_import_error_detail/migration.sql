-- CreateEnum
CREATE TYPE "public"."error_severity" AS ENUM ('ERROR', 'WARNING', 'INFO');

-- DropEnum
DROP TYPE "public"."court_type";

-- CreateTable
CREATE TABLE "public"."import_error_details" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "errorType" VARCHAR(100) NOT NULL,
    "errorMessage" TEXT NOT NULL,
    "severity" "public"."error_severity" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "import_error_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "import_error_details_batchId_idx" ON "public"."import_error_details"("batchId");

-- CreateIndex
CREATE INDEX "import_error_details_rowNumber_idx" ON "public"."import_error_details"("rowNumber");

-- CreateIndex
CREATE INDEX "import_error_details_severity_idx" ON "public"."import_error_details"("severity");

-- AddForeignKey
ALTER TABLE "public"."import_error_details" ADD CONSTRAINT "import_error_details_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."daily_import_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
