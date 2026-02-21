-- Add new role values to the user_role enum for expanded career transition coverage
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'frontend';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'fullstack';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'mobile';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'data_engineer';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'product_manager';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'engineering_manager';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'ml_engineer';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'data_scientist';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'mlops';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'ai_product_manager';
