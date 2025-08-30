-- Drop existing courts table and recreate with new enum values
-- This migration implements Option B (Fresh Start) approach

-- Drop foreign key constraints that reference courts
ALTER TABLE cases DROP CONSTRAINT IF EXISTS cases_original_court_id_fkey;

-- Drop the courts table
DROP TABLE IF EXISTS courts;

-- Recreate the CourtType enum with new values
DROP TYPE IF EXISTS "CourtType";
CREATE TYPE "CourtType" AS ENUM('SC', 'ELC', 'ELRC', 'KC', 'SCC', 'COA', 'MC', 'HC', 'TC');

-- Recreate the courts table with new schema
CREATE TABLE courts (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    court_name VARCHAR(255) NOT NULL,
    court_code VARCHAR(50) NOT NULL UNIQUE,
    court_type "CourtType" NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Recreate indexes
CREATE INDEX courts_court_type_is_active_idx ON courts(court_type, is_active);
CREATE INDEX courts_court_name_idx ON courts(court_name);
CREATE INDEX courts_court_code_idx ON courts(court_code);

-- Recreate foreign key constraint
ALTER TABLE cases ADD CONSTRAINT cases_original_court_id_fkey
    FOREIGN KEY (original_court_id) REFERENCES courts(id) ON DELETE SET NULL;

-- Insert sample court data with new court types
INSERT INTO courts (id, court_name, court_code, court_type, is_active, created_at, updated_at) VALUES
('court-sc-001', 'Supreme Court of Kenya', 'SCK', 'SC', true, NOW(), NOW()),
('court-hc-001', 'High Court of Kenya', 'HCK', 'HC', true, NOW(), NOW()),
('court-mc-001', 'Milimani Commercial Court', 'MCC', 'MC', true, NOW(), NOW()),
('court-mc-002', 'Kibera Law Courts', 'KLC', 'MC', true, NOW(), NOW()),
('court-elrc-001', 'Employment and Labour Relations Court', 'ELRC', 'ELRC', true, NOW(), NOW()),
('court-elc-001', 'Environment and Land Court', 'ELC', 'ELC', true, NOW(), NOW()),
('court-coa-001', 'Court of Appeal', 'COA', 'COA', true, NOW(), NOW()),
('court-kc-001', 'Kadhis Court', 'KDC', 'KC', true, NOW(), NOW()),
('court-scc-001', 'Small Claims Court', 'SCC', 'SCC', true, NOW(), NOW()),
('court-tc-001', 'Tax Court', 'TC', 'TC', true, NOW(), NOW());