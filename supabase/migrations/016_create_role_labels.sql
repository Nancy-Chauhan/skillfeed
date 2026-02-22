-- Role labels reference table
-- Maps role slugs to human-readable display names

CREATE TABLE IF NOT EXISTS role_labels (
  slug text PRIMARY KEY,
  display_name text NOT NULL
);

INSERT INTO role_labels (slug, display_name) VALUES
  ('frontend',           'Frontend'),
  ('backend',            'Backend'),
  ('fullstack',          'Full-Stack'),
  ('mobile',             'Mobile'),
  ('data_engineer',      'Data Engineer'),
  ('devops',             'DevOps'),
  ('security',           'Security'),
  ('product_manager',    'Product Manager'),
  ('engineering_manager','Eng Manager'),
  ('solutions_engineer', 'Solutions Eng'),
  ('ai_engineer',        'AI Engineer'),
  ('ml_engineer',        'ML Engineer'),
  ('data_scientist',     'Data Scientist'),
  ('mlops',              'MLOps'),
  ('ai_product_manager', 'AI Product Mgr'),
  ('general',            'General')
ON CONFLICT (slug) DO NOTHING;
