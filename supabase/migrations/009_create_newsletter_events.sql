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
