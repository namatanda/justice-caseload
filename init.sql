-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Seed initial courts data with valid court_type enum values to prevent migration validation errors
INSERT INTO public.courts (id, court_name, court_code, court_type, is_active, created_at, updated_at) VALUES
(gen_random_uuid(), 'Supreme Court', 'SC001', 'SC', true, now(), now()),
(gen_random_uuid(), 'Employment and Labour Court', 'ELC001', 'ELC', true, now(), now()),
(gen_random_uuid(), 'Employment and Labour Relations Court', 'ELRC001', 'ELRC', true, now(), now()),
(gen_random_uuid(), 'Kadhis Court', 'KC001', 'KC', true, now(), now()),
(gen_random_uuid(), 'Supreme Court of Appeal', 'SCC001', 'SCC', true, now(), now()),
(gen_random_uuid(), 'Court of Appeal', 'COA001', 'COA', true, now(), now()),
(gen_random_uuid(), 'Magistrate Court', 'MC001', 'MC', true, now(), now()),
(gen_random_uuid(), 'High Court', 'HC001', 'HC', true, now(), now()),
(gen_random_uuid(), 'Tribunal Court', 'TC001', 'TC', true, now(), now())
ON CONFLICT (court_code) DO NOTHING;