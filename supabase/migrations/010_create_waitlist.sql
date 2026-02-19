-- Waitlist table for gating early access
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  constraint waitlist_email_unique unique (email)
);

-- RLS
alter table public.waitlist enable row level security;

-- No public read/write — only service role can access
