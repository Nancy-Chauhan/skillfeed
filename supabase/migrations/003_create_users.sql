-- Users table
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  resume_text text,
  prompt_text text,
  current_roles user_role[] not null default '{}',
  target_roles user_role[] not null default '{}',
  current_level article_level not null default 'beginner',
  target_level article_level not null default 'intermediate',
  extracted_keywords text[] not null default '{}',
  extracted_skills text[] not null default '{}',
  learning_goals text[] not null default '{}',
  timezone text not null default 'UTC',
  is_active boolean not null default true,
  unsubscribed_at timestamptz,
  last_newsletter_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
