-- Add new columns to existing tables

-- Add new columns to courts table
ALTER TABLE courts ADD COLUMN IF NOT EXISTS original_code VARCHAR(50);
ALTER TABLE courts ADD COLUMN IF NOT EXISTS original_number VARCHAR(50);
ALTER TABLE courts ADD COLUMN IF NOT EXISTS original_year INTEGER;

-- Add new columns to cases table
ALTER TABLE cases ADD COLUMN IF NOT EXISTS caseid_type VARCHAR(20);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS caseid_no VARCHAR(50);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS male_applicant INTEGER DEFAULT 0;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS female_applicant INTEGER DEFAULT 0;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS organization_applicant INTEGER DEFAULT 0;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS male_defendant INTEGER DEFAULT 0;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS female_defendant INTEGER DEFAULT 0;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS organization_defendant INTEGER DEFAULT 0;

-- Add new columns to case_activities table
ALTER TABLE case_activities ADD COLUMN IF NOT EXISTS judge_1 VARCHAR(255);
ALTER TABLE case_activities ADD COLUMN IF NOT EXISTS judge_2 VARCHAR(255);
ALTER TABLE case_activities ADD COLUMN IF NOT EXISTS judge_3 VARCHAR(255);
ALTER TABLE case_activities ADD COLUMN IF NOT EXISTS judge_4 VARCHAR(255);
ALTER TABLE case_activities ADD COLUMN IF NOT EXISTS judge_5 VARCHAR(255);
ALTER TABLE case_activities ADD COLUMN IF NOT EXISTS judge_6 VARCHAR(255);
ALTER TABLE case_activities ADD COLUMN IF NOT EXISTS judge_7 VARCHAR(255);
ALTER TABLE case_activities ADD COLUMN IF NOT EXISTS coming_for VARCHAR(100);
ALTER TABLE case_activities ADD COLUMN IF NOT EXISTS legal_rep_string VARCHAR(10);
ALTER TABLE case_activities ADD COLUMN IF NOT EXISTS custody_numeric INTEGER;
ALTER TABLE case_activities ADD COLUMN IF NOT EXISTS other_details TEXT;

-- Add indexes for new CSV-specific fields in cases table
CREATE INDEX IF NOT EXISTS cases_male_applicant_idx ON cases(male_applicant);
CREATE INDEX IF NOT EXISTS cases_female_applicant_idx ON cases(female_applicant);
CREATE INDEX IF NOT EXISTS cases_organization_applicant_idx ON cases(organization_applicant);
CREATE INDEX IF NOT EXISTS cases_male_defendant_idx ON cases(male_defendant);
CREATE INDEX IF NOT EXISTS cases_female_defendant_idx ON cases(female_defendant);
CREATE INDEX IF NOT EXISTS cases_organization_defendant_idx ON cases(organization_defendant);

-- Add indexes for new judge fields in case_activities table
CREATE INDEX IF NOT EXISTS case_activities_judge2_idx ON case_activities(judge_2);
CREATE INDEX IF NOT EXISTS case_activities_judge3_idx ON case_activities(judge_3);
CREATE INDEX IF NOT EXISTS case_activities_judge4_idx ON case_activities(judge_4);
CREATE INDEX IF NOT EXISTS case_activities_judge5_idx ON case_activities(judge_5);
CREATE INDEX IF NOT EXISTS case_activities_judge6_idx ON case_activities(judge_6);
CREATE INDEX IF NOT EXISTS case_activities_judge7_idx ON case_activities(judge_7);

-- Add indexes for new CSV-specific fields in case_activities table
CREATE INDEX IF NOT EXISTS case_activities_coming_for_idx ON case_activities(coming_for);
CREATE INDEX IF NOT EXISTS case_activities_legal_rep_string_idx ON case_activities(legal_rep_string);
CREATE INDEX IF NOT EXISTS case_activities_custody_numeric_idx ON case_activities(custody_numeric);