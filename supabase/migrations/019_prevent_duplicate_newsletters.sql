-- Prevent duplicate newsletters for the same user on the same calendar day (UTC).
-- Acts as a DB-level safety net alongside the app-level optimistic lock.
-- Uses explicit timezone() cast since timestamptz::date is not immutable.
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletters_sent_user_day
  ON newsletters_sent (user_id, (timezone('UTC', created_at)::date));
