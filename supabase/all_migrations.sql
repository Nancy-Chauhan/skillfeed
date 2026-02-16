-- Enable required extensions
create extension if not exists "pgcrypto";
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
-- Newsletter delivery history
create table newsletters_sent (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  subject text not null,
  html_content text not null,
  summary_text text,
  roadmap_items jsonb,
  article_ids uuid[] not null default '{}',
  match_scores float[] not null default '{}',
  resend_email_id text,
  delivery_status text not null default 'pending'
    check (delivery_status in ('pending', 'sent', 'delivered', 'failed')),
  attempt_count int not null default 0,
  error_message text,
  created_at timestamptz not null default now()
);
-- Match articles for a user based on role overlap, level compatibility, and keyword intersection
create or replace function match_articles_for_user(p_user_id uuid)
returns table (
  id uuid,
  title text,
  summary text,
  url text,
  level article_level,
  roles user_role[],
  keywords text[],
  source_name text,
  received_at timestamptz,
  relevance_score bigint
)
language sql
stable
as $$
  with user_profile as (
    select
      u.current_roles,
      u.target_roles,
      u.current_level,
      u.target_level,
      u.extracted_keywords,
      u.extracted_skills
    from users u
    where u.id = p_user_id
  ),
  already_sent as (
    select unnest(ns.article_ids) as article_id
    from newsletters_sent ns
    where ns.user_id = p_user_id
  )
  select
    a.id,
    a.title,
    a.summary,
    a.url,
    a.level,
    a.roles,
    a.keywords,
    a.source_name,
    a.received_at,
    -- Relevance score: count of keyword overlaps between article and user profile
    coalesce(
      array_length(
        array(
          select unnest(a.keywords)
          intersect
          select unnest(up.extracted_keywords || up.extracted_skills)
        ),
        1
      ),
      0
    )::bigint as relevance_score
  from articles a
  cross join user_profile up
  where
    -- Article must have role overlap with user's current or target roles
    a.roles && (up.current_roles || up.target_roles)
    -- Article level matches user's current or target level
    and a.level in (up.current_level, up.target_level)
    -- Only articles from the last 7 days
    and a.received_at > now() - interval '7 days'
    -- Only fully processed articles
    and a.processing_status = 'completed'
    -- Exclude already-sent articles
    and a.id not in (select article_id from already_sent)
  order by relevance_score desc, a.received_at desc
  limit 15;
$$;
-- GIN indexes for fast array operations
create index idx_articles_roles on articles using gin (roles);
create index idx_articles_keywords on articles using gin (keywords);
create index idx_users_extracted_keywords on users using gin (extracted_keywords);
create index idx_users_extracted_skills on users using gin (extracted_skills);

-- B-tree indexes for common queries
create index idx_articles_received_at on articles (received_at desc);
create index idx_articles_processing_status on articles (processing_status);
create index idx_articles_level on articles (level);
create index idx_newsletters_sent_user_id on newsletters_sent (user_id, created_at desc);
create index idx_users_is_active on users (is_active) where is_active = true;
-- Enable Row-Level Security on user data tables
alter table users enable row level security;
alter table newsletters_sent enable row level security;

-- Users: can only read/update their own row
create policy "Users can read own profile"
  on users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on users for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on users for insert
  with check (auth.uid() = id);

-- Newsletters: users can only read their own newsletters
create policy "Users can read own newsletters"
  on newsletters_sent for select
  using (auth.uid() = user_id);

-- Service role (admin client) bypasses RLS automatically
-- Async ingestion queue for webhook processing
create table ingestion_jobs (
  id uuid primary key default gen_random_uuid(),
  message_id text unique not null,
  payload jsonb not null,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'completed', 'failed')),
  attempts int not null default 0,
  next_retry_at timestamptz not null default now(),
  last_error text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

-- Index for queue polling: find pending or retryable jobs
create index idx_ingestion_jobs_queue
  on ingestion_jobs (status, next_retry_at)
  where status in ('pending', 'failed');
-- Newsletter engagement events (open, click, feedback)
create table newsletter_events (
  id uuid primary key default gen_random_uuid(),
  newsletter_id uuid not null references newsletters_sent(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  article_id uuid references articles(id) on delete set null,
  event_type text not null check (event_type in ('open', 'click', 'feedback')),
  feedback_value int check (feedback_value in (1, -1) or feedback_value is null),
  created_at timestamptz not null default now()
);

-- Index for aggregation queries
create index idx_newsletter_events_newsletter on newsletter_events (newsletter_id, event_type);
create index idx_newsletter_events_user on newsletter_events (user_id, created_at desc);
