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
