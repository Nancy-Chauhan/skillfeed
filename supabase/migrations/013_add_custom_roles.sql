-- Add custom role columns for user-defined roles not in the enum
ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_current_roles text[] NOT NULL DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_target_roles text[] NOT NULL DEFAULT '{}';
