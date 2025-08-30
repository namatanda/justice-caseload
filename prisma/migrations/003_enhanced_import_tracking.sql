-- Enhanced Import Tracking Schema
-- Extends the existing import system with detailed progress tracking and error handling

-- Add additional columns to daily_import_batch table for enhanced tracking
ALTER TABLE daily_import_batch ADD COLUMN IF NOT EXISTS
  estimated_completion_time TIMESTAMP,
  processing_start_time TIMESTAMP,
  user_config JSONB DEFAULT '{}',
  validation_warnings JSONB DEFAULT '[]';

-- Create import_progress table for real-time progress tracking
CREATE TABLE IF NOT EXISTS import_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES daily_import_batch(id) ON DELETE CASCADE,
  progress_percentage INTEGER CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  current_step VARCHAR(100),
  message TEXT,
  records_processed INTEGER DEFAULT 0,
  total_records INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  warnings_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create detailed error logging table
CREATE TABLE IF NOT EXISTS import_error_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES daily_import_batch(id) ON DELETE CASCADE,
  row_number INTEGER,
  column_name VARCHAR(100),
  error_type VARCHAR(50),
  error_message TEXT,
  raw_value TEXT,
  suggested_fix TEXT,
  severity VARCHAR(20) DEFAULT 'ERROR' CHECK (severity IN ('ERROR', 'WARNING', 'INFO')),
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create import session tracking for user workflows
CREATE TABLE IF NOT EXISTS import_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  session_token VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  started_at TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  metadata JSONB DEFAULT '{}'
);

-- Create validation results table for pre-import validation
CREATE TABLE IF NOT EXISTS validation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  filename VARCHAR(255),
  file_checksum VARCHAR(64),
  validation_status VARCHAR(50),
  total_rows INTEGER,
  valid_rows INTEGER,
  invalid_rows INTEGER,
  errors JSONB DEFAULT '[]',
  warnings JSONB DEFAULT '[]',
  preview_data JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Create indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_import_progress_batch_id ON import_progress(batch_id);
CREATE INDEX IF NOT EXISTS idx_import_progress_updated_at ON import_progress(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_import_error_details_batch_id ON import_error_details(batch_id);
CREATE INDEX IF NOT EXISTS idx_import_error_details_severity ON import_error_details(severity);
CREATE INDEX IF NOT EXISTS idx_import_error_details_error_type ON import_error_details(error_type);

CREATE INDEX IF NOT EXISTS idx_import_sessions_user_id ON import_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_import_sessions_token ON import_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_import_sessions_status ON import_sessions(status);
CREATE INDEX IF NOT EXISTS idx_import_sessions_expires_at ON import_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_validation_results_user_id ON validation_results(user_id);
CREATE INDEX IF NOT EXISTS idx_validation_results_checksum ON validation_results(file_checksum);
CREATE INDEX IF NOT EXISTS idx_validation_results_created_at ON validation_results(created_at DESC);

-- Create trigger to automatically update import_progress.updated_at
CREATE OR REPLACE FUNCTION update_import_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_import_progress_timestamp
  BEFORE UPDATE ON import_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_import_progress_timestamp();

-- Create function to clean up expired sessions and validation results
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS void AS $$
BEGIN
  -- Clean up expired import sessions
  DELETE FROM import_sessions 
  WHERE expires_at < NOW() AND status != 'ACTIVE';
  
  -- Clean up expired validation results
  DELETE FROM validation_results 
  WHERE expires_at < NOW();
  
  -- Clean up old progress records (keep last 30 days)
  DELETE FROM import_progress 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- Clean up old error details (keep last 90 days)
  DELETE FROM import_error_details 
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON import_progress TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON import_error_details TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON import_sessions TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON validation_results TO app_user;

-- Add comments for documentation
COMMENT ON TABLE import_progress IS 'Real-time progress tracking for import operations';
COMMENT ON TABLE import_error_details IS 'Detailed error logging for import validation and processing';
COMMENT ON TABLE import_sessions IS 'User session tracking for import workflows';
COMMENT ON TABLE validation_results IS 'Pre-import validation results storage';

COMMENT ON COLUMN import_progress.progress_percentage IS 'Import completion percentage (0-100)';
COMMENT ON COLUMN import_error_details.severity IS 'Error severity level: ERROR, WARNING, or INFO';
COMMENT ON COLUMN validation_results.expires_at IS 'Automatic cleanup timestamp for validation results';