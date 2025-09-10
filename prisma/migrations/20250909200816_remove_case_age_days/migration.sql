-- Remove case_age_days column from cases table
-- Drop the column that stored pre-calculated case ages
-- Also remove the index on this column

-- DropIndex is automatically handled by Prisma when dropping the column
-- Drop the case_age_days column
ALTER TABLE "cases" DROP COLUMN "case_age_days";