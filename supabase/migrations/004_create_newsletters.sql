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
