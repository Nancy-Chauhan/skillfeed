-- Article level enum
create type article_level as enum ('beginner', 'intermediate', 'senior');

-- Role enum (shared by articles and users)
create type user_role as enum ('backend', 'devops', 'security', 'solutions_engineer', 'ai_engineer', 'general');

-- Articles table
create table articles (
  id uuid primary key default gen_random_uuid(),
  source_email text not null,
  source_name text,
  original_subject text,
  message_id text unique not null,
  title text not null,
  summary text,
  content text,
  url text,
  level article_level not null default 'intermediate',
  roles user_role[] not null default '{}',
  keywords text[] not null default '{}',
  processing_status text not null default 'pending'
    check (processing_status in ('pending', 'processing', 'completed', 'failed')),
  received_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
