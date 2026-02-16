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
